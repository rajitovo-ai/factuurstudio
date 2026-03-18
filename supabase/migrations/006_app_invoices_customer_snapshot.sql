alter table public.app_invoices
  add column if not exists client_contact_name text not null default '',
  add column if not exists client_phone text not null default '',
  add column if not exists client_address text not null default '',
  add column if not exists client_postal_code text not null default '',
  add column if not exists client_city text not null default '',
  add column if not exists client_country text not null default 'NL',
  add column if not exists client_kvk_number text not null default '',
  add column if not exists client_btw_number text not null default '',
  add column if not exists client_iban text not null default '',
  add column if not exists client_payment_term_days int not null default 14,
  add column if not exists client_notes text not null default '';
