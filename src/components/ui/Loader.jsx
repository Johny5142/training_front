export function Loader({ label = 'Загрузка...' }) {
  return <div className="loader" role="status" aria-live="polite"><span className="loader-spinner" />{label}</div>
}

export function ProductSkeleton() {
  return <article className="product-card skeleton-card" aria-hidden="true"><div className="skeleton skeleton-art" /><div className="product-meta"><div className="skeleton skeleton-line skeleton-short" /><div className="skeleton skeleton-line skeleton-title" /><div className="skeleton skeleton-line skeleton-price" /></div></article>
}

export function ProductGridSkeleton({ count = 6 }) {
  return <div className="product-grid">{Array.from({ length: count }, (_, index) => <ProductSkeleton key={index} />)}</div>
}
