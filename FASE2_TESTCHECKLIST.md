# Fase 2 Testchecklist - PDF Import + OCR

Gebruik deze checklist om de nieuwe importflow volledig te testen.

## Vooraf

- Zorg dat je bent ingelogd in de app.
- Open: `Facturen > Importeer facturen`.
- Zorg dat je minimaal 3 testbestanden hebt:
  - 1 tekst-PDF (selecteerbare tekst)
  - 1 scan-PDF (afbeelding/scan)
  - 1 extra PDF met afwijkende layout

## Test 1 - Tekst-PDF basisimport

1. Upload 1 tekst-PDF.
2. Controleer of velden automatisch gevuld zijn:
   - factuurnummer
   - klantnaam/e-mail
   - datums
   - subtotaal/btw/totaal
3. Laat OCR-toggle aan of uit (maakt bij tekst-PDF meestal weinig verschil).
4. Laat beide opties aan:
   - `Importeer klantgegevens`
   - `Importeer factuurdata`
5. Klik `Importeer geselecteerde gegevens`.

Verwacht:
- Succesmelding met aantallen.
- Nieuw klantprofiel zichtbaar in `Klanten`.
- Nieuwe factuur zichtbaar in `Facturen`.

## Test 2 - Scan-PDF met OCR fallback

1. Upload 1 scan-PDF.
2. Zorg dat `OCR fallback voor scans inschakelen` aan staat.
3. Controleer of bij het bestand staat dat OCR gebruikt is.
4. Controleer/verbeter velden handmatig waar nodig.
5. Importeer.

Verwacht:
- Bestand wordt verwerkt zonder crash.
- Waarschuwingen tonen onzekere herkenning.
- Na correctie kan import slagen.

## Test 3 - Bulk upload (meerdere PDFs tegelijk)

1. Upload 3+ PDF’s in 1 keer.
2. Controleer dat je per bestand een aparte kaart ziet.
3. Zet voor 1 bestand alleen klantimport aan.
4. Zet voor 1 bestand alleen factuurimport aan.
5. Zet voor 1 bestand beide aan.
6. Start import.

Verwacht:
- Per bestand worden gekozen acties uitgevoerd.
- Samenvatting klopt met aantallen klanten/facturen/fouten.

## Test 4 - Review en handmatige correctie

1. Upload een PDF met deels foute herkenning.
2. Pas velden aan vóór import:
   - factuurnummer
   - datums
   - totaal/subtotaal/btw
   - klantgegevens
3. Importeer.

Verwacht:
- Opgeslagen data volgt jouw handmatige correcties, niet de ruwe OCR-uitkomst.

## Test 5 - Geen vervaldatum

1. Upload een factuur zonder duidelijke due date.
2. Controleer dat `Vervaldatum gebruiken` uit kan.
3. Importeer factuurdata.
4. Open de geimporteerde factuur.

Verwacht:
- Factuur wordt opgeslagen met `hasDueDate = false`.
- Geen onterechte vervallen-status op basis van due date.

## Test 6 - Dashboard-effect

1. Importeer minimaal 1 factuur met status `verzonden`.
2. Importeer minimaal 1 factuur met status `betaald`.
3. Ga naar `Dashboard`.

Verwacht:
- `Openstaand` telt verzonden facturen mee.
- `Betaald` telt betaalde facturen mee.
- `Facturen deze maand` stijgt als issue date in huidige maand valt.

## Test 7 - Dubbelen en factuurnummers

1. Importeer dezelfde PDF twee keer.
2. Controleer factuurnummers in `Facturen`.

Verwacht:
- Geen crash op unieke constraints.
- Factuurnummer fallback/suffix wordt toegepast als nummer al bestaat.

## Test 8 - PDF output check

1. Open een geimporteerde factuur.
2. Download PDF.
3. Controleer dat klantgegevens en beschrijving aanwezig zijn.

Verwacht:
- PDF bevat de geimporteerde kerngegevens consistent.

## Snelle regressiecheck

- Nieuwe factuur handmatig aanmaken werkt nog.
- Klanten handmatig toevoegen op tab `Klanten` werkt nog.
- Bestaande facturen bewerken werkt nog.
- App blijft responsief bij grotere bestanden.

## Bekende aandachtspunten

- OCR kost extra tijd bij scans (normaal).
- OCR kan fouten maken; reviewstap blijft noodzakelijk.
- Extreem afwijkende factuurlayouts vereisen vaak handmatige correctie.
