# Offertes snel testen

## Doel
In 10 minuten valideren dat de flow werkt:

`offerte -> verzonden -> goedgekeurd -> conceptfactuur -> betaald`

## 1. Database migraties
Voer deze migraties uit op je Supabase project:

1. `supabase/migrations/016_app_quotes.sql`
2. `supabase/migrations/017_quote_approval_rpc.sql`

Als je linked project gebruikt:

```bash
supabase db push --linked --include-all
```

## 2. App starten
```bash
npm install
npm run dev
```

## 3. Snelle checks in code
```bash
npm run test:quote
npm run build
```

## 4. Handmatige flow test in UI
1. Login met testaccount.
2. Ga naar `/offertes`.
3. Maak een nieuwe offerte via `Nieuwe offerte`.
4. Zet status op `Verzenden`.
5. Klik `Goedkeuren -> Factuur`.
6. Controleer in `/facturen` dat er een nieuwe `concept` factuur staat.
7. Zet die factuur op `Betaald`.

## 5. Verwachte resultaten
1. Na goedkeuren krijg je groene succesmelding op offertepagina.
2. Bij dubbele klik ontstaat geen dubbele factuur.
3. Bij ontbrekende RPC-migratie zie je duidelijke foutmelding met actie.
4. Offerte krijgt status `goedgekeurd` en bevat `converted_invoice_id`.

## 6. SQL verificatie (optioneel)
```sql
select quote_number, status, converted_invoice_id
from public.app_quotes
order by created_at desc
limit 5;

select invoice_number, status, created_at
from public.app_invoices
order by created_at desc
limit 5;
```
