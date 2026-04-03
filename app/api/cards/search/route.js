import { searchCards } from '@/lib/scryfall'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1', 10)

  try {
    const result = await searchCards(q, page)
    return Response.json(result)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
