# Factuur Studio - Changelog & Release Notes

> Overzicht van alle belangrijke wijzigingen en releases.

---

## 📦 Release [v0.4.0] - 2026-03-28

### ✨ Nieuwe Features

- **i18n (Internationalisatie)** - Volledige NL/EN taalondersteuning
  - 13 namespaces (auth, common, customers, dashboard, errors, invoices, pricing, etc.)
  - LanguageSwitcher component met vlagindicatoren
  - Automatische taaldetectie (querystring, localStorage, navigator)

- **Testing Suite** - Complete test infrastructuur
  - Jest unit tests (28 tests, 4 suites)
  - Playwright E2E tests voor auth en landing pages
  - CI/CD workflow via GitHub Actions

- **Theme Support** - Donker/licht modus
  - ThemeToggle component
  - Automatische systeemvoorkeur detectie
  - Persistentie in localStorage

- **Blog Systeem** - Content marketing
  - Blog index pagina (`/blog`)
  - Blog post pagina (`/blog/:slug`)
  - Blog artikel: "Administratie besparen"
  - SEO geoptimaliseerd (Open Graph, Twitter Cards, JSON-LD)

- **UI Verbeteringen**
  - SearchInput met debounce
  - FilterPanel voor facturen
  - ExportButton voor CSV export
  - Skeleton loading states

### 🔧 Technische Verbeteringen

- **Analytics & Tracking**
  - GA4 integratie met pageview tracking
  - UTM attribution tracking (first/last touch)
  - Custom events: signup, checkout, purchase, referral

- **Utilities**
  - searchUtils.ts - Zoek en filter logica
  - exportUtils.ts - CSV export functionaliteit
  - useSearch hook - Reusable search state management

### 🐛 Bugfixes

- Blog navigatie links gecorrigeerd (nu naar `/blog` ipv direct naar artikel)
- Landing page CTA tekst: "Bekijk prijzen" → "Probeer gratis"
- LanguageSwitcher: dubbele "NL" verwijderd, subtiele vlagindicatie

### 📊 Stats

| Metric | Waarde |
|--------|--------|
| Bestanden gewijzigd | 82 |
| Regels toegevoegd | +14,044 |
| Regels verwijderd | -2,242 |
| Test coverage | 28 tests |
| i18n keys | ~600+ |

---

## 📦 Release [v0.3.4] - 2026-03-20

### ✨ Nieuwe Features

- **Support Ticket Systeem**
  - Ticket aanmaken via `/support` (Supabase RPC)
  - Ticket geschiedenis voor gebruikers
  - Admin ticket management met status filtering
  - Per-artikel feedback acties ("Was dit nuttig?")

### 🔧 Wijzigingen

- Support mailto adres: `info@webdesignerstudio.nl`
- Uitgebreide FAQ items met step-by-step details

### 🗄️ Database

- Migration `012_support_tickets.sql`:
  - `support_tickets` tabel
  - RLS policies
  - RPCs: `create_support_ticket`, `admin_list_support_tickets`, `admin_reply_support_ticket`

---

## 📦 Release [v0.3.3] - 2026-03-20

### ✨ Nieuwe Features

- **Admin Route Guard** - Router-level bescherming voor `/admin`
- **Dashboard Implementation Roadmap** - Phased plan in `todo-next-steps.md`

### 🔧 Wijzigingen

- **Landing Page Redesign** - Modern marketing-first layout
- Feature copy: "Veilig account en rollen" → "Sneller betaald"
- Brand text: `FactuurStudio` → `Factuur Studio`
- Document title: `Factuur Studio`

### 🔒 Security

- Admin panel: route-level + in-page authorization checks

---

## 📦 Release [v0.3.0] - 2026-03-18

### ✨ Nieuwe Features

- **Delete Paid Invoices** - Verwijderen van betaalde facturen met waarschuwing
- **Payment Warning Dialog** - Duidelijke Nederlandse bevestigingsdialog
- **VAT Parser Hardening** - Verbeterde extractie tijdens PDF import

### 🗄️ Database Migrations

| Migration | Beschrijving |
|-----------|--------------|
| `001_initial_schema.sql` | Initiële database setup |
| `002_referrals.sql` | Referral systeem |
| `003_referral_reward_config.sql` | Beloningsconfiguratie |
| `012_support_tickets.sql` | Support ticket systeem |

---

## 📊 Huidige Project Status

| Onderdeel | Status |
|-----------|--------|
| Tests | ✅ 28/28 pass |
| i18n | ✅ 13 namespaces (NL/EN) |
| Dev Server | ✅ Draait op localhost:5173 |
| Build | ✅ Vite 8.0.0 |
| Git | ✅ 82 bestanden gecommit |
| GitHub | ✅ Main + backup-20260328 gepusht |

---

## 🎯 Roadmap - Volgende Stappen

### Deze Week (High Priority)
1. [ ] ADVERTENTIE_TEKSTEN.md opschonen (duplicaten, typo's)
2. [ ] Stripe flow validatie (volledige test)
3. [ ] Email templates (welcome, password reset, upgrade)

### Binnenkort (Medium Priority)
4. [ ] CSV/PDF export voor factuurlijst
5. [ ] Intercom/Crisp chat widget
6. [ ] Knowledge base artikelen

### Toekomst (Low Priority)
7. [ ] Automatische herinneringen
8. [ ] Slack notificaties
9. [ ] Invoice templates (design customization)

---

## 📝 Commit History (Laatste 5)

```
3ea9e13 feat: complete i18n implementation, testing suite, and UI enhancements
7ba0875 fix: remove extra blog CTA from landing hero
b02db56 feat: add blog article and homepage blog promotion
11fa41b feat: add UTM attribution tracking for GA4 funnel events
a3137bc feat: track GA4 sign_up, start_checkout and purchase events
```

---

*Laatste update: 28 maart 2026*
