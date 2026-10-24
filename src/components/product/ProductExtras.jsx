import { GitCompareArrows, Heart, Star } from 'lucide-react'
import { useFavorites } from '../../features/favorites/FavoritesContext'
import { useCompare } from '../../features/compare/CompareContext'

const reviewTexts = [
  'Отличное устройство, всё работает быстро и предсказуемо.',
  'Понравились качество сборки и удобство ежедневного использования.',
  'Хорошая покупка, характеристики соответствуют ожиданиям.',
]

export function ProductExtras({ product }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isCompared, toggleCompare } = useCompare()
  return <><div className="product-actions"><button className={`button ${isFavorite(product.id) ? 'button-dark active-action' : 'button-outline'}`} onClick={() => toggleFavorite(product)}><Heart size={17} fill={isFavorite(product.id) ? 'currentColor' : 'none'} /> {isFavorite(product.id) ? 'В избранном' : 'В избранное'}</button><button className={`button ${isCompared(product.id) ? 'button-dark active-action' : 'button-outline'}`} onClick={() => toggleCompare(product)}><GitCompareArrows size={17} /> {isCompared(product.id) ? 'В сравнении' : 'Сравнить'}</button></div><section className="reviews-section" aria-labelledby="reviews-title"><div className="reviews-heading"><h2 id="reviews-title">Отзывы</h2><span><Star size={15} fill="currentColor" /> {product.rating} · {product.reviews} отзывов</span></div><div className="reviews-grid">{reviewTexts.map((text, index) => <article className="review-card" key={text}><strong>{['Алексей', 'Марина', 'Илья'][index]}</strong><span>★★★★★</span><p>{text}</p></article>)}</div></section></>
}
