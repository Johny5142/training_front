import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { ProductCard } from '../components/product/ProductCard'
import { useFavorites } from '../features/favorites/FavoritesContext'
import { EmptyState } from '../components/ui/FeedbackStates'

export function FavoritesPage() {
  const { favoriteItems } = useFavorites()
  return <section className="section"><p className="eyebrow">JohnnyStore</p><h1>Избранное</h1>{favoriteItems.length ? <div className="product-grid">{favoriteItems.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <EmptyState title="В избранном пока пусто" message="Сохраняйте товары, чтобы быстро вернуться к ним позже." action={<Link className="button button-dark" to="/catalog"><Heart size={17} /> Открыть каталог</Link>} />}</section>
}
