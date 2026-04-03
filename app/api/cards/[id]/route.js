import { getCardById } from '@/lib/scryfall'

export async function GET(request, { params }) {
  try {
    const card = await getCardById(params.id)
    return Response.json(card)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 404 })
  }
}
