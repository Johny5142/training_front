export function ScaleLetter({ children, className = '' }) {
  return <span className={`scale-letter ${className}`}>{String(children).split('').map((letter, index) => <span key={`${letter}-${index}`} style={{ '--letter-index': index }}>{letter === ' ' ? '\u00a0' : letter}</span>)}</span>
}
