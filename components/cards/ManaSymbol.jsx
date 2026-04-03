const MANA_CDN = 'https://svgs.scryfall.io/card-symbols'

/**
 * Renders mana cost pips inline, e.g. "{2}{U}{U}" → three images.
 * @param {{ cost: string, className?: string }} props
 */
export function ManaCost({ cost, className = '' }) {
  if (!cost) return null
  const pips = Array.from(cost.matchAll(/\{([^}]+)\}/g)).map((m) => m[1])

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {pips.map((pip, i) => (
        <ManaSymbol key={i} pip={pip} />
      ))}
    </span>
  )
}

/**
 * Single mana pip image.
 * @param {{ pip: string, size?: number }} props
 */
export function ManaSymbol({ pip, size = 16 }) {
  const src = `${MANA_CDN}/${pip.toLowerCase().replace('/', '')}.svg`
  return (
    <img
      src={src}
      alt={`{${pip}}`}
      width={size}
      height={size}
      className="inline-block"
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
