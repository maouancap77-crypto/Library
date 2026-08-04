'use client'

interface OrnateDividerProps {
  className?: string
  /** Símbolo central: cruz, losango, etc. Default: losango gótico. */
  symbol?: 'diamond' | 'cross' | 'fleur' | 'star'
}

/**
 * Divisor ornamental com fileamento dourado e símbolo central,
 * evocando manuscritos iluminados.
 */
function DividerSymbol({ symbol }: { symbol: NonNullable<OrnateDividerProps['symbol']> }) {
  switch (symbol) {
    case 'cross':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2v16M4 8h12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      )
    case 'fleur':
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 2c-1.5 2-1.5 4 0 6 1.5-2 1.5-4 0-6zM11 20c-1.5-2-1.5-4 0-6 1.5 2 1.5 4 0 6zM2 11c2-1.5 4-1.5 6 0-2 1.5-4 1.5-6 0zM20 11c-2-1.5-4-1.5-6 0 2 1.5 4 1.5 6 0z"
            fill="currentColor"
          />
          <circle cx="11" cy="11" r="1.5" fill="currentColor" />
        </svg>
      )
    case 'star':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2l2 6 6 0-5 4 2 6-5-4-5 4 2-6-5-4 6 0z"
            fill="currentColor"
          />
        </svg>
      )
    case 'diamond':
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 2l4 9-4 9-4-9z"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
          />
          <path d="M3 11h16" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="11" cy="11" r="1.5" fill="currentColor" />
        </svg>
      )
  }
}

export function OrnateDivider({
  className = '',
  symbol = 'diamond',
}: OrnateDividerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-gold ${className}`}
      aria-hidden="true"
    >
      <div className="gold-divider h-px flex-1" />
      <div className="animate-gold-shimmer opacity-80">
        <DividerSymbol symbol={symbol} />
      </div>
      <div className="gold-divider h-px flex-1" />
    </div>
  )
}
