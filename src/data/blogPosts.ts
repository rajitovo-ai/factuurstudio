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
    slug: 'zzp-starten-2024-complete-checklist',
    title: 'ZZP Starten in 2024: De Complete Checklist (Stap-voor-Stap)',
    metaDescription: 'Wil je ZZP\'er worden in 2024? Ontdek de exacte stappen: van KVK inschrijving tot eerste factuur. Inclusief handige checklist en praktische tips.',
    publishDate: '2024-01-08',
    readTime: 8,
    category: 'Starters',
    tags: ['zzp', 'starten', 'kvk', 'checklist', '2024'],
    featured: true,
    content: `## Introductie

De stap maken naar zelfstandig ondernemerschap voelt voor veel mensen als een sprong in het diepe. Je hebt een vak, een netwerk en de drive om voor jezelf te beginnen.

## Stap 1: Ondernemingsplan Maken

Voor de KVK inschrijving heb je officieel geen ondernemingsplan nodig. Toch raad ik iedereen aan om hier wel tijd in te steken.

## Stap 2: KVK Inschrijving

De Kamer van Koophandel is het eerste officiële station. Je kunt je inschrijven via kvk.nl.

## Stap 3: BTW-Nummer Aanvragen

Na je KVK-inschrijving stuurt de Belastingdienst automatisch je btw-nummer.

## Stap 4: Zakelijke Rekening Openen

Scheiden van privé en zakelijk is verstandig.

## Stap 5: Verzekeringen Afsluiten

Sommige verzekeringen zijn verplicht afhankelijk van je branche.

## Conclusie

Het starten als ZZP'er is een avontuur met veel losse eindjes.`,
    faq: [
      {
        question: 'Hoelang duurt het om ZZP\'er te worden?',
        answer: 'De KVK-inschrijving regel je binnen een week. Je btw-nummer volgt 1-2 weken later.'
      }
    ]
  },
  {
    id: '2',
    slug: 'wat-moet-er-op-factuur-staan-wetgeving-2024',
    title: 'Wat Moet Er op een Factuur Staan? Wetgeving 2024',
    metaDescription: 'Welke gegevens zijn wettelijk verplicht op een factuur? Ontdek de complete lijst met voorbeelden en voorkom boetes.',
    publishDate: '2024-01-22',
    readTime: 6,
    category: 'Facturatie',
    tags: ['factuur', 'wetgeving', 'verplicht', '2024'],
    featured: true,
    content: `## Waarom de Juiste Factuur Belangrijk Is

Een factuur is meer dan een betalingsverzoek. Het is een wettelijk document.

## Conclusie

Een correcte factuur beschermt zowel jou als je klant.`,
    faq: [
      {
        question: 'Is een factuurnummer verplicht?',
        answer: 'Ja, elke factuur moet een uniek, opeenvolgend nummer hebben.'
      }
    ]
  },
  {
    id: '3',
    slug: 'btw-nummer-aanvragen-stappenplan',
    title: 'BTW Nummer Aanvragen: Hoelang Duurt Het en Wat Heb Je Nodig?',
    metaDescription: 'Alles over het aanvragen van je btw-nummer. Hoe lang duurt het, wat heb je nodig, en wat zijn de verplichtingen?',
    publishDate: '2024-02-12',
    readTime: 5,
    category: 'Belasting',
    tags: ['btw', 'belasting', 'aanvragen', 'omzetbelasting'],
    featured: false,
    content: `## Wat is een BTW-nummer?

Je btw-nummer is je unieke identificatie bij de Belastingdienst.

## Hoe Vraag Je een BTW-nummer Aan?

Na je inschrijving bij de KVK stuurt de Belastingdienst automatisch je btw-nummer.

## Conclusie

Het aanvragen van een btw-nummer is eenvoudig omdat het automatisch gaat.`,
    faq: [
      {
        question: 'Hoelang duurt het voordat ik mijn btw-nummer krijg?',
        answer: 'Meestal 1-2 weken na je KVK-inschrijving.'
      }
    ]
  },
  {
    id: '4',
    slug: 'hobby-naar-onderneming-wanneer-ondernemer',
    title: 'Van Hobby naar Onderneming: Wanneer Ben Je Wettelijk Ondernemer?',
    metaDescription: 'Wanneer ben je wettelijk ondernemer? Ontdek de criteria van de Belastingdienst en wanneer je moet inschrijven bij de KVK.',
    publishDate: '2024-02-26',
    readTime: 7,
    category: 'Starters',
    tags: ['hobby', 'onderneming', 'kvk', 'belastingdienst', 'criteria'],
    featured: false,
    content: `## De Grens is Vaag

Veel mensen beginnen met een hobby. De grens tussen hobby en onderneming is niet altijd scherp.

## De Criteria van de Belastingdienst

De Belastingdienst hanteert criteria om te beoordelen of je ondernemer bent.

## Conclusie

De grens tussen hobby en onderneming is subjectief.`,
    faq: [
      {
        question: 'Wanneer moet ik me inschrijven bij de KVK?',
        answer: 'Als je voldoet aan de criteria (opbrengstgericht, continu, regelmatig, extern), moet je je inschrijven.'
      }
    ]
  },
  {
    id: '5',
    slug: 'uurtarief-zzp-berekenen-formule',
    title: 'Het Perfecte Uurtarief Berekenen als ZZP\'er: Formule + Voorbeelden',
    metaDescription: 'Hoe bereken je je uurtarief als ZZP\'er? Ontdek de formule, voorbeelden en tips om een marktconform en winstgevend tarief te bepalen.',
    publishDate: '2024-03-11',
    readTime: 8,
    category: 'Tarieven',
    tags: ['uurtarief', 'tarief', 'berekenen', 'zzp', 'prijs'],
    featured: false,
    content: `## Waarom je Tarief Zo Belangrijk Is

Je uurtarief bepaalt direct je inkomen.

## De Formule

Je uurtarief = (Jaarlijkse kosten + Gewenst inkomen) / Beschikbare uren

## Conclusie

Het berekenen van je uurtarief is een combinatie van wiskunde en strategie.`,
    faq: [
      {
        question: 'Hoe weet ik of mijn tarief marktconform is?',
        answer: 'Vraag collega\'s en check freelance platforms.'
      }
    ]
  },
  {
    id: '6',
    slug: 'kleineondernemersregeling-kor-btw',
    title: 'Kleineondernemersregeling (KOR): Past Dit Bij Jou of Niet?',
    metaDescription: 'Alles over de kleineondernemersregeling (KOR). Wat zijn de voordelen, nadelen en voorwaarden?',
    publishDate: '2024-03-25',
    readTime: 7,
    category: 'Belasting',
    tags: ['kor', 'kleineondernemersregeling', 'btw', 'vrijgesteld'],
    featured: false,
    content: `## Wat is de Kleineondernemersregeling?

De kleineondernemersregeling (KOR) is een btw-faciliteit voor kleine ondernemers.

## De Voorwaarden

Je omzet moet onder de €20.000 per jaar blijven.

## Conclusie

De KOR is gunstig als je omzet onder €20.000 blijft.`,
    faq: [
      {
        question: 'Wat is de omzetgrens voor de KOR?',
        answer: 'Je omzet moet onder €20.000 per jaar blijven (exclusief btw).'
      }
    ]
  },
  {
    id: '7',
    slug: 'btw-aangifte-doen-stappenplan-2024',
    title: 'BTW Aangifte Doen: Het Complete Stappenplan voor ZZP\'ers',
    metaDescription: 'Leer stap-voor-stap hoe je btw-aangifte doet als ZZP\'er. Met concrete voorbeelden, deadlines en praktische tips.',
    publishDate: '2024-04-08',
    readTime: 7,
    category: 'Belasting',
    tags: ['btw', 'aangifte', 'belastingdienst', 'kwartaal', 'zzp'],
    featured: false,
    content: `## Wanneer Moet Je Btw-Aangifte Doen?

Als ZZP\'er doe je btw-aangifte per kwartaal. Dit betekent 4 keer per jaar.

## Stap 1: Btw-Overzicht Maken

Verzamel alle facturen uit het kwartaal.

## Conclusie

Btw-aangifte is een terugkerende taak die je serieus moet nemen.`,
    faq: [
      {
        question: 'Wat gebeurt er als ik te laat aangifte doe?',
        answer: 'De Belastingdienst legt een boete op van 5% van het verschuldigde bedrag, met een minimum van €50.'
      }
    ]
  },
  {
    id: '8',
    slug: 'btw-verlegd-factureren-buitenland',
    title: 'BTW Verlegd Factureren: Handleiding voor Zakelijke Klanten in het Buitenland',
    metaDescription: 'Leer wanneer en hoe je btw verlegd factureert naar buitenlandse klanten. Met voorbeelden en wettelijke verplichte teksten.',
    publishDate: '2024-04-22',
    readTime: 6,
    category: 'Facturatie',
    tags: ['btw', 'verlegd', 'buitenland', 'eu', 'internationaal'],
    featured: false,
    content: `## Wat is Btw Verlegd?

Btw verlegd betekent dat jij geen btw berekent, maar dat je klant de btw moet afdragen.

## Wanneer Pas Je Btw Verlegd Toe?

Voor de meeste diensten geldt: de btw verschuift naar het land van de klant.

## Conclusie

Btw verlegd factureren bespaart je klant geld.`,
    faq: [
      {
        question: 'Moet ik btw verlegd factureren naar een particulier in het buitenland?',
        answer: 'Nee, particulieren betaalt altijd het btw-tarief van het land waar de dienst wordt verricht.'
      }
    ]
  },
  {
    id: '9',
    slug: 'betalingsherinneringen-incasso-facturen',
    title: 'Betalingsherinneringen en Incasso: Hoe Krijg Je Facturen Betaald?',
    metaDescription: 'Praktische tips voor het opstellen van betalingsherinneringen en incasso. Wettelijke termijnen, kosten en beste praktijken.',
    publishDate: '2024-05-06',
    readTime: 7,
    category: 'Facturatie',
    tags: ['betalen', 'herinnering', 'incasso', 'termijn', 'achterstand'],
    featured: false,
    content: `## Betalingstermijn Op Je Factuur

De betalingstermijn bepaalt wanneer een factuur betaald moet zijn.

## De Eerste Herinnering

Stuur 1-5 dagen na vervaldatum een vriendelijke herinnering.

## Conclusie

Snelheid en consistentie zijn belangrijk bij niet-betalende klanten.`,
    faq: [
      {
        question: 'Mag ik rente in rekening brengen bij laattijdige betaling?',
        answer: 'Ja, wettelijke rente is toegestaan. Voor consumenten is dit 4% boven de ECB-rente.'
      }
    ]
  },
  {
    id: '10',
    slug: 'korting-factuur-berekenen-btw',
    title: 'Korting op de Factuur: Hoe Bereken Je de BTW Correct?',
    metaDescription: 'Leer hoe je korting verwerkt op facturen en hoe de btw-berekening werkt. Met praktische voorbeelden en valkuilen.',
    publishDate: '2024-05-13',
    readTime: 6,
    category: 'Facturatie',
    tags: ['korting', 'btw', 'berekenen', 'factuur', 'discount'],
    featured: false,
    content: `## Waarom Korting Geven?

Korting op facturen is een veelgebruikt instrument.

## Soorten Korting op Facturen

### 1. Betalingskorting

Voorbeeld: 2% korting bij betaling binnen 7 dagen.

## Conclusie

Korting is een krachtig middel, maar moet correct worden toegepast.`,
    faq: [
      {
        question: 'Over welk bedrag bereken ik de btw bij korting?',
        answer: 'Altijd over het bedrag NA korting. Geef je 10% korting op €1.000, dan is het btw-bedrag 21% over €900 = €189.'
      }
    ]
  },
  {
    id: '11',
    slug: 'geldigheidsduur-factuur-wettelijk',
    title: 'Hoe Lang is een Factuur Geldig? Wettelijke Termijnen en Verval',
    metaDescription: 'Ontdek hoe lang een factuur geldig is. Wettelijke vervaltermijnen, verjaring en wat je moet weten over betalingstermijnen.',
    publishDate: '2024-05-20',
    readTime: 6,
    category: 'Facturatie',
    tags: ['geldigheid', 'verjaring', 'termijn', 'factuur', 'wettelijk'],
    featured: false,
    content: `## Wat is de Geldigheidsduur van een Factuur?

Een factuur op zichzelf "vervalt" niet. Maar je recht om betaling te eisen, verjaart wel.

## Verjaringstermijnen in Nederland

De verjaringstermijn is 5 jaar vanaf de vervaldatum.

## Conclusie

Een factuur verjaart na 5 jaar, maar intussen kun je wel alle middelen gebruiken.`,
    faq: [
      {
        question: 'Kan een klant na 5 jaar alsnog vrijwillig betalen?',
        answer: 'Ja, de schuld bestaat nog wel na verjaring. De klant kan alsnog vrijwillig betalen.'
      }
    ]
  },
  {
    id: '12',
    slug: 'verplichte-vermeldingen-factuur-uitgebreid',
    title: 'Verplichte Vermeldingen op de Factuur: De Complete Gids',
    metaDescription: 'Alle verplichte gegevens die op een factuur moeten staan volgens de wet. Met checklist en voorbeelden.',
    publishDate: '2024-05-27',
    readTime: 8,
    category: 'Facturatie',
    tags: ['verplicht', 'factuur', 'wetgeving', 'gegevens', 'checklist'],
    featured: false,
    content: `## Waarom Verplichte Vermeldingen Belangrijk Zijn

Een factuur is een officieel belastingdocument.

## De Wettelijke Basis

Artikel 35a van de Wet op de omzetbelasting bepaalt welke gegevens verplicht zijn.

## Conclusie

Een correcte factuur voorkomt problemen met klanten en de Belastingdienst.`,
    faq: [
      {
        question: 'Is een handtekening verplicht op een factuur?',
        answer: 'Nee, een handtekening is niet verplicht op facturen.'
      }
    ]
  },
  {
    id: '13',
    slug: 'administratie-bewaren-7-jaar-wettelijk',
    title: 'Administratie Bewaren: Wat, Hoe Lang en Waarom 7 Jaar?',
    metaDescription: 'Hoe lang moet je administratie bewaren als ondernemer? Ontdek de wettelijke termijnen, uitzonderingen en praktische tips.',
    publishDate: '2024-06-10',
    readTime: 6,
    category: 'Administratie',
    tags: ['bewaren', 'administratie', '7-jaar', 'archief', 'wettelijk'],
    featured: false,
    content: `## De Wettelijke Bewaartermijn

Als ondernemer ben je wettelijk verplicht om je administratie 7 jaar te bewaren.

## Wat Moet Je Allemaal Bewaren?

Alle bedrijfsadministratie moet bewaard worden.

## Conclusie

De 7-jaarsbewaarplicht is strikt, maar goed te regelen met een systematische aanpak.`,
    faq: [
      {
        question: 'Moet ik papieren facturen bewaren of mag het digitaal?',
        answer: 'Digitaal bewaren is toegestaan. Zorg dat de PDF onveranderbaar is.'
      }
    ]
  },
  {
    id: '14',
    slug: 'zakelijke-rekening-kiezen-vergelijken',
    title: 'Zakelijke Rekening Kiezen: De Complete Vergelijking 2024',
    metaDescription: 'Welke zakelijke rekening past bij jou? Vergelijk de beste banken voor ZZP\'ers en ondernemers op kosten, functies en service.',
    publishDate: '2024-06-24',
    readTime: 7,
    category: 'Starters',
    tags: ['zakelijke-rekening', 'bank', 'vergelijken', 'zzp', 'kosten'],
    featured: false,
    content: `## Waarom een Zakelijke Rekening?

Een zakelijke rekening is niet wettelijk verplicht, maar wel sterk aanbevolen.

## Populaire Banken voor ZZP'ers

Knab, Bunq, ING en Rabobank zijn populaire opties.

## Conclusie

De beste zakelijke rekening hangt af van je situatie.`,
    faq: [
      {
        question: 'Mag ik mijn privérekening voor zakelijk gebruik gebruiken?',
        answer: 'Wettelijk mag dit, maar het wordt sterk afgeraden.'
      }
    ]
  },
  {
    id: '15',
    slug: 'btw-nummer-valideren-vies-check',
    title: 'BTW Nummer Valideren: Zo Controleer Je of een Nummer Geldig is',
    metaDescription: 'Leer hoe je een btw-nummer kunt valideren met de VIES-checker. Waarom dit belangrijk is en hoe je ongeldige nummers voorkomt.',
    publishDate: '2024-07-01',
    readTime: 5,
    category: 'Facturatie',
    tags: ['btw-nummer', 'valideren', 'VIES', 'geldig', 'controle'],
    featured: false,
    content: `## Waarom een BTW-Nummer Valideren?

Het valideren van btw-nummers is essentieel bij btw-verlegd factureren.

## Wat is VIES?

VIES (VAT Information Exchange System) is het Europese systeem voor btw-nummer validatie.

## Conclusie

VIES-validatie is eenvoudig, gratis en verplicht bij btw-verlegd factureren.`,
    faq: [
      {
        question: 'Is VIES-check verplicht bij btw-verlegd factureren?',
        answer: 'Ja, je moet kunnen bewijzen dat je het btw-nummer hebt gecontroleerd.'
      }
    ]
  },
  {
    id: '16',
    slug: 'boekhoudsoftware-kiezen-zzp-vergelijken',
    title: 'Boekhoudsoftware Kiezen: De Beste Opties voor ZZP\'ers in 2024',
    metaDescription: 'Welke boekhoudsoftware past bij jou? Vergelijk de beste opties voor ZZP\'ers op prijs, gebruiksgemak en functionaliteit.',
    publishDate: '2024-07-08',
    readTime: 8,
    category: 'Administratie',
    tags: ['boekhoudsoftware', 'boekhouding', 'vergelijken', 'zzp', 'administratie'],
    featured: false,
    content: `## Waarom Boekhoudsoftware Gebruiken?

Als ZZP'er moet je administratie bijhouden.

## Populaire Boekhoudsoftware voor ZZP'ers

e-Boekhouden, Jortt, Moneybird en Twinfield zijn populaire opties.

## Conclusie

De beste boekhoudsoftware hangt af van je situatie.`,
    faq: [
      {
        question: 'Kan ik boekhoudsoftware gratis proberen?',
        answer: 'Ja, de meeste aanbieders hebben een proefperiode van 14-30 dagen.'
      }
    ]
  },
  {
    id: '17',
    slug: 'eenmanszaak-besloten-vennootschap-ondernemingsvorm',
    title: 'Eenmanszaak of BV Kiezen: Welke Ondernemingsvorm Past Bij Jou?',
    metaDescription: 'Eenmanszaak (ez) of besloten vennootschap (bv)? Ontdek de verschillen in aansprakelijkheid, belasting en kosten.',
    publishDate: '2024-07-15',
    readTime: 8,
    category: 'Starters',
    tags: ['eenmanszaak', 'bv', 'ondernemingsvorm', 'aansprakelijkheid', 'keuze'],
    featured: false,
    content: `## De Twee Meestgekozen Vormen

Als je wilt ondernemen, kies je meestal uit eenmanszaak of BV.

## Aansprakelijkheid: Het Grote Verschil

Eenmanszaak: persoonlijk aansprakelijk. BV: beperkte aansprakelijkheid.

## Conclusie

De keuze hangt af van aansprakelijkheidsrisico, omvang winst en ambitie.`,
    faq: [
      {
        question: 'Kan ik later makkelijk van eenmanszaak overstappen naar BV?',
        answer: 'Ja, maar het is wel een administratieve stap. Vraag advies van een boekhouder.'
      }
    ]
  },
  {
    id: '18',
    slug: 'zzp-pensioen-opbouwen-aov-verzekering',
    title: 'ZZP Pensioen Opbouwen: AOV en Pensioenregelingen voor Ondernemers',
    metaDescription: 'Hoe bouw je pensioen op als ZZP\'er? Ontdek alles over AOV, pensioenpremies en regelingen om later financieel zeker te zijn.',
    publishDate: '2024-07-22',
    readTime: 7,
    category: 'Starters',
    tags: ['pensioen', 'aov', 'arbeidsongeschiktheid', 'zzp', 'verzekering'],
    featured: false,
    content: `## Het Pensioenprobleem voor ZZP'ers

Als werknemer bouw je automatisch pensioen op via je werkgever. Als ZZP'er moet je dit zelf regelen.

## De Arbeidsongeschiktheidsverzekering (AOV)

De AOV is het allerbelangrijkst voor ZZP'ers.

## Conclusie

Als ZZP'er moet je zelf je financiële toekomst regelen.`,
    faq: [
      {
        question: 'Is een AOV verplicht voor ZZP\'ers?',
        answer: 'Sinds 2024 is er een basis AOV verplicht voor nieuwe ZZP\'ers via het UWV.'
      }
    ]
  }
]
