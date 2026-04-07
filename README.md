# FreshBitan

FreshBitan is a split ecommerce application for selling seasonal fruit online in Bangladesh.
The repo contains:

- `frontend`: Next.js App Router storefront and admin dashboard
- `backend`: NestJS API with auth, products, categories, orders, reviews, settings, and seed tooling
- `database`: Neon PostgreSQL via `DATABASE_URL`

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: NestJS 11, TypeScript, TypeORM
- Database: PostgreSQL on Neon
- Package manager: `npm` only

## Project Structure

```text
freshbitan/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── types/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   ├── config/
│   │   ├── database/
│   │   ├── entities/
│   │   └── modules/
│   └── test/
└── README.md
```

## What Is Already Built

- Public storefront with Bangla and English switching
- Product catalog and product detail pages
- Cart and checkout flow
- Admin dashboard with protected routes
- NestJS API for auth, categories, products, orders, reviews, settings, and health
- Seed script for demo admin, categories, products, reviews, and public settings

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 2. Configure environment files

Frontend:

```bash
cd frontend
copy .env.example .env.local
```

Backend:

```bash
cd backend
copy .env.example .env
```

### 3. Start the backend

```bash
cd backend
npm run start:dev
```

Backend runs on `http://localhost:4000`.

Health check:

- `http://localhost:4000/api/health`

### 4. Seed demo data

Run this once after the backend can connect to Neon:

```bash
cd backend
npm run seed
```

Seeded demo admin:

- email: `admin@gmail.com`
- password: `13663`

Change this for real deployments.

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`.

Admin login:

- `http://localhost:3000/admin/login`

## Frontend Environment Variables

Create `frontend/.env.local` from `frontend/.env.example`.

Required:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`

Optional:

- `NEXT_PUBLIC_BRAND_NAME`
- `NEXT_PUBLIC_SITE_TAGLINE`
- `NEXT_PUBLIC_API_BASE_URL`

Recommended local values:

```env
NEXT_PUBLIC_BRAND_NAME=FreshBitan
NEXT_PUBLIC_SITE_TAGLINE=Bangladesh mango ecommerce
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Notes:

- `NEXT_PUBLIC_SITE_URL` is used for canonical URLs, Open Graph URLs, `robots.txt`, and `sitemap.xml`
- `NEXT_PUBLIC_API_URL` should point to the deployed NestJS API in production

## Backend Environment Variables

Create `backend/.env` from `backend/.env.example`.

Required:

- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`

Recommended:

- `NODE_ENV`
- `PORT`
- `DB_SYNCHRONIZE`
- `DB_LOGGING`
- `DB_SSL_MODE`

Recommended local values:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://USER:PASSWORD@HOST/dbname?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
FRONTEND_URL=http://localhost:3000
DB_SYNCHRONIZE=false
DB_LOGGING=false
DB_SSL_MODE=require
```

Notes:

- `FRONTEND_URL` can be a comma-separated list when you need both a production URL and a preview URL
- `JWT_SECRET` must be set in production
- `DB_SYNCHRONIZE=false` is the recommended production default
- `DB_SSL_MODE=require` works well for hosted Postgres providers such as Neon

## Build And Run Commands

Frontend:

```bash
cd frontend
npm run build
npm run start
```

Backend:

```bash
cd backend
npm run build
npm run start:prod
```

Useful local commands:

```bash
cd frontend
npm run lint
```

```bash
cd backend
npm run seed
```

## SEO And Production Notes

The frontend now includes:

- page metadata on public routes
- canonical URLs
- Open Graph and Twitter basics
- `robots.txt`
- `sitemap.xml`
- product detail metadata based on real product content

Production notes:

- set `NEXT_PUBLIC_SITE_URL` to the final public domain
- use real product images where possible so product previews look better on social platforms
- keep admin routes blocked from indexing via `robots.txt`

## Deployment Notes

### Frontend on Vercel

Set these environment variables in Vercel:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BRAND_NAME`
- `NEXT_PUBLIC_SITE_TAGLINE`

Build settings:

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output: default Next.js output

Important:

- `NEXT_PUBLIC_SITE_URL` must match the production frontend domain
- `NEXT_PUBLIC_API_URL` must point to the deployed backend API, for example `https://your-api.onrender.com/api`

