// Remoção de fundo da imagem, executada inteiramente no navegador com
// @imgly/background-removal (o processamento NÃO vai para o servidor).
//
// Otimizações aplicadas para reduzir a lentidão percebida e real:
//   1. Redimensionamento prévio no canvas — fotos de celular chegam com 8–12 MP;
//      o tempo de inferência cresce com o número de pixels, então reduzir o maior
//      lado para MAX_DIMENSION é o maior ganho isolado.
//   2. Variante de modelo mais leve (isnet_fp16) — bom recorte para roupa sem o
//      custo da variante de maior precisão (necessária só para cabelo/pelagem).
//   3. Aceleração por hardware (WebGPU) quando disponível, com fallback para WASM.
//   4. Processamento em Web Worker (proxyToWorker) para não travar a UI.
//   5. Pré-carregamento do modelo em background (preload) ao entrar no guarda-roupa.
//   6. Progresso real exposto via callback, para uma barra que se move de verdade.

import { removeBackground, preload, type Config } from '@imgly/background-removal'

// Maior lado da imagem enviada ao modelo. 1280px preserva qualidade suficiente
// para exibição no guarda-roupa e corta drasticamente o número de pixels a
// processar. Ajustável: 1024 é ainda mais rápido, 1536 preserva mais detalhe.
const MAX_DIMENSION = 1280

// Qualidade do JPEG intermediário (imagem redimensionada que alimenta o modelo).
// A saída final continua sendo PNG com transparência; este JPEG é só a entrada.
const RESIZE_JPEG_QUALITY = 0.92

// Variante do modelo de segmentação:
//   'isnet'        → maior precisão, maior download/inferência (bordas de cabelo)
//   'isnet_fp16'   → meio-termo: metade do tamanho, recorte ótimo para roupa
//   'isnet_quint8' → quantizado, o mais rápido/leve, bordas um pouco mais duras
// Escolhemos fp16 como padrão pelo melhor equilíbrio velocidade/qualidade em
// peças de roupa. Troque para 'isnet_quint8' se quiser priorizar ainda mais a
// velocidade (o recorte de roupa continua aceitável).
const MODEL_VARIANT: NonNullable<Config['model']> = 'isnet_fp16'

export type ProgressCallback = (fraction: number) => void

// ── Detecção de WebGPU (uma vez, memoizada) ───────────────────────────────
// A presença de `navigator.gpu` não garante um adaptador utilizável; por isso
// pedimos um adapter de fato e só então habilitamos o device 'gpu'.
let webgpuProbe: Promise<boolean> | null = null
function detectWebGPU(): Promise<boolean> {
  if (!webgpuProbe) {
    webgpuProbe = (async () => {
      try {
        const gpu = (navigator as unknown as { gpu?: { requestAdapter(): Promise<unknown> } }).gpu
        if (!gpu) return false
        const adapter = await gpu.requestAdapter()
        return !!adapter
      } catch {
        return false
      }
    })()
  }
  return webgpuProbe
}

async function baseConfig(): Promise<Config> {
  const useGpu = await detectWebGPU()
  return {
    model: MODEL_VARIANT,
    // 'gpu' usa o backend WebGPU do onnxruntime-web; 'cpu' cai no WASM.
    device: useGpu ? 'gpu' : 'cpu',
    // Roda a inferência em Web Worker, mantendo a thread principal livre.
    proxyToWorker: true,
    output: { format: 'image/png' },
  }
}

// ── Pré-carregamento do modelo ────────────────────────────────────────────
// Chamado ao entrar na tela do guarda-roupa para que, quando o usuário escolher
// a primeira imagem, o modelo já esteja baixado/inicializado. Idempotente.
let preloadPromise: Promise<void> | null = null
export function preloadBackgroundRemoval(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (!preloadPromise) {
    preloadPromise = (async () => {
      const config = await baseConfig()
      await preload(config)
    })().catch(err => {
      // Se o preload falhar, não deixamos o erro preso: zera para permitir nova
      // tentativa e degrada em silêncio (o processamento sob demanda ainda roda).
      preloadPromise = null
      throw err
    })
  }
  return preloadPromise
}

// ── Redimensionamento no canvas ───────────────────────────────────────────
// Reduz o maior lado para MAX_DIMENSION preservando a proporção. Nunca amplia.
// Respeita a orientação EXIF das fotos de celular (imageOrientation).
async function resizeImage(file: File, maxDim: number): Promise<Blob> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    // Navegadores sem createImageBitmap: devolve o arquivo original (o modelo
    // ainda processa, apenas sem o ganho do redimensionamento).
    return file
  }

  const { width, height } = bitmap
  const longest = Math.max(width, height)
  const scale = Math.min(1, maxDim / longest)

  // Já está dentro do limite: não recomprime à toa.
  if (scale >= 1) {
    bitmap.close?.()
    return file
  }

  const w = Math.max(1, Math.round(width * scale))
  const h = Math.max(1, Math.round(height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close?.()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()

  const blob: Blob | null = await new Promise(resolve =>
    canvas.toBlob(resolve, 'image/jpeg', RESIZE_JPEG_QUALITY),
  )
  return blob ?? file
}

// ── Processamento principal ───────────────────────────────────────────────
// Redimensiona e remove o fundo. `onProgress` recebe uma fração 0..1 real,
// derivada dos eventos de progresso da biblioteca (download do modelo + etapas
// de inferência). A saída é um Blob PNG com fundo transparente.
export async function processImage(
  file: File,
  onProgress?: ProgressCallback,
): Promise<Blob> {
  const resized = await resizeImage(file, MAX_DIMENSION)

  const config = await baseConfig()
  if (onProgress) {
    config.progress = (_key: string, current: number, total: number) => {
      if (total > 0) onProgress(Math.min(1, current / total))
    }
  }

  try {
    return await removeBackground(resized, config)
  } catch (err) {
    // Fallback de robustez: se o backend WebGPU falhar em runtime, tenta uma vez
    // no CPU/WASM antes de propagar o erro.
    if (config.device === 'gpu') {
      const cpuConfig: Config = { ...config, device: 'cpu' }
      return await removeBackground(resized, cpuConfig)
    }
    throw err
  }
}
