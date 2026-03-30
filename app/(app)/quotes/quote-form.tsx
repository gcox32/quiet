'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { addQuote, type QuoteFormState } from './actions'

type Props = {
  initialText?: string
  onSuccess?: () => void
  compact?: boolean
}

export default function QuoteForm({ initialText = '', onSuccess, compact = false }: Props) {
  const [state, formAction, pending] = useActionState<QuoteFormState, FormData>(addQuote, null)
  const [showMeta, setShowMeta] = useState(!!initialText === false && !compact)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      setShowMeta(false)
      onSuccess?.()
    }
  }, [state, onSuccess])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div>
        {!compact && (
          <label className="block text-xs text-ink-muted uppercase tracking-widest mb-2">
            Quote
          </label>
        )}
        <textarea
          name="text"
          defaultValue={initialText}
          placeholder="The quote…"
          rows={compact ? 3 : 5}
          required
          className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-3 font-serif text-ink leading-relaxed placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
        />
      </div>

      {showMeta ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs text-ink-muted uppercase tracking-widest mb-1.5">
              Author
            </label>
            <input
              type="text"
              name="author"
              placeholder="Name"
              className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-muted uppercase tracking-widest mb-1.5">
              Year
            </label>
            <input
              type="text"
              name="year"
              placeholder="e.g. 1952"
              className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-ink-muted uppercase tracking-widest mb-1.5">
              Source
            </label>
            <input
              type="text"
              name="source"
              placeholder="Book title, article, sermon…"
              className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-ink-muted uppercase tracking-widest mb-1.5">
              Context
            </label>
            <input
              type="text"
              name="context"
              placeholder="Why this struck you, where you were reading…"
              className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowMeta(true)}
          className="self-start text-xs text-ink-muted underline underline-offset-2 cursor-pointer"
        >
          Add author, source…
        </button>
      )}

      {state?.error && <p className="text-sm text-red-800">{state.error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent text-parchment rounded-xl px-6 py-2.5 text-sm font-medium transition-opacity duration-500 disabled:opacity-50 cursor-pointer"
        >
          {pending ? 'Saving…' : 'Save Quote'}
        </button>
      </div>
    </form>
  )
}
