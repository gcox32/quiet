'use client'

import { useActionState, useEffect, useRef } from 'react'
import { saveJournalEntry } from './actions'
import Button from '@/components/button'

type State = { success: boolean; error?: string } | null

export default function JournalForm() {
  const [state, formAction, pending] = useActionState<State, FormData>(
    saveJournalEntry,
    null
  )
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      textareaRef.current?.focus()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <textarea
        ref={textareaRef}
        name="content"
        placeholder="What's on your mind?"
        rows={12}
        className="w-full bg-parchment-deep border border-border rounded-xl px-5 py-4 font-serif text-ink text-lg leading-relaxed placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
        autoFocus
      />

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
