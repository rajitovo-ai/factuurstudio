alter table public.app_invoices
add column if not exists is_imported boolean not null default false;

comment on column public.app_invoices.is_imported is
'True wanneer de factuur is geimporteerd uit een externe PDF, false voor platform-aangemaakte facturen.';