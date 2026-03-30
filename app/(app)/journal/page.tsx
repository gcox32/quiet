import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { journalEntries } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import JournalForm from './journal-form'

export default async function JournalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const raw = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.userId, user.id))
    .orderBy(desc(journalEntries.createdAt))
    .limit(30)

  const entries = raw.map((e) => ({
    id: e.id,
    content: e.content,
    preview: e.content.slice(0, 120) + (e.content.length > 120 ? '…' : ''),
    createdAt: e.createdAt.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  }))

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 animate-breathe-in">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Journal</h1>
        <p className="text-ink-muted text-sm mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>

      <JournalForm />

      {entries.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xs text-ink-muted uppercase tracking-widest mb-5">
            Previous Entries
          </h2>
          <div className="flex flex-col gap-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-parchment-deep rounded-xl p-5 border border-border"
              >
                <p className="text-xs text-ink-muted mb-2">{entry.createdAt}</p>
                <p className="font-serif text-ink text-sm leading-relaxed">{entry.preview}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
