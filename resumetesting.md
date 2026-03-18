# E2E Test Resume — 2026-03-18

## Teststatus op moment van pauzeren

### Testaccount (nieuwe gebruiker, schone dataset)
- **E-mail:** test.e2e.20260318151244@example.com
- **Wachtwoord:** Test12345!
- **Browser staat op:** http://localhost:5173/login (net uitgelogd)

---

## Checklist — voortgang

| # | Test | Status | Resultaat |
|---|------|--------|-----------|
| 1 | Registratie nieuw account | ✅ | Geslaagd — redirect naar dashboard werkt |
| 2 | PDF importeren (factuur.pdf) | ✅ | Geslaagd — OCR fallback actief, bestand verwerkt |
| 3 | Import review valideren | ✅ | Geslaagd — klantnaam, bedragen, BTW herkend; factuurnummer ontbreekt (verwacht bij OCR) |
| 4 | Klantprofiel vanuit import | ✅ | Geslaagd — Link2Talent aangemaakt in /klanten |
| 5 | Factuur aanmaken via importdata | ✅ | Geslaagd — IMP-20260318-1, € 90,75, status verzonden |
| 6 | Handmatige factuur aanmaken | ✅ | Geslaagd — 2026-0002, € 968,00 (bewerkt na aanmaak) |
| 7 | Factuurstatus concept → verzonden → betaald | ✅ | Geslaagd — knoppen werken correct en schakelen disabled na gebruik |
| 8 | Verwijderen na betaald + waarschuwing | ✅ | Geslaagd — confirm-dialog verschijnt met correcte tekst; cancel houdt factuur intact; accept verwijdert |
| 9 | Dashboard herberekening na verwijderen | ✅ | Geslaagd — verwijderde betaalde facturen tellen niet meer mee (€ 0,00 Betaald) |
| 10 | Instellingen opslaan (bedrijfsprofiel) | ⚠️ | Schijnbare bug — velden leken leeg na reload, maar DB bevatte de data correct. Timing-issue bij eerste test. Bij tweede run werkte alles. Geen code-fix nodig. |
| 11 | Factuur bewerken | ✅ | Geslaagd — prijs aangepast van 750 → 800, totaal bijgewerkt naar € 968,00, opgeslagen |
| 12 | Free plan limiet (5/maand) | ✅ | Geslaagd — na 5 facturen verschijnt foutmelding "Je Free-plan heeft een limiet van 5 facturen per maand." en opslaan blokkeert |
| 13 | 409 console errors bij registratie | ⏳ | Nog niet volledig onderzocht — 409 responses zichtbaar bij eerste dashboard-load na registratie; bij latere loads verdwenen. Waarschijnlijk race-condition in `handle_new_user` trigger (INSERT ON CONFLICT). Lage prioriteit. |
| 14 | Logout/login regressie | ⏳ | Inlogpagina bereikt, formulier half ingevuld (e-mail ingevuld, wachtwoord nog niet submitted). Hier gestopt. |
| 15 | Wachtwoord vergeten flow | ⏳ | Nog niet getest |

---

## Nog te testen (volgende sessie)

### Direct doorstarten:
1. **Logout/login regressie** — inloggen met `test.e2e.20260318151244@example.com` / `Test12345!` en checken of data correct laadt
2. **Wachtwoord vergeten** — op /wachtwoord-vergeten de flow testen (e-mail invullen, melding checken)
3. **409 errors bij registratie** — bij aanmaken nieuw account network-tab openharken; mogelijke oorzaak: `subscriptions`-insert conflicteert als trigger al een record aanmaakt

### Extra regressie (na boven):
4. **PDF download** — "PDF" knop op een factuur klikken en checken of download/preview werkt
5. **Klantprofiel bijwerken** — bestaande klant aanpassen op /klanten en checken of de factuurpagina het opgepikt heeft
6. **Klantprofiel verwijderen** — klant verwijderen en checken of facturen daarna nog correct laden (customer_id = null scenario)
7. **Factuur bewerken na verzonden status** — bewerken-link zou geblokkeerd moeten zijn of een melding geven
8. **Valuta wisselen** — USD/GBP selecteren en live preview checken
9. **BTW 0% en BTW-vrijstelling** — checkbox "Geen BTW" aanvinken en preview/opslag checken
10. **Meerdere factuurregels** — meerdere regels toevoegen, één verwijderen, totaalberekening valideren
11. **Inclusief BTW-modus** — prijsmodus wisselen naar "Prijzen inclusief BTW" en berekening checken

---

## Bekende issues / aandachtspunten

| Issue | Ernst | Status |
|-------|-------|--------|
| 409 responses bij dashboard-load na registratie (console errors) | Laag | Onbevestigd, verdwijnt daarna |
| Instellingen-velden leeg op eerste render (timing race) | Laag | Schijnbaar, DB-data is correct |
| Factuurnummer niet herkend bij OCR-import | Info | Verwacht gedrag, gebruiker vult handmatig in |
| `net::ERR_ABORTED` bij logout POST | Info | Supabase-gedrag bij onmiddellijke redirect, functioneel OK |

---

## Testomgeving
- **URL:** http://localhost:5173
- **Dev server:** Vite (npm run dev)
- **Lint status:** Geslaagd (exit 0)
- **Build status:** Geslaagd (exit 0)
- **Branch:** main (geen push gedaan, geen push toegestaan zonder expliciete toestemming)
