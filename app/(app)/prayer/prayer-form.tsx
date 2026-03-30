'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addPrayer } from './actions'

type State = { success: boolean; error?: string } | null

export default function PrayerForm() {
  const [state, formAction, pending] = useActionState<State, FormData>(addPrayer, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <label className="block text-xs text-ink-muted uppercase tracking-widest mb-1">
        New Prayer
      </label>
      <textarea
        name="content"
        placeholder="Bring it before the Lord…"
        rows={4}
        className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-3 font-serif text-ink leading-relaxed placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
      />

      {state?.error && (
        <p className="text-sm text-red-800">{state.error}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent text-parchment rounded-xl px-6 py-2.5 text-sm font-medium transition-opacity duration-500 disabled:opacity-50 cursor-pointer"
        >
          {pending ? 'Adding…' : 'Add Prayer'}
        </button>
      </div>
    </form>
  )
}
