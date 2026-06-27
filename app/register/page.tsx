'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  function nextStep(e: React.FormEvent) {
    e.preventDefault()
    if (step < 2) { setStep(2); return }
    setLoading(true)
    setTimeout(() => router.push('/wardrobe'), 900)
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left: form territory (inverted from login) ───────────── */}
      <div className="flex-1 bg-ivory flex flex-col justify-center px-10 sm:px-14 lg:px-16 xl:px-24 py-20 lg:py-0 order-2 lg:order-1">
        {/* Mobile masthead */}
        <div className="lg:hidden mb-12 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="text-masthead text-midnight" style={{ fontSize: 'clamp(3rem, 10vw, 4.5rem)' }}>
            MIRANDA
          </div>
          <hr className="hairline-dark mt-4" />
        </div>

        <div
          className="max-w-[300px] animate-fade-in-up opacity-0"
          style={{ animationDelay: '120ms', animationFillMode: 'forwards' }}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-4 mb-10">
            <p className="section-label">Nova conta</p>
            <div className="flex items-center gap-1.5">
              {[1, 2].map(s => (
                <div
                  key={s}
                  className="transition-all duration-300"
                  style={{
                    width: s === step ? '18px' : '6px',
                    height: '1px',
                    background: s <= step ? '#3B72B5' : 'rgba(155,155,155,0.3)',
                  }}
                />
              ))}
            </div>
          </div>

          <form onSubmit={nextStep} className="space-y-9">
            {step === 1 && (
              <>
                <div
                  className="animate-fade-in-up opacity-0"
                  style={{ animationFillMode: 'forwards' }}
                >
                  <label className="section-label text-silver/80 block mb-2 text-[0.5rem]">Nome</label>
                  <input
                    type="text"
                    autoComplete="name"
                    className="input-editorial-dark"
                    placeholder="Como prefere ser chamada"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div
                  className="animate-fade-in-up opacity-0"
                  style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}
                >
                  <label className="section-label text-silver/80 block mb-2 text-[0.5rem]">E-mail</label>
                  <input
                    type="email"
                    autoComplete="email"
                    className="input-editorial-dark"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div
                  className="animate-fade-in-up opacity-0"
                  style={{ animationFillMode: 'forwards' }}
                >
                  <label className="section-label text-silver/80 block mb-2 text-[0.5rem]">Senha</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="input-editorial-dark pr-7"
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-silver/60 hover:text-midnight transition-colors"
                      tabIndex={-1}
                    >
                      {showPwd ? <EyeOff size={13} strokeWidth={1.25} /> : <Eye size={13} strokeWidth={1.25} />}
                    </button>
                  </div>
                </div>
                <div
                  className="animate-fade-in-up opacity-0"
                  style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}
                >
                  <label className="section-label text-silver/80 block mb-2 text-[0.5rem]">Confirmar senha</label>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="input-editorial-dark"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading || (step === 2 && password !== confirm)}
                className="btn-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando conta' : step === 1 ? 'Continuar' : 'Criar conta'}
              </button>
            </div>
          </form>

          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="mt-5 section-label text-[0.49rem] text-silver/60 hover:text-midnight transition-colors"
            >
              ← Voltar
            </button>
          )}

          {step === 1 && (
            <div className="mt-7">
              <Link
                href="/"
                className="section-label text-[0.49rem] text-silver/60 hover:text-midnight transition-colors"
              >
                Já tem conta? Entrar
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Hairline */}
      <div className="hidden lg:block w-px" style={{ background: 'rgba(200,200,200,0.07)' }} />

      {/* ── Right: brand territory ────────────────────────────────── */}
      <div
        className="relative hidden lg:flex lg:w-[45%] flex-col justify-between p-14 xl:p-20 overflow-hidden order-1 lg:order-2"
        style={{ background: '#0A0A0A' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative section-label text-silver/40">— II —</div>

        <div className="relative flex-1 flex flex-col justify-center">
          <div
            className="text-masthead text-ivory select-none animate-fade-in-up opacity-0"
            style={{
              fontSize: 'clamp(4rem, 7vw, 8rem)',
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
              animationDelay: '200ms',
              animationFillMode: 'forwards',
            }}
          >
            <p className="font-body text-silver italic text-[0.78rem]">
              Comece com o que tem. Refine com o que vê.
            </p>
          </div>
        </div>

        <div className="relative section-label text-silver/30">Temporada II — Outono</div>
      </div>
    </main>
  )
}
