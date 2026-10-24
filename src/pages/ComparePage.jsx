import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCompare } from '../features/compare/CompareContext'
import { EmptyState } from '../components/ui/FeedbackStates'

export function ComparePage() {
  const { compareItems, clearCompare } = useCompare()
  const keys = [...new Set(compareItems.flatMap((product) => Object.keys(product.specifications || {})))]
  if (!compareItems.length) return <section className="section"><p className="eyebrow">JohnnyStore</p><h1>Сравнение</h1><EmptyState title="Нет товаров для сравнения" message="Добавьте несколько товаров из каталога." action={<Link className="button button-dark" to="/catalog">Открыть каталог</Link>} /></section>
  return <section className="section compare-page"><div className="compare-heading"><div><p className="eyebrow">JohnnyStore</p><h1>Сравнение</h1></div><button className="button button-dark" onClick={clearCompare}><Trash2 size={17} /> Очистить</button></div><div className="compare-table" role="table"><div className="compare-row compare-products"><div className="compare-label">Товар</div>{compareItems.map((product) => <div key={product.id}><img src={product.image} alt={product.title} /><h3>{product.title}</h3><strong>{new Intl.NumberFormat('ru-RU').format(product.price)} ₽</strong></div>)}</div><div className="compare-row"><div className="compare-label">Бренд</div>{compareItems.map((product) => <div key={product.id}>{product.brand}</div>)}</div><div className="compare-row"><div className="compare-label">Рейтинг</div>{compareItems.map((product) => <div key={product.id}>★ {product.rating} ({product.reviews})</div>)}</div>{keys.map((key) => <div className="compare-row" key={key}><div className="compare-label">{key}</div>{compareItems.map((product) => <div key={product.id}>{product.specifications?.[key] || '—'}</div>)}</div>)}</div></section>
}
