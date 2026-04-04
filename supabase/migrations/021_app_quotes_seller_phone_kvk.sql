alter table if exists public.app_quotes
  add column if not exists seller_phone text not null default '',
  add column if not exists seller_kvk text not null default '';
