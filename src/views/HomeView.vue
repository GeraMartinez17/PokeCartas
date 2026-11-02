<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import PokemonCard from '../components/PokemonCard.vue'
import { getRandomPokemons, TOTAL_CARDS } from '../services/pokemonService'

const pokemons = ref([])
const loading = ref(true) // arranca en "cargando" para no mostrar "0 Pokémon" antes de la primera petición
const error = ref('')
let controller = null

const loadCards = async () => {
  controller?.abort() // cancela una carga anterior si sigue en curso
  controller = new AbortController()
  const { signal } = controller

  loading.value = true
  error.value = ''
  try {
    const result = await getRandomPokemons(TOTAL_CARDS, { signal })
    if (signal.aborted) return
    pokemons.value = result
  } catch (err) {
    if (err.name === 'AbortError') return
    pokemons.value = []
    error.value = 'No se pudo conectar con la PokéAPI. Revisa tu conexión e inténtalo de nuevo.'
  } finally {
    if (!signal.aborted) loading.value = false
  }
}

onMounted(loadCards)
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <main class="home">
    <header class="home__header">
      <h1>POKÉMON CARD COLLECTION</h1>
      <p v-if="!loading && !error" class="home__counter">
        {{ pokemons.length }} Pokémon encontrados
      </p>
      <button class="home__button" type="button" :disabled="loading" @click="loadCards">
        {{ loading ? 'Cargando…' : 'Generar nuevas cartas' }}
      </button>
    </header>

    <section v-if="loading" class="home__status" role="status" aria-live="polite">
      <span class="home__pokeball" aria-hidden="true"></span>
      <p>Buscando {{ TOTAL_CARDS }} Pokémon…</p>
    </section>

    <section v-else-if="error" class="home__status home__status--error" role="alert">
      <p>{{ error }}</p>
      <button class="home__button" type="button" @click="loadCards">Reintentar</button>
    </section>

    <section v-else class="home__grid">
      <PokemonCard v-for="pokemon in pokemons" :key="pokemon.id" :pokemon="pokemon" />
    </section>
  </main>
</template>

<style scoped>
.home {
  min-height: 100vh;
  padding: 24px 16px 48px;
  background:
    radial-gradient(circle at 15% 10%, rgba(255, 203, 5, 0.25), transparent 40%),
    radial-gradient(circle at 85% 90%, rgba(61, 125, 202, 0.25), transparent 40%),
    #f4f6fb;
}

.home__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  text-align: center;
}
.home__header h1 {
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  font-weight: 900;
  letter-spacing: 0.06em;
  color: #ffcb05;
  -webkit-text-stroke: 2px #3d7dca;
  paint-order: stroke fill;
  text-shadow: 0 4px 0 #2a5a96;
}
.home__counter {
  margin: 0;
  font-weight: 700;
  color: #3b4256;
}

.home__button {
  padding: 10px 22px;
  border: 0;
  border-radius: 999px;
  background: #e3350d;
  font: inherit;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 0 #a82608;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.home__button:hover:not(:disabled) {
  transform: translateY(-2px);
}
.home__button:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #a82608;
}
.home__button:disabled {
  opacity: 0.65;
  cursor: wait;
}

/* Cuadrícula responsive: móvil 1-2, tablet 3, escritorio 5-6 columnas */
.home__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  max-width: 1800px;
  margin: 0 auto;
}
@media (min-width: 480px) {
  .home__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 720px) {
  .home__grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 1100px) {
  .home__grid { grid-template-columns: repeat(5, 1fr); }
}
@media (min-width: 1500px) {
  .home__grid { grid-template-columns: repeat(6, 1fr); }
}

.home__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 60px 0;
  font-weight: 700;
  color: #3b4256;
}
.home__status--error p {
  max-width: 420px;
  color: #b3261e;
}

.home__pokeball {
  width: 56px;
  height: 56px;
  border: 4px solid #222;
  border-radius: 50%;
  background: linear-gradient(#e3350d 0 46%, #222 46% 54%, #fff 54% 100%);
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .home__pokeball { animation-duration: 3s; }
}
</style>
