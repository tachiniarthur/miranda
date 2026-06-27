'use client'

import { useState } from 'react'
import { Sun, Cloud, CloudRain, Wind, Snowflake, ChevronRight, type LucideIcon } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { LOOKS_BY_CONDITION, type WeatherCondition, type LookSuggestion, type WardrobeItem } from '@/lib/mockData'

const WEATHER_OPTIONS: {
  key: WeatherCondition
  label: string
  Icon: LucideIcon
}[] = [
  { key: 'sol', label: 'Sol', Icon: Sun },
  { key: 'nublado', label: 'Nublado', Icon: Cloud },
  { key: 'chuva', label: 'Chuva', Icon: CloudRain },
  { key: 'vento', label: 'Vento', Icon: Wind },
  { key: 'frio', label: 'Frio', Icon: Snowflake },
]

export default function LookPage() {
  const [minTemp, setMinTemp] = useState(16)
  const [maxTemp, setMaxTemp] = useState(24)
  const [condition, setCondition] = useState<WeatherCondition>('sol')
  const [loading, setLoading] = useState(false)
  const [looks, setLooks] = useState<LookSuggestion[] | null>(null)

  function generateLook(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setLooks(null)
    setTimeout(() => {
      setLooks(LOOKS_BY_CONDITION[condition])
      setLoading(false)
    }, 1600)
  }

  function resetLook() {
    setLooks(null)
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
          <p className="section-label text-silver/50 mb-3">— V —</p>
          <h1
            className="font-display text-ivory"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontStyle: 'italic', lineHeight: '1.05' }}
          >
            Look do Dia
          </h1>
          <p className="font-body text-silver/50 text-[0.7rem] mt-2">
            Informe as condições e deixe o julgamento com Miranda.
          </p>
        </div>

        {/* Content */}
        {!looks && !loading && (
          <InputPanel
            minTemp={minTemp}
            maxTemp={maxTemp}
            condition={condition}
            onMinTemp={setMinTemp}
            onMaxTemp={setMaxTemp}
            onCondition={setCondition}
            onSubmit={generateLook}
          />
        )}

        {loading && <LoadingState />}

        {looks && !loading && (
          <LookResult looks={looks} condition={condition} minTemp={minTemp} maxTemp={maxTemp} onReset={resetLook} />
        )}

        <div className="h-20" />
      </div>
    </div>
  )
}

/* ── Input panel ─────────────────────────────────────────────── */

