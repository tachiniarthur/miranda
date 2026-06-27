'use client'

import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { WardrobeItem } from '@/lib/mockData'

interface ClothingCardProps {
  item: WardrobeItem
  index?: number
  onView: (item: WardrobeItem) => void
  onEdit: (item: WardrobeItem) => void
  onDelete: (id: string) => void
}

export function ClothingCard({ item, index = 0, onView, onEdit, onDelete }: ClothingCardProps) {
  const delay = Math.min(index * 60, 420)

  return (
    <div
      className="break-inside-avoid mb-5 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Visual container */}
      <div
        className="group relative overflow-hidden cursor-pointer"
        style={{ aspectRatio: item.aspectRatio, backgroundColor: item.colorHex }}
        onClick={() => onView(item)}
      >
        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Category label — centered, very subtle */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ color: item.textColor }}
        >
          <span className="text-[0.45rem] tracking-[0.35em] uppercase font-body opacity-25 select-none">
            {item.category}
          </span>
        </div>

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
            onClick={e => { e.stopPropagation(); onDelete(item.id) }}
            aria-label="Excluir"
          >
            <Trash2 size={14} strokeWidth={1.25} />
          </button>
        </div>
      </div>

      {/* Label */}
      <div className="pt-2.5 pb-1">
        <div className="flex items-baseline justify-between mb-0.5">
          <span className="section-label text-[0.5rem]">{item.category}</span>
          <span className="section-label text-[0.48rem] text-silver/60">{item.size}</span>
        </div>
        <p className="font-body text-[0.75rem] text-ivory/75 font-light leading-tight">{item.name}</p>
        <p className="font-body text-[0.62rem] text-silver mt-0.5">{item.color}</p>
      </div>
    </div>
  )
}
