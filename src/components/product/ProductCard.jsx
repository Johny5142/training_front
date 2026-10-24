import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Star, Heart, GitCompareArrows } from 'lucide-react'
import { categories, formatPrice } from '../../services/productService'
import { useCart } from '../../features/cart/CartContext'
import { useFavorites } from '../../features/favorites/FavoritesContext'
import { useCompare } from '../../features/compare/CompareContext'

export function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isCompared, toggleCompare } = useCompare()
  const [added, setAdded] = useState(false)
  const categoryLabel = categories.find((item) => item.slug === product.category)?.label || product.category

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return <article className="product-card"><div className="product-card-tools"><button className={`card-tool ${isFavorite(product.id) ? 'active' : ''}`} onClick={() => toggleFavorite(product)} aria-label={isFavorite(product.id) ? `Удалить ${product.title} из избранного` : `Добавить ${product.title} в избранное`}><Heart size={16} fill={isFavorite(product.id) ? 'currentColor' : 'none'} /></button><button className={`card-tool ${isCompared(product.id) ? 'active' : ''}`} onClick={() => toggleCompare(product)} aria-label={isCompared(product.id) ? `Убрать ${product.title} из сравнения` : `Добавить ${product.title} к сравнению`}><GitCompareArrows size={16} /></button></div><Link to={`/product/${product.id}`} className={`product-art ${product.color}`}><img src={product.image} alt={product.title} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/cards/placeholder-product.svg' }} /></Link><div className="product-meta"><div className="product-tags"><span>{categoryLabel}</span><span>{product.brand}</span></div><Link to={`/product/${product.id}`}><h3>{product.title}</h3></Link><div className="product-rating"><Star size={14} fill="currentColor" /> <strong>{product.rating}</strong><span>({product.reviews})</span></div><div className="product-bottom"><div><strong>{formatPrice(product.price)}</strong>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div><button className={`add-button ${added ? 'added' : ''}`} onClick={handleAdd} aria-label={`Добавить ${product.title} в корзину`}>{added ? '✓' : <ShoppingBag size={17} />}</button></div></div></article>
}
