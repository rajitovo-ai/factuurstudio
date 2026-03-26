# Request Lower - Copilot Tips & Tricks

Doel: minder premium requests verbruiken en toch sneller resultaat krijgen.

## 1) Hoogste impact regels

1. Bundel taken in 1 complete prompt.
2. Geef direct context mee: bestanden, gewenste uitkomst, constraints.
3. Vraag in 1 keer: analyse + fix + validatie.
4. Vraag om korte delta-output (alleen wat is gewijzigd).
5. Laat altijd build/tests draaien in dezelfde opdracht.

## 2) Prompt structuur (gebruik dit altijd)

Gebruik dit sjabloon:

```txt
Doel:
Bestanden:
Wijzigingen:
Niet doen:
Validatie:
Git:
Output:
```

Korte uitleg per veld:

- Doel: wat je exact wilt bereiken.
- Bestanden: noem concrete paden.
- Wijzigingen: functioneel + visueel + dataflow.
- Niet doen: grenzen zetten (bijv. geen push zonder akkoord).
- Validatie: welke checks moeten draaien.
- Git: commit/push regels.
- Output: hoe je rapportage wilt (kort/lang).

## 3) Master Prompt - Factuur Studio

Kopieer en hergebruik dit blok:

```txt
Doel:
Voer de wijziging end-to-end uit in Factuur Studio met minimale iteraties.

Bestanden:
Noem exact welke bestanden je moet aanpassen (bijv. src/pages/PricingPage.tsx, src/pages/SettingsPage.tsx, src/lib/analytics.ts).

Wijzigingen:
- Implementeer de gevraagde feature volledig.
- Houd bestaande stijl, routes en Supabase/Stripe-flow intact.
- Voeg alleen noodzakelijke code toe; geen over-engineering.

Niet doen:
- Niet pushen naar GitHub zonder mijn expliciete "push nu".
- Geen ongevraagde refactors buiten scope.
- Geen nieuwe documentatiebestanden maken tenzij ik het vraag.

Validatie:
- Run npm run build.
- Fix build errors direct.
- Meld alleen relevante waarschuwingen kort.

Git:
- Maak 1 duidelijke commit message.
- Push pas na mijn toestemming.

Output:
- Geef eerst resultaat in 3-6 bullets.
- Daarna: aangepaste bestanden + waarom.
- Daarna: korte teststatus.
- Kort en praktisch, geen lange theorie.
```

## 4) Best practices voor minder requests

- Werk in batches per thema: SEO, billing, analytics, UI.
- Vermijd micro-prompts; stel 1 duidelijke batchvraag.
- Gebruik "ga door met stap 2 en 3" in plaats van losse bevestigingen.
- Vraag om concrete eindoutput: gewijzigde files, commit message, testresultaat.
- Laat simpele tekstwijzigingen zelf doen; gebruik Copilot voor complexe 20%.

## 5) Prompt voorbeelden (copy/paste)

### Voorbeeld A - Feature met validatie

```txt
Doel: voeg X toe.
Bestanden: src/a.ts, src/b.tsx.
Wijzigingen: implementeer X inclusief edge-cases Y.
Niet doen: geen styling aanpassen buiten component Z.
Validatie: npm run build.
Git: commit wel, push niet.
Output: alleen wijzigingssamenvatting + testresultaat.
```

### Voorbeeld B - Bugfix snel

```txt
Zoek oorzaak van bug X, fix het in de juiste bestanden, run build, en geef alleen:
1) root cause
2) file changes
3) build status
Geen extra uitleg.
```

### Voorbeeld C - Productieklus

```txt
Implementeer dit volledig lokaal en maak het production-ready.
Check ook mobiele weergave.
Run build en los errors op.
Commit mag, push pas na mijn akkoord.
```

## 6) Korte checklist voor elke nieuwe request

- Is doel meetbaar?
- Zijn bestanden genoemd?
- Staat "niet pushen zonder akkoord" erin?
- Staat validatie erin (build/tests)?
- Vraag je om delta-output i.p.v. lang verslag?

Als je deze checklist gebruikt, daalt het aantal premium requests meestal sterk.

## 7) Persoonlijke standaardregels (Factuur Studio)

Gebruik deze regels standaard in elke opdracht:

- Werk altijd lokaal, niet direct op productie.
- Push nooit zonder expliciete toestemming.
- Run altijd `npm run build` na codewijzigingen.
- Los build errors direct op voordat je afrondt.
- Maak 1 duidelijke commit per taak.
- Maak na release ook een backup-branch push wanneer gevraagd.
- Rapporteer kort: wat aangepast is, welke bestanden, buildstatus.

## 8) Starterblok voor elke nieuwe chat

Kopieer en plak dit bovenaan je request:

```txt
Werkafspraken:
- Altijd lokaal werken.
- Nooit pushen zonder mijn expliciete akkoord.
- Altijd npm run build draaien na wijzigingen.
- Build errors meteen oplossen.
- Geen extra refactors buiten scope.

Uitvoerformat:
- Eerst korte samenvatting (3-6 bullets).
- Dan aangepaste bestanden met reden.
- Dan build/test status.
```

## 9) Low-Token Werkmodus (copy/paste)

Gebruik dit blok wanneer je bijna door je premium requests heen bent:

```txt
LOW-TOKEN MODE:
- Geef alleen noodzakelijke output.
- Voer taak end-to-end uit in 1 run: analyse + fix + build.
- Geen lange uitleg, alleen:
	1) wat aangepast is
	2) welke bestanden
	3) build/test status
- Geen extra refactors buiten scope.
- Push alleen als ik expliciet zeg: "push nu".
```

## 10) Compact Request Format (copy/paste)

Gebruik dit korte format voor minimale iteraties:

```txt
Doel:
Bestanden:
Constraints:
Validatie: npm run build
Output: kort, alleen delta
```
