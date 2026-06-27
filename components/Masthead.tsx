import Link from 'next/link'

interface MastheadProps {
  variant?: 'hero' | 'compact'
  theme?: 'light' | 'dark'
  href?: string
}

export function Masthead({ variant = 'compact', theme = 'dark', href = '/' }: MastheadProps) {
  const textColor = theme === 'dark' ? 'text-ivory' : 'text-midnight'

  if (variant === 'hero') {
    return (
      <div className={`text-masthead select-none ${textColor}`} style={{ fontSize: 'clamp(4.5rem, 9vw, 9.5rem)' }}>
        MIRANDA
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={`text-masthead select-none transition-opacity hover:opacity-80 ${textColor}`}
      style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
    >
      MIRANDA
    </Link>
  )
}
