// Servicio de acceso a la PokéAPI. No contiene lógica de interfaz.
const API_URL = 'https://pokeapi.co/api/v2/pokemon'
const MAX_POKEMON_ID = 1025 // Pokémon "base" con artwork oficial disponible
const MAX_ROUNDS = 4 // rondas de reintento si alguna petición falla

export const TOTAL_CARDS = 40

const STAT_KEYS = ['hp', 'attack', 'defense', 'speed']

/** Devuelve `count` ids únicos aleatorios, excluyendo los ya intentados. */
const randomUniqueIds = (count, exclude = new Set()) => {
  const ids = new Set()
  while (ids.size < count) {
    const id = Math.floor(Math.random() * MAX_POKEMON_ID) + 1
    if (!exclude.has(id)) ids.add(id)
  }
  return [...ids]
}

/** "mr-mime" -> "Mr Mime" */
const formatName = (name) =>
  name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

/** Convierte la respuesta cruda de la API en el objeto que usa la interfaz. */
const normalizePokemon = (data) => {
  const abilities = [...data.abilities]
    .sort((a, b) => a.slot - b.slot)
    .map((item) => ({ name: formatName(item.ability.name), hidden: item.is_hidden }))

  const stats = {}
  data.stats.forEach((item) => {
    if (STAT_KEYS.includes(item.stat.name)) stats[item.stat.name] = item.base_stat
  })

  return {
    id: data.id,
    name: formatName(data.name),
    image:
      data.sprites?.other?.['official-artwork']?.front_default ??
      data.sprites?.front_default ??
      null,
    fallbackImage: data.sprites?.front_default ?? null,
    height: data.height / 10, // decímetros -> metros
    weight: data.weight / 10, // hectogramos -> kilogramos
    types: [...data.types].sort((a, b) => a.slot - b.slot).map((item) => item.type.name),
    abilities,
    stats,
  }
}

const fetchPokemonById = async (id, signal) => {
  const response = await fetch(`${API_URL}/${id}`, { signal })
  if (!response.ok) throw new Error(`PokéAPI respondió ${response.status} para el id ${id}`)
  return normalizePokemon(await response.json())
}

/**
 * Obtiene `count` Pokémon aleatorios sin repetir.
 * Si alguna petición individual falla, reemplaza ese Pokémon por otro id distinto.
 */
export const getRandomPokemons = async (count = TOTAL_CARDS, { signal } = {}) => {
  const collected = new Map()
  const tried = new Set()

  for (let round = 0; round < MAX_ROUNDS && collected.size < count; round++) {
    const ids = randomUniqueIds(count - collected.size, tried)
    ids.forEach((id) => tried.add(id))

    const results = await Promise.allSettled(ids.map((id) => fetchPokemonById(id, signal)))
    if (signal?.aborted) throw new DOMException('Petición cancelada', 'AbortError')

    results.forEach((result) => {
      if (result.status === 'fulfilled') collected.set(result.value.id, result.value)
    })
  }

  if (collected.size < count) {
    throw new Error(`Solo se pudieron obtener ${collected.size} de ${count} Pokémon.`)
  }
  return [...collected.values()]
}
