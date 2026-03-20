create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  subject text not null,
  message text not null,
  page_context text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  admin_response text,
  responded_by_email text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_support_tickets_user_id on public.support_tickets(user_id);
create index if not exists idx_support_tickets_status_created on public.support_tickets(status, created_at desc);

create or replace function public.touch_support_tickets_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at
before update on public.support_tickets
for each row
execute function public.touch_support_tickets_updated_at();

alter table public.support_tickets enable row level security;

drop policy if exists "support_tickets_select_own" on public.support_tickets;
create policy "support_tickets_select_own"
on public.support_tickets
for select
using (auth.uid() = user_id);

drop policy if exists "support_tickets_insert_own" on public.support_tickets;
create policy "support_tickets_insert_own"
on public.support_tickets
for insert
with check (auth.uid() = user_id);

drop policy if exists "support_tickets_update_admin_only" on public.support_tickets;
create policy "support_tickets_update_admin_only"
on public.support_tickets
for update
using (public.is_admin())
with check (public.is_admin());

create or replace function public.create_support_ticket(
  p_subject text,
  p_message text,
  p_page_context text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_user_email text;
  v_subject text;
  v_message text;
  v_ticket_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'unauthenticated';
  end if;

  v_user_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  if v_user_email = '' then
    raise exception 'email missing';
  end if;

  v_subject := trim(coalesce(p_subject, ''));
  v_message := trim(coalesce(p_message, ''));

  if length(v_subject) < 3 then
    raise exception 'subject too short';
  end if;

  if length(v_message) < 10 then
    raise exception 'message too short';
  end if;

  insert into public.support_tickets (
    user_id,
    user_email,
    subject,
    message,
    page_context,
    status
  )
  values (
    v_user_id,
    v_user_email,
    v_subject,
    v_message,
    nullif(trim(coalesce(p_page_context, '')), ''),
    'open'
  )
  returning id into v_ticket_id;

  return v_ticket_id;
end;
$$;

grant execute on function public.create_support_ticket(text, text, text) to authenticated;

create or replace function public.admin_list_support_tickets(
  p_limit integer default 100,
  p_status text default null
)
returns table (
  id uuid,
  user_id uuid,
  user_email text,
  subject text,
  message text,
  page_context text,
  status text,
  admin_response text,
  responded_by_email text,
  responded_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  return query
  select
    st.id,
    st.user_id,
    st.user_email,
    st.subject,
    st.message,
    st.page_context,
    st.status,
    st.admin_response,
    st.responded_by_email,
    st.responded_at,
    st.created_at,
    st.updated_at
  from public.support_tickets st
  where p_status is null or st.status = p_status
  order by st.created_at desc
  limit greatest(1, least(coalesce(p_limit, 100), 500));
end;
$$;

grant execute on function public.admin_list_support_tickets(integer, text) to authenticated;

create or replace function public.admin_reply_support_ticket(
  p_ticket_id uuid,
  p_status text,
  p_admin_response text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_email text;
  v_status text;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  v_status := trim(coalesce(p_status, ''));
  if v_status not in ('open', 'in_progress', 'resolved') then
    raise exception 'invalid status';
  end if;

  v_admin_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));

  update public.support_tickets
  set
    status = v_status,
    admin_response = nullif(trim(coalesce(p_admin_response, '')), ''),
    responded_by_email = case when nullif(trim(coalesce(p_admin_response, '')), '') is null then responded_by_email else v_admin_email end,
    responded_at = case when nullif(trim(coalesce(p_admin_response, '')), '') is null then responded_at else now() end,
    updated_at = now()
  where id = p_ticket_id;

  if not found then
    raise exception 'ticket not found';
  end if;
end;
$$;

grant execute on function public.admin_reply_support_ticket(uuid, text, text) to authenticated;
