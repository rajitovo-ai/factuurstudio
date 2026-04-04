alter table if exists public.app_invoices
  add column if not exists seller_name text not null default '',
  add column if not exists seller_email text not null default '',
  add column if not exists seller_iban text not null default '';

alter table if exists public.app_quotes
  add column if not exists seller_name text not null default '',
  add column if not exists seller_email text not null default '',
  add column if not exists seller_iban text not null default '';

create or replace function public.approve_quote_to_invoice(p_quote_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_year text := extract(year from v_now)::text;
  v_next_sequence integer;
  v_invoice_number text;
  v_invoice_id uuid;
  v_quote public.app_quotes%rowtype;
begin
  if auth.uid() is null then
    raise exception 'unauthorized';
  end if;

  select *
  into v_quote
  from public.app_quotes
  where id = p_quote_id
    and user_id = auth.uid()
  for update;

  if not found then
    raise exception 'quote_not_found';
  end if;

  if v_quote.status not in ('verzonden', 'goedgekeurd') then
    raise exception 'quote_not_approvable';
  end if;

  if v_quote.converted_invoice_id is not null then
    update public.app_quotes
    set
      status = 'goedgekeurd',
      approved_at = coalesce(approved_at, v_now),
      updated_at = v_now
    where id = v_quote.id;

    return jsonb_build_object(
      'invoiceId', v_quote.converted_invoice_id,
      'alreadyConverted', true
    );
  end if;

  perform pg_advisory_xact_lock(hashtext(v_quote.user_id::text));

  select coalesce(max(split_part(ai.invoice_number, '-', 2)::int), 0) + 1
  into v_next_sequence
  from public.app_invoices ai
  where ai.user_id = v_quote.user_id
    and split_part(ai.invoice_number, '-', 1) = v_year
    and ai.invoice_number ~ '^[0-9]{4}-[0-9]{4}$';

  v_invoice_number := v_year || '-' || lpad(v_next_sequence::text, 4, '0');

  insert into public.app_invoices (
    user_id,
    invoice_number,
    seller_name,
    seller_email,
    seller_iban,
    company_name,
    logo_data_url,
    client_name,
    client_email,
    client_contact_name,
    client_phone,
    client_address,
    client_postal_code,
    client_city,
    client_country,
    client_kvk_number,
    client_btw_number,
    client_iban,
    client_payment_term_days,
    client_notes,
    invoice_description,
    has_due_date,
    issue_date,
    due_date,
    currency_code,
    pricing_mode,
    vat_exemption_reason,
    subtotal,
    vat_total,
    total,
    status,
    lines,
    is_imported
  ) values (
    v_quote.user_id,
    v_invoice_number,
    v_quote.seller_name,
    v_quote.seller_email,
    v_quote.seller_iban,
    v_quote.company_name,
    v_quote.logo_data_url,
    v_quote.client_name,
    v_quote.client_email,
    v_quote.client_contact_name,
    v_quote.client_phone,
    v_quote.client_address,
    v_quote.client_postal_code,
    v_quote.client_city,
    v_quote.client_country,
    v_quote.client_kvk_number,
    v_quote.client_btw_number,
    v_quote.client_iban,
    v_quote.client_payment_term_days,
    v_quote.client_notes,
    v_quote.quote_description,
    v_quote.has_due_date,
    v_now::date,
    v_quote.due_date,
    v_quote.currency_code,
    v_quote.pricing_mode,
    v_quote.vat_exemption_reason,
    v_quote.subtotal,
    v_quote.vat_total,
    v_quote.total,
    'concept',
    v_quote.lines,
    false
  )
  returning id into v_invoice_id;

  update public.app_quotes
  set
    status = 'goedgekeurd',
    approved_at = v_now,
    converted_invoice_id = v_invoice_id,
    updated_at = v_now
  where id = v_quote.id;

  return jsonb_build_object(
    'invoiceId', v_invoice_id,
    'invoiceNumber', v_invoice_number,
    'alreadyConverted', false
  );
end;
$$;

grant execute on function public.approve_quote_to_invoice(uuid) to authenticated;
