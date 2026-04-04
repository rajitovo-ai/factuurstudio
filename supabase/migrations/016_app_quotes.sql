create table if not exists public.app_quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quote_number text not null,
  company_name text not null,
  logo_data_url text,
  client_name text not null,
  client_email text not null default '',
  client_contact_name text not null default '',
  client_phone text not null default '',
  client_address text not null default '',
  client_postal_code text not null default '',
  client_city text not null default '',
  client_country text not null default 'NL',
  client_kvk_number text not null default '',
  client_btw_number text not null default '',
  client_iban text not null default '',
  client_payment_term_days int not null default 14,
  client_notes text not null default '',
  quote_description text not null default '',
  has_due_date boolean not null default true,
  issue_date date not null,
  due_date date not null,
  expires_at date,
  currency_code text not null default 'EUR',
  pricing_mode text not null check (pricing_mode in ('excl', 'incl')),
  vat_exemption_reason text not null default '',
  subtotal numeric(12,2) not null default 0,
  vat_total numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status text not null default 'concept' check (status in ('concept', 'verzonden', 'goedgekeurd', 'afgewezen', 'vervallen')),
  lines jsonb not null default '[]'::jsonb,
  converted_invoice_id uuid references public.app_invoices(id) on delete set null,
  approved_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, quote_number)
);

create index if not exists idx_app_quotes_user_id_created_at
  on public.app_quotes (user_id, created_at desc);

create index if not exists idx_app_quotes_user_status
  on public.app_quotes (user_id, status);

create index if not exists idx_app_quotes_user_issue_date
  on public.app_quotes (user_id, issue_date desc);

create index if not exists idx_app_quotes_expires_at
  on public.app_quotes (expires_at)
  where expires_at is not null;

alter table public.app_quotes enable row level security;

create policy "app_quotes_own_access"
  on public.app_quotes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
