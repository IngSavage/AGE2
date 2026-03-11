# Age Nexus – Atlas Estratégico de Age of Empires

Este proyecto ha sido extendido para incluir autenticación de usuarios y una API de backend.

## Nuevas características

- Registro e inicio de sesión de usuarios
- Guardado de perfiles en una base de datos SQL (Azure SQL)
- API Node.js desplegada en Azure App Service
- Frontend estático hospedado en Azure Static Web App (o Storage)

## Estructura adicional

- `backend/` – servidor Express para autenticación
- `src/html/section-login.html` y `section-register.html` – formularios de usuario
- `src/js/auth.js` – funciones JavaScript para llamar a la API
- `src/js/config.js` – configuración de URL del API

## Configuración local

1. Copia `.env.example` a `.env` dentro de `backend/` y completa:
   ```
   DB_USER=<usuario sql>
   DB_PASSWORD=<contraseña>
   DB_SERVER=<servidor>.database.windows.net
   DB_NAME=<nombre base de datos>
   JWT_SECRET=<cadena secreta>
   PORT=3000
   ```
2. Ejecuta `npm install` dentro de `backend` y luego `npm start`.
3. (Opcional) crea la tabla de usuarios ejecutando el script `backend/schema.sql` en tu base de datos. El servidor intentará crearla automáticamente si no existe.
4. Abre `age-nexus/index.html` en un navegador para probar.

## Despliegue en Azure

- **Backend**: crea un App Service Node.js. Ajusta las variables de aplicación con los valores de la base de datos y `JWT_SECRET`.
- **Base de datos**: Azure SQL Database. Ejecuta `backend/schema.sql` para crear la tabla de `users`.
- **Frontend**: despliega el contenido de `age-nexus/` en una Azure Static Web App o un Blob Storage estático. Ajusta `src/js/config.js` con la URL pública del backend.

## Notas

Los tokens JWT se almacenan en `localStorage` y se envían en el encabezado `Authorization: Bearer <token>` al endpoint `/api/profile`.

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
