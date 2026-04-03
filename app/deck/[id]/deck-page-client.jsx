'use client'

import { DeckProvider } from '@/lib/deck-store'
import { DeckBuilder } from '@/components/deck/DeckBuilder'
import { AppHeader } from '@/components/AppHeader'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function DeckPageClient({ deckId }) {
  return (
    <DeckProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <AppHeader>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            All Decks
          </Link>
        </AppHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <DeckBuilder deckId={deckId} />
        </div>
      </div>
    </DeckProvider>
  )
}
