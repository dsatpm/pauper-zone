import { DeckPageClient } from './deck-page-client'

export default function DeckPage({ params }) {
  return <DeckPageClient deckId={params.id} />
}
