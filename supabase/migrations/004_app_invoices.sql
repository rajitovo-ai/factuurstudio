create table if not exists public.app_invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  invoice_number text not null,
  company_name text not null,
  logo_data_url text,
  client_name text not null,
  client_email text not null default '',
  issue_date date not null,
  due_date date not null,
  currency_code text not null default 'EUR',
  pricing_mode text not null check (pricing_mode in ('excl', 'incl')),
  subtotal numeric(12,2) not null default 0,
  vat_total numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status text not null default 'concept' check (status in ('concept', 'verzonden', 'betaald', 'vervallen')),
  lines jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, invoice_number)
);

create index if not exists idx_app_invoices_user_id_created_at
  on public.app_invoices (user_id, created_at desc);

alter table public.app_invoices enable row level security;

create policy "app_invoices_own_access"
  on public.app_invoices
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
