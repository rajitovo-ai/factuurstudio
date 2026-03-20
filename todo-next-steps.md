# Todo Next Steps

## Dashboard Redesign Plan

### Fase 1. Structuur en prioriteiten
- Huidige dashboard-indeling herstructureren naar een duidelijke volgorde: welkom, belangrijkste cijfers, directe acties, aandachtspunten, recente activiteit.
- Bepalen welke informatie voor de gebruiker het belangrijkst is op de eerste scroll.
- Bestaande abonnement-sectie compacter maken zodat die niet te dominant aanwezig is.

Oplevering:
- Nieuwe wireframe-achtige dashboardstructuur in code.
- Betere visuele hiërarchie zonder nieuwe complexe databronnen.

### Fase 2. Nieuwe visuele layout
- Hero-sectie maken met persoonlijke begroeting en primaire knoppen zoals `Nieuwe factuur` en `Klanten bekijken`.
- KPI-kaarten verbeteren met sterkere typografie, kleuraccenten en duidelijkere labels.
- Dashboard opdelen in een hoofdgedeelte en ondersteunende zijsecties voor desktop.
- Mobiele weergave opnieuw ordenen zodat acties en kerninformatie bovenaan blijven staan.

Oplevering:
- Moderne, professionele dashboardlayout.
- Betere scanbaarheid op desktop en mobiel.

### Fase 3. Actionable content
- Nieuwe sectie `Aandacht nodig` toevoegen voor openstaande of vervallen facturen.
- Nieuwe sectie `Recente facturen` toevoegen met de laatste facturen en hun status.
- Korte statusblokken tonen zoals openstaand bedrag, betaald bedrag, facturen deze maand en mogelijk vervallen facturen.
- Free-plan limiet duidelijk maar subtiel tonen, zonder dat het dashboard aanvoelt als upsellpagina.

Oplevering:
- Dashboard helpt gebruikers zien wat ze nu moeten doen.
- Minder alleen cijfers, meer directe actiecontext.

### Fase 4. Datalaag optimaliseren
- Bestaande client-side berekeningen centraliseren zodat het dashboard minder herhaald filterwerk doet.
- Dashboard-metrics groeperen in herbruikbare afgeleide data of helperlogica.
- Controleren of bepaalde statistieken later beter via Supabase RPC of samengevatte queries geladen kunnen worden.
- Onnodige renders en dubbele afleidingen beperken.

Oplevering:
- Schonere en beter schaalbare dashboardlogica.
- Voorbereid op groei zonder rommelige componentlogica.

### Fase 5. Premium polish
- Skeleton states of nette laadblokken toevoegen.
- Kleine grafiek of trendweergave toevoegen als dat visueel echt waarde toevoegt.
- Cards, spacing, iconen en hover-states verfijnen.
- Teksten aanscherpen zodat het dashboard rustig, professioneel en doelgericht voelt.

Oplevering:
- Premium uitstraling.
- Betere gebruikerservaring zonder visuele ruis.

### Aanbevolen uitvoervolgorde
1. Fase 1: structuur vastzetten.
2. Fase 2: visuele layout vernieuwen.
3. Fase 3: inhoudelijk slimmer maken.
4. Fase 4: datalogica opschonen en optimaliseren.
5. Fase 5: polish en extra verfijning.

### Concreet eerste implementatieblok
- Dashboard hero vernieuwen.
- KPI-kaarten opnieuw ontwerpen.
- Abonnement-sectie compacter maken.
- Nieuwe sectie `Aandacht nodig` toevoegen.
- Nieuwe sectie `Recente facturen` toevoegen.

## 1. Testfase
- Laat 3 tot 5 echte testers registreren, inloggen, facturen maken, PDF downloaden en referrals testen.
- Verzamel alleen concrete blockers en terugkerende UX-problemen.

## 2. Bugs en frictie oplossen
- Los eerst alleen kritieke bugs en veelvoorkomende pijnpunten op.
- Vermijd in deze fase grote nieuwe features tenzij ze een blocker oplossen.

## 3. Facturen volledig naar Supabase
- Factuurdata niet langer lokaal opslaan.
- Alle create/read/update-acties voor facturen via Supabase laten lopen.
- Lokale fallback voor facturen verwijderen.

## 4. Profieldata volledig naar Supabase
- Bedrijfsprofiel en instellingen niet langer lokaal bewaren.
- Profielgegevens direct vanuit Supabase laden en opslaan.

## 5. Wachtwoord reset-flow toevoegen
- “Wachtwoord vergeten” link toevoegen.
- Reset e-mail flow via Supabase implementeren.
- Reset wachtwoord pagina toevoegen.

## 6. Free/Pro beheer aanscherpen
- Handmatig Pro toekennen eenvoudig houden.
- Controleren of alle feature-gates correct werken.
- Verschillen tussen Free en Pro duidelijk houden.

## 7. Productie-checklist maken
- Wekelijkse check voor login, signup, referral, factuurflow en PDF-download.
- Basale operationele routine opstellen.

## 8. Kleine polishronde
- Mobiele details verbeteren.
- Foutmeldingen netter maken.
- Feedback van testers verwerken.

## 9. Monitoring en beheer
- Basis logging en foutopvolging opzetten.
- Herstelprocedures en beheerhandelingen documenteren.

## 10. Stripe later toevoegen
- Pas starten als productflow stabiel is en testers echt gebruik maken van de app.
- Eerst product-fit, daarna betaalflow.
