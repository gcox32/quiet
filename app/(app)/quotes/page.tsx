import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { quotes } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import QuoteForm from './quote-form'
import QuoteList from './quote-list'

export default async function QuotesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const raw = await db
    .select()
    .from(quotes)
    .where(eq(quotes.userId, user.id))
    .orderBy(desc(quotes.createdAt))

  const all = raw.map((q) => ({
    id: q.id,
    text: q.text,
    author: q.author,
    year: q.year,
    source: q.source,
    context: q.context,
    createdAt: q.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }))

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 animate-breathe-in">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Quotes</h1>
        <p className="text-ink-muted text-sm mt-1">Words worth keeping.</p>
      </header>

      <QuoteForm />

      {all.length === 0 ? (
        <p className="text-ink-muted font-serif text-center mt-16 leading-relaxed">
          Your saved quotes will appear here.
        </p>
      ) : (
        <QuoteList quotes={all} />
      )}
    </div>
  )
}
