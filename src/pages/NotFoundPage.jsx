import { Link } from 'react-router-dom'
export function NotFoundPage() { return <div className="empty-page not-found"><p className="eyebrow">Ошибка 404</p><h1>Кажется, страница<br />потерялась.</h1><Link className="button button-dark" to="/">Вернуться на главную</Link></div> }