### Backend on Render or Railway

Set these environment variables:

- `NODE_ENV=production`
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `DB_SYNCHRONIZE=false`
- `DB_LOGGING=false`
- `DB_SSL_MODE=require`

Build and start:

- Build command: `npm install && npm run build`
- Start command: `npm run start:prod`

Important:

- set `FRONTEND_URL` to the exact deployed frontend origin
- keep `JWT_SECRET` long and random
- do not rely on TypeORM `synchronize` for schema changes in production

### Neon PostgreSQL

- create a Neon project and copy the pooled `DATABASE_URL`
- keep `sslmode=require` in the connection string when Neon expects SSL
- verify the deployed backend can reach the database before running the seed

## Production Safety Recommendations

- Use migrations for schema changes instead of enabling `synchronize` in production
- Rotate the default seeded admin password before going live
- Add rate limiting at the platform or reverse-proxy layer for auth and public form endpoints
- Add structured logging or an error monitoring service before launch
- Restrict admin access to trusted users only

## Admin Auth Notes

- Admin login uses the backend auth API
- The frontend stores the admin session in secure `HttpOnly` cookies for browser use
- `/admin` routes are protected and redirect unauthenticated users to `/admin/login`
- Admin API calls are proxied through frontend server routes so the JWT is not exposed to client-side storage

## Troubleshooting

Frontend cannot reach backend:

- verify `NEXT_PUBLIC_API_URL`
- verify the backend is running
- verify CORS `FRONTEND_URL` includes the frontend origin

Admin login fails:

- run `npm run seed` in `backend`
- verify the seeded admin exists
- verify `JWT_SECRET` is set

Database connection fails:

- verify `DATABASE_URL`
- verify Neon network access and SSL settings
- verify the backend can start before running `npm run seed`

Production build fails:

- verify all required environment variables are present
- rebuild both services after changing env values
- make sure the frontend site URL is an absolute URL

## Development Checklist Audit

This checklist reflects the current implementation status across the FreshBitan frontend and backend.

### Completed Features

#### Project Foundation

- [x] Next.js App Router frontend structure is in place
- [x] NestJS backend structure is in place
- [x] TypeORM is configured for PostgreSQL via `DATABASE_URL`
- [x] Neon-compatible database connection flow exists
- [x] Frontend build passes
- [x] Frontend lint passes
- [x] Backend build passes
- [x] Environment and deployment notes exist in this README

#### Public Storefront

- [x] Homepage exists and is data-driven
- [x] About page exists
- [x] Products listing page exists
- [x] Product detail page exists
- [x] Reviews page exists
- [x] Contact page exists
- [x] Cart page exists
- [x] Checkout page exists
- [x] Order success page exists
- [x] Not-found page exists
- [x] Global loading page exists
- [x] Global error page exists
- [x] Responsive header, footer, and floating contact actions exist
- [x] Bangla and English language switching exists

#### Catalog Experience

- [x] Public categories API exists
- [x] Public products API exists
- [x] Public product-by-slug API exists
- [x] Featured products are supported
- [x] Category filtering exists on the storefront
- [x] Product cards and product detail UI exist
- [x] Related products are shown on product detail pages

#### Cart and Checkout

- [x] Client-side cart exists
- [x] Add to cart exists
- [x] Quantity update exists
- [x] Remove from cart exists
- [x] Clear cart exists
- [x] Cart totals and summary exist
- [x] Checkout form exists
- [x] Delivery fee calculation exists
- [x] Order creation API exists
- [x] Checkout success redirect exists

#### Reviews

- [x] Public review submission API exists
- [x] Approved reviews are shown publicly
- [x] Review moderation model exists
- [x] Admin review publish/unpublish exists

#### Admin Authentication and Route Protection

