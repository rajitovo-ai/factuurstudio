alter table public.customers
  add column if not exists phone text,
  add column if not exists iban text,
  add column if not exists payment_term_days int not null default 14,
  add column if not exists notes text,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_customers_user_id_created_at
  on public.customers (user_id, created_at desc);
