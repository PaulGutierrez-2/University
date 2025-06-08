# Universidad Fullstack - Instrucciones de Instalación

## Requisitos

- Node.js 18+
- PostgreSQL
- npm

## Instalación

1. **Clona el repositorio y entra a la carpeta:**
   ```sh
   git clone <url-del-repo>
   cd universidad
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

3. **Configura las variables de entorno:**
   - Copia `.env.example` a `.env` y edítalo con tus datos de conexión a la base de datos.

4. **Crea la base de datos en PostgreSQL** (si no existe).

5. **Ejecuta las migraciones y genera el cliente Prisma:**
   ```sh
   npx prisma migrate dev --name init
   npx prisma generate
   ```

6. **Siembra datos de ejemplo en la base de datos:**
   ```sh
   npx ts-node prisma/seed.ts
   ```

7. **Inicia el servidor en desarrollo:**
   ```sh
   npm run start:dev
   ```

## Comandos útiles

- **Migrar la base de datos:**  
  `npx prisma migrate dev --name <nombre>`
- **Generar cliente Prisma:**  
  `npx prisma generate`
- **Abrir Prisma Studio:**  
  `npx prisma studio`
- **Sembrar datos de ejemplo:**  
  `npx ts-node prisma/seed.ts`
- **Iniciar en desarrollo:**  
  `npm run start:dev`
- **Iniciar en producción:**  
  `npm run build && npm run postbuild && npm run start:prod`

---

**¡Listo! El proyecto debería estar corriendo en http://localhost:3000**