'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { addQuote, type QuoteFormState } from './quotes/actions'
import { useActionState } from 'react'

type ButtonPos = { x: number; y: number }

export default function QuoteCapture() {
  const [buttonPos, setButtonPos] = useState<ButtonPos | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [showMeta, setShowMeta] = useState(false)
  const [state, formAction, pending] = useActionState<QuoteFormState, FormData>(addQuote, null)
  const formRef = useRef<HTMLFormElement>(null)
  const capturedSelectionRef = useRef('')

  const handlePointerUp = useCallback(() => {
    // Small delay so the selection is settled after the event
    setTimeout(() => {
      const sel = window.getSelection()
      const text = sel?.toString().trim() ?? ''

      if (text.length < 8) {
        setButtonPos(null)
        return
      }

      // Don't capture selections inside inputs or textareas
      const anchor = sel?.anchorNode
      let node: Node | null = anchor ?? null
      while (node) {
        if (
          node instanceof HTMLElement &&
          (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')
        ) {
          setButtonPos(null)
          return
        }
        node = node.parentNode
      }

      const range = sel?.getRangeAt(0)
      const rect = range?.getBoundingClientRect()
      if (rect) {
        capturedSelectionRef.current = text
        setButtonPos({
          x: rect.left + rect.width / 2,
          y: rect.top + window.scrollY - 44,
        })
      }
    }, 10)
  }, [])

  useEffect(() => {
    document.addEventListener('mouseup', handlePointerUp)
    document.addEventListener('touchend', handlePointerUp)
    return () => {
      document.removeEventListener('mouseup', handlePointerUp)
      document.removeEventListener('touchend', handlePointerUp)
    }
  }, [handlePointerUp])

  // Clear the bubble if the user clicks elsewhere
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-quote-bubble]') && !target.closest('[data-quote-modal]')) {
        setButtonPos(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function openModal() {
    setSelectedText(capturedSelectionRef.current)
    setModalOpen(true)
    setButtonPos(null)
    setShowMeta(false)
    window.getSelection()?.removeAllRanges()
  }

  function closeModal() {
    setModalOpen(false)
    setSelectedText('')
    setShowMeta(false)
    formRef.current?.reset()
  }

  useEffect(() => {
    if (state?.success) {
      closeModal()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <>
      {/* Floating "Quote this" button */}
      {buttonPos && (
        <button
          data-quote-bubble
          onClick={openModal}
          style={{
            position: 'absolute',
            left: buttonPos.x,
            top: buttonPos.y,
            transform: 'translateX(-50%)',
          }}
          className="z-40 bg-ink text-parchment text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap cursor-pointer animate-breathe-in"
        >
          Quote this
        </button>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ backdropFilter: 'blur(2px)', backgroundColor: 'rgba(44,24,16,0.25)' }}
        >
          <div
            data-quote-modal
            className="w-full max-w-lg bg-parchment rounded-t-2xl sm:rounded-2xl border border-border p-6 animate-breathe-in"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-serif text-xl text-ink">Save Quote</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-ink-muted text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form ref={formRef} action={formAction} className="flex flex-col gap-4">
              <textarea
                name="text"
                defaultValue={selectedText}
                rows={4}
                required
                className="w-full bg-parchment-deep border border-border rounded-xl px-4 py-3 font-serif text-ink leading-relaxed placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
              />

              {showMeta ? (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    className="bg-parchment-deep border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
                  />
                  <input
                    type="text"
                    name="year"
                    placeholder="Year"
                    className="bg-parchment-deep border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
                  />
                  <input
                    type="text"
                    name="source"
                    placeholder="Source"
                    className="col-span-2 bg-parchment-deep border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
                  />
                  <input
                    type="text"
                    name="context"
                    placeholder="Context"
                    className="col-span-2 bg-parchment-deep border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-accent-muted focus:border-accent transition-colors duration-500"
                  />
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
                  {pending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
