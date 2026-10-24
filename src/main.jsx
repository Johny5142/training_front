import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { CartProvider } from './features/cart/CartContext'
import { CatalogProvider } from './features/catalog/CatalogContext'
import { FavoritesProvider } from './features/favorites/FavoritesContext'
import { CompareProvider } from './features/compare/CompareContext'
import { ThemeProvider } from './features/theme/ThemeContext'
import './styles/global.css'
import './styles/theme-overrides.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <ThemeProvider>
          <FavoritesProvider>
            <CompareProvider>
              <CatalogProvider>
                <App />
              </CatalogProvider>
            </CompareProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
