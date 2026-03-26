import { Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuthStore } from '../stores/authStore'

const isDev = import.meta.env.DEV

const features = [
  {
    title: 'Facturen in minuten',
    description:
      'Maak professionele facturen met automatische totalen, btw-regels en een duidelijke opmaak voor je klant.',
  },
  {
    title: 'Slim klantbeheer',
    description:
      'Bewaar klantgegevens centraal en hergebruik ze direct bij elke nieuwe factuur zonder dubbel werk.',
  },
  {
    title: 'Altijd realtime inzicht',
    description:
      'Zie in een oogopslag welke facturen openstaan, betaald zijn en waar je omzet vandaag vandaan komt.',
  },
  {
    title: 'Snelle import en editing',
    description:
      'Importeer bestaande facturen, werk details snel bij en houd je administratie netjes en consistent.',
  },
  {
    title: 'Sneller betaald',
    description:
      'Verstuur duidelijke facturen met heldere betaalinformatie zodat klanten sneller begrijpen en afrekenen.',
  },
  {
    title: 'Groeiklaar platform',
    description:
      'Van starter tot groeiend bedrijf: je workflows blijven snel, overzichtelijk en schaalbaar.',
  },
]

const reasons = [
  'Minder handmatig werk en minder fouten',
  'Sneller betaald door duidelijke, professionele facturen',
  'Overzichtelijk dashboard met directe actiepunten',
  'Eenvoudig voor beginners, krachtig genoeg voor groei',
]

