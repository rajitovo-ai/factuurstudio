import { Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher'

const isDev = import.meta.env.DEV

export default function LandingPage() {
  const userId = useAuthStore((state) => state.userId)
  const { t, i18n } = useTranslation(['landing', 'navigation', 'common'])

  if (userId) return <Navigate to="/dashboard" replace />

  const features = [
    {
      title: t('landing:features.items.invoicesInMinutes.title'),
      description: t('landing:features.items.invoicesInMinutes.description'),
    },
    {
      title: t('landing:features.items.smartCustomerManagement.title'),
      description: t('landing:features.items.smartCustomerManagement.description'),
    },
    {
      title: t('landing:features.items.realtimeInsight.title'),
      description: t('landing:features.items.realtimeInsight.description'),
    },
    {
      title: t('landing:features.items.quickImport.title'),
      description: t('landing:features.items.quickImport.description'),
    },
    {
      title: t('landing:features.items.fasterPayment.title'),
      description: t('landing:features.items.fasterPayment.description'),
    },
    {
      title: t('landing:features.items.growthReady.title'),
      description: t('landing:features.items.growthReady.description'),
    },
  ]

  const reasons = [
    t('landing:benefits.lessWork'),
    t('landing:benefits.fasterPaid'),
    t('landing:benefits.overview'),
    t('landing:benefits.easyToUse'),
  ]

  const isEnglish = i18n.language === 'en'

  return (
    <>
    <Helmet>
      <title>{t('landing:meta.title')}</title>
      <meta name="description" content={t('landing:meta.description')} />
      <link rel="canonical" href={`https://factuurstudio.nl/${isEnglish ? '?lang=en' : ''}`} />
      <meta property="og:url" content={`https://factuurstudio.nl/${isEnglish ? '?lang=en' : ''}`} />
      <meta property="og:title" content={t('landing:og.title')} />
      <meta property="og:description" content={t('landing:og.description')} />
    </Helmet>
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#cffafe_0%,transparent_38%),radial-gradient(circle_at_85%_0%,#e2e8f0_0%,transparent_35%),linear-gradient(160deg,#f8fafc_0%,#ecfeff_45%,#f8fafc_100%)] text-slate-900">
      <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-6 py-4 backdrop-blur sm:px-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <span className="text-lg font-extrabold tracking-tight text-cyan-700">{t('common:appName')}</span>
          <div className="flex items-center gap-3">
            <Link
              to="/blog"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              {t('navigation:nav.blog')}
            </Link>
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              {t('navigation:nav.login')}
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              {t('navigation:nav.freeAccount')}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 sm:px-10 sm:pt-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
              {t('landing:badge')}
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl whitespace-pre-line">
              {t('landing:hero.title')}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              {t('landing:hero.description')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-800"
              >
                {t('landing:hero.ctaStartFree')}
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                {t('landing:hero.ctaViewDashboard')}
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {reasons.map((reason) => (
                <div key={reason} className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">
                  {reason}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{t('landing:dashboardPreview.label')}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">{t('landing:dashboardPreview.badge')}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-slate-500">{t('landing:dashboardPreview.outstanding')}</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">EUR 4.820</p>
                </div>
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-slate-500">{t('landing:dashboardPreview.thisMonth')}</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">18 {t('common:invoices').toLowerCase()}</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-white p-3">
                <p className="text-xs text-slate-500">{t('landing:dashboardPreview.recentActivity')}</p>
                <div className="mt-2 space-y-2 text-sm text-slate-700">
                  <p className="rounded-md bg-slate-50 px-2 py-1">{t('landing:dashboardPreview.activities.invoiceSent')}</p>
                  <p className="rounded-md bg-slate-50 px-2 py-1">{t('landing:dashboardPreview.activities.invoicePaid')}</p>
                  <p className="rounded-md bg-slate-50 px-2 py-1">{t('landing:dashboardPreview.activities.newCustomer')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{t('landing:features.title')}</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            {t('landing:features.subtitle')}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)]"
              >
                <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{t('landing:useCases.title')}</h2>
              <p className="mt-2 text-slate-600">{t('landing:useCases.subtitle')}</p>
            </div>
            <Link
              to="/register"
              className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100"
            >
              {t('landing:useCases.ctaTry')}
            </Link>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 p-4">
                <div className="mb-3 h-2.5 w-24 rounded bg-slate-300" />
                <div className="space-y-2">
                  <div className="h-8 rounded-md bg-white" />
                  <div className="h-8 rounded-md bg-white" />
                  <div className="h-8 rounded-md bg-white" />
                </div>
                <div className="mt-3 h-9 w-32 rounded-md bg-cyan-700" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">{t('landing:useCases.items.newInvoice.title')}</h3>
              <p className="mt-1 text-sm text-slate-600">{t('landing:useCases.items.newInvoice.description')}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-white p-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-14 rounded-md bg-white" />
                  <div className="h-14 rounded-md bg-white" />
                  <div className="h-14 rounded-md bg-white" />
                </div>
                <div className="mt-3 h-28 rounded-md bg-white" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">{t('landing:useCases.items.dashboard.title')}</h3>
              <p className="mt-1 text-sm text-slate-600">{t('landing:useCases.items.dashboard.description')}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-4">
                <div className="mb-3 h-2.5 w-20 rounded bg-emerald-200" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs text-slate-500">
                    <span>Upload PDF</span>
                    <span>OK</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs text-slate-500">
                    <span>{isEnglish ? 'Recognize fields' : 'Herken velden'}</span>
                    <span>OK</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs text-slate-500">
                    <span>{t('common:save')}</span>
                    <span>OK</span>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">{t('landing:useCases.items.import.title')}</h3>
              <p className="mt-1 text-sm text-slate-600">{t('landing:useCases.items.import.description')}</p>
            </article>
          </div>
        </section>

        {/* Social Proof Counter */}
        <section className="mt-16 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-slate-50 p-6 sm:p-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-cyan-700 sm:text-4xl">2,847+</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{isEnglish ? 'Invoices created this month' : 'Facturen gemaakt deze maand'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-cyan-700 sm:text-4xl">500+</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{isEnglish ? 'Active freelancers' : 'Actieve ZZP\'ers'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-cyan-700 sm:text-4xl">€1.2M+</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{isEnglish ? 'Invoiced this quarter' : 'Gefactureerd dit kwartaal'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-cyan-700 sm:text-4xl">98%</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{isEnglish ? 'Customer satisfaction' : 'Klanttevredenheid'}</p>
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {t('landing:trust.title')}
              </h2>
              <p className="mt-2 text-slate-600">{t('landing:trust.subtitle')}</p>
            </div>
            <Link
              to="/pricing"
              className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100"
            >
              {t('landing:trust.ctaPricing')}
            </Link>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center">
              <p className="text-2xl">{isEnglish ? '🌍' : '🇳🇱'}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{isEnglish ? t('landing:trust.items.internationalPlatform.title') : t('landing:trust.items.dutchPlatform.title')}</p>
              <p className="mt-1 text-xs text-slate-600">{isEnglish ? t('landing:trust.items.internationalPlatform.description') : t('landing:trust.items.dutchPlatform.description')}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center">
              <p className="text-2xl">🔒</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{t('landing:trust.items.secureStorage.title')}</p>
              <p className="mt-1 text-xs text-slate-600">{t('landing:trust.items.secureStorage.description')}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center">
              <p className="text-2xl">⚡</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{t('landing:trust.items.quickStart.title')}</p>
              <p className="mt-1 text-xs text-slate-600">{t('landing:trust.items.quickStart.description')}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center">
              <p className="text-2xl">📈</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{t('landing:trust.items.growsWithYou.title')}</p>
              <p className="mt-1 text-xs text-slate-600">{t('landing:trust.items.growsWithYou.description')}</p>
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">{t('landing:blog.badge')}</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {t('landing:blog.title')}
              </h2>
              <p className="mt-3 text-slate-600">
                {t('landing:blog.description')}
              </p>
            </div>
            <Link
              to="/blog/administratie-besparen"
              className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
            >
              {t('landing:blog.ctaRead')}
            </Link>
          </div>

          <article className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-cyan-200 hover:bg-white">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-800">{t('landing:blog.article.badge')}</span>
              <span>{t('landing:blog.article.readTime')}</span>
              <span>{t('landing:blog.article.date')}</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              <Link to="/blog/administratie-besparen" className="transition hover:text-cyan-700">
                {t('landing:blog.article.title')}
              </Link>
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {t('landing:blog.article.description')}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {t('landing:blog.article.bullet1')}
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {t('landing:blog.article.bullet2')}
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {t('landing:blog.article.bullet3')}
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/blog/administratie-besparen"
                className="text-sm font-bold text-cyan-700 transition hover:text-cyan-800"
              >
                {t('landing:blog.article.ctaFullArticle')} →
              </Link>
            </div>
          </article>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{t('landing:faq.title')}</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            {t('landing:faq.subtitle')}
          </p>

          <div className="mt-7 space-y-3">
            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 sm:text-base">
                {t('landing:faq.questions.free.question')}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t('landing:faq.questions.free.answer')}
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 sm:text-base">
                {t('landing:faq.questions.upgrade.question')}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t('landing:faq.questions.upgrade.answer')}
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 sm:text-base">
                {t('landing:faq.questions.firstInvoice.question')}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t('landing:faq.questions.firstInvoice.answer')}
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 sm:text-base">
                {t('landing:faq.questions.security.question')}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t('landing:faq.questions.security.answer')}
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 sm:text-base">
                {t('landing:faq.questions.mobile.question')}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t('landing:faq.questions.mobile.answer')}
              </p>
            </details>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{t('landing:cta.title')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            {t('landing:cta.description')}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-cyan-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-800"
            >
              {t('landing:cta.ctaCreateAccount')}
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-slate-300 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              {t('landing:cta.ctaHaveAccount')}
            </Link>
          </div>
        </section>

        {isDev ? (
          <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:px-6">
            <p className="font-semibold">{t('landing:referralTest.title')}</p>
            <p className="mt-1 text-xs text-amber-700">
              {t('landing:referralTest.description')}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                to="/referral"
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                {t('landing:referralTest.ctaReferral')}
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                {t('landing:referralTest.ctaLogin')}
              </Link>
            </div>
          </section>
        ) : null}
      </main>
    </div>
    </>
  )
}
