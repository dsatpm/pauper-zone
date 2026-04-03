'use client'

import { CardTile } from './CardTile'

/**
 * Responsive grid of card tiles.
 *
 * @param {{
 *   cards: ScryfallCard[],
 *   onAdd?: (card: ScryfallCard) => void,
 *   onRemove?: (card: ScryfallCard) => void,
 *   getQuantity?: (card: ScryfallCard) => number,
 *   compact?: boolean,
 *   cols?: number,
 * }} props
 */
export function CardGrid({ cards, onAdd, onRemove, getQuantity, compact = false, cols }) {
  if (!cards.length) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        No cards found
      </div>
    )
  }

  const gridClass = cols
    ? `grid gap-3`
    : compact
      ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2'
      : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'

  const style = cols ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined

  return (
    <div className={gridClass} style={style}>
      {cards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          onAdd={onAdd}
          onRemove={onRemove}
          quantity={getQuantity?.(card) ?? 0}
          compact={compact}
        />
      ))}
    </div>
  )
}
