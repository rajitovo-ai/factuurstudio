# FactuurStudio Roadmap

Deze roadmap is gebaseerd op de huidige codebase (React + Zustand + Supabase + jsPDF + PDF/OCR import) en op vergelijking met topklasse facturatieproducten zoals Stripe Billing, Moneybird en QuickBooks.

## Huidige Staat (Baseline)

Wat al sterk is:
- Auth flow met login/register/reset password via Supabase, plus demo fallback.
- Factuurflow: aanmaken, bewerken (concept), statusbeheer (concept/verzonden/betaald/vervallen), PDF download.
- Klantprofielen met uitgebreide velden en hergebruik in factuurgenerator.
- PDF import met parsing + OCR fallback, inclusief handmatige review en bulkimport.
- Basis dashboard met openstaand, betaald en facturen deze maand.
- Referral + planmodel (free/pro) met Supabase migraties en reward config.

Belangrijkste gaten t.o.v. marktstandaard:
- Geen echte betaalflow (Stripe/iDEAL/Mollie), geen payment links, geen webhookgedreven status updates.
- Geen e-mail verzending voor facturen/herinneringen, geen dunning automation.
- Geen recurring invoices/subscriptions voor klanten.
- Geen product/catalog management, kortingen, credits, partial payments.
- Analytics is basisniveau; geen MRR/ARR/cohorts/aging rapporten.
- Geen boekhoudexport (UBL, Exact, Twinfield, CSV workflows), beperkte BTW-rapportage.
- Security/compliance hardening ontbreekt op kritieke punten (planmutatie vanuit client, audit trail, role model).
- Nauwelijks geautomatiseerde tests/monitoring/release guardrails.

---

## Fase 1: Quick Wins & Tech Debt

Doel: stabiliteit, security en operationele betrouwbaarheid op orde brengen voor schaal.

1. Security en autorisatie hardening
- Verplaats planwijzigingen naar server-side RPC/Edge Function met admin-check.
- Blokkeer client-side self-upgrade van `free` naar `pro`.
- Introduceer rollenmodel (`owner`, `admin`, later `accountant`) i.p.v. alleen email-lijst in frontend.

2. Datamodel opschonen en migratieconsistency
- Convergeer op 1 factuurmodel (`app_invoices`) en archiveer/phase-out legacy `invoices` + `invoice_lines` pad.
- Verwijder tijdelijke compat-logic in store (legacy fallback op ontbrekende kolommen) zodra schema eenduidig is.
- Voeg expliciete indices toe voor dashboard-queries en lijstfilters (status, issue_date, due_date, customer).

3. Factuurkwaliteit en data hygiene
- Voeg validatieregels toe voor factuurnummer, BTW-nummer, IBAN en datums.
- Dedupe-strategie bij import (klant op email + naam/adres match; invoice op nummer + user).
- Introduceer soft-delete + herstelvenster voor facturen.

4. Observability en QA baseline
- Richt error tracking in (Sentry/alternatief) + centrale logging voor import/PDF failures.
- Voeg testbasis toe: unit tests voor berekeningen/import parsers + smoke E2E voor kernflow.
- Maak release checklist executable (CI lint/build/test + migration check).

5. Product UX quick wins
- Eenduidige foutmeldingen en loading states over alle stores/pagina's.
- Zoek/filter/sort op facturen en klanten (nu essentieel bij groeiende datasets).
- Lege staten en onboarding hints verbeteren voor first-time users.

Exit criteria Fase 1:
- Geen client-side privilege escalation voor planbeheer.
- E2E smoke tests groen in CI.
- Import flow stabiel met meetbare foutreductie.

---

## Fase 2: Core Features

Doel: complete MVP neerzetten die concurreert in dagelijkse workflows van zzp/mkb.

1. E-mailing en factuurverzending
- Verzenden van facturen per e-mail vanuit app (template + PDF attachment).
- Verzendstatus, resend, en eenvoudige timeline per factuur.
- Basis betalingsherinneringen (T-3, T+7, T+14) met opt-out per klant.

