// ─────────────────────────────────────────────────────────────────────
// Cliente HTTP do frontend para a API do Miranda (FastAPI).
//
// Armazenamento do token JWT:
//   Nesta fase de desenvolvimento local, o token é guardado em localStorage,
//   por simplicidade. NOTA DE SEGURANÇA: antes de ir para produção, o ideal é
//   guardar o token em um cookie httpOnly (inacessível ao JavaScript, imune a
//   XSS), gerenciado por uma API route do Next.js. localStorage é vulnerável a
//   ataques XSS e é usado aqui apenas por conveniência no ambiente local.
// ─────────────────────────────────────────────────────────────────────

import type { ClothingItem, Category, AnalyzeResponse, GenerateLookResult } from './types'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
const TOKEN_KEY = 'miranda_token'

// ── Token (localStorage) ──────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

// ── Erro tipado ───────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// Extrai uma mensagem legível do corpo de erro do FastAPI, que pode ser:
//   { detail: "texto" }
//   { detail: { code, message } }
//   { detail: [ {msg, ...}, ... ] }  (erros de validação 422)
function parseErrorDetail(body: any): { message: string; code?: string } {
  const detail = body?.detail
  if (typeof detail === 'string') return { message: detail }
  if (Array.isArray(detail)) {
    const first = detail[0]
    return { message: first?.msg ?? 'Dados inválidos.' }
  }
  if (detail && typeof detail === 'object') {
    return { message: detail.message ?? 'Erro inesperado.', code: detail.code }
  }
  return { message: 'Erro inesperado.' }
}

interface RequestOptions {
  method?: string
  body?: unknown          // objeto JSON ou FormData
  auth?: boolean          // anexa o header Authorization
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false } = options
  const headers: Record<string, string> = {}
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData

  let payload: BodyInit | undefined
  if (body !== undefined) {
    if (isForm) {
      payload = body as FormData // o browser define o Content-Type com boundary
    } else {
      headers['Content-Type'] = 'application/json'
      payload = JSON.stringify(body)
    }
  }

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: payload })
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique se o backend está no ar.',
      0,
    )
  }

  // 204 No Content
  if (res.status === 204) return undefined as T

  let data: any = null
  const text = await res.text()
  if (text) {
    try { data = JSON.parse(text) } catch { data = text }
  }

  if (!res.ok) {
    // Sessão expirada/ inválida: limpa o token para forçar novo login.
    if (res.status === 401) clearToken()
    const { message, code } = parseErrorDetail(data)
    throw new ApiError(message, res.status, code)
  }

  return data as T
}

// ── Autenticação ──────────────────────────────────────────────────────

interface TokenResponse { access_token: string; token_type: string }

export async function register(input: { name: string; email: string; password: string }) {
  const data = await request<TokenResponse>('/api/auth/register', { method: 'POST', body: input })
  setToken(data.access_token)
  return data
}

export async function login(input: { email: string; password: string }) {
  const data = await request<TokenResponse>('/api/auth/login', { method: 'POST', body: input })
  setToken(data.access_token)
  return data
}

export async function forgotPassword(email: string) {
  // Retorna { message, reset_token }. O reset_token só existe porque o envio de
  // e-mail ainda não foi implementado no backend (ver comentário na API).
  return request<{ message: string; reset_token: string | null }>(
    '/api/auth/forgot-password',
    { method: 'POST', body: { email } },
  )
}

export async function resetPassword(token: string, newPassword: string) {
  return request<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: { token, new_password: newPassword },
  })
}

export async function fetchMe() {
  return request<{ id: string; name: string; email: string }>('/api/auth/me', { auth: true })
}

export function logout(): void {
  clearToken()
}

// ── Guarda-roupa ──────────────────────────────────────────────────────

export async function listItems(category?: Category | 'tudo') {
  const query = category && category !== 'tudo' ? `?category=${encodeURIComponent(category)}` : ''
  return request<ClothingItem[]>(`/api/wardrobe/items${query}`, { auth: true })
}

export async function getItem(id: string) {
  return request<ClothingItem>(`/api/wardrobe/items/${id}`, { auth: true })
}

export async function createItem(form: FormData) {
  return request<ClothingItem>('/api/wardrobe/items', { method: 'POST', body: form, auth: true })
}

// Análise self-hosted da peça (fundo já removido). Devolve atributos sugeridos.
// Em caso de imagem que não é roupa, o backend responde 422 com code
// "not_clothing" — o chamador trata esse ApiError.
export async function analyzeItem(image: Blob) {
  const form = new FormData()
  form.append('image', image, 'item.png')
  return request<AnalyzeResponse>('/api/wardrobe/items/analyze', {
    method: 'POST',
    body: form,
    auth: true,
  })
}

export async function updateItem(id: string, form: FormData) {
  return request<ClothingItem>(`/api/wardrobe/items/${id}`, { method: 'PUT', body: form, auth: true })
}

export async function deleteItem(id: string) {
  return request<void>(`/api/wardrobe/items/${id}`, { method: 'DELETE', auth: true })
}

// ── Look do dia ───────────────────────────────────────────────────────

export async function generateLook(input: {
  temperatura_min: number
  temperatura_max: number
  condicao_climatica: string
}) {
  // Composição determinística no backend (regras + atributos das peças). Devolve
  // os looks já com os dados de renderização e uma `note` quando o guarda-roupa
  // está limitado para o clima.
  return request<GenerateLookResult>('/api/looks/generate', { method: 'POST', body: input, auth: true })
}
