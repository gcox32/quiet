'use client'

import Link from 'next/link'
import { useActionState, useMemo } from 'react'
import { signUp } from './actions'
import { verses } from '@/lib/verses'

type State = { error?: string } | null

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<State, FormData>(signUp, null)
  const verse = useMemo(() => verses[Math.floor(Math.random() * verses.length)], [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-breathe-in">
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl text-ink mb-6 tracking-wide">quiet</h1>
          <p className="font-serif text-ink-muted leading-relaxed text-sm italic mb-1">
            {verse.text}
          </p>
          <p className="text-xs text-accent-muted tracking-wide">
            {verse.reference} {verse.translation}
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            autoComplete="email"
            className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-3.5 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            required
            autoComplete="new-password"
            className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-3.5 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
          />

          {state?.error && (
            <p className="text-sm text-red-800 text-center">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-accent text-parchment rounded-xl px-4 py-3.5 font-medium transition-opacity duration-500 disabled:opacity-50 cursor-pointer"
          >
            {pending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-ink underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
