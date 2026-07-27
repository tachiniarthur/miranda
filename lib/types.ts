// Tipos e rótulos alinhados ao backend (miranda-api).
// Os *valores* (value) são os enums do backend; os *rótulos* (label) são o
// texto exibido em português na interface.

export type Category =
  | 'blazer'
  | 'vestido'
  | 'calca'
  | 'camisa'
  | 'casaco'
  | 'malha'
  | 'saia'
  | 'calcado'
  | 'cachecol'
  | 'acessorio'
  | 'outros'

export type Formalidade = 'casual' | 'smart_casual' | 'social' | 'esporte'
export type PesoTermico = 'leve' | 'medio' | 'pesado'
export type Estacao = 'verao' | 'meia_estacao' | 'inverno'

// Peça de roupa como retornada pela API.
export interface ClothingItem {
  id: string
  user_id: string
  name: string
  category: Category
  image_path: string
  image_url: string
  cor_primaria: string | null
  cor_secundaria: string | null
  estampa: string | null
  formalidade: Formalidade | null
  peso_termico: PesoTermico | null
  serve_chuva: boolean | null
  estacoes: string[] | null
  created_at: string
  updated_at: string
}

// ── Análise de peça por IA (POST /api/wardrobe/items/analyze) ─────────
// Atributos sugeridos automaticamente. Campos que a IA não determinou com
// confiança vêm como null (o usuário preenche à mão, sem erro).
export interface AnalyzedAttributes {
  category: Category | null
  cor_primaria: string | null
  cor_secundaria: string | null
  estampa: string | null
  formalidade: Formalidade | null
  peso_termico: PesoTermico | null
  serve_chuva: boolean | null
  estacoes: Estacao[] | null
}

// Metadados por campo: de onde veio o valor e por que ficou nulo (útil para
// depuração/calibração; o formulário usa só `attributes`).
export interface AnalyzedFieldInfo {
  value: unknown
  source: string | null
  confidence: number | null
  reason: string | null
}

export interface AnalyzeResponse {
  attributes: AnalyzedAttributes
  fields: Record<string, AnalyzedFieldInfo>
}

// ── Look do dia (POST /api/looks/generate) ────────────────────────────
// Uma peça dentro de um look sugerido, com o papel e os dados de renderização.
export interface LookPiece {
  item_id: string
  role: string
  name: string
  category: Category
  image_url: string
  cor_primaria: string | null
}

export interface GeneratedLook {
  id: string
  label: string          // numeral romano: "I", "II", "III"
  items: LookPiece[]
  commentary: string
}

export interface GenerateLookResult {
  condicao_climatica: string
  temperatura_min: number
  temperatura_max: number
  looks: GeneratedLook[]
  note: string | null    // aviso quando o guarda-roupa está limitado
}

export interface Option<T extends string> {
  value: T
  label: string
}

// Categorias (sem 'tudo'), na ordem exibida.
export const CATEGORY_OPTIONS: Option<Category>[] = [
  { value: 'blazer', label: 'Blazers' },
  { value: 'vestido', label: 'Vestidos' },
  { value: 'calca', label: 'Calças' },
  { value: 'camisa', label: 'Camisas' },
  { value: 'casaco', label: 'Casacos' },
  { value: 'malha', label: 'Malhas' },
  { value: 'saia', label: 'Saias' },
  { value: 'calcado', label: 'Calçados' },
  { value: 'cachecol', label: 'Cachecóis' },
  { value: 'acessorio', label: 'Acessórios' },
  { value: 'outros', label: 'Outros' },
]

// Filtro da sidebar: inclui "Tudo".
export type FilterKey = Category | 'tudo'
export const CATEGORY_FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'tudo', label: 'Tudo' },
  ...CATEGORY_OPTIONS.map(o => ({ key: o.value, label: o.label })),
]

export const FORMALIDADE_OPTIONS: Option<Formalidade>[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'smart_casual', label: 'Smart casual' },
  { value: 'social', label: 'Social' },
  { value: 'esporte', label: 'Esporte' },
]

export const PESO_TERMICO_OPTIONS: Option<PesoTermico>[] = [
  { value: 'leve', label: 'Leve' },
  { value: 'medio', label: 'Médio' },
  { value: 'pesado', label: 'Pesado' },
]

export const ESTACAO_OPTIONS: Option<Estacao>[] = [
  { value: 'verao', label: 'Verão' },
  { value: 'meia_estacao', label: 'Meia-estação' },
  { value: 'inverno', label: 'Inverno' },
]

// Helpers de rótulo (value → label) para exibição.
export function labelFor<T extends string>(options: Option<T>[], value: T | null): string {
  if (value == null) return '—'
  return options.find(o => o.value === value)?.label ?? value
}

export const categoryLabel = (v: Category) => labelFor(CATEGORY_OPTIONS, v)
