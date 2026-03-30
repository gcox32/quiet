'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M2 12h20" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

const items = [
  { href: '/scripture', label: 'Scripture', Icon: BookIcon },
  { href: '/prayer', label: 'Prayer', Icon: CrossIcon },
  { href: '/journal', label: 'Journal', Icon: PenIcon },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-parchment border-t border-border z-50">
      <div className="flex max-w-2xl mx-auto">
        {items.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors duration-500 ${
                active ? 'text-accent' : 'text-ink-muted'
              }`}
            >
              <Icon />
              <span className="text-xs tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
