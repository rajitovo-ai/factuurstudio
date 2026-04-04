alter table if exists public.app_invoices
  add column if not exists seller_name text not null default '',
  add column if not exists seller_email text not null default '',
  add column if not exists seller_iban text not null default '';

create index if not exists idx_app_invoices_user_created_at
  on public.app_invoices (user_id, created_at desc);
