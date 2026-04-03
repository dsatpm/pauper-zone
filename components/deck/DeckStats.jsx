'use client'

import { cn } from '@/lib/utils'
import { validateDeck, getManaCurve, getDeckColors, detectArchetype, COLOR_NAMES } from '@/lib/pauper'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const COLOR_PIPS = {
  W: { bg: 'bg-yellow-200 dark:bg-yellow-800', label: 'W', title: 'White' },
  U: { bg: 'bg-blue-400 dark:bg-blue-700', label: 'U', title: 'Blue' },
  B: { bg: 'bg-gray-700 dark:bg-gray-600', label: 'B', title: 'Black' },
  R: { bg: 'bg-red-400 dark:bg-red-700', label: 'R', title: 'Red' },
  G: { bg: 'bg-green-400 dark:bg-green-700', label: 'G', title: 'Green' },
}

const CMC_LABELS = ['0', '1', '2', '3', '4', '5', '6', '7+']

/**
 * Deck statistics panel: mana curve, colors, validation.
 * @param {{ deck: Deck, className?: string }} props
 */
export function DeckStats({ deck, className }) {
  if (!deck) return null

  const { valid, errors, warnings } = validateDeck(deck)
  const curve = getManaCurve(deck)
  const colors = getDeckColors(deck)
  const archetype = detectArchetype(deck)
  const mainCount = deck.entries
    .filter((e) => e.section === 'mainboard')
    .reduce((s, e) => s + e.quantity, 0)

  const maxCurveVal = Math.max(1, ...Object.values(curve))

  return (
    <div className={cn('space-y-5 text-sm', className)}>
      {/* Validation */}
      <div>
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Validation
        </h3>
        <div
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium mb-2',
            valid
              ? 'bg-green-500/10 text-green-700 dark:text-green-400'
              : 'bg-red-500/10 text-red-700 dark:text-red-400',
          )}
        >
          {valid ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{valid ? 'Legal Pauper deck' : `${errors.length} issue${errors.length > 1 ? 's' : ''}`}</span>
          <span className="ml-auto text-xs font-normal">{mainCount}/60</span>
        </div>

        {errors.length > 0 && (
          <ul className="space-y-1">
            {errors.map((e, i) => (
              <li key={i} className="flex gap-1.5 text-xs text-red-600 dark:text-red-400">
                <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {e}
              </li>
            ))}
          </ul>
        )}

        {warnings.map((w, i) => (
          <div key={i} className="flex gap-1.5 text-xs text-yellow-600 dark:text-yellow-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {w}
          </div>
        ))}
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Colors
        </h3>
        {colors.length === 0 ? (
          <p className="text-muted-foreground text-xs italic">Colorless</p>
        ) : (
          <div className="flex gap-2 items-center">
            {['W', 'U', 'B', 'R', 'G'].filter((c) => colors.includes(c)).map((c) => (
              <div
                key={c}
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                  COLOR_PIPS[c].bg,
                  c === 'B' ? 'text-white' : 'text-gray-900',
                )}
                title={COLOR_PIPS[c].title}
              >
                {COLOR_PIPS[c].label}
              </div>
            ))}
            <span className="text-xs text-muted-foreground ml-1">{archetype}</span>
          </div>
        )}
      </div>

      {/* Mana curve */}
      <div>
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Mana Curve
        </h3>
        {Object.keys(curve).length === 0 ? (
          <p className="text-muted-foreground text-xs italic">Add non-land cards</p>
        ) : (
          <div className="flex items-end gap-1 h-20">
            {CMC_LABELS.map((label, cmc) => {
              const count = curve[cmc] ?? 0
              const heightPct = count === 0 ? 0 : Math.max(8, (count / maxCurveVal) * 100)
              return (
                <div key={cmc} className="flex-1 flex flex-col items-center gap-0.5">
                  {count > 0 && (
                    <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                  )}
                  <div
                    className={cn(
                      'w-full rounded-t transition-all duration-300',
                      count === 0 ? 'bg-muted' : 'bg-primary',
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MTGO price */}
      <div>
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Est. MTGO Cost
        </h3>
        <MtgoPrice deck={deck} />
      </div>
    </div>
  )
}

function MtgoPrice({ deck }) {
  let total = 0
  let hasData = false

  for (const { card, quantity } of deck.entries) {
    const tix = parseFloat(card.prices?.tix ?? '')
    if (!isNaN(tix)) {
      total += tix * quantity
      hasData = true
    }
  }

  if (!hasData) return <p className="text-muted-foreground text-xs italic">No price data</p>

  return (
    <p className="text-lg font-semibold tabular-nums">
      {total.toFixed(2)}{' '}
      <span className="text-xs font-normal text-muted-foreground">tix</span>
    </p>
  )
}
