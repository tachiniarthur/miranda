'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { forgotPassword, resetPassword, ApiError } from '@/lib/api'

// Fluxo de recuperação em duas fases:
//   1. "request" — informa o e-mail; a API gera um token de redefinição.
//   2. "reset"   — define a nova senha usando o token.
//
// Como o envio de e-mail ainda não é implementado no backend, o token é
// retornado diretamente pela API e usado aqui na mesma tela. Em produção, o
// token chegaria por e-mail e esta segunda fase seria uma página acessada pelo
// link do e-mail.
type Phase = 'request' | 'reset' | 'done' | 'sent'

export default function ForgotPasswordPage() {
  const [phase, setPhase] = useState<Phase>('request')
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await forgotPassword(email)
      if (res.reset_token) {
        // Token disponível (ambiente local, sem e-mail): segue para a redefinição.
        setResetToken(res.reset_token)
        setPhase('reset')
      } else {
        // E-mail não cadastrado — resposta genérica, sem revelar isso.
        setPhase('sent')
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível processar.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    setLoading(true)
    try {
      await resetPassword(resetToken, password)
      setPhase('done')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível redefinir.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-ivory flex flex-col">
      {/* Top: micro masthead */}
      <div className="px-10 sm:px-16 pt-12 animate-fade-in">
        <Link href="/" className="text-masthead-upright text-midnight" style={{ fontSize: '1.3rem' }}>
          MIRANDA
        </Link>
      </div>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center px-10 py-24">
        <div
          className="w-full max-w-[280px] animate-fade-in-up opacity-0"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          {phase === 'request' && (
            <>
              <p className="section-label text-silver mb-14">Recuperação de senha</p>
              <form onSubmit={handleRequest} className="space-y-10">
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
                {error && <p className="text-[0.68rem] font-body text-red-600/90">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary-dark">
                  {loading ? 'Verificando' : 'Continuar'}
                </button>
              </form>
              <div className="mt-9">
                <Link href="/" className="section-label text-[0.48rem] text-silver/60 hover:text-midnight transition-colors">
                  ← Voltar ao acesso
                </Link>
              </div>
            </>
          )}

          {phase === 'reset' && (
            <>
              <div className="mb-10">
                <div className="w-8 h-px bg-cerulean mb-6" />
                <p className="section-label text-silver mb-3">Nova senha</p>
                <p className="font-body text-silver/60 text-[0.68rem] leading-relaxed">
                  Defina uma nova senha para <span className="text-midnight">{email}</span>.
                </p>
                {/* Nota de desenvolvimento: em produção este token chegaria por e-mail. */}
                <p className="font-body text-silver/40 text-[0.6rem] italic mt-3 leading-relaxed">
                  (Em produção, esta etapa seria acessada pelo link enviado ao seu e-mail.)
                </p>
              </div>
              <form onSubmit={handleReset} className="space-y-9">
                <div>
                  <label className="section-label text-silver/70 block mb-2.5 text-[0.48rem]">Nova senha</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
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
                <div>
                  <label className="section-label text-silver/70 block mb-2.5 text-[0.48rem]">Confirmar senha</label>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="input-editorial-dark"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-[0.68rem] font-body text-red-600/90">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary-dark">
                  {loading ? 'Redefinindo' : 'Redefinir senha'}
                </button>
              </form>
            </>
          )}

          {phase === 'done' && (
            <div className="animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
              <div className="w-8 h-px bg-cerulean mb-8" />
              <p className="section-label text-silver mb-5">Senha redefinida</p>
              <p className="font-display text-midnight leading-snug mb-10" style={{ fontSize: '1.25rem', fontStyle: 'italic' }}>
                Tudo certo. Pode entrar.
              </p>
              <Link href="/" className="section-label text-[0.48rem] text-silver/60 hover:text-midnight transition-colors">
                Ir para o acesso →
              </Link>
            </div>
          )}

          {phase === 'sent' && (
            <div className="animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
              <div className="w-8 h-px bg-cerulean mb-8" />
              <p className="section-label text-silver mb-5">Instrução enviada</p>
              <p className="font-display text-midnight leading-snug mb-6" style={{ fontSize: '1.25rem', fontStyle: 'italic' }}>
                Verifique sua caixa de entrada.
              </p>
              <p className="font-body text-silver/70 text-[0.72rem] leading-relaxed mb-10">
                Se <span className="text-midnight">{email}</span> estiver cadastrado, enviamos as instruções para redefinir a senha.
              </p>
              <Link href="/" className="section-label text-[0.48rem] text-silver/60 hover:text-midnight transition-colors">
                Voltar ao acesso
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="px-10 sm:px-16 pb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <p className="section-label text-[0.44rem] text-silver/30">Temporada III</p>
      </div>
    </main>
  )
}
