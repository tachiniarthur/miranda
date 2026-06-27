'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 900)
  }

  return (
    <main className="min-h-screen bg-ivory flex flex-col">
      {/* Top: micro masthead */}
      <div className="px-10 sm:px-16 pt-12 animate-fade-in">
        <Link href="/" className="text-masthead-upright text-midnight" style={{ fontSize: '1.3rem' }}>
          MIRANDA
        </Link>
      </div>

      {/* Center: single column, lot of air */}
      <div className="flex-1 flex items-center justify-center px-10 py-24">
        <div
          className="w-full max-w-[260px] animate-fade-in-up opacity-0"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          {!sent ? (
            <>
              <p className="section-label text-silver mb-14">Recuperação de senha</p>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div>
                  <label htmlFor="recover-email" className="section-label text-silver/70 block mb-2.5 text-[0.48rem]">
                    E-mail cadastrado
                  </label>
                  <input
                    id="recover-email"
                    type="email"
                    className="input-editorial-dark"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-dark"
                >
                  {loading ? 'Enviando' : 'Enviar instruções'}
                </button>
              </form>

              <div className="mt-9">
                <Link
                  href="/"
                  className="section-label text-[0.48rem] text-silver/60 hover:text-midnight transition-colors"
                >
                  ← Voltar ao acesso
                </Link>
              </div>
            </>
          ) : (
            <div
              className="animate-fade-in-up opacity-0"
              style={{ animationFillMode: 'forwards' }}
            >
              <div className="mb-12">
                {/* Thin horizontal marker */}
                <div className="w-8 h-px bg-cerulean mb-8" />
                <p className="section-label text-silver mb-5">Instrução enviada</p>
                <p
                  className="font-display text-midnight leading-snug"
                  style={{ fontSize: '1.25rem', fontStyle: 'italic' }}
                >
                  Verifique sua caixa de entrada.
                </p>
              </div>

              <p className="font-body text-silver/70 text-[0.72rem] leading-relaxed mb-10">
                Enviamos as instruções para{' '}
                <span className="text-midnight">{email}</span>.
                <br />
                Se não aparecer em alguns minutos, verifique o spam.
              </p>

              <Link
                href="/"
                className="section-label text-[0.48rem] text-silver/60 hover:text-midnight transition-colors"
              >
                Voltar ao acesso
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom editorial marker */}
      <div className="px-10 sm:px-16 pb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <p className="section-label text-[0.44rem] text-silver/30">Temporada III</p>
      </div>
    </main>
  )
}
