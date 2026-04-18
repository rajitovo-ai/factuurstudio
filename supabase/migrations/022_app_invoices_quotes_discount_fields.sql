alter table if exists public.app_invoices
  add column if not exists discount_description text not null default '',
  add column if not exists discount_amount numeric(12,2) not null default 0;

alter table if exists public.app_quotes
  add column if not exists discount_description text not null default '',
  add column if not exists discount_amount numeric(12,2) not null default 0;
