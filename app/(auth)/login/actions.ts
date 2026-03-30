'use server'

import { createClient } from '@/lib/supabase/server'

type State = { sent: boolean; email?: string; error?: string } | null

export async function sendMagicLink(prevState: State, formData: FormData): Promise<State> {
  const email = formData.get('email') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { sent: false, error: error.message }
  }

  return { sent: true, email }
}
