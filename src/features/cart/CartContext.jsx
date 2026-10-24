import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'volt-cart'

function getInitialCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
    if (!Array.isArray(stored)) return []
    return stored.filter((item) => item && item.id && Number(item.price) >= 0 && Number(item.quantity) > 0).map((item) => ({
      ...item,
      quantity: Math.max(1, Math.floor(Number(item.quantity))),
    }))
  } catch {
    return []
  }
}

const initialState = getInitialCart()

function reducer(state, action) {
  if (action.type === 'add') {
    const exists = state.find((item) => item.id === action.product.id)
    return exists ? state.map((item) => item.id === exists.id ? { ...item, quantity: item.quantity + 1 } : item) : [...state, { ...action.product, quantity: 1 }]
  }
  if (action.type === 'remove') return state.filter((item) => item.id !== action.id)
  if (action.type === 'quantity') return state.map((item) => item.id === action.id ? { ...item, quantity: Math.max(1, action.quantity) } : item)
  if (action.type === 'clear') return []
  return state
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, initialState)
  const [feedback, setFeedback] = useState('')
  useEffect(() => localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)), [items])
  const addToCart = (product) => {
    dispatch({ type: 'add', product })
    setFeedback(`${product.title} добавлен в корзину`)
    window.setTimeout(() => setFeedback(''), 1800)
  }
  const value = useMemo(() => ({
    items,
    addToCart,
    feedback,
    removeFromCart: (id) => dispatch({ type: 'remove', id }),
    setQuantity: (id, quantity) => dispatch({ type: 'quantity', id, quantity }),
    clearCart: () => dispatch({ type: 'clear' }),
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }), [items, feedback])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
