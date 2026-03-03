# Age Nexus – Atlas Estratégico de Age of Empires

Proyecto web estático y profesional que recopila builds, civilizaciones, mapas y comunidad para Age of Empires.

## Tecnologías utilizadas
- HTML semántico dividido en plantillas por sección (`/src/html`).
- CSS modular (base, layout, componentes y temas claro/oscuro).
- JavaScript puro para navegación, render dinámico y buscador global.
- Sin dependencias ni frameworks externos.

## Estructura
```
age-nexus/
├─ index.html
├─ src/
│  ├─ html/               # Plantillas por sección
│  ├─ css/                # Estilos base, layout, componentes y temas
│  ├─ js/                 # Lógica principal, temas, UI y datos mock
│  │   ├─ data/           # Datos ficticios (civs, builds, mapas, unidades, jugadores)
│  │   └─ ui/             # Renderizadores de UI
│  └─ assets/
│     ├─ img/             # Coloca las imágenes aquí
│     │   ├─ civs/
│     │   ├─ maps/
│     │   ├─ units/
│     │   ├─ ui/
│     │   └─ logo/
│     └─ icons/
└─ README.md
```

## Cómo ejecutar
1. Clona el repositorio.
2. Abre `age-nexus/index.html` en tu navegador o sirve la carpeta con tu servidor estático favorito (por ejemplo, `python -m http.server`).
3. La carga de plantillas se realiza vía `fetch`, por lo que si abres el archivo directamente y tu navegador restringe `file://`, usa un servidor local.

## Imágenes
- No se incluyen assets reales. Añade tus imágenes en `src/assets/img/` respetando las carpetas de `civs`, `maps`, `units`, `ui` y `logo`.
- Ejemplos de rutas usadas en el HTML/JS:
  - `src/assets/img/civs/jemeres.png`
  - `src/assets/img/maps/map-arabia.jpg`
  - `src/assets/img/units/escuadron.png`

## Funcionalidades destacadas
- Navbar con menú hamburguesa y scroll suave a secciones.
- Modo claro/oscuro persistente (localStorage).
- Buscador global que resalta civilizaciones, builds o mapas y desplaza a la sección.
- Render dinámico de civilizaciones, build orders, mapas, unidades y estadísticas.
- Muro de mensajes, generador de civilización aleatoria y recomendaciones rápidas.
- Animaciones de hover y tarjetas responsivas con estética inspirada en Age of Empires.
