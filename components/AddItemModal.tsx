'use client'

import { useState, useRef } from 'react'
import { X, Upload, Check } from 'lucide-react'
import { CATEGORIES, type Category, type WardrobeItem } from '@/lib/mockData'

interface AddItemModalProps {
  item?: WardrobeItem | null
  onClose: () => void
  onSave: (item: Omit<WardrobeItem, 'id'> & { id?: string }) => void
}

const CATEGORY_OPTIONS = CATEGORIES.filter(c => c.key !== 'tudo') as { key: Category; label: string }[]

export function AddItemModal({ item, onClose, onSave }: AddItemModalProps) {
  const isEdit = !!item
  const [category, setCategory] = useState<Category>(item?.category ?? 'blazers')
  const [name, setName] = useState(item?.name ?? '')
  const [color, setColor] = useState(item?.color ?? '')
  const [colorHex, setColorHex] = useState(item?.colorHex ?? '#C8C8C8')
  const [size, setSize] = useState(item?.size ?? '')
  const [note, setNote] = useState(item?.note ?? '')
  const [dropActive, setDropActive] = useState(false)
  const [fileAccepted, setFileAccepted] = useState(false)
  const [fileName, setFileName] = useState('')
  const dropRef = useRef<HTMLDivElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDropActive(false)
    const file = e.dataTransfer.files[0]
    if (file) { setFileAccepted(true); setFileName(file.name) }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) { setFileAccepted(true); setFileName(file.name) }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !color.trim() || !size.trim()) return
    const textColor = isLightColor(colorHex) ? '#1A1A1A' : '#C8C8C8'
    onSave({
      id: item?.id,
      name: name.trim(),
      category,
      color: color.trim(),
      colorHex,
      textColor,
      size: size.trim(),
      note: note.trim() || undefined,
      aspectRatio: '3/4',
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,10,0.85)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md bg-charcoal border animate-fade-in"
        style={{ borderColor: 'rgba(200,200,200,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: 'rgba(200,200,200,0.08)' }}>
          <span className="section-label">{isEdit ? 'Editar Peça' : 'Nova Peça'}</span>
          <button onClick={onClose} className="text-silver hover:text-ivory transition-colors">
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-7 space-y-6">
          {/* Dropzone */}
          <div>
            <div
              ref={dropRef}
              className={`relative border transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer select-none ${
                fileAccepted
                  ? 'bg-cerulean/5 border-cerulean/40'
                  : dropActive
                  ? 'bg-ivory/3 border-ivory/20'
                  : 'border-dashed border-silver/25 hover:border-silver/40'
              }`}
              style={{ minHeight: '130px' }}
              onDragOver={e => { e.preventDefault(); setDropActive(true) }}
              onDragLeave={() => setDropActive(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
              {fileAccepted ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-cerulean/15 flex items-center justify-center">
                    <Check size={13} strokeWidth={1.5} className="text-cerulean" />
                  </div>
                  <p className="section-label text-cerulean text-[0.5rem]">Imagem recebida</p>
                  <p className="text-silver text-[0.6rem] font-body truncate max-w-[200px]">{fileName}</p>
                </>
              ) : (
                <>
                  <Upload size={16} strokeWidth={1.25} className="text-silver/50" />
                  <p className="section-label text-[0.5rem]">Solte a imagem aqui</p>
                  <p className="text-silver/40 text-[0.58rem] font-body">ou clique para selecionar</p>
                </>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="section-label mb-3">Categoria</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {CATEGORY_OPTIONS.map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategory(cat.key)}
                  className={`text-[0.52rem] tracking-[0.2em] uppercase font-body pb-0.5 transition-colors duration-150 ${
                    category === cat.key
                      ? 'text-ivory border-b border-cerulean'
                      : 'text-silver hover:text-platinum border-b border-transparent'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="section-label block mb-2">Nome da peça</label>
            <input
              type="text"
              className="input-editorial"
              placeholder="Blazer de alfaiataria preto"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* Color + Hex */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="section-label block mb-2">Cor</label>
              <input
                type="text"
                className="input-editorial"
                placeholder="Preto"
                value={color}
                onChange={e => setColor(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="section-label block mb-2">Amostra</label>
              <input
                type="color"
                value={colorHex}
                onChange={e => setColorHex(e.target.value)}
                className="h-9 w-12 border border-silver/20 bg-transparent cursor-pointer"
                style={{ padding: '2px' }}
              />
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="section-label block mb-2">Tamanho</label>
            <input
              type="text"
              className="input-editorial"
              placeholder="P, M, G, 38, Único..."
              value={size}
              onChange={e => setSize(e.target.value)}
              required
            />
          </div>

          {/* Note */}
          <div>
            <label className="section-label block mb-2">Nota <span className="text-silver/50 normal-case tracking-normal font-body text-[0.55rem] ml-1">opcional</span></label>
            <input
              type="text"
              className="input-editorial"
              placeholder="Usar por dentro, passar a frio..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-silver/20 text-silver py-3.5 text-[0.56rem] tracking-[0.2em] uppercase font-body hover:border-silver/40 hover:text-platinum transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-cerulean text-ivory py-3.5 text-[0.56rem] tracking-[0.2em] uppercase font-body hover:bg-cerulean-dark transition-colors duration-200"
            >
              {isEdit ? 'Salvar alterações' : 'Salvar peça'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 0.299 + g * 0.587 + b * 0.114) > 140
}
