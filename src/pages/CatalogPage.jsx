import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { categories, productService } from '../services/productService'
import { ProductCard } from '../components/product/ProductCard'
import { useCatalog } from '../features/catalog/CatalogContext'
import { ScaleLetter } from '../components/ui/ScaleLetter'
import { EmptyState, ErrorMessage } from '../components/ui/FeedbackStates'
import { ProductGridSkeleton } from '../components/ui/Loader'

export function CatalogPage() {
  const { category } = useParams()
  const { products, isLoading, error, searchQuery, filters, sort, setCategory, setSearchQuery, setFilter, setSort, reload } = useCatalog()
  const categoryName = categories.find((item) => item.slug === category)?.label

  useEffect(() => { setCategory(category || null) }, [category, setCategory])

  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))].sort(), [products])
  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('ru-RU')
    const minPrice = filters.minPrice === '' ? null : Number(filters.minPrice)
    const maxPrice = filters.maxPrice === '' ? null : Number(filters.maxPrice)
    return products.filter((product) => {
      const text = `${product.title} ${product.brand} ${product.category}`.toLocaleLowerCase('ru-RU')
      return (!query || text.includes(query)) && (!filters.inStockOnly || product.inStock) && (!filters.brand || product.brand === filters.brand) && (minPrice === null || product.price >= minPrice) && (maxPrice === null || product.price <= maxPrice)
    }).sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'name') return a.title.localeCompare(b.title, 'ru')
      return b.rating - a.rating
    })
  }, [filters, products, searchQuery, sort])

  return <section className="catalog section"><div className="catalog-heading"><p className="eyebrow">JohnnyStore / каталог</p><h1><ScaleLetter>{categoryName || 'Вся техника'}</ScaleLetter></h1><p>Найдите технику под свои задачи.</p></div><div className="catalog-toolbar"><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Поиск по каталогу" aria-label="Поиск по каталогу" /><input type="number" min="0" value={filters.minPrice} onChange={(event) => setFilter('minPrice', event.target.value)} placeholder="Цена от" aria-label="Минимальная цена" /><input type="number" min="0" value={filters.maxPrice} onChange={(event) => setFilter('maxPrice', event.target.value)} placeholder="Цена до" aria-label="Максимальная цена" /><select value={filters.brand} onChange={(event) => setFilter('brand', event.target.value)} aria-label="Производитель"><option value="">Все производители</option>{brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select><button className={`filter-button ${filters.inStockOnly ? 'active' : ''}`} onClick={() => setFilter('inStockOnly', !filters.inStockOnly)}><SlidersHorizontal size={17} /> Только в наличии</button><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Сортировка"><option value="popular">По популярности</option><option value="price-asc">Цена: по возрастанию</option><option value="price-desc">Цена: по убыванию</option><option value="name">По названию</option></select></div><div className="catalog-content"><aside><p className="eyebrow">Категории</p><Link className={!category ? 'active' : ''} to="/catalog">Все товары</Link>{categories.map((item) => <Link className={category === item.slug ? 'active' : ''} key={item.slug} to={`/catalog/${item.slug}`}>{item.label}</Link>)}</aside><div className="catalog-results">{isLoading && <ProductGridSkeleton />}{error && <ErrorMessage message={error} onRetry={reload} />}{!isLoading && !error && !filtered.length && <EmptyState title="Ничего не найдено" message="Попробуйте изменить поисковый запрос или параметры фильтрации." />}{!isLoading && !error && filtered.length > 0 && <><p className="result-count">{filtered.length} товаров</p><div className="product-grid">{filtered.map((product) => <ProductCard product={product} key={product.id} />)}</div></>}</div></div></section>
}
