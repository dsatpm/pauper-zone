(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_4c3aa5._.js", {

"[project]/lib/deck-store.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DeckProvider": (()=>DeckProvider),
    "useDeck": (()=>useDeck),
    "useDeckStore": (()=>useDeckStore)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature(), _s1 = __turbopack_refresh__.signature(), _s2 = __turbopack_refresh__.signature();
'use client';
;
const STORAGE_KEY = 'pauper-zone-decks';
function loadDecks() {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch  {
        return {};
    }
}
function saveDecks(decks) {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}
function createDeck(name) {
    return {
        id: crypto.randomUUID(),
        name,
        format: 'pauper',
        entries: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}
// ─── Reducer ────────────────────────────────────────────────────────────────
function reducer(state, action) {
    switch(action.type){
        case 'HYDRATE':
            return {
                ...state,
                decks: action.decks,
                hydrated: true
            };
        case 'CREATE_DECK':
            {
                const deck = createDeck(action.name);
                const decks = {
                    ...state.decks,
                    [deck.id]: deck
                };
                saveDecks(decks);
                return {
                    ...state,
                    decks
                };
            }
        case 'DELETE_DECK':
            {
                const decks = {
                    ...state.decks
                };
                delete decks[action.id];
                saveDecks(decks);
                return {
                    ...state,
                    decks
                };
            }
        case 'RENAME_DECK':
            {
                const deck = state.decks[action.id];
                if (!deck) return state;
                const updated = {
                    ...deck,
                    name: action.name,
                    updatedAt: new Date().toISOString()
                };
                const decks = {
                    ...state.decks,
                    [action.id]: updated
                };
                saveDecks(decks);
                return {
                    ...state,
                    decks
                };
            }
        case 'ADD_CARD':
            {
                const deck = state.decks[action.deckId];
                if (!deck) return state;
                const existing = deck.entries.findIndex((e)=>e.card.id === action.card.id && e.section === action.section);
                let entries;
                if (existing >= 0) {
                    const isBasicLand = action.card.type_line?.includes('Basic Land');
                    const currentQty = deck.entries[existing].quantity;
                    const totalCopies = deck.entries.filter((e)=>e.card.name === action.card.name).reduce((s, e)=>s + e.quantity, 0);
                    if (!isBasicLand && totalCopies >= 4) return state;
                    entries = deck.entries.map((e, i)=>i === existing ? {
                            ...e,
                            quantity: e.quantity + 1
                        } : e);
                } else {
                    entries = [
                        ...deck.entries,
                        {
                            card: action.card,
                            quantity: 1,
                            section: action.section
                        }
                    ];
                }
                const updated = {
                    ...deck,
                    entries,
                    updatedAt: new Date().toISOString()
                };
                const decks = {
                    ...state.decks,
                    [action.deckId]: updated
                };
                saveDecks(decks);
                return {
                    ...state,
                    decks
                };
            }
        case 'REMOVE_CARD':
            {
                const deck = state.decks[action.deckId];
                if (!deck) return state;
                const existing = deck.entries.findIndex((e)=>e.card.id === action.card.id && e.section === action.section);
                if (existing < 0) return state;
                let entries;
                if (deck.entries[existing].quantity > 1) {
                    entries = deck.entries.map((e, i)=>i === existing ? {
                            ...e,
                            quantity: e.quantity - 1
                        } : e);
                } else {
                    entries = deck.entries.filter((_, i)=>i !== existing);
                }
                const updated = {
                    ...deck,
                    entries,
                    updatedAt: new Date().toISOString()
                };
                const decks = {
                    ...state.decks,
                    [action.deckId]: updated
                };
                saveDecks(decks);
                return {
                    ...state,
                    decks
                };
            }
        case 'SET_QUANTITY':
            {
                const deck = state.decks[action.deckId];
                if (!deck) return state;
                let entries;
                if (action.quantity <= 0) {
                    entries = deck.entries.filter((e)=>!(e.card.id === action.card.id && e.section === action.section));
                } else {
                    const existing = deck.entries.findIndex((e)=>e.card.id === action.card.id && e.section === action.section);
                    if (existing >= 0) {
                        entries = deck.entries.map((e, i)=>i === existing ? {
                                ...e,
                                quantity: action.quantity
                            } : e);
                    } else {
                        entries = [
                            ...deck.entries,
                            {
                                card: action.card,
                                quantity: action.quantity,
                                section: action.section
                            }
                        ];
                    }
                }
                const updated = {
                    ...deck,
                    entries,
                    updatedAt: new Date().toISOString()
                };
                const decks = {
                    ...state.decks,
                    [action.deckId]: updated
                };
                saveDecks(decks);
                return {
                    ...state,
                    decks
                };
            }
        default:
            return state;
    }
}
// ─── Context ─────────────────────────────────────────────────────────────────
const DeckContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function DeckProvider({ children }) {
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(reducer, {
        decks: {},
        hydrated: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DeckProvider.useEffect": ()=>{
            dispatch({
                type: 'HYDRATE',
                decks: loadDecks()
            });
        }
    }["DeckProvider.useEffect"], []);
    const createDeckAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DeckProvider.useCallback[createDeckAction]": (name)=>{
            dispatch({
                type: 'CREATE_DECK',
                name
            });
        }
    }["DeckProvider.useCallback[createDeckAction]"], []);
    const deleteDeck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DeckProvider.useCallback[deleteDeck]": (id)=>dispatch({
                type: 'DELETE_DECK',
                id
            })
    }["DeckProvider.useCallback[deleteDeck]"], []);
    const renameDeck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DeckProvider.useCallback[renameDeck]": (id, name)=>dispatch({
                type: 'RENAME_DECK',
                id,
                name
            })
    }["DeckProvider.useCallback[renameDeck]"], []);
    const addCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DeckProvider.useCallback[addCard]": (deckId, card, section = 'mainboard')=>dispatch({
                type: 'ADD_CARD',
                deckId,
                card,
                section
            })
    }["DeckProvider.useCallback[addCard]"], []);
    const removeCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DeckProvider.useCallback[removeCard]": (deckId, card, section = 'mainboard')=>dispatch({
                type: 'REMOVE_CARD',
                deckId,
                card,
                section
            })
    }["DeckProvider.useCallback[removeCard]"], []);
    const setQuantity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DeckProvider.useCallback[setQuantity]": (deckId, card, section, quantity)=>dispatch({
                type: 'SET_QUANTITY',
                deckId,
                card,
                section,
                quantity
            })
    }["DeckProvider.useCallback[setQuantity]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckContext.Provider, {
        value: {
            decks: state.decks,
            hydrated: state.hydrated,
            deckList: Object.values(state.decks).sort((a, b)=>new Date(b.updatedAt) - new Date(a.updatedAt)),
            createDeck: createDeckAction,
            deleteDeck,
            renameDeck,
            addCard,
            removeCard,
            setQuantity
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/deck-store.js",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
_s(DeckProvider, "ye34QXRPYq+4Dr2yc2eIKRtwCOc=");
_c = DeckProvider;
function useDeckStore() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DeckContext);
    if (!ctx) throw new Error('useDeckStore must be used within DeckProvider');
    return ctx;
}
_s1(useDeckStore, "/dMy7t63NXD4eYACoT93CePwGrg=");
function useDeck(id) {
    _s2();
    const { decks } = useDeckStore();
    return decks[id] ?? null;
}
_s2(useDeck, "ENMty6WQ9Je0Kea57wvuNTGU7Zw=", false, function() {
    return [
        useDeckStore
    ];
});
var _c;
__turbopack_refresh__.register(_c, "DeckProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/utils.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "cn": (()=>cn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/cards/CardSearch.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "CardSearch": (()=>CardSearch)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$debounce$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/use-debounce/dist/index.module.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
const COLORS = [
    'W',
    'U',
    'B',
    'R',
    'G'
];
const COLOR_LABELS = {
    W: 'W',
    U: 'U',
    B: 'B',
    R: 'R',
    G: 'G'
};
const COLOR_STYLES = {
    W: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 text-yellow-800 dark:text-yellow-300',
    U: 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 text-blue-800 dark:text-blue-300',
    B: 'bg-gray-800 border-gray-600 text-gray-100',
    R: 'bg-red-50 dark:bg-red-900/30 border-red-300 text-red-800 dark:text-red-300',
    G: 'bg-green-50 dark:bg-green-900/30 border-green-300 text-green-800 dark:text-green-300'
};
function CardSearch({ onResults, placeholder = 'Search Pauper-legal cards…', className }) {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [colors, setColors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [debouncedQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$debounce$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebounce"])(query, 350);
    const [debouncedColors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$debounce$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebounce"])(colors, 350);
    const toggleColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CardSearch.useCallback[toggleColor]": (c)=>{
            setColors({
                "CardSearch.useCallback[toggleColor]": (prev)=>prev.includes(c) ? prev.filter({
                        "CardSearch.useCallback[toggleColor]": (x)=>x !== c
                    }["CardSearch.useCallback[toggleColor]"]) : [
                        ...prev,
                        c
                    ]
            }["CardSearch.useCallback[toggleColor]"]);
        }
    }["CardSearch.useCallback[toggleColor]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CardSearch.useEffect": ()=>{
            const q = buildQuery(debouncedQuery, debouncedColors);
            setLoading(true);
            onResults([], true);
            fetch(`/api/cards/search?q=${encodeURIComponent(q)}`).then({
                "CardSearch.useEffect": (r)=>r.json()
            }["CardSearch.useEffect"]).then({
                "CardSearch.useEffect": (data)=>{
                    onResults(data.cards ?? [], false);
                    setLoading(false);
                }
            }["CardSearch.useEffect"]).catch({
                "CardSearch.useEffect": ()=>{
                    onResults([], false);
                    setLoading(false);
                }
            }["CardSearch.useEffect"]);
        }
    }["CardSearch.useEffect"], [
        debouncedQuery,
        debouncedColors,
        onResults
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('space-y-2', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                    }, void 0, false, {
                        fileName: "[project]/components/cards/CardSearch.jsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: query,
                        onChange: (e)=>setQuery(e.target.value),
                        placeholder: placeholder,
                        className: "w-full rounded-md border border-input bg-background pl-9 pr-9 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    }, void 0, false, {
                        fileName: "[project]/components/cards/CardSearch.jsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/components/cards/CardSearch.jsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this) : query && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setQuery(''),
                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/components/cards/CardSearch.jsx",
                            lineNumber: 75,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/cards/CardSearch.jsx",
                        lineNumber: 71,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/cards/CardSearch.jsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1.5",
                children: [
                    COLORS.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>toggleColor(c),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-8 h-8 rounded-full border-2 text-xs font-bold transition-all', colors.includes(c) ? COLOR_STYLES[c] : 'border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground'),
                            title: `Filter ${c}`,
                            children: COLOR_LABELS[c]
                        }, c, false, {
                            fileName: "[project]/components/cards/CardSearch.jsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this)),
                    colors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setColors([]),
                        className: "ml-1 text-xs text-muted-foreground hover:text-foreground",
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/components/cards/CardSearch.jsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/cards/CardSearch.jsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/cards/CardSearch.jsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(CardSearch, "Eb17iOMruEFAZZBqAwEbe5gjf7Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$debounce$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebounce"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$debounce$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebounce"]
    ];
});
_c = CardSearch;
function buildQuery(text, colors) {
    const parts = [];
    if (text.trim()) parts.push(text.trim());
    if (colors.length > 0) parts.push(`c:${colors.join('')}`);
    return parts.join(' ');
}
var _c;
__turbopack_refresh__.register(_c, "CardSearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/scryfall.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "autocompleteCardName": (()=>autocompleteCardName),
    "getCardById": (()=>getCardById),
    "getCardImageUrl": (()=>getCardImageUrl),
    "searchCards": (()=>searchCards)
});
const BASE_URL = 'https://api.scryfall.com';
const HEADERS = {
    'User-Agent': 'PauperZone/1.0 contact@pauperzone.app',
    Accept: 'application/json'
};
async function searchCards(query, page = 1) {
    const q = query.trim() ? `format:pauper ${query}` : 'format:pauper';
    const params = new URLSearchParams({
        q,
        order: 'name',
        page: String(page)
    });
    const res = await fetch(`${BASE_URL}/cards/search?${params}`, {
        headers: HEADERS,
        next: {
            revalidate: 300
        }
    });
    if (res.status === 404) return {
        cards: [],
        hasMore: false,
        totalCards: 0
    };
    if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.details ?? `Scryfall error ${res.status}`);
    }
    const data = await res.json();
    return {
        cards: data.data,
        hasMore: data.has_more,
        totalCards: data.total_cards
    };
}
async function autocompleteCardName(partial) {
    const res = await fetch(`${BASE_URL}/cards/autocomplete?q=${encodeURIComponent(partial)}`, {
        headers: HEADERS,
        next: {
            revalidate: 3600
        }
    });
    const data = await res.json();
    return data.data ?? [];
}
async function getCardById(id) {
    const res = await fetch(`${BASE_URL}/cards/${id}`, {
        headers: HEADERS,
        next: {
            revalidate: 3600
        }
    });
    if (!res.ok) throw new Error(`Card not found: ${id}`);
    return res.json();
}
function getCardImageUrl(card, size = 'normal') {
    return card.image_uris?.[size] ?? card.card_faces?.[0]?.image_uris?.[size] ?? '/placeholder-card.png';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/cards/ManaSymbol.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ManaCost": (()=>ManaCost),
    "ManaSymbol": (()=>ManaSymbol)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const MANA_CDN = 'https://svgs.scryfall.io/card-symbols';
function ManaCost({ cost, className = '' }) {
    if (!cost) return null;
    const pips = Array.from(cost.matchAll(/\{([^}]+)\}/g)).map((m)=>m[1]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center gap-0.5 ${className}`,
        children: pips.map((pip, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ManaSymbol, {
                pip: pip
            }, i, false, {
                fileName: "[project]/components/cards/ManaSymbol.jsx",
                lineNumber: 14,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/cards/ManaSymbol.jsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = ManaCost;
function ManaSymbol({ pip, size = 16 }) {
    const src = `${MANA_CDN}/${pip.toLowerCase().replace('/', '')}.svg`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: src,
        alt: `{${pip}}`,
        width: size,
        height: size,
        className: "inline-block",
        onError: (e)=>{
            e.currentTarget.style.display = 'none';
        }
    }, void 0, false, {
        fileName: "[project]/components/cards/ManaSymbol.jsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c1 = ManaSymbol;
var _c, _c1;
__turbopack_refresh__.register(_c, "ManaCost");
__turbopack_refresh__.register(_c1, "ManaSymbol");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/cards/LegalityBadge.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "LegalityBadge": (()=>LegalityBadge)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/utils.js [app-client] (ecmascript)");
;
;
function LegalityBadge({ legality, className }) {
    const config = {
        legal: {
            label: 'Legal',
            classes: 'bg-green-500/15 text-green-600 dark:text-green-400'
        },
        banned: {
            label: 'Banned',
            classes: 'bg-red-500/15 text-red-600 dark:text-red-400'
        },
        not_legal: {
            label: 'Not Legal',
            classes: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400'
        },
        restricted: {
            label: 'Restricted',
            classes: 'bg-orange-500/15 text-orange-600 dark:text-orange-400'
        }
    };
    const { label, classes } = config[legality] ?? config.not_legal;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', classes, className),
        children: label
    }, void 0, false, {
        fileName: "[project]/components/cards/LegalityBadge.jsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = LegalityBadge;
var _c;
__turbopack_refresh__.register(_c, "LegalityBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/cards/CardTile.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "CardTile": (()=>CardTile)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scryfall$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/scryfall.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$ManaSymbol$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/cards/ManaSymbol.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$LegalityBadge$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/cards/LegalityBadge.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
;
;
function CardTile({ card, onAdd, onRemove, quantity = 0, showControls = true, compact = false, className }) {
    _s();
    const [hovered, setHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const imgUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scryfall$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCardImageUrl"])(card, compact ? 'small' : 'normal');
    const legality = card.legalities?.pauper ?? 'not_legal';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group relative rounded-lg overflow-hidden cursor-pointer', className),
        onMouseEnter: ()=>setHovered(true),
        onMouseLeave: ()=>setHovered(false),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative', compact ? 'aspect-[2/3]' : 'aspect-[5/7]'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: imgUrl,
                        alt: card.name,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full h-full object-cover rounded-lg transition-transform duration-200', hovered && 'scale-105'),
                        loading: "lazy"
                    }, void 0, false, {
                        fileName: "[project]/components/cards/CardTile.jsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    legality === 'banned' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-red-900/60 rounded-lg flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white font-bold text-sm rotate-[-20deg] border-2 border-white px-2 py-1",
                            children: "BANNED"
                        }, void 0, false, {
                            fileName: "[project]/components/cards/CardTile.jsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/cards/CardTile.jsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this),
                    showControls && (hovered || quantity > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 rounded-lg bg-black/40 flex flex-col items-center justify-end pb-2 gap-1",
                        children: [
                            quantity > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white font-bold text-lg bg-black/60 rounded-full w-8 h-8 flex items-center justify-center",
                                children: quantity
                            }, void 0, false, {
                                fileName: "[project]/components/cards/CardTile.jsx",
                                lineNumber: 67,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-1",
                                children: [
                                    onRemove && quantity > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onRemove(card);
                                        },
                                        className: "bg-background/90 hover:bg-background rounded-full p-1 transition-colors",
                                        "aria-label": "Remove one",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/cards/CardTile.jsx",
                                            lineNumber: 81,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/cards/CardTile.jsx",
                                        lineNumber: 73,
                                        columnNumber: 17
                                    }, this),
                                    onAdd && legality === 'legal' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onAdd(card);
                                        },
                                        className: "bg-primary text-primary-foreground hover:bg-primary/80 rounded-full p-1 transition-colors",
                                        "aria-label": "Add one",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/cards/CardTile.jsx",
                                            lineNumber: 93,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/cards/CardTile.jsx",
                                        lineNumber: 85,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/cards/CardTile.jsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/cards/CardTile.jsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/cards/CardTile.jsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 px-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-medium leading-tight line-clamp-1",
                                children: card.name
                            }, void 0, false, {
                                fileName: "[project]/components/cards/CardTile.jsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$ManaSymbol$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ManaCost"], {
                                cost: card.mana_cost,
                                className: "shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/components/cards/CardTile.jsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/cards/CardTile.jsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 mt-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$LegalityBadge$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LegalityBadge"], {
                                legality: legality
                            }, void 0, false, {
                                fileName: "[project]/components/cards/CardTile.jsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            card.prices?.tix && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                    card.prices.tix,
                                    " tix"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/cards/CardTile.jsx",
                                lineNumber: 111,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/cards/CardTile.jsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/cards/CardTile.jsx",
                lineNumber: 103,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/cards/CardTile.jsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(CardTile, "V8YbV+gTZxGliGj1g0fftBlvsq4=");
_c = CardTile;
var _c;
__turbopack_refresh__.register(_c, "CardTile");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/cards/CardGrid.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "CardGrid": (()=>CardGrid)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$CardTile$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/cards/CardTile.jsx [app-client] (ecmascript)");
'use client';
;
;
function CardGrid({ cards, onAdd, onRemove, getQuantity, compact = false, cols }) {
    if (!cards.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-40 text-muted-foreground text-sm",
            children: "No cards found"
        }, void 0, false, {
            fileName: "[project]/components/cards/CardGrid.jsx",
            lineNumber: 20,
            columnNumber: 7
        }, this);
    }
    const gridClass = cols ? `grid gap-3` : compact ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3';
    const style = cols ? {
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
    } : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: gridClass,
        style: style,
        children: cards.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$CardTile$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTile"], {
                card: card,
                onAdd: onAdd,
                onRemove: onRemove,
                quantity: getQuantity?.(card) ?? 0,
                compact: compact
            }, card.id, false, {
                fileName: "[project]/components/cards/CardGrid.jsx",
                lineNumber: 37,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/cards/CardGrid.jsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c = CardGrid;
var _c;
__turbopack_refresh__.register(_c, "CardGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/deck/DeckList.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DeckList": (()=>DeckList)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$ManaSymbol$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/cards/ManaSymbol.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deck$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/deck-store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
const SECTION_ORDER = [
    'mainboard',
    'sideboard'
];
function categorize(entries) {
    const groups = {
        Creatures: [],
        Spells: [],
        Lands: [],
        Other: []
    };
    for (const entry of entries){
        const t = entry.card.type_line ?? '';
        if (t.includes('Creature')) groups.Creatures.push(entry);
        else if (t.includes('Land')) groups.Lands.push(entry);
        else if (t.includes('Instant') || t.includes('Sorcery') || t.includes('Enchantment') || t.includes('Artifact') || t.includes('Planeswalker')) groups.Spells.push(entry);
        else groups.Other.push(entry);
    }
    // Sort each group by name
    for (const g of Object.values(groups)){
        g.sort((a, b)=>{
            const cmcDiff = (a.card.cmc ?? 0) - (b.card.cmc ?? 0);
            return cmcDiff !== 0 ? cmcDiff : a.card.name.localeCompare(b.card.name);
        });
    }
    return groups;
}
function DeckList({ deck, className }) {
    _s();
    const { addCard, removeCard } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deck$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeckStore"])();
    if (!deck) return null;
    const mainEntries = deck.entries.filter((e)=>e.section === 'mainboard');
    const sideEntries = deck.entries.filter((e)=>e.section === 'sideboard');
    const mainCount = mainEntries.reduce((s, e)=>s + e.quantity, 0);
    const sideCount = sideEntries.reduce((s, e)=>s + e.quantity, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('space-y-4 text-sm', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckSection, {
                label: "Mainboard",
                count: mainCount,
                entries: mainEntries,
                deckId: deck.id,
                section: "mainboard",
                addCard: addCard,
                removeCard: removeCard
            }, void 0, false, {
                fileName: "[project]/components/deck/DeckList.jsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            (sideCount > 0 || true) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckSection, {
                label: "Sideboard",
                count: sideCount,
                entries: sideEntries,
                deckId: deck.id,
                section: "sideboard",
                addCard: addCard,
                removeCard: removeCard
            }, void 0, false, {
                fileName: "[project]/components/deck/DeckList.jsx",
                lineNumber: 56,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/deck/DeckList.jsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_s(DeckList, "m5is3mnE4bjZa9ZHsxXkyn1jPlI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deck$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeckStore"]
    ];
});
_c = DeckList;
function DeckSection({ label, count, entries, deckId, section, addCard, removeCard }) {
    const groups = categorize(entries);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2",
                children: [
                    label,
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-foreground",
                        children: [
                            "(",
                            count,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/deck/DeckList.jsx",
                        lineNumber: 76,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/deck/DeckList.jsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            Object.entries(groups).filter(([, g])=>g.length > 0).map(([groupName, groupEntries])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-muted-foreground mb-1",
                            children: [
                                groupName,
                                " (",
                                groupEntries.reduce((s, e)=>s + e.quantity, 0),
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/deck/DeckList.jsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this),
                        groupEntries.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckEntry, {
                                entry: entry,
                                deckId: deckId,
                                section: section,
                                addCard: addCard,
                                removeCard: removeCard
                            }, entry.card.id, false, {
                                fileName: "[project]/components/deck/DeckList.jsx",
                                lineNumber: 87,
                                columnNumber: 15
                            }, this))
                    ]
                }, groupName, true, {
                    fileName: "[project]/components/deck/DeckList.jsx",
                    lineNumber: 81,
                    columnNumber: 11
                }, this)),
            entries.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-muted-foreground text-xs italic",
                children: "No cards"
            }, void 0, false, {
                fileName: "[project]/components/deck/DeckList.jsx",
                lineNumber: 99,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/deck/DeckList.jsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_c1 = DeckSection;
function DeckEntry({ entry, deckId, section, addCard, removeCard }) {
    const { card, quantity } = entry;
    const banned = card.legalities?.pauper === 'banned';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group flex items-center gap-2 py-0.5 px-1 rounded hover:bg-muted/50 transition-colors', banned && 'opacity-60'),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-0.5 shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>removeCard(deckId, card, section),
                        className: "opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive",
                        "aria-label": "Remove one",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                            className: "w-3 h-3"
                        }, void 0, false, {
                            fileName: "[project]/components/deck/DeckList.jsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckList.jsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-5 text-center font-medium tabular-nums",
                        children: quantity
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckList.jsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>addCard(deckId, card, section),
                        className: "opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-primary",
                        "aria-label": "Add one",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "w-3 h-3"
                        }, void 0, false, {
                            fileName: "[project]/components/deck/DeckList.jsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckList.jsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/deck/DeckList.jsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex-1 truncate', banned && 'line-through text-destructive'),
                children: card.name
            }, void 0, false, {
                fileName: "[project]/components/deck/DeckList.jsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$ManaSymbol$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ManaCost"], {
                cost: card.mana_cost
            }, void 0, false, {
                fileName: "[project]/components/deck/DeckList.jsx",
                lineNumber: 141,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/deck/DeckList.jsx",
        lineNumber: 110,
        columnNumber: 5
    }, this);
}
_c2 = DeckEntry;
var _c, _c1, _c2;
__turbopack_refresh__.register(_c, "DeckList");
__turbopack_refresh__.register(_c1, "DeckSection");
__turbopack_refresh__.register(_c2, "DeckEntry");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/pauper.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Validate a deck for Pauper format legality.
 * @param {{ entries: Array<{ card: ScryfallCard, quantity: number, section: 'mainboard'|'sideboard' }> }} deck
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */ __turbopack_esm__({
    "COLOR_CLASSES": (()=>COLOR_CLASSES),
    "COLOR_NAMES": (()=>COLOR_NAMES),
    "detectArchetype": (()=>detectArchetype),
    "getDeckColors": (()=>getDeckColors),
    "getManaCurve": (()=>getManaCurve),
    "validateDeck": (()=>validateDeck)
});
function validateDeck(deck) {
    const errors = [];
    const warnings = [];
    const mainboard = deck.entries.filter((e)=>e.section === 'mainboard');
    const sideboard = deck.entries.filter((e)=>e.section === 'sideboard');
    const mainCount = mainboard.reduce((sum, e)=>sum + e.quantity, 0);
    const sideCount = sideboard.reduce((sum, e)=>sum + e.quantity, 0);
    if (mainCount < 60) {
        errors.push(`Main deck needs ${60 - mainCount} more card${60 - mainCount === 1 ? '' : 's'} (${mainCount}/60).`);
    }
    if (sideCount !== 0 && sideCount !== 15) {
        errors.push(`Sideboard must be 0 or 15 cards (currently ${sideCount}).`);
    }
    // Track copy counts across main + side combined
    const copyCounts = {};
    for (const entry of deck.entries){
        const key = entry.card.name;
        copyCounts[key] = (copyCounts[key] ?? 0) + entry.quantity;
    }
    for (const entry of deck.entries){
        const { card } = entry;
        if (card.legalities?.pauper === 'banned') {
            errors.push(`${card.name} is banned in Pauper.`);
        } else if (card.legalities?.pauper !== 'legal') {
            errors.push(`${card.name} is not legal in Pauper.`);
        }
        const isBasicLand = card.type_line?.includes('Basic Land');
        if (!isBasicLand && copyCounts[card.name] > 4) {
            // Only report once per card name
            if (entry === deck.entries.find((e)=>e.card.name === card.name)) {
                errors.push(`Too many copies of ${card.name} (${copyCounts[card.name]}/4).`);
            }
        }
    }
    if (mainCount > 60) {
        warnings.push(`Deck has ${mainCount} cards. Most Pauper decks run exactly 60.`);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
function getManaCurve(deck) {
    const curve = {};
    for (const { card, quantity, section } of deck.entries){
        if (section !== 'mainboard' || card.type_line?.includes('Land')) continue;
        const cmc = Math.min(Math.floor(card.cmc ?? 0), 7);
        curve[cmc] = (curve[cmc] ?? 0) + quantity;
    }
    return curve;
}
function getDeckColors(deck) {
    const colors = new Set();
    for (const { card } of deck.entries){
        for (const c of card.color_identity ?? []){
            colors.add(c);
        }
    }
    return Array.from(colors);
}
function detectArchetype(deck) {
    const names = new Set(deck.entries.map((e)=>e.card.name));
    if (names.has('Myr Enforcer') || names.has('Frogmite') || names.has('Thoughtcast')) return 'Affinity';
    if (names.has('Spellstutter Sprite') || names.has('Ninja of the Deep Hours')) return 'Faeries';
    if (names.has("Urza's Tower") || names.has("Urza's Mine")) return 'Tron';
    if (names.has('Axebane Guardian') || names.has('Overgrown Battlement')) return 'Walls';
    if (names.has('Lightning Bolt') || names.has('Chain Lightning') || names.has('Rift Bolt')) return 'Burn';
    if (names.has('Quirion Ranger') || names.has('Rancor')) return 'Stompy';
    if (names.has('Akroan Skyguard') || names.has('Ethereal Armor')) return 'Heroic';
    return 'Other';
}
const COLOR_NAMES = {
    W: 'White',
    U: 'Blue',
    B: 'Black',
    R: 'Red',
    G: 'Green'
};
const COLOR_CLASSES = {
    W: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    U: 'bg-blue-100 text-blue-900 border-blue-200',
    B: 'bg-gray-800 text-gray-100 border-gray-600',
    R: 'bg-red-100 text-red-900 border-red-200',
    G: 'bg-green-100 text-green-900 border-green-200'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/deck/DeckStats.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DeckStats": (()=>DeckStats)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pauper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/pauper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
'use client';
;
;
;
;
const COLOR_PIPS = {
    W: {
        bg: 'bg-yellow-200 dark:bg-yellow-800',
        label: 'W',
        title: 'White'
    },
    U: {
        bg: 'bg-blue-400 dark:bg-blue-700',
        label: 'U',
        title: 'Blue'
    },
    B: {
        bg: 'bg-gray-700 dark:bg-gray-600',
        label: 'B',
        title: 'Black'
    },
    R: {
        bg: 'bg-red-400 dark:bg-red-700',
        label: 'R',
        title: 'Red'
    },
    G: {
        bg: 'bg-green-400 dark:bg-green-700',
        label: 'G',
        title: 'Green'
    }
};
const CMC_LABELS = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7+'
];
function DeckStats({ deck, className }) {
    if (!deck) return null;
    const { valid, errors, warnings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pauper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDeck"])(deck);
    const curve = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pauper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getManaCurve"])(deck);
    const colors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pauper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeckColors"])(deck);
    const archetype = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pauper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["detectArchetype"])(deck);
    const mainCount = deck.entries.filter((e)=>e.section === 'mainboard').reduce((s, e)=>s + e.quantity, 0);
    const maxCurveVal = Math.max(1, ...Object.values(curve));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('space-y-5 text-sm', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2",
                        children: "Validation"
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium mb-2', valid ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'),
                        children: [
                            valid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                className: "w-4 h-4 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/components/deck/DeckStats.jsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                className: "w-4 h-4 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/components/deck/DeckStats.jsx",
                                lineNumber: 52,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: valid ? 'Legal Pauper deck' : `${errors.length} issue${errors.length > 1 ? 's' : ''}`
                            }, void 0, false, {
                                fileName: "[project]/components/deck/DeckStats.jsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-auto text-xs font-normal",
                                children: [
                                    mainCount,
                                    "/60"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/deck/DeckStats.jsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    errors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "space-y-1",
                        children: errors.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex gap-1.5 text-xs text-red-600 dark:text-red-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                        className: "w-3.5 h-3.5 shrink-0 mt-0.5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/deck/DeckStats.jsx",
                                        lineNumber: 62,
                                        columnNumber: 17
                                    }, this),
                                    e
                                ]
                            }, i, true, {
                                fileName: "[project]/components/deck/DeckStats.jsx",
                                lineNumber: 61,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this),
                    warnings.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-1.5 text-xs text-yellow-600 dark:text-yellow-400 mt-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                    className: "w-3.5 h-3.5 shrink-0 mt-0.5"
                                }, void 0, false, {
                                    fileName: "[project]/components/deck/DeckStats.jsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this),
                                w
                            ]
                        }, i, true, {
                            fileName: "[project]/components/deck/DeckStats.jsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/deck/DeckStats.jsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2",
                        children: "Colors"
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    colors.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-xs italic",
                        children: "Colorless"
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 items-center",
                        children: [
                            [
                                'W',
                                'U',
                                'B',
                                'R',
                                'G'
                            ].filter((c)=>colors.includes(c)).map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', COLOR_PIPS[c].bg, c === 'B' ? 'text-white' : 'text-gray-900'),
                                    title: COLOR_PIPS[c].title,
                                    children: COLOR_PIPS[c].label
                                }, c, false, {
                                    fileName: "[project]/components/deck/DeckStats.jsx",
                                    lineNumber: 87,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-muted-foreground ml-1",
                                children: archetype
                            }, void 0, false, {
                                fileName: "[project]/components/deck/DeckStats.jsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/deck/DeckStats.jsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2",
                        children: "Mana Curve"
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    Object.keys(curve).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-xs italic",
                        children: "Add non-land cards"
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-end gap-1 h-20",
                        children: CMC_LABELS.map((label, cmc)=>{
                            const count = curve[cmc] ?? 0;
                            const heightPct = count === 0 ? 0 : Math.max(8, count / maxCurveVal * 100);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 flex flex-col items-center gap-0.5",
                                children: [
                                    count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-muted-foreground tabular-nums",
                                        children: count
                                    }, void 0, false, {
                                        fileName: "[project]/components/deck/DeckStats.jsx",
                                        lineNumber: 119,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full rounded-t transition-all duration-300', count === 0 ? 'bg-muted' : 'bg-primary'),
                                        style: {
                                            height: `${heightPct}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/deck/DeckStats.jsx",
                                        lineNumber: 121,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-muted-foreground",
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/components/deck/DeckStats.jsx",
                                        lineNumber: 128,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, cmc, true, {
                                fileName: "[project]/components/deck/DeckStats.jsx",
                                lineNumber: 117,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/deck/DeckStats.jsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2",
                        children: "Est. MTGO Cost"
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MtgoPrice, {
                        deck: deck
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckStats.jsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/deck/DeckStats.jsx",
                lineNumber: 137,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/deck/DeckStats.jsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c = DeckStats;
function MtgoPrice({ deck }) {
    let total = 0;
    let hasData = false;
    for (const { card, quantity } of deck.entries){
        const tix = parseFloat(card.prices?.tix ?? '');
        if (!isNaN(tix)) {
            total += tix * quantity;
            hasData = true;
        }
    }
    if (!hasData) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-muted-foreground text-xs italic",
        children: "No price data"
    }, void 0, false, {
        fileName: "[project]/components/deck/DeckStats.jsx",
        lineNumber: 159,
        columnNumber: 24
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-lg font-semibold tabular-nums",
        children: [
            total.toFixed(2),
            ' ',
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs font-normal text-muted-foreground",
                children: "tix"
            }, void 0, false, {
                fileName: "[project]/components/deck/DeckStats.jsx",
                lineNumber: 164,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/deck/DeckStats.jsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
_c1 = MtgoPrice;
var _c, _c1;
__turbopack_refresh__.register(_c, "DeckStats");
__turbopack_refresh__.register(_c1, "MtgoPrice");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/deck/DeckBuilder.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DeckBuilder": (()=>DeckBuilder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$CardSearch$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/cards/CardSearch.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$CardGrid$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/cards/CardGrid.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$deck$2f$DeckList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/deck/DeckList.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$deck$2f$DeckStats$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/deck/DeckStats.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deck$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/deck-store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
;
;
;
;
function DeckBuilder({ deckId }) {
    _s();
    const deck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deck$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeck"])(deckId);
    const { addCard, removeCard, renameDeck } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deck$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeckStore"])();
    const [searchResults, setSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchLoading, setSearchLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingName, setEditingName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [nameInput, setNameInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('mainboard');
    const handleResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DeckBuilder.useCallback[handleResults]": (cards, loading)=>{
            setSearchResults(cards);
            setSearchLoading(loading);
        }
    }["DeckBuilder.useCallback[handleResults]"], []);
    const handleAdd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DeckBuilder.useCallback[handleAdd]": (card)=>addCard(deckId, card, activeSection)
    }["DeckBuilder.useCallback[handleAdd]"], [
        deckId,
        addCard,
        activeSection
    ]);
    const handleRemove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DeckBuilder.useCallback[handleRemove]": (card)=>removeCard(deckId, card, activeSection)
    }["DeckBuilder.useCallback[handleRemove]"], [
        deckId,
        removeCard,
        activeSection
    ]);
    const getQuantity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DeckBuilder.useCallback[getQuantity]": (card)=>deck?.entries.filter({
                "DeckBuilder.useCallback[getQuantity]": (e)=>e.card.id === card.id && e.section === activeSection
            }["DeckBuilder.useCallback[getQuantity]"]).reduce({
                "DeckBuilder.useCallback[getQuantity]": (s, e)=>s + e.quantity
            }["DeckBuilder.useCallback[getQuantity]"], 0) ?? 0
    }["DeckBuilder.useCallback[getQuantity]"], [
        deck,
        activeSection
    ]);
    const startRename = ()=>{
        setNameInput(deck.name);
        setEditingName(true);
    };
    const confirmRename = ()=>{
        if (nameInput.trim()) renameDeck(deckId, nameInput.trim());
        setEditingName(false);
    };
    const cancelRename = ()=>setEditingName(false);
    if (!deck) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-64 text-muted-foreground",
            children: "Deck not found."
        }, void 0, false, {
            fileName: "[project]/components/deck/DeckBuilder.jsx",
            lineNumber: 59,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-0 gap-0 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-72 shrink-0 flex flex-col border-r border-border overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 border-b border-border space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex rounded-md border border-border overflow-hidden text-xs",
                                children: [
                                    'mainboard',
                                    'sideboard'
                                ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveSection(s),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex-1 py-1.5 font-medium capitalize transition-colors', activeSection === s ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'),
                                        children: s
                                    }, s, false, {
                                        fileName: "[project]/components/deck/DeckBuilder.jsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/deck/DeckBuilder.jsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$CardSearch$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardSearch"], {
                                onResults: handleResults
                            }, void 0, false, {
                                fileName: "[project]/components/deck/DeckBuilder.jsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/deck/DeckBuilder.jsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-3",
                        children: searchLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center h-32 text-muted-foreground text-sm",
                            children: "Searching…"
                        }, void 0, false, {
                            fileName: "[project]/components/deck/DeckBuilder.jsx",
                            lineNumber: 93,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$CardGrid$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardGrid"], {
                            cards: searchResults,
                            onAdd: handleAdd,
                            onRemove: handleRemove,
                            getQuantity: getQuantity,
                            compact: true,
                            cols: 2
                        }, void 0, false, {
                            fileName: "[project]/components/deck/DeckBuilder.jsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckBuilder.jsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/deck/DeckBuilder.jsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-w-0 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 p-3 border-b border-border h-14",
                        children: editingName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    autoFocus: true,
                                    value: nameInput,
                                    onChange: (e)=>setNameInput(e.target.value),
                                    onKeyDown: (e)=>{
                                        if (e.key === 'Enter') confirmRename();
                                        if (e.key === 'Escape') cancelRename();
                                    },
                                    className: "flex-1 rounded border border-input bg-background px-2 py-1 text-sm outline-none ring-ring focus:ring-2"
                                }, void 0, false, {
                                    fileName: "[project]/components/deck/DeckBuilder.jsx",
                                    lineNumber: 115,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: confirmRename,
                                    className: "p-1 hover:text-primary",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/deck/DeckBuilder.jsx",
                                        lineNumber: 126,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/deck/DeckBuilder.jsx",
                                    lineNumber: 125,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: cancelRename,
                                    className: "p-1 hover:text-destructive",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/deck/DeckBuilder.jsx",
                                        lineNumber: 129,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/deck/DeckBuilder.jsx",
                                    lineNumber: 128,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-semibold truncate flex-1",
                                    children: deck.name
                                }, void 0, false, {
                                    fileName: "[project]/components/deck/DeckBuilder.jsx",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: startRename,
                                    className: "p-1 text-muted-foreground hover:text-foreground",
                                    "aria-label": "Rename deck",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/deck/DeckBuilder.jsx",
                                        lineNumber: 140,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/deck/DeckBuilder.jsx",
                                    lineNumber: 135,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckBuilder.jsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$deck$2f$DeckList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeckList"], {
                            deck: deck
                        }, void 0, false, {
                            fileName: "[project]/components/deck/DeckBuilder.jsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/deck/DeckBuilder.jsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/deck/DeckBuilder.jsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-60 shrink-0 border-l border-border overflow-y-auto p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$deck$2f$DeckStats$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeckStats"], {
                    deck: deck
                }, void 0, false, {
                    fileName: "[project]/components/deck/DeckBuilder.jsx",
                    lineNumber: 153,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/deck/DeckBuilder.jsx",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/deck/DeckBuilder.jsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(DeckBuilder, "4KOIY9ZT3Q1O8dPTTp+OpVa5NQg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deck$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeck"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deck$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeckStore"]
    ];
});
_c = DeckBuilder;
var _c;
__turbopack_refresh__.register(_c, "DeckBuilder");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/AppHeader.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AppHeader": (()=>AppHeader)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
function AppHeader({ children }) {
    _s();
    const { resolvedTheme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "h-14 border-b border-border flex items-center gap-4 px-4 shrink-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/",
                className: "flex items-center gap-2 font-semibold text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                        className: "w-5 h-5 text-primary"
                    }, void 0, false, {
                        fileName: "[project]/components/AppHeader.jsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Pauper Zone"
                    }, void 0, false, {
                        fileName: "[project]/components/AppHeader.jsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppHeader.jsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/AppHeader.jsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
                className: "p-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors",
                "aria-label": "Toggle theme",
                children: resolvedTheme === 'dark' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/components/AppHeader.jsx",
                    lineNumber: 24,
                    columnNumber: 37
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/components/AppHeader.jsx",
                    lineNumber: 24,
                    columnNumber: 67
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AppHeader.jsx",
                lineNumber: 19,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AppHeader.jsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_s(AppHeader, "ejWDJnui7w93Zr0cEZ1cyBPw8dI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = AppHeader;
var _c;
__turbopack_refresh__.register(_c, "AppHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/deck/[id]/deck-page-client.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "DeckPageClient": (()=>DeckPageClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deck$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/deck-store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$deck$2f$DeckBuilder$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/deck/DeckBuilder.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppHeader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/AppHeader.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
'use client';
;
;
;
;
;
;
function DeckPageClient({ deckId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$deck$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeckProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col h-screen overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppHeader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppHeader"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/app/deck/[id]/deck-page-client.jsx",
                                lineNumber: 18,
                                columnNumber: 13
                            }, this),
                            "All Decks"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/deck/[id]/deck-page-client.jsx",
                        lineNumber: 14,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/deck/[id]/deck-page-client.jsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 min-h-0 overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$deck$2f$DeckBuilder$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeckBuilder"], {
                        deckId: deckId
                    }, void 0, false, {
                        fileName: "[project]/app/deck/[id]/deck-page-client.jsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/deck/[id]/deck-page-client.jsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/deck/[id]/deck-page-client.jsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/deck/[id]/deck-page-client.jsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = DeckPageClient;
var _c;
__turbopack_refresh__.register(_c, "DeckPageClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/deck/[id]/page.js [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=_4c3aa5._.js.map