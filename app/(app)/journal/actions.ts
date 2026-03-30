'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { journalEntries } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'

type State = { success: boolean; error?: string } | null

export async function saveJournalEntry(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const content = (formData.get('content') as string)?.trim()
  if (!content) return { success: false, error: 'Nothing to save.' }

  await db.insert(journalEntries).values({ userId: user.id, content })

  revalidatePath('/journal')
  return { success: true }
}
