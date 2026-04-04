# Release Notes — v0.5.0

Release date: 2026-04-04
Branch: main

## Summary
This release introduces a complete quotes module and substantial PDF/document professionalism upgrades across quotes and invoices.

## Highlights
- Full quote workflow: create, edit, list, status transitions, conversion to invoice.
- Atomic quote approval to invoice conversion via Supabase RPC.
- Quote PDF downloads from both quote editor and quote list.
- Sender identity controls expanded and persisted per document.
- Configurable invoice payment instructions under totals in PDF.
- Cleaner, labeled recipient block formatting in generated PDFs.

## Feature Details

### Quotes
- New pages/routes:
  - `/offertes`
  - `/offertes/nieuw`
  - `/offertes/:id/bewerken`
- Status model:
  - `concept`
  - `verzonden`
  - `goedgekeurd`
  - `afgewezen`
  - `vervallen`
- Numbering:
  - Quotes: `OFF-YYYY-NNNN`
  - Invoices: `YYYY-NNNN`
- Customer profile shortcut:
  - Create quote directly from customer card with prefilled customer data.

### Sender Identity (Professional Output)
- Quote sender fields:
  - Name
  - Email (optional)
  - Phone (optional)
  - KvK (optional)
  - IBAN (optional and hideable)
- Invoice sender fields:
  - Name
  - Email (optional)
  - IBAN (optional and hideable)
- Overview-page PDF downloads now prioritize document-stored sender values instead of profile-only fallback.

### PDF and Payment Instructions
- Added `payment_instructions` per invoice.
- New invoice editor field: free-text payment instructions.
- Payment instructions render below the totals section in invoice PDF.
- Removed hardcoded footer lines from invoice PDF:
  - "Betaalinstructie: maak het bedrag over onder vermelding van het factuurnummer."
  - "Betaaltermijn klantprofiel: X dagen."
- Recipient section now uses cleaner labeled rows.

## Database Migrations Applied
- `016_app_quotes.sql`
- `017_quote_approval_rpc.sql`
- `018_app_invoices_sender_fields.sql`
- `019_app_quotes_sender_fields.sql`
- `020_app_invoices_payment_instructions.sql`
- `021_app_quotes_seller_phone_kvk.sql`

## Validation
- Build succeeded.
- Quote test suite succeeded (2 suites, 7 tests).
- Supabase migrations pushed to remote through `021_app_quotes_seller_phone_kvk.sql`.

## Notes
- Unique signing-link flow is intentionally postponed and not implemented in this release.
