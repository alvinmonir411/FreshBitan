# FreshBitan

Initial split-project setup for **FreshBitan**, a Bangladesh mango ecommerce brand.

## Tech Stack

- `frontend`: Next.js 16 App Router, TypeScript, Tailwind CSS, npm
- `backend`: NestJS 11, TypeScript, npm
- `database`: PostgreSQL via Neon `DATABASE_URL`
- `orm`: TypeORM

## Project Structure

```text
freshbitan/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── types/
└── backend/
    ├── src/
    │   ├── common/
    │   ├── config/
    │   ├── database/
    │   ├── entities/
    │   └── modules/
    └── test/
```

## Getting Started

### 1. Frontend

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### 2. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run start:dev
```

Backend runs on `http://localhost:4000` and exposes the health endpoint at `http://localhost:4000/api/health`.
Before starting against Neon, replace the placeholder `DATABASE_URL` in `backend/.env` with a real connection string.

## Environment Files

- `frontend/.env.example`
  - `NEXT_PUBLIC_BRAND_NAME`
  - `NEXT_PUBLIC_SITE_TAGLINE`
  - `NEXT_PUBLIC_API_BASE_URL`
- `backend/.env.example`
  - `PORT`
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `FRONTEND_URL`

## What Is Ready

- Clean split folder structure
- Frontend FreshBitan homepage placeholder
- Frontend env helper and API URL helper
- Backend global `/api` prefix
- Backend CORS enabled for future frontend connection
- Backend health check route
- Backend `ConfigModule` setup for environment variables
- Backend TypeORM wired with `TypeOrmModule.forRootAsync`
- Backend entities prepared for admin, catalog, order, review, and site settings data
- Backend module folders prepared for `auth`, `admins`, `categories`, `products`, `orders`, `reviews`, and `settings`

## Recommended Next Step

Create the first TypeORM migration files, then add the initial feature modules and repositories for `categories` and `products` before wiring live data into the frontend.
