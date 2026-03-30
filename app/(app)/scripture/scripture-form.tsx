'use client'

import { useActionState, useEffect, useRef } from 'react'
import { saveScriptureNote } from './actions'

type State = { success: boolean; error?: string } | null

export default function ScriptureForm() {
  const [state, formAction, pending] = useActionState<State, FormData>(saveScriptureNote, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <div>
        <label className="block text-xs text-ink-muted uppercase tracking-widest mb-2">
          Passage
        </label>
        <input
          type="text"
          name="passageRef"
          placeholder="e.g. Psalm 23:1–6"
          className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-3 font-serif text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
        />
      </div>

      <div>
        <label className="block text-xs text-ink-muted uppercase tracking-widest mb-2">
          Text
        </label>
        <textarea
          name="passage"
          placeholder="Type or paste the passage here…"
          rows={5}
          className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-3 font-serif text-ink leading-relaxed placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
        />
      </div>

      <div>
        <label className="block text-xs text-ink-muted uppercase tracking-widest mb-2">
          Reflection
        </label>
        <textarea
          name="notes"
          placeholder="What is God saying to you through this passage?"
          rows={7}
          className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-3 font-serif text-ink leading-relaxed placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-800">{state.error}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent text-parchment rounded-xl px-6 py-2.5 text-sm font-medium transition-opacity duration-500 disabled:opacity-50 cursor-pointer"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}
