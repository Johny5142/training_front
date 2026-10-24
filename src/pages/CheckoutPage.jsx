import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../features/cart/CartContext'
import { formatPrice } from '../services/productService'

export function CheckoutPage() {
  const { totalPrice, items, clearCart } = useCart()
  const [orderNumber, setOrderNumber] = useState('')

  if (!items.length && !orderNumber) return <div className="empty-page"><h1>Корзина пуста</h1><Link to="/catalog">В каталог</Link></div>

  if (orderNumber) return <section className="section checkout-success"><p className="eyebrow">Заказ оформлен</p><h1>Спасибо за покупку!</h1><p>Ваш заказ №{orderNumber} успешно создан. Мы свяжемся с вами для подтверждения деталей.</p><Link className="button button-dark" to="/catalog">Вернуться в каталог</Link></section>

  const submitOrder = (event) => {
    event.preventDefault()
    setOrderNumber(`JS-${Date.now().toString().slice(-8)}`)
    clearCart()
  }

  return <section className="section checkout"><p className="eyebrow">Финальный шаг</p><h1>Оформление заказа</h1><form onSubmit={submitOrder}><label>Имя и фамилия<input required minLength="2" pattern="[^\s]+\s+[^\s]+.*" title="Введите имя и фамилию" placeholder="Иван Иванов" /></label><label>Email<input required type="email" placeholder="name@example.com" /></label><label>Телефон<input required type="tel" pattern="[+0-9 ()-]{7,}" title="Введите корректный номер телефона" placeholder="+375 (__) ___-__-__" /></label><label>Город<input required placeholder="Минск" /></label><label>Адрес доставки<input required placeholder="Улица, дом, квартира" /></label><label>Способ доставки<select required defaultValue=""><option value="" disabled>Выберите способ доставки</option><option>Курьерская доставка</option><option>Самовывоз из пункта выдачи</option></select></label><label>Способ оплаты<select required defaultValue=""><option value="" disabled>Выберите способ оплаты</option><option>Оплата при получении</option><option>Банковская карта (учебный режим)</option></select></label><button className="button button-dark" type="submit">Подтвердить заказ · {formatPrice(totalPrice)}</button></form></section>
}
