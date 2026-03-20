export type SupportArticle = {
  id: string
  title: string
  category: 'Facturen' | 'Import' | 'Abonnement' | 'Referral' | 'Account'
  summary: string
  steps: string[]
  keywords: string[]
  contexts: SupportContext[]
}

export type SupportContext =
  | 'dashboard'
  | 'invoices'
  | 'invoice-generator'
  | 'settings'
  | 'referral'
  | 'general'

export const supportCategories = ['Alle', 'Facturen', 'Import', 'Abonnement', 'Referral', 'Account'] as const

export const supportArticles: SupportArticle[] = [
  {
    id: 'invoice-statuses',
    title: 'Wat betekenen factuurstatussen?',
    category: 'Facturen',
    summary: 'Concept is nog niet verzonden, verzonden wacht op betaling, betaald is afgerond.',
    steps: [
      'Concept: factuur staat klaar maar is nog niet verzonden.',
      'Verzonden: klant heeft factuur ontvangen, betaling staat nog open.',
      'Betaald: factuur is afgerond en telt mee als ontvangen omzet.',
      'Vervallen: betaaldatum is verstreken en opvolging is nodig.',
    ],
    keywords: ['status', 'concept', 'verzonden', 'betaald', 'vervallen'],
    contexts: ['dashboard', 'invoices', 'invoice-generator'],
  },
  {
    id: 'invoice-vat',
    title: 'Hoe werken BTW en prijsmodus?',
    category: 'Facturen',
    summary: 'Kies prijzen incl. of excl. BTW. Je kunt BTW ook uitschakelen voor vrijstellingen.',
    steps: [
      'Kies prijsmodus exclusief BTW als je netto bedragen invoert.',
      'Kies inclusief BTW als je eindprijs al vastligt.',
      'Gebruik Geen BTW alleen als vrijstelling op jouw situatie van toepassing is.',
    ],
    keywords: ['btw', 'prijsmodus', 'excl', 'incl', 'vrijstelling'],
    contexts: ['invoice-generator', 'invoices'],
  },
  {
    id: 'invoice-autosave',
    title: 'Werkt autosave automatisch?',
    category: 'Facturen',
    summary: 'Ja, conceptgegevens worden lokaal bewaard zodat je verder kunt waar je was gebleven.',
    steps: [
      'Tijdens invoer wordt je concept automatisch lokaal opgeslagen.',
      'Bij opnieuw openen van Nieuwe factuur wordt je laatste concept hersteld.',
      'Na succesvol opslaan als factuur wordt het lokale concept verwijderd.',
    ],
    keywords: ['autosave', 'concept', 'opslaan', 'herstel', 'draft'],
    contexts: ['invoice-generator'],
  },
  {
    id: 'import-pdf',
    title: 'Hoe importeer ik een PDF-factuur?',
    category: 'Import',
    summary: 'Gebruik Importeer facturen, controleer de velden en sla daarna op als concept.',
    steps: [
      'Ga naar Importeer facturen en upload je PDF.',
      'Controleer of factuurnummer, klant en bedragen correct zijn overgenomen.',
      'Sla op als concept en werk details bij indien nodig.',
    ],
    keywords: ['pdf', 'import', 'ocr', 'factuur importeren'],
    contexts: ['invoices', 'dashboard'],
  },
  {
    id: 'plan-limits',
    title: 'Wat gebeurt er bij planlimieten?',
    category: 'Abonnement',
    summary: 'Je krijgt een melding zodra je maandlimiet bereikt is. Upgraden kan in instellingen.',
    steps: [
      'Je dashboard toont hoeveel facturen deze maand zijn gebruikt.',
      'Bij het bereiken van je limiet blokkeert aanmaken van nieuwe facturen.',
      'Upgrade je plan via Instellingen om weer door te gaan.',
    ],
    keywords: ['plan', 'limiet', 'abonnement', 'upgrade'],
    contexts: ['dashboard', 'settings'],
  },
  {
    id: 'referral-reward',
    title: 'Hoe werkt referral-beloning?',
    category: 'Referral',
    summary: 'Nodig iemand uit met je code. Beloning wordt verwerkt zodra de voorwaarden zijn gehaald.',
    steps: [
      'Deel je referralcode met iemand die nog geen account heeft.',
      'Nieuwe gebruiker meldt zich aan met jouw code.',
      'Beloning wordt bijgewerkt zodra aan de voorwaarden is voldaan.',
    ],
    keywords: ['referral', 'code', 'beloning', 'uitnodigen'],
    contexts: ['referral', 'dashboard'],
  },
  {
    id: 'account-security',
    title: 'Account en veiligheid',
    category: 'Account',
    summary: 'Gebruik een sterk wachtwoord en update accountgegevens via instellingen.',
    steps: [
      'Gebruik een uniek en sterk wachtwoord.',
      'Controleer bedrijfs- en contactgegevens regelmatig in Instellingen.',
      'Log uit op gedeelde apparaten.',
    ],
    keywords: ['account', 'wachtwoord', 'veiligheid', 'instellingen'],
    contexts: ['settings', 'general'],
  },
]

export const supportQuickLinks = [
  {
    title: 'Facturen maken en verzenden',
    to: '/facturen/nieuw',
  },
  {
    title: 'Importeer bestaande factuur',
    to: '/facturen/importeren',
  },
  {
    title: 'Abonnement bekijken',
    to: '/instellingen',
  },
]

export const getRelatedSupportArticles = (context: SupportContext, limit = 3): SupportArticle[] => {
  const matches = supportArticles.filter((article) => article.contexts.includes(context))
  if (matches.length >= limit) {
    return matches.slice(0, limit)
  }

  const fallback = supportArticles.filter((article) => article.contexts.includes('general'))
  return [...matches, ...fallback].slice(0, limit)
}
