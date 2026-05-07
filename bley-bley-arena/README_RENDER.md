# Bley Bley Arena: despliegue fácil en Render

Esta versión está preparada para subir toda la app en **un solo servicio web de Render**:

- React/Vite se compila como frontend.
- Express sirve el frontend y la API desde la misma URL.
- PostgreSQL se crea automáticamente desde `render.yaml`.
- Prisma ejecuta migraciones antes de arrancar.

## Pasos mínimos

1. Crea una cuenta en GitHub.
2. Sube esta carpeta completa a un repositorio.
3. En Render, entra en **Blueprints** o **New + → Blueprint**.
4. Conecta tu repo.
5. Render detectará `render.yaml`.
6. Pulsa **Apply**.

Render creará:

- `bley-bley-arena`, la web/API.
- `bley-bley-arena-db`, la base de datos PostgreSQL.

Cuando termine, abre la URL pública que Render te muestre, algo tipo:

```txt
https://bley-bley-arena.onrender.com
```

## Notas importantes

- El plan gratuito de Render puede dormir la app cuando no se usa. La primera carga puede tardar un poco.
- La recuperación de contraseña funciona mejor si configuras SMTP en Render.
- Las variables SMTP están marcadas como `sync: false`, así Render te permite rellenarlas manualmente o dejarlas vacías.

## Variables opcionales para emails

En Render, dentro del servicio `bley-bley-arena`, puedes añadir:

```env
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_USER=tu_usuario
SMTP_PASS=tu_password
MAIL_FROM=Bley Bley Arena <no-reply@tudominio.com>
```

## Desarrollo local

Backend:

```bash
cd server
npm install
npx prisma generate
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

Para local puedes usar SQLite si cambias temporalmente el provider de Prisma, pero para Render ya está configurado con PostgreSQL.
