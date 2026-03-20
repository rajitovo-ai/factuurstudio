import { Link } from 'react-router-dom'
import { getRelatedSupportArticles, type SupportContext } from '../../lib/support'

type Props = {
  context: SupportContext
  title?: string
}

export default function RelatedSupport({ context, title = 'Gerelateerde hulp' }: Props) {
  const articles = getRelatedSupportArticles(context, 2)

  if (articles.length === 0) return null

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
        <Link to="/support" className="text-xs font-semibold text-cyan-700 hover:underline">
          Alles bekijken
        </Link>
      </div>
      <ul className="mt-2 space-y-2">
        {articles.map((article) => (
          <li key={article.id}>
            <Link to="/support" className="text-sm font-semibold text-slate-800 hover:text-cyan-700 hover:underline">
              {article.title}
            </Link>
            <p className="text-xs text-slate-600">{article.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
