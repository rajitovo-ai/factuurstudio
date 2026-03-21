import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const features = [
  { name: 'Professionele facturen', free: true, pro: true },
  { name: 'Klantenbeheer', free: true, pro: true },
  { name: 'Dashboard inzicht', free: true, pro: true },
  { name: 'Facturen per maand', free: '5 facturen', pro: 'Onbeperkt' },
  { name: 'PDF export', free: true, pro: true },
  { name: 'Factuur import (PDF)', free: true, pro: true },
  { name: 'Diepe scan (OCR)', free: false, pro: true },
  { name: 'Factuur sjablonen', free: false, pro: true },
  { name: 'Betaaladvies via email', free: false, pro: true },
  { name: 'Automatische herinneringen', free: false, pro: true },
  { name: 'API toegang', free: false, pro: true },
  { name: 'Prioriteitsupport', free: false, pro: true },
]

export default function PricingPage() {
  const userId = useAuthStore((state) => state.userId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 flex-wrap items-center justify-between gap-2">
            <Link to="/" className="text-xl font-bold text-blue-600 sm:text-2xl">
              Factuur Studio
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              {userId ? (
                <Link
                  to="/dashboard"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700 sm:px-6"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm text-gray-700 transition hover:text-gray-900 sm:px-6"
                  >
                    Inloggen
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700 sm:px-6"
                  >
                    Gratis starten
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Kies wat bij jou past
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start gratis met de basisfeatures. Upgrade naar Pro wanneer je meer nodig hebt.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Free Plan */}
          <div className="relative rounded-2xl border-2 border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <p className="text-gray-600 mb-4">Perfect om te starten</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">€0</span>
                <span className="text-gray-600">/maand</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Geen creditcard nodig</p>
            </div>

            <Link
              to="/register"
              className="w-full py-3 px-6 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition text-center mb-8 block"
            >
              Gratis aan de slag
            </Link>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-900 mb-4">Inclusief:</p>
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  {feature.free ? (
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className={feature.free ? 'text-gray-700' : 'text-gray-400'}>
                    {typeof feature.free === 'string' ? feature.free : feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-blue-600 bg-blue-50 p-6 ring-2 ring-inset ring-blue-100 sm:p-8">
            <div className="absolute top-0 left-8 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Populair
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pro</h2>
              <p className="text-gray-600 mb-4">Voor groeiende ondernemers</p>
              <div className="mb-4 flex flex-wrap gap-4 sm:gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Maandelijks</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">€4,99</span>
                    <span className="text-gray-600">/maand</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Jaarlijks</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">€39,99</span>
                    <span className="text-gray-600">/jaar</span>
                  </div>
                  <div className="text-xs text-green-600 font-semibold">Bespaar 33%</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Altijd opzegbaar</p>
            </div>

            <div className="space-y-3 mb-8">
              <Link
                to="/register"
                className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-center block"
              >
                Upgrade naar Pro
              </Link>
              <p className="text-xs text-center text-gray-600">Geen creditcard nodig voor trial</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-900 mb-4">Alles in Free, plus:</p>
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  {feature.pro ? (
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className={feature.pro ? 'text-gray-700' : 'text-gray-400'}>
                    {typeof feature.pro === 'string' ? feature.pro : feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
          <p className="text-center text-gray-600 mb-6">Vertrouwd door ondernemers</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">🇳🇱</div>
              <p className="text-sm text-gray-600">100% Nederlands</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">🔒</div>
              <p className="text-sm text-gray-600">GDPR Compliant</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">⚡</div>
              <p className="text-sm text-gray-600">Altijd Beschikbaar</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">💯</div>
              <p className="text-sm text-gray-600">100% Gratis Starten</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Veelgestelde vragen
          </h2>
          <div className="space-y-6">
            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                Kan ik later upgraden?
                <span className="text-blue-600 group-open:rotate-180 transition">▶</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Ja! Je kunt altijd van Free naar Pro upgraden. Je betaalt dan alles naar rato voor
                het restant van de maand.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                Hoe zit het met contracten?
                <span className="text-blue-600 group-open:rotate-180 transition">▶</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Er zijn geen contracten! Je kunt je abonnement op elk moment opzeggen. Geen gedoe,
                geen verborgen kosten.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                Wat gebeurt er met mijn gegevens als ik cancel?
                <span className="text-blue-600 group-open:rotate-180 transition">▶</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Al je facturen en klanten blijven beschikbaar in je Free account. Je verliest niets!
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                Is de Free versie echt gratis?
                <span className="text-blue-600 group-open:rotate-180 transition">▶</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Ja! Je kunt de Free versie voor onbeperkt lang gebruiken. Geen creditcard nodig, geen
                trial-periode. Echt gratis.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                Hoe betaal ik?
                <span className="text-blue-600 group-open:rotate-180 transition">▶</span>
              </summary>
              <p className="text-gray-600 mt-4">
                We gebruiken Stripe voor veilige betalingen. Wij accepteren alle major creditcards en
                andere betaalmethoden.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-blue-600 text-white py-16 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Klaar om slimmer te factureren?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start gratis vandaag. Geen creditcard nodig.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
          >
            Gratis account maken
          </Link>
        </div>
      </section>
    </div>
  )
}
