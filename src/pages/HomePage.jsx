import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ShieldCheck, Truck, Headphones } from 'lucide-react'
import { categories, productService } from '../services/productService'
import { ProductCard } from '../components/product/ProductCard'
import { ScaleLetter } from '../components/ui/ScaleLetter'

export function HomePage() { const [products, setProducts] = useState([]); useEffect(() => { productService.getAll().then(setProducts).catch(() => setProducts([])) }, []); return <>
  <section className="hero"><div><p className="eyebrow">Новая коллекция · 2026</p><h1><ScaleLetter>Технологии</ScaleLetter><br /><em><ScaleLetter>для жизни.</ScaleLetter></em></h1><p className="hero-copy">Выбираем устройства, которые делают каждый день проще, удобнее и ярче.</p><Link className="button button-dark" to="/catalog">Смотреть каталог <ArrowUpRight size={18} /></Link></div></section>
  <section className="section"><div className="section-head"><div><p className="eyebrow">Выбирайте своё</p><h2>Популярные категории</h2></div><Link to="/catalog">Все категории <ArrowUpRight size={16} /></Link></div><div className="category-grid">{categories.map((item) => <Link key={item.slug} to={`/catalog/${item.slug}`} className={`category-card ${item.accent}`}><span><img src={item.icon} alt="" /></span><h3>{item.label}</h3><ArrowUpRight size={18} /></Link>)}</div></section>
  <section className="section section-tint"><div className="section-head"><div><p className="eyebrow">В центре внимания</p><h2>Выбор покупателей</h2></div><Link to="/catalog">Смотреть все <ArrowUpRight size={16} /></Link></div><div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard product={product} key={product.id} />)}</div></section>
  <section className="benefits">{[[ShieldCheck, 'Гарантия качества', 'Только официальная техника'], [Truck, 'Быстрая доставка', 'Привезём от 1 дня'], [Headphones, 'Мы на связи', 'Поможем с выбором 7 дней в неделю']].map(([Icon, title, text]) => <div key={title}><Icon /><h3>{title}</h3><p>{text}</p></div>)}</section>
 </> }
