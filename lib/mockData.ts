export type Category = 'blazers' | 'vestidos' | 'calças' | 'camisas' | 'casacos' | 'malhas' | 'acessórios'

export interface WardrobeItem {
  id: string
  name: string
  category: Category
  color: string
  colorHex: string
  textColor: string
  size: string
  note?: string
  aspectRatio: string
}

export const CATEGORIES: { key: Category | 'tudo'; label: string }[] = [
  { key: 'tudo', label: 'Tudo' },
  { key: 'blazers', label: 'Blazers' },
  { key: 'vestidos', label: 'Vestidos' },
  { key: 'calças', label: 'Calças' },
  { key: 'camisas', label: 'Camisas' },
  { key: 'casacos', label: 'Casacos' },
  { key: 'malhas', label: 'Malhas' },
  { key: 'acessórios', label: 'Acessórios' },
]

export const MOCK_ITEMS: WardrobeItem[] = [
  {
    id: '1',
    name: 'Blazer de Alfaiataria',
    category: 'blazers',
    color: 'Preto',
    colorHex: '#1A1A1A',
    textColor: '#C8C8C8',
    size: 'M',
    aspectRatio: '3/4',
  },
  {
    id: '2',
    name: 'Vestido Midi Crepe',
    category: 'vestidos',
    color: 'Off-white',
    colorHex: '#EDE9E0',
    textColor: '#1A1A1A',
    size: 'P',
    aspectRatio: '2/3',
  },
  {
    id: '3',
    name: 'Calça Pantalona',
    category: 'calças',
    color: 'Marfim',
    colorHex: '#D9D0BB',
    textColor: '#2A2A2A',
    size: 'M',
    aspectRatio: '4/5',
  },
  {
    id: '4',
    name: 'Camisa de Seda',
    category: 'camisas',
    color: 'Platina',
    colorHex: '#AEAEAE',
    textColor: '#1A1A1A',
    size: 'P',
    note: 'Usar por dentro ou amarrada',
    aspectRatio: '3/4',
  },
  {
    id: '5',
    name: 'Casaco Oversize',
    category: 'casacos',
    color: 'Caramelo',
    colorHex: '#7A5435',
    textColor: '#EDE9E0',
    size: 'G',
    aspectRatio: '2/3',
  },
  {
    id: '6',
    name: 'Malha Canelada',
    category: 'malhas',
    color: 'Cinza Platina',
    colorHex: '#C0C0C0',
    textColor: '#1A1A1A',
    size: 'M',
    aspectRatio: '4/5',
  },
  {
    id: '7',
    name: 'Bolsa Estruturada',
    category: 'acessórios',
    color: 'Nude',
    colorHex: '#B89870',
    textColor: '#1A1A1A',
    size: 'Único',
    aspectRatio: '1/1',
  },
  {
    id: '8',
    name: 'Blazer Creme',
    category: 'blazers',
    color: 'Creme',
    colorHex: '#C8BC9E',
    textColor: '#1A1A1A',
    size: 'P',
    aspectRatio: '3/4',
  },
  {
    id: '9',
    name: 'Vestido Slip Musgo',
    category: 'vestidos',
    color: 'Musgo',
    colorHex: '#3D4A38',
    textColor: '#C8C8C8',
    size: 'M',
    aspectRatio: '3/4',
  },
  {
    id: '10',
    name: 'Calça Preta Slim',
    category: 'calças',
    color: 'Preto',
    colorHex: '#111111',
    textColor: '#9B9B9B',
    size: 'M',
    aspectRatio: '4/5',
  },
  {
    id: '11',
    name: 'Camisa Oxford',
    category: 'camisas',
    color: 'Cerúleo',
    colorHex: '#3B72B5',
    textColor: '#F5F2EC',
    size: 'M',
    note: 'Peça favorita',
    aspectRatio: '3/4',
  },
  {
    id: '12',
    name: 'Cinto Dourado',
    category: 'acessórios',
    color: 'Dourado',
    colorHex: '#A07830',
    textColor: '#F5F2EC',
    size: 'Único',
    aspectRatio: '1/1',
  },
  {
    id: '13',
    name: 'Casaco de Lã',
    category: 'casacos',
    color: 'Grafite',
    colorHex: '#2A2A2A',
    textColor: '#9B9B9B',
    size: 'M',
    aspectRatio: '2/3',
  },
  {
    id: '14',
    name: 'Malha de Caxemira',
    category: 'malhas',
    color: 'Bege',
    colorHex: '#C4B49A',
    textColor: '#1A1A1A',
    size: 'P',
    aspectRatio: '4/5',
  },
]

export type WeatherCondition = 'sol' | 'nublado' | 'chuva' | 'vento' | 'frio'

export interface LookItem {
  item: WardrobeItem
  role: string
}

export interface LookSuggestion {
  id: string
  label: string
  items: WardrobeItem[]
  commentary: string
}

const item = (id: string) => MOCK_ITEMS.find(i => i.id === id)!

export const LOOKS_BY_CONDITION: Record<WeatherCondition, LookSuggestion[]> = {
  sol: [
    {
      id: 'sol-1',
      label: 'I',
      items: [item('4'), item('3'), item('7')],
      commentary: 'Calor não justifica descuido. A seda flui. A pantalona impõe estrutura. A bolsa fecha a conversa.',
    },
    {
      id: 'sol-2',
      label: 'II',
      items: [item('2'), item('12')],
      commentary: 'Um vestido que não precisa de mais nada. O cinto é a única concessão necessária.',
    },
  ],
  nublado: [
    {
      id: 'nublado-1',
      label: 'I',
      items: [item('8'), item('3'), item('7')],
      commentary: 'Nublado é neutro. O blazer creme é a decisão. O resto apenas obedece.',
    },
    {
      id: 'nublado-2',
      label: 'II',
      items: [item('9'), item('12')],
      commentary: 'Musgo contra o cinza do céu. Contraste silencioso, mais eficaz que o óbvio.',
    },
  ],
  chuva: [
    {
      id: 'chuva-1',
      label: 'I',
      items: [item('5'), item('1'), item('10')],
      commentary: 'Chuva não cancela o rigor. O casaco carrega tudo. O blazer disciplina o interior.',
    },
    {
      id: 'chuva-2',
      label: 'II',
      items: [item('13'), item('6'), item('11')],
      commentary: 'Camadas com intenção. A camisa azul é o único ponto de cor permitido.',
    },
  ],
  vento: [
    {
      id: 'vento-1',
      label: 'I',
      items: [item('1'), item('10'), item('12')],
      commentary: 'Vento exige peso. Alfaiataria preta, cinto dourado. Concisão.',
    },
    {
      id: 'vento-2',
      label: 'II',
      items: [item('5'), item('4'), item('3')],
      commentary: 'O casaco enfrenta. A seda surpreende por baixo. A pantalona ancora.',
    },
  ],
  frio: [
    {
      id: 'frio-1',
      label: 'I',
      items: [item('5'), item('14'), item('10'), item('7')],
      commentary: 'Frio severo. Quatro peças, uma lógica: casacos de dentro para fora.',
    },
    {
      id: 'frio-2',
      label: 'II',
      items: [item('13'), item('6'), item('10')],
      commentary: 'Grafite, platina e preto. Inverno como convicção estética.',
    },
  ],
}