export default function LandingPage() {
  const userId = useAuthStore((state) => state.userId)

  if (userId) return <Navigate to="/dashboard" replace />

  return (
    <>
    <Helmet>
      <title>Factuur Studio – Online facturen maken voor zzp'ers en mkb</title>
      <meta name="description" content="Maak professionele facturen in seconden. Factuur Studio is dé eenvoudige factuurapp voor Nederlandse zzp'ers en mkb. Gratis starten, geen abonnement nodig." />
      <link rel="canonical" href="https://factuurstudio.nl/" />
      <meta property="og:url" content="https://factuurstudio.nl/" />
      <meta property="og:title" content="Factuur Studio – Online facturen maken voor zzp'ers en mkb" />
      <meta property="og:description" content="Maak professionele facturen in seconden. Gratis starten, geen abonnement nodig." />
    </Helmet>
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#cffafe_0%,transparent_38%),radial-gradient(circle_at_85%_0%,#e2e8f0_0%,transparent_35%),linear-gradient(160deg,#f8fafc_0%,#ecfeff_45%,#f8fafc_100%)] text-slate-900">
      <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-6 py-4 backdrop-blur sm:px-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <span className="text-lg font-extrabold tracking-tight text-cyan-700">Factuur Studio</span>
          <div className="flex gap-3">
            <Link
              to="/blog/administratie-besparen"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Blog
            </Link>
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Inloggen
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              Gratis account
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 sm:px-10 sm:pt-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
              Slim factureren voor ondernemers
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Professionele facturen.
              <br />
              Minder administratie.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Factuur Studio helpt je sneller facturen maken, betalingen opvolgen en je omzet scherp volgen. Alles in
              een strak platform dat direct duidelijk is voor jou en je klanten.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-800"
              >
                Start gratis
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Bekijk dashboard
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
                <span>Dashboard overzicht</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">Realtime</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-slate-500">Openstaand</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">EUR 4.820</p>
                </div>
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-slate-500">Deze maand</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">18 facturen</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-white p-3">
                <p className="text-xs text-slate-500">Laatste activiteit</p>
                <div className="mt-2 space-y-2 text-sm text-slate-700">
                  <p className="rounded-md bg-slate-50 px-2 py-1">Factuur #2026-014 verzonden</p>
                  <p className="rounded-md bg-slate-50 px-2 py-1">Factuur #2026-013 betaald</p>
                  <p className="rounded-md bg-slate-50 px-2 py-1">Nieuwe klant toegevoegd</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Wat je met het platform kan doen</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Alle kernfuncties die je nodig hebt om facturatie professioneel en overzichtelijk te organiseren.
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
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Use-cases in beeld</h2>
              <p className="mt-2 text-slate-600">Duidelijke, clean previews van hoe je team Factuur Studio dagelijks gebruikt.</p>
            </div>
            <Link
              to="/register"
              className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100"
            >
              Zelf proberen
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
              <h3 className="mt-4 text-sm font-bold text-slate-900">Nieuwe factuur maken</h3>
              <p className="mt-1 text-sm text-slate-600">Van klantselectie tot verzendklare factuur in enkele stappen.</p>
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
              <h3 className="mt-4 text-sm font-bold text-slate-900">Dashboard en opvolging</h3>
              <p className="mt-1 text-sm text-slate-600">Zie direct welke facturen actie nodig hebben en waar omzet groeit.</p>
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
                    <span>Herken velden</span>
                    <span>OK</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs text-slate-500">
                    <span>Opslaan</span>
                    <span>OK</span>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">Import en controle</h3>
              <p className="mt-1 text-sm text-slate-600">Importeer bestaande facturen en corrigeer gegevens waar nodig.</p>
            </article>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Vertrouwd door ondernemers
              </h2>
              <p className="mt-2 text-slate-600">Gemaakt voor zzp'ers en kleine bedrijven die snel willen factureren.</p>
            </div>
            <Link
              to="/pricing"
              className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100"
            >
              Bekijk prijzen
            </Link>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center">
              <p className="text-2xl">🇳🇱</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Nederlands platform</p>
              <p className="mt-1 text-xs text-slate-600">Gebouwd voor lokale facturatiebehoeften.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center">
              <p className="text-2xl">🔒</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Veilige opslag</p>
              <p className="mt-1 text-xs text-slate-600">Data blijft beschermd en versleuteld.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center">
              <p className="text-2xl">⚡</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Snel in gebruik</p>
              <p className="mt-1 text-xs text-slate-600">Binnen minuten je eerste factuur versturen.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center">
              <p className="text-2xl">📈</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Groeit met je mee</p>
              <p className="mt-1 text-xs text-slate-600">Start gratis en upgrade alleen als je wilt.</p>
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Praktische inzichten</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Slimme tips voor ondernemers die minder tijd kwijt willen zijn aan administratie
              </h2>
              <p className="mt-3 text-slate-600">
                Niet alleen software, maar ook bruikbare kennis. Lees hoe ondernemers hun facturatie strakker organiseren,
                cashflow beter bewaken en sneller betaald worden zonder extra gedoe.
              </p>
            </div>
            <Link
              to="/blog/administratie-besparen"
              className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
            >
              Bekijk artikel
            </Link>
          </div>

          <article className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-cyan-200 hover:bg-white">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-800">Nieuwe blogpost</span>
              <span>8-10 min lezen</span>
              <span>26 maart 2026</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              <Link to="/blog/administratie-besparen" className="transition hover:text-cyan-700">
                Hoe ondernemers echt uren administratie besparen en tegelijk grip houden op hun cashflow
              </Link>
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Een praktisch artikel voor zzp'ers en kleine bedrijven over sneller factureren, openstaande facturen beter
              opvolgen en slimmer werken zonder je administratie zwaarder te maken.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                Minder handmatig werk bij terugkerende facturen.
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                Meer overzicht over openstaande bedragen en betaalmomenten.
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                Betere basis voor stabiele cashflow en minder stress.
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/blog/administratie-besparen"
                className="text-sm font-bold text-cyan-700 transition hover:text-cyan-800"
              >
                Lees het volledige artikel →
              </Link>
            </div>
          </article>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Veelgestelde vragen</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Korte antwoorden op de vragen die we het meest krijgen van starters en zzp'ers.
          </p>

          <div className="mt-7 space-y-3">
            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 sm:text-base">
                Is Factuur Studio echt gratis te gebruiken?
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Ja. Je kunt starten met het Free-plan zonder creditcard. Je betaalt pas zodra je kiest voor Pro.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 sm:text-base">
                Kan ik later upgraden of terugschakelen?
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Zeker. Je kunt op elk moment upgraden naar Pro of later weer terug naar Free.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 sm:text-base">
                Hoe snel kan ik mijn eerste factuur versturen?
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Meestal binnen enkele minuten. Vul je profiel aan, voeg een klant toe en maak direct je eerste factuur.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 sm:text-base">
                Zijn mijn facturen en klantgegevens veilig?
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Ja. Gegevens worden veilig opgeslagen en alleen gebruikt voor jouw facturatieproces.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 sm:text-base">
                Werkt dit ook op mobiel?
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Ja, de interface is responsive en werkt op desktop, tablet en mobiel.
              </p>
            </details>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Klaar om slimmer te factureren?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Start gratis, ervaar direct het verschil in snelheid en overzicht, en schaal mee wanneer je bedrijf groeit.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-cyan-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-800"
            >
              Gratis account aanmaken
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-slate-300 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Ik heb al een account
            </Link>
          </div>
        </section>

        {isDev ? (
          <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:px-6">
            <p className="font-semibold">Referral testen (dev)</p>
            <p className="mt-1 text-xs text-amber-700">
              1) Log in met account A 2) open referralpagina en kopieer/open je link 3) registreer account B via die
              link.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                to="/referral"
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                Naar referralpagina
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                Inloggen
              </Link>
            </div>
          </section>
        ) : null}
      </main>
    </div>
    </>
  )
}
