'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCardImageUrl } from '@/lib/scryfall'
import { ManaCost } from './ManaSymbol'
import { LegalityBadge } from './LegalityBadge'

/**
 * Card tile with hover zoom and add/remove controls.
 *
 * @param {{
 *   card: ScryfallCard,
 *   onAdd?: (card: ScryfallCard) => void,
 *   onRemove?: (card: ScryfallCard) => void,
 *   quantity?: number,
 *   showControls?: boolean,
 *   compact?: boolean,
 *   className?: string,
 * }} props
 */
export function CardTile({
  card,
  onAdd,
  onRemove,
  quantity = 0,
  showControls = true,
  compact = false,
  className,
}) {
  const [hovered, setHovered] = useState(false)
  const imgUrl = getCardImageUrl(card, compact ? 'small' : 'normal')
  const legality = card.legalities?.pauper ?? 'not_legal'

  return (
    <div
      className={cn('group relative rounded-lg overflow-hidden cursor-pointer', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card image */}
      <div className={cn('relative', compact ? 'aspect-[2/3]' : 'aspect-[5/7]')}>
        <img
          src={imgUrl}
          alt={card.name}
          className={cn(
            'w-full h-full object-cover rounded-lg transition-transform duration-200',
            hovered && 'scale-105',
          )}
          loading="lazy"
        />

        {/* Legality overlay for banned cards */}
        {legality === 'banned' && (
          <div className="absolute inset-0 bg-red-900/60 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm rotate-[-20deg] border-2 border-white px-2 py-1">
              BANNED
            </span>
          </div>
        )}

        {/* Controls overlay on hover */}
        {showControls && (hovered || quantity > 0) && (
          <div className="absolute inset-0 rounded-lg bg-black/40 flex flex-col items-center justify-end pb-2 gap-1">
            {quantity > 0 && (
              <span className="text-white font-bold text-lg bg-black/60 rounded-full w-8 h-8 flex items-center justify-center">
                {quantity}
              </span>
            )}
            <div className="flex gap-1">
              {onRemove && quantity > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(card)
                  }}
                  className="bg-background/90 hover:bg-background rounded-full p-1 transition-colors"
                  aria-label="Remove one"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
              {onAdd && legality === 'legal' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAdd(card)
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-full p-1 transition-colors"
                  aria-label="Add one"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card info below image (non-compact mode) */}
      {!compact && (
        <div className="mt-1 px-0.5">
          <div className="flex items-start justify-between gap-1">
            <span className="text-xs font-medium leading-tight line-clamp-1">{card.name}</span>
            <ManaCost cost={card.mana_cost} className="shrink-0" />
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <LegalityBadge legality={legality} />
            {card.prices?.tix && (
              <span className="text-xs text-muted-foreground">{card.prices.tix} tix</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
