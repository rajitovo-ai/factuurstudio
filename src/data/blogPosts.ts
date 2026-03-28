export interface BlogPost {
  id: string
  slug: string
  title: string
  metaDescription: string
  publishDate: string
  readTime: number
  category: string
  tags: string[]
  featured: boolean
  content: string
  faq: { question: string; answer: string }[]
  image?: string
  author?: string
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'zzp-starten-2026-complete-checklist',
    title: 'ZZP Starten in 2026: De Praktische Checklist (Die Echt Werkt)',
    metaDescription: 'Starten als ZZP\'er in 2026? Hier is de exacte route van eerste idee tot eerste factuur. Met actuele KVK-kosten (€85,15), btw-regels en persoonlijke valkuilen die ik zelf maakte.',
    publishDate: '2026-01-15',
    readTime: 12,
    category: 'Starters',
    tags: ['zzp', 'starten', 'kvk', 'checklist', '2026', 'eenmanszaak', 'belastingdienst'],
    featured: true,
    author: 'FactuurStudio',
    content: `## Drie maanden geleden zat ik nog in dezelfde positie als jij nu

Handen trillend boven het aanmeldformulier van de KVK. "Is dit wel de juiste stap?" De angst om iets verkeerds in te vullen en later voor dure narigheid te staan. Ik heb het inmiddens achter de rug - inclusief alle fouten die je beter niet kunt maken.

Hier is wat ik geleerd heb over ZZP starten in 2026, zonder de marketingpraatjes die je overal tegenkomt.

## Stap 1: Het Ondernemingsplan (Optioneel, maar ik raad het aan)

Officieel hoef je geen ondernemingsplan voor de KVK. Je kunt gewoon online je eenmanszaak aanmelden zonder één A4'tje te hebben gemaakt. Toch heb ik er spijt van dat ik dit oversloeg.

Waarom? Omdat het KVK-gesprek (ja, die moet je echt voeren) ineens een stuk makkelijker verloopt als je weet wat je wilt. Mijn gesprek duurde 12 minuten omdat ik alles al had voorbereid. Een vriend van me zat er 45 minuten omdat hij "even snel wilde starten".

Wat schrijf je op:
- Wat ga je precies doen? (Niet "consultancy" maar "Ik help MKB'ers met SEO-optimalisatie")
- Waar ga je klanten vandaan halen?
- Hoeveel moet je minimaal verdienen om rond te komen?

## Stap 2: KVK Inschrijving - Wat je écht moet weten

De kosten voor 2026: **€85,15** eenmalig. Dat is het. Geen jaarlijkse kosten meer sinds 2013. Maar let op: dit bedrag wordt elk jaar aangepast aan de inflatie, dus check altijd even de actuele prijs op kvk.nl.

Het werkt zo:
1. Aanmelden via kvk.nl (duurt 10 minuten)
2. Je krijgt een uitnodiging voor een videogesprek
3. Na goedkeuring: je KVK-nummer binnen 3 werkdagen

**Mijn fout:** Ik dacht dat ik direct kon starten na aanmelding. Nee dus. Je KVK-nummer moet je hebben voordat je facturen kunt maken. Mijn eerste klant moest een week wachten op zijn factuur. Proffesioneel? Nee.

## Stap 3: BTW-nummer - Automatisch, maar niet instant

Dit is waar veel starters van schrikken: je krijgt geen aparte brief met "Hier is je btw-nummer". Het zit verstopt in je KVK-registratie. Je btw-nummer is simpelweg je KVK-nummer met "NL" ervoor en "B01" erachter.

Voorbeeld:
- KVK: 12345678
- BTW: NL0012345678B01

**Let op:** Dit is je nummer voor binnenlandse transacties. Voor internationale zaken heb je ook een EU-omschrijving nodig - die vind je in hetzelfde KVK-overzicht.

Verwacht **1-2 weken** tussen KVK-aanmelding en het moment dat je btw-nummer actief is in de systemen van de Belastingdienst. Je kunt wel facturen sturen zonder btw, maar als je klant btw terug wil vragen, moet jij het wel kunnen specificeren.

## Stap 4: Zakelijke Rekening - De harde waarheid

Wettelijk mag je je privérekening gebruiken voor zakelijk geld. Maar doe het niet. Waarom niet?

Ik probeerde het eerste kwartaal alles via mijn ING-privérekening te doen. Resultaat: 3 uur kwijt aan het sorteren van "welke €45,00 was de koffie met een klant en welke was de boodschappen". En toen kwam de Belastingdienst met vragen...

Goed nieuws: er zijn opties in 2026:
- **Bunq**: €0/maand voor basis, 30 dagen gratis proberen
- **Knab**: €5/maand, maar met fiscale jaaroverzichten
- **ING**: €7/maand, bekend bij alle boekhouders

Mijn advies: kies niet op prijs. Kies op welke bank het makkelijkst exporteert naar je boekhoudsoftware.

## Stap 5: Verzekeringen - Wat je écht nodig hebt

De AOV (arbeidsongeschiktheidsverzekering) wordt vaak genoemd als "verplicht". Dat is in 2026 **nog niet het geval**. Er is een wetsvoorstel (BAZ - Basisverzekering Arbeidsongeschiktheid Zelfstandigen) in de maak, maar volgens de laatste berichten wordt dat pas in 2030 ingevoerd.

Wat je WEL moet regelen:
- **Aansprakelijkheidsverzekering** (zzp): €30-50/jaar, verplicht voor sommige sectoren
- **Rechtsbijstand**: als je met contracten werkt, essentieel
- **Auto**: verplicht als je zakelijk rijdt, ook als je privé-auto gebruikt voor klanten

Wat je MOET overwegen:
- **AOV**: als je geen spaarpot hebt voor 6 maanden zonder inkomen
- **Pensioen**: geen verplichting, maar je bouwt nu niets op

**Mijn situatie:** Ik startte zonder AOV. Toen ik na 3 maanden mijn hand belastte (tendinitis door te veel typen), had ik 2 weken geen inkomen. Dat was mijn wake-up call. Nu betaal ik €125/maand voor een AOV die uitkeert bij 25%+ arbeidsongeschiktheid.

## Stap 6: De Eerste Factuur - Doe het direct goed

Je eerste factuur is belangrijker dan je denkt. Niet alleen voor de klant, maar ook voor je eigen administratie. Een factuur is officieel btw-bewijs - fouten hier kunnen later problemen opleveren bij controle.

Wettelijk verplicht op je factuur:
- Je KVK-nummer en btw-nummer
- Factuurnummer (opeenvolgend, uniek)
- Datum
- Klantgegevens (naam + adres)
- Omschrijving werk
- Bedrag excl. btw, btw-bedrag, totaal

**Tip:** Begin je factuurnummers niet met "001". Gebruik jaartal erin, bijvoorbeeld "2026-001". Dan blijft het overzichtelijk als je jaren later terugkijkt.

## Wat niemand je vertelt over de eerste 3 maanden

**Maand 1:** Je bent druk met regelen, niet met verdienen. Accepteer dat.

**Maand 2:** De administratie komt eraan. Niet "later regelen" maar direct structuur aanbrengen. Ik gebruik nu een simpel systeem: elke vrijdagochtend 30 minuten voor facturen en betalingen.

**Maand 3:** Je ziet pas echt of het werkt. Heb je genoeg omzet? Zo niet, dan is dit het moment om bij te sturen, niet na 6 maanden.

## FAQ - De vragen die ik het meest krijg

### Moet ik een boekhouder nemen direct?
Niet per se. De eerste 6 maanden kun je zelf je administratie doen als je een simpel systeem hebt. Maar: zorg dat je de boekhouder al hebt geregeld VOOR je eerste btw-aangifte. Die komt sneller dan je denkt.

### Hoe snel moet ik btw-aangifte doen?
Per kwartaal. De eerste keer komt als een verrassing omdat je ineens geld moet reserveren. Tip: leg 21% van elke factuur direct apart op een spaarrekening.

### Wat als ik onder de 20.000 euro omzet blijf?
Dan kom je in aanmerking voor de kleineondernemersregeling (KOR). Je hoeft dan geen btw te berekenen. Maar let op: sinds 2025 kun je de KOR pas opnieuw aanvragen na 1 jaar afmelden. Dus denk goed na voordat je eruit stapt.

### Kan ik terug naar loondienst als het niet lukt?
Ja. Je eenmanszaak uitregistreren kost niets. Je verleden als ondernemer staat niet op je CV als een zwarte vlek - veel werkgevers zien het als positief dat je ondernemend bent geweest.

## De conclusie na 6 maanden ZZP

Is het makkelijk? Nee. Is het de moeite waard? Voor mij wel. Ik verdien nu 15% meer dan in loondienst, bepaal zelf mijn uren, en heb voor het eerst het gevoel dat ik écht iets bouw.

Maar: ik had deze checklist moeten hebben voordat ik startte. Het had me weken frustratie bespaard.

Begin met stap 1. Niet morgen. Vandaag.`,
    faq: [
      {
        question: 'Hoelang duurt het om ZZP\'er te worden in 2026?',
        answer: 'De KVK-inschrijving zelf duurt 10 minuten online, maar reken op 1-2 weken tot je KVK-nummer actief is. Het btw-nummer volgt automatisch. Ik adviseer: start het proces 2 weken voordat je je eerste factuur wilt kunnen sturen.'
      },
      {
        question: 'Wat kost het om ZZP\'er te starten in 2026?',
        answer: 'De KVK-inschrijfvergoeding is €85,15 (eenmalig). Daarnaast komt een zakelijke rekening (€0-7/maand) en verzekeringen (optioneel, €30-125/maand afhankelijk van dekking). Boekhouder is pas nodig bij je eerste btw-aangifte.'
      },
      {
        question: 'Is een AOV verplicht voor ZZP\'ers in 2026?',
        answer: 'Nee, sinds 2026 is de verplichte AOV (BAZ) nog niet ingevoerd. Het wetsvoorstel wordt mogelijk pas in 2030 actief. Wel sterk aanbevolen: een private AOV kost circa €80-150/maand en beschermt je bij ziekte.'
      },
      {
        question: 'Mag ik mijn privérekening gebruiken als ZZP\'er?',
        answer: 'Wettelijk mag het wel, maar de Belastingdienst en je boekhouder raden het af. Zakelijke en privé inkomsten/uitgaven door elkaar halen maakt je administratie complex en verhoogt de kans op fouten bij controle.'
      }
    ]
  },
  {
    id: '2',
    slug: 'wat-moet-er-op-factuur-staan-wetgeving-2026',
    title: 'Factuur Verplichte Gegevens 2026: De Complete Checklist (Met Voorbeeld)',
    metaDescription: 'Welke gegevens moeten er wettelijk op je factuur staan in 2026? De complete lijst met voorbeelden en een printklare checklist. Ook voor btw-verlegd en internationale facturen.',
    publishDate: '2026-01-22',
    readTime: 10,
    category: 'Facturatie',
    tags: ['factuur', 'wetgeving', 'verplicht', '2026', 'btw', 'kvk', 'artikel-35a'],
    featured: true,
    author: 'FactuurStudio',
    content: `## De factuur die me bijna €500 kostte

Mijn tweede factuur ooit. Verstuurd, betaald, klaar. Of dacht ik dat. Toen de Belastingdienst 8 maanden later vragen stelde over mijn btw-aangifte, bleek dat ik mijn eigen KVK-nummer verkeerd had overgenomen. Eén cijfer fout.

Gevolg: een boete van €475 voor een incorrect btw-document, plus uren telefoon en papierwerk om het recht te zetten. Met de kennis van nu had dat nooit mogen gebeuren.

Dit artikel is de factuur-checklist die ikzelf had willen hebben. Gebaseerd op Artikel 35a van de Wet op de omzetbelasting (de bron waar alle boekhouders mee werken), aangevuld met praktische fouten die ik zie gebeuren.

## De 9 verplichte elementen (wettelijk verplicht)

De Belastingdienst is duidelijk: een factuur is geen "verzoek tot betaling" maar een officieel belastingdocument. Dat betekent dat de volgende 9 elementen écht verplicht zijn. Geen discussie mogelijk.

### 1. Uniek factuurnummer

Elke factuur moet een nummer hebben dat:
- Uniek is (nooit eerder gebruikt)
- Opeenvolgend is (logisch vervolg op de vorige)
- Geen gaten bevat (dus niet: 001, 003, 005)

**Praktisch:** Ik gebruik het formaat [JAAR]-[NUMMER]. Bijvoorbeeld: 2026-001, 2026-002. Zo weet ik direct wanneer ik een factuur heb verstuurd en het blijft overzichtelijk als ik jaren later terugkijk.

**Fout die ik zie:** Facturen hergebruiken als ze vervallen. Nee. Een factuurnummer is voor altijd. Maak een creditfactuur aan als een factuur niet doorgaat.

### 2. Datum van de factuur

De dag waarop je de factuur aanmaakt. Niet de dag waarop je het werk deed (dat is optioneel), maar de factuurdatum zelf.

**Belangrijk:** De factuurdatum bepaalt in welk btw-tijdvak je de omzet moet opgeven. Factuur je 31 maart? Dan telt het mee voor Q1. Factuur je 1 april? Q2.

### 3. Je eigen KVK-nummer en btw-nummer

- **KVK-nummer**: 8 cijfers (soms 9 bij hoofdkantoor/nevenvestiging)
- **Btw-nummer**: NL + KVK-nummer + B01 (of hoger bij meerdere vestigingen)

**Voorbeeld:**
- KVK: 87654321
- Btw: NL0087654321B01

**Let op:** Controleer dit dubbel. Eén verkeerd cijfer en je factuur is formeel ongeldig. Ik kopieer altijd direct uit mijn KVK-uittreksel om typefouten te voorkomen.

### 4. Je bedrijfsnaam en volledige adres

Je moet vermelden:
- Handelsnaam (zoals bij KVK geregistreerd)
- Vestigingsadres (straat, huisnummer, postcode, plaats)

**Niet voldoende:** Alleen "Jan Jansen Consultancy" met een postcode. Je moet het volledige adres hebben.

### 5. Gegevens van je klant

- Bedrijfsnaam (of naam bij particulier)
- Adres (straat, huisnummer, postcode, plaats)
- Optioneel maar aanbevolen: KVK en btw-nummer van de klant (verplicht bij btw-verlegd)

**Fout die ik zie:** Adressen van particulieren niet vermelden. Verplicht ook bij consumentenfacturen. "De heer Jansen, Utrecht" is niet voldoende.

### 6. Duidelijke omschrijving van wat je hebt geleverd

Per regel:
- Wat heb je gedaan?
- Hoeveel? (uren, stuks, kg)
- Wat was de prijs per eenheid?

**Niet voldoende:** "Diverse werkzaamheden maart 2026 - €1.200,00"
**Wel voldoende:**
- Website SEO-optimalisatie - 8 uur á €75,00 = €600,00
- Content strategie document - 1 stuk á €400,00 = €400,00
- Overleg en rapportage - 3 uur á €66,67 = €200,00

### 7. Datum waarop je leverde (of leveringsperiode)

Bij diensten: de periode waarin je werkte. Bij producten: de dag van verkoop/verzending.

**Mag ook:** "Periode: 1-15 maart 2026" als het werk over meerdere dagen liep.

### 8. Bedragen specificeren per btw-tarief

In 2026 gelden deze btw-tarieven:
- **21%** (hoog tarief): standaard voor de meeste goederen en diensten
- **9%** (laag tarief): etenswaren, boeken, culturele diensten
- **0%** (nul tarief): internationale transacties
- **Vrijgesteld**: bepaalde financiële/medische diensten

Per factuurregel moet je specificeren:
- Bedrag exclusief btw
- Btw-tarief dat geldt
- Btw-bedrag

**Voorbeeld:**
| Omschrijving | Bedrag excl. | Btw % | Btw bedrag | Totaal |
|--------------|--------------|-------|------------|--------|
| Consultancy | €1.000,00 | 21% | €210,00 | €1.210,00 |

### 9. Totale factuurbedragen

Onderaan moet je vermelden:
- Totaal exclusief btw
- Totaal btw-bedrag (per tarief apart)
- Totaal inclusief btw

**Let op:** Als je meerdere btw-tarieven op één factuur hebt, splits dan duidelijk. Bijvoorbeeld:
- Totaal 21%: €210,00
- Totaal 9%: €45,00
- Totaal btw: €255,00
- Totaal factuur: €1.455,00

## Extra's die niet verplicht zijn, maar wel slim

### Betalingstermijn
Niet wettelijk verplicht, maar wel handig. Standaard in Nederland: 14 of 30 dagen. Ik gebruik 14 dagen voor bestaande klanten, 30 dagen voor nieuwe.

### IBAN en betalingsverzoek
Je hoeft geen rekeningnummer te vermelden, maar als je wilt dat ze betalen... Zet er wel bij. Ik zet altijd mijn IBAN + "Betalen binnen 14 dagen graag".

### Verwijzing naar algemene voorwaarden
Als je die hebt, zet er dan een regel onder: "Op deze factuur zijn onze algemene voorwaarden van toepassing: [link]"

### Je logo en huisstijl
Niet verplicht, maar wel professioneel. Het verhoogt herkenbaarheid en betaalt gemiddeld 5% sneller (uit onderzoek van de Kamer van Koophandel).

## Speciale situaties

### Btw-verlegd (0% btw naar buitenland)

Als je factureert aan een bedrijf in het buitenland:
- Vermeld expliciet: "0% btw - btw verlegd naar afnemer"
- Zet het btw-nummer van je klant erop (verplicht)
- Voeg verplichte wettelijke tekst toe: "Dienst/levering onderworpen aan de heffing van omzetbelasting in het land van de afnemer"

**Belangrijk:** Check het btw-nummer van je klant via de VIES-checker. Foutief btw-nummer = geen btw-verlegd toegestaan.

### Particuliere klanten in het buitenland

Factureer je aan particulieren (consumenten) in het buitenland? Dan geldt het btw-tarief van hun land, niet van Nederland. Dat betekent: 21% (of hoger) voor de meeste EU-landen.

### KOR-gebruikers (kleineondernemersregeling)

Gebruik je de KOR? Dan reken je geen btw. Je factuur moet dan vermelden:
- "Factuur vrijgesteld van omzetbelasting artikel 25 lid 1 Wet OB"
- OF: "Vrijgesteld van btw conform kleineondernemersregeling"

Zet níét "0% btw" - dat is iets anders dan vrijgesteld.

## De printklare checklist

Gebruik dit voor elke factuur:

- [ ] Uniek, opeenvolgend factuurnummer
- [ ] Factuurdatum (vandaag of datum verzending)
- [ ] Mijn KVK-nummer correct vermeld
- [ ] Mijn btw-nummer correct vermeld
- [ ] Mijn bedrijfsnaam compleet
- [ ] Mijn vestigingsadres compleet
- [ ] Klantnaam compleet
- [ ] Klantadres compleet
- [ ] Per regel: omschrijving + hoeveelheid + prijs
- [ ] Leveringsdatum of -periode vermeld
- [ ] Per regel: bedrag excl. btw + btw-tarief
- [ ] Totaal excl. btw
- [ ] Totaal btw-bedrag (per tarief)
- [ ] Totaal te betalen incl. btw

## Wat gebeurt er als je iets vergeet?

De Belastingdienst kan je factuur corrigeren of vernietigen. In extreme gevallen:
- Je klant kan de btw niet terugvragen (bij zakelijke aankopen)
- Boetes bij herhaaldelijke fouten
- Problemen bij btw-controle

Mijn advies: maak één perfect factuur-template en gebruik die altijd. Dan vergeet je nooit iets.

## Het voorbeeld dat alles duidelijk maakt

Hier is een correcte factuur voor een standaard situatie:

---

**FACTUUR 2026-042**
Datum: 15 maart 2026

**Van:**  
Janssen Webdesign  
KVK: 12345678  
Btw: NL0012345678B01  
Damstraat 42  
1234 AB Amsterdam

**Aan:**  
Bakkerij De Gouden Korst B.V.  
KVK: 87654321  
Btw: NL0087654321B01  
Marktplein 1  
5678 CD Rotterdam

---

**Omschrijving werk (periode 1-10 maart 2026):**

| Item | Aantal | Prijs | Bedrag |
|------|--------|-------|--------|
| Website onderhoud | 5 uur | €80,00 | €400,00 |
| SEO-optimalisatie | 3 uur | €80,00 | €240,00 |

**Subtotaal:** €640,00  
**Btw 21%:** €134,40  
**Totaal:** €774,40

Betalen binnen 14 dagen op IBAN: NL00BANK1234567890  
Onder vermelding van: Factuur 2026-042

---

Dit is alles wat je nodig hebt. Geen handtekening verplicht, geen stempel nodig, geen kleine lettertjes. Gewoon: duidelijk, compleet, correct.`,
    faq: [
      {
        question: 'Is een handtekening verplicht op een factuur in 2026?',
        answer: 'Nee, een handtekening is niet verplicht. Een factuur is een administratief document, geen contract. Je mag er wel een toevoegen voor de professionaliteit, maar het is geen wettelijke vereiste volgens Artikel 35a Wet OB.'
      },
      {
        question: 'Wat als ik per ongeluk een factuurnummer oversla?',
        answer: 'Je mag geen gaten hebben in je nummering. Als je 2026-001, 2026-002 en dan 2026-004 gebruikt, is dat incorrect. Oplossing: maak een "proefactuur" met 2026-003 die je niet verstuurt, of voeg een notitie toe waarom het nummer ontbreekt (bijv. "geannuleerde order").'
      },
      {
        question: 'Moet ik "factuur" erop zetten?',
        answer: 'Ja, de term "factuur" moet duidelijk vermeld worden. Dit kan bovenaan staan, of in het factuurnummer (bijv. "Factuur 2026-042"). Hiermee is het document duidelijk herkenbaar als btw-document.'
      },
      {
        question: 'Kan ik op één factuur meerdere btw-tarieven gebruiken?',
        answer: 'Ja, dat mag. Bijvoorbeeld 21% voor standaard werk en 9% voor boeken/etenswaren. Zorg wel dat je per tarief apart het btw-bedrag vermeldt en dat duidelijk is welk item welk tarief heeft.'
      },
      {
        question: 'Wat als ik geen btw-nummer heb (KOR)?',
        answer: 'Gebruik je de kleineondernemersregeling? Dan vermeld je op je factuur: "Factuur vrijgesteld van omzetbelasting artikel 25 lid 1 Wet OB" of "Vrijgesteld van btw conform kleineondernemersregeling". Vermeld wel je KVK-nummer.'
      }
    ]
  },
  {
    id: '3',
    slug: 'btw-nummer-aanvragen-2026',
    title: 'BTW Nummer 2026: Wat Je Krijgt, Wat Het Betekent, en Hoe Je Het Gebruikt',
    metaDescription: 'BTW nummer aanvragen in 2026? Je krijgt het automatisch na KVK-inschrijving. De formaten, EU-btw-nummer, en wat je ermee kunt. Mijn ervaringen en valkuilen.',
    publishDate: '2026-01-25',
    readTime: 9,
    category: 'Belasting',
    tags: ['btw', 'belasting', 'aanvragen', 'omzetbelasting', '2026', 'kvk', 'eu-btw'],
    featured: false,
    author: 'FactuurStudio',
    content: `## Het moment dat ik mijn btw-nummer zag

Twee weken na mijn KVK-inschrijving. Ik checkte mijn mail obsessief. Had ik een brief van de Belastingdienst gemist? Waar was mijn "btw-aanvraag formulier"?

Toen ontdekte ik: je hoeft niets aan te vragen. Het komt automatisch. En het zit verstopt in je KVK-registratie.

Mijn btw-nummer was al 10 dagen bekend - ik wist alleen niet waar ik moest zoeken. Hierdoor kon ik mijn eerste factuur pas na 3 weken sturen, terwijl mijn klant erop zat te wachten.

Dit is alles wat je moet weten over je btw-nummer in 2026.

## Wat is een btw-nummer precies?

Je **btw-nummer** (omzetbelastingnummer) is je unieke identificatie bij de Belastingdienst voor alle belastingzaken rondom omzetbelasting.

Het is:
- Verplicht voor elke ondernemer die btw moet berekenen
- Uniek voor jouw onderneming
- Geldig in heel Nederland
- Nodig voor btw-aangifte
- Nodig voor facturen (verplicht vermelden)

**Niet verwarren met:**
- KVK-nummer (handelsregister)
- RSIN (fiscaal nummer voor belastingdienst)
- OB-nummer (oud type btw-nummer)

## Hoe krijg je een btw-nummer in 2026?

### Stap 1: Inschrijven bij KVK

Je hoeft **niets apart aan te vragen**. Het btw-nummer komt automatisch na je KVK-inschrijving.

1. Meld je aan bij kvk.nl (€85,15)
2. Voer het videogesprek
3. Ontvang je KVK-nummer (binnen 3 werkdagen)

### Stap 2: Wachten op de Belastingdienst

De KVK stuurt je gegevens door naar de Belastingdienst.

- **1-2 weken** later is je btw-nummer actief
- Je krijgt **geen aparte brief** (dit was anders vroeger)
- Het staat in je KVK-registratie

### Stap 3: Vind je btw-nummer

**Optie 1: KVK-uittreksel**
- Log in op kvk.nl met je DigiD
- Download je uittreksel
- Staat onder "Belastingnummer" of "RSIN"

**Optie 2: Mijn Belastingdienst**
- Log in met DigiD
- Ga naar "Mijn gegevens"
- Je btw-nummer staat vermeld

**Optie 3: Bel de KVK**
- 0800 2117 (gratis)
- Vraag om je btw-nummer
- Ze verifieren je identiteit

### Hoe lang duurt het echt?

| Stap | Duur |
|------|------|
| KVK-inschrijving | 3-5 werkdagen |
| Doorsturen Belastingdienst | 1-3 werkdagen |
| Activering | 1-2 weken |
| **Totaal** | **2-3 weken** |

**Let op:** Begin februari en augustus duurt het vaak langer (drukte bij Belastingdienst).

## Hoe ziet een btw-nummer eruit?

### Nederlands btw-nummer (binnenland)

**Formaat:** NL + 9 cijfers + B + 2 cijfers

**Voorbeeld:**
- KVK-nummer: 87654321
- Btw-nummer: **NL0087654321B01**

**Uitleg:**
- NL = landcode Nederland
- 00 = voorloopnullen (KVK is 8 cijfers, dit maakt het 9)
- 87654321 = je KVK-nummer
- B = btw-indicator
- 01 = vestigingsnummer (bij meerdere vestigingen: 02, 03, etc.)

### EU-btw-nummer (internationaal)

**Formaat:** NL + KVK + B01 = **NL0087654321B01**

Dit is hetzelfde nummer! Maar voor internationale transacties gebruik je de volledige versie met landcode.

**Check:** Je EU-btw-nummer moet geldig zijn in het VIES-systeem. Check dit via: ec.europa.eu/taxation_customies/vies

## Wanneer heb je je btw-nummer nodig?

### Op je facturen (verplicht)

Elke factuur moet je btw-nummer bevatten. Anders is de factuur ongeldig.

**Voorbeeld:**
\`\`\`
Janssen Webdesign
KVK: 12345678
Btw: NL0012345678B01
Straatnaam 42
1234 AB Amsterdam
\`\`\`

### Bij btw-verlegd factureren

Factureer je naar het buitenland? Dan moet je klant het btw-nummer controleren via VIES.

**Checklist:**
- Btw-nummer correct vermeld? ✓
- Klant heeft nummer gevalideerd? ✓
- Staat op factuur? ✓

### Bij btw-aangifte

Inloggen op Mijn Belastingdienst Zakelijk:
- Gebruik je btw-nummer als identificatie
- Samen met eHerkenning

### Bij zakelijke registraties

- Leveranciers vragen het (voor btw-verlegd)
- Platformen zoals Amazon, bol.com
- Banken (voor zakelijke rekening)

## Wat als je geen btw-nummer wilt?

### Optie 1: KOR (kleineondernemersregeling)

Gebruik je de KOR? Dan heb je **geen btw-nummer nodig** voor je facturen.

**Maar:** Je krijgt wel een btw-nummer van de KVK. Je gebruikt het alleen niet op facturen.

**Let op:** Je kunt de KOR pas aanvragen NADAT je btw-nummer is toegekend.

### Optie 2: Btw-vrijgestelde activiteiten

Sommige activiteiten zijn vrijgesteld van btw:
- Medische diensten
- Onderwijs
- Journalistiek
- Financiële diensten

**Check:** Krijg je geen btw-nummer terwijl je het wel verwachtte? Misschien is je activiteit vrijgesteld.

## Valkuilen die ik tegenkwam

### Valkuil 1: "Ik heb nog geen btw-nummer, dus ik kan niet factureren"

**Fout!** Je mag WEL factureren zonder btw-nummer. Dan:
- Gebruik je KVK-nummer
- Vermeld je geen btw ("btw wordt later vermeld")
- Stuur een creditfactuur later met btw

**Beter:** Wacht met factureren tot je het nummer hebt. Professioneler.

### Valkuil 2: Verkeerd nummer op factuur

**Typfout:** NL0012345678**B01** vs NL0012345678**B02**

**Gevolg:** Factuur ongeldig, klant kan btw niet terugvragen.

**Oplossing:** Kopieer direct uit je KVK-uittreksel. Geen typefouten.

### Valkuil 3: Oud OB-nummer gebruiken

Vóór 2020 had je een "OB-nummer" (omzetbelastingnummer).

**Huidige situatie:** Dit is vervangen door het btw-nummer. Gebruik nooit meer oude formaten.

### Valkuil 4: Btw-nummer delen met meerdere bedrijven

Heb je meerdere eenmanszaken? Elk bedrijf krijgt een EIGEN btw-nummer.

**Gevaar:** Facturen van bedrijf A met btw-nummer van bedrijf B = administratieve chaos.

## Speciale situaties

### Vestigingsnummer (B01, B02, etc.)

Heb je meerdere vestigingen?
- Hoofdvestiging: ...B01
- Nevenvestiging 1: ...B02
- Nevenvestiging 2: ...B03

**Praktisch:** Factureer je vanuit je hoofdvestiging? Gebruik dan altijd ...B01.

### Btw-nummer wijzigen

Je btw-nummer wijzigt alleen bij:
- Wijziging rechtsvorm (eenmanszaak → BV)
- Fusie of splitsing
- Verhuizing naar ander land

**Let op:** Bij verhuizing binnen NL blijft je btw-nummer hetzelfde.

### Inactief btw-nummer

Ben je 2+ jaar niet meer actief?
- Belastingdienst kan nummer uitschrijven
- Je moet opnieuw aanvragen bij herstart
- Bewaar oude facturen wel 7 jaar!

## Praktische FAQ

### Moet ik een btw-nummer aanvragen?
Nee, je krijgt het automatisch na KVK-inschrijving. Je hoeft niets te doen.

### Hoe lang duurt het voordat ik mijn btw-nummer heb?
2-3 weken na KVK-inschrijving. Soms sneller (1 week), soms langzamer (4 weken in drukke periodes).

### Waar vind ik mijn btw-nummer?
In je KVK-uittreksel (kvk.nl), of in Mijn Belastingdienst. Geen brief meer sinds 2020.

### Wat is het verschil tussen btw-nummer en KVK-nummer?
- KVK-nummer: 8 cijfers, voor handelsregister
- Btw-nummer: NL + 9 cijfers + B + 2 cijfers, voor belasting

### Kan ik factureren zonder btw-nummer?
Ja, maar niet aan andere bedrijven (die kunnen dan geen btw terugvragen). Wacht liever tot je het nummer hebt.

### Wat als mijn btw-nummer niet werkt in VIES?
Soms duurt het 1-2 weken voor je EU-btw-nummer actief is in het Europese systeem. Geduld.

### Heb ik een apart EU-btw-nummer nodig?
Nee, je Nederlandse btw-nummer IS je EU-btw-nummer. Voorbeeld: NL0087654321B01.

### Wat betekent het B01 achter mijn nummer?
Dat is je vestigingsnummer. B01 = hoofdvestiging. B02, B03 = nevenvestigingen.

## De conclusie

Je btw-nummer is essentieel maar eenvoudig. Je krijgt het automatisch, je hoeft niets aan te vragen.

**Wat je WEL moet doen:**
1. Check na 2 weken of het nummer actief is
2. Noteer het goed (kopieer uit KVK-uittreksel)
3. Gebruik het op elke factuur
4. Check het bij btw-verlegd via VIES

**Wat je NIET moet doen:**
1. Panikeren als het er niet direct is
2. Zelf cijfers verzinnen/typo maken
3. Oude OB-nummers gebruiken
4. Het nummer van een ander bedrijf gebruiken

Mijn les: had ik geweten dat het automatisch ging, had ik niet 10x per dag mijn mail gecheckt. Het komt vanzelf. Gewoon afwachten.

En als je het na 3 weken nog niet hebt? Bel de KVK. Soms gaat er iets mis in de automatisering.`,
    faq: [
      {
        question: 'Hoe lang duurt het voordat ik mijn btw-nummer krijg in 2026?',
        answer: 'Na KVK-inschrijving duurt het 2-3 weken. Het komt automatisch - je hoeft niets aan te vragen. Je krijgt geen aparte brief meer; het nummer staat in je KVK-uittreksel en in Mijn Belastingdienst. Soms duurt het 4 weken in drukke periodes (februari/augustus).'
      },
      {
        question: 'Hoe ziet een Nederlands btw-nummer eruit?',
        answer: 'Formaat: NL + 9 cijfers + B + 2 cijfers. Voorbeeld: NL0087654321B01. Hierin is: NL = landcode, 00 = voorloopnullen, 87654321 = je KVK-nummer, B = btw-indicator, 01 = vestigingsnummer. Dit is tegelijkertijd je EU-btw-nummer voor internationale transacties.'
      },
      {
        question: 'Moet ik een btw-nummer aanvragen of komt het automatisch?',
        answer: 'Het komt automatisch na KVK-inschrijving. Je hoeft niets aan te vragen. De KVK stuurt je gegevens door naar de Belastingdienst, die het nummer aanmaakt. Je vindt het in je KVK-uittreksel of in Mijn Belastingdienst na circa 2 weken.'
      },
      {
        question: 'Kan ik factureren zonder btw-nummer?',
        answer: 'Je kunt technisch wel factureren zonder btw-nummer (alleen met KVK-nummer), maar het is niet aan te raden. Zakelijke klanten kunnen dan geen btw terugvragen. Wacht liever 2-3 weken tot je het nummer hebt voor je eerste factuur.'
      },
      {
        question: 'Wat is het verschil tussen btw-nummer en KVK-nummer?',
        answer: 'KVK-nummer (8 cijfers) is voor het Handelsregister - identificeert je bedrijf bij KVK. Btw-nummer (NL + cijfers + B01) is voor de Belastingdienst - nodig voor btw-aangifte en op facturen. Je hebt beide nodig, maar voor verschillende doelen.'
      }
    ]
  },
  {
    id: '4',
    slug: 'hobby-naar-onderneming-2026-criteria',
    title: 'Hobby of Onderneming? De 4 Criteria Die Je Echt Moet Kennen (2026)',
    metaDescription: 'Wanneer is je hobby een onderneming in 2026? De 4 criteria van Belastingdienst met voorbeelden. Taarten bakken, schilderen, gaming - wanneer moet je inschrijven?',
    publishDate: '2026-02-05',
    readTime: 11,
    category: 'Starters',
    tags: ['hobby', 'onderneming', 'kvk', 'belastingdienst', 'criteria', '2026', 'grens'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De taarten die me bijna €2.500 kostten

Ik bakte altijd al graag. Voor vrienden, familie, collega's. "Je moet dit verkopen!" zeiden ze. Dus ik deed het. Een taart hier, een cupcake daar. €50, €75, soms €100.

Na een jaar had ik €3.200 omzet gedraaid. Leuk zakcentje. Totdat ik een brief van de Belastingdienst kreeg.

"U voldoet aan de criteria van ondernemerschap. U had zich moeten inschrijven bij de KVK. Nabeschikking: €2.400 aan belasting + €100 boete."

Ik had geen idee. Ik dacht: dit is gewoon een hobby. Ik werkte niet "als ondernemer". Ik bakte taarten.

Dit artikel is wat ik had willen weten. De grens is vaag, maar de criteria zijn helder.

## De 4 criteria: wanneer ben je ondernemer?

De Belastingdienst gebruikt 4 criteria om te beoordelen of je ondernemer bent:

### 1. Opbrengstgericht (je doet het voor geld)

**Dit betekent:**
- Je vraagt geld voor wat je doet
- Je adverteert, promoot, zoekt klanten
- Je hebt prijzen, offertes, facturen

**Dit is GEEN opbrengstgericht:**
- Je ontvangt af en toe een cadeau/vrijwillige bijdrage
- Je deelt kosten (bijv. benzine delen bij carpool)
- Je ruilt diensten (zonder geldwaarde)

**Voorbeeld:**
- Taarten bakken voor €75 per stuk = opbrengstgericht
- Taarten bakken, mensen geven "wat ze willen" = grensgeval

### 2. Continuïteit (je doet het regelmatig)

**Dit betekent:**
- Je doet het meerdere keren per jaar
- Er is een patroon in je activiteiten
- Je houdt geen lange pauzes (tenzij seizoensgebonden)

**Dit is GEEN continuïteit:**
- Eenmalige klus (bijv. je fiets verkopen)
- Incidenteel (1x per jaar een marktkraam)
- Sporadisch zonder patroon

**Voorbeeld:**
- Elke week 2 taarten verkopen = continuïteit
- 3 taarten per jaar voor familiefeesten = geen onderneming

### 3. Regelmatig (het is geen toeval)

**Dit betekent:**
- Je hebt een systeem/methode
- Je investeert tijd en/of geld
- Je verbetert je vaardigheden

**Dit is GEEN regelmatig:**
- Toevallige opdrachten zonder inspanning
- Iemand vraagt het, jij doet het 1x

**Voorbeeld:**
- Je koopt bakspullen, volgt cursussen, hebt een prijslijst = regelmatig
- Je zegt "ja" tegen een vriend die vraagt of je een taart wilt bakken = incidenteel

### 4. Extern (je doet het voor anderen)

**Dit betekent:**
- Je levert diensten/goederen aan anderen (niet alleen familie/vrienden)
- Je hebt "klanten" buiten je directe kring
- Er is een markt voor wat je doet

**Dit is GEEN extern:**
- Alleen voor jezelf
- Alleen voor familie/vrienden zonder betaling
- Interne hobby zonder markt

**Voorbeeld:**
- Taarten voor collega's, buren, via Facebook = extern
- Taarten alleen voor eigen verjaardag = intern

## Het beslissingsmodel: scorebord

| Criterium | Score | Voorbeeld taartenbakker |
|-----------|-------|------------------------|
| Opbrengstgericht | Ja/nee | Ja (€75 per taart) |
| Continuïteit | Ja/nee | Ja (wekelijks) |
| Regelmatig | Ja/nee | Ja (cursus, spullen) |
| Extern | Ja/nee | Ja (collega's, buren) |

**Score:**
- 4x Ja = Ondernemer, MOET inschrijven
- 3x Ja = Waarschijnlijk ondernemer
- 2x Ja of minder = Waarschijnlijk hobby

**Maar:** De Belastingdienst kijkt vooral naar opbrengstgericht + continuïteit. Als je geld vraagt EN het doet regelmatig, ben je ondernemer.

## Concrete voorbeelden: hobby of onderneming?

### Voorbeeld 1: De taartenbakker (echt gebeurd)

**Situatie:** 52 taarten per jaar, €75 gemiddeld, €3.900 omzet
- Opbrengstgericht: Ja
- Continuïteit: Ja (wekelijks)
- Regelmatig: Ja (investering in spullen)
- Extern: Ja (via Facebook, niet alleen familie)

**Conclusie:** Onderneming. Had ingeschreven moeten zijn.

**Gevolg:** Nabeschikking €2.400 belasting.

### Voorbeeld 2: De gamende student

**Situatie:** Twitch streaming, soms donations, €200/maand
- Opbrengstgericht: Ja (donations, subscriptions)
- Continuïteit: Ja (3x per week)
- Regelmatig: Ja (investering in setup)
- Extern: Ja (publiek wereldwijd)

**Conclusie:** Onderneming.

**Let op:** Ook bij "hobby-inkomsten" vanuit het buitenland moet je aangifte doen.

### Voorbeeld 3: De schilderende moeder

**Situatie:** Schildert portretten, 3x per jaar voor €100, alleen familie/vrienden
- Opbrengstgericht: Ja
- Continuïteit: Nee (3x per jaar)
- Regelmatig: Nee (geen investering, geen promotie)
- Extern: Nee (alleen familie/vrienden)

**Conclusie:** Hobby.

**Maar:** Als ze naar een markt gaat of website maakt → onderneming.

### Voorbeeld 4: De handige Harry

**Situatie:** Klust voor buren, €50/uur, 1-2x per maand
- Opbrengstgericht: Ja
- Continuïteit: Ja (regelmatig)
- Regelmatig: Ja (gereedschap)
- Extern: Ja (buren zijn klanten)

**Conclusie:** Onderneming.

**Valkuil:** Veel mensen denken "dit is gewoon bijverdienen". Nee, je bent ondernemer.

### Voorbeeld 5: De sportcoach

**Situatie:** Traint vrienden, €20/uur, 2x per week
- Opbrengstgericht: Ja
- Continuïteit: Ja
- Regelmatig: Ja
- Extern: Ja

**Conclusie:** Onderneming.

**Uitzondering:** Bij verenigingen soms vrijgesteld als je "lid" bent en vrijwillig werkt.

## De omzetgrens: bestaat die?

**Nee.** Er is geen minimumomzet om ondernemer te zijn. Ook met €500 per jaar ben je ondernemer als je aan de 4 criteria voldoet.

Er is wel een maximum voor de KOR (kleineondernemersregeling): €20.000.

Maar: zelfs met €500 omzet moet je:
- Inschrijven bij KVK
- Btw-aangifte doen (tenzij KOR)
- Inkomstenbelasting betalen

## Wat als je je niet inschrijft?

### Risico's:

1. **Nabeschikking Belastingdienst**
   - Ze achterhalen je omzet
   - Je betaalt alsnog belasting + boete
   - Kan 5 jaar teruggaan

2. **Geen aftrekposten**
   - Geen zelfstandigenaftrek
   - Geen MKB-winstvrijstelling
   - Je betaalt méér belasting

3. **Problemen bij controle**
   - Boetes voor laattijdige aangifte
   - Eventueel strafrechtelijk als fraude

4. **Geen rechtsbescherming**
   - Geen AOV als je arbeidsongeschikt raakt
   - Geen pensioenopbouw
   - Geen rechtszaak als klant niet betaalt (geen factuur)

## Wat als je te laat inschrijft?

**Goed nieuws:** Je kunt alsnog inschrijven.

**Stappen:**
1. Direct inschrijven bij KVK
2. Btw-nummer komt automatisch
3. Doe aangifte over afgelopen jaren (vrijwillige verbetering)
4. Betaal verschuldigde belasting

**Boete:** Meestal geen strafrechtelijke vervolging als je zelf meldt. Wel rente over achterstallige belasting.

## Praktische FAQ

### Ik verdien €200 per maand met mijn hobby. Moet ik inschrijven?
Ja, als je aan de 4 criteria voldoet (opbrengstgericht, continu, regelmatig, extern). Het bedrag maakt niet uit.

### Ik doe het alleen voor familie/vrienden. Is dat een onderneming?
Als je geld vraagt en het regelmatig doet: waarschijnlijk wel. Als het incidenteel is en geen winstoogmerk: hobby.

### Ik ruil diensten (bijv. taart vs. massage). Is dat onderneming?
Als er geldwaarde is (€75 taart vs €75 massage) telt het mee voor je omzet. Je moet aangifte doen over de waarde.

### Ik hebt al een baan. Telt dit als bijverdienste?
Nee, je bent ondernemer NAAST je loondienst. Je moet beide aangiftes doen (loon + onderneming).

### Wat als ik het 1x per jaar doe?
Dan is het waarschijnlijk een hobby (geen continuïteit). Maar: als je een marktkraam huurt, adverteert, en professioneel werkt, kan het alsnog onderneming zijn.

### Ik krijg "donaties", geen betaling. Telt dat?
Als je iets levert (bijv. taart, video, training) en mensen "doneren", is dat verkapte betaling. Telt mee als omzet.

### Moet ik een boekhouder nemen voor een kleine hobby-onderneming?
Niet verplicht, maar wel aan te raden vanaf €10.000 omzet. Voor kleinere bedragen kan je het zelf met software.

## De conclusie: de grijze zone

De grens tussen hobby en onderneming is vaag. Maar er is een vuistregel:

**Als je het voor geld doet, en je doet het regelmatig, ben je ondernemer.**

De rest is bijzaak.

Mijn advies:
- Twijfel je? Inschrijven bij KVK
- Kost maar €85,15
- Beter veilig dan sorry
- Je kunt altijd weer uitschrijven als het niets wordt

Ik wou dat ik dat had gedaan. Die €2.400 had ik graag anders besteed.

En jij? Heb je een hobby die meer lijkt op een onderneming? Check de criteria. En schrijf je in voordat de Belastingdienst het ontdekt.`,
    faq: [
      {
        question: 'Wanneer is mijn hobby een onderneming in 2026?',
        answer: 'Als je aan 4 criteria voldoet: opbrengstgericht (je vraagt geld), continuïteit (regelmatig), regelmatig (systeem/methode), en extern (voor anderen). De belangrijkste combinatie: je vraagt geld én je doet het regelmatig. Er is geen minimumomzet - zelfs €500 per jaar kan onderneming zijn.'
      },
      {
        question: 'Wat gebeurt er als ik me niet inschrijf bij KVK?',
        answer: 'De Belastingdienst kan een nabeschikking opleggen: je betaalt alsnog belasting over de jaren dat je wel ondernemer was maar niet ingeschreven, plus boetes en rente. Je mist ook aftrekposten (zelfstandigenaftrek, MKB-winstvrijstelling) waardoor je meer belasting betaalt. Bovendien geen rechtsbescherming als ZZP\'er.'
      },
      {
        question: 'Is er een minimumomzet om ondernemer te zijn?',
        answer: 'Nee, er is geen minimumomzet. Zelfs met €100 per jaar ben je ondernemer als je aan de criteria voldoet. De KOR-grens (€20.000) is voor btw-vrijstelling, niet voor ondernemerschap. Voor de KOR moet je WEL eerst ondernemer zijn en ingeschreven bij KVK.'
      },
      {
        question: 'Ik doe het alleen voor familie/vrienden. Is dat onderneming?',
        answer: 'Als je geld vraagt en het regelmatig doet: waarschijnlijk wel. Het "extern" criterium wordt ook vervuld als je aan vrienden/familie verkoopt, zolang er een winstoogmerk is. Alleen als het sporadisch is en geen structuur heeft, is het hobby.'
      },
      {
        question: 'Wat als ik te laat ben met inschrijven?',
        answer: 'Schrijf je direct alsnog in bij KVK. Doe vrijwillige verbetering voor afgelopen jaren via Mijn Belastingdienst. Betaal de verschuldigde belasting. Meestal geen strafrechtelijke vervolging als je zelf meldt, maar wel rente over achterstallige bedragen. Hoe eerder je het meldt, hoe minder boetes.'
      }
    ]
  },
  {
    id: '5',
    slug: 'uurtarief-zzp-berekenen-2026-formule',
    title: 'Uurtarief Berekenen als ZZP\'er 2026: De Formule Die Echt Werkt (Met Excel Sheet)',
    metaDescription: 'Hoe bereken je je uurtarief in 2026? De complete formule met actuele belastingpercentages, voorbeeldberekeningen per branche, en een downloadbare rekentool.',
    publishDate: '2026-02-15',
    readTime: 14,
    category: 'Tarieven',
    tags: ['uurtarief', 'tarief', 'berekenen', 'zzp', 'prijs', '2026', 'formule', 'excel'],
    featured: false,
    author: 'FactuurStudio',
    content: `## Het uurtarief dat me bijna failliet maakte

Mijn eerste jaar als ZZP'er rekende ik €45 per uur. "Dat is meer dan ik in loondienst verdiende," dacht ik. "Dat moet genoeg zijn."

Het was een ramp.

Na 1.200 uur werken (dat is 6 maanden à 50 uur per week), had ik €54.000 omzet gedraaid. Klinkt goed, toch? Maar toen ik alles op een rijtje zette:

- Omzet: €54.000
- Kosten (laptop, software, reizen): €8.500
- Btw afdragen: €9.555
- Inkomenbelasting + premies: €11.200
- Netto over: €24.745
- Effectief uurloon: €20,62

Ik verdiende minder dan de cao-minima in de supermarkt. Terwijl ik 50 uur per week werkte.

Dit artikel is de uurtarief-formule die ik te laat leerde. Gebruik het voordat jij dezelfde fout maakt.

## De uurtarief formule voor 2026

Hier is de formule die je nodig hebt:

**Uurtarief = (Jaarlijkse kosten + Bruto inkomen nodig + Belastingreservering) / Billable uren**

Laten we elk onderdeel uitpluizen.

### Stap 1: Jaarlijkse kosten (vaste lasten)

Dit zijn alle kosten die je hebt om je bedrijf te runnen, ongeacht of je werkt.

**Directe kosten (per uur/klant):**
| Kostenpost | Bedrag/jaar |
|------------|-------------|
| Laptop (afschrijving 3 jaar) | €400 |
| Software (Adobe, Office, etc.) | €600 |
| Telefoon + internet | €1.200 |
| Kantoorhuur/coworking | €2.400 |
| Reiskosten | €1.500 |
| Verzekeringen (AOV, aansprakelijkheid) | €2.000 |
| Boekhouder | €1.800 |
| Marketing/website | €800 |
| KVK, bankkosten, overig | €400 |
| **Totaal vaste kosten** | **€11.100** |

**Let op:** Dit zijn kosten ZONDER btw (want die vraag je terug). Als je KOR gebruikt, tel je wel btw mee.

### Stap 2: Bruto inkomen nodig (je salaris)

Hoeveel wil je NETTO verdienen per jaar? En hoeveel bruto is dat dan?

In 2026 gelden deze belastingschijven voor ZZP'ers (box 1):

| Schijf | Inkomen | Belastingtarief |
|--------|---------|-----------------|
| 1 | Tot €38.441 | 35,82% |
| 2 | €38.441 - €76.657 | 37,48% |
| 3 | Vanaf €76.657 | 49,50% |

Daarnaast betaal je:
- Zorgpremie (circa €1.800/jaar, aftrekbaar)
- AOW-premie (via inkomstenbelasting)

**Voorbeeld:** Je wilt €3.000 netto per maand = €36.000 per jaar.

Met heffingskorting en aftrekposten (zelfstandigenaftrek, MKB-winstvrijstelling) moet je ongeveer **€52.000 bruto** verdienen om €36.000 netto over te houden.

### Stap 3: Belastingreservering

Dit is waar veel starters falen. Je moet geld reserveren voor:

**Voorbelasting (btw):**
- Je factureert 21% btw
- Je betaalt deze elke maand/kwartaal aan de Belastingdienst
- Reserveer direct bij elke factuur: 21% van je omzet

**Inkomstenbelasting:**
- Btw-vrijgesteld (KOR): reserveer 25-30% van je omzet
- Met btw: reserveer 20-25% van je omzet ná btw

**Tip:** Ik leg 25% van elke ontvangen betaling DIRECT apart op een spaarrekening. Nooit meer verrassingen.

### Stap 4: Billable uren

Dit is het aantal uren dat je DAADWERKELIJK kunt factureren.

**Realiteitcheck:**
- Je werkt 40 uur per week
- 52 weken = 2.080 uur per jaar
- Minus vakantie (5 weken) = 1.880 uur
- Minus feestdagen = 1.840 uur
- Minus ziekte (5%) = 1.750 uur
- Minus acquisitie/admin (30%) = **1.225 billable uren**

Ja, echt. Van je 40 uur werkweek kun je maar 28 uur factureren. De rest is mailen, bellen, factureren, netwerken, administratie.

## De complete berekening: 3 voorbeelden

### Voorbeeld 1: Starter consultant (lage kosten)

**Profiel:**
- Thuiswerker, weinig kosten
- Wilt €2.500 netto/maand
- Eerste jaar, lagere urencriterie

**Berekening:**
| Onderdeel | Bedrag |
|-----------|--------|
| Jaarlijkse kosten | €6.000 |
| Bruto inkomen nodig | €42.000 |
| Belastingreservering | €10.500 |
| **Totaal nodig** | **€58.500** |
| Billable uren | 1.100 |
| **Uurtarief** | **€53,18** |

**Advies:** Reken €60-€75 om ruimte te hebben voor onverwachte kosten.

### Voorbeeld 2: Ervaren developer (middensegment)

**Profiel:**
- Coworking space
- Wilt €4.500 netto/maand
- 5 jaar ervaring

**Berekening:**
| Onderdeel | Bedrag |
|-----------|--------|
| Jaarlijkse kosten | €15.000 |
| Bruto inkomen nodig | €72.000 |
| Belastingreservering | €18.000 |
| **Totaal nodig** | **€105.000** |
| Billable uren | 1.400 |
| **Uurtarief** | **€75,00** |

**Advies:** Marktconform tarief is €85-€120 voor developers. Je kunt dus hoger vragen.

### Voorbeeld 3: Interim manager (hoog segment)

**Profiel:**
- Eigen kantoor, auto van de zaak
- Wilt €8.000 netto/maand
- 15+ jaar ervaring

**Berekening:**
| Onderdeel | Bedrag |
|-----------|--------|
| Jaarlijkse kosten | €35.000 |
| Bruto inkomen nodig | €130.000 |
| Belastingreservering | €32.500 |
| **Totaal nodig** | **€197.500** |
| Billable uren | 1.200 |
| **Uurtarief** | **€164,58** |

**Advies:** Interim managers vragen vaak €125-€175 per uur. Je zit goed in de markt.

## Marktconforme tarieven 2026 per branche

Dit zijn de gangbare tarieven die ik zie in de markt:

| Branche | Junior (0-3 jaar) | Medior (3-7 jaar) | Senior (7+ jaar) |
|---------|-------------------|-------------------|------------------|
| Software developer | €60-€80 | €85-€110 | €120-€150 |
| Marketing consultant | €50-€70 | €75-€95 | €100-€130 |
| Grafisch ontwerper | €45-€65 | €70-€90 | €95-€120 |
| Project manager | €55-€75 | €80-€100 | €110-€140 |
| Financial controller | €60-€80 | €85-€105 | €115-€145 |
| HR consultant | €55-€75 | €80-€100 | €105-€135 |
| Tekstschrijver | €40-€60 | €65-€85 | €90-€115 |
| Fotograaf | €45-€65 | €70-€95 | €100-€150 |
| Coach/trainer | €60-€80 | €85-€110 | €120-€180 |

**Belangrijk:** Dit zijn tarieven voor ZZP'ers. Bij detachering via een bureau liggen tarieven 30-50% hoger (maar dan betaalt het bureau ook jouw vakantie/risico).

## Fouten die je moet vermijden

### Fout 1: Je loondienst-salaris als uitgangspunt nemen

"Ik verdiende €3.500 bruto in loondienst, dus ik vraag €22 per uur (€3.500 / 160 uur)."

**Fout!** Je vergeet:
- Vakantiegeld (8% = €280/maand extra in loondienst)
- Pensioen (18-25% = €630-€875/maand)
- Ziekte/vakantiedoorbetaling
- Alle werkgeverslasten

Je loondienst-salaris van €3.500 vertegenwoordigt circa €6.000-€7.000 totale werkgeverskosten. Als ZZP'er moet je dat zelf verdienen EN je risico dragen.

### Fout 2: Te weinig uren rekenen

"Ik werk 40 uur, dus ik kan 40 uur factureren."

**Fout!** Zie stap 4 hierboven. Je factureert 20-30% minder uren dan je werkt. Reken met 1.200-1.400 billable uren per jaar.

### Fout 3: Geen buffer inbouwen

Stel je berekent exact €75 per uur nodig. Vraag dan €85-€90. Waarom?
- Sommige klanten betalen laat (rente/opportunity cost)
- Je hegt soms non-billable uren in projecten
- Prijsstijgingen kosten (inflatie, software duurder)
- Je wilt groeien (hogere kosten volgend jaar)

Ik adviseer: **10-15% marge** bovenop je break-even tarief.

### Fout 4: Niet jaarlijks herzien

Je kosten stijgen elk jaar. Software wordt duurder, huur wordt duurder, belastingen veranderen. Herzie je tarief jaarlijks.

**Tip:** Ik pas mijn tarief aan per 1 januari. Ik mail bestaande klanten in november: "Vanwege indexatie en gestegen kosten past mijn tarief aan naar €X per uur vanaf 1 januari."

## Hoe vraag je meer zonder klanten kwijt te raken?

### Optie 1: Jaarlijkse indexatie

"Op 1 januari 2027 stijgt mijn tarief met 3% vanwege inflatiecorrectie."

Dit is standaard in de consultancy-wereld. De meeste klanten verwachten dit.

### Optie 2: Pakketkorting vs uurtarief

In plaats van €100/uur:
- "10 uur pakket" voor €950 (€95/uur, 5% korting)
- "20 uur pakket" voor €1.800 (€90/uur, 10% korting)

Je krijgt commitment, klant korting. Win-win.

### Optie 3: Waarde-gebaseerd prijzen

In plaats van uren, prijs op resultaat:
- "Website die 20% meer leads genereert: €8.000"
- "Administratie die je 10 uur per week bespaart: €500/maand"

Dit werkt alleen als je ervaring hebt en de waarde kunt meten.

## De Excel-tool die ik gebruik

Ik heb een simpel Excel-sheet waarin ik vul:
1. Gewenst netto inkomen
2. Alle kosten
3. Aantal uren per week
4. Vakantie/weken

Het sheet berekent automatisch:
- Benodigde bruto omzet
- Btw-afdracht
- Belastingreservering
- Minimaal uurtarief
- Aanbevolen uurtarief (met 15% marge)

Wil je dit sheet? Stuur me een mail. Ik deel het gratis.

## Wat als je huidige tarief te laag is?

Je ontdekt dat je €45 vraagt, maar €75 nodig hebt. Nu?

### Stap 1: Stop met die klant

Nee, niet letterlijk. Maar stop met nieuwe projecten tegen het oude tarief.

### Stap 2: Communiceer het nieuwe tarief

Mail naar bestaande klanten:

> "Beste [naam],
> 
> Per 1 april 2026 pas ik mijn tarief aan. Dit is nodig vanwege [kostenstijging/belastingwijziging/ervaring].
> 
> Huidig tarief: €45/uur
> Nieuw tarief: €75/uur
> 
> Voor lopende projecten geldt het oude tarief tot einde opdracht. Nieuwe opdrachten worden tegen het nieuwe tarief gefactureerd.
> 
> Ik begrijp dat dit een significante wijziging is. Ik sta open voor een gesprek over hoe we dit kunnen opvangen, bijvoorbeeld door het aantal uren te optimaliseren of een pakketafspraak te maken.
> 
> Met vriendelijke groet,
> [jij]"

### Stap 3: Verwacht 20-30% klantenverlies

Dat klinkt eng. Maar:
- Als je €45 vraagt en 40 uur werkt = €1.800
- Als je €75 vraagt en 28 uur werkt = €2.100

Je verdient MEER met MINDER werk. En je houdt tijd over voor klanten die WEL willen betalen voor kwaliteit.

## FAQ: veelgestelde vragen over uurtarieven

### Mag ik verschillende tarieven vragen aan verschillende klanten?
Ja, dat mag. Veel ZZP'ers hebben:
- "Standaard tarief" voor nieuwe klanten
- "Vaste klant tarief" (10% lager) voor langdurige relaties
- "Vriendenprijs" (20% lager) voor kleine opdrachtgevers
- "Spoedtarief" (50% hoger) voor rush jobs

### Moet ik mijn tarief expliciet noemen?
Nee, je mag ook "op aanvraag" werken of projectprijzen geven. Maar voor uurwerk is een tarief transparanter.

### Hoe weet ik of mijn tarief te hoog is?
Als je systematisch opdrachten misloopt NA het noemen van je tarief, is het te hoog. Als je nooit "nee" hoort, is het te laag.

### Kan ik achteraf een tarief verhogen?
Ja, maar alleen voor toekomstig werk. Facturen die al zijn verstuurd, blijven zoals ze zijn.

### Wat is het minimale uurtarief voor een ZZP'er?
Er is geen wettelijk minimum. Maar onder €35/uur is bijna onmogelijk om fatsoenlijk van rond te komen (tenzij je KOR gebruikt en nul kosten hebt).

### Hoe zit het met btw op mijn uurtarief?
Je tarief is meestal exclusief btw. Je factureert:
- Uren × tarief = subtotaal
- Subtotaal × 21% = btw
- Subtotaal + btw = totaal

Als je KOR gebruikt, reken je geen btw. Maar dan moet je dus hogere uurtarieven vragen om hetzelfde netto over te houden.

## De conclusie

Je uurtarief is niet "wat de markt betaalt". Het is "wat JIJ nodig hebt om gezond te ondernemen".

De formule is simpel:
1. Tel al je kosten op
2. Bereken je bruto inkomen nodig
3. Reserveer voor belasting
4. Deel door je billable uren
5. Voeg 15% marge toe

Dit is je minimale tarief. Vraag meer als de markt het toelaat. Maar vraag nooit minder.

Ik wist dit niet in 2024. Ik werkte 50 uur per week voor €20 netto per uur. Dat was een keuze - maar niet een bewuste.

Jij kunt het beter doen. Gebruik deze formule. Bereken je tarief. En vraag wat je waard bent.`,
    faq: [
      {
        question: 'Hoe bereken ik mijn uurtarief als ZZP\'er in 2026?',
        answer: 'Gebruik de formule: (Jaarlijkse kosten + Bruto inkomen nodig + Belastingreservering) / Billable uren. Billable uren zijn meestal 1.200-1.400 per jaar (70% van je werktijd). Voorbeeld: €58.500 nodig / 1.100 uren = €53/uur. Vraag €60-€65 voor marge.'
      },
      {
        question: 'Wat zijn marktconforme uurtarieven in 2026?',
        answer: 'Per branche: Junior developers €60-€80, medior €85-€110, senior €120-€150. Marketing: €50-€130. Design: €45-€120. Tekstschrijvers: €40-€115. Interim management: €125-€175+. Check platforms als Hoofdkraan en Freelance.nl voor actuele benchmarks.'
      },
      {
        question: 'Hoeveel billable uren heeft een ZZP\'er per jaar?',
        answer: 'Van 2.080 werkbare uren (40 uur × 52 weken), hou je circa 1.200-1.400 billable uren over. De rest gaat naar vakantie, ziekte, feestdagen, acquisitie, administratie, en niet-factureerbare werkzaamheden. Reken conservatief met 1.200 uren.'
      },
      {
        question: 'Moet ik btw meenemen in mijn uurtarief berekening?',
        answer: 'Nee, je berekent je tarief exclusief btw. De btw (21%) is geld dat je doorstuurt naar de Belastingdienst. Als je KOR gebruikt (geen btw), moet je wel hogere tarieven vragen omdat je ook geen btw kunt terugvragen over kosten.'
      },
      {
        question: 'Kan ik verschillende tarieven hanteren voor verschillende klanten?',
        answer: 'Ja, dat is gebruikelijk. Veel ZZP\'ers hebben een standaard tarief, een gereduceerd tarief (10-20% lager) voor vaste klanten of non-profits, en een spoedtarief (50% hoger) voor rush jobs. Communiceer dit transparant.'
      }
    ]
  },
  {
    id: '6',
    slug: 'kleineondernemersregeling-kor-2026',
    title: 'Kleineondernemersregeling (KOR) 2026: Mijn Ervaring + De Nieuwe Regels',
    metaDescription: 'De KOR in 2026: omzetgrens €20.000, nieuwe regels sinds 2025 (geen minimale termijn meer), en mijn eigen ervaring. Wanneer wel/niet gebruiken?',
    publishDate: '2026-02-01',
    readTime: 11,
    category: 'Belasting',
    tags: ['kor', 'kleineondernemersregeling', 'btw', 'vrijgesteld', '2026', 'omzetgrens'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De KOR beslissing die ik bijna verkeerd maakte

Eerste jaar als ZZP'er. €18.500 omzet. "Geweldig!" dacht ik. "Ik kom onder de KOR-grens, dus ik hoef geen btw te rekenen."

Ik heb me aangemeld bij de KOR. Een half jaar later kwam mijn eerste grote klant. €15.000 project. En toen realiseerde ik me: ik kon het niet aannemen zonder over de €20.000 grens heen te gaan.

Uitstappen uit de KOR betekende: een jaar wachten voordat ik weer in kon. (Sinds 2025 is dat gelukkig veranderd - meer daarover later.)

Dit is het verhaal over de kleineondernemersregeling dat je niet op de Belastingdienst-website leest.

## Wat is de KOR precies?

De **Kleineondernemersregeling (KOR)** is een vrijwillige regeling van de Belastingdienst. Als je gebruikmaakt van de KOR:

- Je rekent **geen btw** bij je klanten
- Je hoeft **geen btw-aangifte** te doen
- Je kunt ook **geen btw terugvragen** over je zakelijke kosten
- Je administratie wordt simpeler (geen btw-specificaties nodig)

Klinkt ideaal, toch? Dat is het ook. Maar alleen als je situatie past bij de regeling.

## De €20.000 grens in 2026: hoe zit het exact?

De omzetgrens voor de KOR is in 2026: **€20.000 per kalenderjaar** (exclusief btw).

Maar let op - dit telt anders dan je denkt:

### Wat telt WEL mee voor de €20.000:
- Alle diensten waar je normaal 21% btw over zou rekenen
- Verkoop van goederen
- Omzet uit verhuur van onroerend goed (ook al is dat btw-vrijgesteld)
- Financiële diensten (ook al zijn die btw-vrijgesteld)
- Verzekeringsdiensten

### Wat telt NIET mee:
- Medische diensten (artsen, fysiotherapeuten - zijn al btw-vrijgesteld)
- Journalistiek/writers werk
- Diensten buiten Nederland

**Belangrijk:** Je moet de omzet van het **huidige jaar** EN het **vorige jaar** beide onder de €20.000 houden.

Voorbeeld:
- 2025: €19.000 omzet
- 2026: €21.000 omzet
- Resultaat: Je moet in 2026 uit de KOR

## De grote verandering sinds 2025

Dit veranderde alles voor mij:

**Voor 2025:** Als je je eenmaal had aangemeld voor de KOR, moest je minimaal **3 jaar** blijven. Wilde je eruit? Dan moest je een jaar wachten voordat je weer in kon.

**Sinds 2025:** De verplichte deelnameperiode van 3 jaar is **vervallen**. Je kunt nu:
- Op elk moment uit de KOR stappen
- Je moet wel opzeggen vóór het einde van een kwartaal (dus uiterlijk een maand voor einde Q1/Q2/Q3/Q4)
- Je krijgt een "afkoelperiode" van 1 jaar: het volgende kalenderjaar én het resterende deel van het huidige jaar mag je niet opnieuw deelnemen

Dit is een gigantisch verschil. Vroeger was de KOR een risico. Nu is het een flexibele tool.

## Wanneer is de KOR een goed idee?

De KOR is voordelig als:

**Je hebt weinig zakelijke kosten met btw**
Bijvoorbeeld: consultants, trainers, coaches. Je hebt weinig inkoop, dus je krijgt weinig btw terug. De administratieve besparing is dan meer waard.

**Je omzet is stabiel onder €20.000**
Als je weet dat je niet snel gaat groeien, is de KOR perfect.

**Je werkt voornamelijk voor particulieren**
Particulieren kunnen btw niet terugvragen. Voor hen maakt het niet uit of jij wel of geen btw rekent.

## Wanneer moet je de KOR mijden?

De KOR is NIET voordelig als:

**Je hebt hoge zakelijke kosten met btw**
Laptop, kantoormeubilair, marketingkosten. Alles met btw. Als je veel inkoopt, mis je de teruggaaf van die btw.

**Rekenvoorbeeld:**
- Jaaromzet: €18.000
- Zakelijke kosten met btw: €8.000 (incl. €1.400 btw)
- Zonder KOR: je betaalt €3.060 btw (21% van €18.000), maar krijgt €1.400 terug. Netto: €1.660 btw aan Belastingdienst.
- Met KOR: je betaalt geen btw, maar krijgt ook de €1.400 niet terug.
- Verschil: **€1.400 nadeel** met de KOR

**Je verwacht snel te groeien**
De €20.000 grens komt sneller dan je denkt. Een paar goede maanden en je zit er boven.

**Je werkt voornamelijk voor zakelijke klanten**
Zakelijke klanten kunnen je btw terugvragen. Voor hen is het dus "om het even". Maar: sommige bedrijven geven de voorkeur aan btw-facturen omdat het hun administratie vereenvoudigt.

## Mijn eigen KOR-verhaal (update 2026)

Ik heb de KOR gebruikt in 2024. Daarna groeide mijn bedrijf en stapte ik eruit. In 2025 wilde ik weer terug - dat kon niet door de oude 3-jaarsregel.

Nu, in 2026, overweeg ik het opnieuw voor een nevenactiviteit. De nieuwe regels maken dit mogelijk zonder de oude beperkingen.

Mijn les: de KOR is een tool, geen levenslange keuze. Gebruik het wanneer het past, stap eruit als je groeit.

## Hoe meld je je aan voor de KOR?

Via **Mijn Belastingdienst Zakelijk**:
1. Inloggen met eHerkenning
2. Ga naar "Btw" > "Kleineondernemersregeling"
3. Vul het formulier in
4. Aanmelden kan tot 4 weken voor het kwartaal waarin je wilt starten

**Belangrijk:** Je kunt alleen aanmelden voor een volgend kwartaal. Start je 1 april? Dan moet je uiterlijk begin maart zijn aangemeld.

## Wat staat er op een KOR-factuur?

Je rekent geen btw, dus je factuur ziet er anders uit:

**Verplichte tekst (kies één):**
- "Factuur vrijgesteld van omzetbelasting artikel 25 lid 1 Wet OB"
- "Vrijgesteld van btw conform kleineondernemersregeling"

**Niet vergeten:**
- Je KVK-nummer staat er nog steeds op
- Je btw-nummer staat er NIET op (je hebt er immers geen)
- Geen btw-specificaties nodig

**Voorbeeld:**

---

**FACTUUR 2026-015**
Datum: 10 februari 2026

**Van:**  
Janssen Coaching  
KVK: 12345678  
Coachstraat 10  
1234 AB Amsterdam

**Aan:**  
Peter de Vries  
Kerkstraat 5  
5678 CD Rotterdam

---

**Vrijgesteld van btw conform kleineondernemersregeling**

| Omschrijving | Bedrag |
|--------------|--------|
| Coaching sessie 1 uur | €150,00 |

**Totaal:** €150,00

---

## De KOR en internationale klanten

Hier wordt het complex.

**Klant in Nederland:** Geen btw (jij bent vrijgesteld)

**Zakelijke klant in EU:** Btw verlegd (0%) - hun btw-nummer verplicht

**Particuliere klant in EU:** Btw van hun land (meestal 20-27%)

**Klant buiten EU:** 0% btw

Dit maakt de KOR minder aantrekkelijk als je internationaal werkt. Je moet dan meerdere regimes bijhouden.

## FAQ: de vragen die ik vaak krijg

### Kan ik de KOR combineren met een parttime baan?
Ja, je loondienst-inkomen telt niet mee voor de KOR-grens. Alleen je omzet als ondernemer.

### Wat als ik over de €20.000 heen ga?
Je moet direct stoppen met de KOR vanaf het moment dat je de grens passeert. Vanaf die dag moet je btw rekenen. Meld je af bij de Belastingdienst.

### Krijg ik boete als ik te laat uit de KOR stap?
Als je niet direct stopt nadat je de grens bent gepasseerd, moet je alsnog btw afdragen over de omzet boven de grens. Er is geen aparte boete, maar je betaalt wel achterstallige btw + eventueel rente.

### Kan ik de KOR gebruiken als ik een BV heb?
Ja, de KOR geldt voor alle rechtsvormen: eenmanszaak, BV, maar ook verenigingen en stichtingen.

### Moet ik nog btw-aangifte doen met de KOR?
Nee, dat is het hele punt. Je doet geen btw-aangifte meer. Je administratie wordt een stuk simpeler.

## De conclusie

De KOR is een cadeau voor kleine ondernemers. Maar het is geen "one size fits all".

Gebruik het als:
- Je omzet stabiel onder €20.000 blijft
- Je weinig zakelijke kosten met btw hebt
- Je niet snel verwacht te groeien

Vermijd het als:
- Je veel investeert in je bedrijf
- Je internationaal werkt
- Je snel wilt schalen

Mijn advies: start zonder KOR als je twijfelt. Je kunt er altijd later in stappen. Uitstappen is sinds 2025 makkelijker, maar nog steeds niet instant.`,
    faq: [
      {
        question: 'Wat is de omzetgrens voor de KOR in 2026?',
        answer: 'De omzetgrens is €20.000 per kalenderjaar (exclusief btw). Je moet zowel het huidige als het vorige jaar onder deze grens blijven. Let op: bepaalde vrijgestelde omzetten (zoals verhuur en financiële diensten) tellen wel mee voor de grens.'
      },
      {
        question: 'Is er nog steeds een minimale termijn voor de KOR?',
        answer: 'Nee, sinds 1 januari 2025 is de verplichte deelnameperiode van 3 jaar vervallen. Je kunt nu op elk moment uit de KOR stappen. Wel geldt er een afkoelperiode van 1 jaar: het resterende deel van het huidige jaar én het volgende kalenderjaar mag je niet opnieuw deelnemen.'
      },
      {
        question: 'Wat gebeurt er als ik over de €20.000 heen ga?',
        answer: 'Je moet onmiddellijk stoppen met de KOR vanaf het moment dat je de grens overschrijdt. Vanaf die dag moet je btw rekenen over nieuwe omzet. Je moet je afmelden bij de Belastingdienst en doet daarna gewoon btw-aangifte.'
      },
      {
        question: 'Kan ik btw terugvragen met de KOR?',
        answer: 'Nee, dat is het nadeel. Je rekent geen btw bij klanten, maar je kunt ook geen btw terugvragen over je eigen zakelijke aankopen (laptops, kantoorartikelen, etc.). Bij hoge zakelijke kosten kan dit een nadeel opleveren.'
      }
    ]
  },
  {
    id: '7',
    slug: 'btw-aangifte-doen-stappenplan-2026',
    title: 'BTW Aangifte 2026: Mijn Stappenplan (Van Paniek naar Controle)',
    metaDescription: 'BTW aangifte doen als ZZP\'er in 2026? Deadlines, boetes, en een praktisch stappenplan. Met screenshots van Mijn Belastingdienst en valkuilen die ik zelf maakte.',
    publishDate: '2026-03-15',
    readTime: 13,
    category: 'Belasting',
    tags: ['btw', 'aangifte', 'belastingdienst', 'kwartaal', 'zzp', '2026', 'deadline'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De btw-aangifte die me een nacht slaap kostte

Mijn eerste btw-aangifte. Q2 2024. Ik wist dat hij eraan kwam, maar had er bewust niet aan gedacht. Totdat de mail van de Belastingdienst in mijn inbox verscheen: "Herinnering: btw-aangifte 2e kwartaal."

Ik had geen idee waar te beginnen. Excel-sheets vol met facturen, bonnetjes, en vragen. Moest ik alle facturen invoeren? Wat was het verschil tussen 21% en 0%? En waarom stond er "voorbelasting" en "omzetbelasting"?

Die nacht sliep ik 3 uur. De volgende ochtend zat ik 4 uur te stoeien met cijfers die niet klopten. Uiteindelijk betaalde ik €50 te veel uit angst voor een boete.

Nu, twee jaar later, doe ik mijn btw-aangifte in 20 minuten. Dit is hoe.

## De belangrijkste deadlines voor 2026

**Kwartaalaangifte (standaard voor ZZP'ers):**
| Kwartaal | Periode | Indienen uiterlijk | Betalen uiterlijk |
|----------|---------|-------------------|-------------------|
| Q1 | Jan-Mar | 30 april 2026 | 30 april 2026 |
| Q2 | Apr-Jun | 31 juli 2026 | 31 juli 2026 |
| Q3 | Jul-Sep | 31 oktober 2026 | 31 oktober 2026 |
| Q4 | Okt-Dec | 31 januari 2027 | 31 januari 2027 |

**Let op:** De deadline is altijd de laatste dag van de maand VOLGEND op het kwartaal. Voor Q1 (eindigt 31 maart) is dat 30 april.

**Te laat?** De Belastingdienst rekent wettelijke rente vanaf de datum dat het geld had moeten zijn ontvangen. Daarnaast: 5% boete op het verschuldigde bedrag, minimaal €50. Bij herhaaldelijke overtredingen kan het oplopen tot €5.500.

**Tip:** Ik zet een herinnering in mijn agenda op de 15e van de maand ná het kwartaal. Dan heb ik 2 weken om het te regelen zonder stress.

## Voorbereiding: wat heb je nodig?

Voordat je begint, verzamel dit:

### 1. Alle facturen die je hebt VERSTUURD (verkoop)
- Factuurnummer, datum, bedrag excl. btw, btw-bedrag
- Per btw-tarief (21%, 9%, 0%)
- Per land (Nederland, EU, buiten EU)

### 2. Alle facturen die je hebt ONTVANGEN (inkoop)
- Zakelijke kosten met btw
- Laptop, software, kantoorartikelen, reiskosten
- Alles waar je btw op hebt betaald EN kunt terugvragen

**Let op:** Facturen voor eten/drinken (lunch met klant) zijn vaak maar deels aftrekbaar. Check de regels.

### 3. Je btw-nummer en inloggegevens Mijn Belastingdienst
- Je hebt eHerkenning nodig (regel dit van tevoren!)
- Of DigiD met sms-controle (beperkte functionaliteit)

### 4. Rekenhulp
- Ik gebruik een simpel Excel-sheet, maar een calculator werkt ook
- Of: gebruik de voorbeeldberekening hieronder

## Het stappenplan: van chaos naar controle

### Stap 1: Maak je verkoopoverzicht (omzet)

Dit is wat je aan klanten hebt gefactureerd.

**Voorbeeld Q1 2026:**
| Factuur | Datum | Bedrag excl. | Btw % | Btw bedrag | Totaal |
|---------|-------|--------------|-------|------------|--------|
| 2026-001 | 15 jan | €1.000 | 21% | €210 | €1.210 |
| 2026-002 | 03 feb | €2.500 | 21% | €525 | €3.025 |
| 2026-003 | 28 feb | €800 | 9% | €72 | €872 |
| **Totaal** | | **€4.300** | | **€807** | **€5.107** |

**Vul dit in bij Mijn Belastingdienst:**
- Omzetbelasting (hoog tarief 21%): €4.100 × 21% = €861
- Omzetbelasting (laag tarief 9%): €800 × 9% = €72
- Totaal omzetbelasting verschuldigd: €933

### Stap 2: Maak je inkoopoverzicht (voorbelasting)

Dit is wat je aan btw hebt betaald op zakelijke kosten.

**Voorbeeld:**
| Bon/Factuur | Wat | Bedrag excl. | Btw | Totaal |
|-------------|-----|--------------|-----|--------|
| Coolblue | Laptop | €1.200 | €252 | €1.452 |
| Adobe | Software | €600 | €126 | €726 |
| NS | Treinkaartjes | €400 | €0* | €400 |
| KPN | Internet | €50 | €10,50 | €60,50 |
| **Totaal** | | **€2.250** | **€388,50** | **€2.638,50** |

*NS is btw-vrijgesteld

**Vul dit in:**
- Voorbelasting (hoog tarief): €1.850 × 21% = €388,50
- Voorbelasting (laag tarief): €0
- Totaal voorbelasting: €388,50

### Stap 3: Bereken het saldo

Nu komt het:
- Omzetbelasting (btw die je klanten betaalden): €933
- Voorbelasting (btw die jij betaalde): - €388,50
- **Te betalen aan Belastingdienst: €544,50**

Of: als je meer btw hebt betaald dan ontvangen, krijg je geld TERUG.

**Voorbeeld teruggave:**
- Omzetbelasting: €500
- Voorbelasting (grote investering): - €2.000
- **Te ontvangen van Belastingdienst: €1.500**

Dit gebeurt vaak als je een dure laptop of auto koopt.

### Stap 4: Invoeren bij Mijn Belastingdienst

Log in op: **Mijn Belastingdienst Zakelijk**

1. Ga naar "Aangifte omzetbelasting"
2. Selecteer het juiste kwartaal
3. Vul de cijfers in:
   - 1a: Omzetbelasting 21% (hoog tarief)
   - 1b: Omzetbelasting 9% (laag tarief)
   - 1e: Omzetbelasting 0% / verlegd (alleen vermelden, geen bedrag)
   - 5b: Voorbelasting (wat je mag terugvragen)
4. Check het totaal
5. Verzend

**Belangrijk:** Je hoeft GEEN facturen te uploaden. Je moet ze wel 7 jaar bewaren voor controle.

## De speciale situaties (waar ik tegenaan liep)

### 1. Btw-verlegd factureren (buitenlandse klanten)

Factureer je aan een bedrijf in Duitsland? Dan reken je 0% btw, maar je moet het WEL vermelden.

**Invullen:**
- Rubriek 1e: Omzetbelasting overige diensten (0% / verlegd)
- Vermeld het bedrag, maar het telt niet mee voor het te betalen bedrag

**Checklist:**
- Btw-nummer klant gecheckt via VIES? ✓
- Op factuur "btw verlegd" vermeld? ✓
- Verplichte tekst op factuur? ✓

### 2. KOR (kleineondernemersregeling)

Gebruik je de KOR? Dan doe je GEEN btw-aangifte. Skip dit hele artikel.

**Controle:** Check in Mijn Belastingdienst of je nog steeds KOR-gebruiker bent. Soms "vergeten" ze je eruit te halen als je over de grens bent gegaan.

### 3. Prestaties aan particulieren in EU

Klant in België, maar een consument (geen bedrijf)? Dan reken je BELGISCHE btw (21%).

**Dit wordt complex.** Je moet:
- Btw registratie aanvragen in België, óf
- OSS-regeling (One Stop Shop) gebruiken via Nederland

**Advies:** Als je veel particuliere klanten in EU hebt, neem een boekhouder. Dit is niet DIY-terrein.

### 4. Correctie vorig kwartaal

Fout gemaakt in Q1? Je kunt het corrigeren in Q2.

**Hoe:**
- Vermeld het in toelichting
- Vermeld het bedrag als "Correctie Q1" bij de juiste rubriek
- De Belastingdienst verrekent het automatisch

## De toelichting: wat moet je invullen?

Onderaan de aangifte is een veld "Toelichting". Wat schrijf je daar?

**Standaard (als alles normaal is):**
> "Reguliere btw-aangifte. Geen bijzonderheden."

**Met correctie:**
> "Correctie Q1 2026: factuur 2026-008 dubbel geteld (-€210). Aangepast in rubriek 1a."

**Met investering:**
> "Hoge voorbelasting door aanschaf laptop (factuur XXX). Verwacht volgend kwartaal weer positief saldo."

**Tip:** Houd het kort. De Belastingdienst leest dit alleen als er vragen zijn.

## Praktische tips die ik te laat leerde

### Tip 1: Reserveer direct bij elke factuur

Ontvang je een betaling van €1.210 (incl. €210 btw)?
- €210 direct naar spaarrekening "btw"
- €1.000 naar zakelijke rekening

Doe dit per factuur. Niet per kwartaal. Dan heb je nooit een "oh nee"-moment.

### Tip 2: Houd een btw-logboek bij

Ik heb een simpel Google Sheet:
| Datum | Factuur | Bedrag excl. | Btw | Totaal | Betaald? |
|-------|---------|--------------|-----|--------|----------|
| 15 jan | 2026-001 | €1.000 | €210 | €1.210 | Ja |

Aan het einde van het kwartaal tel ik de btw-kolom op. Klaar.

### Tip 3: Check de Belastingdienst-app

De Belastingdienst heeft een app "Mijn Belastingdienst". Hier kun je:
- Deadlines zien
- Berichten ontvangen
- Snel inloggen (face ID)

Handig voor "oh wanneer moet het ook alweer?"

### Tip 4: Vraag uitstel als het echt niet lukt

Kun je niet op tijd betalen? Vraag voor de deadline uitstel aan via Mijn Belastingdienst.

- Uitstel aangifte: meestal automatisch goedgekeurd
- Uitstel betaling: je moet wel rente betalen, maar geen boete

**Belangrijk:** Vraag het VÓÓR de deadline aan. Achteraf werkt niet.

## FAQ: de vragen die ik het meest krijg

### Moet ik facturen uploaden bij de aangifte?
Nee, je vult alleen de totalen in. Bewaar de facturen 7 jaar. De Belastingdienst kan ze opvragen bij controle.

### Wat als mijn klant niet betaalt? Moet ik dan wel btw betalen?
Ja, zolang je de factuur hebt verstuurd, moet je de btw afdragen. Je kunt de btw terugvragen als de schuld écht oninbaar is (na 1 jaar en meerdere herinneringen). Dit heet "eigenschapswijziging".

### Kan ik btw-aangifte doen als ik geen eHerkenning heb?
Nee, je hebt eHerkenning niveau 3 nodig voor btw-aangifte. Regel dit minimaal 2 weken van tevoren via een certificaatleverancier (bijv. KPN, QuoVadis).

### Wat als ik alleen maar btw heb betaald (geen omzet)?
Dit gebeurt bij starten (investeringen). Je krijgt dan geld TERUG van de Belastingdienst. Vul gewoon in: voorbelasting is hoger dan omzetbelasting.

### Moet ik btw-aangifte doen als mijn omzet 0 is?
Ja, je moet altijd aangifte doen. Vul "0" in bij alle bedragen. Dit heet een "nihilaangifte".

### Wat is het verschil tussen voorbelasting en omzetbelasting?
- Omzetbelasting: btw die je klanten betalen (jij ontvangt het, moet het doorsturen)
- Voorbelasting: btw die jij betaalt op aankopen (jij betaalt het, mag het terugvragen)
- Saldo: het verschil dat je betaalt of terugkrijgt

### Kan ik btw-aangifte doen per maand ipv per kwartaal?
Ja, maar waarom zou je? Maandaangifte betekent 12x per jaar dit gedoe. Alleen als je enorme bedragen draait en cashflow belangrijk is (sneller teruggaves).

### Wat gebeurt er na het indienen?
De Belastingdienst controleert automatisch. Bij grote afwijkingen (te veel teruggave, opeens 0 omzet) komt er een vragenbrief. Bij normale aangiftes hoor je niets. Het geld wordt afgeschreven (of bijgeschreven) op de datum die je aangaf.

## Mijn conclusie na 8 kwartalen btw-aangifte

De eerste keer was een nachtmerrie. Nu is het een administratief klusje van 20 minuten.

Het geheim?
- Bijhouden per factuur (niet per kwartaal achteraf zoeken)
- Vaste structuur in Excel
- Direct reserveren van btw
- Herinnering in agenda

De btw-aangifte is niet moeilijk. Het is alleen vervelend als je het uitstelt en moet gaan zoeken.

Begin direct met het bijhouden. Je toekomstige zelf (en je nachtrust) zullen je dankbaar zijn.`,
    faq: [
      {
        question: 'Wanneer moet ik btw-aangifte doen in 2026?',
        answer: 'Voor ZZP\'ers is dit per kwartaal: Q1 uiterlijk 30 april, Q2 uiterlijk 31 juli, Q3 uiterlijk 31 oktober, Q4 uiterlijk 31 januari van het volgende jaar. De betaling moet ook op deze datum binnen zijn.'
      },
      {
        question: 'Wat is de boete als ik te laat ben met btw-aangifte?',
        answer: '5% van het verschuldigde bedrag, met een minimum van €50. Daarnaast wettelijke rente vanaf de vervaldatum. Bij herhaaldelijke overtredingen oplopend tot €5.500. Te laat betalen is erger dan te laat indienen - betaal altijd op tijd, ook als je de aangifte nog niet af hebt.'
      },
      {
        question: 'Hoe bereken ik wat ik moet betalen?',
        answer: 'Tel alle btw op die je hebt gefactureerd (21% of 9% van je omzet). Trek hier van af: de btw die jij hebt betaald op zakelijke aankopen (voorbelasting). Positief saldo = betalen aan Belastingdienst. Negatief saldo = teruggave van Belastingdienst.'
      },
      {
        question: 'Moet ik facturen uploaden bij de btw-aangifte?',
        answer: 'Nee, je vult alleen de totalen in. Bewaar je facturen wel 7 jaar. De Belastingdienst kan ze opvragen bij controle. Zorg voor een goede administratie zodat je de bedragen kunt onderbouwen.'
      },
      {
        question: 'Wat als ik geen eHerkenning heb?',
        answer: 'Je hebt eHerkenning niveau 3 nodig voor btw-aangifte. Regel dit minimaal 2 weken van tevoren via een erkende leverancier (KPN, QuoVadis, etc.). Zonder eHerkenning kun je geen aangifte doen - DigiD is niet voldoende voor btw-aangifte.'
      },
      {
        question: 'Moet ik aangifte doen als mijn omzet 0 is?',
        answer: 'Ja, je moet altijd aangifte doen, ook bij 0 omzet. Dit heet een "nihilaangifte". Vul 0 in bij alle bedragen en verzend. Zo blijft je administratie compleet en voorkom je boetes.'
      }
    ]
  },
  {
    id: '8',
    slug: 'btw-verlegd-2026-buitenlandse-klanten',
    title: 'BTW Verlegd 2026: De Complete Gids voor Buitenlandse Facturen (Met Voorbeelden)',
    metaDescription: 'BTW verlegd factureren in 2026? Wanneer wel/niet 0% btw naar EU. VIES-check, verplichte teksten, en verschillen particulier vs bedrijf. Mijn ervaring met Duitse klanten.',
    publishDate: '2026-03-10',
    readTime: 12,
    category: 'Facturatie',
    tags: ['btw', 'verlegd', 'buitenland', 'eu', 'internationaal', '2026', 'vies', '0-btw'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De Duitse klant die me €1.200 kostte

Mijn eerste internationale klant. Een softwarebedrijf in Berlijn. "Geweldig!" dacht ik. "Een grote opdracht van €8.000."

Ik factureerde met 0% btw. Btw verlegd, dacht ik. De klant betaalde netjes. Ik was trots op mijn eerste "internationale" factuur.

Totdat mijn boekhouder belde. "Je hebt geen VIES-check gedaan. De klant blijkt een eenmanszaak zonder btw-nummer te zijn. Je moet alsnog 19% Duitse btw betalen. En boetes."

€1.200 aan extra kosten. Voor een fout die ik had kunnen voorkomen met 2 minuten werk.

Dit is de gids die ik toen nodig had.

## Wat is btw verlegd precies?

**Btw verlegd** (0% btw) betekent dat jij géén btw berekent, maar dat je klant de btw moet afdragen in zijn eigen land.

**Wanneer gebruik je dit?**
- Zakelijke klanten in de EU (bedrijven, niet particulieren)
- Diensten die je levert aan dat bedrijf
- Je klant heeft een geldig EU-btw-nummer

**Het voordeel:** Je klant betaalt geen Nederlandse 21% btw, maar kan de btw in zijn eigen land terugvragen. Dat maakt je prijs concurrerender.

## De 2 cruciale regels voor btw verlegd

### Regel 1: Alleen voor zakelijke klanten

**Wel:** Bedrijven met een geldig EU-btw-nummer
**Niet:** Particulieren (consumenten)

**Voor particulieren in EU:** Je moet het btw-tarief van hun land rekenen (Duitsland 19%, België 21%, etc.)

### Regel 2: Altijd VIES-check doen

**VIES** (VAT Information Exchange System) is het Europese systeem om btw-nummers te checken.

**Waarom:** Je moet kunnen bewijzen dat je klant een geldig btw-nummer had op het moment van facturering.

**Hoe:** ec.europa.eu/taxation_customs/vies

**Screenshot maken!** Dit is je bewijs.

## Stap-voor-stap: btw verlegd factureren

### Stap 1: Check je klant

Vraag om het btw-nummer. Formaat landcode + cijfers:
- Duitsland: DE123456789
- België: BE0123456789
- Frankrijk: FR12345678901

### Stap 2: VIES-validatie

1. Ga naar ec.europa.eu/taxation_customs/vies
2. Selecteer het land van je klant
3. Vul het btw-nummer in
4. Check "Geldig bevestigd"
5. **Maak screenshot!**

**Belangrijk:** Check maximaal 1 maand voor facturatie. Oudere checks zijn minder waard.

### Stap 3: Factuur opstellen

**Vereisten op de factuur:**

1. **0% btw vermelden:**
   - "0% btw - btw verlegd naar afnemer"
   - OF: "Btw verlegd (artikel 44 WBTW)"

2. **Btw-nummer klant:**
   - Vermeld het gevalideerde btw-nummer

3. **Verplichte wettelijke tekst:**
   > "Dienst/levering onderworpen aan de heffing van omzetbelasting in het land van de afnemer"

4. **Je eigen btw-nummer:**
   - NL00XXXXXXXXB01 (EU-formaat)

**Voorbeeld factuur:**

---

**FACTUUR 2026-028**
Datum: 15 maart 2026

**Van:**  
Janssen Webdesign  
KVK: 12345678  
Btw: NL0012345678B01  
Straat 42, Amsterdam

**Aan:**  
Müller Software GmbH  
Btw: DE123456789  
Berliner Strasse 1, Berlijn

---

**Webdesign project website:** €8.000,00

**Subtotaal:** €8.000,00  
**Btw 0% (verlegd):** €0,00  
**Totaal:** €8.000,00

*0% btw - btw verlegd naar afnemer*  
*Dienst onderworpen aan de heffing van omzetbelasting in het land van de afnemer*

---

## Wanneer WEL btw verlegd?

### Diensten aan bedrijven in EU:
- Webdesign, software, consultancy
- Marketing, vertalingen, design
- Training, coaching (aan bedrijf)
- Interim werk

### Goederen binnen EU:
- Met transport (vrachtbrief als bewijs)
- Aan bedrijf met btw-nummer
- VIES-check verplicht

## Wanneer NIET btw verlegd?

### Particulieren in EU:
- Reken het btw-tarief van hun land
- Duitsland: 19%
- België: 21%
- Frankrijk: 20%

### Buiten de EU:
- 0% btw (export)
- Andere regels, geen VIES-check
- Douanepapieren als bewijs

### Bepaalde diensten:
- Onroerende diensten (altijd in land van pand)
- Personenvervoer
- Restaurant/catering ter plaatse

## De valkuilen die mij en anderen fopten

### Valkuil 1: "De klant zei dat hij een btw-nummer had"

Vertrouw niet. Check zelf via VIES.

**Gevolg van geen check:**
- Jij moet alsnog btw betalen
- Boetes van Belastingdienst
- Kan niet terugvorderen van klant

### Valkuil 2: Verkeerde btw-nummer

Typfout: DE123456788 ipv DE123456789

**Oplossing:** Kopieer plakken, niet typen. Check altijd 2x.

### Valkuil 3: Particulier vs bedrijf verkeerd inschatten

Een "freelancer" in Duitsland kan een eenmanszaak zijn ZONDER btw-nummer.

**Check:** Is er een geldig EU-btw-nummer? Zo ja: btw verlegd. Zo nee: Duitse 19% btw.

### Valkuil 4: Geen screenshot VIES-check

De Belastingdienst vraagt bewijs.

**Zonder bewijs:**
- Jij bent aansprakelijk
- Moet alsnog btw + boetes

**Oplossing:** Screenshot altijd opslaan bij factuur.

### Valkuil 5: OSS-regeling vergeten

Heb je veel particuliere klanten in EU?

**OSS (One Stop Shop):**
- Regel alle buitenlandse btw via Nederland
- Geen aparte registraties nodig
- Aanmelden via Belastingdienst

**Vanaf wanneer:** Als je >€10.000 omzet in EU hebt.

## Btw-aangifte bij verlegde btw

In je btw-aangifte (per kwartaal):

**Rubriek 1e: Omzetbelasting overige diensten (0% / verlegd)**
- Vermeld het totale bedrag
- Geen btw bedrag (dat is €0)

**Toelichting:**
> "Btw verlegd aan EU-klanten. VIES-checks gedaan en bewaard."

**Bewaring:**
- VIES-screenshots 10 jaar bewaren (internationale transacties)
- Facturen 10 jaar bewaren

## Speciale situaties

### ZZP'er in Duitsland zonder btw-nummer

- Geen btw verlegd mogelijk
- Je moet Duitse 19% btw rekenen
- Of: klant moet zich registreren voor btw

### Brexit (UK)

- VK is GEEN EU meer
- 0% btw (export)
- Andere regels dan EU
- Geen VIES-check

### Zwitserland, Noorwegen, IJsland

- Geen EU-lid
- Wel in EER (Europese Economische Ruimte)
- 0% btw voor bedrijven
- Geen VIES-check, wel btw-nummer vragen

## Praktische FAQ

### Moet ik altijd VIES-check doen?
Ja, voor elke nieuwe zakelijke EU-klant. Bij terugkerende klanten: periodiek checken (bijv. jaarlijks).

### Wat als VIES "niet beschikbaar" is?
Soms offline. Probeer later opnieuw. Documenteer dat je geprobeerd hebt.

### Kan ik btw verlegd achteraf corrigeren?
Als je te veel btw hebt betaald: gewoon verlegd factureren. Als je te weinig: creditfactuur + nieuwe factuur.

### Wat kost btw verlegd fout doen?
Kan duur zijn. Je moet alsnog btw betalen + 5-10% boete. Bij €10.000 factuur = €2.100-€2.200 extra.

### Is OSS verplicht?
Nee, maar wel handig als je veel particuliere EU-klanten hebt. Anders moet je in elk land apart registreren.

### Moet ik btw spreken met klant?
Nee, btw verlegd is fiscaal gunstiger voor hen (kunnen terugvragen). Leg uit dat het normal is voor internationale zaken.

## Mijn conclusie na €1.200 leergeld

Btw verlegd is niet moeilijk. Het is procedureel:

1. Vraag btw-nummer
2. Check VIES
3. Screenshot maken
4. Factuur met juiste tekst
5. Bewaren

De moeite? 5 minuten per klant.

Het risico? €1.200+ als je het fout doet.

Mijn advies: maak een checklist. Doe het stap voor stap. En betwijfel je? Bel een boekhouder.

Internationale klanten zijn goud waard. Maar alleen als je de btw-regels snapt.

En die Duitse klant? Die werkt nog steeds met me samen. Alleen nu doe ik eerst de VIES-check.`,
    faq: [
      {
        question: 'Wanneer moet ik btw verlegd factureren?',
        answer: 'Btw verlegd (0%) is voor zakelijke klanten in de EU met een geldig EU-btw-nummer. Particulieren betaalt altijd hun eigen btw-tarief. Je MOET een VIES-check doen om het btw-nummer te valideren - anders riskeer je boetes.'
      },
      {
        question: 'Hoe check ik een btw-nummer via VIES?',
        answer: 'Ga naar ec.europa.eu/taxation_customs/vies, selecteer het land, vul het btw-nummer in. Screenshot het resultaat als bewijs. Check maximaal 1 maand voor facturatie. Bewaar de screenshot 10 jaar bij je factuur.'
      },
      {
        question: 'Wat moet er op een btw-verlegd factuur staan?',
        answer: 'Verplicht: "0% btw - btw verlegd naar afnemer", het gevalideerde btw-nummer van de klant, en de tekst: "Dienst/levering onderworpen aan de heffing van omzetbelasting in het land van de afnemer". Ook je eigen EU-btw-nummer (NL00XXXXB01).'
      },
      {
        question: 'Wat is het risico als ik geen VIES-check doe?',
        answer: 'Als je klant geen geldig btw-nummer blijkt te hebben, moet jij alsnog de btw betalen + boetes (5-10%). Dit kan niet meer van de klant teruggevorderd worden. De VIES-check is gratis en 2 minuten werk - het is dom om het niet te doen.'
      },
      {
        question: 'Hoe zit het met particulieren in EU-landen?',
        answer: 'Particulieren (consumenten) betaalt altijd het btw-tarief van hun eigen land: Duitsland 19%, België 21%, Frankrijk 20%, etc. Gebruik de OSS-regeling (One Stop Shop) als je veel particuliere klanten in EU hebt (>€10.000 omzet).'
      }
    ]
  },
  {
    id: '9',
    slug: 'betalingsherinneringen-incasso-2026',
    title: 'Betalingsherinneringen 2026: Hoe Krijg Je Facturen Wél Betaald (Scripts + Templates)',
    metaDescription: 'Laattijdige betalingen? Herinneringen, aanmaningen, en incasso in 2026. Wettelijke rente 10,15%. Templates voor emails die werken. Mijn 90%-succes strategie.',
    publishDate: '2026-04-01',
    readTime: 12,
    category: 'Facturatie',
    tags: ['betalen', 'herinnering', 'incasso', 'termijn', 'achterstand', '2026', 'rente'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De €12.000 die 4 maanden te laat kwam

Mijn grootste factuur ooit. €12.000 voor een website project. Klaar opgeleverd. Klant blij. Factuur verstuurd.

En toen... niets.

14 dagen verstreken. Geen betaling. Ik stuurde een vriendelijke herinnering. Geen reactie.

30 dagen. Nog steeds niets. Ik belde. "Ja, ja, komt goed."

60 dagen. Begon ik te zweten. Dit was mijn inkomen voor 3 maanden.

90 dagen. Ik huurde een incassobureau in. Kosten: €600.

120 dagen. Eindelijk betaald. Minus €600 incassokosten. Netto: €11.400.

Dat had anders gekund. En dat gaat het voortaan ook.

## De betalingstermijn: standaard vs afgesproken

### Wettelijke standaard (als je niets afspreekt)

| Type klant | Standaard termijn |
|------------|-------------------|
| Zakelijke klanten | 30 dagen |
| Consumenten | 14 dagen |
| Overheid | 30 dagen (wettelijk max) |

### Wat is gebruikelijk in 2026?

| Termijn | Wanneer |
|---------|---------|
| 7 dagen | Spoed, bekende klanten |
| 14 dagen | Standaard voor de meeste ZZP'ers |
| 30 dagen | Grote bedrijven, overheid |
| 60 dagen | Alleen als je wanhopig bent |

**Mijn advies:** Begin met 14 dagen. Voor goede klanten: 30 dagen. Nooit 60 dagen accepteer zonder goede reden.

## De escalatie-ladder: van vriendelijk naar dreigend

### Stap 1: Herinnering (dag 1-5 na vervaldatum)

**Email template - vriendelijk:**

> Onderwerp: Herinnering factuur [nummer] - [bedrag]
>
> Beste [naam],
>
> Ik hoop dat alles goed is met jullie. Ik wilde even vragen of je mijn factuur van [datum] hebt ontvangen?
>
> Factuurnummer: [nummer]
> Bedrag: €[bedrag]
> Vervaldatum: [datum]
>
> Mocht je de factuur niet hebben ontvangen, stuur ik hem graag opnieuw.
>
> Met vriendelijke groet,
> [jouw naam]

**Resultaat:** 60-70% betaalt hierna.

### Stap 2: Tweede herinnering (dag 10-15)

**Email template - assertief:**

> Onderwerp: Tweede herinnering - factuur [nummer] - Betaling vereist
>
> Beste [naam],
>
> Op [datum] verstuurde ik factuur [nummer] voor €[bedrag]. De betalingstermijn van [aantal] dagen is inmiddels verstreken.
>
> Ik verzoek je vriendelijk om het openstaande bedrag binnen 5 werkdagen te voldoen.
>
> Bij laattijdige betaling ben ik genoodzaakt wettelijke rente (10,15% voor zakelijke klanten) en incassokosten in rekening te brengen.
>
> Met vriendelijke groet,
> [jouw naam]

**Resultaat:** 20-30% extra betaalt.

### Stap 3: Aanmaning (dag 25-30)

**Aangetekende brief of email met read receipt:**

> Onderwerp: LAATSTE AANMANING - Factuur [nummer] - Betaling binnen 7 dagen
>
> Geachte [naam],
>
> Ondanks twee herinneringen is factuur [nummer] (€[bedrag]) nog steeds niet voldaan.
>
> Dit is een laatste aanmaning. Ik verzoek u dringend om het openstaande bedrag inclusief wettelijke rente (10,15%) binnen 7 dagen te voldoen.
>
> Indien niet betaald, draag ik de vordering over aan een incassobureau. Alle bijkomende kosten zijn voor uw rekening.
>
> Met betrekking,
> [jouw naam]

**Resultaat:** 5-10% extra betaalt.

### Stap 4: Incasso (dag 40-60)

**Je opties:**
1. **Incassobureau:** Kosten 5-15% van het bedrag, meestal succesvol
2. **Juridische incasso:** Via advocaat, duurder maar effectiever
3. **Kantonrechter:** Voor bedragen tot €25.000, goedkoop maar tijdrovend
4. **Bailiff (deurwaarder):** Als ze niet betalen na vonnis

**Mijn ervaring:** Incassobureau werkt 80% van de tijd. Kost 10%, maar je hoeft niets te doen.

## Wettelijke rente 2026

### Voor zakelijke klanten (B2B):

**Wettelijke handelsrente 2026:** 10,15%

Deze rente wordt berekend vanaf de vervaldatum tot de dag van betaling.

**Voorbeeld:**
- Factuur: €5.000
- Vervaldatum: 1 januari
- Betaaldatum: 1 april (90 dagen te laat)
- Rentekosten: €5.000 × 10,15% × (90/365) = €125,14

### Voor consumenten (B2C):

**Wettelijke rente 2026:** 4% + ECB-rente (circa 4% = totaal 4%)

Ja, consumenten krijgen lagere rente. Maar je mag WEL hogere kosten in rekening brengen.

## Incassokosten 2026

De Wet normering buitengerechtelijke incassokosten bepaalt het maximum:

| Openstaand bedrag | Maximale incassokosten |
|-------------------|------------------------|
| Tot €2.500 | €40 |
| €2.500 - €5.000 | €50 |
| €5.000 - €10.000 | €60 |
| €10.000+ | €80 + 10% van bedrag boven €10.000 |

**Let op:** Dit is wat JIJ mag vragen van je klant. Het incassobureau rekent aparte kosten.

## De preventie-strategie die ik nu gebruik

### 1. Betalingstermijn duidelijk communiceren

Zet op je offerte:
> "Betalingstermijn: 14 dagen na factuurdatum. Bij laattijdige betaling: wettelijke rente (10,15%) + incassokosten."

### 2. Vooruitbetaling voor nieuwe klanten

**Email bij eerste opdracht:**
> "Voor nieuwe klanten hanteren wij 50% aanbetaling voor aanvang van het werk. Het resterende bedrag binnen 14 dagen na oplevering."

Dit filtert wanbetalers eruit.

### 3. Automatische herinneringen

Gebruik je boekhoudsoftware:
- Herinnering dag 7
- Herinnering dag 14
- Aanmaning dag 21

Ik gebruik Moneybird - doet het automatisch.

### 4. De "late payer" detectie

Signalen dat een klant problemen heeft:
- Vraagt meteen 30+ dagen termijn
- "We betalen altijd aan het einde van de maand"
- Groot bedrijf maar complexe "procurement" procedure
- Geen referenties willen geven

**Mijn regel:** Dan 50% vooraf. Geen uitzonderingen.

## De "mag ik dit wel?" checklist

### Mag ik rente berekenen?
✓ Ja, wettelijke rente is altijd toegestaan na vervaldatum.

### Mag ik incassokosten vragen?
✓ Ja, maar volgens de wettelijke schaal (max €80-10%).

### Mag ik een incassobureau inschakelen?
✓ Ja, na meerdere herinneringen.

### Mag ik werk stopzetten bij niet-betalen?
✓ Ja, als dat in je algemene voorwaarden staat.

### Mag ik openstaande facturen publiceren?
✗ Nee, dat is smaad. Alleen bij gerechtelijke uitspraak.

## Mijn huidige succesratio

| Stap | Percentage | Cumulatief |
|------|-----------|------------|
| Factuur verstuurd | 100% | - |
| Betaald binnen termijn | 70% | 70% |
| Na 1e herinnering | 20% | 90% |
| Na 2e herinnering | 6% | 96% |
| Na aanmaning | 2% | 98% |
| Incasso | 1% | 99% |
| Afgeschreven | 1% | 100% |

Slechts 1% van mijn facturen eindigt in (gedeeltelijk) verlies.

## Tools die ik gebruik

- **Moneybird:** Automatische herinneringen
- **Deurwaarders.nl:** Incasso indienen (online)
- **Juridisch Loket:** Gratis advies bij geschillen
- **Kantonrechter.nl:** Online procedure tot €25.000

## De conclusie

Niet-betalende klanten zijn een pest. Maar met een systeem hou je het beheersbaar.

Mijn gouden regels:
1. Duidelijke afspraken vooraf
2. Automatische herinneringen
3. Snel escaleren (wacht niet te lang)
4. Geen emotie, gewoon procedure
5. Nieuwe klanten = vooruitbetaling

Die €12.000 factuur had met deze strategie 60 dagen eerder betaald kunnen zijn. Dat leer je alleen door het fout te doen.

Jij hoeft die les niet te herhalen.

En mocht je nu een openstaande factuur hebben: stuur vandaag nog die eerste herinnering. Wacht niet.`,
    faq: [
      {
        question: 'Wanneer moet ik een herinnering sturen?',
        answer: 'Stuur de eerste herinnering 1-3 dagen na de vervaldatum. Wacht niet te lang - hoe langer je wacht, hoe kleiner de kans op betaling. Na 30 dagen stuur je een aanmaning, na 60 dagen overweeg je incasso.'
      },
      {
        question: 'Wat kost een incassobureau?',
        answer: 'Incassobureaus rekenen meestal 5-15% van het geïnde bedrag. Sommigen vragen een starttarief van €50-150. Bereken of het de kosten waard is voor jouw openstaande factuur.'
      },
      {
        question: 'Kan ik rente berekenen over laattijdige betaling?',
        answer: 'Ja, voor B2B facturen mag je wettelijke rente (10,15% in 2026) berekenen vanaf de vervaldatum. Je moet dit wel vermelden in je algemene voorwaarden of op de factuur.'
      },
      {
        question: 'Wat als een klant failliet gaat?',
        answer: 'Meld je bij de curator als preferente of concurrente crediteur. Meestal krijg je 0-10% terug. Voor grote bedragen: overweeg een verzekering tegen debiteurenverlies.'
      },
      {
        question: 'Hoe voorkom ik betalingsproblemen?',
        answer: '1) Duidelijke afspraken vooraf, 2) Vooruitbetaling voor nieuwe klanten, 3) Automatische herinneringen, 4) Blijf communiceren, 5) Werk met een betrouwbaar incassobureau.'
      }
    ]
  },
  {
    id: '10',
    slug: 'korting-factuur-2026-btw-berekenen',
    title: 'Korting op Factuur 2026: BTW Berekenen Bij Staffel, Vroegbetaling & Meer',
    metaDescription: 'Hoe bereken je btw bij korting in 2026? Vroegbetalingskorting, staffelkorting, en kortingscodes. Voorbeelden en valkuilen die je geld kosten.',
    publishDate: '2026-04-08',
    readTime: 9,
    category: 'Facturatie',
    tags: ['korting', 'btw', 'berekenen', 'factuur', 'discount', '2026', 'vroegbetalingskorting'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De korting die me €150 kostte

"2% korting als je binnen 7 dagen betaalt," stond er op mijn factuur. De klant betaalde keurig binnen 5 dagen. Ik gaf €160 korting op een €8.000 factuur.

Pas bij de btw-aangifte realiseerde ik me: ik had de btw over het VOLLE bedrag berekend, niet over het bedrag NA korting.

Dus:
- Ik berekende 21% over €8.000 = €1.680
- Had moeten zijn: 21% over €7.840 = €1.646
- Verschil: €34 te veel aan btw ontvangen
- €34 terugbetalen aan klant
- Plus correctie in volgende btw-aangifte

Een stomme fout. Maar wel een die makkelijk te maken is. Dit is hoe je het voorkomt.

## De gouden regel: btw over bedrag NA korting

Altijd. Zonder uitzondering.

| Kortingsbedrag | Btw-berekening | Correct |
|----------------|----------------|---------|
| €1.000 → 10% = €900 | €900 × 21% = €189 | ✓ |
| €1.000 → 10% = €900 | €1.000 × 21% = €210 | ✗ |

De btw is een belasting over de werkelijk betaalde prijs. Geen korting = lagere prijs = minder btw.

## De 4 soorten korting en hoe ze werken

### 1. Vroegbetalingskorting (betalingskorting)

**Wat:** Korting voor snelle betaling.
**Voorbeeld:** 2% bij betaling binnen 7 dagen.

**Berekening:**
\`\`\`
Factuur: €5.000
Vroegbetalingskorting: €5.000 × 2% = €100
Te betalen: €4.900
Btw: €4.900 × 21% = €1.029
Totaal: €5.929
\`\`\`

**Factuur tekst:**
\`\`\`
Subtotaal: €5.000,00
Vroegbetalingskorting 2%: - €100,00
Te betalen: €4.900,00
Btw 21%: €1.029,00
Totaal inclusief btw: €5.929,00

*2% korting bij betaling binnen 7 dagen na factuurdatum*
\`\`\`

### 2. Staffelkorting (hoeveelheidskorting)

**Wat:** Korting bij grote aantallen.
**Voorbeeld:** 5% bij 10+ uur, 10% bij 20+ uur.

**Berekening:**
\`\`\`
20 uur × €100/uur = €2.000
Staffelkorting 10%: - €200
Te betalen: €1.800
Btw 21%: €378
Totaal: €2.178
\`\`\`

**Factuur tekst:**
\`\`\`
Consultancy 20 uur: €2.000,00
Staffelkorting 10%: - €200,00
Subtotaal: €1.800,00
Btw 21%: €378,00
Totaal: €2.178,00
\`\`\`

### 3. Kortingscode/actiekorting

**Wat:** Marketingkorting, eenmalig.
**Voorbeeld:** "WELKOM10" geeft 10% korting.

**Berekening:**
\`\`\`
Webdesign pakket: €3.500
Kortingscode WELKOM10: - €350
Te betalen: €3.150
Btw 21%: €661,50
Totaal: €3.811,50
\`\`\`

**Let op:** Als je KOR gebruikt (geen btw), is de korting eenvoudiger. Maar de berekening is hetzelfde.

### 4. Nabetaling (achteraf korting)

**Wat:** Na de factuur besluit je korting te geven (bij klacht, goedwilligheid).

**Hoe:**
1. Creditfactuur maken voor de korting
2. Btw op de creditfactuur = btw op de korting

**Voorbeeld:**
\`\`\`
Oorspronkelijke factuur: €1.000 + €210 btw = €1.210
Nabetaling korting 5%: €50
Creditfactuur: - €50 + - €10,50 btw = - €60,50
Totaal correctie: €950 + €199,50 btw = €1.149,50
\`\`\`

## Valkuil: wanneer begint de btw over de korting?

### Scenario 1: Korting bij factuur (vast)

**Btw over bedrag NA korting.**

\`\`\`
Product: €1.000
Korting: - €100
Btw over: €900 × 21% = €189
\`\`\`

### Scenario 2: Korting bij betaling (voorwaardelijk)

Hier wordt het complex.

**Wetenschappelijk correct:** Je weet pas NA betaling of de korting van toepassing is.

**Praktisch meestal:** Btw over volle bedrag, corrigeren bij betaling met korting.

**Optie A (eenvoudig):**
\`\`\`
Factuur:
€1.000 + €210 btw = €1.210
*2% korting mogelijk bij betaling binnen 7 dagen*

Klant betaalt met korting: €1.000 - €20 = €980 + €210 = €1.190
Jouw correctie: €20 korting aftrekken van omzet
\`\`\`

**Optie B (correct):**
\`\`\`
Factuur met 2 mogelijke bedragen:
Bedrag A (zonder korting): €1.000 + €210 = €1.210
Bedrag B (met korting): €980 + €205,80 = €1.185,80
*2% korting bij betaling binnen 7 dagen*

Klant betaalt Bedrag B → Geen correctie nodig
Klant betaalt Bedrag A → Gewoon verwerken
\`\`\`

**Advies:** Optie A voor kleine kortingen. Optie B voor grote bedragen (>€5.000).

## Korting op creditfactuur

**Situatie:** Je hebt te veel gefactureerd, geeft korting achteraf.

**Werkwijze:**
1. Creditfactuur voor volledige oorspronkelijke factuur
2. Nieuwe factuur met korting

**Of (voor gedeeltelijke korting):**
1. Creditfactuur alleen voor kortingbedrag
2. Negatieve btw op creditfactuur

**Voorbeeld:**
\`\`\`
Oorspronkelijk: €2.000 + €420 btw = €2.420
Korting achteraf 10%: €200
Creditfactuur: - €200 - €42 btw = - €242
Nieuw totaal: €1.800 + €378 btw = €2.178
\`\`\`

## Speciale situaties

### Korting bij KOR (kleineondernemersregeling)

Gebruik je de KOR?

\`\`\`
Factuur: €1.000
Korting: - €100
Te betalen: €900
Geen btw (KOR)
Totaal: €900
\`\`\`

**Simpeler:** Geen btw-berekening nodig.

### Korting bij gemengde btw-tarieven

**Voorbeeld:**
\`\`\`
Dienst (21%): €800
Boek (9%): €200
Totaal: €1.000
Korting 10%: - €100

Verdeling korting:
- Op dienst: €80 (21%)
- Op boek: €20 (9%)

Berekening:
Dienst: €720 × 21% = €151,20
Boek: €180 × 9% = €16,20
Totaal btw: €167,40
\`\`\`

**Regel:** Verdeel korting evenredig over de btw-tarieven.

### Korting bij btw-verlegd (0%)

\`\`\`
Factuur bedrag: €5.000
Korting: - €250
Te betalen: €4.750
Btw: 0% (verlegd)
Totaal: €4.750
\`\`\`

Geen btw-berekening nodig. Korting gaat van het netto bedrag.

## Praktische FAQ

### Moet ik op de factuur aangeven hoeveel korting er is?
Ja, transparantie is verplicht. Vermeld altijd:
- Kortingspercentage of bedrag
- Nieuw subtotaal NA korting
- Btw over het bedrag NA korting

### Wat als klant te laat betaalt maar wel korting aftrekt?
Dit gebeurt vaak. Reactie: "De korting was alleen geldig bij betaling binnen [X] dagen. Het resterende bedrag is €[bedrag]."

### Kan ik btw later corrigeren als ik te veel berekende?
Ja, in de volgende btw-aangifte. Vermeld het als correctie met toelichting.

### Wat is beter: korting geven of niet?
Korting kost omzet. Maar het stimuleert betaling. Mijn ervaring: 2% vroegbetalingskorting levert 30% snellere betaling op. Dat is het waard.

### Moet ik korting op mijn website vermelden?
Als je standaardkorting geeft: ja. Het is transparant en klanten waarderen het.

## De conclusie

Korting geven is simpel. De btw-berekening erbij is dat ook - als je het goed doet.

**Onthoud:**
1. Btw over bedrag NA korting
2. Vermeld korting duidelijk op factuur
3. Correctie via creditfactuur bij achteraf korting
4. Bewaar alle kortingsafspraken

Die €150 die ik verloor? Dat was leergeld. Nu ik het systeem snap, gebruik ik korting als strategisch instrument.

En jij? Gebruik korting om klanten te belonen én sneller te laten betalen. Maar bereken de btw correct.`,
    faq: [
      {
        question: 'Hoe bereken ik btw bij korting op een factuur?',
        answer: 'Btw bereken je altijd over het bedrag NA korting. Voorbeeld: factuur van €1.000 met 10% korting = €900. Btw is 21% van €900 = €189. Totaal te betalen: €1.089.'
      },
      {
        question: 'Wat is het verschil tussen vroegbetalingskorting en staffelkorting?',
        answer: 'Vroegbetalingskorting is voor snelle betaling (bijv. 2% bij betaling binnen 7 dagen). Staffelkorting is voor grote aantallen (bijv. 5% bij 10+ uur). De btw-berekening is hetzelfde: over het bedrag na korting.'
      },
      {
        question: 'Kan ik korting geven zonder btw te berekenen?',
        answer: 'Nee, btw is altijd verschuldigd over het werkelijk betaalde bedrag. Ook bij korting moet je btw berekenen over het bedrag na korting. Alleen bij KOR (kleineondernemersregeling) is er geen btw.'
      },
      {
        question: 'Hoe corrigeer ik een factuur met verkeerde korting?',
        answer: 'Maak een creditfactuur voor het originele bedrag en stuur een nieuwe factuur met de correcte korting. Vermeld bij de creditfactuur dat het een correctie betreft.'
      },
      {
        question: 'Wat als een klant te laat betaalt maar wel korting aftrekt?',
        answer: 'De korting was alleen geldig bij betaling binnen de afgesproken termijn. Je kunt het resterende bedrag factureren. Vermeld dit duidelijk op de factuur: "Korting alleen bij betaling binnen X dagen."'
      }
    ]
  },
  {
    id: '11',
    slug: 'factuur-geldigheidsduur-2026',
    title: 'Hoe Lang is een Factuur Geldig? Verjaring, Termijnen & Je Rechten (2026)',
    metaDescription: 'Hoe lang blijft een factuur geldig in 2026? 5 jaar verjaring, betalingstermijnen, en wat je kunt doen bij laattijdige betaling. Mijn ervaring met oude facturen.',
    publishDate: '2026-04-12',
    readTime: 8,
    category: 'Facturatie',
    tags: ['geldigheid', 'verjaring', 'termijn', 'factuur', 'wettelijk', '2026'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De factuur van 4 jaar geleden die plotseling betaald werd

Februari 2026. Ik checkte mijn oude administratie voor de jaarlijkse aangifte. Daar zag ik hem liggen: Factuur 2022-089. €3.400. Nog steeds onbetaald.

Ik had hem allang afgeschreven. "Verjaard," dacht ik. "Kan ik niets meer mee."

Maar iets zei me: stuur nog één bericht. Dus ik mailde de klant. Vriendelijk, zonder verwijt. "Oude factuur uit 2022 nog openstaand. Mogelijk over het hoofd gezien?"

Drie dagen later: €3.400 op mijn rekening. Met excuses.

Dit is wat je moet weten over de geldigheid van facturen. En waarom "verjaard" niet altijd "verloren" betekent.

## De gouden regel: 5 jaar verjaring

In Nederland geldt een **verjaringstermijn van 5 jaar** voor vorderingen uit handelstransacties (artikel 3:310 BW).

**Wat betekent dit?**
- Na 5 jaar kun je een klant NIET meer dwingen te betalen via de rechter
- De schuld bestaat WEL nog (morele verplichting)
- De klant kan vrijwillig betalen

**Vanaf wanneer?**
- Vanaf de vervaldatum (betalingstermijn)
- Niet vanaf factuurdatum

**Voorbeeld:**
\`\`\`
Factuurdatum: 1 maart 2022
Betalingstermijn: 30 dagen
Vervaldatum: 31 maart 2022
Verjaard: 31 maart 2027
\`\`\`

## De "levensloop" van een factuur

| Tijd | Status | Wat je kunt doen |
|------|--------|-----------------|
| 0-30 dagen | Openstaand | Eerste herinnering |
| 30-90 dagen | Achterstallig | Herinneringen, aanmaning |
| 90-365 dagen | Laattijdig | Incasso, juridische stappen |
| 1-5 jaar | Oud maar geldig | Betaling eisen, rechtszaak |
| 5+ jaar | Verjaard | Alleen vrijwillige betaling |

## Wat doe je bij een oude factuur (1-5 jaar)?

### Stap 1: Check je administratie
- Is de factuur correct verstuurd?
- Heb je bewijs van verzending?
- Is de klant nog actief?

### Stap 2: Neem contact op
> "Beste [naam],
> 
> Bij het doorlopen van onze administratie zag ik dat factuur [nummer] van [datum] (€[bedrag]) nog als openstaand staat gemarkeerd.
> 
> Dit kan een administratieve fout van ons zijn, maar ik wilde toch even checken of deze factuur bij jullie is betaald? Mocht dat zo zijn, dan ontvang ik graag een betalingsbewijs zodat ik onze boekhouding kan corrigeren.
> 
> Alvast bedankt,
> [jij]"

**Belangrijk:** Geen verwijten. Gewoon informatief. Dit werkt verrassend vaak.

### Stap 3: Bied een betalingsregeling
Voor oude facturen: "We kunnen dit ook in termijnen regelen: 3x €500."

Dit verlaagt de drempel enorm.

### Stap 4: Juridische stappen (tot 5 jaar)
- Kantonrechterprocedure (tot €25.000)
- Incassobureau
- Vordering verkopen aan incassobureau (krijg je ~20-30%)

## Wat doe je bij een verjaarde factuur (5+ jaar)?

### Optie 1: Afschrijven als debiteurenverlies

**In je boekhouding:**
\`\`\`
Datum: [vandaag]
Omschrijving: Afschrijven debiteur [naam], factuur [nummer]
Bedrag: -€[bedrag]
Kosten: Verlies op vordering
\`\`\`

**Belasting:**
- Bij eenmanszaak: aftrekbaar als debiteurenverlies
- Bij BV: afschrijven op vordering
- Documenteer de verjaring

### Optie 2: Proberen te innen (werkt soms!)

**Mijn truc:** 
> "Beste [naam],
> 
> Dit bericht betreft een oude openstaande post uit [jaar]. We ruimen onze administratie op en ik zag dat factuur [nummer] (€[bedrag]) destijds niet is voldaan.
> 
> Mogelijk is dit over het hoofd gezien. Het gaat hier om een reeds verjaarde vordering, dus er is geen juridische verplichting meer. Maar mocht je het willen regulariseren, stuur ik graag een nieuwe factuur.
> 
> Met vriendelijke groet,
> [jij]"

**Psychologisch:** 
- Geen druk ("verjaard")
- Eerlijk ("geen juridische verplichting")
- Optie om te betalen ("regulariseren")

Ik heb hiermee 15% van verjaarde facturen alsnog geïnd. Meestal deels korting gegeven, maar toch.

## Praktische FAQ

### Kan ik een factuur verlengen/vernieuwen?
Je kunt een nieuwe factuur sturen, maar de verjaringstermijn blijft 5 jaar vanaf de oorspronkelijke vervaldatum. Een nieuwe factuur "vernieuwt" de vordering niet juridisch.

### Wat als de klant failliet is?
Dan heb je pech. Meld je bij de curator als preferente of concurrente crediteur. Meestal krijg je 0-10% terug.

### Moet ik verjaarde facturen bewaren?
Ja, 7 jaar voor je administratie. Ook al zijn ze verjaard.

### Kan ik rente berekenen over oude facturen?
Ja, wettelijke rente (10,15% voor B2B) vanaf vervaldatum tot betaling. Maar bij verjaarde facturen is dit vaak moeilijk te incasseren.

### Wat als de klant stuurt: "deze factuur is verjaard"?
Dan heeft hij gelijk. Je kunt niet meer afdwingen. Maar je kunt wel vragen om vrijwillige betaling.

## De conclusie

Een factuur wordt juridisch gezien "te oud" na 5 jaar. Maar dat betekent niet dat je er niets meer mee kunt.

Mijn advies:
1. **Binnen 1 jaar:** Aggressief innen (herinneringen, incasso)
2. **1-5 jaar:** Contact opnemen, betalingsregeling aanbieden
3. **Na 5 jaar:** Afschrijven, maar proberen kan geen kwaad

En die €3.400 van 2022? Die zit inmiddels op mijn rekening. Soms is geduld een schone zaak.

Maar wacht niet te lang met nieuwe facturen. De eerste 90 dagen zijn cruciaal.`,
    faq: [
      {
        question: 'Hoe lang is een factuur geldig in Nederland?',
        answer: 'Een factuur is 5 jaar geldig voor juridische invordering (verjaringstermijn). De verjaring loopt vanaf de vervaldatum, niet de factuurdatum. Na 5 jaar kun je niet meer via de rechter afdwingen, maar vrijwillige betaling is nog mogelijk.'
      },
      {
        question: 'Wat is de wettelijke betalingstermijn voor facturen?',
        answer: 'Voor zakelijke facturen (B2B) is de standaardtermijn 30 dagen. Voor consumenten (B2C) maximaal 60 dagen. Je kunt afwijken door andere termijnen op de factuur te vermelden, maar 14 of 30 dagen is gebruikelijk.'
      },
      {
        question: 'Kan ik een factuur verlengen of vernieuwen na 5 jaar?',
        answer: 'Je kunt een nieuwe factuur sturen, maar de verjaringstermijn blijft 5 jaar vanaf de oorspronkelijke vervaldatum. Een nieuwe factuur "vernieuwt" de vordering niet juridisch. De oorspronkelijke vordering blijft verjaard.'
      },
      {
        question: 'Wat moet ik doen met een onbetaalde factuur na 5 jaar?',
        answer: 'Afschrijven als debiteurenverlies in je boekhouding. Bij eenmanszaak is dit aftrekbaar. Je kunt nog wel proberen te innen via een vriendelijke herinnering - soms betaalt een klant alsnog vrijwillig.'
      },
      {
        question: 'Moet ik verjaarde facturen bewaren?',
        answer: 'Ja, 7 jaar voor je administratie (ook al zijn ze verjaard). De Belastingdienst kan om inzage vragen. Bewaar ze in je archief, gescheiden van actieve vorderingen.'
      }
    ]
  },
  {
    id: '12',
    slug: 'verplichte-vermeldingen-factuur-2026',
    title: 'Verplichte Vermeldingen op de Factuur 2026: De Checklist Die Je Nodig Hebt',
    metaDescription: 'Wat MOET er op je factuur staan in 2026? De 9 verplichte elementen volgens Artikel 35a Wet OB. Met voorbeeld en fouten die de Belastingdienst afkeurt.',
    publishDate: '2026-04-15',
    readTime: 10,
    category: 'Facturatie',
    tags: ['verplicht', 'factuur', 'wetgeving', 'gegevens', 'checklist', '2026', 'artikel-35a'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De factuur die de Belastingdienst afkeurde

Het was mijn eerste grote audit. De controleur keek naar mijn factuur 2024-042 en schudde zijn hoofd. "Deze factuur voldoet niet aan Artikel 35a Wet OB."

Wat miste er? Het factuurnummer stond er niet op. Gewoon vergeten. Een domme fout.

Gevolg: De btw van die factuur (€420) werd NIET geaccepteerd als voorbelasting. De klant kon het wel terugvragen, maar ik kreeg mijn eigen btw niet terug.

Sindsdien heb ik een checklist. Die deel ik hier.

## De 9 verplichte elementen (Artikel 35a Wet OB)

### 1. Factuurnummer (uniek opeenvolgend)

**Wat:** Een uniek nummer per factuur.
**Let op:** Moet opeenvolgend zijn (geen gaten).

**Goed:**
- 2026-001, 2026-002, 2026-003
- F001, F002, F003
- 001-2026, 002-2026

**Fout:**
- Willekeurige nummers
- Dezelfde nummers hergebruiken
- Gaten in de reeks

### 2. Factuurdatum

**Wat:** De datum waarop de factuur is opgesteld.
**Formaat:** DD-MM-JJJJ of JJJJ-MM-DD.

**Belangrijk:** Dit bepaalt in welk kwartaal de btw valt.

### 3. Naam en adres van jou (de leverancier)

**Wat:** Jouw bedrijfsnaam en adres.
**Voor eenmanszaak:** Je eigen naam + "eenmanszaak" + adres.

**Voorbeeld:**
\`\`\`
Jan Janssen Webdesign (eenmanszaak)
Kerkstraat 10
1234 AB Amsterdam
\`\`\`

### 4. KVK-nummer

**Wat:** Je 8-cijferige KVK-nummer.
**Niet verwarren met:** Btw-nummer (dat is iets anders).

**Voorbeeld:** KVK: 12345678

### 5. Btw-nummer (als je btw hebt)

**Wat:** Je NL-btw-nummer.
**Formaat:** NL00XXXXXXXXB01

**Geen btw-nummer?**
- Gebruik je KOR? Dan vermeld je GEEN btw-nummer
- Wel verplicht: "Vrijgesteld van btw conform kleineondernemersregeling"

### 6. Naam en adres van de klant (afnemer)

**Wat:** Naam en adres van degene die betaalt.

**Bij bedrijf:**
\`\`\`
Firma De Vries BV
Afdeling Inkoop
Industrieweg 25
5678 CD Rotterdam
\`\`\`

**Bij particulier:**
\`\`\`
Dhr. P. Jansen
Dorpsstraat 5
9876 AB Dorpstad
\`\`\`

### 7. Datum van levering/prestering

**Wat:** Wanneer was de dienst/goods geleverd?

**Mag gelijk zijn aan:** Factuurdatum (als het dezelfde dag is).

**Let op:** Bij prepay (vooraf betalen) - leveringsdatum = datum van daadwerkelijke levering.

### 8. Omschrijving van de geleverde goederen/diensten

**Wat:** Wat heb je geleverd?

**Goed:**
- "Webdesign homepage + contactpagina"
- "Consultancy 8 uur, project X"
- "Logo design, 3 concepten, 2 revisierondes"

**Fout:**
- "Diensten" (te vaag)
- "Werkzaamheden" (te vaag)

**Tip:** Specifiek genoeg zodat je over 3 jaar nog weet wat het was.

### 9. Bedrag excl. btw, btw-bedrag, totaalbedrag

**Wat:** De bedragen moeten helder zijn.

**Layout:**
\`\`\`
Subtotaal: €1.000,00
Btw 21%: €210,00
Totaal: €1.210,00
\`\`\`

**Per btw-tarief apart:**
\`\`\`
Diensten (21%): €800,00
Btw 21%: €168,00

Boeken (9%): €200,00
Btw 9%: €18,00

Totaal excl. btw: €1.000,00
Totaal btw: €186,00
Totaal incl. btw: €1.186,00
\`\`\`

## Extra verplichtingen bij speciale situaties

### Btw-verlegd (0%)

**Extra vermeldingen:**
- "0% btw - btw verlegd naar afnemer"
- "Dienst onderworpen aan de heffing van omzetbelasting in het land van de afnemer"
- Btw-nummer van de klant (verplicht!)

### KOR (kleineondernemersregeling)

**Extra vermelding:**
> "Vrijgesteld van btw conform kleineondernemersregeling"

OF

> "Factuur vrijgesteld van omzetbelasting artikel 25 lid 1 Wet OB"

**Let op:** Geen btw-nummer op de factuur (je hebt er immers geen actief).

### Gedeeltelijke betaling/termijnen

**Vermeld:**
- "Termijnfactuur 1 van 3"
- "Aanbetaling 50%"
- Referentie naar hoofdfactuur

## De complete voorbeeldfactuur 2026

\`\`\`
FACTUUR 2026-042

Factuurdatum: 15 maart 2026
Leveringsdatum: 15 maart 2026
Vervaldatum: 29 maart 2026 (14 dagen)

VAN:
Janssen Webdesign (eenmanszaak)
KVK: 87654321
Btw: NL0087654321B01
Kerkstraat 10
1234 AB Amsterdam
info@janssenwebdesign.nl

AAN:
De Vries Consulting BV
KVK: 12345678
Btw: NL0012345678B01
Industrieweg 25
5678 CD Rotterdam

--------------------------------------------------
Omschrijving                    Aantal   Bedrag
--------------------------------------------------
Webdesign homepage              1    €2.500,00
Webdesign contactpagina         1    €  800,00
SEO optimalisatie (basis)       1    €  700,00
--------------------------------------------------
Subtotaal                              €4.000,00
Btw 21%                                  €  840,00
--------------------------------------------------
TOTAAL TE BETALEN                      €4.840,00
--------------------------------------------------

Betaling binnen 14 dagen op rekening:
NL91 ABNA 0123 4567 89 (t.n.v. Janssen Webdesign)

Betalingskenmerk: 2026-042
\`\`\`

## De 5 meest voorkomende fouten

### Fout 1: Geen opeenvolgende nummers

**Fout:** Factuur 1, 2, 5, 7, 12 (gaten in reeks).
**Oplossing:** Gebruik software die automatisch nummert.

### Fout 2: Btw-nummer vergeten

**Fout:** Alleen KVK-nummer, geen btw-nummer.
**Oplossing:** Standaard template met beide nummers.

### Fout 3: Te vaag omschreven

**Fout:** "Diensten €1.000"
**Oplossing:** Minstens 3-5 woorden: "Consultancy project website"

### Fout 4: Adres incompleet

**Fout:** Alleen straat, geen postcode.
**Oplossing:** Volledig adres: straat + huisnummer + postcode + plaats.

### Fout 5: Verkeerde btw-tarief

**Fout:** 21% op boeken (moet 9% zijn).
**Oplossing:** Check tarieven: 21% = standaard, 9% = specifieke goederen/diensten.

## Wat gebeurt er bij een foute factuur?

### Voor de klant:
- Kan de btw niet terugvragen
- Accepteert de boekhouding de factuur niet

### Voor jou:
- Kan je eigen btw niet terugkrijgen (voorbelasting)
- Boete bij herhaalde fouten
- Extra werk (creditfactuur + nieuwe factuur)

## Praktische FAQ

### Moet ik een handtekening zetten?
Nee, niet verplicht. Wel mag. Digitaal of op papier.

### Mag ik een logo op de factuur?
Ja, en het is aan te raden. Professioneler.

### Moet ik "factuur" erop schrijven?
Ja, duidelijk herkenbaar zijn als factuur.

### Wat als ik iets vergeet?
Stuur een creditfactuur + nieuwe correcte factuur.

### Kan ik facturen in het Engels maken?
Ja, dat mag. Verplichte elementen moeten wel duidelijk zijn.

## De checklist

Gebruik dit vóór je de factuur verstuurt:

- [ ] 1. Factuurnummer (uniek, opeenvolgend)
- [ ] 2. Factuurdatum
- [ ] 3. Mijn naam + adres + KVK
- [ ] 4. Mijn btw-nummer (indien van toepassing)
- [ ] 5. Klantnaam + adres
- [ ] 6. Leveringsdatum
- [ ] 7. Omschrijving (specifiek)
- [ ] 8. Bedragen excl./incl. btw correct
- [ ] 9. Btw-tarief correct vermeld
- [ ] 10. Betalingsgegevens
- [ ] 11. Vervaldatum

Mijn factuur 2024-042 zou nooit zijn afgekeurd als ik deze checklist had gehad.

Jij hebt hem nu. Gebruik hem.`,
    faq: [
      {
        question: 'Wat zijn de verplichte vermeldingen op een factuur in 2026?',
        answer: 'Volgens Artikel 35a Wet OB: (1) factuurnummer (uniek, opeenvolgend), (2) factuurdatum, (3) jouw naam/adres/KVK, (4) jouw btw-nummer (als je btw hebt), (5) klantnaam/adres, (6) leveringsdatum, (7) omschrijving product/dienst, (8) bedrag excl. btw, (9) btw-bedrag, (10) totaalbedrag inclusief btw.'
      },
      {
        question: 'Is een handtekening verplicht op een factuur?',
        answer: 'Nee, een handtekening is niet verplicht. Digitaal tekenen mag wel, maar is geen wettelijke verplichting. Veel ondernemers gebruiken een automatisch "digitale handtekening" of gewoon geen handtekening.'
      },
      {
        question: 'Wat moet er op een factuur bij KOR?',
        answer: 'Gebruik je de kleineondernemersregeling? Vermeld dan: "Vrijgesteld van btw conform kleineondernemersregeling" of "Factuur vrijgesteld van omzetbelasting artikel 25 lid 1 Wet OB". Geen btw-nummer op de factuur. Wel KVK-nummer verplicht.'
      },
      {
        question: 'Mag ik een factuur in het Engels maken?',
        answer: 'Ja, facturen mogen in het Engels. Zakelijke klanten uit het buitenland verwachten dit vaak. Zorg wel dat alle verplichte elementen duidelijk zijn herkenbaar (factuurnummer, datum, bedragen, etc.).'
      },
      {
        question: 'Wat gebeurt er bij een onvolledige factuur?',
        answer: 'De klant kan de btw niet terugvragen bij de Belastingdienst. Jij kunt je eigen voorbelasting mogelijk niet terugkrijgen. Je moet een creditfactuur sturen en een nieuwe correcte factuur maken. Dit kost tijd en ziet er onprofessioneel uit.'
      }
    ]
  },
  {
    id: '13',
    slug: 'administratie-bewaren-7-jaar-2026',
    title: 'Administratie Bewaren als ZZP\'er: De 7-Jaar Regel En Wat Je Echt Moet Houden',
    metaDescription: 'Hoe lang moet je administratie bewaren in 2026? 7 jaar wettelijk verplicht. Praktische opslag, wat je wel/niet moet bewaren, en mijn digitale systeem.',
    publishDate: '2026-03-20',
    readTime: 10,
    category: 'Administratie',
    tags: ['bewaren', 'administratie', '7-jaar', 'archief', 'wettelijk', '2026', 'digitaliseren'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De doos vol bonnetjes die me de das om deed

Mijn eerste jaar als ZZP'er. Een doos vol bonnetjes, facturen, en knipsels. "Ik sorteer het later wel," dacht ik.

Twee weken voor mijn eerste btw-aangifte zat ik op de vloer van mijn woonkamer. Omringd door papieren. Zoekend naar dat ene bonnetje van die laptop. Was het €1.200 of €1.250? En waar was de factuur van de boekhouder gebleven?

4 uur later had ik alles gesorteerd. Nog eens 2 uur om het in Excel te zetten. En de hele avond stress omdat ik bang was iets te zijn vergeten.

Nu, in 2026, heb ik een systeem. Geen papier meer. Geen stress. En als de Belastingdienst belt, heb ik elk document binnen 30 seconden paraat.

Dit is hoe je dat ook voor elkaar krijgt.

## De 7-jaar regel: wat zegt de wet?

De **Wet op de Omzetbelasting** en de **Algemene wet inzake rijksbelastingen** verplichten je om je administratie **7 jaar** te bewaren.

**Vanaf wanneer?**
- Vanaf het moment dat de factuur/bon is opgemaakt
- Dus een factuur van 15 januari 2026 bewaar je tot 31 december 2032

**Waarom 7 jaar?**
- De Belastingdienst heeft 5 jaar om navorderingsaanslagen op te leggen
- Met 2 jaar extra marge voor complexe zaken
- Buitenlandse transacties: soms 10 jaar (zie later)

## Wat moet je ALLES bewaren?

Dit is de complete lijst:

### Verplicht (btw-wet):
- Alle facturen die je VERSTUURT (kopieën)
- Alle facturen die je ONTVANGT (inkopen, kosten)
- Alle bonnetjes van zakelijke aankopen
- Bankafschriften (of digitale exports)
- Kassabonnen (als je contant betaalt)
- Transportdocumenten (vrachtbrieven, pakbonnen)
- Offertes en bestelbonnen (die leiden tot facturen)
- Correspondentie met klanten over prijzen/leveringen

### Verplicht (inkomstenbelasting):
- Loonstroken (als je werknemers hebt)
- AOV- en verzekeringspolissen
- Leasecontracten
- Huurcontracten zakelijk
- Algemene voorwaarden
- Arbeidsovereenkomsten

### Aan te raden (zelfbescherming):
- Emailwisseling met belangrijke klantafspraken
- Foto's van ontvangen goederen (bij schade)
- Screenshots van online bestellingen
- Bewijs van verzending (track & trace)

## Wat hoef je NIET te bewaren?

**Privé bonnetjes:**
- Boodschappen
- Restaurant (tenzij zakelijke lunch met bon)
- Tankbon (als je privé-auto hebt)
- Kleding (tenzij bedrijfskleding)

**Al verwerkte documenten:**
- Concept-facturen (die nooit verstuurd zijn)
- Offertes die afgewezen zijn (tenzij je ze gebruikt voor marktonderzoek)
- Interne aantekeningen zonder fiscale waarde

**Digitale rommel:**
- Spam email
- Herinneringen voor afspraken (tenzij fiscale afspraak)
- Sociale media posts (tenzij zakelijk account)

## Mag het digitaal? Ja, maar...

**Goed nieuws:** Je mag je hele administratie digitaal bewaren. Papier is niet verplicht.

**Maar let op:** De Belastingdienst stelt eisen:

1. **Authentiek:** Het document moet origineel zijn (geen Photoshop)
2. **Onveranderbaar:** Je mag niet meer kunnen wijzigen ná bewaren
3. **Leesbaar:** Moet leesbaar zijn tijdens bewaartermijn (7 jaar)
4. **Toegankelijk:** Je moet het binnen redelijke tijd kunnen tonen
5. **Compleet:** Alle pagina's, voor- en achterkant

**Praktisch:** PDF's zijn perfect. Maar:
- Geen gescande bonnetjes die onleesbaar zijn
- Geen foto's van facturen in .jpg (kan per ongeluk wijzigen)
- Wel: PDF/A formaat (archiefstandaard)

## Mijn digitale systeem (werkte voor 3 controles)

Dit is wat ik doe:

### Stap 1: Direct verwerken
Zodra ik een bon/factuur krijg:
- Scan met telefoon (Adobe Scan of Microsoft Lens)
- Controleer of het leesbaar is
- Bewaar direct in juiste map
- Gooi papier weg (tenzil uniek/origineel)

### Stap 2: Mapstructuur
\`\`\`
2026/
├── 01 - Januari/
│   ├── Ontvangen facturen/
│   ├── Verstuurd facturen/
│   ├── Bonnetjes/
│   └── Bankafschriften/
├── 02 - Februari/
...
└── Jaaroverzichten/
    ├── BTW aangiftes/
    ├── IB aangifte/
    └── Balans resultatenrekening/
\`\`\`

### Stap 3: Bestandsnamen
Y-M-D - Omschrijving - Bedrag.pdf

Voorbeelden:
- \`2026-01-15 - Factuur Bakkerij de Vries - 1210.pdf\`
- \`2026-02-03 - Bon Coolblue laptop - 1452.pdf\`
- \`2026-03-10 - Afschrift ING - maart.pdf\`

### Stap 4: Backups (drievoudig)
1. **Lokaal:** Externe harde schijf (elke week gekoppeld, 1x per maand backup)
2. **Cloud:** Dropbox (werkt lekker samen met bestandsnamen)
3. **Archief:** Yearly zip-bestand op USB-stick in kluis (voor rampen)

**Let op:** Alleen cloud is niet voldoende. Als je account gehackt wordt, ben je alles kwijt.

## Speciale situaties

### 1. Buitenlandse transacties: 10 jaar bewaren

Heb je klanten of leveranciers buiten Nederland? Dan geldt:
- **EU-transacties:** 10 jaar bewaren
- **Buiten EU:** 10 jaar bewaren
- **Nederlandse transacties:** 7 jaar

**Praktisch:** Ik bewaar alles 10 jaar. Dan hoef ik niet te onthouden welke factuur waar bij hoorde.

### 2. Goederen met lange levensduur

Heb je een laptop, auto, of machine gekocht?
- Bewaar de factuur 10 jaar (niet 7)
- Reden: afschrijving loopt door, Belastingdienst kan vragen stellen

### 3. Personeel/payroll

Heb je werknemers?
- Loonadministratie: 7 jaar
- Arbeidsovereenkomsten: 7 jaar ná beëindiging
- Ziekteverzuim: 5 jaar (Wet verbetering poortwachter)

### 4. Correspondentie en email

**Email:** Je hoeft niet elke email te bewaren. Alleen:
- Afspraken over prijzen/leveringen
- Klachten en oplossingen
- Belangrijke wijzigingen in overeenkomsten

**Praktisch:** Maak een map "Belangrijke email" en sleep daar alleen de essentiële mails naartoe.

### 5. WhatsApp en chat

Zakelijke afspraken via WhatsApp?
- Screenshots maken
- Opslaan bij factuur
- Voorbeeld: klant belt "ja die €50 korting is goed" → screenshot + bij factuur 2026-042

## Controle door de Belastingdienst: wat gebeurt er?

Je krijgt een brief: "Uw administratie wordt gecontroleerd."

**Wat ze willen zien:**
- Alle facturen (verstuurd en ontvangen)
- Bankafschriften
- Bewijs van betaling (niet verplicht, maar handig)
- Toelichting bij afwijkingen

**Hoe lang duurt het?**
- Simpele controle: 1 dag (zij komen langs of jij stuurt op)
- Complexe controle: weken tot maanden

**Mijn ervaring:** Ik had alles digitaal. De controleur zat met een laptop naast me. Elk document dat hij vroeg, had ik binnen 30 seconden. Hij was na 2 uur klaar (terwijl hij had gerekend op een dag).

**Tip:** "Hier, neem mijn laptop." Werkt alleen als je structuur hebt.

## Fouten die je moet vermijden

### Fout 1: "Ik bewaar alles wel in mijn inbox"

Email is geen archief. Emails raken:
- Verwijderd per ongeluk
- Kwijt bij wisselen van provider
- Onvindbaar (zoeken in 10.000 emails)

**Oplossing:** Email is voor communicatie. Documenten sla je op in mappen.

### Fout 2: "Ik maak wel foto's met mijn telefoon"

Telefoonfoto's:
- Gaan verloren bij wisselen van telefoon
- Zijn vaak wazig/leesbaar
- Komen in galerij tussen vakantiefoto's
- Zijn niet gebackuped

**Oplossing:** Gebruik een scan-app (Adobe Scan, CamScanner, Microsoft Lens). Deze maken PDF's en uploaden direct naar cloud.

### Fout 3: "Ik bewaar alles 7 jaar op mijn laptop"

Laptops:
- Crashen
- Worden gestolen
- Raken vol
- Raken kwijt

**Oplossing:** Externe backup + cloud. Drievoudig bewaren.

### Fout 4: "Ik sorteer het later wel"

"Later" komt nooit. En als het nodig is (btw-aangifte), is het meteen nodig.

**Oplossing:** Direct verwerken. Scan binnen 24 uur. Maak het een gewoonte.

## Praktische tools die ik gebruik

### Voor scannen:
- **Adobe Scan** (gratis, maakt perfecte PDF's, OCR)
- **Microsoft Lens** (gratis, integreert met OneDrive)
- **CamScanner** (betaald, meer functies)

### Voor opslag:
- **Dropbox** (cloud, synchronisatie)
- **Google Drive** (alternatief)
- **OneDrive** (als je Microsoft 365 hebt)

### Voor structuur:
- **Windows Verkenner** (mapstructuur)
- **Total Commander** (voor geavanceerde users)
- **Alfred** (Mac, snel zoeken)

### Voor administratie:
- **e-Boekhouden.nl** (koppelt met bank)
- **Jortt** (simpel)
- **Moneybird** (mooie facturen)

**Let op:** Deze tools zijn handig, maar je moet nog steeds de brondocumenten bewaren. De boekhouding is geen vervanging voor facturen.

## FAQ: de vragen die ik het meest krijg

### Moet ik papieren facturen bewaren of mag het digitaal?
Digitaal is toegestaan. Zorg dat het onveranderbaar is (PDF) en dat je het 7 jaar kunt terugvinden. Papier is niet verplicht.

### Wat als ik een bonnetje kwijt ben?
Vraag een kopie bij de leverancier. Bij tankbonnen: soms kunnen ze een duplicaat maken. Bij contant betaalde kleine bedragen: eigen verklaring met datum, bedrag, wat, waar. Maar dit wordt niet altijd geaccepteerd.

### Moet ik privé-administratie ook bewaren?
Alleen als het zakelijk impact heeft. Bijvoorbeeld: als je thuiswerkt en deel van je huur aftrekt, bewaar dan je huurcontract en huurbetalingen.

### Hoe bewaar ik email correct?
Mailen die fiscaal relevant zijn, sla je op als PDF. Gebruik een mapstructuur. Of: print naar PDF en sla op bij de factuur waar het over gaat.

### Mag ik oude administratie vernietigen na 7 jaar?
Ja, na 7 jaar mag je het weggooien. Tenzij je nog lopende geschillen hebt, of het gaat om goederen met lange levensduur (dan 10 jaar).

### Wat als de Belastingdienst om documenten vraagt die ik niet heb?
Leg uit waarom je ze niet hebt. Soms zijn er alternatieve bewijzen (bankafschrift, email). Maar: geen bewijs = geen aftrek. Dat kan duur worden.

### Moet ik facturen in het Nederlands bewaren?
Nee, facturen in het Engels, Duits, etc. zijn ook geldig. Zorg wel dat je de inhoud begrijpt (voor eigen administratie).

### Kan ik mijn administratie bewaren in de cloud (buiten Nederland)?
Ja, dat mag. Maar: de Belastingdienst moet erbij kunnen. En: de cloud-provider moet betrouwbaar zijn. Dropbox (VS), Google (VS), Microsoft (VS/Ierland) zijn allemaal toegestaan.

## De conclusie: start vandaag nog

De 7-jaarsregel klinkt als "ooit". Maar "ooit" komt sneller dan je denkt.

Mijn advies:
1. **Vandaag:** Maak de mapstructuur aan
2. **Deze week:** Scan alle openstaande papieren
3. **Voortaan:** Direct verwerken (binnen 24 uur)
4. **Maandelijks:** Backup checken
5. **Jaarlijks:** Oude administratie archiveren

De Belastingdienst controleert steeds vaker. Niet omdat ze je willen pakken, maar omdat de software afwijkingen signaleert.

Met een goed systeem is een controle een formaliteit van 2 uur. Zonder systeem is het een nachtmerrie van weken.

Ik weet wat ik kies.

En jij?`,
    faq: [
      {
        question: 'Hoe lang moet ik administratie bewaren als ZZP\'er?',
        answer: 'Wettelijk 7 jaar voor standaard transacties. Buitenlandse transacties (EU/buiten EU) en goederen met lange levensduur: 10 jaar. Vanaf het moment van de factuur/bon. Dus een factuur van januari 2026 bewaar je tot december 2032 (of 2035 voor buitenland).'
      },
      {
        question: 'Mag ik mijn administratie digitaal bewaren?',
        answer: 'Ja, digitaal is toegestaan en vaak praktischer. Zorg wel voor: authentieke documenten (geen bewerkbare bestanden), onveranderbare opslag (PDF/A), leesbaarheid gedurende 7 jaar, goede backup (lokaal + cloud), en de mogelijkheid om snel te kunnen tonen bij controle.'
      },
      {
        question: 'Wat moet ik allemaal bewaren?',
        answer: 'Verplicht: alle facturen (verstuurd en ontvangen), bonnetjes van zakelijke aankopen, bankafschriften, offertes die tot facturen leiden, correspondentie over prijzen/leveringen, en AOV/verzekeringspolissen. Aan te raden: emailwisseling over afspraken, bewijs van verzending, en screenshots van online bestellingen.'
      },
      {
        question: 'Wat gebeurt er bij een controle?',
        answer: 'De Belastingdienst vraagt om inzage in je administratie. Ze willen facturen, bankafschriften, en toelichting bij afwijkingen zien. Met een goed digitaal systeem duurt een controle vaak 2-4 uur. Zonder structuur kan het weken duren. Bewaar alles goed geordend zodat je snel kunt leveren.'
      },
      {
        question: 'Moet ik papieren bonnetjes bewaren?',
        answer: 'Nee, papier is niet verplicht. Je mag bonnetjes scannen en het papier weggooien. Zorg wel dat de scan leesbaar is (gebruik een goede scan-app zoals Adobe Scan of Microsoft Lens). Controleer of alle details zichtbaar zijn: datum, bedrag, btw, wat er is gekocht, en naam van winkel.'
      }
    ]
  },
  {
    id: '14',
    slug: 'zakelijke-rekening-2026-vergelijken',
    title: 'Zakelijke Rekening 2026: De Beste Banken voor ZZP\'ers (Vergelijking + Kosten)',
    metaDescription: 'Welke zakelijke rekening in 2026? Vergelijking van ING, Rabo, Knab, Bunq, en nieuwkomers. Kosten, functionaliteit, en mijn ervaring na 3 switches.',
    publishDate: '2026-04-20',
    readTime: 11,
    category: 'Starters',
    tags: ['zakelijke-rekening', 'bank', 'vergelijken', 'zzp', 'kosten', '2026'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De 3 bank switches die me €800 kostten

Eerste bank: De Rabo. €15/maand. "Alles onder één dak," zeiden ze. Alleen werkte de app niet lekker en de support was traag.

Tweede bank: Een fintech. €5/maand. Goedkoop! Maar geen fysieke service, en toen ik een hypotheek wilde, wilden ze geen ZZP'ers.

Derde bank: ING. €9/maand. Prima, maar de koppeling met mijn boekhoudsoftware hapert.

Elke switch kostte tijd, geld, en gedoe. Dit is wat ik had willen weten voordat ik begon.

## Moet je wettelijk een zakelijke rekening hebben?

**Nee.** Er is geen wettelijke verplichting voor een aparte zakelijke rekening.

**Maar:** De Belastingdienst verplicht je om je administratie op orde te hebben. Een aparte rekening maakt dat veel makkelijker.

**Advies:** Doe het. Zelfs als het niet verplicht is. De voordelen wegen ruimschoots op tegen de €5-15/maand.

## De grote vergelijking 2026

| Bank | Maandkosten | Opmerkelijk | Beste voor |
|------|-------------|-------------|------------|
| **ING ZZP** | €8,95 | Sterke app, veel koppelingen | Ondernemers die groeien |
| **Rabo Direct** | €9,95 | Fysieke service (kantoren) | Ondernemers die persoonlijk contact willen |
| **Knab ZZP** | €14,95 | Goede support, snel | Servicegerichte ondernemers |
| **Bunq Easy Money** | €8,99 | Instant notificaties, API | Tech-savvy ondernemers |
| **AIB (AIB)** | €6,95 | Goedkoop, basic | Starters op budget |
| **N26 Business** | €9,99 | Duits, EU breed | Internationaal actief |

*Prijzen zijn exclusief btw, standaard pakketten, per april 2026*

## De belangrijkste criteria voor ZZP'ers

### 1. Koppeling met boekhoudsoftware

**Wat:** Automatische import van transacties.

**Belangrijk voor:** Iedereen die tijd wilt besparen.

**Wie heeft wat:**
- ING: Koppelt met vrijwel alle software (e-Boekhouden, Jortt, Moneybird, etc.)
- Rabo: Goede koppelingen, soms trager
- Knab: Uitstekende API, goede koppelingen
- Bunq: Moderne API, nieuwere software werkt goed

### 2. Aantal gratis transacties

**Wat:** Hoeveel overboekingen mag je doen zonder extra kosten?

| Bank | Gratis transacties | Daarna |
|------|-------------------|--------|
| ING | 100/maand | €0,15 |
| Rabo | 50/maand | €0,12 |
| Knab | 100/maand | €0,15 |
| Bunq | Onbeperkt | - |

**Realiteit:** De meeste ZZP'ers doen <50 transacties/maand. Dit is zelden een probleem.

### 3. Fysieke service

**Wat:** Kan je langsgaan bij een kantoor?

**Belangrijk voor:** Ondernemers die persoonlijk contact waarderen.

**Wie heeft fysieke kantoren:**
- ING: Ja, veel
- Rabo: Ja, veel (vooral landelijk)
- Knab: Nee, alleen online
- Bunq: Nee, alleen online

### 4. Creditcard zakelijke

**Wat:** Inclusief zakelijke creditcard?

**Belangrijk voor:** Internationale betalingen, hotels, vliegtickets.

| Bank | Creditcard | Kosten |
|------|------------|--------|
| ING | Ja, optioneel | €20/jaar |
| Rabo | Ja, optioneel | €18/jaar |
| Knab | Ja, inclusief | €0 |
| Bunq | Ja, virtueel + fysiek | €0 |

## De specifieke situaties

### Je bent starter (0-€30.000 omzet)

**Prioriteit:** Laagste kosten, goede basis.

**Aanbeveling:**
1. **AIB** (€6,95) - Goedkoop, werkt prima
2. **Bunq** (€8,99) - Moderne app, groeit mee
3. **ING** (€8,95) - Solide, makkelijk overstappen later

### Je groeit (€30.000-€100.000 omzet)

**Prioriteit:** Goede koppelingen, fysieke service.

**Aanbeveling:**
1. **ING** - Beste balans prijs/kwaliteit
2. **Knab** - Als je support belangrijk vindt
3. **Rabo** - Als je persoonlijk contact wilt

### Je bent gevestigd (€100.000+ omzet)

**Prioriteit:** Service, extra functionaliteit.

**Aanbeveling:**
1. **Rabo** - Relatiebeheer, service
2. **ING** - Inkomstenbescherming, sparen
3. **Knab** - Persoonlijke adviseur

### Je werkt internationaal

**Prioriteit:** EUR/USD rekening, lage wisselkosten.

**Aanbeveling:**
1. **Bunq** - Instant IBANs, meerdere valuta
2. **N26** - Duits, EU breed
3. **TransferWise** (Wise) - Voor betalingen, geen hoofdrekening

## De verborgen kosten

### Kosten waar je niet aan denkt:

| Item | Kosten | Banken |
|------|--------|--------|
| PIN transactie | €0,15-€0,25 | De meeste |
| Valuta wissel | 1-2% | Alle (tenzij Wise/Bunq) |
| Afschriften | €2-€5 | Sommigen |
| Extra rekening | €2-€5/maand | De meeste |
| Incasso stornering | €5-€10 | Alle |

## Mijn persoonlijke top 3 (2026)

### 1. ING ZZP - De beste allrounder

**Plus:**
- Goede app
- Veel koppelingen
- Fysieke service
- Inkomstenbescherming optie

**Min:**
- Creditcard extra
- Website wat ouder

**Beste voor:** De meeste ZZP'ers die willen groeien.

### 2. Knab - De beste service

**Plus:**
- Uitstekende support
- Snelle reactie
- Goede API
- Creditcard inclusief

**Min:**
- Duurder (€14,95)
- Geen fysieke kantoren

**Beste voor:** Ondernemers die support belangrijk vinden.

### 3. Bunq - De meest moderne

**Plus:**
- Instant notificaties
- API voor automatisering
- Onbeperkt transacties
- Virtuele creditcards

**Min:**
- Geen fysieke service
- Sommige boekhouders kennen het niet

**Beste voor:** Tech-savvy ondernemers.

## De overstap: hoe werkt het?

### Stap 1: Open nieuwe rekening
Duurt 5-10 minuten online. Identificatie via ID-scan of video.

### Stap 2: Wacht op kaart
1-3 werkdagen.

### Stap 3: Zet overboekingen om
- Wijzig automatische incasso's (klanten die aan je betalen)
- Wijzig automatische afschrijvingen (abonnementen)

### Stap 4: Sluit oude rekening
Niet direct! Laat 3 maanden overlopen voor zekerheid.

## Praktische FAQ

### Mag ik mijn privérekening zakelijk gebruiken?
Ja, mag. Maar:
- Rommeliger administratie
- Moeilijker btw-aangifte
- Klanten zien je privé saldo
- Bank kan rekening blokkeren bij commercieel gebruik

### Kan ik meerdere zakelijke rekeningen hebben?
Ja. Sommige ondernemers hebben:
- Hoofdrekening (INK)
- Spaarrekening (reserves)
- Projectrekening (grote opdrachten)

### Wat is een BUNQ of Knab rekening kost in 2026?
Bunq Easy Money Business: €8,99/maand. Knab ZZP: €14,95/maand. Beide zijn online-only.

### Moet ik een zakelijke creditcard?
Aan te raden als je:
- Internationale klanten hebt
- Hotels/vliegtickets boekt
- Advertenties betaalt (Facebook, Google)

### Kan ik een zakelijke rekening zonder KVK?
Nee, je hebt een KVK-nummer nodig.

## De conclusie

De beste zakelijke rekening hangt af van jouw situatie:

- **Starter, beperkt budget:** AIB of Bunq
- **Groeiende ondernemer:** ING
- **Service belangrijk:** Knab
- **Internationaal:** Bunq of N26

Mijn 3 switches kostten €800 aan tijd en gedoe. Met deze informatie hoef jij dat niet te doen.

Kies één bank. Blijf erbij. Focus op je onderneming, niet op je bank.`,
    faq: [
      {
        question: 'Is een zakelijke rekening verplicht voor ZZP\'ers?',
        answer: 'Nee, wettelijk niet verplicht. Wel sterk aan te raden voor overzicht en btw-aangifte. Kosten zijn €6-15 per maand. Met een zakelijke rekening hou je privé en zakelijk gescheiden, wat de administratie veel makkelijker maakt.'
      },
      {
        question: 'Welke zakelijke rekening is het beste in 2026?',
        answer: 'ING ZZP (€8,95) is de beste allrounder voor de meeste ondernemers. Knab (€14,95) heeft de beste service. Bunq (€8,99) is het meest modern. Voor starters op budget: AIB (€6,95). De keuze hangt af van je behoefte aan service, fysieke kantoren, en koppelingen met boekhoudsoftware.'
      },
      {
        question: 'Kan ik een zakelijke rekening zonder KVK?',
        answer: 'Nee, alle banken vragen een KVK-nummer. Je moet eerst ingeschreven zijn bij de Kamer van Koophandel (€85,15). Daarna kun je een zakelijke rekening openen. Dit duurt meestal 1-3 werkdagen na KVK-inschrijving.'
      },
      {
        question: 'Wat kost een zakelijke rekening per maand?',
        answer: '€6,95 (AIB) tot €14,95 (Knab). De meeste populaire opties zitten tussen €8-10. Extra kosten: creditcard (€15-20/jaar), extra transacties (€0,12-0,15), valutawissel (1-2%). Let op de totale kosten, niet alleen het maandbedrag.'
      },
      {
        question: 'Kan ik overstappen van zakelijke rekening?',
        answer: 'Ja, dat kan. Duurt 2-4 weken. Belangrijk: wijzig alle automatische incasso\'s en afschrijvingen. Laat de oude rekening 3 maanden open staan voor zekerheid. Kijk uit voor dubbele kosten in de overstapmaand.'
      }
    ]
  },
  {
    id: '15',
    slug: 'btw-nummer-valideren-2026-vies',
    title: 'BTW Nummer Valideren 2026: VIES Check in 2 Minuten (Met Screenshot Bewijs)',
    metaDescription: 'Hoe check je een btw-nummer in 2026? VIES validatie, screenshot maken als bewijs, en wat als een nummer ongeldig is. Stappenplan met screenshots.',
    publishDate: '2026-04-22',
    readTime: 8,
    category: 'Facturatie',
    tags: ['btw-nummer', 'valideren', 'VIES', 'geldig', 'controle', '2026', 'check'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De VIES-check die me €1.200 bespaarde

Mijn eerste EU-klant. Duitsland. €8.000 project. Ik factureerde met 0% btw - btw verlegd.

Maar ik checkte niet. Vertrouwde op het nummer dat de klant me gaf: DE123456789.

Pas bij de btw-aangifte ontdekte ik: het nummer was ongeldig. De klant bleek een eenmanszaak zonder EU-btw-registratie.

Gevolg: ik moest alsnog 19% Duitse btw betalen = €1.520. Plus boetes. Minus de moeite om het van de klant terug te krijgen.

Nu check ik ELK EU-btw-nummer. Kost 2 minuten. Bespaart duizenden euro's.

Dit is hoe je dat doet.

## Wat is VIES en waarom is het belangrijk?

**VIES** = VAT Information Exchange System

Het Europese systeem waarin alle EU-btw-nummers staan geregistreerd.

**Waarom checken?**
- Btw-verlegd factureren is alleen toegestaan met geldig EU-btw-nummer
- Jij bent verantwoordelijk voor de check
- Geen check = jij betaalt de btw als het fout blijkt
- De Belastingdienst vraagt bewijs bij controle

## Stap-voor-stap: VIES-check doen

### Stap 1: Ga naar de VIES website

URL: **ec.europa.eu/taxation_customs/vies**

**Let op:** Gebruik alleen de officiële EU-website. Er zijn oplichtingsites die "VIES-checks" verkopen. Dat is gratis, dus betaal nooit.

### Stap 2: Selecteer het land

Kies het EU-land van je klant:
- België = BE
- Duitsland = DE
- Frankrijk = FR
- etc.

### Stap 3: Vul het btw-nummer in

Format: landcode + cijfers
- DE123456789
- BE0123456789
- FR12345678901

**Let op:** Kopieer het nummer, typ het niet over. Typfouten zijn de #1 reden van "ongeldig".

### Stap 4: Check de resultaten

**Geldig:**
\`\`\`
Status: Geldig bevestigd
Naam: [Bedrijfsnaam]
Adres: [Adres]
\`\`\`

**Ongeldig:**
\`\`\`
Status: Ongeldig
Reden: Nummer niet gevonden in database
\`\`\`

### Stap 5: Maak screenshot!

Dit is essentieel. Bewaar het bewijs.

**Windows:** Win + Shift + S
**Mac:** Cmd + Shift + 4
**Toevoegen aan factuur:** Screenshot bijlage of losse map "VIES-bewijzen"

## Hoe lang is een VIES-check geldig?

| Periode | Geldigheid |
|---------|------------|
| < 1 maand | Uitstekend bewijs |
| 1-6 maanden | Acceptabel bewijs |
| > 6 maanden | Twijfelachtig, beter opnieuw checken |

**Advies:** Check maximaal 1 maand voor facturatie. Bij terugkerende klanten: jaarlijks opnieuw checken.

## Wat als een nummer ongeldig is?

### Scenario 1: Typfout

**Actie:** Vraag klant om correct nummer.

> "Bedankt voor je btw-nummer. Bij controle in het Europese VIES-systeem komt dit nummer niet overeen. Kun je het nummer dubbelchecken? Mogelijk is er een typefout."

### Scenario 2: Klant heeft geen EU-btw-nummer

**Opties:**
1. **Klant registreert zich voor btw** (kan weken duren)
2. **Jij rekent Duitse btw** (19%, Belgische 21%, etc.)
3. **OSS regeling** (One Stop Shop) als je veel particuliere klanten hebt

### Scenario 3: Systeem offline

VIES is soms offline voor onderhoud.

**Actie:**
1. Documenteer datum/tijd van poging
2. Probeer later opnieuw
3. Check uiterlijk 1 dag voor factuurverzending

## Automatische VIES-checks (voor veel klanten)

### Software koppelingen

Sommige boekhoudsoftware heeft ingebouwde VIES-checks:
- **Moneybird:** Automatische check bij btw-verlegd
- **Exact:** VIES validatie
- **Twinfield:** Geïntegreerde check

### API voor ontwikkelaars

Bouw je eigen software? Gebruik de VIES API:
- Gratis
- Real-time validatie
- Documentatie: ec.europa.eu/taxation_customs/vies/technicalInformation.html

## Speciale situaties

### Noord-Ierland (XI)

Brexit verandert alles. Noord-Ierland heeft speciale XI-nummers.

- Check via VIES
- XI + cijfers format

### Griekenland (EL vs GR)

- Landcode in VIES: EL
- Maar nummers beginnen met GR
- Beide werken meestal

### Nieuwe bedrijven

Net opgerichte bedrijven duiken soms pas na 1-2 weken op in VIES.

**Actie:** Wacht even, of vraag bewijs van registratie bij de klant.

## Praktische FAQ

### Is VIES-check verplicht?
Ja, bij btw-verlegd factureren. Je moet kunnen bewijzen dat je het nummer hebt gecontroleerd.

### Wat kost een VIES-check?
Niets. Het is een gratis service van de EU.

### Kan ik VIES in bulk checken?
Niet via de website. Wel via API (voor ontwikkelaars) of via gespecialiseerde software.

### Wat als de naam niet klopt?
Soms komt een andere naam uit VIES dan je klant gebruikt (dochteronderneming, handelsnaam vs statutaire naam). Check met klant of dit dezelfde entiteit is.

### Bewaar ik VIES-bewijs 7 jaar?
Ja, minstens 7 jaar (buitenlandse transacties = 10 jaar). Bewaar screenshot bij de factuur.

## De checklist

Bij elke EU-klant:

- [ ] Vraag btw-nummer
- [ ] Check via ec.europa.eu/taxation_customs/vies
- [ ] Screenshot resultaat
- [ ] Bewaar screenshot 10 jaar
- [ ] Vermeld btw-nummer op factuur
- [ ] Zet "btw verlegd" tekst op factuur

## De conclusie

2 minuten werk. Gratis. Bespaart duizenden euro's.

Mijn €1.200 les is nu jouw gratis advies.

Check altijd. Bewaar bewijs. Slaap rustig.`,
    faq: [
      {
        question: 'Hoe check ik een btw-nummer via VIES in 2026?',
        answer: 'Ga naar ec.europa.eu/taxation_customs/vies, selecteer het EU-land, vul het btw-nummer in (landcode + cijfers), en klik "Verify". Screenshot het resultaat als bewijs. De check is gratis en duurt 1-2 minuten.'
      },
      {
        question: 'Is een VIES-check verplicht bij btw-verlegd factureren?',
        answer: 'Ja, je moet kunnen bewijzen dat je het btw-nummer hebt gecontroleerd op het moment van facturering. Zonder check riskeer je dat je alsnog de btw moet betalen als het nummer ongeldig blijkt. Bewaar de screenshot minstens 10 jaar.'
      },
      {
        question: 'Wat als een btw-nummer ongeldig is in VIES?',
        answer: 'Check eerst op typfouten (kopieer-plakken voorkomt fouten). Is het echt ongeldig? Dan kan de klant niet met 0% btw gefactureerd worden. Opties: (1) klant laat zich registreren voor EU-btw, (2) je rekent het lokale btw-tarief, (3) gebruik OSS-regeling als je veel particuliere klanten hebt.'
      },
      {
        question: 'Hoe lang bewaar ik een VIES-check bewijs?',
        answer: 'Minstens 10 jaar voor buitenlandse transacties. Bewaar de screenshot bij de factuur in je administratie. De Belastingdienst kan vragen om bewijs van de check bij een controle.'
      },
      {
        question: 'Kan ik meerdere btw-nummers tegelijk checken?',
        answer: 'Niet via de gratis website. Voor bulk-checks heb je de VIES API nodig (voor ontwikkelaars) of gespecialiseerde boekhoudsoftware met VIES-koppeling. Sommige software zoals Moneybird checkt automatisch bij btw-verlegd factureren.'
      }
    ]
  },
  {
    id: '16',
    slug: 'boekhoudsoftware-2026-vergelijken',
    title: 'Boekhoudsoftware 2026: De Beste Opties voor ZZP\'ers (Vergelijking + Keuzehulp)',
    metaDescription: 'Welke boekhoudsoftware in 2026? e-Boekhouden, Jortt, Moneybird, Minox, en meer vergeleken. Prijzen, functionaliteit, en mijn ervaring na 3 jaar.',
    publishDate: '2026-04-25',
    readTime: 12,
    category: 'Administratie',
    tags: ['boekhoudsoftware', 'boekhouding', 'vergelijken', 'zzp', 'administratie', '2026'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De 3 software switches die me 40 uur kostten

Eerste jaar als ZZP'er. Excel. "Hoe moeilijk kan het zijn?" dacht ik.

3 dagen voor mijn eerste btw-aangifte zat ik tot 2u 's nachts met formules die niet klopten. Btw percentages die verkeerd berekenden. En een migraineaanval.

Dag 1 met e-Boekhouden: mijn btw-aangifte duurde 20 minuten.

Jaar 2: ik wilde mooiere facturen. Switch naar Moneybird. 8 uur migratie.

Jaar 3: ik wilde betere rapportages. Switch naar Jortt. 12 uur migratie.

Dit is wat ik had willen weten voordat ik begon.

## Waarom boekhoudsoftware essentieel is (zelfs voor kleine ZZP'ers)

### Zonder software:
- Excel wordt snel complex
- Btw-berekening is foutgevoelig
- Je mist aftrekposten
- Belastingdienst controleert scherper
- Je verliest uren die je kunt factureren

### Met software:
- Automatische btw-berekening
- Directe koppeling met bank
- Foto's van bonnetjes uploaden
- Rapportages in 1 klik
- Btw-aangifte klaar in 20 minuten

**Rekenvoorbeeld:**
- Je uurtarief: €75
- Tijd bespaard per maand: 3 uur
- Software kost: €15/maand
- Bespaarde omzet: €225/maand
- Netto voordeel: €210/maand

De software betaalt zichzelf 14x terug.

## De grote vergelijking 2026

| Software | Prijs/maand | Sterk punt | Zwak punt | Beste voor |
|----------|-------------|-----------|-----------|------------|
| **e-Boekhouden** | €13,50 | Goedkoop, compleet | Interface wat gedateerd | Starters, budget |
| **Jortt** | €12,50 | Snel, simpel | Minder rapportages | Snelle factuurders |
| **Moneybird** | €15,00 | Mooie facturen | Duurder | Design-gevoelige |
| **Minox** | €12,00 | Goede support | Minder bekend | Support nodig |
| **AFAS** | €25,00+ | Enterprise features | Prijs, complexiteit | Groeiende bedrijven |
| **Exact** | €30,00+ | Alles-in-1 | Duur, steile leercurve | Grote ZZP'ers |
| **Reeleez** | €10,00 | Simpel, AI-gestuurd | Nieuwer, minder features | AI-curious |

*Prijzen excl. btw, standaard ZZP pakketten, april 2026*

## De belangrijkste functies voor ZZP'ers

### 1. Bankkoppeling (must-have)

**Wat:** Transacties komen automatisch binnen.

**Waarom:** Scheelt 2-3 uur per maand typwerk.

**Wie heeft het:**
- Alle genoemde pakketten (via Yolt/Trino of direct)

### 2. BTW-aangifte klaarzetten

**Wat:** Software berekent alle btw-rubrieken.

**Belangrijk:** Je moet alleen nog checken en indienen.

**Beste:**
- e-Boekhouden: Zeer compleet
- Jortt: Simpel, snel
- Moneybird: Goede visualisatie

### 3. Facturatie

**Wat:** Mooie, professionele facturen versturen.

**Belangrijk:** Snel, met je eigen huisstijl.

**Beste:**
- Moneybird: Allermooiste facturen
- Jortt: Snelste workflow
- e-Boekhouden: Functionaliteit, minder design

### 4. Bonnetjes inscannen

**Wat:** Foto van bon → software herkent bedrag en btw.

**Belangrijk:** Direct verwerken, niet meer typen.

**Beste:**
- Jortt: Snelle OCR
- Moneybird: Goed herkenning
- e-Boekhouden: Functionaliteit oké

### 5. Mobiele app

**Wat:** Facturen sturen en bonnetjes scannen vanaf je telefoon.

**Beste:**
- Jortt: Geweldige app
- Moneybird: Goed
- e-Boekhouden: Basis functionaliteit

## Per situatie: welke past bij jou?

### Je start net (0-€25.000 omzet)

**Prioriteit:** Goedkoop, simpel, snel aan de slag.

**Top 3:**
1. **e-Boekhouden** (€13,50) - Compleet, goedkoop, werkt meteen
2. **Jortt** (€12,50) - Snel, makkelijk
3. **Minox** (€12,00) - Goede support als je vragen hebt

**Tip:** Begin met e-Boekhouden. Het is het meest "volwassen" voor starters.

### Je groeit (€25.000-€75.000 omzet)

**Prioriteit:** Efficiency, professionele facturen.

**Top 3:**
1. **Jortt** (€12,50) - Snelheid is alles
2. **Moneybird** (€15) - Als factuur-uitstraling belangrijk is
3. **e-Boekhouden** - Blijven gebruiken als het bevalt

**Tip:** Overweeg de overstap naar Moneybird als je veel facturen stuurt en merkbaar wilt zijn.

### Je bent gevestigd (€75.000+ omzet)

**Prioriteit:** Functionaliteit, rapportages, support.

**Top 3:**
1. **AFAS** (€25+) - Groeit mee, veel features
2. **Exact** (€30+) - Als je complexere administratie hebt
3. **Moneybird** - Premium plan met extra features

**Tip:** Op dit niveau heb je waarschijnlijk een boekhouder. Vraag welke software zij prefereren.

## De verborgen kosten

### Wat je echt betaalt:

| Kostenpost | Prijs | Opmerking |
|------------|-------|-----------|
| Basis abonnement | €10-15/maand | Standaard ZZP pakket |
| Extra gebruikers | €5-10/maand | Alleen nodig bij personeel |
| Premium features | €5-15/maand | Automatische herinneringen, etc. |
| Koppeling boekhouder | €0-10/maand | Soms extra |
| Implementatie | 0-20 uur | Afhankelijk van complexiteit |

## Mijn persoonlijke ervaringen

### e-Boekhouden (gebruikt 2024-2025)

**Plus:**
- Alles werkt zoals je verwacht
- Goede btw-aangifte module
- Lage prijs
- Goede koppelingen

**Min:**
- Interface is wat gedateerd
- Facturen zijn "functioneel" niet "mooi"
- Mobiele app mag beter

**Cijfer:** 8/10 voor starters

### Moneybird (gebruikt 2025)

**Plus:**
- Prachtige facturen
- Goede herinneringsflow
- Mooie rapportages

**Min:**
- Duurder
- Sommige features vereisen premium
- Migratie was gedoe

**Cijfer:** 8.5/10 als design belangrijk is

### Jortt (gebruik nu, 2026)

**Plus:**
- Snelste workflow ooit
- Geweldige mobiele app
- Goede prijs/kwaliteit

**Min:**
- Rapportages kunnen uitgebreider
- Minder integraties dan e-Boekhouden

**Cijfer:** 9/10 voor de meeste ZZP'ers

## Overstappen: hoe doe je dat?

### Stap 1: Export uit oude software
- Klantenlijst (CSV)
- Producten/diensten (CSV)
- Openstaande facturen (PDF + overzicht)

### Stap 2: Import in nieuwe software
- Meeste software heeft import wizard
- Check dubbele klanten
- Verifieer dat alles over is gekomen

### Stap 3: Parallel draaien (1 maand)
- Niet meteen de oude uitschrijven
- Check of alles klopt
- Btw-aangifte nog een keer dubbelchecken

### Stap 4: Oude uitschrijven
- Pas ná de eerste btw-aangifte in nieuwe software
- Bewaar oude gegevens (export)

## De 5 fouten die je moet vermijden

### Fout 1: Te veel tijd besteden aan kiezen
30 minuten research is genoeg. Kies er één en ga aan de slag.

### Fout 2: Te snel overstappen
Geef software 3-6 maanden voordat je switcht. De leercurve is altijd er.

### Fout 3: Niet de bankkoppeling activeren
Dit scheelt enorm veel tijd. Doen.

### Fout 4: Premium features direct aanschaffen
Begin met basis. Upgrade pas als je echt tegen beperkingen aanloopt.

### Fout 5: Geen backup maken
Exporteer jaarlijks je complete administratie. Bewaar extern.

## Praktische FAQ

### Kan ik boekhoudsoftware gratis proberen?
Ja, alle genoemde pakketten hebben 14-30 dagen proefperiode. Geen creditcard nodig.

### Wat als ik overstap naar een andere software?
Je kunt altijd overstappen. Exporteer klanten en facturen. Importeer in nieuwe software. Duurt 2-4 uur.

### Heb ik een boekhouder nodig met software?
Niet verplicht. Veel ZZP'ers doen het eerste jaar zelf. Bij complexiteit (>€75.000 omzet, internationaal, personeel) wordt een boekhouder aan te raden.

### Kan ik mijn administratie in Excel houden?
Ja, mag. Maar: het kost meer tijd, is foutgevoeliger, en bij controle moet je alles kunnen verantwoorden. Software is de investering waard.

### Welke software werkt met mijn bank?
Alle grote banken (ING, Rabo, ABN) koppelen met alle grote software. Check de website van je bank voor bevestiging.

## De conclusie

De beste boekhoudsoftware is degene die je gebruikt.

Mijn advies voor 2026:
- **Starter:** e-Boekhouden (solide basis)
- **Groeiend:** Jortt (snelste workflow)
- **Design matters:** Moneybird (mooiste facturen)

Kies vandaag. Begin morgen. Focus op je werk, niet op je administratie.

En die 40 uur die ik verloor aan switches? Die zijn nooit meer terug. Jij kunt het slimmer doen.`,
    faq: [
      {
        question: 'Wat is de beste boekhoudsoftware voor ZZP\'ers in 2026?',
        answer: 'Voor de meeste ZZP\'ers is Jortt (€12,50/maand) de beste keuze vanwege snelheid en gebruiksgemak. Starters op budget: e-Boekhouden (€13,50). Design-gevoelig: Moneybird (€15). Alle drie hebben proefperioden van 14-30 dagen.'
      },
      {
        question: 'Kan ik boekhoudsoftware gratis gebruiken?',
        answer: 'Gratis proefperioden van 14-30 dagen zijn beschikbaar. Daarna betaal je €10-15/maand voor goede ZZP-software. Gratis versies zijn vaak beperkt of onveilig. De tijdsbesparing (3+ uur/maand) maakt de €15/maand meer dan waard.'
      },
      {
        question: 'Heb ik een boekhouder nodig als ik software gebruik?',
        answer: 'Niet verplicht. Veel ZZP\'ers doen zelf tot €75.000 omzet. Software zoals e-Boekhouden, Jortt of Moneybird leidt je door btw-aangifte en jaarrekening. Bij complexiteit (internationaal, personeel, hoge omzet) wordt een boekhouder wel aan te raden.'
      },
      {
        question: 'Kan ik overstappen naar andere boekhoudsoftware?',
        answer: 'Ja, je kunt altijd overstappen. Exporteer klanten en facturen uit oude software, importeer in nieuwe. Duurt 2-4 uur. Draai 1 maand parallel voor zekerheid. Jaaroverzichten uit oude software bewaar je voor 7 jaar.'
      },
      {
        question: 'Welke functies zijn essentieel in boekhoudsoftware?',
        answer: 'Must-haves: (1) Bankkoppeling voor automatische import, (2) BTW-aangifte module, (3) Facturatie met je huisstijl, (4) Bonnetjes inscannen met OCR, (5) Mobiele app. Alle genoemde pakketten (e-Boekhouden, Jortt, Moneybird) hebben dit.'
      }
    ]
  },
  {
    id: '17',
    slug: 'eenmanszaak-vs-bv-2026-belasting',
    title: 'Eenmanszaak of BV in 2026: De Keuze Die Me €12.000 Kostte (Of Opleverde)',
    metaDescription: 'Eenmanszaak of BV kiezen in 2026? Belastingverschillen, aansprakelijkheid, en de "omzetgrens" waarover niemand praat. Met concrete berekeningen voor jouw situatie.',
    publishDate: '2026-02-28',
    readTime: 15,
    category: 'Starters',
    tags: ['eenmanszaak', 'bv', 'ondernemingsvorm', 'aansprakelijkheid', '2026', 'belasting', 'box1', 'box2'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De keuze die ik te snel maakte

Mijn accountant zei: "Met jouw verwachte omzet is een eenmanszaak prima. Een BV is pas interessant boven de €150.000 winst."

Ik luisterde. Startte als eenmanszaak. En ontdekte 18 maanden later dat het me €12.000 had gekost.

Waarom? Omdat de "€150.000 regel" een mythe is. Het hangt af van jouw situatie, je risico, je ambitie, en ja - ook van hoe je de belastingzaakjes regelt.

Dit is het artikel dat ik had willen lezen voordat ik koos. Met echte cijfers, geen theoretisch geneuzel.

## De fundamentele verschillen in één tabel

| | **Eenmanszaak** | **BV** |
|---|---|---|
| **Rechtsvorm** | Jij = bedrijf | Bedrijf is aparte "persoon" |
| **Aansprakelijkheid** | Oneindig persoonlijk | Beperkt (meestal alleen aandelen) |
| **Belasting op winst** | Inkomstenbelasting (box 1), max 49,5% | Vennootschapsbelasting (vpb), 19% |
| **Belasting op uitkeren** | Geen (al betaald) | Dividendbelasting + box 3 (totaal ~40-45%) |
| **Oprichtingskosten** | €85 (KVK) | €1.500-€3.000 (notaris) |
| **Jaarlijkse kosten** | €500-€1.500 (boekhouder) | €2.500-€5.000 (administratie) |
| **Flexibiliteit** | Hoog (eigen geld) | Laag (geld is van BV) |
| **Imago** | ZZP/solopreneur | Serieuze onderneming |

**De kern:** Eenmanszaak is simpel maar risicovol. BV is complex maar beschermd.

## Aansprakelijkheid: het verschil dat je leven kan veranderen

### Eenmanszaak: jij bent het bedrijf

**Persoonlijk aansprakelijk = oneindig**

Voorbeeld: Je maakt een fout in een website die een klant €200.000 kost. De klant eist schadevergoeding.

- Eenmanszaak: Jij betaalt. Uit je spaargeld. Uit je huis. Uit alles wat je hebt.
- Ja, zelfs als je een "eenmanszaak" hebt en niet "ZZP" staat te schreeuwen.
- Ja, zelfs als je "Aansprakelijkheidsverzekering" hebt (die dekt niet alles).

**Uitzondering:** Je partner is niet aansprakelijk (tenzij die ook ondernemer is). Jullie huis op beide namen? Daar kunnen ze bij.

### BV: beperkte aansprakelijkheid

**De BV is aansprakelijk, jij niet (meestal)**

Zelfde voorbeeld: €200.000 schade.

- De BV heeft €50.000 vermogen (is alles)
- De BV betaalt €50.000 en gaat failliet
- Jij loopt weg met je spaargeld, huis, auto intact
- Ja, de onderneming is weg. Maar jij niet.

**Let op:** Er zijn uitzonderingen waar jij WEL persoonlijk aansprakelijk bent:
- Fraude of opzet
- Fouten bij aangifte belasting
- Doorstarten na faillissement (doorstart-aansprakelijkheid)
- Borg stellen voor lening (dan ben je wel aansprakelijk voor die lening)

## De belastingrealiteit in 2026

Hier is waar het interessant wordt. Laten we rekenen.

### Scenario 1: €60.000 winst per jaar

| | **Eenmanszaak** | **BV** |
|---|---|---|
| Winst | €60.000 | €60.000 |
| Vpb (vennootschapsbelasting) | - | €11.400 (19%) |
| Bruto uit te keren | - | €48.600 |
| Inkomstenbelasting (box 1 of dividend) | €16.800 (28%) | €19.440 (40% dividendbelasting) |
| Netto in jouw zak | **€43.200** | **€29.160** |

**Verschil: €14.040 ten nadele van de BV**

Conclusie: Bij €60.000 winst is eenmanszaak veel gunstiger.

### Scenario 2: €150.000 winst per jaar

| | **Eenmanszaak** | **BV** |
|---|---|---|
| Winst | €150.000 | €150.000 |
| Vpb | - | €28.500 (19%) |
| Bruto uit te keren | - | €121.500 |
| Inkomstenbelasting/dividend | €52.500 (35%) | €48.600 (40%) |
| Netto in jouw zak | **€97.500** | **€72.900** |

**Verschil: €24.600 ten nadele van de BV**

Conclusie: Ook bij €150.000 is eenmanszaak fiscaal voordeliger.

### Scenario 3: €250.000 winst, spaargeld opbouwen

| | **Eenmanszaak** | **BV** |
|---|---|---|
| Winst | €250.000 | €250.000 |
| Inkomstenbelasting | €92.500 (37%) | - |
| Vpb | - | €47.500 (19%) |
| JOUW salaris | - | €70.000 |
| Inkomstenbelasting salaris | - | €24.500 (35%) |
| Rest in BV | - | €132.500 |
| Dividend later (40%) | - | €79.500 |
| Totaal netto | **€157.500** | **€125.500** |

**Wacht!** Hier klopt iets niet. De eenmanszaak lijkt beter. Maar:

- De BV-eigenaar heeft €132.500 in de BV staan (gespaard)
- Kan later uitkeren bij lager tarief (bijv. stoppen met werken)
- Kan investeren vanuit BV (fiscaal voordelig)
- Heeft pensioenopbouw via BV

**De truc:** Bij hoge winsten spaart de BV beter dan jij in box 3.

## De "omzetgrens" mythe

Je hoort vaak: "Boven €150.000 moet je een BV hebben."

**Onzin.** Het hangt af van:

### 1. Hoeveel winst je SPAREN wilt

Wil je alles opnemen voor consumptie (auto, vakantie, huis)?
→ Eenmanszaak is meestal voordeliger tot €200.000+

Wil je geld IN de onderneming houden voor groei?
→ BV is vanaf €100.000 al interessant door lagere vpb

### 2. Je risicoprofiel

Hoge risico's (bouw, advies met schadepotentieel, import/export)?
→ Overweeg al bij €50.000 een BV

Laag risico (schrijven, design, consultancy zonder grote projecten)?
→ Eenmanszaak werkt tot €300.000+

### 3. Je plannen

Wil je over 3 jaar verkopen?
→ BV is makkelijker te verkopen (aandelen vs goodwill)

Wil je over 10 jaar stoppen?
→ Eenmanszaak is makkelijker af te wikkelen

Wil je personeel aannemen?
→ BV is professioneler (maar niet verplicht)

### 4. Je privésituatie

Heb je een partner zonder inkomen?
→ Eenmanszaak: partnerlening constructie kan voordelig zijn
→ BV: partner kan aandelen krijgen en meeprofiteren

Heb je veel vermogen in box 3?
→ Eenmanszaak: winst komt in box 1 (kan juist voordelig zijn)
→ BV: dividend komt in box 3 (boven vrijgesteld bedrag)

## De kosten: wat betaal je echt?

### Eenmanszaak (jaarlijks)

| Kostenpost | Bedrag |
|------------|--------|
| KVK | €0 (eenmalig €85) |
| Boekhoudsoftware | €300-€600 |
| Boekhouder (optioneel) | €1.200-€2.400 |
| Totaal | **€1.500-€3.000** |

### BV (jaarlijks)

| Kostenpost | Bedrag |
|------------|--------|
| Notariële oprichting | €1.500-€3.000 (eenmalig) |
| Jaarrekening deponeren | €100 |
| Administratie/jaarrekening | €2.000-€4.000 |
| Salarisadministratie (eigen loon) | €600-€1.200 |
| Totaal eerste jaar | **€4.200-€8.200** |
| Totaal volgende jaren | **€2.700-€5.300** |

**De BV is €1.000-€3.000 per jaar duurder.** Dat moet je fiscaal wel terugverdienen.

## Praktische voorbeelden: wat past bij jou?

### Voorbeeld 1: Webdesigner Lisa, €80.000 omzet

- Winst: €55.000
- Risico: laag (fouten zijn snel te fixen)
- Ambitie: lekker freelance, geen personeel
- Partner: werkt ook, geen fiscale constructie nodig

**Advies:** Eenmanszaak. Fiscaal voordeliger, lage kosten, laag risico.

### Voorbeeld 2: Consultant Mark, €180.000 omzet

- Winst: €120.000
- Risico: hoog (advies kan klant miljoenen kosten)
- Ambitie: over 5 jaar verkopen
- Wil geld sparen voor groei

**Advies:** BV. Risicobescherming is €10.000 per jaar waard. Bovendien: spaargroeipotentieel.

### Voorbeeld 3: E-commerce ondernemer Sophie, €400.000 omzet

- Winst: €90.000 (veel terug in voorraad)
- Risico: medium (voorraad, retouren)
- Ambitie: flink groeien, misschien investeerder
- Wil geld in voorraad houden

**Advies:** BV. Groeipotentieel, investeerders willen aandelen (geen goodwill), voorraad is BV-vermogen.

## Overstappen van eenmanszaak naar BV

Dit kan altijd. Maar het kost geld en moeite.

### Waarom zou je overstappen?

1. **Risico wordt te groot** (nieuw project, nieuwe markt)
2. **Je gaat personeel aannemen** (BV is professioneler)
3. **Je wilt investeerders** (aandelen zijn makkelijker)
4. **Je winst stijgt boven €200.000** (fiscaal interessant)
5. **Je wilt verkopen** (overname van aandelen is makkelijker)

### Hoe werkt het?

1. **Waardering:** Jouw eenmanszaak heeft "goodwill" (waarde). Een accountant bepaalt dit.
2. **Overdracht:** Je "verkoopt" de eenmanszaak aan de BV.
3. **Betaling:** De BV betaalt jou (meestal aandelen, soms cash).
4. **Notaris:** Oprichting BV + overdracht akte.
5. **Belasting:** Je betaalt belasting over de winst op overdracht (box 1).

**Kosten:** €3.000-€8.000 (notaris, accountant, belastingadviseur).

**Tip:** Doe dit niet zelf. Een foute constructie kan €10.000+ aan belasting kosten.

## De "fiscale romance" die niemand je vertelt

Er is een constructie die het beste van twee werelden combineert. Maar die is complex:

### Eenmanszaak met partnerlening

Je partner leent geld aan je eenmanszaak. Jij betaalt rente (aftrekbaar). Partner betaalt belasting over rente (laag tarief).

**Voordeel:** Spreiding van inkomen over twee personen.

**Nadeel:** Complex. Belastingdienst kijkt scherp. Alleen als partner écht geld heeft.

### BV met holding

Je hebt een Holding BV (jij bent eigenaar) en een Operationele BV (dochter).

**Voordeel:** Risicobescherming, fiscale flexibiliteit.

**Nadeel:** Dubbele kosten, complex.

**Advies:** Pas interessant boven €500.000 omzet.

## De beslisboom: welke past bij jou?

Beantwoord deze vragen:

**1. Heb je aansprakelijkheidsrisico?**
- Ja, en het is groot (>€50.000 potentiële schade) → **BV**
- Nee, of heel klein → **Eenmanszaak**

**2. Wat is je verwachte winst in jaar 3?**
- Onder €100.000 → **Eenmanszaak**
- €100.000-€200.000 → **Eenmanszaak (tenzij risico)**
- Boven €200.000 → **BV overwegen**

**3. Wil je geld SPAREN in de onderneming?**
- Nee, alles eruit → **Eenmanszaak**
- Ja, voor groei/pensioen → **BV**

**4. Wil je personeel of investeerders?**
- Ja, binnen 3 jaar → **BV**
- Nee, solo blijven → **Eenmanszaak**

**5. Heb je veel privévermogen in box 3?**
- Ja (>€100.000) → **Eenmanszaak** (winst in box 1 is dan fiscaal gunstiger)
- Nee → **Maakt minder uit**

## FAQ: de vragen die ik het meest krijg

### Vanaf welk inkomen is een BV voordelig?
Er is geen vaste grens. Algemene vuistregel: bij €150.000-€200.000 winst wordt het interessant, MAAR alleen als je geld in de BV wilt houden. Voor pure consumptie (alles opnemen) is eenmanszaak vaak voordeliger tot €300.000+.

### Kan ik later van eenmanszaak naar BV?
Ja, dat kan altijd. Het kost €3.000-€8.000 (notaris, accountant). Je betaalt belasting over de waarde van je onderneming op dat moment. Doe dit niet zelf - vraag professioneel advies.

### Is een BV meer werk dan eenmanszaak?
Ja. Je moet jaarrekening opstellen, deponeren bij KVK, eigen loonadministratie doen (ook als jij de enige werknemer bent), en voldoen aan meer regels. Reken op 4-8 uur extra administratie per jaar, of €1.000-€2.000 extra kosten voor uitbesteding.

### Wat is flex BV?
Sinds 2012 mag je een BV oprichten met €0,01 startkapitaal (was eerst €18.000). Dit maakt de drempel lager. Let op: banken en leveranciers willen soms wel zekerheden (eigen vermogen).

### Kan ik als BV ook ZZP'er zijn?
Nee. ZZP = zakelijk, maar geen rechtsvorm (je bent eenmanszaak). BV is een aparte rechtsvorm. Je kunt wel "freelancen" als BV (zzp-achtig werken), maar je bent juridisch een BV.

### Welke aansprakelijkheidsverzekering heb ik nodig bij eenmanszaak?
Een beroepsaansprakelijkheidsverzekering (BAV). Dekking: €500.000-€2.500.000 afhankelijk van risico. Kost €300-€800 per jaar. Dit is GEEN vervanging voor BV-bescherming, maar wel een buffer voor kleine claims.

### Hoeveel kost een BV per jaar echt?
Jaarlijks: €2.500-€5.000 voor administratie, jaarrekening, loonadministratie. Eerste jaar: €4.000-€8.000 (inclusief oprichting). Dit moet je terugverdienen via fiscale voordelen of risicobescherming.

## Mijn conclusie na 2 jaar eenmanszaak en gesprekken met 10 BV-houders

De keuze tussen eenmanszaak en BV is niet puur financieel. Het is een levenskeuze.

**Kies eenmanszaak als:**
- Je wilt simpel
- Je wilt flexibel (geld eruit halen wanneer je wilt)
- Je risico is beheersbaar
- Je winst is onder €150.000-€200.000
- Je werkt solo

**Kies BV als:**
- Je risico is hoog
- Je wilt groeien met personeel/investeerders
- Je winst is boven €200.000
- Je wilt geld in de onderneming sparen
- Je denkt over verkoop over 5+ jaar

Ik koos destijds verkeerd. Niet omdat eenmanszaak slecht is, maar omdat het niet paste bij mijn groeiambities.

Jij kunt het beter doen. Gebruik deze vragen. Bereken je situatie. En kies bewust.

Het scheelt je €12.000. Of het levert je die op.`,
    faq: [
      {
        question: 'Vanaf welk inkomen is een BV fiscaal voordelig?',
        answer: 'Er is geen vaste grens. Voor consumptie (alles opnemen) is eenmanszaak vaak voordeliger tot €200.000-€300.000 winst. Voor spaargroei in de onderneming wordt BV interessant vanaf €100.000-€150.000. Het hangt af of je geld wilt sparen of uitgeven.'
      },
      {
        question: 'Wat is het verschil in aansprakelijkheid?',
        answer: 'Eenmanszaak: oneindig persoonlijk aansprakelijk. Bij schade ben je alles kwijt wat je hebt (huis, spaargeld). BV: beperkte aansprakelijkheid tot het vermogen in de BV. Jouw privévermogen is (meestal) veilig. Uitzondering: fraude, foute belastingaangifte, of borg stellen voor leningen.'
      },
      {
        question: 'Wat kost een BV per jaar meer dan eenmanszaak?',
        answer: 'Een BV kost €1.500-€3.000 per jaar meer dan eenmanszaak. Eerste jaar: €4.000-€8.000 (inclusief oprichting €1.500-€3.000). Terugkerend: €2.500-€5.000 per jaar voor administratie, jaarrekening, loonadministratie (eigen salaris), en deponering KVK.'
      },
      {
        question: 'Kan ik later overstappen van eenmanszaak naar BV?',
        answer: 'Ja, dat kan altijd. Kosten: €3.000-€8.000 voor notaris, accountant en belastingadviseur. Je betaalt belasting over de waarde (goodwill) van je onderneming bij overdracht. Doe dit met professioneel advies - een foute constructie kan duur worden.'
      },
      {
        question: 'Wanneer is een BV verplicht?',
        answer: 'Een BV is nooit verplicht. Je mag altijd een eenmanszaak hebben, ongeacht omzet of winst. Wel is een BV sterk aan te raden bij hoge aansprakelijkheidsrisico\'s (bouw, medisch, financieel advies) of bij groeiplannen met investeerders.'
      }
    ]
  },
  {
    id: '18',
    slug: 'zzp-pensioen-opbouwen-aov-verzekering-2026',
    title: 'ZZP Pensioen & AOV in 2026: De Harde Waarheid (En Wat Je Echt Moet Weten)',
    metaDescription: 'Pensioen en AOV als ZZP\'er in 2026. Is een AOV verplicht? Nee, het wetsvoorstel BAZ is uitgesteld. Welke regelingen zijn er echt? Praktische opties voor later.',
    publishDate: '2026-03-01',
    readTime: 12,
    category: 'Starters',
    tags: ['pensioen', 'aov', 'arbeidsongeschiktheid', 'zzp', 'verzekering', '2026', 'baz'],
    featured: false,
    author: 'FactuurStudio',
    content: `## De AOV die ik niet nam (en waarom dat een fout was)

Maart 2024. Ik startte als ZZP'er. Een AOV? "Dat is duur," dacht ik. "Ik ben jong, gezond, en ik heb wel wat gespaard. Dat komt goed."

Drie maanden later: tendinitis in mijn pols. Van een dagelijkse typer naar niet eens mijn telefoon kunnen bedienen. Geen werk voor twee weken. Geen inkomen. Geen AOV die uitkeerde.

Die €2.400 aan gemiste omzet had ik voorkomen kunnen hebben met een verzekering van €95 per maand.

Dit is het artikel dat ik zelf had willen lezen voordat ik startte. Over AOV, pensioen, en de verplichtingen die er WEL en NIET zijn in 2026.

## Is een AOV verplicht in 2026? (Het antwoord is: Nee)

Er gaan veel verhalen rond over een "verplichte AOV". Die is er op dit moment **NIET**.

### Wat is er wel aan de hand?

Het kabinet werkt aan een wetsvoorstel: de **BAZ (Basisverzekering Arbeidsongeschiktheid Zelfstandigen)**. Dit zou een verplichte, publieke AOV worden voor alle ZZP'ers.

Maar:
- Het wetsvoorstel ligt nog bij de Tweede Kamer
- De Raad van State heeft kritiek geuit op de haalbaarheid
- De verwachting is dat dit **pas in 2030** (of later) ingevoerd wordt
- Zelfs dan komt er waarschijnlijk een overgangsregeling voor bestaande ondernemers

### Wat betekent dit voor jou?

In 2026 ben je **niet verplicht** om een AOV te hebben. Het is wel sterk aan te raden, maar niemand dwingt je ertoe.

## Waarom een AOV WEL slim is (ook zonder verplichting)

Statistieken liegen niet:
- 1 op de 4 ZZP'ers raakt minstens één keer arbeidsongeschikt
- De gemiddelde uitval duurt 8 maanden
- De meeste ZZP'ers hebben geen reserves voor meer dan 2 maanden zonder inkomen

Mijn eigen verhaal is mild vergeleken met wat ik van anderen hoor. Een grafisch ontwerper die zijn schouder belastte en 6 maanden niet kon werken. Een consultant met burn-out die een jaar thuiszat. Zonder AOV = zonder inkomen = schulden maken of de bijstand in.

## Hoe werkt een AOV precies?

Een AOV keert uit als je arbeidsongeschikt raakt. Maar de duivel zit in de details:

### Wachttijd
Hoelang moet je wachten voordat de uitkering start?
- **14 dagen**: Duurste premie, snelste uitkering
- **30 dagen**: Middenmoot
- **90 dagen**: Goedkoper, maar je moet 3 maanden zelf redden
- **1 jaar**: Alleen voor langdurige, ernstige zaken

### Ukeringspercentage
Hoeveel procent van je inkomen krijg je?
- Meestal 70-80% van je gemiddelde omzet
- Sommige verzekeringen dekken alleen tot een maximumbedrag
- Check of dit brutto of netto is

### Eigen risico
Sommige AOV's hebben een "eigen risico" per maand. Bijvoorbeeld: de eerste €500 per maand wordt niet uitgekeerd.

### Dekking
Wat wordt er gedekt?
- **Eigen beroep**: Je krijgt uitkering als je jouw specifieke werk niet kunt doen (beste dekking)
- **Eigen beroep + passend werk**: Je moet ook andere werk weigeren (goedkoper, minder dekking)
- **Algemene arbeidsongeschiktheid**: Je krijgt pas uitkering als je geen enkel werk meer kunt doen (minste dekking)

## Wat kost een AOV in 2026?

De premie hangt af van:
- Je leeftijd
- Je beroep (risicoklasse)
- Je gewenste uitkering
- Je wachttijd

### Voorbeelden:

**Consultant, 35 jaar, €5.000/maand uitkering, 30 dagen wachttijd:**
- Circa €95-€130 per maand

**Bouwvakker, 40 jaar, €4.000/maand uitkering, 30 dagen wachttijd:**
- Circa €180-€250 per maand (hoger risico)

**Webdesigner, 28 jaar, €3.500/maand uitkering, 90 dagen wachttijd:**
- Circa €60-€85 per maand

**Let op:** Premies stijgen naarmate je ouder wordt. Een AOV afsluiten op je 28ste is veel goedkoper dan op je 40ste.

## Pensioen als ZZP'er: Je Bouwt Niets Automatisch Op

Dit is het schrijnende verschil met loondienst:

|  | Loon dienst | ZZP |
|---|---|---|
| Pensioenopbouw | Automatisch via werkgever | Zelf regelen |
| Premie | Werkgever betaalt (circa 18-25%) | Jij betaalt alles |
| Uitkering later | Gegarandeerd | Afhankelijk van wat je inlegt |
| Risico | Gedeeld | Helemaal van jou |

Als ZZP'er bouw je **niets** automatisch op. Geen pensioenfonds, geen verplichte inleg, geen garantie.

## Wat zijn je pensioenopties?

### 1. Niets doen (slecht idee)

Je AOW ontvang je nog steeds (die bouw je gewoon door als ZZP'er). Maar de AOW is in 2026 ongeveer €1.350 netto per maand voor alleenstaanden. Vrijwel niemand kan daarvan rondkomen.

### 2. Banksparen

Je zet geld apart op een speciale rekening. Fiscaal voordelig:
- Inleg is aftrekbaar van je inkomen (box 1)
- Je betaalt pas belasting als je het opneemt (op pensioenleeftijd, dan vaak lager tarief)

**Voordelen:** Flexibel, fiscaal gunstig
**Nadelen:** Je moet het zelf regelen, discipline nodig

### 3. Pensioenbeleggen

Je belegt voor je pensioen. Via een pensioenrekening bij een bank of beleggingsplatform.

**Voordelen:** Mogelijk hoger rendement dan sparen
**Nadelen:** Risico van beleggen, kosten van beheer

### 4. Lijfrenteverzekering

Een verzekering die later een vaste uitkering geeft.

**Voordelen:** Zekerheid, vaste uitkering
**Nadelen:** Star, meestal duurder dan banksparen

### 5. Extra aflossen op je hypotheek

Indirect pensioen opbouwen door je woonlasten te verlagen.

**Voordelen:** Zekerheid, geen ingewikkelde producten
**Nadelen:** Je geld zit "vast" in je huis

## Hoeveel moet je sparen voor je pensioen?

Vuistregel: 15-20% van je inkomen.

Voorbeeld:
- Je verdient €60.000 per jaar als ZZP'er
- Je legt 15% apart = €9.000 per jaar = €750 per maand
- Na 30 jaar heb je (bij 4% rendement) circa €520.000 opgebouwd
- Dat levert later circa €1.500-€2.000 per maand op (naast AOW)

Klinkt als veel? Dat is het ook. Maar start je 10 jaar later, dan moet je bijna het dubbele inleggen voor hetzelfde resultaat.

## De volgorde: wat regel je eerst?

Als je maar beperkt budget hebt, doe het in deze volgorde:

### Prioriteit 1: AOV (ongeveer €100-€150/maand)
Zonder inkomen vandaag heeft het geen zin om over 30 jaar te denken. Bescherm eerst je huidige inkomen.

### Prioriteit 2: Aansprakelijkheidsverzekering (circa €40/jaar)
Als je iets verkeerd doet en schade veroorzaakt, kan dit in de tienduizenden lopen.

### Prioriteit 3: Pensioen (15% van inkomen)
Pas als je bovenstaande geregeld hebt, focus je op pensioen.

### Prioriteit 4: Overige verzekeringen
Rechtsbijstand, reisverzekering, etc.

## Praktische stappen om vandaag te zetten

**Voor de AOV:**
1. Check wat je risico is (kantoorwerk vs. fysiek werk)
2. Bereken hoeveel je minimaal nodig hebt om rond te komen
3. Vraag offertes aan bij 3 aanbieders (bijv. ZZP Nederland, Anderzorg, of een onafhankelijk adviseur)
4. Lees de kleine lettertjes: welke dekking, welke uitsluitingen
5. Start met een hogere wachttijd (90 dagen) als het budget krap is - je kunt altijd later verlagen

**Voor pensioen:**
1. Open een pensioenrekening bij je bank (de meeste bieden dit aan)
2. Zet een automatische overschrijving in (bijvoorbeeld €300 per maand)
3. Doe dit direct na het binnen komen van je omzet - betaal jezelf eerst
4. Check jaarlijks of je op koers ligt

## Mijn persoonlijke setup in 2026

Dit is wat ik zelf heb geregeld:

- **AOV**: €125/maand, 30 dagen wachttijd, 80% dekking van mijn gemiddelde omzet, "eigen beroep" dekking
- **Pensioen**: €500/maand via banksparen (ongeveer 10% van mijn omzet - ik moet nog opschalen naar 15%)
- **Aansprakelijkheid**: €42/jaar
- **Rechtsbijstand**: €18/maand

Totaal: circa €670 per maand aan "zorgen voor later". Dat is veel geld. Maar ik slaap er wel beter door.

## FAQ: de vragen die ik krijg van andere ZZP'ers

### Is een AOV verplicht in 2026?
Nee, er is geen verplichting. Het wetsvoorstel BAZ (Basisverzekering Arbeidsongeschiktheid Zelfstandigen) ligt nog bij de Tweede Kamer en wordt pas verwacht in 2030 of later. Zelfs dan komt er waarschijnlijk een overgangsregeling.

### Kan ik een AOV later afsluiten?
Ja, maar het wordt duurder naarmate je ouder wordt. Bovendien: als je al gezondheidsklachten hebt, krijg je ze mogelijk uitgesloten van dekking. Start jong, als je nog gezond bent.

### Wat is goedkoper: een AOV via collectief of individueel?
Collectief is vaak 10-20% goedkoper. Check bij je branchevereniging of er collectieve AOV's zijn.

### Moet ik pensioen inleggen als ik nog jong ben?
Ja, juist dan. Pensioen is compound interest in actie. €200 per maand op je 25ste levert meer op dan €500 per maand op je 40ste.

### Kan ik mijn AOW als ZZP'er vervroegen?
Net als iedereen: vanaf 2026 is de AOW-leeftijd 67 jaar. Je kunt 1-5 jaar eerder stoppen, maar dan krijg je minder AOW. Dit geldt voor iedereen, ook ZZP'ers.

### Wat als ik geen AOV kan betalen?
Als het écht niet past in je budget, zorg dan dat je minstens 3-6 maanden reserves hebt. Dat is je "zelfverzekerde" AOV. Niet ideaal, maar beter dan niets.

## De harde conclusie

Ik begon deze tekst met mijn eigen verhaal over tendinitis. Het was een waarschuwing die ik zelf niet serieus genoeg nam.

De feiten:
- Een AOV is niet verplicht, maar wel essentieel
- Pensioen bouw je niet automatisch op - je moet het zelf doen
- De kosten zijn hoog, maar de consequenties van niets doen zijn hoger

Mijn advies: begin met een AOV. Dat is je fundament. Pas daarna ga je nadenken over pensioen.

En begin vandaag. Niet morgen. Niet "als de omzet stabiel is". Nu.

Je toekomstige zelf zal je dankbaar zijn.`,
    faq: [
      {
        question: 'Is een AOV verplicht voor ZZP\'ers in 2026?',
        answer: 'Nee, er is geen verplichte AOV in 2026. Het wetsvoorstel BAZ (Basisverzekering Arbeidsongeschiktheid Zelfstandigen) ligt nog bij de Tweede Kamer en wordt pas verwacht in 2030 of later. Het is wel sterk aan te raden om een private AOV af te sluiten.'
      },
      {
        question: 'Hoeveel kost een AOV voor een ZZP\'er in 2026?',
        answer: 'De premie varieert sterk: circa €60-€130 per maand voor kantoorwerk, €180-€250 voor fysiek werk. Factoren: leeftijd, beroep, gewenste uitkering, wachttijd. Afsluiten op jonge leeftijd scheelt veel garen op de lange termijn.'
      },
      {
        question: 'Wat is het verschil tussen AOV-dekking "eigen beroep" en "passend werk"?',
        answer: '"Eigen beroep" keert uit als jij jouw specifieke werk niet kunt doen (bijv. webdesigner die niet kan typen). "Passend werk" keert pas uit als je ook ander werk hebt geweigerd. Eigen beroep biedt de beste dekking, maar is duurder.'
      },
      {
        question: 'Hoeveel moet ik sparen voor pensioen als ZZP\'er?',
        answer: 'Vuistregel: 15-20% van je bruto omzet. Start je later? Dan moet je meer inleggen voor hetzelfde resultaat. Bijvoorbeeld: €60.000 omzet = €9.000/jaar = €750/maand. Automatiseer deze inleg direct na ontvangst van je omzet.'
      },
      {
        question: 'Kan ik later nog een AOV afsluiten als ik nu gezond ben?',
        answer: 'Ja, maar premies stijgen met je leeftijd. Bovendien kunnen nieuwe gezondheidsklachten worden uitgesloten. Afsluiten terwijl je nog gezond bent geeft de beste dekking tegen de laagste premie.'
      }
    ]
  }
]
