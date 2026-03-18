# Release Notes - 2026-03-18

## Samenvatting

Deze release voegt klantenprofielen, uitgebreide klantgegevens op facturen, optionele vervaldatum en optionele factuurbeschrijving toe. Daarnaast zijn de bijbehorende Supabase migraties uitgevoerd en gedocumenteerd.

## Belangrijkste Nieuwe Functies

- Klantenprofielen beheren en hergebruiken bij facturen
- Extra klantvelden per profiel en per factuur-snapshot
- Optie: geen vervaldatum gebruiken op factuur
- Optie: factuurbeschrijving per factuur (optioneel)
- PDF uitgebreid met extra klantgegevens en beschrijving

## Gebruikersimpact

- Sneller facturen maken door klantprofielen te selecteren
- Meer controle over factuurweergave (met/zonder vervaldatum)
- Duidelijkere facturen dankzij extra toelichting per factuur

## Technische Wijzigingen

- Nieuwe pagina: `src/pages/CustomersPage.tsx`
- Nieuwe store: `src/stores/customerStore.ts`
- Uitbreiding factuurstore: `src/stores/invoiceStore.ts`
- Uitbreiding generator UI: `src/components/invoice/InvoiceGenerator.tsx`
- Uitbreiding PDF-rendering: `src/lib/pdf.ts`
- Navigatie/route updates: `src/App.tsx`, `src/components/layout/AppLayout.tsx`

## Database Migraties

Uitgevoerd:

1. `supabase/migrations/005_customer_profiles_fields.sql`
2. `supabase/migrations/006_app_invoices_customer_snapshot.sql`
3. `supabase/migrations/007_app_invoices_has_due_date.sql`
4. `supabase/migrations/008_app_invoices_description.sql`

## Operationeel

- Migratiehandleiding aanwezig in: `DB_STAPPEN_2026-03-18.md`
- Lint en build succesvol
- Push naar `main` voltooid
