'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { AuthGuard } from '@/components/AuthGuard'
import { ClothingCard } from '@/components/ClothingCard'
import { AddItemModal } from '@/components/AddItemModal'
import { ItemDetailDrawer } from '@/components/ItemDetailDrawer'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { CATEGORY_FILTERS, type ClothingItem, type FilterKey } from '@/lib/types'
import { listItems, deleteItem, ApiError } from '@/lib/api'
import { preloadBackgroundRemoval } from '@/lib/backgroundRemoval'

export default function WardrobePage() {
  return (
    <AuthGuard>
      <WardrobeContent />
    </AuthGuard>
  )
}

function WardrobeContent() {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterKey>('tudo')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null)
  const [viewingItem, setViewingItem] = useState<ClothingItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<ClothingItem | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  // Busca as peças do backend, aplicando o filtro de categoria via query param.
  const load = useCallback(async (filter: FilterKey) => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await listItems(filter)
      setItems(data)
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Não foi possível carregar as peças.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(activeFilter) }, [activeFilter, load])

  // Pré-carrega o modelo de remoção de fundo em background assim que a tela do
  // guarda-roupa abre, para que a primeira imagem escolhida já ache o modelo
  // pronto. Silencioso: qualquer falha é ignorada (o processamento sob demanda
  // ainda funciona). Roda uma vez.
  useEffect(() => {
    preloadBackgroundRemoval().catch(() => {})
  }, [])

  function handleSaved(saved: ClothingItem) {
    setItems(prev => {
      const exists = prev.some(i => i.id === saved.id)
      const next = exists ? prev.map(i => (i.id === saved.id ? saved : i)) : [saved, ...prev]
      // Respeita o filtro ativo: se a peça salva não pertence à categoria atual, remove da lista visível.
      if (activeFilter !== 'tudo' && saved.category !== activeFilter) {
        return next.filter(i => i.id !== saved.id)
      }
      return next
    })
    setModalOpen(false)
    setEditingItem(null)
  }

  async function confirmDelete() {
    if (!deletingItem) return
    setDeleteBusy(true)
    try {
      await deleteItem(deletingItem.id)
      setItems(prev => prev.filter(i => i.id !== deletingItem.id))
      setDeletingItem(null)
    } catch {
      // Mantém o diálogo aberto e sinaliza; simples para esta fase.
      setDeletingItem(null)
    } finally {
      setDeleteBusy(false)
    }
  }

  function openEdit(item: ClothingItem) {
    setViewingItem(null)
    setEditingItem(item)
    setModalOpen(true)
  }

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
              <h1 className="font-display text-ivory" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontStyle: 'italic', lineHeight: '1.05' }}>
                Coleção Pessoal
              </h1>
              <p className="font-body text-silver/60 text-[0.7rem] mt-2">
                {loading ? 'Carregando…' : `${items.length} ${items.length === 1 ? 'peça' : 'peças'} ${activeFilter === 'tudo' ? 'catalogadas' : 'nesta categoria'}`}
              </p>
            </div>

            <button onClick={() => { setEditingItem(null); setModalOpen(true) }} className="btn-cerulean self-start sm:self-auto">
              <Plus size={12} strokeWidth={1.5} />
              Nova peça
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="py-6 overflow-x-auto no-scrollbar animate-fade-in opacity-0" style={{ animationDelay: '120ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-7 min-w-max">
            {CATEGORY_FILTERS.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`category-pill ${activeFilter === cat.key ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <hr className="hairline mb-10" />

        {/* States */}
        {loadError ? (
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
            <p className="font-display text-ivory/50 text-center mb-4" style={{ fontSize: '1.3rem', fontStyle: 'italic' }}>
              {loadError}
            </p>
            <button onClick={() => load(activeFilter)} className="btn-cerulean mt-2">Tentar novamente</button>
          </div>
        ) : loading ? (
          <LoadingGrid />
        ) : items.length === 0 ? (
          <EmptyState
            hasFilter={activeFilter !== 'tudo'}
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
            <div className="wardrobe-grid animate-fade-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              {items.map((item, i) => (
                <ClothingCard
                  key={item.id}
                  item={item}
                  index={i}
                  onView={setViewingItem}
                  onEdit={openEdit}
                  onDelete={setDeletingItem}
                />
              ))}
            </div>
          </>
        )}

        <div className="h-20" />
      </div>

      {/* Modals */}
      {modalOpen && (
        <AddItemModal
          item={editingItem}
          onClose={() => { setModalOpen(false); setEditingItem(null) }}
          onSaved={handleSaved}
        />
      )}

      {viewingItem && (
        <ItemDetailDrawer
          item={viewingItem}
          onClose={() => setViewingItem(null)}
          onEdit={openEdit}
          onDelete={setDeletingItem}
        />
      )}

      {deletingItem && (
        <ConfirmDialog
          title="Excluir peça"
          message={`Tem certeza que deseja excluir “${deletingItem.name}”? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          busy={deleteBusy}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingItem(null)}
        />
      )}
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="wardrobe-grid animate-fade-in" style={{ columns: 2, columnGap: '1.25rem' }}>
      <style>{`
        .wardrobe-grid { columns: 2; column-gap: 1.25rem; }
        @media (min-width: 640px)  { .wardrobe-grid { columns: 3; } }
        @media (min-width: 900px)  { .wardrobe-grid { columns: 4; } }
        @media (min-width: 1200px) { .wardrobe-grid { columns: 5; } }
      `}</style>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="break-inside-avoid mb-5">
          <div className="bg-charcoal animate-pulse" style={{ aspectRatio: '3/4' }} />
          <div className="pt-2.5 space-y-1.5">
            <div className="h-1.5 w-10 bg-charcoal animate-pulse" />
            <div className="h-2 w-20 bg-charcoal animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ hasFilter, onAdd }: { hasFilter: boolean; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
      <div className="w-16 h-px bg-silver/20 mb-12" />
      <p className="font-display text-ivory/50 text-center mb-4" style={{ fontSize: '1.4rem', fontStyle: 'italic' }}>
        {hasFilter ? 'Nenhuma peça nesta categoria.' : 'O guarda-roupa ainda espera.'}
      </p>
      <p className="font-body text-silver/40 text-[0.72rem] text-center mb-10 max-w-xs leading-relaxed">
        {hasFilter ? 'Experimente outro filtro ou adicione uma nova peça.' : 'Catalogue suas peças e deixe que eu cuide do resto.'}
      </p>
      <button onClick={onAdd} className="btn-cerulean">
        <Plus size={11} strokeWidth={1.5} />
        Adicionar primeira peça
      </button>
      <div className="w-16 h-px bg-silver/20 mt-12" />
    </div>
  )
}
