'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchMe, isAuthenticated, clearToken } from '@/lib/api'

// Protege rotas: se não houver token válido, redireciona ao login ('/').
// Enquanto valida o token contra o backend, exibe um estado de carregamento
// discreto, coerente com a identidade visual.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<'checking' | 'ok'>('checking')

  useEffect(() => {
    let active = true

    if (!isAuthenticated()) {
      router.replace('/')
      return
    }

    // Confirma que o token ainda é válido no backend.
    fetchMe()
      .then(() => { if (active) setStatus('ok') })
      .catch(() => {
        clearToken()
        router.replace('/')
      })

    return () => { active = false }
  }, [router])

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 animate-fade-in">
          <div className="text-masthead text-ivory/80" style={{ fontSize: '2rem' }}>
            MIRANDA
          </div>
          <div className="relative w-24 h-px bg-silver/15 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full w-1/3 bg-cerulean"
              style={{ animation: 'loadingBar 1.4s cubic-bezier(0.4,0,0.2,1) infinite' }}
            />
          </div>
        </div>
        <style>{`
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(320%); }
          }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}
