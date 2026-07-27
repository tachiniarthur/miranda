'use client'

import { X, Pencil, Trash2, CloudRain } from 'lucide-react'
import {
  type ClothingItem,
  categoryLabel,
  labelFor,
  FORMALIDADE_OPTIONS,
  PESO_TERMICO_OPTIONS,
  ESTACAO_OPTIONS,
  type Estacao,
} from '@/lib/types'

interface ItemDetailDrawerProps {
  item: ClothingItem
  onClose: () => void
  onEdit: (item: ClothingItem) => void
  onDelete: (item: ClothingItem) => void
}

export function ItemDetailDrawer({ item, onClose, onEdit, onDelete }: ItemDetailDrawerProps) {
  const estacoesLabels =
    item.estacoes && item.estacoes.length > 0
      ? item.estacoes.map(e => labelFor(ESTACAO_OPTIONS, e as Estacao)).join(' · ')
      : null

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
          className="mx-8 mt-8 flex-shrink-0 bg-midnight relative overflow-hidden"
          style={{ aspectRatio: '3/4' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image_url}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-contain p-5"
          />
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
            {item.cor_primaria && (
              <p className="text-silver text-[0.7rem] font-body">{item.cor_primaria}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <Field label="Categoria" value={categoryLabel(item.category)} />
            <Field label="Formalidade" value={labelFor(FORMALIDADE_OPTIONS, item.formalidade)} />
            <Field label="Peso térmico" value={labelFor(PESO_TERMICO_OPTIONS, item.peso_termico)} />
            <Field
              label="Serve para chuva"
              value={item.serve_chuva == null ? '—' : item.serve_chuva ? 'Sim' : 'Não'}
            />
            {item.cor_secundaria && <Field label="Cor secundária" value={item.cor_secundaria} />}
            {item.estampa && <Field label="Estampa" value={item.estampa} />}
          </div>

          {estacoesLabels && (
            <div>
              <p className="section-label text-[0.48rem] mb-1.5">Estações</p>
              <p className="text-ivory/80 text-[0.72rem] font-body font-light">{estacoesLabels}</p>
            </div>
          )}

          {item.serve_chuva && (
            <div className="flex items-center gap-2 text-cerulean/80">
              <CloudRain size={13} strokeWidth={1.5} />
              <span className="section-label text-[0.48rem] text-cerulean/80">Enfrenta a chuva</span>
            </div>
          )}

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
              onClick={() => { onDelete(item); onClose() }}
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
      <p className="text-ivory/80 text-[0.75rem] font-body font-light">{value}</p>
    </div>
  )
}
