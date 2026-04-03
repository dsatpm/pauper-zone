const BASE_URL = 'https://api.scryfall.com'
const HEADERS = {
  'User-Agent': 'PauperZone/1.0 contact@pauperzone.app',
  Accept: 'application/json',
}

/**
 * Search Pauper-legal cards via Scryfall.
 * @param {string} query - User search query
 * @param {number} page
 * @returns {Promise<{ cards: ScryfallCard[], hasMore: boolean, totalCards: number }>}
 */
export async function searchCards(query, page = 1) {
  const q = query.trim() ? `format:pauper ${query}` : 'format:pauper'
  const params = new URLSearchParams({ q, order: 'name', page: String(page) })

  const res = await fetch(`${BASE_URL}/cards/search?${params}`, {
    headers: HEADERS,
    next: { revalidate: 300 },
  })

  if (res.status === 404) return { cards: [], hasMore: false, totalCards: 0 }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.details ?? `Scryfall error ${res.status}`)
  }

  const data = await res.json()
  return { cards: data.data, hasMore: data.has_more, totalCards: data.total_cards }
}

/**
 * Autocomplete card names (not limited to Pauper — filter on display).
 * @param {string} partial
 * @returns {Promise<string[]>}
 */
export async function autocompleteCardName(partial) {
  const res = await fetch(
    `${BASE_URL}/cards/autocomplete?q=${encodeURIComponent(partial)}`,
    { headers: HEADERS, next: { revalidate: 3600 } },
  )
  const data = await res.json()
  return data.data ?? []
}

/**
 * Fetch a single card by Scryfall ID.
 * @param {string} id
 * @returns {Promise<ScryfallCard>}
 */
export async function getCardById(id) {
  const res = await fetch(`${BASE_URL}/cards/${id}`, {
    headers: HEADERS,
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Card not found: ${id}`)
  return res.json()
}

/**
 * Get the card image URL, handling double-faced cards.
 * @param {ScryfallCard} card
 * @param {'small'|'normal'|'large'|'art_crop'} size
 * @returns {string}
 */
export function getCardImageUrl(card, size = 'normal') {
  return (
    card.image_uris?.[size] ??
    card.card_faces?.[0]?.image_uris?.[size] ??
    '/placeholder-card.png'
  )
}
