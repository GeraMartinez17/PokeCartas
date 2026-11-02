# Pokémon Card Collection

Página web hecha con **Vue 3** y **Vite** que muestra **40 cartas Pokémon aleatorias** en una sola pantalla. Toda la información (imagen, nombre, ID, tipos, altura, peso, estadísticas y habilidades) se obtiene en tiempo real de la [PokéAPI](https://pokeapi.co/). Cada carta se inspira en las cartas del juego Pokémon TCG.

## Características

- 40 Pokémon aleatorios, sin repetir, en una sola página.
- Carta individual con marco de color según el tipo (degradado si el Pokémon tiene dos tipos).
- Cada carta muestra: imagen oficial (`official-artwork`), nombre, ID, tipos, altura, peso, estadísticas principales (PS, Ataque, Defensa y Velocidad) y dos espacios de habilidad.
- Si un Pokémon solo tiene una habilidad, el segundo espacio indica que no hay una segunda habilidad disponible (no se inventa información).
- Botón **Generar nuevas cartas** para obtener otros 40 Pokémon.
- Indicador de carga y mensaje de error con botón **Reintentar** si la API no responde.
- Animación ligera al pasar el cursor sobre una carta.
- Diseño responsive con CSS Grid.

| Pantalla | Columnas |
|---|---|
| Móvil (menos de 480 px) | 1 |
| Móvil grande (480 px o más) | 2 |
| Tablet (720 px o más) | 3 |
| Escritorio (1100 px o más) | 5 |
| Escritorio amplio (1500 px o más) | 6 |

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (se recomienda la versión LTS más reciente). Incluye `npm`.
- Conexión a internet (las cartas se consultan a la PokéAPI).

Para comprobar tu versión:

```bash
node -v
npm -v
```

## Instalación y uso

1. Abre una terminal **dentro de la carpeta del proyecto**, la que contiene el archivo `package.json`:

   ```powershell
   cd C:\Users\geram\Downloads\PokerCard
   ```

2. Instala las dependencias (solo la primera vez):

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre en el navegador la dirección que aparece en la terminal, normalmente `http://localhost:5173`.

### Otros comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con recarga automática. |
| `npm run build` | Genera la versión de producción en la carpeta `dist/`. |
| `npm run preview` | Sirve localmente la versión generada con `build`, para probarla. |

## Estructura del proyecto

```
PokerCard/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js                    # Punto de entrada: monta la aplicación
    ├── App.vue                    # Componente raíz, muestra HomeView
    ├── style.css                  # Estilos globales mínimos
    ├── views/
    │   └── HomeView.vue           # Página principal: encabezado, contador, botón y cuadrícula
    ├── components/
    │   └── PokemonCard.vue        # Carta individual (recibe el Pokémon por props)
    ├── services/
    │   └── pokemonService.js      # Peticiones a la PokéAPI
    └── utils/
        └── pokemonTypes.js        # Colores y nombres en español de cada tipo
```

## Cómo funciona

1. **`HomeView.vue`** pide los Pokémon al servicio cuando se abre la página y cada vez que se pulsa *Generar nuevas cartas*. Controla los estados de carga y de error, y dibuja una `PokemonCard` por cada Pokémon. Si pulsas el botón mientras aún se está cargando, cancela la petición anterior.
2. **`pokemonService.js`** genera 40 IDs aleatorios únicos y consulta `https://pokeapi.co/api/v2/pokemon/{id}` para cada uno, en paralelo. Si alguna petición falla, la reemplaza por otro Pokémon y reintenta (hasta 4 rondas). Si aun así no se completan 40, devuelve un error. También convierte la altura a metros y el peso a kilogramos, y da formato a los nombres (`mr-mime` pasa a `Mr Mime`).
3. **`PokemonCard.vue`** recibe un Pokémon mediante `props` y lo dibuja. Si la imagen oficial no carga, usa el sprite de la API; si tampoco carga, muestra "Sin imagen disponible".
4. **`pokemonTypes.js`** contiene el color principal y el nombre en español de cada tipo, que usa la carta para el marco y las etiquetas.

## Personalización

- **Cantidad de cartas:** cambia `TOTAL_CARDS` en `src/services/pokemonService.js` (por defecto `40`).
- **Colores de los tipos:** edita `src/utils/pokemonTypes.js`.
- **Columnas de la cuadrícula:** ajusta los `@media` de `.home__grid` en `src/views/HomeView.vue`.
- **Estadísticas mostradas:** modifica `STAT_KEYS` en `pokemonService.js` y `statLabels` en `PokemonCard.vue`.

## Solución de problemas

| Problema | Solución |
|---|---|
| `npm error ENOENT ... package.json` | Estás en una carpeta equivocada. Entra a la carpeta que contiene `package.json` (no a una subcarpeta ni a la carpeta que contiene el zip) y vuelve a ejecutar el comando. |
| `npm` o `node` no se reconocen | Instala Node.js desde [nodejs.org](https://nodejs.org/) y reinicia la terminal. |
| Aparece "No se pudo conectar con la PokéAPI" | Revisa tu conexión a internet y pulsa **Reintentar**. Si persiste, la API puede estar temporalmente fuera de servicio. |
| El puerto `5173` está ocupado | Vite elegirá otro puerto automáticamente; usa la dirección que muestre la terminal. |
| La página no refleja un cambio | Detén el servidor con `Ctrl + C` y vuelve a ejecutar `npm run dev`. |

## Créditos

- Datos e imágenes: [PokéAPI](https://pokeapi.co/).
- Pokémon y sus nombres e imágenes son marcas y propiedad de Nintendo, Game Freak y The Pokémon Company. Este proyecto es de carácter educativo y no tiene fines comerciales.
