import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CompareContext = createContext(null)
const STORAGE_KEY = 'johnny-store-compare'

function readCompare() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value) ? value.slice(0, 4) : []
  } catch {
    return []
  }
}

export function CompareProvider({ children }) {
  const [items, setItems] = useState(readCompare)
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), [items])
  const value = useMemo(() => ({
    compareItems: items,
    isCompared: (id) => items.some((item) => item.id === id),
    toggleCompare: (product) => setItems((current) => current.some((item) => item.id === product.id) ? current.filter((item) => item.id !== product.id) : current.length < 4 ? [...current, product] : current),
    clearCompare: () => setItems([]),
  }), [items])
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

export const useCompare = () => useContext(CompareContext)
