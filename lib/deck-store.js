'use client'

import { createContext, useCallback, useContext, useEffect, useReducer } from 'react'

const STORAGE_KEY = 'pauper-zone-decks'

function loadDecks() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function saveDecks(decks) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks))
}

function createDeck(name) {
  return {
    id: crypto.randomUUID(),
    name,
    format: 'pauper',
    entries: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// ─── Reducer ────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, decks: action.decks, hydrated: true }

    case 'CREATE_DECK': {
      const deck = createDeck(action.name)
      const decks = { ...state.decks, [deck.id]: deck }
      saveDecks(decks)
      return { ...state, decks }
    }

    case 'DELETE_DECK': {
      const decks = { ...state.decks }
      delete decks[action.id]
      saveDecks(decks)
      return { ...state, decks }
    }

    case 'RENAME_DECK': {
      const deck = state.decks[action.id]
      if (!deck) return state
      const updated = { ...deck, name: action.name, updatedAt: new Date().toISOString() }
      const decks = { ...state.decks, [action.id]: updated }
      saveDecks(decks)
      return { ...state, decks }
    }

    case 'ADD_CARD': {
      const deck = state.decks[action.deckId]
      if (!deck) return state

      const existing = deck.entries.findIndex(
        (e) => e.card.id === action.card.id && e.section === action.section,
      )

      let entries
      if (existing >= 0) {
        const isBasicLand = action.card.type_line?.includes('Basic Land')
        const currentQty = deck.entries[existing].quantity
        const totalCopies = deck.entries
          .filter((e) => e.card.name === action.card.name)
          .reduce((s, e) => s + e.quantity, 0)

        if (!isBasicLand && totalCopies >= 4) return state

        entries = deck.entries.map((e, i) =>
          i === existing ? { ...e, quantity: e.quantity + 1 } : e,
        )
      } else {
        entries = [...deck.entries, { card: action.card, quantity: 1, section: action.section }]
      }

      const updated = { ...deck, entries, updatedAt: new Date().toISOString() }
      const decks = { ...state.decks, [action.deckId]: updated }
      saveDecks(decks)
      return { ...state, decks }
    }

    case 'REMOVE_CARD': {
      const deck = state.decks[action.deckId]
      if (!deck) return state

      const existing = deck.entries.findIndex(
        (e) => e.card.id === action.card.id && e.section === action.section,
      )
      if (existing < 0) return state

      let entries
      if (deck.entries[existing].quantity > 1) {
        entries = deck.entries.map((e, i) =>
          i === existing ? { ...e, quantity: e.quantity - 1 } : e,
        )
      } else {
        entries = deck.entries.filter((_, i) => i !== existing)
      }

      const updated = { ...deck, entries, updatedAt: new Date().toISOString() }
      const decks = { ...state.decks, [action.deckId]: updated }
      saveDecks(decks)
      return { ...state, decks }
    }

    case 'SET_QUANTITY': {
      const deck = state.decks[action.deckId]
      if (!deck) return state

      let entries
      if (action.quantity <= 0) {
        entries = deck.entries.filter(
          (e) => !(e.card.id === action.card.id && e.section === action.section),
        )
      } else {
        const existing = deck.entries.findIndex(
          (e) => e.card.id === action.card.id && e.section === action.section,
        )
        if (existing >= 0) {
          entries = deck.entries.map((e, i) =>
            i === existing ? { ...e, quantity: action.quantity } : e,
          )
        } else {
          entries = [
            ...deck.entries,
            { card: action.card, quantity: action.quantity, section: action.section },
          ]
        }
      }

      const updated = { ...deck, entries, updatedAt: new Date().toISOString() }
      const decks = { ...state.decks, [action.deckId]: updated }
      saveDecks(decks)
      return { ...state, decks }
    }

    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const DeckContext = createContext(null)

export function DeckProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { decks: {}, hydrated: false })

  useEffect(() => {
    dispatch({ type: 'HYDRATE', decks: loadDecks() })
  }, [])

  const createDeckAction = useCallback((name) => {
    dispatch({ type: 'CREATE_DECK', name })
  }, [])

  const deleteDeck = useCallback((id) => dispatch({ type: 'DELETE_DECK', id }), [])
  const renameDeck = useCallback(
    (id, name) => dispatch({ type: 'RENAME_DECK', id, name }),
    [],
  )
  const addCard = useCallback(
    (deckId, card, section = 'mainboard') => dispatch({ type: 'ADD_CARD', deckId, card, section }),
    [],
  )
  const removeCard = useCallback(
    (deckId, card, section = 'mainboard') =>
      dispatch({ type: 'REMOVE_CARD', deckId, card, section }),
    [],
  )
  const setQuantity = useCallback(
    (deckId, card, section, quantity) =>
      dispatch({ type: 'SET_QUANTITY', deckId, card, section, quantity }),
    [],
  )

  return (
    <DeckContext.Provider
      value={{
        decks: state.decks,
        hydrated: state.hydrated,
        deckList: Object.values(state.decks).sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        ),
        createDeck: createDeckAction,
        deleteDeck,
        renameDeck,
        addCard,
        removeCard,
        setQuantity,
      }}
    >
      {children}
    </DeckContext.Provider>
  )
}

export function useDeckStore() {
  const ctx = useContext(DeckContext)
  if (!ctx) throw new Error('useDeckStore must be used within DeckProvider')
  return ctx
}

export function useDeck(id) {
  const { decks } = useDeckStore()
  return decks[id] ?? null
}
