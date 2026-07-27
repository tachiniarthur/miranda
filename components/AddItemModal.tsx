'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Upload, Check, Loader2, Sparkles } from 'lucide-react'
import {
  type ClothingItem,
  type Category,
  type Formalidade,
  type PesoTermico,
  type Estacao,
  type AnalyzedAttributes,
  CATEGORY_OPTIONS,
  FORMALIDADE_OPTIONS,
  PESO_TERMICO_OPTIONS,
  ESTACAO_OPTIONS,
} from '@/lib/types'
import { createItem, updateItem, analyzeItem, ApiError } from '@/lib/api'
import { processImage } from '@/lib/backgroundRemoval'

interface AddItemModalProps {
  item?: ClothingItem | null
  onClose: () => void
  onSaved: (item: ClothingItem) => void
}

export function AddItemModal({ item, onClose, onSaved }: AddItemModalProps) {
  const isEdit = !!item

  const [category, setCategory] = useState<Category>(item?.category ?? 'blazer')
  const [name, setName] = useState(item?.name ?? '')
  const [corPrimaria, setCorPrimaria] = useState(item?.cor_primaria ?? '')
  const [corSecundaria, setCorSecundaria] = useState(item?.cor_secundaria ?? '')
  const [estampa, setEstampa] = useState(item?.estampa ?? '')
  const [formalidade, setFormalidade] = useState<Formalidade | null>(item?.formalidade ?? null)
  const [pesoTermico, setPesoTermico] = useState<PesoTermico | null>(item?.peso_termico ?? null)
  const [serveChuva, setServeChuva] = useState<boolean>(item?.serve_chuva ?? false)
  const [estacoes, setEstacoes] = useState<Estacao[]>(
    (item?.estacoes as Estacao[] | undefined) ?? [],
  )

  // Imagem: blob processado (fundo removido) pronto para envio + preview.
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(item?.image_url ?? '')
  const [processing, setProcessing] = useState(false)
  // Progresso real (0..1) da remoção de fundo, exposto pela biblioteca.
  const [progress, setProgress] = useState(0)
  const [dropActive, setDropActive] = useState(false)

  // Análise por IA (só ao adicionar): estado de carregamento, aviso de
  // "não é roupa" e sinalização de que a Miranda preencheu campos.
  const [analyzing, setAnalyzing] = useState(false)
  const [notClothing, setNotClothing] = useState('')
  const [analyzed, setAnalyzed] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Object URLs criados localmente, para revogar e evitar vazamento de memória.
  const objectUrlRef = useRef<string | null>(null)
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  // Preenche os campos do formulário com o que a IA determinou. Campos nulos
  // são ignorados (permanecem como estão, para preenchimento manual).
  function applyAnalysis(a: AnalyzedAttributes) {
    let filledAny = false
    if (a.category) { setCategory(a.category); filledAny = true }
    if (a.cor_primaria) { setCorPrimaria(a.cor_primaria); filledAny = true }
    if (a.cor_secundaria) { setCorSecundaria(a.cor_secundaria); filledAny = true }
    if (a.estampa) { setEstampa(a.estampa); filledAny = true }
    if (a.formalidade) { setFormalidade(a.formalidade); filledAny = true }
    if (a.peso_termico) { setPesoTermico(a.peso_termico); filledAny = true }
    if (a.serve_chuva != null) { setServeChuva(a.serve_chuva); filledAny = true }
    if (a.estacoes && a.estacoes.length) { setEstacoes(a.estacoes); filledAny = true }
    setAnalyzed(filledAny)
  }

  async function handleFile(file: File) {
    setError('')
    setNotClothing('')
    setAnalyzed(false)
    setProgress(0)
    setProcessing(true)

    let blob: Blob
    try {
      // Remoção de fundo no navegador (@imgly/background-removal), com progresso
      // real. Medimos o tempo total em dev para comparar antes/depois das
      // otimizações (visível no console do navegador).
      const started = performance.now()
      blob = await processImage(file, setProgress)
      const elapsedMs = Math.round(performance.now() - started)
      // eslint-disable-next-line no-console
      console.info(`[Miranda] Remoção de fundo: ${elapsedMs} ms`)
    } catch {
      setError('Não foi possível processar a imagem. Tente outra foto.')
      setProcessing(false)
      return
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(blob)
    objectUrlRef.current = url
    setProcessedBlob(blob)
    setPreviewUrl(url)
    setProcessing(false)

    // Análise automática apenas ao ADICIONAR — não sobrescreve uma edição.
    if (isEdit) return

    setAnalyzing(true)
    try {
      const res = await analyzeItem(blob)
      applyAnalysis(res.attributes)
    } catch (err) {
      if (err instanceof ApiError && err.code === 'not_clothing') {
        // Imagem que não é roupa: descarta e pede outra, com discrição.
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current)
          objectUrlRef.current = null
        }
        setProcessedBlob(null)
        setPreviewUrl('')
        setNotClothing('Essa imagem não parece ser uma peça de roupa. Escolha outra foto.')
      }
      // Outros erros (rede, modelo indisponível): degradação graciosa — o
      // formulário manual continua funcionando normalmente, sem alarde.
    } finally {
      setAnalyzing(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDropActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function toggleEstacao(value: Estacao) {
    setEstacoes(prev =>
      prev.includes(value) ? prev.filter(e => e !== value) : [...prev, value],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim()) { setError('Informe o nome da peça.'); return }
    if (!isEdit && !processedBlob) { setError('Envie uma imagem da peça.'); return }

    const fd = new FormData()
    fd.append('name', name.trim())
    fd.append('category', category)
    if (corPrimaria.trim()) fd.append('cor_primaria', corPrimaria.trim())
    if (corSecundaria.trim()) fd.append('cor_secundaria', corSecundaria.trim())
    if (estampa.trim()) fd.append('estampa', estampa.trim())
    if (formalidade) fd.append('formalidade', formalidade)
    if (pesoTermico) fd.append('peso_termico', pesoTermico)
    fd.append('serve_chuva', serveChuva ? 'true' : 'false')
    estacoes.forEach(estacao => fd.append('estacoes', estacao))
    if (processedBlob) fd.append('image', processedBlob, 'item.png')

    setSaving(true)
    try {
      const saved = isEdit
        ? await updateItem(item!.id, fd)
        : await createItem(fd)
      onSaved(saved)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar a peça.')
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,10,0.85)' }}
      onClick={e => { if (e.target === e.currentTarget && !saving) onClose() }}
    >
      <div
        className="w-full max-w-md bg-charcoal border animate-fade-in max-h-[92vh] overflow-y-auto no-scrollbar"
        style={{ borderColor: 'rgba(200,200,200,0.08)' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-charcoal z-10 flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: 'rgba(200,200,200,0.08)' }}>
          <span className="section-label">{isEdit ? 'Editar Peça' : 'Nova Peça'}</span>
          <button onClick={onClose} className="text-silver hover:text-ivory transition-colors" disabled={saving}>
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-7 space-y-7">
          {/* Dropzone / preview */}
          <div>
            <div
              className={`relative border transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer select-none overflow-hidden ${
                previewUrl
                  ? 'bg-midnight border-cerulean/30'
                  : dropActive
                  ? 'bg-ivory/3 border-ivory/20'
                  : 'border-dashed border-silver/25 hover:border-silver/40'
              }`}
              style={{ minHeight: '180px' }}
              onDragOver={e => { e.preventDefault(); setDropActive(true) }}
              onDragLeave={() => setDropActive(false)}
              onDrop={handleDrop}
              onClick={() => !processing && !analyzing && document.getElementById('file-input')?.click()}
            >
              <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />

              {processing ? (
                <div className="flex flex-col items-center gap-3 w-full px-10">
                  <Loader2 size={18} strokeWidth={1.5} className="text-cerulean animate-spin" />
                  <p className="section-label text-cerulean text-[0.5rem]">Removendo o fundo</p>
                  {/* Barra de progresso real, alimentada pelos eventos da biblioteca. */}
                  <div className="relative w-full max-w-[180px] h-px bg-silver/15 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-cerulean transition-all duration-200 ease-out"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                  <p className="text-silver/40 text-[0.56rem] font-body italic tabular-nums">
                    {progress > 0 ? `${Math.round(progress * 100)}%` : 'preparando o modelo'}
                  </p>
                </div>
              ) : previewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Prévia" className="w-full h-[180px] object-contain p-3" />
                  {analyzing ? (
                    // Estado "Miranda avaliando a peça" — elegante, sobre o preview.
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-midnight/85 backdrop-blur-[1px] animate-fade-in">
                      <Sparkles size={16} strokeWidth={1.25} className="text-cerulean animate-pulse" />
                      <p className="font-display text-ivory/90 italic text-[0.95rem]">Miranda avalia a peça</p>
                      <p className="text-silver/50 text-[0.56rem] font-body italic">um instante enquanto observo os detalhes</p>
                    </div>
                  ) : (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-midnight/70 px-2 py-1">
                      <Check size={10} strokeWidth={1.5} className="text-cerulean" />
                      <span className="section-label text-cerulean text-[0.42rem]">Trocar</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Upload size={16} strokeWidth={1.25} className="text-silver/50" />
                  <p className="section-label text-[0.5rem]">Solte a imagem aqui</p>
                  <p className="text-silver/40 text-[0.58rem] font-body">ou clique para selecionar</p>
                </>
              )}
            </div>

            {/* Aviso discreto: imagem não é roupa */}
            {notClothing && (
              <p className="mt-3 text-[0.62rem] font-body text-amber-300/80 italic animate-fade-in">
                {notClothing}
              </p>
            )}

            {/* Sinaliza que a Miranda preencheu campos (revisáveis) */}
            {analyzed && !analyzing && (
              <p className="mt-3 flex items-center gap-1.5 text-[0.58rem] font-body text-cerulean/80 italic animate-fade-in">
                <Sparkles size={11} strokeWidth={1.5} />
                Preenchi o que reconheci — revise à vontade.
              </p>
            )}
          </div>

          {/* Category */}
          <Group label="Categoria">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {CATEGORY_OPTIONS.map(cat => (
                <UnderlineOption
                  key={cat.value}
                  active={category === cat.value}
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </UnderlineOption>
              ))}
            </div>
          </Group>

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

          {/* Cores */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="section-label block mb-2">Cor primária</label>
              <input type="text" className="input-editorial" placeholder="Preto" value={corPrimaria} onChange={e => setCorPrimaria(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="section-label block mb-2">
                Cor secundária <span className="text-silver/50 normal-case tracking-normal font-body text-[0.55rem] ml-1">opcional</span>
              </label>
              <input type="text" className="input-editorial" placeholder="—" value={corSecundaria} onChange={e => setCorSecundaria(e.target.value)} />
            </div>
          </div>

          {/* Estampa */}
          <div>
            <label className="section-label block mb-2">
              Estampa <span className="text-silver/50 normal-case tracking-normal font-body text-[0.55rem] ml-1">opcional</span>
            </label>
            <input type="text" className="input-editorial" placeholder="Liso, listrado, floral..." value={estampa} onChange={e => setEstampa(e.target.value)} />
          </div>

          {/* Formalidade */}
          <Group label="Formalidade">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {FORMALIDADE_OPTIONS.map(opt => (
                <UnderlineOption
                  key={opt.value}
                  active={formalidade === opt.value}
                  onClick={() => setFormalidade(f => (f === opt.value ? null : opt.value))}
                >
                  {opt.label}
                </UnderlineOption>
              ))}
            </div>
          </Group>

          {/* Peso térmico */}
          <Group label="Peso térmico">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {PESO_TERMICO_OPTIONS.map(opt => (
                <UnderlineOption
                  key={opt.value}
                  active={pesoTermico === opt.value}
                  onClick={() => setPesoTermico(p => (p === opt.value ? null : opt.value))}
                >
                  {opt.label}
                </UnderlineOption>
              ))}
            </div>
          </Group>

          {/* Estações (multi) */}
          <Group label="Estações">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {ESTACAO_OPTIONS.map(opt => (
                <UnderlineOption
                  key={opt.value}
                  active={estacoes.includes(opt.value)}
                  onClick={() => toggleEstacao(opt.value)}
                >
                  {opt.label}
                </UnderlineOption>
              ))}
            </div>
          </Group>

          {/* Serve chuva */}
          <Group label="Serve para chuva">
            <div className="flex gap-4">
              <UnderlineOption active={serveChuva} onClick={() => setServeChuva(true)}>Sim</UnderlineOption>
              <UnderlineOption active={!serveChuva} onClick={() => setServeChuva(false)}>Não</UnderlineOption>
            </div>
          </Group>

          {error && <p className="text-[0.68rem] font-body text-red-400/90 animate-fade-in">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-silver/20 text-silver py-3.5 text-[0.56rem] tracking-[0.2em] uppercase font-body hover:border-silver/40 hover:text-platinum transition-colors duration-200 disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || processing || analyzing}
              className="flex-1 bg-cerulean text-ivory py-3.5 text-[0.56rem] tracking-[0.2em] uppercase font-body hover:bg-cerulean-dark transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />}
              {saving ? 'Salvando' : isEdit ? 'Salvar alterações' : 'Salvar peça'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="section-label mb-3">{label}</p>
      {children}
    </div>
  )
}

function UnderlineOption({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[0.52rem] tracking-[0.2em] uppercase font-body pb-0.5 transition-colors duration-150 ${
        active
          ? 'text-ivory border-b border-cerulean'
          : 'text-silver hover:text-platinum border-b border-transparent'
      }`}
    >
      {children}
    </button>
  )
}
