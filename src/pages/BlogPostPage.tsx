import { Link, useParams, Navigate } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)
  const [activeSection, setActiveSection] = useState<string>('')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('h2[id]')
      let current = ''
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute('id') || ''
        }
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const headings = extractHeadings(post.content)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  return (
    <>
      <Helmet>
        <title>{post.title} | FactuurStudio Blog</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${window.location.origin}/blog/${slug}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/blog/${slug}`} />
        <meta property="og:site_name" content="FactuurStudio" />
        {post.image && <meta property="og:image" content={post.image} />}
        
        {/* Article Meta */}
        <meta property="article:published_time" content={post.publishDate} />
        <meta property="article:section" content={post.category} />
        <meta property="article:author" content="FactuurStudio" />
        {post.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        {post.image && <meta name="twitter:image" content={post.image} />}
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.metaDescription,
            url: `${window.location.origin}/blog/${slug}`,
            datePublished: post.publishDate,
            dateModified: post.publishDate,
            author: {
              '@type': 'Organization',
              name: 'FactuurStudio',
              url: window.location.origin
            },
            publisher: {
              '@type': 'Organization',
              name: 'FactuurStudio',
              url: window.location.origin,
              logo: {
                '@type': 'ImageObject',
                url: `${window.location.origin}/logo.png`
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${window.location.origin}/blog/${slug}`
            },
            ...(post.image && {
              image: {
                '@type': 'ImageObject',
                url: post.image
              }
            })
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Header */}
        <header className="bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <Link to="/" className="hover:text-cyan-700 transition">Home</Link>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link to="/blog" className="hover:text-cyan-700 transition">Blog</Link>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-700 font-medium">{post.category}</span>
            </nav>
          </div>

          <div className="mx-auto max-w-5xl px-4 pb-12 pt-8">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {post.category}
              </span>
            </div>

            <h1 className="mb-6 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.publishDate)}
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime} min leestijd
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid gap-12 lg:grid-cols-[1fr,280px]">
            {/* Article Content */}
            <div>
              {/* Intro Card */}
              <div className="mb-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 p-6 border border-cyan-100">
                <p className="text-lg leading-relaxed text-slate-700">{post.metaDescription}</p>
              </div>

              {/* Mobile TOC */}
              {headings.length > 0 && (
                <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6 lg:hidden">
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Inhoudsopgave
                  </h2>
                  <ul className="space-y-2 text-sm">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a href={`#${heading.id}`} className="flex items-center gap-2 text-slate-600 hover:text-cyan-700 transition">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Article Body in Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <article 
                  className="prose prose-lg max-w-none
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2:first-child]:mt-0
                    [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-6 [&_h3]:mb-3
                    [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-slate-600
                    [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                    [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
                    [&_li]:text-slate-600
                    [&_strong]:font-semibold [&_strong]:text-slate-800
                    [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500 [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-8 [&_blockquote]:bg-slate-50 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-slate-700
                    [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-sm
                    [&_code]:bg-slate-100 [&_code]:text-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                    [&_pre_code]:bg-transparent [&_pre_code]:text-slate-100 [&_pre_code]:p-0 [&_pre_code]:rounded-none"
                  dangerouslySetInnerHTML={{ __html: formatContent(post.content, headings) }}
                />
              </div>

              {/* FAQ Section */}
              {post.faq.length > 0 && (
                <section className="mt-16">
                  <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-slate-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100">
                      <svg className="h-5 w-5 text-cyan-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Veelgestelde vragen
                  </h2>
                  <div className="space-y-3">
                    {post.faq.map((item, index) => (
                      <div key={index} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                        <button
                          onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                          className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50"
                        >
                          <span className="font-semibold text-slate-800 pr-4">{item.question}</span>
                          <span className={`flex-shrink-0 rounded-full bg-cyan-100 p-1 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}>
                            <svg className="h-4 w-4 text-cyan-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </button>
                        {openFAQ === index && (
                          <div className="border-t border-slate-100 px-5 py-4">
                            <p className="leading-relaxed text-slate-600">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Share Section */}
              <div className="mt-12 border-t border-slate-200 pt-8">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Deel dit artikel</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => shareOnTwitter(post.title, slug || '')}
                    className="flex items-center gap-2 rounded-lg bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </button>
                  <button
                    onClick={() => shareOnLinkedIn(post.title, slug || '')}
                    className="flex items-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                    LinkedIn
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Printen
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-8 space-y-6">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Inhoudsopgave
                    </h2>
                    <nav className="space-y-1">
                      {headings.map((heading) => (
                        <a
                          key={heading.id}
                          href={`#${heading.id}`}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                            activeSection === heading.id
                              ? 'bg-cyan-50 text-cyan-700 font-medium'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${activeSection === heading.id ? 'bg-cyan-500' : 'bg-slate-300'}`}></span>
                          <span className="line-clamp-2">{heading.text}</span>
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* CTA Card */}
                <div className="rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-800 p-6 text-white">
                  <h3 className="mb-3 text-lg font-bold">Klaar om te starten?</h3>
                  <p className="mb-4 text-sm text-cyan-100">FactuurStudio maakt factureren eenvoudig. Probeer het gratis.</p>
                  <Link
                    to="/register"
                    className="block w-full rounded-lg bg-white px-4 py-3 text-center text-sm font-bold text-cyan-700 transition hover:bg-cyan-50"
                  >
                    Gratis starten
                  </Link>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Gerelateerd</h2>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group block">
                          <span className="mb-1 block text-xs font-medium text-cyan-600">{relatedPost.category}</span>
                          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-cyan-700 transition line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <span className="mt-1 block text-xs text-slate-500">{relatedPost.readTime} min leestijd</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="bg-slate-900 px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Ben je klaar om professioneel te factureren?</h2>
            <p className="mb-8 text-lg text-slate-300">Sluit je aan bij duizenden ondernemers die FactuurStudio gebruiken.</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-8 py-4 text-lg font-bold text-white transition hover:bg-cyan-400"
              >
                Start gratis
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-600 px-8 py-4 text-lg font-bold text-slate-300 transition hover:border-slate-500 hover:text-slate-200"
              >
                Bekijk prijzen
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function extractHeadings(content: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = []
  const lines = content.split('\n')
  
  lines.forEach((line) => {
    const match = line.match(/^## (.+)$/)
    if (match) {
      const text = match[1]
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      headings.push({ id, text })
    }
  })
  
  return headings
}

function formatContent(content: string, headings: { id: string; text: string }[]): string {
  let formatted = content
  
  headings.forEach((heading) => {
    formatted = formatted.replace(
      `## ${heading.text}`,
      `<h2 id="${heading.id}">${heading.text}</h2>`
    )
  })
  
  return formatted
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
}

function shareOnTwitter(title: string, slug: string) {
  const url = encodeURIComponent(`${window.location.origin}/blog/${slug}`)
  const text = encodeURIComponent(title)
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}

function shareOnLinkedIn(_title: string, slug: string) {
  const url = encodeURIComponent(`${window.location.origin}/blog/${slug}`)
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
}
