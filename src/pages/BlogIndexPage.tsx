import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import { Helmet } from 'react-helmet-async'

export default function BlogIndexPage() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const recentPosts = blogPosts
    .filter((post) => post.id !== featuredPost?.id)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <Helmet>
        <title>Blog | FactuurStudio - Kennis en Tips voor Ondernemers</title>
        <meta
          name="description"
          content="Praktische artikelen over facturatie, belastingen en ondernemen. Speciaal voor ZZP'ers en starters. Lees gratis tips en advies."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
        
        {/* Open Graph */}
        <meta property="og:title" content="Blog | FactuurStudio - Kennis en Tips voor Ondernemers" />
        <meta property="og:description" content="Praktische artikelen over facturatie, belastingen en ondernemen. Speciaal voor ZZP'ers en starters." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/blog`} />
        <meta property="og:site_name" content="FactuurStudio" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Blog | FactuurStudio" />
        <meta name="twitter:description" content="Praktische artikelen over facturatie, belastingen en ondernemen voor ZZP'ers." />
        
        {/* Schema.org CollectionPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            headline: 'FactuurStudio Blog',
            description: 'Praktische artikelen over facturatie, belastingen en ondernemen voor ZZP\'ers en starters.',
            url: `${window.location.origin}/blog`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'FactuurStudio',
              url: window.location.origin
            },
            about: [
              { '@type': 'Thing', name: 'Facturatie' },
              { '@type': 'Thing', name: 'Belastingen' },
              { '@type': 'Thing', name: 'ZZP' },
              { '@type': 'Thing', name: 'Ondernemen' }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-cyan-700 to-cyan-900 px-4 py-16 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-200">
              Kennisbank
            </p>
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Ondernemen doe je samen
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-cyan-100">
              Praktische artikelen over facturatie, belastingen en alles wat je moet weten als
              ondernemer.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="px-4 py-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-slate-800">Aanbevolen artikel</h2>
              <article className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-xl">
                <div className="p-8">
                  <div className="mb-4 flex items-center gap-4 text-sm text-slate-500">
                    <span className="rounded-full bg-cyan-100 px-3 py-1 font-medium text-cyan-800">
                      {featuredPost.category}
                    </span>
                    <span>{formatDate(featuredPost.publishDate)}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime} min leestijd</span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-slate-800 md:text-3xl">
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="hover:text-cyan-700 transition"
                    >
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p className="mb-6 text-lg text-slate-600">{featuredPost.metaDescription}</p>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center font-semibold text-cyan-700 hover:text-cyan-800"
                  >
                    Lees verder
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-2xl font-bold text-slate-800">Alle artikelen</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex-1 p-6">
                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600">
                        {post.category}
                      </span>
                      <span>{formatDate(post.publishDate)}</span>
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-slate-800">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-cyan-700 transition"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mb-4 text-sm text-slate-600 line-clamp-3">
                      {post.metaDescription}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{post.readTime} min leestijd</span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
                      >
                        Lezen →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">
              Klaar om professioneel te factureren?
            </h2>
            <p className="mb-6 text-slate-600">
              Start vandaag nog met FactuurStudio en ontdek hoe eenvoudig factureren kan zijn.
            </p>
            <Link
              to="/register"
              className="inline-block rounded-lg bg-cyan-700 px-8 py-3 font-semibold text-white transition hover:bg-cyan-800"
            >
              Gratis starten
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
