'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { CardSearch } from '@/components/cards/CardSearch'
import { CardGrid } from '@/components/cards/CardGrid'
import { AppHeader } from '@/components/AppHeader'
import { DeckProvider, useDeckStore } from '@/lib/deck-store'

export function HomePage() {
  return (
    <DeckProvider>
      <HomeContent />
    </DeckProvider>
  )
}

function HomeContent() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleResults = useCallback((cards, isLoading) => {
    setResults(cards)
    setLoading(isLoading)
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Main: card search */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden p-4 gap-4">
          <CardSearch onResults={handleResults} placeholder="Search Pauper-legal cards…" />

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                Searching…
              </div>
            ) : results.length > 0 ? (
              <CardGrid cards={results} />
            ) : (
              <EmptyState />
            )}
          </div>
        </main>

        {/* Sidebar: decks */}
        <aside className="w-72 shrink-0 border-l border-border flex flex-col overflow-hidden">
          <DecksSidebar />
        </aside>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
      <div className="text-4xl">🃏</div>
      <h2 className="text-lg font-semibold">Find your next Pauper weapon</h2>
      <p className="text-muted-foreground text-sm max-w-xs">
        Search for any card — results are filtered to Pauper-legal commons. Build and save
        decks on the right.
      </p>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {['Lightning Bolt', 'Counterspell', 'Rancor', 'Snuff Out'].map((name) => (
          <span
            key={name}
            className="text-xs border border-border rounded-full px-3 py-1 text-muted-foreground"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

function DecksSidebar() {
  const { deckList, createDeck, deleteDeck, hydrated } = useDeckStore()
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    const name = newName.trim() || 'Untitled Deck'
    createDeck(name)
    setNewName('')
    setCreating(false)
    // Navigate to the newest deck (it's first in deckList after state update)
    // We'll redirect after a tick so state has updated
    setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem('pauper-zone-decks') ?? '{}')
      const ids = Object.keys(stored).sort(
        (a, b) => new Date(stored[b].updatedAt) - new Date(stored[a].updatedAt),
      )
      if (ids[0]) router.push(`/deck/${ids[0]}`)
    }, 50)
  }

  return (
    <>
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-sm">My Decks</h2>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </button>
      </div>

      {creating && (
        <div className="p-3 border-b border-border">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
              if (e.key === 'Escape') setCreating(false)
            }}
            placeholder="Deck name…"
            className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm outline-none ring-ring focus:ring-2 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="flex-1 text-xs bg-primary text-primary-foreground rounded py-1.5 hover:bg-primary/80 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => setCreating(false)}
              className="flex-1 text-xs border border-border rounded py-1.5 hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {!hydrated ? (
          <div className="p-4 text-muted-foreground text-xs">Loading…</div>
        ) : deckList.length === 0 ? (
          <div className="p-4 text-muted-foreground text-xs text-center">
            No decks yet. Create one to start building!
          </div>
        ) : (
          deckList.map((deck) => (
            <DeckRow
              key={deck.id}
              deck={deck}
              onOpen={() => router.push(`/deck/${deck.id}`)}
              onDelete={() => deleteDeck(deck.id)}
            />
          ))
        )}
      </div>
    </>
  )
}

function DeckRow({ deck, onOpen, onDelete }) {
  const cardCount = deck.entries
    .filter((e) => e.section === 'mainboard')
    .reduce((s, e) => s + e.quantity, 0)

  return (
    <div
      className="group flex items-center gap-2 px-3 py-2.5 hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors"
      onClick={onOpen}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{deck.name}</p>
        <p className="text-xs text-muted-foreground">{cardCount} cards</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-destructive"
        aria-label="Delete deck"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
