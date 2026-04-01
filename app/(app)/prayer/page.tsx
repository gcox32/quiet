import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { prayers } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import PrayerForm from './prayer-form'
import { updatePrayerStatus } from './actions'
import Button from '@/components/button'

type Prayer = {
  id: string
  content: string
  status: 'active' | 'answered' | 'archived'
  createdAt: string
  answeredAt: string | null
}

const statusLabel: Record<Prayer['status'], string> = {
  active: 'Praying',
  answered: 'Answered',
  archived: 'Archived',
}

const nextStatus: Record<Prayer['status'], Prayer['status']> = {
  active: 'answered',
  answered: 'archived',
  archived: 'active',
}

const nextLabel: Record<Prayer['status'], string> = {
  active: 'Mark answered',
  answered: 'Archive',
  archived: 'Restore',
}

function PrayerCard({ prayer }: { prayer: Prayer }) {
  const next = nextStatus[prayer.status]

  return (
    <div className="bg-parchment-deep rounded-xl p-5 border border-border">
      <p className="font-serif text-ink leading-relaxed mb-3">{prayer.content}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${
              prayer.status === 'active'
                ? 'border-accent text-accent'
                : prayer.status === 'answered'
                  ? 'border-green-800 text-green-800'
                  : 'border-border text-ink-muted'
            }`}
          >
            {statusLabel[prayer.status]}
          </span>
          {prayer.answeredAt && (
            <span className="text-xs text-ink-muted">{prayer.answeredAt}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted">{prayer.createdAt}</span>
          <form action={updatePrayerStatus}>
            <input type="hidden" name="id" value={prayer.id} />
            <input type="hidden" name="status" value={next} />
            <Button
              type="submit"
              variant={prayer.status === 'active' ? 'secondary' : 'ghost'}
              size="sm"
            >
              {nextLabel[prayer.status]}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default async function PrayerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const raw = await db
    .select()
    .from(prayers)
    .where(eq(prayers.userId, user.id))
    .orderBy(desc(prayers.createdAt))

  const formatted: Prayer[] = raw.map((p) => ({
    id: p.id,
    content: p.content,
    status: p.status,
    createdAt: p.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    answeredAt: p.answeredAt
      ? p.answeredAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : null,
  }))

  const active = formatted.filter((p) => p.status === 'active')
  const answered = formatted.filter((p) => p.status === 'answered')
  const archived = formatted.filter((p) => p.status === 'archived')

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 animate-breathe-in">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Prayer</h1>
        <p className="text-ink-muted text-sm mt-1">Bring it before the Lord.</p>
      </header>

      <PrayerForm />

      {active.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs text-ink-muted uppercase tracking-widest mb-5">Active</h2>
          <div className="flex flex-col gap-4">
            {active.map((p) => (
              <PrayerCard key={p.id} prayer={p} />
            ))}
          </div>
        </section>
      )}

      {answered.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs text-ink-muted uppercase tracking-widest mb-5">Answered</h2>
          <div className="flex flex-col gap-4">
            {answered.map((p) => (
              <PrayerCard key={p.id} prayer={p} />
            ))}
          </div>
        </section>
      )}

      {archived.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs text-ink-muted uppercase tracking-widest mb-5">Archived</h2>
          <div className="flex flex-col gap-4">
            {archived.map((p) => (
              <PrayerCard key={p.id} prayer={p} />
            ))}
          </div>
        </section>
      )}

      {formatted.length === 0 && (
        <p className="text-ink-muted font-serif text-center mt-16 leading-relaxed">
          Your prayers will appear here.
        </p>
      )}
    </div>
  )
}
