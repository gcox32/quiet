'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { prayers } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

type State = { success: boolean; error?: string } | null

export async function addPrayer(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const content = (formData.get('content') as string)?.trim()
  if (!content) return { success: false, error: 'Please write something first.' }

  await db.insert(prayers).values({ userId: user.id, content })

  revalidatePath('/prayer')
  return { success: true }
}

export async function updatePrayerStatus(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const status = formData.get('status') as 'active' | 'answered' | 'archived'

  await db
    .update(prayers)
    .set({
      status,
      updatedAt: new Date(),
      answeredAt: status === 'answered' ? new Date() : undefined,
    })
    .where(and(eq(prayers.id, id), eq(prayers.userId, user.id)))

  revalidatePath('/prayer')
}
