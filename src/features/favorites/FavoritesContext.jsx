import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const FavoritesContext = createContext(null)
const STORAGE_KEY = 'johnny-store-favorites'

function readFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [items, setItems] = useState(readFavorites)
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), [items])
  const value = useMemo(() => ({
    favoriteItems: items,
    isFavorite: (id) => items.some((item) => item.id === id),
    toggleFavorite: (product) => setItems((current) => current.some((item) => item.id === product.id) ? current.filter((item) => item.id !== product.id) : [...current, product]),
  }), [items])
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export const useFavorites = () => useContext(FavoritesContext)
