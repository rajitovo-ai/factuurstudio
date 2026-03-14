-- SmartInvoice initial schema for phase 2

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text,
  address text,
  postal_code text,
  city text,
  country text default 'NL',
  kvk_number text,
  btw_number text,
  iban text,
  phone text,
  logo_url text,
  theme text default 'light',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  email text,
  company_name text,
  address text,
  postal_code text,
  city text,
  country text default 'NL',
  kvk_number text,
  btw_number text,
  created_at timestamptz not null default now()
);

create type public.invoice_status as enum ('openstaand', 'betaald', 'vervallen');

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  invoice_number text not null,
  status public.invoice_status not null default 'openstaand',
  issue_date date not null,
  due_date date not null,
  subtotal numeric(12,2) not null default 0,
  total_btw numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, invoice_number)
);

create table if not exists public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  btw_percentage int not null check (btw_percentage in (0, 9, 21)),
  line_total numeric(12,2) not null default 0,
  btw_amount numeric(12,2) not null default 0,
  sort_order int not null default 0
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  invoices_this_month int not null default 0,
  period_start date not null default current_date,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_lines enable row level security;
alter table public.subscriptions enable row level security;

create policy "profile_own_access"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "customers_own_access"
  on public.customers
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "invoices_own_access"
  on public.invoices
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "invoice_lines_own_access"
  on public.invoice_lines
  for all
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_id and i.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_id and i.user_id = auth.uid()
    )
  );

create policy "subscriptions_own_access"
  on public.subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
