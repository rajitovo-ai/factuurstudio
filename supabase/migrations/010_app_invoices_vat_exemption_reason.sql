alter table public.app_invoices
  add column if not exists vat_exemption_reason text not null default '';
