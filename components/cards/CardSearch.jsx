'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const COLORS = ['W', 'U', 'B', 'R', 'G']
const COLOR_LABELS = { W: 'W', U: 'U', B: 'B', R: 'R', G: 'G' }
const COLOR_STYLES = {
  W: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 text-yellow-800 dark:text-yellow-300',
  U: 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 text-blue-800 dark:text-blue-300',
  B: 'bg-gray-800 border-gray-600 text-gray-100',
  R: 'bg-red-50 dark:bg-red-900/30 border-red-300 text-red-800 dark:text-red-300',
  G: 'bg-green-50 dark:bg-green-900/30 border-green-300 text-green-800 dark:text-green-300',
}

/**
 * Card search bar with color filters. Calls onResults with fetched cards.
 *
 * @param {{
 *   onResults: (cards: ScryfallCard[], loading: boolean) => void,
 *   placeholder?: string,
 *   className?: string,
 * }} props
 */
export function CardSearch({ onResults, placeholder = 'Search Pauper-legal cards…', className }) {
  const [query, setQuery] = useState('')
  const [colors, setColors] = useState([])
  const [loading, setLoading] = useState(false)
  const [debouncedQuery] = useDebounce(query, 350)
  const [debouncedColors] = useDebounce(colors, 350)

  const toggleColor = useCallback((c) => {
    setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }, [])

  useEffect(() => {
    const q = buildQuery(debouncedQuery, debouncedColors)
    setLoading(true)
    onResults([], true)

    fetch(`/api/cards/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        onResults(data.cards ?? [], false)
        setLoading(false)
      })
      .catch(() => {
        onResults([], false)
        setLoading(false)
      })
  }, [debouncedQuery, debouncedColors, onResults])

  return (
    <div className={cn('space-y-2', className)}>
      {/* Text input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-input bg-background pl-9 pr-9 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        ) : (
          query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {/* Color filter */}
      <div className="flex gap-1.5">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => toggleColor(c)}
            className={cn(
              'w-8 h-8 rounded-full border-2 text-xs font-bold transition-all',
              colors.includes(c) ? COLOR_STYLES[c] : 'border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground',
            )}
            title={`Filter ${c}`}
          >
            {COLOR_LABELS[c]}
          </button>
        ))}
        {colors.length > 0 && (
          <button
            onClick={() => setColors([])}
            className="ml-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

function buildQuery(text, colors) {
  const parts = []
  if (text.trim()) parts.push(text.trim())
  if (colors.length > 0) parts.push(`c:${colors.join('')}`)
  return parts.join(' ')
}
