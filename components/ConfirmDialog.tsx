'use client'

import { Loader2 } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,10,0.85)' }}
      onClick={e => { if (e.target === e.currentTarget && !busy) onCancel() }}
    >
      <div className="w-full max-w-xs bg-charcoal border animate-fade-in" style={{ borderColor: 'rgba(200,200,200,0.08)' }}>
        <div className="px-7 py-7">
          <p className="section-label text-silver mb-4">{title}</p>
          <p className="font-body text-ivory/70 text-[0.78rem] leading-relaxed mb-8">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={busy}
              className="flex-1 border border-silver/20 text-silver py-3 text-[0.54rem] tracking-[0.2em] uppercase font-body hover:border-silver/40 hover:text-platinum transition-colors duration-200 disabled:opacity-40"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={busy}
              className="flex-1 border border-red-900/40 text-red-400/80 py-3 text-[0.54rem] tracking-[0.2em] uppercase font-body hover:border-red-700/50 hover:text-red-300 transition-colors duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 size={11} strokeWidth={1.5} className="animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
