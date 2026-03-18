# Changelog

All notable changes to FactuurStudio are documented here.

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
