alter table public.app_invoices
  add column if not exists has_due_date boolean not null default true;
