
# Bley Bley Arena

## Despliegue más fácil en Render

Esta versión incluye `render.yaml`, migraciones de Prisma para PostgreSQL y el backend configurado para servir también el frontend. En Render se despliega como **una sola web** con **una base de datos PostgreSQL**.

Consulta `README_RENDER.md` para los pasos exactos.

---

# Bley Bley Arena

App full-stack para gestionar configuraciones de Beyblade: usuarios, Bleys, piezas, combates, dashboard y estadísticas.

## Stack

- Frontend: React + Vite + React Router + Recharts + CSS responsive.
- Backend: Node.js + Express.
- Base de datos: Prisma + SQLite en desarrollo.
- Seguridad: bcrypt, JWT, Helmet, CORS, rate limiting, validación de email, rutas privadas, aislamiento por `userId`.

## Estructura

```txt
bley-bley-arena/
  client/
    src/
      components/AppShell.jsx
      context/AuthContext.jsx
      pages/
      services/api.js
      styles.css
  server/
    prisma/schema.prisma
    src/
      routes/auth.js
      routes/bleys.js
      routes/pieces.js
      routes/combats.js
      routes/stats.js
      middleware/
      utils/
      index.js
```

## Ejecutar en local

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

API disponible en `http://localhost:4000/api`.

> En desarrollo, si no configuras SMTP, los enlaces de recuperación de contraseña se imprimen en la consola del backend.

### 2. Frontend

En otra terminal:

```bash
cd client
npm install
npm run dev
```

App disponible en `http://localhost:5173`.

## Endpoints principales

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Bleys

- `GET /api/bleys?q=&type=&sort=`
- `POST /api/bleys`
- `GET /api/bleys/:id`
- `PUT /api/bleys/:id`
- `DELETE /api/bleys/:id`

### Piezas

- `GET /api/pieces`
- `POST /api/pieces`
- `PUT /api/pieces/:id`
- `DELETE /api/pieces/:id`

### Combates y estadísticas

- `GET /api/combats`
- `POST /api/combats`
- `DELETE /api/combats/:id`
- `GET /api/stats`

## Funciones incluidas

- Registro, login, logout en cliente, perfil editable.
- Recuperación segura de contraseña con token hasheado y caducidad.
- CRUD de Bleys por usuario.
- CRUD de piezas.
- Registro de combates por Bley.
- Cálculo automático de porcentajes, ranking, Bley más usado y mejor winrate.
- Dashboard con tarjetas y gráficas.
- Buscador, filtros y ordenación.
- Exportación JSON de estadísticas.
- Diseño gamer/anime limpio, responsive y oscuro.

## Mejoras recomendadas para producción

- Cambiar SQLite por PostgreSQL.
- Guardar imágenes en S3, Cloudinary o Supabase Storage.
- Añadir verificación de email.
- Rotación de refresh tokens con cookies httpOnly.
- Tests con Vitest/Jest y Playwright.
- Roles de admin para moderar la base global de piezas.
