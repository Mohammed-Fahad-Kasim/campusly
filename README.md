# Campusly

Campusly is a campus event platform with a React/Vite frontend, Express API, PostgreSQL, and Prisma. The Express server serves both the compiled frontend and `/api/*`, so it can run as one Render Web Service.

## Local development

```bash
npm install
copy .env.example .env
# Set DATABASE_URL and JWT_SECRET in .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev:full
```

Open `http://localhost:5173`. For separate terminals, use `npm run dev:api` and `npm run dev`.

## Production deployment

Render configuration is included in `render.yaml`. It defines one Node web service and one Render PostgreSQL database. No deployment is performed by this repository change.

Render commands:

- Build: `npm ci && npm run build`
- Pre-deploy: `npx prisma migrate deploy`
- Start: `npm start`
- Health check: `/api/health`

Production migrations use the committed `prisma/migrations` directory. Production deployments never run the seed script automatically. Run `npm run db:seed` only as a deliberate one-time operation when initializing a new database.

## Environment variables

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/campusly?schema=public
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=production
```

Never commit `.env` or real credentials.

## Architecture

- `src/`: React/Vite frontend
- `server/index.ts`: Express API, auth, authorization, validation, health endpoint, static frontend serving, and SPA fallback
- `prisma/schema.prisma`: PostgreSQL schema and relations
- `prisma/migrations/`: committed production migrations
- `prisma/seed.ts`: intentional demo-data seed

## Demo accounts

- Student: `student@campusly.dev` / `campusly123`
- Admin: `admin@campusly.dev` / `campusly123`
