import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'

const getFeatures = (t: (key: string) => string) => [
  { name: t('pricing:features.professionalInvoices'), free: true, pro: true },
  { name: t('pricing:features.customerManagement'), free: true, pro: true },
  { name: t('pricing:features.dashboard'), free: true, pro: true },
  { name: t('pricing:features.invoicesPerMonth'), free: t('pricing:features.fiveInvoices'), pro: t('pricing:features.unlimited') },
  { name: t('pricing:features.pdfExport'), free: true, pro: true },
  { name: t('pricing:features.invoiceImport'), free: true, pro: true },
  { name: t('pricing:features.deepScan'), free: false, pro: true },
  { name: t('pricing:features.templates'), free: false, pro: true },
  { name: t('pricing:features.paymentAdvice'), free: false, pro: true },
  { name: t('pricing:features.reminders'), free: false, pro: true },
  { name: t('pricing:features.api'), free: false, pro: true },
  { name: t('pricing:features.prioritySupport'), free: false, pro: true },
]

export default function PricingPage() {
  const { t } = useTranslation(['pricing', 'common'])
  const userId = useAuthStore((state) => state.userId)
  const features = getFeatures(t)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Helmet>
        <title>{t('pricing:meta.title')}</title>
        <meta name="description" content={t('pricing:meta.description')} />
        <link rel="canonical" href="https://factuurstudio.nl/pricing" />
        <meta property="og:url" content="https://factuurstudio.nl/pricing" />
        <meta property="og:title" content={t('pricing:meta.title')} />
        <meta property="og:description" content={t('pricing:meta.description')} />
      </Helmet>
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
                  {t('pricing:nav.dashboard')}
                </Link>
              ) : (
                <>
                  <Link
                    to="/blog"
                    className="px-3 py-2 text-sm text-gray-700 transition hover:text-gray-900 sm:px-6"
                  >
                    {t('pricing:nav.blog')}
                  </Link>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm text-gray-700 transition hover:text-gray-900 sm:px-6"
                  >
                    {t('pricing:nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700 sm:px-6"
                  >
                    {t('pricing:nav.startFree')}
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
            {t('pricing:hero.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing:hero.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Free Plan */}
          <div className="relative rounded-2xl border-2 border-gray-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing:plans.free.name')}</h2>
              <p className="text-gray-600 mb-4">{t('pricing:plans.free.description')}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{t('pricing:plans.free.price')}</span>
                <span className="text-gray-600">{t('pricing:plans.free.perMonth')}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{t('pricing:plans.free.noCard')}</p>
            </div>

            <Link
              to="/register"
              className="w-full py-3 px-6 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition text-center mb-8 block"
            >
              {t('pricing:plans.free.cta')}
            </Link>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-900 mb-4">{t('pricing:plans.free.includes')}</p>
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
              {t('pricing:plans.pro.badge')}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing:plans.pro.name')}</h2>
              <p className="text-gray-600 mb-4">{t('pricing:plans.pro.description')}</p>
              <div className="mb-4 flex flex-wrap gap-4 sm:gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">{t('pricing:plans.pro.monthly')}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">€4,99</span>
                    <span className="text-gray-600">{t('pricing:plans.pro.perMonth')}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">{t('pricing:plans.pro.yearly')}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">€39,99</span>
                    <span className="text-gray-600">{t('pricing:plans.pro.perYear')}</span>
                  </div>
                  <div className="text-xs text-green-600 font-semibold">{t('pricing:plans.pro.save')}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{t('pricing:plans.pro.cancelAnytime')}</p>
            </div>

            <div className="space-y-3 mb-8">
              <Link
                to="/register"
                className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-center block"
              >
                {t('pricing:plans.pro.cta')}
              </Link>
              <p className="text-xs text-center text-gray-600">{t('pricing:plans.pro.trialNote')}</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-900 mb-4">{t('pricing:plans.pro.includes')}</p>
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
          <p className="text-center text-gray-600 mb-6">{t('pricing:trust.title')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">🇳🇱</div>
              <p className="text-sm text-gray-600">{t('pricing:trust.dutch')}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">🔒</div>
              <p className="text-sm text-gray-600">{t('pricing:trust.gdpr')}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">⚡</div>
              <p className="text-sm text-gray-600">{t('pricing:trust.available')}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">💯</div>
              <p className="text-sm text-gray-600">{t('pricing:trust.freeStart')}</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('pricing:faq.title')}
          </h2>
          <div className="space-y-6">
            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                {t('pricing:faq.upgradeLater.question')}
                <span className="text-blue-600 group-open:rotate-180 transition">▶</span>
              </summary>
              <p className="text-gray-600 mt-4">
                {t('pricing:faq.upgradeLater.answer')}
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                {t('pricing:faq.contracts.question')}
                <span className="text-blue-600 group-open:rotate-180 transition">▶</span>
              </summary>
              <p className="text-gray-600 mt-4">
                {t('pricing:faq.contracts.answer')}
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                {t('pricing:faq.dataOnCancel.question')}
                <span className="text-blue-600 group-open:rotate-180 transition">▶</span>
              </summary>
              <p className="text-gray-600 mt-4">
                {t('pricing:faq.dataOnCancel.answer')}
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                {t('pricing:faq.reallyFree.question')}
                <span className="text-blue-600 group-open:rotate-180 transition">▶</span>
              </summary>
              <p className="text-gray-600 mt-4">
                {t('pricing:faq.reallyFree.answer')}
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="text-lg font-semibold text-gray-900 flex justify-between items-center">
                {t('pricing:faq.payment.question')}
                <span className="text-blue-600 group-open:rotate-180 transition">▶</span>
              </summary>
              <p className="text-gray-600 mt-4">
                {t('pricing:faq.payment.answer')}
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-blue-600 text-white py-16 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('pricing:cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('pricing:cta.subtitle')}
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
          >
            {t('pricing:cta.button')}
          </Link>
        </div>
      </section>
    </div>
  )
}
