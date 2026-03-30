'use client'

import { useActionState } from 'react'
import { sendMagicLink } from './actions'

type State = { sent: boolean; email?: string; error?: string } | null

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<State, FormData>(sendMagicLink, null)

  if (state?.sent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-breathe-in">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-6">✦</div>
          <h1 className="font-serif text-3xl text-ink mb-4">Check your email</h1>
          <p className="text-ink-muted leading-relaxed">
            We sent a sign-in link to{' '}
            <span className="text-ink font-medium">{state.email}</span>.
            <br />
            Click it to enter.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-breathe-in">
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl text-ink mb-3 tracking-wide">Quiet</h1>
          <p className="text-ink-muted leading-relaxed text-sm">
            A space for stillness.
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

          {state?.error && (
            <p className="text-sm text-red-800 text-center">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-accent text-parchment rounded-xl px-4 py-3.5 font-medium transition-opacity duration-500 disabled:opacity-50 cursor-pointer"
          >
            {pending ? 'Sending…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
