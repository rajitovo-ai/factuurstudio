# Factuur Studio

> Professionele facturatie voor ZZP'ers en kleine ondernemers. Snel, simpel, betrouwbaar.

[![Tests](https://img.shields.io/badge/tests-28%20passing-brightgreen)](./)
[![i18n](https://img.shields.io/badge/i18n-NL%2FEN-blue)](./)
[![License](https://img.shields.io/badge/license-Private-red)](./)

---

## 🚀 Features

- **⚡ Snelle facturen** - Maak professionele facturen in 2 minuten
- **📊 Dashboard** - Realtime inzicht in omzet en openstaande bedragen
- **👥 Klantenbeheer** - Centrale klantgegevens, altijd herbruikbaar
- **📥 PDF Import** - Importeer bestaande facturen met OCR
- **💳 Stripe Billing** - Pro abonnementen (€5/maand of €50/jaar)
- **🌍 i18n** - Nederlands en Engels
- **🌙 Dark Mode** - Automatisch donker/licht thema
- **📱 Responsive** - Werkt op desktop, tablet en mobiel

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript 5.9, Vite 8, TailwindCSS 3.4 |
| State | Zustand |
| Backend | Supabase (Auth, Database, Edge Functions) |
| Payments | Stripe Checkout + Webhooks |
| Testing | Jest + Playwright |
| i18n | i18next |
| PDF | jsPDF + PDF.js + Tesseract.js (OCR) |

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/factuurstudio.git
cd factuurstudio

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start dev server
npm run dev
```

---

## 🔧 Environment Setup

### 1. Supabase Project

1. Maak project aan op [supabase.com](https://supabase.com)
2. Kopieer `Project URL` en `Anon Key` naar `.env`

### 2. Stripe Setup (voor Pro abonnementen)

```bash
# Maak producten aan in Stripe Dashboard
# Monthly: €5
# Yearly: €50

# Zet Supabase secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set STRIPE_PRICE_PRO_MONTHLY=price_...
supabase secrets set STRIPE_PRICE_PRO_YEARLY=price_...
supabase secrets set APP_BASE_URL=https://factuurstudio.nl
```

### 3. Deploy Edge Functions

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

### 4. Database Migrations

```bash
supabase db push --linked --include-all
```

### 5. Stripe Webhook

Registreer webhook in Stripe Dashboard:
- URL: `https://<project-ref>.functions.supabase.co/stripe-webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## 🧪 Development

```bash
# Dev server
npm run dev

# Tests
npm test
npm run test:watch
npm run test:coverage

# E2E tests
npm run test:e2e

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## 📁 Project Structure

```
src/
├── components/      # React components
│   ├── auth/       # Auth guards, protected routes
│   ├── invoice/    # Invoice-specific UI
│   ├── layout/     # Layout wrappers
│   ├── support/    # Support ticket UI
│   └── ui/         # Generic UI components
├── pages/          # Route pages
├── stores/         # Zustand stores
│   ├── authStore.ts
│   ├── invoiceStore.ts
│   ├── customerStore.ts
│   ├── billingStore.ts
│   └── ...
├── lib/            # Utilities
│   ├── supabase.ts
│   ├── pdf.ts
│   ├── billing.ts
│   └── ...
├── i18n/           # Translations (NL/EN)
└── __tests__/      # Unit tests

supabase/
├── functions/      # Edge Functions
│   ├── create-checkout-session/
│   ├── stripe-webhook/
│   └── sync-billing-status/
└── migrations/     # Database migrations
```

---

## 🗄️ Database Schema

### Core Tables

- `app_invoices` - Facturen met volledige klant snapshot
- `customer_profiles` - Klantgegevens
- `subscriptions` - Abonnementen (free/pro)
- `support_tickets` - Support systeem
- `referrals` - Referral tracking

### Key Features

- Row Level Security (RLS) op alle tables
- Automatische timestamps
- Soft delete support
- Indices voor performance

---

## 🚀 Deployment

### Netlify (Frontend)

```bash
# Build for production
npm run build

# Deploy (via Netlify CLI of GitHub integration)
netlify deploy --prod --dir=dist
```

### Supabase (Backend)

```bash
# Push database changes
supabase db push

# Deploy functions
supabase functions deploy
```

---

## 📝 Environment Variables

Zie `.env.example` voor alle vereiste variabelen:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- `VITE_ADMIN_EMAILS` - Komma-gescheiden admin emails
- `VITE_GA_MEASUREMENT_ID` - Google Analytics ID (optioneel)

---

## 🧪 Testing

- **Unit tests:** Jest + React Testing Library (28 tests)
- **E2E tests:** Playwright (auth + landing flows)
- **Coverage:** Run `npm run test:coverage`

---

## 📄 License

Private - Alle rechten voorbehouden

---

## 🆘 Support

Vragen of problemen? 
- 📧 Email: info@webdesignerstudio.nl
- 🎫 Support portal: `/support` in de app

---

*Built with ❤️ for Dutch entrepreneurs*
