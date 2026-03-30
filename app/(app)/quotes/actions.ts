'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { quotes } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type QuoteFormState = { success: boolean; error?: string } | null

export async function addQuote(
  prevState: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const text = (formData.get('text') as string)?.trim()
  if (!text) return { success: false, error: 'Quote text is required.' }

  await db.insert(quotes).values({
    userId: user.id,
    text,
    author: (formData.get('author') as string)?.trim() || null,
    year: (formData.get('year') as string)?.trim() || null,
    source: (formData.get('source') as string)?.trim() || null,
    context: (formData.get('context') as string)?.trim() || null,
  })

  revalidatePath('/quotes')
  return { success: true }
}

export async function deleteQuote(id: string) {
  'use server'
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await db.delete(quotes).where(and(eq(quotes.id, id), eq(quotes.userId, user.id)))
  revalidatePath('/quotes')
}