2. Betalen en reconciliation
- Stripe Checkout + Payment Links (en NL-optie zoals iDEAL via Stripe/Mollie).
- Unieke betaalreferentie per factuur.
- Webhooks voor automatische statusupdate (verzonden -> betaald/deels betaald).

3. Recurring facturen
- Schema's: maandelijks/kwartaal/jaarlijks, start/einddatum, auto-send.
- Retry en notificatie bij mislukte incasso/betaling.
- Overzichtspagina voor actieve schema's en volgende run.

4. CRM-light en catalog
- Producten/diensten catalog met standaard prijs, BTW en omschrijving.
- Betalingsvoorwaarden per klant, contactpersonen, notities, tags.
- Sneller factureren via presets (line templates, default teksten).

5. Financiele basisrapportages
- Omzet per maand, openstaande posten (aging 0-30/31-60/61+), betaalgedrag.
- BTW-overzicht per periode (hoog/laag/0 tarief).
- Export naar CSV voor boekhouder (invoices, klanten, betalingen).

Exit criteria Fase 2:
- Gebruiker kan vanuit de app: factuur maken -> mailen -> betaald ontvangen -> status automatisch syncen.
- Minimaal 1 recurring flow live.
- Basis rapportage en accountant-export beschikbaar.

---

## Fase 3: Advanced Features

Doel: premium SaaS niveau met sterke differentiatie en lagere operationele kosten.

1. Geavanceerde billing controls
- Partial payments, credit notes, refunds, write-offs.
- Auto-reconciliation op bank/payment events.
- Multi-currency verbeteringen met wisselkoers snapshot.

2. Workflow automation
- Regels: "als factuur > X dagen open, dan reminder Y".
- Klantspecifieke dunning cadans en talen.
- Batch acties (bulk send, bulk reminders, bulk export).

3. Compliance en administratie
- UBL export/import.
- Audit trail per factuurveld (wie/wat/wanneer).
- Nummerreeks policies per boekjaar/entiteit en lock op afgesloten periodes.

4. Team en collaboration
- Multi-user workspaces met rechten per rol.
- Interne comments en approval flow voor grote facturen.
- Accountant toegang met read/export rechten.

5. Advanced analytics
- MRR/ARR (voor subscription klanten), forecast op expected cash-in.
- Cohort analyses op betaalgedrag.
- Funnel metrics van concept -> verzonden -> betaald.

Exit criteria Fase 3:
- Platform ondersteunt teamgebruik en accountant-workflows.
- Compliance/audit features voldoen aan professionele administratieve eisen.

---

## Fase 4: Moonshots

Doel: AI-first differentiatie en strategische voorsprong.

1. AI boekhoudassistent
- Automatische categorievoorstellen per regel op basis van historisch gedrag.
- Proactieve waarschuwingen (onlogische BTW, afwijkende marges, mogelijk duplicaat).
- "Fix suggestions" met one-click correctie.

2. Conversational finance cockpit
- Vraag interface: "toon openstaande facturen > 45 dagen", "wat is cash-in forecast komende 30 dagen?".
- Auto-generated management samenvattingen per week/maand.

3. Smart collections
- AI-gestuurde reminder timing per klant op basis van historisch betaalgedrag.
- Kansscore op late betaling + voorgestelde interventie.

4. Autonomous document ops
- Zelflerende import die layout-profielen per leverancier opbouwt.
- Hogere OCR precisie door feedback-loop uit handmatige correcties.

5. Ecosysteem en platform
- Open API + webhooks marketplace.
- Integratie met boekhoudpakketten en banken als plug-and-play modules.

Exit criteria Fase 4:
- Meetbare reductie in handmatige administratie-uren.
- Hogere betaalratio en lagere DSO door voorspelling + automatisering.

---

## Prioriteitsadvies (Startvolgorde)

1. Fase 1 security + datamodel consolidatie direct.
2. Daarna Fase 2 met twee spearheads: e-mailverzending en payments.
3. Recurring + rapportages direct erachter voor echte MKB product-fit.
4. Pas daarna Fase 3/4 uitbouwen op stabiele operationele basis.
