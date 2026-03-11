# Age Nexus – Atlas Estratégico de Age of Empires

Sitio estático que muestra builds, civilizaciones, unidades y mapas de Age of Empires.

## Qué incluye

- Navegación por secciones con scroll suave.
- Buscador global que resalta y navega a civilizaciones, builds y mapas.
- Render dinámico de datos (civilizaciones, builds, mapas, unidades, estadísticas) usando JavaScript.
- Generador de civilización aleatoria y recomendaciones rápidas.
- Modo claro/oscuro persistente (localStorage).

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
3. La carga de plantillas se realiza vía `fetch`, por lo que si tu navegador restringe `file://` deberás usar un servidor local.

## Configurar autenticación y persistencia (Supabase)
Para que los usuarios puedan registrarse, iniciar sesión y mantener sus comentarios sincronizados entre dispositivos necesitas conectar el proyecto a tu proyecto de Supabase.

1. En tu proyecto de Supabase, ve a **Settings > API** y copia la **anon public key** (clave pública anónima).
2. En `src/js/auth.js`, reemplaza `'<REPLACE_WITH_ANON_KEY>'` con esa clave.

### Crear tabla de comentarios
En Supabase SQL Editor, ejecuta:

```sql
create table if not exists comments (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  username text,
  text text,
  created_at timestamptz default now()
);
```

### Crear tabla de perfiles (opcional)
Para guardar datos adicionales del usuario (nombre, avatar, país, bio):

```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  country text,
  bio text,
  updated_at timestamptz
);
```

Una vez hecho esto, los usuarios podrán registrarse, iniciar sesión y guardar sus comentarios, y todo será persistente en la base de datos de Supabase.

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
- Generador de civilización aleatoria y recomendaciones rápidas.
- Sección de Comunidad con muro de comentarios (requiere registro/ingreso).
- Autenticación y persistencia de comentarios usando Supabase (registro, inicio de sesión, perfil y comentarios se guardan en la nube).
- Animaciones de hover y tarjetas responsivas con estética inspirada en Age of Empires.
