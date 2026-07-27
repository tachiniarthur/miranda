'use client'

import { Eye, Pencil, Trash2 } from 'lucide-react'
import { type ClothingItem, categoryLabel } from '@/lib/types'

interface ClothingCardProps {
  item: ClothingItem
  index?: number
  onView: (item: ClothingItem) => void
  onEdit: (item: ClothingItem) => void
  onDelete: (item: ClothingItem) => void
}

export function ClothingCard({ item, index = 0, onView, onEdit, onDelete }: ClothingCardProps) {
  const delay = Math.min(index * 60, 420)

  return (
    <div
      className="break-inside-avoid mb-5 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Visual container — imagem real (fundo removido) sobre superfície neutra */}
      <div
        className="group relative overflow-hidden cursor-pointer bg-charcoal"
        style={{ aspectRatio: '3/4' }}
        onClick={() => onView(item)}
      >
        {/* Subtle depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.04), transparent 70%)' }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image_url}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-contain p-4"
          loading="lazy"
        />

        {/* Hover action overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center gap-5">
          <button
            className="text-ivory/70 hover:text-ivory transition-colors duration-150"
            onClick={e => { e.stopPropagation(); onView(item) }}
            aria-label="Visualizar"
          >
            <Eye size={15} strokeWidth={1.25} />
          </button>
          <button
            className="text-ivory/70 hover:text-ivory transition-colors duration-150"
            onClick={e => { e.stopPropagation(); onEdit(item) }}
            aria-label="Editar"
          >
            <Pencil size={14} strokeWidth={1.25} />
          </button>
          <button
            className="text-ivory/70 hover:text-red-300 transition-colors duration-150"
            onClick={e => { e.stopPropagation(); onDelete(item) }}
            aria-label="Excluir"
          >
            <Trash2 size={14} strokeWidth={1.25} />
          </button>
        </div>
      </div>

      {/* Label */}
      <div className="pt-2.5 pb-1">
        <div className="flex items-baseline justify-between mb-0.5">
          <span className="section-label text-[0.5rem]">{categoryLabel(item.category)}</span>
        </div>
        <p className="font-body text-[0.75rem] text-ivory/75 font-light leading-tight">{item.name}</p>
        {item.cor_primaria && (
          <p className="font-body text-[0.62rem] text-silver mt-0.5">{item.cor_primaria}</p>
        )}
      </div>
    </div>
  )
}
