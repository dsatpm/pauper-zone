'use client'

import { useState, useCallback } from 'react'
import { CardSearch } from '@/components/cards/CardSearch'
import { CardGrid } from '@/components/cards/CardGrid'
import { DeckList } from './DeckList'
import { DeckStats } from './DeckStats'
import { useDeckStore, useDeck } from '@/lib/deck-store'
import { Pencil, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Full deck builder layout: search panel | deck list | stats.
 * @param {{ deckId: string }} props
 */
export function DeckBuilder({ deckId }) {
  const deck = useDeck(deckId)
  const { addCard, removeCard, renameDeck } = useDeckStore()
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [activeSection, setActiveSection] = useState('mainboard')

  const handleResults = useCallback((cards, loading) => {
    setSearchResults(cards)
    setSearchLoading(loading)
  }, [])

  const handleAdd = useCallback(
    (card) => addCard(deckId, card, activeSection),
    [deckId, addCard, activeSection],
  )
  const handleRemove = useCallback(
    (card) => removeCard(deckId, card, activeSection),
    [deckId, removeCard, activeSection],
  )

  const getQuantity = useCallback(
    (card) =>
      deck?.entries
        .filter((e) => e.card.id === card.id && e.section === activeSection)
        .reduce((s, e) => s + e.quantity, 0) ?? 0,
    [deck, activeSection],
  )

  const startRename = () => {
    setNameInput(deck.name)
    setEditingName(true)
  }
  const confirmRename = () => {
    if (nameInput.trim()) renameDeck(deckId, nameInput.trim())
    setEditingName(false)
  }
  const cancelRename = () => setEditingName(false)

  if (!deck) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Deck not found.
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 gap-0 overflow-hidden">
      {/* ── Left: Search ───────────────────────────────────────────── */}
      <div className="w-72 shrink-0 flex flex-col border-r border-border overflow-hidden">
        <div className="p-3 border-b border-border space-y-2">
          {/* Section toggle */}
          <div className="flex rounded-md border border-border overflow-hidden text-xs">
            {['mainboard', 'sideboard'].map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={cn(
                  'flex-1 py-1.5 font-medium capitalize transition-colors',
                  activeSection === s
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted/50',
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <CardSearch onResults={handleResults} />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-3">
          {searchLoading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              Searching…
            </div>
          ) : (
            <CardGrid
              cards={searchResults}
              onAdd={handleAdd}
              onRemove={handleRemove}
              getQuantity={getQuantity}
              compact
              cols={2}
            />
          )}
        </div>
      </div>

      {/* ── Middle: Deck list ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Deck name header */}
        <div className="flex items-center gap-2 p-3 border-b border-border h-14">
          {editingName ? (
            <>
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmRename()
                  if (e.key === 'Escape') cancelRename()
                }}
                className="flex-1 rounded border border-input bg-background px-2 py-1 text-sm outline-none ring-ring focus:ring-2"
              />
              <button onClick={confirmRename} className="p-1 hover:text-primary">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={cancelRename} className="p-1 hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <h2 className="font-semibold truncate flex-1">{deck.name}</h2>
              <button
                onClick={startRename}
                className="p-1 text-muted-foreground hover:text-foreground"
                aria-label="Rename deck"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <DeckList deck={deck} />
        </div>
      </div>

      {/* ── Right: Stats ────────────────────────────────────────────── */}
      <div className="w-60 shrink-0 border-l border-border overflow-y-auto p-4">
        <DeckStats deck={deck} />
      </div>
    </div>
  )
}
