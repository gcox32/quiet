'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { scriptureNotes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

type State = { success: boolean; error?: string } | null

export async function saveScriptureNote(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const passageRef = (formData.get('passageRef') as string) ?? ''
  const passage = (formData.get('passage') as string) ?? ''
  const notes = (formData.get('notes') as string) ?? ''

  if (!passageRef.trim() && !passage.trim() && !notes.trim()) {
    return { success: false, error: 'Please fill in at least one field.' }
  }

  await db.insert(scriptureNotes).values({
    userId: user.id,
    passageRef,
    passage,
    notes,
  })

  revalidatePath('/scripture')
  return { success: true }
}

export async function deleteScriptureNote(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await db
    .delete(scriptureNotes)
    .where(eq(scriptureNotes.id, id))

  revalidatePath('/scripture')
}
