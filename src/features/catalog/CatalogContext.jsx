import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { productService } from '../../services/productService'

const CatalogContext = createContext(null)

const initialState = {
  products: [],
  isLoading: true,
  error: null,
  selectedCategory: null,
  searchQuery: '',
  filters: {
    inStockOnly: false,
    minPrice: '',
    maxPrice: '',
    brand: '',
  },
  sort: 'popular',
}

function reducer(state, action) {
  switch (action.type) {
    case 'load-start':
      return { ...state, isLoading: true, error: null }
    case 'load-success':
      return { ...state, products: action.products, isLoading: false, error: null }
    case 'load-error':
      return { ...state, products: [], isLoading: false, error: action.error }
    case 'set-category':
      return { ...state, selectedCategory: action.category }
    case 'set-search':
      return { ...state, searchQuery: action.query }
    case 'set-filter':
      return { ...state, filters: { ...state.filters, [action.name]: action.value } }
    case 'set-sort':
      return { ...state, sort: action.sort }
    default:
      return state
  }
}

export function CatalogProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const loadProducts = useCallback(async (category) => {
    dispatch({ type: 'load-start' })
    try {
      const products = category ? await productService.getByCategory(category) : await productService.getAll()
      dispatch({ type: 'load-success', products })
    } catch (error) {
      dispatch({ type: 'load-error', error: error.message || 'Не удалось загрузить каталог' })
    }
  }, [])

  useEffect(() => {
    loadProducts(state.selectedCategory)
  }, [loadProducts, state.selectedCategory])

  const actions = useMemo(() => ({
    setCategory: (category) => dispatch({ type: 'set-category', category }),
    setSearchQuery: (query) => dispatch({ type: 'set-search', query }),
    setFilter: (name, value) => dispatch({ type: 'set-filter', name, value }),
    setSort: (sort) => dispatch({ type: 'set-sort', sort }),
    reload: () => loadProducts(state.selectedCategory),
  }), [loadProducts, state.selectedCategory])

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions])
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export const useCatalog = () => useContext(CatalogContext)
