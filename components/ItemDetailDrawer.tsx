'use client'

import { X, Pencil, Trash2 } from 'lucide-react'
import type { WardrobeItem } from '@/lib/mockData'

interface ItemDetailDrawerProps {
  item: WardrobeItem
  onClose: () => void
  onEdit: (item: WardrobeItem) => void
  onDelete: (id: string) => void
}

export function ItemDetailDrawer({ item, onClose, onEdit, onDelete }: ItemDetailDrawerProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      style={{ background: 'rgba(10,10,10,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-sm bg-charcoal h-full overflow-y-auto animate-fade-in flex flex-col border-l"
        style={{ borderColor: 'rgba(200,200,200,0.08)', animationDuration: '0.28s' }}
      >
        {/* Top bar */}
        <div
          className="sticky top-0 bg-charcoal z-10 flex items-center justify-between px-8 py-5 border-b"
          style={{ borderColor: 'rgba(200,200,200,0.08)' }}
        >
          <span className="section-label">Ficha da peça</span>
          <button onClick={onClose} className="text-silver hover:text-ivory transition-colors">
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>

        {/* Visual */}
        <div
          className="mx-8 mt-8 flex-shrink-0"
          style={{ aspectRatio: item.aspectRatio, backgroundColor: item.colorHex }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ color: item.textColor }}
          >
            <span className="text-[0.4rem] tracking-[0.4em] uppercase font-body opacity-20 select-none">
              {item.category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-8 pt-7 pb-10 flex-1 space-y-8">
          <div>
            <h2
              className="font-display text-ivory leading-tight mb-1"
              style={{ fontSize: '1.35rem', fontStyle: 'italic' }}
            >
              {item.name}
            </h2>
            <p className="text-silver text-[0.7rem] font-body">{item.color}</p>
          </div>

          <div className="space-y-5">
            <Field label="Categoria" value={item.category} />
            <Field label="Tamanho" value={item.size} />
            {item.note && <Field label="Nota" value={item.note} />}
          </div>

          <hr className="hairline" />

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 flex items-center justify-center gap-2 border border-silver/20 text-silver py-3 text-[0.54rem] tracking-[0.2em] uppercase font-body hover:border-silver/40 hover:text-platinum transition-colors duration-200"
            >
              <Pencil size={11} strokeWidth={1.5} />
              Editar
            </button>
            <button
              onClick={() => { onDelete(item.id); onClose() }}
              className="flex-1 flex items-center justify-center gap-2 border border-red-900/40 text-red-400/70 py-3 text-[0.54rem] tracking-[0.2em] uppercase font-body hover:border-red-700/50 hover:text-red-300 transition-colors duration-200"
            >
              <Trash2 size={11} strokeWidth={1.5} />
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="section-label text-[0.48rem] mb-1">{label}</p>
      <p className="text-ivory/80 text-[0.75rem] font-body font-light capitalize">{value}</p>
    </div>
  )
}
