# JohnnyStore

Учебный одностраничный интернет-магазин электронной техники. Проект создан для практики React, компонентной архитектуры, Context API, React Router, работы с формами, фильтрации, сортировки и `localStorage`.

## Возможности

- каталог смартфонов, ноутбуков, планшетов, наушников, мониторов и аксессуаров;
- поиск без перезагрузки страницы и без учёта регистра;
- фильтрация по категории, цене, производителю и наличию;
- сортировка по популярности, цене и названию;
- отдельная страница каждого товара;
- добавление товаров в корзину и изменение количества;
- автоматический пересчёт стоимости;
- сохранение корзины после перезагрузки;
- оформление заказа с валидацией формы;
- генерация учебного номера заказа и очистка корзины после оформления;
- избранное с сохранением в `localStorage`;
- сравнение до четырёх товаров и их характеристик;
- отзывы на странице товара;
- светлая и тёмная темы с сохранением выбора;
- Skeleton Loader, Error и Empty-состояния;
- адаптивная версия для desktop, tablet и mobile;
- hamburger-меню на мобильных экранах;
- WebGL Plasma-фон с анимацией;
- анимированный логотип и заголовки.

## Технологический стек

- React;
- JavaScript ES6+;
- Vite;
- React Router;
- Context API и `useReducer`;
- Fetch API для будущего подключения сервера;
- CSS3, CSS-анимации и responsive media queries;
- Lucide React для интерфейсных иконок.

## Запуск проекта

Требуется Node.js и npm.

```bash
npm install
npm run dev
```

После запуска открой адрес, который покажет Vite, обычно:

```text
http://localhost:5173/
```

Для production-сборки:

```bash
npm run build
```

Для локальной проверки production-сборки:

```bash
npm run preview
```

## Структура проекта

```text
src/
├── app/
│   └── App.jsx                         # маршрутизация приложения
├── components/
│   ├── background/
│   │   └── PlasmaBackground.jsx        # WebGL-фон
│   ├── layout/
│   │   └── Layout.jsx                  # Header, Outlet и Footer
│   ├── product/
│   │   ├── ProductCard.jsx              # карточка товара
│   │   └── ProductExtras.jsx            # избранное, сравнение и отзывы
│   └── ui/
│       ├── FeedbackStates.jsx           # ErrorState и EmptyState
│       ├── Loader.jsx                   # Loader и Skeleton
│       └── ScaleLetter.jsx              # анимация букв
├── data/
│   └── products.json                    # локальный каталог товаров
├── features/
│   ├── cart/
│   │   └── CartContext.jsx              # состояние корзины
│   ├── catalog/
│   │   └── CatalogContext.jsx           # состояние каталога
│   ├── compare/
│   │   └── CompareContext.jsx           # состояние сравнения
│   ├── favorites/
│   │   └── FavoritesContext.jsx         # состояние избранного
│   └── theme/
│       └── ThemeContext.jsx              # светлая и тёмная темы
├── pages/
│   ├── HomePage.jsx
│   ├── CatalogPage.jsx
│   ├── ProductPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── FavoritesPage.jsx
│   ├── ComparePage.jsx
│   ├── AboutPage.jsx
│   └── NotFoundPage.jsx
├── services/
│   └── productService.js                # слой получения товаров
└── styles/
    ├── global.css                       # базовая сетка и responsive
    └── theme-overrides.css               # темы и визуальные переопределения

public/
├── cards/                               # изображения товаров
└── category/                            # иконки категорий
```

## Маршруты

| Маршрут | Назначение |
| --- | --- |
| `/` | Главная страница |
| `/catalog` | Весь каталог |
| `/catalog/:category` | Каталог выбранной категории |
| `/product/:id` | Страница товара |
| `/cart` | Корзина |
| `/checkout` | Оформление заказа |
| `/favorites` | Избранные товары |
| `/compare` | Сравнение товаров |
| `/about` | Информация о магазине |
| `/404` | Страница ошибки 404 |

