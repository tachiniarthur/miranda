'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { ClothingCard } from '@/components/ClothingCard'
import { AddItemModal } from '@/components/AddItemModal'
import { ItemDetailDrawer } from '@/components/ItemDetailDrawer'
import { MOCK_ITEMS, CATEGORIES, type WardrobeItem, type Category } from '@/lib/mockData'

type FilterKey = Category | 'tudo'

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>(MOCK_ITEMS)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('tudo')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null)
  const [viewingItem, setViewingItem] = useState<WardrobeItem | null>(null)

  const filtered = useMemo(() =>
    activeFilter === 'tudo' ? items : items.filter(i => i.category === activeFilter),
    [items, activeFilter]
  )

  function handleSave(data: Omit<WardrobeItem, 'id'> & { id?: string }) {
    if (data.id) {
      setItems(prev => prev.map(i => i.id === data.id ? { ...data, id: data.id! } : i))
    } else {
      const newItem: WardrobeItem = { ...data, id: String(Date.now()) }
      setItems(prev => [newItem, ...prev])
    }
    setModalOpen(false)
    setEditingItem(null)
  }

  function handleDelete(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function openEdit(item: WardrobeItem) {
    setViewingItem(null)
    setEditingItem(item)
    setModalOpen(true)
  }

  const totalByCategory = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.key] = cat.key === 'tudo' ? items.length : items.filter(i => i.category === cat.key).length
      return acc
    }, {} as Record<string, number>)
  }, [items])

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />

      <div className="max-w-screen-xl mx-auto px-8 md:px-12">
        {/* Page header */}
        <div
          className="pt-14 pb-10 border-b animate-fade-in-up opacity-0"
          style={{ borderColor: 'rgba(200,200,200,0.07)', animationFillMode: 'forwards' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="section-label text-silver/50 mb-3">— IV —</p>
              <h1
                className="font-display text-ivory"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontStyle: 'italic', lineHeight: '1.05' }}
              >
                Coleção Pessoal
              </h1>
              <p className="font-body text-silver/60 text-[0.7rem] mt-2">
                {items.length} {items.length === 1 ? 'peça' : 'peças'} catalogadas
              </p>
            </div>

            <button
              onClick={() => { setEditingItem(null); setModalOpen(true) }}
              className="btn-cerulean self-start sm:self-auto"
            >
              <Plus size={12} strokeWidth={1.5} />
              Nova peça
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div
          className="py-6 overflow-x-auto no-scrollbar animate-fade-in opacity-0"
          style={{ animationDelay: '120ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-7 min-w-max">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key as FilterKey)}
                className={`category-pill ${activeFilter === cat.key ? 'active' : ''}`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {cat.label}
                {totalByCategory[cat.key] > 0 && (
                  <span className="ml-1.5 text-[0.42rem] opacity-40">
                    {totalByCategory[cat.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Hairline */}
        <hr className="hairline mb-10" />

        {/* Grid or empty state */}
        {filtered.length === 0 ? (
          <EmptyState
            hasItems={items.length > 0}
            onAdd={() => { setEditingItem(null); setModalOpen(true) }}
          />
        ) : (
          <>
            <style>{`
              .wardrobe-grid { columns: 2; column-gap: 1.25rem; }
              @media (min-width: 640px)  { .wardrobe-grid { columns: 3; } }
              @media (min-width: 900px)  { .wardrobe-grid { columns: 4; } }
              @media (min-width: 1200px) { .wardrobe-grid { columns: 5; } }
            `}</style>
            <div
              className="wardrobe-grid animate-fade-in opacity-0"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              {filtered.map((item, i) => (
                <ClothingCard
                  key={item.id}
                  item={item}
                  index={i}
                  onView={setViewingItem}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

        {/* Bottom padding */}
        <div className="h-20" />
      </div>

      {/* Modals */}
      {modalOpen && (
        <AddItemModal
          item={editingItem}
          onClose={() => { setModalOpen(false); setEditingItem(null) }}
          onSave={handleSave}
        />
      )}

      {viewingItem && (
        <ItemDetailDrawer
          item={viewingItem}
          onClose={() => setViewingItem(null)}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

function EmptyState({ hasItems, onAdd }: { hasItems: boolean; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
      <div className="w-16 h-px bg-silver/20 mb-12" />
      <p
        className="font-display text-ivory/50 text-center mb-4"
        style={{ fontSize: '1.4rem', fontStyle: 'italic' }}
      >
        {hasItems ? 'Nenhuma peça nesta categoria.' : 'O guarda-roupa ainda espera.'}
      </p>
      <p className="font-body text-silver/40 text-[0.72rem] text-center mb-10 max-w-xs leading-relaxed">
        {hasItems
          ? 'Experimente outro filtro ou adicione uma nova peça.'
          : 'Catalogue suas peças e deixe que eu cuide do resto.'}
      </p>
      <button onClick={onAdd} className="btn-cerulean">
        <Plus size={11} strokeWidth={1.5} />
        Adicionar primeira peça
      </button>
      <div className="w-16 h-px bg-silver/20 mt-12" />
    </div>
  )
}
