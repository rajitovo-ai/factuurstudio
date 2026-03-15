create table if not exists public.referral_reward_settings (
  id boolean primary key default true check (id = true),
  threshold integer not null default 3 check (threshold > 0),
  reward_type text not null default 'pro_month' check (reward_type in ('pro_month', 'discount_percent', 'credit_eur')),
  reward_value numeric(12,2) not null default 1,
  updated_at timestamptz not null default now()
);

insert into public.referral_reward_settings (id, threshold, reward_type, reward_value)
values (true, 3, 'pro_month', 1)
on conflict (id) do nothing;

create table if not exists public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reward_type text not null check (reward_type in ('pro_month', 'discount_percent', 'credit_eur')),
  reward_value numeric(12,2) not null,
  source_referrals integer not null,
  status text not null default 'granted' check (status in ('granted', 'redeemed')),
  created_at timestamptz not null default now()
);

alter table public.referral_reward_settings enable row level security;
alter table public.referral_rewards enable row level security;

create policy "referral_reward_settings_read"
  on public.referral_reward_settings
  for select
  using (true);

create policy "referral_rewards_own_read"
  on public.referral_rewards
  for select
  using (auth.uid() = user_id);

create or replace function public.apply_referral(
  p_referred_email text,
  p_referred_user_id uuid,
  p_code text,
  p_threshold integer default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referrer_id uuid;
  v_total_converted integer;
  v_threshold integer := 3;
  v_reward_type text := 'pro_month';
  v_reward_value numeric := 1;
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

  select rrs.threshold, rrs.reward_type, rrs.reward_value
  into v_threshold, v_reward_type, v_reward_value
  from public.referral_reward_settings rrs
  where rrs.id = true;

  if p_threshold is not null and p_threshold > 0 then
    v_threshold := p_threshold;
  end if;

  insert into public.referrals (referrer_id, referred_user_id, referred_email, code, status)
  values (v_referrer_id, p_referred_user_id, p_referred_email, upper(trim(p_code)), 'converted')
  on conflict (referred_user_id) do nothing;

  select count(*)::int
  into v_total_converted
  from public.referrals r
  where r.referrer_id = v_referrer_id;

  if v_total_converted > 0 and mod(v_total_converted, v_threshold) = 0 then
    with to_reward as (
      select r.id
      from public.referrals r
      where r.referrer_id = v_referrer_id
        and r.status = 'converted'
      order by r.created_at asc
      limit v_threshold
    )
    update public.referrals r
    set status = 'rewarded'
    from to_reward tr
    where r.id = tr.id;

    insert into public.referral_rewards (user_id, reward_type, reward_value, source_referrals)
    values (v_referrer_id, v_reward_type, v_reward_value, v_threshold);

    if v_reward_type = 'pro_month' then
      insert into public.subscriptions (user_id, plan)
      values (v_referrer_id, 'pro')
      on conflict (user_id) do update set plan = 'pro';
    end if;
  end if;
end;
$$;

grant execute on function public.apply_referral(text, uuid, text, integer) to authenticated;
