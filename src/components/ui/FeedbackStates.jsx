export function ErrorMessage({ message, onRetry }) {
  return <div className="feedback-state error-state" role="alert"><h2>Не удалось загрузить данные</h2><p>{message}</p>{onRetry && <button className="button button-dark" onClick={onRetry}>Повторить загрузку</button>}</div>
}

export function EmptyState({ title, message, action }) {
  return <div className="feedback-state empty-state"><h2>{title}</h2>{message && <p>{message}</p>}{action}</div>
}
