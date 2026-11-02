<script setup>
import { computed, ref } from 'vue'
import { getTypeInfo } from '../utils/pokemonTypes'

const props = defineProps({
  pokemon: { type: Object, required: true },
})

const typeInfos = computed(() => props.pokemon.types.map(getTypeInfo))

// Marco: color sólido con un tipo, degradado combinado con dos tipos.
const cardStyle = computed(() => {
  const [first, second] = typeInfos.value
  const frame = second
    ? `linear-gradient(135deg, ${first.color} 0%, ${first.color} 40%, ${second.color} 60%, ${second.color} 100%)`
    : `linear-gradient(135deg, ${first.color}, ${first.accent})`
  return {
    '--frame': frame,
    '--tint': first.color,
    '--tint-2': (second ?? first).color,
  }
})

const idLabel = computed(() => String(props.pokemon.id).padStart(4, '0'))

const statLabels = [
  { key: 'hp', label: 'PS' },
  { key: 'attack', label: 'Ataque' },
  { key: 'defense', label: 'Defensa' },
  { key: 'speed', label: 'Velocidad' },
]

// Habilidad 1 y 2 siempre presentes; si la API solo trae una, se avisa.
const abilitySlots = computed(() =>
  [0, 1].map((index) => props.pokemon.abilities[index] ?? null),
)

// Imagen: artwork oficial -> sprite de la API -> mensaje "sin imagen".
const imageStage = ref(0)
const imageSrc = computed(() => {
  if (imageStage.value === 0) return props.pokemon.image ?? props.pokemon.fallbackImage
  if (imageStage.value === 1) return props.pokemon.fallbackImage
  return null
})
const onImageError = () => {
  imageStage.value += 1
}
</script>

<template>
  <article class="card" :style="cardStyle">
    <div class="card__inner">
      <header class="card__header">
        <h2 class="card__name" :title="pokemon.name">{{ pokemon.name }}</h2>
        <span class="card__id">ID #{{ idLabel }}</span>
      </header>

      <div class="card__art">
        <img
          v-if="imageSrc"
          :src="imageSrc"
          :alt="`Imagen oficial de ${pokemon.name}`"
          loading="lazy"
          @error="onImageError"
        />
        <span v-else class="card__no-image">Sin imagen disponible</span>
      </div>

      <ul class="card__types" aria-label="Tipos">
        <li v-for="info in typeInfos" :key="info.label" :style="{ background: info.color }">
          {{ info.label }}
        </li>
      </ul>

      <section class="card__section">
        <h3>Características</h3>
        <p class="card__measures">
          <span>Altura: <b>{{ pokemon.height }} m</b></span>
          <span>Peso: <b>{{ pokemon.weight }} kg</b></span>
        </p>
        <dl class="card__stats">
          <div v-for="stat in statLabels" :key="stat.key">
            <dt>{{ stat.label }}</dt>
            <dd>{{ pokemon.stats[stat.key] ?? '—' }}</dd>
          </div>
        </dl>
      </section>

      <section class="card__section">
        <h3>Habilidades</h3>
        <ul class="card__abilities">
          <li v-for="(ability, index) in abilitySlots" :key="index">
            <span class="card__ability-label">Habilidad {{ index + 1 }}</span>
            <template v-if="ability">
              <span class="card__ability-name">{{ ability.name }}</span>
              <small v-if="ability.hidden"> (oculta)</small>
            </template>
            <em v-else>No tiene una segunda habilidad disponible</em>
          </li>
        </ul>
      </section>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  height: 100%;
  padding: 8px;
  border-radius: 18px;
  background: var(--frame);
  box-shadow: 0 6px 16px rgba(20, 24, 40, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  overflow: hidden;
}

/* Destello ligero al pasar el cursor */
.card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.45) 50%, transparent 65%);
  transform: translateX(-120%);
  transition: transform 0.7s ease;
  pointer-events: none;
}

.card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 16px 28px rgba(20, 24, 40, 0.35);
}
.card:hover::after {
  transform: translateX(120%);
}

.card__inner {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 10px;
  border-radius: 12px;
  background:
    radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.9), transparent 70%),
    linear-gradient(180deg, color-mix(in srgb, var(--tint) 18%, #fffdf5), color-mix(in srgb, var(--tint-2) 28%, #fffdf5));
  color: #22252e;
}

.card__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.card__name {
  margin: 0;
  overflow: hidden;
  font-size: 1.05rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card__id {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #5b6070;
}

.card__art {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  background:
    radial-gradient(circle at 50% 110%, color-mix(in srgb, var(--tint) 55%, white), transparent 70%),
    rgba(255, 255, 255, 0.55);
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.08);
}
.card__art img {
  max-width: 88%;
  max-height: 138px;
  object-fit: contain;
  filter: drop-shadow(0 6px 6px rgba(0, 0, 0, 0.25));
}
.card__no-image {
  font-size: 0.8rem;
  color: #5b6070;
}

.card__types {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.card__types li {
  padding: 2px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
}

.card__section {
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  font-size: 0.78rem;
}
.card__section h3 {
  margin: 0 0 4px;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #5b6070;
}

.card__measures {
  display: flex;
  justify-content: space-between;
  margin: 0 0 4px;
}

.card__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px 10px;
  margin: 0;
}
.card__stats div {
  display: flex;
  justify-content: space-between;
}
.card__stats dt {
  color: #5b6070;
}
.card__stats dd {
  margin: 0;
  font-weight: 700;
}

.card__abilities {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.card__abilities li {
  display: flex;
  flex-direction: column;
}
.card__ability-label {
  font-size: 0.68rem;
  color: #5b6070;
}
.card__ability-name {
  font-weight: 700;
}
.card__abilities em {
  font-size: 0.74rem;
  color: #7a7f8e;
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .card::after {
    transition: none;
  }
  .card:hover {
    transform: none;
  }
}
</style>