- [x] Admin login page exists
- [x] Backend auth login endpoint exists
- [x] JWT auth exists in the backend
- [x] Frontend admin session uses `HttpOnly` cookies
- [x] Admin logout exists
- [x] Protected admin routes redirect unauthenticated users
- [x] Frontend admin API proxy exists so the JWT is not stored in browser local storage

#### Admin Dashboard

- [x] Admin layout exists
- [x] Sidebar and topbar exist
- [x] Admin overview page exists
- [x] Dashboard summary cards exist
- [x] Latest orders preview exists

#### Admin CRUD

- [x] Product list/create/edit/delete exists
- [x] Product featured toggle exists
- [x] Product published toggle exists
- [x] Category list/create/edit/delete exists
- [x] Orders list exists
- [x] Order detail view exists
- [x] Order status update exists
- [x] Payment status update exists
- [x] Reviews moderation exists
- [x] Settings update exists for site name, support phone, WhatsApp, Facebook, logo, hero title, and hero subtitle

#### Seed and Utilities

- [x] Seed script exists
- [x] Seed creates demo admin data
- [x] Seed creates demo categories, products, reviews, and settings
- [x] Health endpoint exists

#### SEO and Deployment Prep

- [x] Metadata exists for public pages
- [x] Product metadata exists
- [x] Canonical URL support exists
- [x] Open Graph basics exist
- [x] `robots.txt` exists
- [x] `sitemap.xml` exists
- [x] Frontend env documentation exists
- [x] Backend env documentation exists
- [x] Vercel, Render/Railway, and Neon deployment notes exist

### Partially Completed Features

- [ ] Bilingual support exists, but some copy is still mixed between Bangla and English
- [ ] Admin dashboard is practical, but lacks search, filters, sorting, and pagination
- [ ] Checkout supports payment method selection, but not real payment processing
- [ ] Product image support exists, but only through raw image URLs
- [ ] Settings editing works, but content management is still basic and not fully localized at the data layer
- [ ] Public API error handling exists, but some helper fallbacks mask backend outages as empty states
- [ ] Public SEO basics are done, but advanced SEO and structured data are not implemented
- [ ] Storefront responsiveness is good overall, but large admin tables are still awkward on mobile
- [ ] Seed tooling exists, but it is meant for demo/staging usage rather than production provisioning
- [ ] Backend validation exists, but business-rule validation is still incomplete

#### Examples of Incomplete Areas

- [ ] No inventory deduction when orders are placed
- [ ] No stock validation against requested quantities during checkout
- [ ] No duplicate review protection
- [ ] No anti-spam controls on public order/review endpoints
- [ ] No admin user management UI beyond current profile support
- [ ] No migration system despite production database usage
- [ ] Very limited automated test coverage

### Missing Features

- [ ] Real payment gateway integration
- [ ] Payment webhook handling
- [ ] Inventory reservation and low-stock alerts
- [ ] Customer order tracking page
- [ ] Email notifications
- [ ] SMS or WhatsApp notification automation
- [ ] Coupon or discount system
- [ ] Product search
- [ ] Product sorting options
- [ ] Category landing pages with richer SEO content
- [ ] Multiple product image management in admin
- [ ] Image upload or media library
- [ ] Customer authentication and accounts
- [ ] Saved addresses and order history
- [ ] Admin role management UI
- [ ] Admin audit log
- [ ] Rate limiting
- [ ] CSRF hardening layer for admin mutations
- [ ] Structured monitoring, logging, and alerting
- [ ] TypeORM migrations
- [ ] Analytics and conversion tracking
- [ ] JSON-LD structured data

### Backend Audit

#### Implemented Backend Modules

- [x] `auth`
- [x] `admins`
- [x] `categories`
- [x] `products`
- [x] `orders`
- [x] `reviews`
- [x] `settings`
- [x] `health`

#### API Completeness

- [x] Public categories API
- [x] Public products API
- [x] Public product-by-slug API
- [x] Public review create/list API
- [x] Public order create API
- [x] Public settings API
- [x] Admin auth login API
- [x] Admin product CRUD API
- [x] Admin category CRUD API
- [x] Admin orders read/update API
- [x] Admin reviews moderation API
- [x] Admin settings read/update API
- [x] Admin profile API

