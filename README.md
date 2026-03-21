# React + TypeScript + Vite

## Stripe Subscriptions (Pro)

Deze codebase bevat nu Stripe Checkout integratie met Supabase Edge Functions:

- `supabase/functions/create-checkout-session`
- `supabase/functions/stripe-webhook`
- `supabase/migrations/013_stripe_billing.sql`

### 1. Stripe producten/prijzen

Maak in Stripe twee prijzen aan voor product `Pro`:

- Maandelijks: `EUR 5`
- Jaarlijks: `EUR 50`

Kopieer daarna beide `price_...` IDs.

### 2. Zet Supabase secrets

Gebruik test/sandbox keys tijdens ontwikkeling:

```bash
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

### 4. Registreer webhook in Stripe

Webhook URL:

`https://<project-ref>.functions.supabase.co/stripe-webhook`

Luister naar events:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 5. Push migratie

```bash
supabase db push --linked --include-all
```

### 6. Frontend gedrag

Op `/instellingen` kan de gebruiker nu kiezen:

- `Pro maandelijks (€5)`
- `Pro jaarlijks (€50)`

Na succesvolle betaling zet de webhook het plan automatisch naar `pro`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
