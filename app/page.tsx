'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/wardrobe'), 800)
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left: brand territory ─────────────────────────────────── */}
      <div
        className="relative hidden lg:flex lg:w-[58%] flex-col justify-between p-14 xl:p-20 overflow-hidden"
        style={{ background: '#0A0A0A' }}
      >
        {/* Subtle radial depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 25% 45%, #131313 0%, #0A0A0A 100%)' }}
        />

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top editorial marker */}
        <div className="relative section-label text-silver/50 animate-fade-in">— I —</div>

        {/* Masthead */}
        <div className="relative flex-1 flex flex-col justify-center">
          <div
            className="text-masthead text-ivory select-none animate-fade-in-up opacity-0"
            style={{
              fontSize: 'clamp(5rem, 9.5vw, 10rem)',
              animationDelay: '80ms',
              animationFillMode: 'forwards',
            }}
          >
            MIRANDA
          </div>

          <div
            className="mt-8 pt-6 border-t animate-fade-in-up opacity-0"
            style={{
              borderColor: 'rgba(200,200,200,0.09)',
              animationDelay: '220ms',
              animationFillMode: 'forwards',
            }}
          >
            <p className="font-body text-silver italic text-[0.8rem] leading-relaxed">
              O guarda-roupa obedece.
            </p>
          </div>
        </div>

        {/* Bottom marker */}
        <div
          className="relative section-label text-silver/35 animate-fade-in opacity-0"
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          Temporada I — Primavera
        </div>
      </div>

      {/* Hairline divider */}
      <div className="hidden lg:block w-px" style={{ background: 'rgba(200,200,200,0.07)' }} />

      {/* ── Right: form territory ────────────────────────────────── */}
      <div className="flex-1 bg-ivory flex flex-col justify-center px-10 sm:px-14 lg:px-16 xl:px-24 py-20 lg:py-0">
        {/* Mobile masthead */}
        <div className="lg:hidden mb-14 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="text-masthead text-midnight" style={{ fontSize: 'clamp(3.5rem, 12vw, 5rem)' }}>
            MIRANDA
          </div>
          <hr className="hairline-dark mt-4" />
        </div>

        <div
          className="max-w-[300px] animate-fade-in-up opacity-0"
          style={{ animationDelay: '160ms', animationFillMode: 'forwards' }}
        >
          <p className="section-label text-silver mb-10">Acesso</p>

          <form onSubmit={handleSubmit} className="space-y-9">
            <div>
              <label htmlFor="email" className="section-label text-silver/80 block mb-2 text-[0.5rem]">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input-editorial-dark"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="section-label text-silver/80 block mb-2 text-[0.5rem]">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-editorial-dark pr-7"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-silver/60 hover:text-midnight transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={13} strokeWidth={1.25} />
                  ) : (
                    <Eye size={13} strokeWidth={1.25} />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-dark flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-3 h-px bg-ivory/40 animate-shimmer" style={{ backgroundSize: '200%' }} />
                    Entrando
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>

          <div
            className="mt-7 flex items-center gap-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: '280ms', animationFillMode: 'forwards' }}
          >
            <Link
              href="/register"
              className="section-label text-[0.49rem] text-silver/70 hover:text-midnight transition-colors duration-200"
            >
              Criar conta
            </Link>
            <span className="text-silver/30 text-xs">·</span>
            <Link
              href="/forgot-password"
              className="section-label text-[0.49rem] text-silver/70 hover:text-midnight transition-colors duration-200"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
