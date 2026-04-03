'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ManaCost } from '@/components/cards/ManaSymbol'
import { useDeckStore } from '@/lib/deck-store'

const SECTION_ORDER = ['mainboard', 'sideboard']

function categorize(entries) {
  const groups = { Creatures: [], Spells: [], Lands: [], Other: [] }
  for (const entry of entries) {
    const t = entry.card.type_line ?? ''
    if (t.includes('Creature')) groups.Creatures.push(entry)
    else if (t.includes('Land')) groups.Lands.push(entry)
    else if (t.includes('Instant') || t.includes('Sorcery') || t.includes('Enchantment') || t.includes('Artifact') || t.includes('Planeswalker'))
      groups.Spells.push(entry)
    else groups.Other.push(entry)
  }
  // Sort each group by name
  for (const g of Object.values(groups)) {
    g.sort((a, b) => {
      const cmcDiff = (a.card.cmc ?? 0) - (b.card.cmc ?? 0)
      return cmcDiff !== 0 ? cmcDiff : a.card.name.localeCompare(b.card.name)
    })
  }
  return groups
}

/**
 * Full deck list with mainboard/sideboard sections, categorized by type.
 * @param {{ deck: Deck, className?: string }} props
 */
export function DeckList({ deck, className }) {
  const { addCard, removeCard } = useDeckStore()

  if (!deck) return null

  const mainEntries = deck.entries.filter((e) => e.section === 'mainboard')
  const sideEntries = deck.entries.filter((e) => e.section === 'sideboard')
  const mainCount = mainEntries.reduce((s, e) => s + e.quantity, 0)
  const sideCount = sideEntries.reduce((s, e) => s + e.quantity, 0)

  return (
    <div className={cn('space-y-4 text-sm', className)}>
      <DeckSection
        label="Mainboard"
        count={mainCount}
        entries={mainEntries}
        deckId={deck.id}
        section="mainboard"
        addCard={addCard}
        removeCard={removeCard}
      />
      {(sideCount > 0 || true) && (
        <DeckSection
          label="Sideboard"
          count={sideCount}
          entries={sideEntries}
          deckId={deck.id}
          section="sideboard"
          addCard={addCard}
          removeCard={removeCard}
        />
      )}
    </div>
  )
}

function DeckSection({ label, count, entries, deckId, section, addCard, removeCard }) {
  const groups = categorize(entries)

  return (
    <div>
      <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {label} <span className="text-foreground">({count})</span>
      </h3>
      {Object.entries(groups)
        .filter(([, g]) => g.length > 0)
        .map(([groupName, groupEntries]) => (
          <div key={groupName} className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">
              {groupName} (
              {groupEntries.reduce((s, e) => s + e.quantity, 0)})
            </div>
            {groupEntries.map((entry) => (
              <DeckEntry
                key={entry.card.id}
                entry={entry}
                deckId={deckId}
                section={section}
                addCard={addCard}
                removeCard={removeCard}
              />
            ))}
          </div>
        ))}
      {entries.length === 0 && (
        <p className="text-muted-foreground text-xs italic">No cards</p>
      )}
    </div>
  )
}

function DeckEntry({ entry, deckId, section, addCard, removeCard }) {
  const { card, quantity } = entry
  const banned = card.legalities?.pauper === 'banned'

  return (
    <div
      className={cn(
        'group flex items-center gap-2 py-0.5 px-1 rounded hover:bg-muted/50 transition-colors',
        banned && 'opacity-60',
      )}
    >
      {/* Quantity controls */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => removeCard(deckId, card, section)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive"
          aria-label="Remove one"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-5 text-center font-medium tabular-nums">{quantity}</span>
        <button
          onClick={() => addCard(deckId, card, section)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-primary"
          aria-label="Add one"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Card name */}
      <span className={cn('flex-1 truncate', banned && 'line-through text-destructive')}>
        {card.name}
      </span>

      {/* Mana cost */}
      <ManaCost cost={card.mana_cost} />
    </div>
  )
}
