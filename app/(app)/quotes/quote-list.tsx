'use client'

import { useState } from 'react'
import { deleteQuote } from './actions'

type Quote = {
  id: string
  text: string
  author: string | null
  year: string | null
  source: string | null
  context: string | null
  createdAt: string
}

function normalize(s: string | null | undefined) {
  return (s ?? '').toLowerCase()
}

function matches(q: Quote, query: string) {
  const t = query.toLowerCase()
  return (
    normalize(q.text).includes(t) ||
    normalize(q.author).includes(t) ||
    normalize(q.source).includes(t) ||
    normalize(q.context).includes(t)
  )
}

export default function QuoteList({ quotes }: { quotes: Quote[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim() ? quotes.filter((q) => matches(q, query)) : quotes

  return (
    <section className="mt-12">
      {quotes.length > 0 && (
        <div className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search quotes…"
            className="w-full bg-transparent border-b border-border pb-2 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500 text-sm"
          />
        </div>
      )}

      <div className="flex flex-col gap-6">
        {filtered.map((q) => (
          <figure
            key={q.id}
            className="bg-parchment-deep rounded-xl p-5 border border-border transition-opacity duration-500"
          >
            <blockquote className="font-serif text-ink leading-relaxed text-[1.05rem] mb-4">
              &ldquo;{q.text}&rdquo;
            </blockquote>
            <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-ink-muted">
              {q.author && <span className="font-medium text-ink">{q.author}</span>}
              {q.year && <span>{q.year}</span>}
              {q.source && <span className="italic">{q.source}</span>}
              {q.context && (
                <span className="w-full text-xs mt-1 leading-relaxed">{q.context}</span>
              )}
              <span className="ml-auto text-xs">{q.createdAt}</span>
            </figcaption>
            <form action={deleteQuote.bind(null, q.id)} className="mt-3">
              <button
                type="submit"
                className="text-xs text-ink-muted underline underline-offset-2 cursor-pointer"
              >
                Remove
              </button>
            </form>
          </figure>
        ))}

        {query.trim() && filtered.length === 0 && (
          <p className="font-serif text-ink-muted text-center py-8">
            Nothing found for &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </section>
  )
}
