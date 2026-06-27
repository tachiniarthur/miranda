'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Masthead } from './Masthead'

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/wardrobe', label: 'Guarda-roupa' },
    { href: '/look', label: 'Look do dia' },
  ]

  return (
    <header className="border-b" style={{ borderColor: 'rgba(200,200,200,0.1)' }}>
      <div className="max-w-screen-xl mx-auto px-8 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Masthead variant="compact" theme="dark" href="/wardrobe" />
          <div className="hidden md:block w-px h-4 bg-silver/20" />
          <nav className="hidden md:flex items-center gap-7">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`section-label transition-colors duration-200 ${
                  pathname === href ? 'text-ivory' : 'text-silver hover:text-platinum'
                }`}
                style={pathname === href ? { borderBottom: '1px solid rgba(59,114,181,0.8)', paddingBottom: '2px' } : {}}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile nav */}
        <nav className="flex md:hidden items-center gap-5">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`section-label text-[0.5rem] transition-colors ${
                pathname === href ? 'text-ivory' : 'text-silver'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
