# Todo Next Steps

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
