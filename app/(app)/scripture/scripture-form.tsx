'use client'

import { useActionState, useEffect, useRef } from 'react'
import { saveScriptureNote } from './actions'
import Button from '@/components/button'
import QuoteCapture from '../quote-capture'

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
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
