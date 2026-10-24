import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, ArrowUpRight, Menu, X, Heart, GitCompareArrows, Sun, Moon } from 'lucide-react'
import { useCart } from '../../features/cart/CartContext'
import { useFavorites } from '../../features/favorites/FavoritesContext'
import { useCompare } from '../../features/compare/CompareContext'
import { useTheme } from '../../features/theme/ThemeContext'

export function Layout() {
  const { totalItems, feedback } = useCart()
  const { favoriteItems } = useFavorites()
  const { compareItems } = useCompare()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  return <div className="app-shell">
    <header className="site-header">
      <Link to="/" className="logo shiny-text">Johnny<span>Store</span></Link>
      <nav id="main-navigation" aria-label="Основная навигация" className={menuOpen ? 'open' : ''}><NavLink onClick={closeMenu} to="/">Главная</NavLink><NavLink onClick={closeMenu} to="/catalog">Каталог</NavLink><NavLink onClick={closeMenu} to="/about">О магазине</NavLink></nav>
      <div className="header-actions"><button className="icon-button search-button" aria-label="Открыть поиск" onClick={() => navigate('/catalog')}><Search size={19} /></button><Link to="/favorites" className="header-icon-link" aria-label="Избранное"><Heart size={19} />{favoriteItems.length > 0 && <b>{favoriteItems.length}</b>}</Link><Link to="/compare" className="header-icon-link" aria-label="Сравнение"><GitCompareArrows size={19} />{compareItems.length > 0 && <b>{compareItems.length}</b>}</Link><button className="icon-button theme-toggle" aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'} onClick={toggleTheme}>{theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}</button><Link to="/cart" className="cart-link"><ShoppingBag size={19} /> <span>Корзина</span>{totalItems > 0 && <b>{totalItems}</b>}</Link><button className="menu-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div>
    </header>
    {feedback && <div className="cart-toast" role="status">{feedback}</div>}
    <main><Outlet /></main>
    <footer className="site-footer"><div className="logo shiny-text">Johnny<span>Store</span></div><p>Техника, которая работает на вас.</p><Link to="/catalog">Перейти в каталог <ArrowUpRight size={16} /></Link><small>© 2026 JohnnyStore. Учебный проект.</small></footer>
  </div>
}