function InputPanel({
  minTemp, maxTemp, condition,
  onMinTemp, onMaxTemp, onCondition, onSubmit,
}: {
  minTemp: number; maxTemp: number; condition: WeatherCondition
  onMinTemp: (v: number) => void; onMaxTemp: (v: number) => void
  onCondition: (v: WeatherCondition) => void; onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="pt-14 pb-6 max-w-md animate-fade-in-up opacity-0"
      style={{ animationDelay: '140ms', animationFillMode: 'forwards' }}
    >
      {/* Temperature */}
      <div className="mb-12">
        <p className="section-label mb-6">Temperatura</p>
        <div className="flex items-end gap-8">
          <div className="flex-1">
            <label className="section-label text-[0.48rem] text-silver/60 block mb-2">Mínima</label>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={minTemp}
                onChange={e => onMinTemp(Number(e.target.value))}
                className="input-editorial text-[1.6rem] font-display font-light w-20"
                style={{ fontStyle: 'italic' }}
                min={-10}
                max={maxTemp - 1}
              />
              <span className="text-silver/50 text-[0.65rem] font-body">°C</span>
            </div>
          </div>

          <div className="flex-shrink-0 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-px" style={{ background: `rgba(200,200,200,${0.08 + i * 0.04})` }} />
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="section-label text-[0.48rem] text-silver/60 block mb-2">Máxima</label>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={maxTemp}
                onChange={e => onMaxTemp(Number(e.target.value))}
                className="input-editorial text-[1.6rem] font-display font-light w-20"
                style={{ fontStyle: 'italic' }}
                min={minTemp + 1}
                max={50}
              />
              <span className="text-silver/50 text-[0.65rem] font-body">°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <hr className="hairline mb-12" />

      {/* Condition */}
      <div className="mb-14">
        <p className="section-label mb-6">Condição</p>
        <div className="flex items-start gap-6 flex-wrap">
          {WEATHER_OPTIONS.map(({ key, label, Icon }) => {
            const active = condition === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => onCondition(key)}
                className={`flex flex-col items-center gap-2.5 transition-all duration-200 ${
                  active ? 'text-ivory' : 'text-silver/40 hover:text-silver/70'
                }`}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center border transition-colors duration-200"
                  style={{
                    borderColor: active ? 'rgba(59,114,181,0.7)' : 'rgba(155,155,155,0.15)',
                    background: active ? 'rgba(59,114,181,0.08)' : 'transparent',
                  }}
                >
                  <Icon size={16} strokeWidth={1.25} />
                </div>
                <span className="section-label text-[0.45rem]">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="inline-flex items-center gap-3 bg-cerulean text-ivory px-8 py-4 text-[0.58rem] tracking-[0.22em] uppercase font-body hover:bg-cerulean-dark transition-colors duration-300"
      >
        Gerar look
        <ChevronRight size={12} strokeWidth={1.5} />
      </button>
    </form>
  )
}

/* ── Loading state ────────────────────────────────────────────── */

function LoadingState() {
  return (
    <div className="flex flex-col items-start pt-24 pb-6 animate-fade-in">
      <div className="space-y-3 mb-8">
        <p
          className="font-display text-ivory/60"
          style={{ fontSize: '1.3rem', fontStyle: 'italic' }}
        >
          Avaliando o guarda-roupa.
        </p>
        <p className="section-label text-silver/30">Um momento.</p>
      </div>
      <div className="relative w-48 h-px bg-silver/10 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full w-1/3 bg-cerulean"
          style={{
            animation: 'loadingBar 1.6s cubic-bezier(0.4,0,0.2,1) infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(450%); }
        }
      `}</style>
    </div>
  )
}

/* ── Look result ─────────────────────────────────────────────── */

function LookResult({
  looks, condition, minTemp, maxTemp, onReset,
}: {
  looks: LookSuggestion[]; condition: WeatherCondition
  minTemp: number; maxTemp: number; onReset: () => void
}) {
  const conditionLabel = WEATHER_OPTIONS.find(w => w.key === condition)?.label ?? ''

  return (
    <div className="pt-14 animate-fade-in">
      {/* Result header */}
      <div
        className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 pb-8 border-b mb-12 animate-fade-in-up opacity-0"
        style={{ borderColor: 'rgba(200,200,200,0.07)', animationFillMode: 'forwards' }}
      >
        <div>
          <h2
            className="font-display text-ivory"
            style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontStyle: 'italic' }}
          >
            Look sugerido
          </h2>
          <p className="section-label text-silver/50 mt-1">
            {conditionLabel} · {minTemp}°–{maxTemp}°
          </p>
        </div>
        <button
          onClick={onReset}
          className="section-label text-[0.49rem] text-silver/50 hover:text-ivory transition-colors border-b border-transparent hover:border-silver/30 pb-0.5 self-start sm:self-auto"
        >
          Novo look
        </button>
      </div>

      {/* Look options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {looks.map((look, i) => (
          <LookCard key={look.id} look={look} index={i} />
        ))}
      </div>
    </div>
  )
}

function LookCard({ look, index }: { look: LookSuggestion; index: number }) {
  return (
    <div
      className="animate-fade-in-up opacity-0"
      style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'forwards' }}
    >
      {/* Look label */}
      <div className="flex items-center gap-4 mb-7">
        <span className="section-label text-silver/40">Opção</span>
        <span
          className="font-display text-silver/60"
          style={{ fontSize: '1rem', fontStyle: 'italic' }}
        >
          {look.label}
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(200,200,200,0.07)' }} />
      </div>

      {/* Item swatches */}
      <div className="flex items-stretch gap-3 mb-8">
        {look.items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3">
            <ItemSwatch item={item} />
            {i < look.items.length - 1 && (
              <div className="flex-shrink-0 w-px self-stretch" style={{ background: 'rgba(200,200,200,0.1)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Commentary */}
      <blockquote className="border-l-2 pl-5" style={{ borderColor: 'rgba(59,114,181,0.4)' }}>
        <p
          className="font-display text-ivory/70 leading-snug"
          style={{ fontSize: '0.9rem', fontStyle: 'italic' }}
        >
          {look.commentary}
        </p>
      </blockquote>
    </div>
  )
}

function ItemSwatch({ item }: { item: WardrobeItem }) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div
        className="w-14 transition-transform duration-200 group-hover:-translate-y-0.5"
        style={{ aspectRatio: item.aspectRatio, backgroundColor: item.colorHex }}
      />
      <span className="section-label text-[0.42rem] text-center max-w-[56px] leading-tight text-silver/50">
        {item.category}
      </span>
    </div>
  )
}
