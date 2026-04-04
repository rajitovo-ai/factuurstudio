# DB stappen: offerteflow met automatische factuurconversie

Datum: 2026-04-02

## Doel
Nieuwe tabel `app_quotes` toevoegen zodat offertes los van facturen worden opgeslagen, met statusflow en automatische koppeling naar aangemaakte factuur bij goedkeuring.

## Migratie
1. Voer migraties uit in volgorde:
  - `supabase/migrations/016_app_quotes.sql`
  - `supabase/migrations/017_quote_approval_rpc.sql`
2. Controleer dat tabel en policy bestaan.
3. Controleer dat RPC-functie bestaat en uitvoerrechten heeft.

## Verificatie SQL
```sql
select to_regclass('public.app_quotes') as quote_table;

select policyname
from pg_policies
where schemaname = 'public'
  and tablename = 'app_quotes';

select indexname
from pg_indexes
where schemaname = 'public'
  and tablename = 'app_quotes'
order by indexname;

select proname
from pg_proc
where pronamespace = 'public'::regnamespace
  and proname = 'approve_quote_to_invoice';

select routine_name, grantee
from information_schema.role_routine_grants
where specific_schema = 'public'
  and routine_name = 'approve_quote_to_invoice';
```

## Handmatige testchecklist
1. Nieuwe offerte aanmaken als ingelogde gebruiker.
2. Offerte status wijzigen van `concept` naar `verzonden`.
3. Offerte goedkeuren en verifiëren dat exact 1 conceptfactuur wordt aangemaakt.
4. Controleren dat `converted_invoice_id` op de offerte gevuld is.
5. Verifiëren dat afgewezen/vervallen offertes niet naar factuur converteren.
6. Verifiëren dat RLS werkt (geen cross-user toegang).

## Rollback
```sql
drop table if exists public.app_quotes cascade;
```
