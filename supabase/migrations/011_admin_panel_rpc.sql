create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.admin_users (email)
values ('rajitovo@gmail.com')
on conflict (email) do nothing;

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  v_email := lower(coalesce(auth.jwt() ->> 'email', ''));

  if v_email = '' then
    return false;
  end if;

  return exists (
    select 1
    from public.admin_users au
    where lower(au.email) = v_email
  );
end;
$$;

grant execute on function public.is_admin() to authenticated;

create or replace function public.admin_dashboard_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_users bigint;
  v_total_invoices bigint;
  v_paid_invoices bigint;
  v_open_invoices bigint;
  v_paid_revenue numeric(12,2);
  v_free_users bigint;
  v_pro_users bigint;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  select count(*) into v_total_users from public.profiles;
  select count(*) into v_total_invoices from public.app_invoices;
  select count(*) into v_paid_invoices from public.app_invoices where status = 'betaald';
  select count(*) into v_open_invoices from public.app_invoices where status in ('verzonden', 'vervallen');
  select coalesce(sum(total), 0)::numeric(12,2)
  into v_paid_revenue
  from public.app_invoices
  where status = 'betaald';

  select count(*) into v_free_users from public.subscriptions where plan = 'free';
  select count(*) into v_pro_users from public.subscriptions where plan = 'pro';

  return jsonb_build_object(
    'totalUsers', v_total_users,
    'totalInvoices', v_total_invoices,
    'paidInvoices', v_paid_invoices,
    'openInvoices', v_open_invoices,
    'paidRevenue', v_paid_revenue,
    'freeUsers', v_free_users,
    'proUsers', v_pro_users
  );
end;
$$;

grant execute on function public.admin_dashboard_stats() to authenticated;

create or replace function public.admin_recent_users(p_limit integer default 20)
returns table (
  user_id uuid,
  email text,
  created_at timestamptz,
  plan text,
  invoices bigint
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
    p.id as user_id,
    u.email::text,
    u.created_at,
    coalesce(s.plan, 'free') as plan,
    count(ai.id)::bigint as invoices
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.subscriptions s on s.user_id = p.id
  left join public.app_invoices ai on ai.user_id = p.id
  group by p.id, u.email, u.created_at, s.plan
  order by u.created_at desc
  limit greatest(1, least(coalesce(p_limit, 20), 100));
end;
$$;

grant execute on function public.admin_recent_users(integer) to authenticated;

create or replace function public.admin_set_user_plan(p_user_id uuid, p_plan text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  if p_plan not in ('free', 'pro') then
    raise exception 'invalid plan';
  end if;

  insert into public.subscriptions (user_id, plan)
  values (p_user_id, p_plan)
  on conflict (user_id) do update set plan = excluded.plan;
end;
$$;

grant execute on function public.admin_set_user_plan(uuid, text) to authenticated;

create or replace function public.admin_list_admin_users()
returns table (
  email text,
  created_at timestamptz
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
  select au.email, au.created_at
  from public.admin_users au
  order by au.created_at asc;
end;
$$;

grant execute on function public.admin_list_admin_users() to authenticated;

create or replace function public.admin_add_admin_email(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  insert into public.admin_users (email)
  values (lower(trim(p_email)))
  on conflict (email) do nothing;
end;
$$;

grant execute on function public.admin_add_admin_email(text) to authenticated;

create or replace function public.admin_remove_admin_email(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  select count(*) into v_count from public.admin_users;
  if v_count <= 1 then
    raise exception 'cannot remove last admin';
  end if;

  delete from public.admin_users
  where lower(email) = lower(trim(p_email));
end;
$$;

grant execute on function public.admin_remove_admin_email(text) to authenticated;

create or replace function public.admin_upsert_reward_settings(
  p_threshold integer,
  p_reward_type text,
  p_reward_value numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  if p_reward_type not in ('pro_month', 'discount_percent', 'credit_eur') then
    raise exception 'invalid reward type';
  end if;

  insert into public.referral_reward_settings (id, threshold, reward_type, reward_value, updated_at)
  values (true, greatest(1, p_threshold), p_reward_type, greatest(0, p_reward_value), now())
  on conflict (id)
  do update set
    threshold = excluded.threshold,
    reward_type = excluded.reward_type,
    reward_value = excluded.reward_value,
    updated_at = now();
end;
$$;

grant execute on function public.admin_upsert_reward_settings(integer, text, numeric) to authenticated;
