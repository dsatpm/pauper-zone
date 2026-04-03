'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, Layers } from 'lucide-react'

export function AppHeader({ children }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="h-14 border-b border-border flex items-center gap-4 px-4 shrink-0">
      <Link href="/" className="flex items-center gap-2 font-semibold text-sm">
        <Layers className="w-5 h-5 text-primary" />
        <span>Pauper Zone</span>
      </Link>

      <div className="flex-1">{children}</div>

      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Toggle theme"
      >
        {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  )
}
