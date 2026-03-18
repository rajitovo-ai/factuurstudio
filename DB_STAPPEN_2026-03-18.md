# Database Stappen - Wijzigingen van 2026-03-18

Dit document bevat exact wat je nu moet doen om je Supabase database goed te zetten voor de wijzigingen die vandaag zijn toegevoegd.

## Doel van vandaag

Je app gebruikt nu extra databasevelden voor:

- klantenprofielen (extra contact- en betaalgegevens)
- factuur klant-snapshot velden
- optie: geen vervaldatum (`has_due_date`)
- optionele factuurbeschrijving (`invoice_description`)

## Migratiebestanden (vandaag toegevoegd)

Deze bestanden moeten in deze volgorde uitgevoerd zijn:

1. `supabase/migrations/005_customer_profiles_fields.sql`
2. `supabase/migrations/006_app_invoices_customer_snapshot.sql`
3. `supabase/migrations/007_app_invoices_has_due_date.sql`
4. `supabase/migrations/008_app_invoices_description.sql`

## Optie A - Aanbevolen (Supabase CLI)

Gebruik deze optie als je project al gekoppeld is aan je Supabase project.

### 1) Controleer of je in de juiste map staat

```bash
cd /home/ubuntu/Documents/vscode/factuurgenerator
```

### 2) Check of Supabase CLI beschikbaar is

```bash
supabase --version
```

### 3) Login (als nodig)

```bash
supabase login
```

### 4) Link met je project (als nog niet gedaan)

```bash
supabase link --project-ref <JOUW_PROJECT_REF>
```

`<JOUW_PROJECT_REF>` vind je in Supabase onder `Settings > General`.

### 5) Push migraties naar remote database

```bash
supabase db push
```

Als dit succesvol is, zijn alle nieuwe migraties toegepast.

## Optie B - Via Supabase Dashboard SQL Editor

Gebruik deze optie als je geen CLI wilt gebruiken.

### 1) Open Supabase dashboard

- Ga naar je project
- Open `SQL Editor`

### 2) Voer de SQL uit in deze exacte volgorde

Plak en run achtereenvolgens de inhoud van:

1. `supabase/migrations/005_customer_profiles_fields.sql`
2. `supabase/migrations/006_app_invoices_customer_snapshot.sql`
3. `supabase/migrations/007_app_invoices_has_due_date.sql`
4. `supabase/migrations/008_app_invoices_description.sql`

## Verificatie (belangrijk)

Run deze query in SQL Editor om te bevestigen dat de kolommen bestaan.

```sql
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'customers'
  and column_name in ('phone', 'iban', 'payment_term_days', 'notes', 'updated_at')
order by column_name;

select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'app_invoices'
  and column_name in (
    'client_contact_name',
    'client_phone',
    'client_address',
    'client_postal_code',
    'client_city',
    'client_country',
    'client_kvk_number',
    'client_btw_number',
    'client_iban',
    'client_payment_term_days',
    'client_notes',
    'has_due_date',
    'invoice_description'
  )
order by column_name;
```

## Functionele check in app

Na migraties:

1. Open app en log in.
2. Maak een nieuwe factuur.
3. Vul klantprofielvelden in (KvK/BTW/adres/contact) en sla klant op.
4. Zet eventueel `Geen vervaldatum` aan.
5. Vul `Factuurbeschrijving (optioneel)` in.
6. Sla factuur op.
7. Open factuur, download PDF, controleer dat beschrijving en klantdetails zichtbaar zijn.

## Veelvoorkomende fout

Als opslaan mislukt met database/kolom-fout, dan is meestal migratie `007` of `008` nog niet toegepast.

## Wat ik voortaan voor je doe

Na database-gerelateerde wijzigingen maak ik standaard een duidelijke `.md` met:

- welke migraties nieuw zijn
- exacte uitvoerstappen
- verificatiequery
- korte functionele testchecklist
