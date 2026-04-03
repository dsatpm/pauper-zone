/**
 * Validate a deck for Pauper format legality.
 * @param {{ entries: Array<{ card: ScryfallCard, quantity: number, section: 'mainboard'|'sideboard' }> }} deck
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateDeck(deck) {
  const errors = []
  const warnings = []

  const mainboard = deck.entries.filter((e) => e.section === 'mainboard')
  const sideboard = deck.entries.filter((e) => e.section === 'sideboard')

  const mainCount = mainboard.reduce((sum, e) => sum + e.quantity, 0)
  const sideCount = sideboard.reduce((sum, e) => sum + e.quantity, 0)

  if (mainCount < 60) {
    errors.push(`Main deck needs ${60 - mainCount} more card${60 - mainCount === 1 ? '' : 's'} (${mainCount}/60).`)
  }

  if (sideCount !== 0 && sideCount !== 15) {
    errors.push(`Sideboard must be 0 or 15 cards (currently ${sideCount}).`)
  }

  // Track copy counts across main + side combined
  const copyCounts = {}
  for (const entry of deck.entries) {
    const key = entry.card.name
    copyCounts[key] = (copyCounts[key] ?? 0) + entry.quantity
  }

  for (const entry of deck.entries) {
    const { card } = entry

    if (card.legalities?.pauper === 'banned') {
      errors.push(`${card.name} is banned in Pauper.`)
    } else if (card.legalities?.pauper !== 'legal') {
      errors.push(`${card.name} is not legal in Pauper.`)
    }

    const isBasicLand = card.type_line?.includes('Basic Land')
    if (!isBasicLand && copyCounts[card.name] > 4) {
      // Only report once per card name
      if (entry === deck.entries.find((e) => e.card.name === card.name)) {
        errors.push(`Too many copies of ${card.name} (${copyCounts[card.name]}/4).`)
      }
    }
  }

  if (mainCount > 60) {
    warnings.push(`Deck has ${mainCount} cards. Most Pauper decks run exactly 60.`)
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Get mana curve data (non-land mainboard cards).
 * @param {{ entries: Array<{ card: ScryfallCard, quantity: number, section: string }> }} deck
 * @returns {Record<number, number>} cmc → total quantity, cmc capped at 7
 */
export function getManaCurve(deck) {
  const curve = {}
  for (const { card, quantity, section } of deck.entries) {
    if (section !== 'mainboard' || card.type_line?.includes('Land')) continue
    const cmc = Math.min(Math.floor(card.cmc ?? 0), 7)
    curve[cmc] = (curve[cmc] ?? 0) + quantity
  }
  return curve
}

/**
 * Get the color identity of the deck.
 * @param {{ entries: Array<{ card: ScryfallCard }> }} deck
 * @returns {string[]} Array of color symbols present
 */
export function getDeckColors(deck) {
  const colors = new Set()
  for (const { card } of deck.entries) {
    for (const c of card.color_identity ?? []) {
      colors.add(c)
    }
  }
  return Array.from(colors)
}

/**
 * Auto-detect archetype based on key card names.
 * @param {{ entries: Array<{ card: ScryfallCard }> }} deck
 * @returns {string}
 */
export function detectArchetype(deck) {
  const names = new Set(deck.entries.map((e) => e.card.name))

  if (names.has('Myr Enforcer') || names.has('Frogmite') || names.has('Thoughtcast'))
    return 'Affinity'
  if (names.has('Spellstutter Sprite') || names.has('Ninja of the Deep Hours')) return 'Faeries'
  if (names.has("Urza's Tower") || names.has("Urza's Mine")) return 'Tron'
  if (names.has('Axebane Guardian') || names.has('Overgrown Battlement')) return 'Walls'
  if (names.has('Lightning Bolt') || names.has('Chain Lightning') || names.has('Rift Bolt'))
    return 'Burn'
  if (names.has('Quirion Ranger') || names.has('Rancor')) return 'Stompy'
  if (names.has('Akroan Skyguard') || names.has('Ethereal Armor')) return 'Heroic'
  return 'Other'
}

export const COLOR_NAMES = { W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green' }
export const COLOR_CLASSES = {
  W: 'bg-yellow-50 text-yellow-900 border-yellow-200',
  U: 'bg-blue-100 text-blue-900 border-blue-200',
  B: 'bg-gray-800 text-gray-100 border-gray-600',
  R: 'bg-red-100 text-red-900 border-red-200',
  G: 'bg-green-100 text-green-900 border-green-200',
}
