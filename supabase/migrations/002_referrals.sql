create table if not exists public.referral_codes (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_user_id uuid not null unique references public.profiles(id) on delete cascade,
  referred_email text not null,
  code text not null,
  status text not null default 'converted' check (status in ('converted', 'rewarded')),
  created_at timestamptz not null default now()
);

alter table public.referral_codes enable row level security;
alter table public.referrals enable row level security;

create policy "referral_codes_own_access"
  on public.referral_codes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "referrals_view_own"
  on public.referrals
  for select
  using (auth.uid() = referrer_id or auth.uid() = referred_user_id);

create policy "referrals_insert_self"
  on public.referrals
  for insert
  with check (auth.uid() = referred_user_id);

create or replace function public.apply_referral(
  p_referred_email text,
  p_referred_user_id uuid,
  p_code text,
  p_threshold integer default 3
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referrer_id uuid;
  v_total_converted integer;
begin
  select rc.user_id
  into v_referrer_id
  from public.referral_codes rc
  where upper(rc.code) = upper(trim(p_code))
  limit 1;

  if v_referrer_id is null then
    return;
  end if;

  if v_referrer_id = p_referred_user_id then
    return;
  end if;

  insert into public.referrals (referrer_id, referred_user_id, referred_email, code, status)
  values (v_referrer_id, p_referred_user_id, p_referred_email, upper(trim(p_code)), 'converted')
  on conflict (referred_user_id) do nothing;

  select count(*)::int
  into v_total_converted
  from public.referrals r
  where r.referrer_id = v_referrer_id;

  if v_total_converted > 0 and mod(v_total_converted, p_threshold) = 0 then
    with to_reward as (
      select r.id
      from public.referrals r
      where r.referrer_id = v_referrer_id
        and r.status = 'converted'
      order by r.created_at asc
      limit p_threshold
    )
    update public.referrals r
    set status = 'rewarded'
    from to_reward tr
    where r.id = tr.id;

    insert into public.subscriptions (user_id, plan)
    values (v_referrer_id, 'pro')
    on conflict (user_id) do update set plan = 'pro';
  end if;
end;
$$;

grant execute on function public.apply_referral(text, uuid, text, integer) to authenticated;
