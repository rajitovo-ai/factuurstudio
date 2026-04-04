alter table if exists public.app_invoices
  add column if not exists payment_instructions text not null default '';
