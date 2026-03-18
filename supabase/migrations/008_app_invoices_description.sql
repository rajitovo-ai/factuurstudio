alter table public.app_invoices
  add column if not exists invoice_description text not null default '';
