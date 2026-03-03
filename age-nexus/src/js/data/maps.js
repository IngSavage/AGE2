// maps.js (solo mapas con datos reales)
// - Sin placeholders
// - Global: window.MAPS

function makeMap(m) {
  return {
    id: m.id,
    name: m.name,

    // filtros
    type: m.type ?? 'abierto',              // abierto | cerrado
    competitive: !!m.competitive,
    formats: Array.isArray(m.formats) ? m.formats : ['1v1','2v2','3v3','4v4'],
    economy: m.economy ?? 'estandar',       // estandar | nomada
    water: m.water ?? 'sin',                // sin | parcial | dominante
    duration: m.duration ?? 'media',        // corta | media | larga

    // contenido
    description: m.description ?? '',
    // normalize id for filename: replace hyphens with underscores and lowercase
    image: m.image ?? `src/assets/img/Maps/rm_${m.id.replace(/-/g, '_').toLowerCase()}.png`,
    strong: m.strong ?? { civ: '—', winrate: '—' },
    weak: m.weak ?? { civ: '—', winrate: '—' },
    builds: Array.isArray(m.builds) ? m.builds : []
  };
}

const MAPS = [
  // ===== ABIERTOS =====
  makeMap({
    id: 'arabia',
    name: 'Arabia',
    type: 'abierto',
    competitive: true,
    formats: ['1v1','2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Mapa abierto con colinas. Presión temprana constante.',
    strong: { civ: 'Francos', winrate: 54 },
    weak: { civ: 'Aztecas', winrate: 46 },
    builds: ['Scout Rush', 'Archer Rush']
  }),

  makeMap({
    id: 'acropolis',
    name: 'Acropolis',
    type: 'abierto',
    competitive: true,
    formats: ['1v1','2v2'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Abierto con elevaciones. Control de colinas.',
    strong: { civ: 'Hunos', winrate: 53 },
    weak: { civ: 'Bengalíes', winrate: 47 },
    builds: ['Scouts → Knights', 'Archers']
  }),

  makeMap({
    id: 'serengeti',
    name: 'Serengeti',
    type: 'abierto',
    competitive: false,
    formats: ['1v1','2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Abierto con fauna agresiva. Decisiones rápidas.',
    strong: { civ: 'Magiares', winrate: 52 },
    weak: { civ: 'Godos', winrate: 48 },
    builds: ['Scout Rush']
  }),

  makeMap({
    id: 'atacama',
    name: 'Atacama',
    type: 'abierto',
    competitive: true,
    formats: ['1v1','2v2'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Abierto con recursos dispersos.',
    strong: { civ: 'Mayas', winrate: 53 },
    weak: { civ: 'Persas', winrate: 47 },
    builds: ['Archer Rush']
  }),

  makeMap({
    id: 'land-madness',
    name: 'Land Madness',
    type: 'abierto',
    competitive: false,
    formats: ['1v1','2v2'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Terreno caótico y agresivo.',
    strong: { civ: 'Aztecas', winrate: 52 },
    weak: { civ: 'Godos', winrate: 48 },
    builds: ['Drush']
  }),

  makeMap({
    id: 'gold-rush',
    name: 'Gold Rush',
    type: 'abierto',
    competitive: true,
    formats: ['1v1','2v2'],
    economy: 'estandar',
    water: 'parcial',
    duration: 'media',
    description: 'Oro central. Peleas tempranas.',
    strong: { civ: 'Lituanos', winrate: 54 },
    weak: { civ: 'Godos', winrate: 46 },
    builds: ['Fast Castle Knights']
  }),

  makeMap({
    id: 'gold-pit',
    name: 'Golden Pit',
    type: 'abierto',
    competitive: true,
    formats: ['1v1','2v2'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Oro central rodeado de colinas.',
    strong: { civ: 'Lituanos', winrate: 54 },
    weak: { civ: 'Godos', winrate: 46 },
    builds: ['Fast Castle Knights']
  }),

  makeMap({
    id: 'runestones',
    name: 'Runestones',
    type: 'abierto',
    competitive: true,
    formats: ['1v1','2v2'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Mapa abierto con piedra cercana.',
    strong: { civ: 'Britanos', winrate: 54 },
    weak: { civ: 'Godos', winrate: 46 },
    builds: ['Archer Rush']
  }),

  makeMap({
    id: 'valley',
    name: 'Valley',
    type: 'abierto',
    competitive: false,
    formats: ['1v1','2v2'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Valles y colinas pronunciadas.',
    strong: { civ: 'Incas', winrate: 52 },
    weak: { civ: 'Hunos', winrate: 48 },
    builds: ['Defensive Boom']
  }),

  makeMap({
    id: 'steppe',
    name: 'Steppe',
    type: 'abierto',
    competitive: false,
    formats: ['1v1','2v2'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Terreno plano con colinas aisladas.',
    strong: { civ: 'Cumanos', winrate: 53 },
    weak: { civ: 'Teutones', winrate: 47 },
    builds: ['Double Stable Scouts']
  }),

  // ===== CERRADOS / SEMI-CERRADOS =====
  makeMap({
    id: 'hideout',
    name: 'Hideout',
    type: 'cerrado',
    competitive: true,
    formats: ['1v1','2v2'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Bosques cerrando el mapa. Boom seguro.',
    strong: { civ: 'Mayas', winrate: 54 },
    weak: { civ: 'Hunos', winrate: 46 },
    builds: ['Fast Castle', 'Boom 3 TC']
  }),

  makeMap({
    id: 'fortress',
    name: 'Fortress',
    type: 'cerrado',
    competitive: true,
    formats: ['1v1','2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'sin',
    duration: 'larga',
    description: 'Inicio con murallas y castillos.',
    strong: { civ: 'Teutones', winrate: 54 },
    weak: { civ: 'Hunos', winrate: 46 },
    builds: ['Fast Imperial']
  }),

  makeMap({
    id: 'arena',
    name: 'Arena',
    type: 'cerrado',
    competitive: true,
    formats: ['1v1','2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'sin',
    duration: 'larga',
    description: 'Muros de piedra. Boom y monjes.',
    strong: { civ: 'Aztecas', winrate: 57 },
    weak: { civ: 'Francos', winrate: 48 },
    builds: ['Drush FC', 'Monks + Siege']
  }),

  makeMap({
    id: 'black-forest',
    name: 'Black Forest',
    type: 'cerrado',
    competitive: true,
    formats: ['3v3','4v4'],
    economy: 'estandar',
    water: 'sin',
    duration: 'larga',
    description: 'Pasillos cerrados y choke points.',
    strong: { civ: 'Teutones', winrate: 54 },
    weak: { civ: 'Hunos', winrate: 46 },
    builds: ['Boom 4 TC']
  }),

  // ===== HÍBRIDOS / AGUA =====
  makeMap({
    id: 'nomad',
    name: 'Nomad',
    type: 'abierto',
    competitive: true,
    formats: ['2v2','3v3','4v4'],
    economy: 'nomada',
    water: 'parcial',
    duration: 'larga',
    description: 'Inicio disperso. Adaptación constante.',
    strong: { civ: 'Jemeres', winrate: 55 },
    weak: { civ: 'Etíopes', winrate: 49 },
    builds: ['Fast Castle']
  }),

  makeMap({
    id: 'four-lakes',
    name: 'Four Lakes',
    type: 'abierto',
    competitive: true,
    formats: ['1v1','2v2'],
    economy: 'estandar',
    water: 'parcial',
    duration: 'media',
    description: 'Control de lagos tempranos.',
    // filename on disk uses uppercase extension, so override explicitly
    image: 'src/assets/img/Maps/rm_four-lakes.PNG',
    strong: { civ: 'Vikingos', winrate: 55 },
    weak: { civ: 'Búlgaros', winrate: 47 },
    builds: ['Water Feudal']
  }),

  makeMap({
    id: 'baltic',
    name: 'Baltic',
    type: 'abierto',
    competitive: true,
    formats: ['2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'dominante',
    duration: 'larga',
    description: 'Islas y costas amplias.',
    strong: { civ: 'Vikingos', winrate: 54 },
    weak: { civ: 'Godos', winrate: 46 },
    builds: ['Galleys']
  }),

  makeMap({
    id: 'islands',
    name: 'Islands',
    type: 'abierto',
    competitive: true,
    formats: ['1v1','2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'dominante',
    duration: 'larga',
    description: 'Naval puro.',
    strong: { civ: 'Italianos', winrate: 56 },
    weak: { civ: 'Godos', winrate: 45 },
    builds: ['Fast Feudal Water']
  }),

  // ===== NUEVOS =====
  makeMap({
    id: 'african-clearing',
    name: 'Claro africano',
    type: 'abierto',
    competitive: false,
    formats: ['1v1','2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Mapa abierto con espacios amplios y lectura sencilla del terreno.',
    strong: { civ: 'Magiares', winrate: 52 },
    weak: { civ: 'Teutones', winrate: 48 },
    builds: ['Scout Rush', 'Archer Rush']
  }),

  makeMap({
    id: 'lombardia',
    name: 'Lombardia',
    type: 'cerrado',
    competitive: false,
    formats: ['1v1','2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Mapa amplio y relativamente seguro. Favorece eco sólida.',
    strong: { civ: 'Persas', winrate: 52 },
    weak: { civ: 'Mayas', winrate: 48 },
    builds: ['Fast Castle', 'Boom 3 TC']
  }),

  makeMap({
    id: 'hill-fort',
    name: 'Hill Fort',
    type: 'cerrado',
    competitive: false,
    formats: ['1v1','2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'sin',
    duration: 'media',
    description: 'Bases elevadas con defensas naturales.',
    strong: { civ: 'Teutones', winrate: 53 },
    weak: { civ: 'Hunos', winrate: 47 },
    builds: ['Fast Castle', 'Defensive Boom']
  }),

  makeMap({
    id: 'amazon-tunnel',
    name: 'Amazon Tunnel',
    type: 'cerrado',
    competitive: false,
    formats: ['2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'sin',
    duration: 'larga',
    description: 'Pasillo central muy estrecho. Late game intenso.',
    // actual file has extra 's' and underscores
    image: 'src/assets/img/Maps/rm_amazon_tunnels.png',
    strong: { civ: 'Teutones', winrate: 53 },
    weak: { civ: 'Hunos', winrate: 47 },
    builds: ['Full Boom', 'Fast Imperial']
  }),

  makeMap({
    id: 'highland',
    name: 'Highland',
    type: 'abierto',
    competitive: false,
    formats: ['1v1','2v2','3v3','4v4'],
    economy: 'estandar',
    water: 'parcial',
    duration: 'media',
    description: 'Mapa híbrido con agua relevante.',
    strong: { civ: 'Vikingos', winrate: 53 },
    weak: { civ: 'Godos', winrate: 47 },
    builds: ['Hybrid Opening', 'Water Feudal']
  })
];

window.MAPS = MAPS;