#### Validation and Security

- [x] DTO validation exists across major modules
- [x] Global `ValidationPipe` is enabled with whitelist and transform
- [x] Password hashes are not exposed in serialized admin responses
- [x] Protected admin endpoints use JWT plus role checks
- [ ] Login password policy is still too weak for production
- [ ] No rate limiting on login, order creation, or review submission
- [ ] No brute-force protection or lockout policy
- [ ] No refresh token or rotation flow
- [ ] No centralized exception filter or structured logging

#### Env and Config

- [x] `DATABASE_URL` is used
- [x] `JWT_SECRET` is used
- [x] `FRONTEND_URL` is used
- [x] `PORT` is used
- [x] TypeORM sync, logging, and SSL are env-driven
- [ ] Migrations workflow is still missing

#### Important Backend Risks

- [ ] Orders do not decrement product stock
- [ ] Orders do not reject quantities above available stock
- [ ] Overselling is possible
- [ ] Seeded admin credentials are hardcoded in source
- [ ] Public endpoints are open to abuse without rate limiting

### Frontend Audit

#### Pages and UX

- [x] Public routes are present and coherent
- [x] Admin routes are present and coherent
- [x] Loading states exist on key pages
- [x] Empty states exist on key pages
- [x] Route-level error and not-found pages exist
- [ ] Public API failures can still appear as empty content rather than obvious outages
- [ ] No customer-facing order lookup/tracking after checkout
- [ ] Some bilingual text remains mixed

#### API Integration

- [x] Public site is connected to backend APIs
- [x] Admin panel is connected to backend APIs
- [x] Admin login is connected end-to-end
- [ ] Admin pages refetch whole datasets repeatedly
- [ ] No pagination or progressive loading for large datasets

#### Responsiveness and UI Polish

- [x] Public site is mobile-friendly overall
- [x] Admin layout adapts for smaller screens
- [ ] Admin tables are still cumbersome on small screens
- [ ] Some image rendering still uses raw `<img>` rather than stronger optimization patterns

### Admin Panel Audit

#### Auth Flow

- [x] Login works via backend auth API
- [x] Session is stored in secure `HttpOnly` cookies
- [x] `/admin` routes are protected
- [x] Logout exists
- [ ] No forgot-password or admin recovery flow
- [ ] No admin session timeout messaging
- [ ] No audit trail for admin actions

#### CRUD Coverage

- [x] Product CRUD works
- [x] Category CRUD works
- [x] Orders read and update works
- [x] Reviews moderation works
- [x] Settings update works

#### Missing Admin Features

- [ ] No image uploader
- [ ] No bulk actions
- [ ] No search/filter/sort/pagination
- [ ] No export tools
- [ ] No multi-admin management UI
- [ ] No stock alerts
- [ ] No order notes or internal operations workflow

### Database Audit

#### Current Entities

- [x] `Admin`
- [x] `Category`
- [x] `Product`
- [x] `ProductImage`
- [x] `Review`
- [x] `Order`
- [x] `OrderItem`
- [x] `SiteSetting`

#### Relations

- [x] Category -> Products
- [x] Product -> Category
- [x] Product -> ProductImages
- [x] Product -> Reviews
- [x] Order -> OrderItems
- [x] OrderItem -> Product
- [x] Review -> Product

#### Missing or Weak Data Areas

- [ ] No inventory movement or reservation table
- [ ] No order status history
- [ ] No payment transaction table
- [ ] No customer table
- [ ] No shipment or tracking fields
- [ ] No coupon/promotion model
- [ ] No admin audit log table
- [ ] No true bilingual content model for products, categories, or settings
- [ ] No soft delete strategy
- [ ] No migration files

### Performance and SEO Audit

#### SEO

- [x] Page metadata exists
- [x] Product metadata exists
- [x] Canonical URLs exist
- [x] Open Graph basics exist
- [x] `robots.txt` exists
- [x] `sitemap.xml` exists
- [ ] No JSON-LD structured data
- [ ] No review rich snippet markup
- [ ] No category-focused SEO content strategy

#### Performance

