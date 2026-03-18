# DB stappen: import marker op facturen

## Doel
Een duurzaam kenmerk opslaan of een factuur geimporteerd is (`is_imported`), zodat:
- geimporteerde facturen en platform-facturen samen meetellen in dashboard-berekeningen;
- geimporteerde facturen subtiel gemarkeerd kunnen worden in de facturenlijst.

## Nieuwe migratie
- `supabase/migrations/009_app_invoices_import_marker.sql`

Inhoud:
- voegt kolom `is_imported boolean not null default false` toe aan `public.app_invoices`.

## Uitvoeren
1. Koppel project (indien nodig):
```bash
supabase link --project-ref qagghakkedtytfyxexzc
```

2. Push migraties:
```bash
supabase db push
```

## Verificatie SQL
Controleer of kolom aanwezig is:
```sql
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'app_invoices'
  and column_name = 'is_imported';
```

Verwacht:
- `column_name`: `is_imported`
- `data_type`: `boolean`
- `is_nullable`: `NO`
- `column_default`: `false`

## Functionele check
1. Importeer een PDF-factuur met "Importeer factuurdata" aangevinkt.
2. Open `Facturen` en controleer subtiele badge `IMP` bij het factuurnummer.
3. Maak een reguliere factuur via `Nieuwe factuur` en controleer dat deze geen `IMP` badge heeft.
4. Controleer dashboard: bedragen tellen beide factuurtypes samen op.