## Данные товаров

Локальные данные хранятся в `src/data/products.json`. Каждый товар содержит:

```json
{
  "id": "iphone-17e",
  "title": "iPhone 17e",
  "category": "smartphones",
  "brand": "Apple",
  "price": 74990,
  "oldPrice": 79990,
  "rating": 4.7,
  "reviews": 48,
  "image": "/cards/iphone-17e.jpg",
  "description": "Описание товара",
  "inStock": true,
  "specifications": {
    "memory": "256 ГБ",
    "screen": "6.1 дюйма"
  }
}
```

### Как добавить новый товар

1. Добавь изображение в `public/cards/`.
2. Укажи путь к нему в JSON, например `"image": "/cards/new-product.jpg"`.
3. Добавь новый объект в `src/data/products.json`.
4. Проверь, что `id` уникален.
5. Укажи существующую категорию: `smartphones`, `laptops`, `tablets`, `headphones`, `monitors` или `accessories`.
6. Перезапусти dev-сервер или обнови страницу.

Для изображений рекомендуется использовать понятные имена без пробелов и кириллицы. Если изображение не загрузится, приложение автоматически показывает `public/cards/placeholder-product.svg`.

## Сервис данных и API

Компоненты не обращаются к JSON напрямую. Они используют `productService`:

```js
productService.getAll()
productService.getById(id)
productService.getByCategory(category)
```

По умолчанию используется локальный JSON. Чтобы переключиться на API:

1. Создай `.env` на основе `.env.example`.
2. Укажи адрес API:

```env
VITE_API_URL=http://localhost:3000/api
```

Сервис будет использовать следующие endpoints:

```text
GET /products
GET /products/:id
GET /products?category=smartphones
```

Такой слой изоляции позволяет заменить источник данных без переписывания компонентов каталога.

## Управление состоянием

### Каталог

`CatalogContext` содержит:

- список товаров;
- состояние загрузки;
- ошибку;
- выбранную категорию;
- поисковый запрос;
- фильтры цены, производителя и наличия;
- выбранную сортировку.

### Корзина

`CartContext` содержит:

- список товаров;
- количество каждого товара;
- добавление и удаление;
- изменение количества;
- общее количество товаров;
- общую стоимость;
- сохранение в `localStorage` по ключу `volt-cart`.

### Избранное, сравнение и тема

Используются отдельные Context API:

- `johnny-store-favorites` — избранные товары;
- `johnny-store-compare` — товары для сравнения;
- `johnny-store-theme` — текущая тема.

## Оформление заказа

Форма заказа содержит:

- имя и фамилию;
- email;
- телефон;
- город;
- адрес доставки;
- способ доставки;
- способ оплаты.

Работает браузерная валидация обязательных полей, email и телефона. Реальной оплаты нет. После отправки приложение генерирует учебный номер заказа, очищает корзину и показывает экран подтверждения.

## Адаптивность

- desktop: от 1200 px;
- tablet: 768–1199 px;
- mobile: до 767 px.

На мобильных устройствах каталог становится одноколоночным, навигация открывается через hamburger-кнопку, а таблица сравнения прокручивается горизонтально.

## Доступность

В проекте используются:

- семантические `header`, `main`, `section`, `article`, `footer`;
- `alt` у изображений товаров;
- `button` для действий и `Link` для навигации;
- связанные с полями формы `label`;
- `aria-label`, `aria-expanded`, `aria-controls` и `role="status"` для интерактивных состояний;
- `focus-visible` стили для клавиатурной навигации;
- поддержка `prefers-reduced-motion` для отключения анимаций.

## Проверка перед сдачей

```bash
npm run build
```

Сборка должна завершиться сообщением `built successfully`. Предупреждения Vite о директивах сторонних пакетов `use client` относятся к зависимостям и не являются ошибками приложения.
