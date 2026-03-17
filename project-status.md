# Project Status

## Huidige stand
- Projectnaam: FactuurStudio
- Status: live beta, publiek bereikbaar
- Live domein: `https://factuur.webdesignerstudio.nl`
- Frontend: React + TypeScript + Vite + Tailwind
- Backend/data: Supabase
- Referral flow: live en werkend getest
- Auth flow: live en werkend getest
- Site staat niet meer in demo/local mode

## Wat al afgerond is
- Landing page live
- Registratie en login via Supabase
- Factuurgenerator live
- Conceptfacturen bewerken
- Referral systeem live
- Configurabele referral rewards
- Dev testtools voor referral/pro-plan
- Backup branch aangemaakt
- Backupinformatie opgeslagen in `backupinformatie.md`
- Volgende-fase todo’s opgeslagen in `todo-next-steps.md`

## Laatste grote technische stap
Deze stap is als laatste gebouwd en gepusht:
- Facturen Supabase-first
- Profieldata Supabase-first
- Wachtwoord reset-flow toegevoegd
- Planbeheer in instellingen uitgebreid

Laatste commit voor deze stap:
- `1062466` — `Implement Supabase-first invoices/profiles and auth reset flow`

## Belangrijke migraties
Uitgevoerd / beschikbaar:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_referrals.sql`
3. `supabase/migrations/003_referral_reward_config.sql`
4. `supabase/migrations/004_app_invoices.sql`

## Belangrijke om later direct te controleren
Bij hervatten eerst checken:
1. Is `004_app_invoices.sql` al uitgevoerd in Supabase?
2. Werkt live factuur aanmaken/bewerken/verzenden met data-persistentie na refresh?
3. Is `VITE_ADMIN_EMAILS` gezet in Netlify als admin-planbeheer nodig is?
4. Werkt de wachtwoord-reset flow live op de echte omgeving?

## Openstaande logische vervolgstappen
1. Smoke test doen op live omgeving voor factuurflow en instellingenflow.
2. Verifiëren dat facturen na refresh en op nieuw device zichtbaar blijven.
3. Eventuele regressies oplossen na Supabase-first refactor.
4. Daarna stabiliseren met echte testers.

## Hoe later snel herpakken
Gebruik in een nieuwe chat iets als:
- "Lees eerst `project-status.md`, `todo-next-steps.md` en `backupinformatie.md` en ga verder vanaf de laatste stap."
- Of: "Ga verder vanaf commit `1062466` en controleer eerst of `004_app_invoices.sql` al in Supabase is uitgevoerd."

## Belangrijke projectbestanden
- `project-status.md`
- `todo-next-steps.md`
- `backupinformatie.md`
- `src/stores/invoiceStore.ts`
- `src/stores/profileStore.ts`
- `src/stores/authStore.ts`
- `src/pages/SettingsPage.tsx`
- `src/pages/ForgotPasswordPage.tsx`
- `src/pages/ResetPasswordPage.tsx`
- `supabase/migrations/004_app_invoices.sql`

## Backup
Codebackup branch:
- `backup-2026-03-16-1328`

## Opmerking
De beste manier om later exact snel verder te gaan is niet vertrouwen op chatgeheugen, maar dit bestand als startpunt gebruiken samen met de repo-bestanden en laatste commits.
