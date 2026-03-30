import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { scriptureNotes } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import ScriptureForm from './scripture-form'

export default async function ScripturePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const notes = await db
    .select()
    .from(scriptureNotes)
    .where(eq(scriptureNotes.userId, user.id))
    .orderBy(desc(scriptureNotes.createdAt))
    .limit(30)

  const formatted = notes.map((n) => ({
    ...n,
    createdAt: n.createdAt.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  }))

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 animate-breathe-in">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Scripture</h1>
        <p className="text-ink-muted text-sm mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>

      <ScriptureForm />

      {formatted.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xs text-ink-muted uppercase tracking-widest mb-5">
            Previous Sessions
          </h2>
          <div className="flex flex-col gap-4">
            {formatted.map((note) => (
              <div
                key={note.id}
                className="bg-parchment-deep rounded-xl p-5 border border-border"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-serif text-ink font-medium">
                    {note.passageRef || 'Untitled'}
                  </span>
                  <span className="text-xs text-ink-muted shrink-0 ml-4">{note.createdAt}</span>
                </div>
                {note.passage && (
                  <p className="font-serif text-ink text-sm leading-relaxed mb-2 line-clamp-3">
                    {note.passage}
                  </p>
                )}
                {note.notes && (
                  <p className="text-ink-muted text-sm leading-relaxed line-clamp-2 border-t border-border pt-2 mt-2">
                    {note.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