- [x] Public GET requests use revalidation rather than only `no-store`
- [x] The project builds successfully
- [ ] The app still relies on client wrappers in several shared areas
- [ ] Plain `<img>` usage remains in multiple places
- [ ] No pagination means admin performance will degrade as data grows
- [ ] No advanced caching strategy for large admin datasets

### Bugs and Risk Areas

- [ ] Overselling risk because stock is not validated or decremented on order creation
- [ ] Seeded admin password is hardcoded and weak
- [ ] Public helper fallbacks can hide real API outages
- [ ] Payment method UI suggests more capability than the backend actually supports
- [ ] Cart is local-storage only and can drift from backend stock
- [ ] No automated protection against spam or abuse
- [ ] Minimal test coverage
- [ ] No migration system for production schema changes
- [ ] No monitoring or alerting stack
- [ ] External image URLs may be unreliable or slow

### Final Summary

#### Completion Estimate

- [x] Foundation and architecture: about 90%
- [x] Core storefront flow: about 80%
- [x] Basic admin operations: about 80%
- [x] Production readiness: about 55%
- [x] Overall project completion estimate: about 72%

#### What Is Ready for Production

- [x] Basic public browsing experience
- [x] Basic COD-style order intake
- [x] Simple admin login and protected dashboard
- [x] Small-scale product/category/order/review/settings management
- [x] Basic SEO and deployment preparation
- [x] Staging/demo deployment readiness

#### What Must Be Fixed Before Launch

- [ ] Remove hardcoded seeded admin credentials from real deployment flow
- [ ] Enforce stronger admin password policy
- [ ] Implement stock validation and stock deduction
- [ ] Add TypeORM migrations
- [ ] Add rate limiting for login, reviews, and orders
- [ ] Clarify or implement the real payment flow
- [ ] Improve public outage/error handling
- [ ] Add monitoring/logging
- [ ] Decide on image hosting/upload strategy
- [ ] Finish strict bilingual content cleanup if needed for launch
- [ ] Add test coverage for auth, order creation, stock handling, and admin CRUD

### Prioritized Next-Step Roadmap

#### 1. Security and Launch Blockers

- [ ] Replace seeded admin password with env-driven bootstrap or one-time setup
- [ ] Enforce stronger password rules
- [ ] Add rate limiting for `/auth/login`, `/orders/public`, and `/reviews/public`
- [ ] Review CSRF posture for admin mutations and add hardening if needed

#### 2. Inventory Correctness

- [ ] Validate order quantities against available stock
- [ ] Deduct stock on successful order creation
- [ ] Prevent negative stock and overselling with transaction-safe updates
- [ ] Add low-stock visibility in admin

#### 3. Database Safety

- [ ] Introduce TypeORM migrations
- [ ] Document migration commands for local, staging, and production
- [ ] Stop treating seed data as production provisioning

#### 4. Payment Clarity

- [ ] Either implement a real payment gateway
- [ ] Or reduce payment options to what is actually supported now
- [ ] If a gateway is added, implement webhook verification and payment transaction storage

#### 5. Public Reliability

- [ ] Stop masking public API failures as empty results
- [ ] Add clearer error UI for backend downtime
- [ ] Add customer-facing order lookup/tracking page

#### 6. Admin Scalability

- [ ] Add search, filter, sort, and pagination to products, orders, and reviews
- [ ] Add bulk actions where useful
- [ ] Add order notes and internal operations workflow

#### 7. Content and Media

- [ ] Add image upload/media storage
- [ ] Support multiple images properly in admin
- [ ] Clean up mixed Bangla/English strings
- [ ] Make product, category, and settings content truly bilingual in data if needed

#### 8. SEO and Growth

- [ ] Add JSON-LD structured data
- [ ] Add category-focused SEO content
- [ ] Add analytics and search console verification
- [ ] Improve image strategy for social sharing and performance

#### 9. Quality and Observability

- [ ] Add backend tests for auth, orders, reviews, and products
- [ ] Add frontend tests for checkout and admin critical flows
- [ ] Add logging and monitoring
- [ ] Add a production troubleshooting checklist
