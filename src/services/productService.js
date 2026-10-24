import products from '../data/products.json'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function fetchFromApi(path) {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) throw new Error(`Не удалось загрузить товары: ${response.status}`)
  return response.json()
}

export const categories = [
  { slug: 'smartphones', label: 'Смартфоны', icon: '/category/free-icon-smartphone-7344131.png', accent: 'lavender' },
  { slug: 'laptops', label: 'Ноутбуки', icon: '/category/free-icon-laptop-5780651.png', accent: 'yellow' },
  { slug: 'tablets', label: 'Планшеты', icon: '/category/free-icon-computer-tablet-25466.png', accent: 'blue' },
  { slug: 'headphones', label: 'Наушники', icon: '/category/free-icon-earbuds-4242349.png', accent: 'peach' },
  { slug: 'monitors', label: 'Мониторы', icon: '/category/free-icon-monitor-1250704.png', accent: 'mint' },
  { slug: 'accessories', label: 'Аксессуары', icon: '/category/free-icon-charger-18418543.png', accent: 'pink' },
]

export const productService = {
  getAll: async () => API_URL ? fetchFromApi('/products') : products,
  getById: async (id) => API_URL ? fetchFromApi(`/products/${id}`) : products.find((product) => product.id === id),
  getByCategory: async (category) => API_URL ? fetchFromApi(`/products?category=${category}`) : products.filter((product) => product.category === category),
}

export const formatPrice = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`
