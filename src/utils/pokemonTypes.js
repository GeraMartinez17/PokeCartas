// Colores y nombres en español de cada tipo de Pokémon.
// `color` es el color principal del marco; `accent` es un tono secundario para degradados.
export const TYPE_INFO = {
  fire: { label: 'Fuego', color: '#F5622D', accent: '#E8281E' },
  water: { label: 'Agua', color: '#3D8BFD', accent: '#1F5FD1' },
  grass: { label: 'Planta', color: '#4CB944', accent: '#2E8B2E' },
  electric: { label: 'Eléctrico', color: '#F8D030', accent: '#E0B000' },
  psychic: { label: 'Psíquico', color: '#A855F7', accent: '#8B3FD9' },
  ground: { label: 'Tierra', color: '#A0693B', accent: '#7B4B26' },
  rock: { label: 'Roca', color: '#9A9A9A', accent: '#6E6E6E' },
  ice: { label: 'Hielo', color: '#7FDDF2', accent: '#4FC3E0' },
  dragon: { label: 'Dragón', color: '#2B3FA8', accent: '#1B2A7A' },
  dark: { label: 'Siniestro', color: '#2B2B2F', accent: '#111113' },
  fairy: { label: 'Hada', color: '#F4A6D0', accent: '#E87FB8' },
  fighting: { label: 'Lucha', color: '#B3261E', accent: '#7F1710' },
  poison: { label: 'Veneno', color: '#9B4FD0', accent: '#7A2FB0' },
  bug: { label: 'Bicho', color: '#5F8F1F', accent: '#3F6A0F' },
  ghost: { label: 'Fantasma', color: '#5B3F8C', accent: '#3A2763' },
  steel: { label: 'Acero', color: '#B8C0CC', accent: '#8E98A8' },
  normal: { label: 'Normal', color: '#D9C8A3', accent: '#BFA97F' },
  flying: { label: 'Volador', color: '#8FA8F0', accent: '#6C88DB' },
}

const FALLBACK = { label: 'Desconocido', color: '#C8C8C8', accent: '#9A9A9A' }

export const getTypeInfo = (type) => TYPE_INFO[type] ?? { ...FALLBACK, label: type }
