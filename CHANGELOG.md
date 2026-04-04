# Changelog

All notable changes to Factuur Studio are documented here.

## [0.5.0] — 2026-04-04

### Added
- **Complete offerte module:** Added end-to-end quote flow with dedicated routes and pages (`/offertes`, create/edit), including quote status lifecycle (`concept`, `verzonden`, `goedgekeurd`, `afgewezen`, `vervallen`).
- **Quote numbering and conversion:** Added quote numbering (`OFF-YYYY-NNNN`) and quote approval conversion to invoice (`YYYY-NNNN`) with atomic RPC path.
- **Quote PDF support:** Added quote PDF generation and download from quote editor and quote list.
- **Seller identity controls (invoice and quote):** Added editable sender fields on document forms:
	- name
	- email (optional)
	- phone (optional, quote)
	- KvK (optional, quote)
	- IBAN (optional, hideable)
- **Configurable payment instructions:** Added per-invoice free-text payment instructions shown under the total in PDF.
- **Customer-to-quote shortcut:** Added action on customer cards to create quotes with prefilled customer data.

### Changed
- **PDF professional layout:** Improved sender and recipient blocks with clearer labeled rows for recipient data and cleaner professional structure.
- **Optional IBAN behavior:** Explicitly blank IBAN values are respected and no longer unintentionally fallback to profile IBAN in PDF output.
- **Quote and invoice list PDF behavior:** PDF downloads from overview pages now prefer document-specific stored sender values.

### Removed
- Removed hardcoded PDF footer lines for invoices:
	- `Betaalinstructie: maak het bedrag over onder vermelding van het factuurnummer.`
	- `Betaaltermijn klantprofiel: X dagen.`

### Database
- Added migration `016_app_quotes.sql`:
	- `app_quotes` table, constraints, indices, RLS policies.
- Added migration `017_quote_approval_rpc.sql`:
	- `approve_quote_to_invoice(uuid)` conversion RPC.
- Added migration `018_app_invoices_sender_fields.sql`:
	- invoice sender fields (`seller_name`, `seller_email`, `seller_iban`).
- Added migration `019_app_quotes_sender_fields.sql`:
	- quote sender fields and RPC update to copy sender fields into converted invoices.
- Added migration `020_app_invoices_payment_instructions.sql`:
	- invoice `payment_instructions` persistence.
- Added migration `021_app_quotes_seller_phone_kvk.sql`:
	- quote sender phone/KvK fields (`seller_phone`, `seller_kvk`).

### Verification
- `npm run build` passed after final integration changes.
- `npm run test:quote` passed (2 suites, 7 tests).
- Supabase remote migrations were applied through `021_app_quotes_seller_phone_kvk.sql`.

## [0.3.4] — 2026-03-20

### Added
- **Support ticket system:** Added ticket creation flow on `/support` using Supabase RPC `create_support_ticket`
- **Ticket history for users:** Added `Mijn tickets` section where users can track status and read admin responses
- **Admin ticket operations:** Added support ticket management to `/admin` with status filtering (`open`, `in_progress`, `resolved`) and response handling via RPC
- **Support feedback instrumentation:** Added per-article feedback actions (`Was dit nuttig?`) with analytics events

### Changed
- **Support contact fallback:** Updated support mailto address to `info@webdesignerstudio.nl`
- **Support hub UX:** Expanded FAQ items with step-by-step details and integrated contextual support blocks across key pages

### Database
- Added migration `012_support_tickets.sql` with:
	- `support_tickets` table
	- RLS policies for user ownership and admin updates
	- RPCs `create_support_ticket`, `admin_list_support_tickets`, `admin_reply_support_ticket`
- Remote Supabase migration push completed successfully for `012_support_tickets.sql`

## [0.3.3] — 2026-03-20

### Added
- **Admin route guard:** Added a dedicated `AdminRoute` guard to protect `/admin` at router level, redirecting non-admin users away before page render
- **Dashboard implementation roadmap:** Added a phased implementation plan in `todo-next-steps.md` for structure, visual redesign, actionable insights, data optimization, and polish

### Changed
- **Landing page redesign:** Upgraded to a modern marketing-first layout with clearer value communication, feature framing, and CTA hierarchy
- **Feature copy refinement:** Replaced the landing feature `Veilig account en rollen` with `Sneller betaald` to better match end-user value
- **Brand text update:** Changed visible UI text from `FactuurStudio` to `Factuur Studio` across key user-facing pages and shell layout
- **Document title update:** Updated HTML title to `Factuur Studio`

### Security
- Strengthened admin panel access with route-level authorization checks in addition to existing in-page checks

### Notes
- Real screenshot assets for future landing integration were prepared in `public/screenshots/` but are not yet wired in the current landing section

---

## [0.3.0] — 2026-03-18

### Added
- **Delete paid invoices:** Users can now delete invoices with `status: betaald` via an explicit confirmation dialog that warns about dashboard recalculation impact
- **Payment warning dialog:** Confirmation UI for destructive paid-invoice deletion with user-friendly Dutch messaging
- **VAT parser hardening:** Enhanced extraction logic to prevent VAT number leakage into non-VAT fields during PDF import
- **Test resume documentation:** `resumetesting.md` for test session continuity and next-step reference
- **Test coverage validation:** Full E2E test suite completed (11/11 core flows passing)

### Changed
- [src/pages/InvoicesPage.tsx](src/pages/InvoicesPage.tsx): Refactored invoice row action handlers to support paid-state deletion
- [src/stores/invoiceStore.ts](src/stores/invoiceStore.ts): Enhanced delete method to ensure dashboard exclusion of removed invoices
- [src/lib/invoiceImport.ts](src/lib/invoiceImport.ts): Improved field inference heuristics for Dutch customer data

### Fixed
- VAT number sanitization in import parser to prevent identifier leakage across fields

### Documentation
- Added RELEASE_NOTES.md for deployment readiness summary
- Updated .gitignore to exclude test PDFs

---

## [0.2.0] — 2026-03-16

### Added
- PDF import with OCR fallback for scanned invoices
- Customer profile creation from imported PDF data
- Invoice import marker (`is_imported`) for tracking source
- Dutch language support for OCR recognition
- Import review page with field validation and override capability

### Changed
- Dashboard to display imported invoices alongside manually created ones
- Invoice store to support `is_imported` marker in data model

### Fixed
- OCR timeout handling to prevent indefinite UI blocking
- Field inference for unlabeled Dutch customer data

---

## [0.1.0] — 2026-03-01

### Added
- User registration and authentication (Supabase)
- Manual invoice creation with client-side BTW calculation
- Factuurprofiel (company profile) settings page
- Invoice status flow: concept → verzonden → betaald
- Customer profiles directory
- Dashboard with financial totals
- Free plan (5 invoices/month) and Pro plan support
- PDF export of invoices
- Referral system (invite friends, earn credits)

### Initial Release
- Full invoicing system with core workflows
- Multi-language UI (Dutch)
- Supabase PostgreSQL backend with RLS
- Vite + React + TypeScript stack
