# GharKa - Master Architecture Document

**Version**: 1.0.0
**Last Updated**: 2026-05-08
**Status**: Canonical Source of Truth
**Document Owner**: AI Engineer Agent

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Decision Matrix](#2-tech-stack-decision-matrix)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Role-Based Access Matrix](#4-role-based-access-matrix)
5. [Database Schema](#5-database-schema)
6. [API Endpoints](#6-api-endpoints)
7. [Authentication Flow](#7-authentication-flow)
8. [5km Radius Implementation](#8-5km-radius-implementation)
9. [Real-Time Chat Architecture](#9-real-time-chat-architecture)
10. [Three.js and Animation Strategy](#10-threejs-and-animation-strategy)
11. [Security Architecture](#11-security-architecture)
12. [Naming Conventions and Code Standards](#12-naming-conventions-and-code-standards)
13. [Task Execution Order](#13-task-execution-order)
14. [Environment Configuration](#14-environment-configuration)
15. [Deployment Architecture](#15-deployment-architecture)

---

## 1. Project Overview

### What is GharKa?

GharKa is a hyperlocal homemade food marketplace for gated communities. Think of it as a structured WhatsApp group where neighbors can share homemade food, but as a proper application with listings, ordering, and direct messaging.

### Core Product Principles

- **Extreme simplicity**: The app does very few things, but does them well.
- **No payment gateway**: All payments are handled offline (cash, UPI outside the app). The app only tracks order status.
- **No guarantees**: The platform is a marketplace connector. No refund flow, no dispute resolution in v1.
- **Hyperlocal only**: Everything is scoped to a 5km radius from the buyer.
- **Grand UI**: The functional surface is small, so the visual experience must be exceptional. Three.js animations, micro-interactions, and polished motion design elevate a simple CRUD app into something memorable.

### Core User Flows

```
SELLER FLOW:
Phone OTP login -> Post food listing (title, description, photos, price, qty, category)
-> Receive order notifications -> Chat with buyer -> Mark order picked up/completed

BUYER FLOW:
Phone OTP login -> Browse nearby listings (5km radius) -> Place order (quantity)
-> Chat with seller -> Pick up food -> Mark order completed

ADMIN FLOW:
Login (phone number matches env variable) -> View all users -> Suspend/activate users
-> Moderate listings (remove inappropriate) -> View platform stats
```

---

## 2. Tech Stack Decision Matrix

### Frontend - Web: Next.js 14 (App Router)

| Factor | Decision | Justification |
|--------|----------|---------------|
| Framework | Next.js 14 with App Router | Server-side rendering for SEO on listing pages. App Router provides React Server Components, reducing client bundle size. Image optimization built-in for food photos. API routes can serve as a BFF (Backend for Frontend) layer if needed. |
| Styling | Tailwind CSS 3.4 | Utility-first approach speeds development. JIT compiler keeps bundle small. Strong community and component library ecosystem (shadcn/ui). |
| Component Library | shadcn/ui | Not a dependency -- copies components into the project. Full control over styling. Built on Radix UI primitives for accessibility. |
| State Management | Zustand | Minimal boilerplate compared to Redux. Small bundle size (1.1kb). Works well with Next.js App Router. Perfect for a small app that needs global state for auth and cart-like order state. |
| Data Fetching | TanStack Query (React Query) v5 | Caching, background refetching, optimistic updates for listings. Deduplication of requests. Stale-while-revalidate pattern for food listings that change frequently. |
| 3D/Animations | Three.js + React Three Fiber + Framer Motion | Three.js via React Three Fiber for 3D hero animations. Framer Motion for page transitions, micro-interactions, and layout animations. This combination allows grand visual effects while keeping the interaction layer accessible. |
| Form Handling | React Hook Form + Zod | Performant uncontrolled forms. Zod schemas shared with backend for validation consistency. |

### Frontend - Mobile: React Native + Expo SDK 52

| Factor | Decision | Justification |
|--------|----------|---------------|
| Framework | Expo SDK 52 (managed workflow) | Faster development with managed builds. OTA updates via EAS Update. No native code to maintain for v1. Push notifications via Expo Notifications. |
| Navigation | Expo Router v3 | File-based routing matching Next.js mental model. Deep linking support out of the box. |
| UI Components | React Native Paper or Tamagui | Cross-platform components with Material Design or custom theming. |
| Maps | react-native-maps | Native map integration for showing nearby listings. |
| Location | expo-location | GPS access for 5km radius filtering. |
| 3D on Mobile | Three.js via expo-gl + expo-three | Same Three.js animations adapted for mobile GPU. Framer Motion replaced with Reanimated 3 for gesture-driven animations. |

### Backend: Node.js + Fastify

| Factor | Decision | Justification |
|--------|----------|---------------|
| Runtime | Node.js 20 LTS | JavaScript across the full stack reduces context switching. LTS ensures stability. |
| Framework | Fastify 4 | 2-3x faster than Express in benchmarks. Built-in schema validation via JSON Schema (pairs with Zod on frontend). Built-in logging via Pino. Plugin architecture is cleaner than Express middleware chains. TypeBox for type-safe route schemas. |
| Why not Express? | Performance and architecture | Express is middleware-soup for a new project. Fastify's encapsulation model (plugins with scoped decorators) is a better fit for a cleanly separated API. |
| Language | TypeScript 5.4 | Shared types between frontend and backend. Catches bugs at compile time. Better IDE support. |
| ORM | Drizzle ORM | Type-safe SQL queries. Lightweight compared to Prisma (no query engine binary). Supports PostGIS via raw SQL escape hatches. Migrations are plain SQL files. |
| Validation | Zod (shared with frontend) | Single source of truth for request/response schemas. Coercion for query params. |

### Database: PostgreSQL 16 + PostGIS 3.4

| Factor | Decision | Justification |
|--------|----------|---------------|
| Database | PostgreSQL 16 | Industry standard for relational data. JSONB for flexible metadata. Full-text search for food listing search. Battle-tested at scale. |
| Geolocation | PostGIS 3.4 extension | Native spatial data types (GEOGRAPHY). ST_DWithin for efficient 5km radius queries using spatial indexes (GIST). Orders of magnitude faster than application-level Haversine. |
| Why not MongoDB? | Relational data model | Users, listings, orders, and messages have clear relationships. Foreign keys enforce data integrity. Join queries are natural (e.g., "get all listings by this seller with their order counts"). PostGIS is a decisive advantage for geo queries. |
| Hosting | Supabase (PostgreSQL) or Railway | Managed PostgreSQL with PostGIS enabled. Supabase also provides realtime subscriptions as a bonus, but we use Socket.io for chat. |

### Authentication: Firebase Auth (Phone + OTP)

| Factor | Decision | Justification |
|--------|----------|---------------|
| Provider | Firebase Authentication | Free tier supports 10,000 verifications/month. Phone+OTP is the only auth method needed (no email/password complexity). SDK handles OTP delivery, retry logic, and rate limiting on Google's infrastructure. reCAPTCHA integration prevents abuse. |
| Why not Twilio Verify? | Cost and complexity | Twilio charges per verification ($0.05/verify). Firebase is free up to 10k/month. Firebase also handles the full auth state, JWT token generation, and session management. With Twilio you build all of that yourself. |
| Token Strategy | Firebase ID Token + Custom JWT | Firebase issues the ID token after OTP verification. Backend verifies the Firebase token, then issues its own JWT (with role, userId, location) for subsequent API calls. This decouples the API from Firebase after initial auth. |

### Real-Time: Socket.io 4

| Factor | Decision | Justification |
|--------|----------|---------------|
| Library | Socket.io 4 | Automatic transport fallback (WebSocket -> HTTP long-polling). Room-based architecture maps naturally to order-based chat threads. Built-in reconnection handling. Namespace support for separating chat from notification events. |
| Why not raw WebSocket? | Reliability | Raw WebSocket has no reconnection, no fallback, no room abstraction. Socket.io handles all edge cases (mobile network switches, background/foreground transitions). |
| Why not Supabase Realtime? | Control | Socket.io gives full control over message routing, typing indicators, read receipts. Supabase Realtime is better for database change subscriptions, not conversational chat. |

### Image Storage: Cloudinary

| Factor | Decision | Justification |
|--------|----------|---------------|
| Provider | Cloudinary (free tier: 25 credits/month) | On-the-fly image transformations (resize, crop, format conversion). Automatic WebP/AVIF delivery based on browser. Upload widget with client-side cropping. CDN delivery built-in. |
| Why not S3? | Transformation overhead | S3 stores raw files. You would need a separate service (Sharp, Lambda@Edge, CloudFront Functions) to resize and optimize images. Cloudinary bundles storage, transformation, and CDN into one service. For a food app where image quality and load speed directly impact appetite appeal, this matters. |
| Upload Strategy | Signed upload from client | Client uploads directly to Cloudinary using a signed upload preset. Backend generates the signature. This avoids routing large image files through the Node.js server. |

### Summary Table

| Layer | Technology | Version |
|-------|-----------|---------|
| Web Frontend | Next.js (App Router) | 14.x |
| Mobile Frontend | React Native + Expo | SDK 52 |
| Backend Framework | Fastify | 4.x |
| Language | TypeScript | 5.4 |
| Database | PostgreSQL + PostGIS | 16 + 3.4 |
| ORM | Drizzle ORM | 0.30+ |
| Auth | Firebase Authentication | 10.x |
| Real-time | Socket.io | 4.x |
| Image Storage | Cloudinary | SDK 2.x |
| 3D Rendering | Three.js + React Three Fiber | r160+ / 8.x |
| Animation | Framer Motion | 11.x |
| CSS | Tailwind CSS | 3.4 |
| Component Library | shadcn/ui | latest |
| State Management | Zustand | 4.x |
| Data Fetching | TanStack Query | 5.x |
| Validation | Zod | 3.x |

---

## 3. Monorepo Structure

The project uses a **pnpm workspace monorepo**. All packages share TypeScript configs, ESLint rules, and Zod validation schemas.

```
gharka/
|-- package.json                    # Root: pnpm workspace config
|-- pnpm-workspace.yaml             # Workspace member definitions
|-- turbo.json                      # Turborepo pipeline config
|-- tsconfig.base.json              # Shared TypeScript config
|-- .env.example                    # Template for environment variables
|-- .gitignore
|-- .eslintrc.js                    # Root ESLint config
|-- .prettierrc                     # Prettier config
|
|-- packages/
|   |-- shared/                     # Shared code across all apps
|   |   |-- package.json
|   |   |-- tsconfig.json
|   |   |-- src/
|   |   |   |-- schemas/            # Zod validation schemas (single source of truth)
|   |   |   |   |-- user.schema.ts
|   |   |   |   |-- listing.schema.ts
|   |   |   |   |-- order.schema.ts
|   |   |   |   |-- message.schema.ts
|   |   |   |   |-- auth.schema.ts
|   |   |   |   |-- index.ts
|   |   |   |-- types/              # TypeScript type definitions
|   |   |   |   |-- user.types.ts
|   |   |   |   |-- listing.types.ts
|   |   |   |   |-- order.types.ts
|   |   |   |   |-- message.types.ts
|   |   |   |   |-- api.types.ts    # API request/response types
|   |   |   |   |-- index.ts
|   |   |   |-- constants/          # Shared constants
|   |   |   |   |-- roles.ts        # ADMIN, SELLER, BUYER
|   |   |   |   |-- order-status.ts # PENDING, CONFIRMED, PICKED_UP, etc.
|   |   |   |   |-- categories.ts   # Food categories
|   |   |   |   |-- index.ts
|   |   |   |-- utils/              # Shared utility functions
|   |   |   |   |-- geo.ts          # Haversine distance (client-side fallback)
|   |   |   |   |-- format.ts       # Currency, date formatters
|   |   |   |   |-- index.ts
|   |   |   |-- index.ts            # Barrel export
|
|-- apps/
|   |-- api/                        # Fastify backend
|   |   |-- package.json
|   |   |-- tsconfig.json
|   |   |-- drizzle.config.ts       # Drizzle ORM config
|   |   |-- Dockerfile
|   |   |-- src/
|   |   |   |-- index.ts            # Server entry point
|   |   |   |-- app.ts              # Fastify app factory
|   |   |   |-- config/
|   |   |   |   |-- env.ts          # Environment variable parsing (Zod)
|   |   |   |   |-- database.ts     # DB connection config
|   |   |   |   |-- firebase.ts     # Firebase Admin SDK init
|   |   |   |   |-- cloudinary.ts   # Cloudinary config
|   |   |   |   |-- cors.ts         # CORS whitelist
|   |   |   |-- db/
|   |   |   |   |-- schema.ts       # Drizzle schema definitions
|   |   |   |   |-- index.ts        # DB client export
|   |   |   |   |-- migrations/     # SQL migration files
|   |   |   |   |   |-- 0000_initial_schema.sql
|   |   |   |   |   |-- 0001_add_postgis.sql
|   |   |   |   |-- seed.ts         # Development seed data
|   |   |   |-- plugins/            # Fastify plugins
|   |   |   |   |-- auth.plugin.ts          # JWT verification decorator
|   |   |   |   |-- role-guard.plugin.ts    # Role-based access control
|   |   |   |   |-- rate-limit.plugin.ts    # Rate limiting config
|   |   |   |   |-- socket.plugin.ts        # Socket.io integration
|   |   |   |   |-- error-handler.plugin.ts # Global error handling
|   |   |   |-- modules/            # Feature modules (domain-driven)
|   |   |   |   |-- auth/
|   |   |   |   |   |-- auth.routes.ts
|   |   |   |   |   |-- auth.controller.ts
|   |   |   |   |   |-- auth.service.ts
|   |   |   |   |-- users/
|   |   |   |   |   |-- users.routes.ts
|   |   |   |   |   |-- users.controller.ts
|   |   |   |   |   |-- users.service.ts
|   |   |   |   |-- listings/
|   |   |   |   |   |-- listings.routes.ts
|   |   |   |   |   |-- listings.controller.ts
|   |   |   |   |   |-- listings.service.ts
|   |   |   |   |-- orders/
|   |   |   |   |   |-- orders.routes.ts
|   |   |   |   |   |-- orders.controller.ts
|   |   |   |   |   |-- orders.service.ts
|   |   |   |   |-- messages/
|   |   |   |   |   |-- messages.routes.ts
|   |   |   |   |   |-- messages.controller.ts
|   |   |   |   |   |-- messages.service.ts
|   |   |   |   |   |-- messages.gateway.ts  # Socket.io event handlers
|   |   |   |   |-- admin/
|   |   |   |   |   |-- admin.routes.ts
|   |   |   |   |   |-- admin.controller.ts
|   |   |   |   |   |-- admin.service.ts
|   |   |   |   |-- upload/
|   |   |   |   |   |-- upload.routes.ts
|   |   |   |   |   |-- upload.controller.ts
|   |   |   |   |   |-- upload.service.ts
|   |   |   |-- middleware/
|   |   |   |   |-- authenticate.ts         # Verify JWT, attach user to request
|   |   |   |   |-- authorize.ts            # Check role permissions
|   |   |   |   |-- validate.ts             # Zod schema validation
|   |   |   |   |-- sanitize.ts             # Input sanitization (XSS)
|   |   |   |-- utils/
|   |   |   |   |-- jwt.ts                  # JWT sign/verify helpers
|   |   |   |   |-- geo-query.ts            # PostGIS query builders
|   |   |   |   |-- pagination.ts           # Cursor-based pagination
|   |   |   |   |-- logger.ts               # Pino logger config
|   |
|   |-- web/                        # Next.js web application
|   |   |-- package.json
|   |   |-- tsconfig.json
|   |   |-- next.config.js
|   |   |-- tailwind.config.ts
|   |   |-- postcss.config.js
|   |   |-- public/
|   |   |   |-- fonts/
|   |   |   |-- images/
|   |   |   |-- models/             # 3D model assets (.glb, .gltf)
|   |   |-- src/
|   |   |   |-- app/                # Next.js App Router
|   |   |   |   |-- layout.tsx      # Root layout (providers, fonts)
|   |   |   |   |-- page.tsx        # Landing page (Three.js hero)
|   |   |   |   |-- loading.tsx     # Global loading state
|   |   |   |   |-- error.tsx       # Global error boundary
|   |   |   |   |-- not-found.tsx   # 404 page
|   |   |   |   |-- (auth)/         # Auth route group
|   |   |   |   |   |-- login/
|   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |-- verify/
|   |   |   |   |   |   |-- page.tsx
|   |   |   |   |-- (main)/         # Authenticated route group
|   |   |   |   |   |-- layout.tsx  # Sidebar/navbar layout
|   |   |   |   |   |-- feed/       # Food listing feed
|   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |   |-- [id]/
|   |   |   |   |   |   |   |-- page.tsx  # Listing detail
|   |   |   |   |   |-- sell/       # Create/manage listings
|   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |   |-- new/
|   |   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |   |-- [id]/
|   |   |   |   |   |   |   |-- edit/
|   |   |   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |-- orders/
|   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |   |-- [id]/
|   |   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |-- chat/
|   |   |   |   |   |   |-- page.tsx        # Conversation list
|   |   |   |   |   |   |-- [orderId]/
|   |   |   |   |   |   |   |-- page.tsx    # Chat thread
|   |   |   |   |   |-- profile/
|   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |-- admin/      # Admin-only routes
|   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |   |-- users/
|   |   |   |   |   |   |   |-- page.tsx
|   |   |   |   |   |   |-- listings/
|   |   |   |   |   |   |   |-- page.tsx
|   |   |   |-- components/
|   |   |   |   |-- ui/             # shadcn/ui components (auto-generated)
|   |   |   |   |   |-- button.tsx
|   |   |   |   |   |-- input.tsx
|   |   |   |   |   |-- card.tsx
|   |   |   |   |   |-- dialog.tsx
|   |   |   |   |   |-- ...
|   |   |   |   |-- layout/         # Layout components
|   |   |   |   |   |-- navbar.tsx
|   |   |   |   |   |-- sidebar.tsx
|   |   |   |   |   |-- footer.tsx
|   |   |   |   |   |-- mobile-nav.tsx
|   |   |   |   |-- three/          # Three.js / R3F components
|   |   |   |   |   |-- hero-scene.tsx        # Landing page 3D scene
|   |   |   |   |   |-- food-particle.tsx     # Animated food particles
|   |   |   |   |   |-- floating-plate.tsx    # 3D plate model
|   |   |   |   |   |-- background-blob.tsx   # Organic background shape
|   |   |   |   |   |-- canvas-wrapper.tsx    # R3F Canvas with Suspense
|   |   |   |   |-- listings/       # Listing-specific components
|   |   |   |   |   |-- listing-card.tsx
|   |   |   |   |   |-- listing-grid.tsx
|   |   |   |   |   |-- listing-form.tsx
|   |   |   |   |   |-- listing-detail.tsx
|   |   |   |   |   |-- category-filter.tsx
|   |   |   |   |   |-- distance-badge.tsx
|   |   |   |   |-- orders/
|   |   |   |   |   |-- order-card.tsx
|   |   |   |   |   |-- order-status-badge.tsx
|   |   |   |   |   |-- order-timeline.tsx
|   |   |   |   |-- chat/
|   |   |   |   |   |-- chat-bubble.tsx
|   |   |   |   |   |-- chat-input.tsx
|   |   |   |   |   |-- conversation-list.tsx
|   |   |   |   |   |-- typing-indicator.tsx
|   |   |   |   |-- auth/
|   |   |   |   |   |-- phone-input.tsx
|   |   |   |   |   |-- otp-input.tsx
|   |   |   |   |-- shared/
|   |   |   |   |   |-- image-upload.tsx
|   |   |   |   |   |-- location-picker.tsx
|   |   |   |   |   |-- empty-state.tsx
|   |   |   |   |   |-- loading-skeleton.tsx
|   |   |   |-- hooks/
|   |   |   |   |-- use-auth.ts
|   |   |   |   |-- use-location.ts
|   |   |   |   |-- use-socket.ts
|   |   |   |   |-- use-listings.ts
|   |   |   |   |-- use-orders.ts
|   |   |   |   |-- use-messages.ts
|   |   |   |   |-- use-debounce.ts
|   |   |   |-- lib/
|   |   |   |   |-- api-client.ts   # Axios/fetch wrapper with auth headers
|   |   |   |   |-- firebase.ts     # Firebase client SDK init
|   |   |   |   |-- socket.ts       # Socket.io client singleton
|   |   |   |   |-- cloudinary.ts   # Upload helpers
|   |   |   |   |-- query-client.ts # TanStack Query client config
|   |   |   |-- providers/
|   |   |   |   |-- auth-provider.tsx
|   |   |   |   |-- query-provider.tsx
|   |   |   |   |-- socket-provider.tsx
|   |   |   |   |-- theme-provider.tsx
|   |   |   |-- stores/
|   |   |   |   |-- auth-store.ts
|   |   |   |   |-- location-store.ts
|   |   |   |   |-- ui-store.ts
|   |   |   |-- styles/
|   |   |   |   |-- globals.css
|   |
|   |-- mobile/                     # React Native / Expo app
|   |   |-- package.json
|   |   |-- tsconfig.json
|   |   |-- app.json                # Expo config
|   |   |-- eas.json                # EAS Build config
|   |   |-- app/                    # Expo Router (file-based routing)
|   |   |   |-- _layout.tsx         # Root layout
|   |   |   |-- (auth)/
|   |   |   |   |-- login.tsx
|   |   |   |   |-- verify.tsx
|   |   |   |-- (tabs)/
|   |   |   |   |-- _layout.tsx     # Tab navigator
|   |   |   |   |-- feed.tsx
|   |   |   |   |-- orders.tsx
|   |   |   |   |-- chat.tsx
|   |   |   |   |-- profile.tsx
|   |   |   |-- listing/
|   |   |   |   |-- [id].tsx
|   |   |   |-- sell/
|   |   |   |   |-- index.tsx
|   |   |   |   |-- new.tsx
|   |   |   |-- admin/
|   |   |   |   |-- index.tsx
|   |   |-- components/             # Mobile-specific components
|   |   |-- hooks/                  # Mobile-specific hooks
|   |   |-- lib/                    # Mobile-specific utilities
|   |   |-- assets/                 # Images, fonts, 3D models
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "db:migrate": {
      "cache": false
    },
    "db:seed": {
      "cache": false
    }
  }
}
```

---

## 4. Role-Based Access Matrix

### Role Definitions

| Role | How Assigned | Description |
|------|-------------|-------------|
| `BUYER` | Default on registration | Every new user starts as a buyer. Can browse and order. |
| `SELLER` | Self-upgrade via profile | Any buyer can become a seller by filling out their profile (name, avatar, location). This toggles their role to SELLER. Sellers retain all buyer permissions. |
| `ADMIN` | Phone number matches `ADMIN_PHONE_NUMBERS` env variable | Hardcoded. Cannot be self-assigned. On OTP verification, the backend checks if the phone number is in the admin list and assigns the ADMIN role automatically. Admins retain all seller and buyer permissions. |

### Permission Matrix

```
Permission                          | BUYER | SELLER | ADMIN
------------------------------------|-------|--------|------
View food listings (within 5km)     |  YES  |  YES   | YES
View listing detail                 |  YES  |  YES   | YES
Search/filter listings              |  YES  |  YES   | YES
Place an order                      |  YES  |  YES   | YES
View own orders (as buyer)          |  YES  |  YES   | YES
Cancel own order (if PENDING)       |  YES  |  YES   | YES
Send/receive chat messages          |  YES  |  YES   | YES
Edit own profile                    |  YES  |  YES   | YES
Upload avatar                       |  YES  |  YES   | YES
Create food listing                 |  NO   |  YES   | YES
Edit own food listing               |  NO   |  YES   | YES
Delete own food listing             |  NO   |  YES   | YES
View received orders (as seller)    |  NO   |  YES   | YES
Update order status                 |  NO   |  YES   | YES
View all users                      |  NO   |  NO    | YES
Suspend/activate user               |  NO   |  NO    | YES
Delete any listing                  |  NO   |  NO    | YES
View platform statistics            |  NO   |  NO    | YES
Force-close any order               |  NO   |  NO    | YES
```

### Role Hierarchy

ADMIN > SELLER > BUYER. Each higher role inherits all permissions of lower roles. The `authorize` middleware accepts an array of allowed roles:

```typescript
// middleware/authorize.ts - Pattern (not full implementation)

type Role = 'ADMIN' | 'SELLER' | 'BUYER';

const ROLE_HIERARCHY: Record<Role, number> = {
  BUYER: 1,
  SELLER: 2,
  ADMIN: 3,
};

function authorize(minimumRole: Role) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user.role as Role;
    if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[minimumRole]) {
      return reply.status(403).send({
        error: 'FORBIDDEN',
        message: `This action requires ${minimumRole} role or higher`,
      });
    }
  };
}
```

### Admin Phone Number Configuration

Admin phone numbers are stored ONLY in environment variables. They are never stored in the database role column as a source of truth for admin status.

```bash
# .env
ADMIN_PHONE_NUMBERS=+919876543210,+919876543211
```

On login, the auth service checks:

```typescript
// Pseudocode pattern for admin detection
function determineRole(phoneNumber: string): Role {
  const adminPhones = process.env.ADMIN_PHONE_NUMBERS?.split(',') || [];
  if (adminPhones.includes(phoneNumber)) return 'ADMIN';
  // Check if user has completed seller profile
  // if (user.hasSellerProfile) return 'SELLER';
  return 'BUYER';
}
```

---

## 5. Database Schema

### Entity Relationship Diagram (Textual)

```
Users 1---* FoodListings (seller_id)
Users 1---* Orders (buyer_id)
FoodListings 1---* Orders (listing_id)
Orders 1---* Messages (order_id)
Users 1---* Messages (sender_id)
Users 1---* Messages (receiver_id)
```

### PostGIS Setup

```sql
-- Migration: 0001_add_postgis.sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Table: users

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(15) UNIQUE NOT NULL,
    name            VARCHAR(100),
    avatar_url      TEXT,
    role            VARCHAR(10) NOT NULL DEFAULT 'BUYER'
                    CHECK (role IN ('BUYER', 'SELLER', 'ADMIN')),
    location        GEOGRAPHY(POINT, 4326),  -- PostGIS POINT (lon, lat) in WGS84
    address_text    VARCHAR(255),             -- Human-readable address string
    is_active       BOOLEAN NOT NULL DEFAULT true,
    push_token      TEXT,                     -- Expo push notification token
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_phone ON users (phone);
CREATE INDEX idx_users_location ON users USING GIST (location);
CREATE INDEX idx_users_role ON users (role);
```

### Table: food_listings

```sql
CREATE TABLE food_listings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(150) NOT NULL,
    description         TEXT,
    images              TEXT[] NOT NULL DEFAULT '{}',   -- Array of Cloudinary URLs
    price               NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    currency            VARCHAR(3) NOT NULL DEFAULT 'INR',
    quantity            INTEGER NOT NULL CHECK (quantity > 0),
    available_quantity  INTEGER NOT NULL CHECK (available_quantity >= 0),
    location            GEOGRAPHY(POINT, 4326) NOT NULL,  -- Seller location at time of posting
    category            VARCHAR(50) NOT NULL
                        CHECK (category IN (
                            'breakfast', 'lunch', 'dinner', 'snacks',
                            'desserts', 'beverages', 'tiffin', 'other'
                        )),
    dietary_tags        TEXT[] DEFAULT '{}',  -- e.g., ['vegetarian', 'vegan', 'jain']
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ NOT NULL  -- Food expiry (seller sets; default +8 hours)
);

-- Indexes
CREATE INDEX idx_listings_seller ON food_listings (seller_id);
CREATE INDEX idx_listings_location ON food_listings USING GIST (location);
CREATE INDEX idx_listings_active ON food_listings (is_active) WHERE is_active = true;
CREATE INDEX idx_listings_category ON food_listings (category);
CREATE INDEX idx_listings_expires ON food_listings (expires_at);
CREATE INDEX idx_listings_created ON food_listings (created_at DESC);

-- Composite index for the most common query: active listings near me, newest first
CREATE INDEX idx_listings_active_location ON food_listings USING GIST (location)
    WHERE is_active = true;
```

### Table: orders

```sql
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id      UUID NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
    seller_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Denormalized for query speed
    quantity        INTEGER NOT NULL CHECK (quantity > 0),
    total_price     NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN (
                        'PENDING',      -- Buyer placed, awaiting seller confirmation
                        'CONFIRMED',    -- Seller accepted
                        'READY',        -- Food is ready for pickup
                        'PICKED_UP',    -- Buyer picked up
                        'COMPLETED',    -- Both parties satisfied
                        'CANCELLED'     -- Cancelled by buyer or seller
                    )),
    cancelled_by    UUID REFERENCES users(id),  -- NULL unless cancelled
    cancel_reason   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_buyer ON orders (buyer_id);
CREATE INDEX idx_orders_seller ON orders (seller_id);
CREATE INDEX idx_orders_listing ON orders (listing_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created ON orders (created_at DESC);
```

### Order Status State Machine

```
PENDING --> CONFIRMED --> READY --> PICKED_UP --> COMPLETED
   |            |
   v            v
CANCELLED   CANCELLED

Allowed transitions:
  PENDING    -> CONFIRMED  (by seller)
  PENDING    -> CANCELLED  (by buyer or seller)
  CONFIRMED  -> READY      (by seller)
  CONFIRMED  -> CANCELLED  (by seller)
  READY      -> PICKED_UP  (by buyer)
  PICKED_UP  -> COMPLETED  (by buyer or seller)
```

```typescript
// Enforced in orders.service.ts
const ALLOWED_TRANSITIONS: Record<string, { nextStates: string[]; allowedRoles: Role[] }> = {
  PENDING:    { nextStates: ['CONFIRMED', 'CANCELLED'], allowedRoles: ['SELLER', 'BUYER'] },
  CONFIRMED:  { nextStates: ['READY', 'CANCELLED'],    allowedRoles: ['SELLER'] },
  READY:      { nextStates: ['PICKED_UP'],              allowedRoles: ['BUYER'] },
  PICKED_UP:  { nextStates: ['COMPLETED'],              allowedRoles: ['BUYER', 'SELLER'] },
  COMPLETED:  { nextStates: [],                         allowedRoles: [] },
  CANCELLED:  { nextStates: [],                         allowedRoles: [] },
};
```

### Table: messages

```sql
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL CHECK (char_length(content) <= 2000),
    message_type    VARCHAR(10) NOT NULL DEFAULT 'text'
                    CHECK (message_type IN ('text', 'image', 'system')),
    is_read         BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_order ON messages (order_id);
CREATE INDEX idx_messages_sender ON messages (sender_id);
CREATE INDEX idx_messages_receiver ON messages (receiver_id);
CREATE INDEX idx_messages_created ON messages (order_id, created_at ASC);
CREATE INDEX idx_messages_unread ON messages (receiver_id, is_read) WHERE is_read = false;
```

### Chat Architecture Note

Chat is scoped to orders. There is no free-form messaging between arbitrary users. When a buyer places an order, a chat thread is implicitly created (the order_id IS the conversation ID). This prevents spam and gives context to every conversation.

### Table: refresh_tokens

```sql
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(128) NOT NULL,  -- SHA-256 hash of the refresh token
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at      TIMESTAMPTZ           -- Non-null means revoked
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens (token_hash);
```

### Drizzle ORM Schema Definition

```typescript
// apps/api/src/db/schema.ts

import { pgTable, uuid, varchar, text, numeric, integer,
         boolean, timestamp, index } from 'drizzle-orm/pg-core';
// PostGIS types handled via sql`` template literals in Drizzle

export const users = pgTable('users', {
  id:           uuid('id').primaryKey().defaultRandom(),
  phone:        varchar('phone', { length: 15 }).unique().notNull(),
  name:         varchar('name', { length: 100 }),
  avatarUrl:    text('avatar_url'),
  role:         varchar('role', { length: 10 }).notNull().default('BUYER'),
  // location handled via raw SQL for PostGIS GEOGRAPHY type
  addressText:  varchar('address_text', { length: 255 }),
  isActive:     boolean('is_active').notNull().default(true),
  pushToken:    text('push_token'),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  phoneIdx:     index('idx_users_phone').on(table.phone),
  roleIdx:      index('idx_users_role').on(table.role),
}));

export const foodListings = pgTable('food_listings', {
  id:                uuid('id').primaryKey().defaultRandom(),
  sellerId:          uuid('seller_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title:             varchar('title', { length: 150 }).notNull(),
  description:       text('description'),
  images:            text('images').array().notNull().default([]),
  price:             numeric('price', { precision: 10, scale: 2 }).notNull(),
  currency:          varchar('currency', { length: 3 }).notNull().default('INR'),
  quantity:          integer('quantity').notNull(),
  availableQuantity: integer('available_quantity').notNull(),
  // location handled via raw SQL for PostGIS GEOGRAPHY type
  category:          varchar('category', { length: 50 }).notNull(),
  dietaryTags:       text('dietary_tags').array().default([]),
  isActive:          boolean('is_active').notNull().default(true),
  createdAt:         timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:         timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt:         timestamp('expires_at', { withTimezone: true }).notNull(),
}, (table) => ({
  sellerIdx:    index('idx_listings_seller').on(table.sellerId),
  categoryIdx:  index('idx_listings_category').on(table.category),
  expiresIdx:   index('idx_listings_expires').on(table.expiresAt),
  createdIdx:   index('idx_listings_created').on(table.createdAt),
}));

export const orders = pgTable('orders', {
  id:            uuid('id').primaryKey().defaultRandom(),
  buyerId:       uuid('buyer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listingId:     uuid('listing_id').notNull().references(() => foodListings.id, { onDelete: 'cascade' }),
  sellerId:      uuid('seller_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  quantity:      integer('quantity').notNull(),
  totalPrice:    numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  status:        varchar('status', { length: 20 }).notNull().default('PENDING'),
  cancelledBy:   uuid('cancelled_by').references(() => users.id),
  cancelReason:  text('cancel_reason'),
  createdAt:     timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:     timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  buyerIdx:    index('idx_orders_buyer').on(table.buyerId),
  sellerIdx:   index('idx_orders_seller').on(table.sellerId),
  listingIdx:  index('idx_orders_listing').on(table.listingId),
  statusIdx:   index('idx_orders_status').on(table.status),
  createdIdx:  index('idx_orders_created').on(table.createdAt),
}));

export const messages = pgTable('messages', {
  id:           uuid('id').primaryKey().defaultRandom(),
  orderId:      uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  senderId:     uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId:   uuid('receiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content:      text('content').notNull(),
  messageType:  varchar('message_type', { length: 10 }).notNull().default('text'),
  isRead:       boolean('is_read').notNull().default(false),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  orderIdx:    index('idx_messages_order').on(table.orderId),
  senderIdx:   index('idx_messages_sender').on(table.senderId),
  receiverIdx: index('idx_messages_receiver').on(table.receiverId),
  createdIdx:  index('idx_messages_created').on(table.orderId, table.createdAt),
}));

export const refreshTokens = pgTable('refresh_tokens', {
  id:         uuid('id').primaryKey().defaultRandom(),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash:  varchar('token_hash', { length: 128 }).notNull(),
  expiresAt:  timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt:  timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  revokedAt:  timestamp('revoked_at', { withTimezone: true }),
}, (table) => ({
  userIdx:  index('idx_refresh_tokens_user').on(table.userId),
  hashIdx:  index('idx_refresh_tokens_hash').on(table.tokenHash),
}));
```

---

## 6. API Endpoints

### Base URL

```
Development: http://localhost:3001/api/v1
Production:  https://api.gharka.app/api/v1
```

### Response Envelope

All API responses follow a consistent envelope:

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": {               // Optional, present on paginated responses
    "cursor": "uuid",
    "hasMore": true,
    "total": 150
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": [...]       // Optional, field-level errors
  }
}
```

### Authentication Endpoints

```
POST   /api/v1/auth/send-otp
  Body: { phone: "+919876543210" }
  Rate Limit: 3 requests per phone per 10 minutes
  Response: { success: true, data: { message: "OTP sent", expiresIn: 300 } }
  Notes: Triggers Firebase phone auth. OTP is sent by Firebase, not our backend.

POST   /api/v1/auth/verify-otp
  Body: { phone: "+919876543210", firebaseIdToken: "eyJ..." }
  Response: {
    success: true,
    data: {
      user: { id, phone, name, role, ... },
      accessToken: "eyJ...",       // JWT, 15 min expiry
      refreshToken: "abc123...",   // Opaque token, 30 day expiry
      isNewUser: true
    }
  }
  Notes: Backend verifies Firebase ID token via Admin SDK.
         If phone matches ADMIN_PHONE_NUMBERS, role = ADMIN.
         If user does not exist, creates new user record (isNewUser: true).

POST   /api/v1/auth/refresh
  Body: { refreshToken: "abc123..." }
  Response: { success: true, data: { accessToken: "eyJ...", refreshToken: "new..." } }
  Notes: Rotates refresh token on each use (refresh token rotation).

POST   /api/v1/auth/logout
  Headers: Authorization: Bearer <accessToken>
  Body: { refreshToken: "abc123..." }
  Response: { success: true, data: { message: "Logged out" } }
  Notes: Revokes the refresh token.
```

### User Endpoints

```
GET    /api/v1/users/me
  Auth: Required
  Response: Full user profile including location

PUT    /api/v1/users/me
  Auth: Required
  Body: { name?, avatarUrl?, location?: { lat, lng }, addressText? }
  Notes: When a BUYER updates their profile with all required fields
         (name, location), they can request role upgrade to SELLER.

PUT    /api/v1/users/me/role
  Auth: Required (BUYER only)
  Body: { role: "SELLER" }
  Notes: Self-upgrade from BUYER to SELLER. Requires profile completion
         (name, avatar, location must all be set).

PUT    /api/v1/users/me/location
  Auth: Required
  Body: { latitude: 12.9716, longitude: 77.5946 }
  Notes: Updates user's current location. Called on app open and
         periodically. Location is stored as PostGIS GEOGRAPHY point.

PUT    /api/v1/users/me/push-token
  Auth: Required
  Body: { pushToken: "ExponentPushToken[xxx]" }
  Notes: Stores Expo push notification token.
```

### Food Listing Endpoints

```
GET    /api/v1/listings
  Auth: Required
  Query Params:
    latitude (required): Buyer's current latitude
    longitude (required): Buyer's current longitude
    radius (optional): Search radius in meters, default 5000, max 10000
    category (optional): Filter by category
    dietary (optional): Comma-separated dietary tags
    search (optional): Full-text search on title and description
    cursor (optional): UUID of last item for pagination
    limit (optional): Items per page, default 20, max 50
    sort (optional): "distance" | "newest" | "price_asc" | "price_desc"
  Response: Paginated list of active, non-expired listings within radius.
            Each listing includes computed `distance_meters` field.
  Notes: This is the core query. Uses PostGIS ST_DWithin with GIST index.
         Only returns listings where is_active = true AND expires_at > NOW()
         AND available_quantity > 0.

GET    /api/v1/listings/:id
  Auth: Required
  Response: Full listing detail with seller info (name, avatar, rating placeholder).

POST   /api/v1/listings
  Auth: Required (SELLER+)
  Body: {
    title: "Homemade Biryani",
    description: "Hyderabadi dum biryani...",
    images: ["cloudinary_url_1", "cloudinary_url_2"],
    price: 150.00,
    quantity: 10,
    category: "lunch",
    dietaryTags: ["non-vegetarian"],
    expiresAt: "2026-05-08T20:00:00Z"    // Optional, defaults to +8 hours
  }
  Notes: Seller's current location is attached automatically from their profile.
         available_quantity is set equal to quantity on creation.

PUT    /api/v1/listings/:id
  Auth: Required (owner SELLER or ADMIN)
  Body: Partial update fields
  Notes: Cannot update seller_id or location (location is always seller's current).
         If available_quantity reaches 0, is_active is auto-set to false.

DELETE /api/v1/listings/:id
  Auth: Required (owner SELLER or ADMIN)
  Notes: Soft delete (sets is_active = false). Does not delete from DB.
         Active orders on this listing remain unaffected.

GET    /api/v1/listings/my
  Auth: Required (SELLER+)
  Query Params: status (active | expired | sold_out), cursor, limit
  Response: Seller's own listings with order counts.
```

### Order Endpoints

```
POST   /api/v1/orders
  Auth: Required (BUYER+)
  Body: {
    listingId: "uuid",
    quantity: 2
  }
  Response: Created order with status PENDING.
  Notes: Validates available_quantity >= requested quantity.
         Atomically decrements available_quantity on the listing.
         Auto-calculates total_price = listing.price * quantity.
         Creates a system message in the chat: "Order placed for 2x Biryani".
         Triggers push notification to seller.
         Buyer cannot order their own listing.

GET    /api/v1/orders
  Auth: Required
  Query Params:
    role: "buyer" | "seller" (which perspective to show)
    status (optional): Filter by status
    cursor, limit
  Response: Orders where user is buyer (role=buyer) or seller (role=seller).

GET    /api/v1/orders/:id
  Auth: Required (buyer or seller of order, or ADMIN)
  Response: Full order detail with listing info and other party's contact.

PATCH  /api/v1/orders/:id/status
  Auth: Required (buyer or seller depending on transition)
  Body: {
    status: "CONFIRMED",
    cancelReason?: "Out of stock"   // Required only when status = CANCELLED
  }
  Notes: Validates against the state machine (see Section 5).
         On CANCELLED: increments available_quantity back on the listing.
         Creates a system message in chat for each transition.
         Triggers push notification to the other party.
```

### Message Endpoints

```
GET    /api/v1/messages/conversations
  Auth: Required
  Response: List of conversations (orders) with last message preview,
            unread count, and other party's name/avatar.
  Notes: A "conversation" is an order. Returns orders that have
         at least one message OR are in active status.

GET    /api/v1/messages/:orderId
  Auth: Required (buyer or seller of order)
  Query Params: cursor, limit (default 50)
  Response: Paginated messages for this order, oldest first.
  Notes: Marks all messages from the other party as read.

POST   /api/v1/messages/:orderId
  Auth: Required (buyer or seller of order)
  Body: { content: "Is the biryani spicy?", messageType?: "text" }
  Response: Created message.
  Notes: Also emitted via Socket.io to the other party in real time.
         If the other party is offline, a push notification is sent.
         Max message length: 2000 characters.

PATCH  /api/v1/messages/:orderId/read
  Auth: Required (buyer or seller of order)
  Response: { success: true, data: { updatedCount: 5 } }
  Notes: Marks all unread messages from the other party as read.
         Emits a "messages:read" Socket.io event to the sender.
```

### Upload Endpoints

```
POST   /api/v1/upload/signature
  Auth: Required (SELLER+)
  Body: { folder: "listings" | "avatars" }
  Response: {
    success: true,
    data: {
      signature: "abc123",
      timestamp: 1717891200,
      cloudName: "gharka",
      apiKey: "123456",
      folder: "gharka/listings"
    }
  }
  Notes: Generates a signed upload request for Cloudinary.
         Client uploads directly to Cloudinary using this signature.
         This avoids routing image data through our server.
```

### Admin Endpoints

```
GET    /api/v1/admin/stats
  Auth: Required (ADMIN)
  Response: {
    totalUsers, activeUsers, totalListings, activeListings,
    totalOrders, ordersToday, ordersByStatus: { ... }
  }

GET    /api/v1/admin/users
  Auth: Required (ADMIN)
  Query Params: search (phone or name), role, isActive, cursor, limit
  Response: Paginated user list.

PATCH  /api/v1/admin/users/:id
  Auth: Required (ADMIN)
  Body: { isActive: false }
  Notes: Suspend or reactivate a user. Suspended users cannot log in.

GET    /api/v1/admin/listings
  Auth: Required (ADMIN)
  Query Params: search, sellerId, isActive, cursor, limit
  Response: All listings (including inactive) with seller info.

DELETE /api/v1/admin/listings/:id
  Auth: Required (ADMIN)
  Notes: Hard delete for admin. Cascades to orders and messages.
         Use sparingly; soft-delete via PUT is preferred.
```

---

## 7. Authentication Flow

### Sequence Diagram (Textual)

```
Client                    Firebase                   Backend (Fastify)
  |                          |                             |
  |-- 1. Enter phone ------->|                             |
  |   (Firebase Client SDK)  |                             |
  |                          |-- 2. Send OTP via SMS ----->|
  |                          |                             |
  |<-- 3. OTP received ------|                             |
  |                          |                             |
  |-- 4. Submit OTP -------->|                             |
  |                          |                             |
  |<-- 5. Firebase ID Token -|                             |
  |                          |                             |
  |-- 6. POST /auth/verify-otp { firebaseIdToken } ------>|
  |                          |                       7. Verify Firebase
  |                          |                          ID Token via
  |                          |                          Admin SDK
  |                          |                             |
  |                          |                       8. Check if phone
  |                          |                          in ADMIN_PHONE_NUMBERS
  |                          |                             |
  |                          |                       9. Upsert user in DB
  |                          |                             |
  |                          |                       10. Generate JWT
  |                          |                           (accessToken) +
  |                          |                           refreshToken
  |                          |                             |
  |<-- 11. { user, accessToken, refreshToken } ------------|
  |                                                        |
  |-- 12. Subsequent API calls with                        |
  |   Authorization: Bearer <accessToken>                  |
  |                                                        |
  |-- 13. When accessToken expires (15 min):               |
  |   POST /auth/refresh { refreshToken }                  |
  |                                                        |
  |<-- 14. { new accessToken, new refreshToken } ----------|
```

### JWT Payload Structure

```typescript
// Access Token payload (15 minute expiry)
{
  sub: "user-uuid",           // User ID
  phone: "+919876543210",
  role: "SELLER",             // BUYER | SELLER | ADMIN
  iat: 1717891200,
  exp: 1717892100             // 15 minutes
}

// The access token is signed with HS256 using JWT_SECRET env variable.
// The refresh token is a cryptographically random 64-byte hex string.
// Only the SHA-256 hash of the refresh token is stored in the database.
```

### Token Refresh Strategy (Client-Side)

```typescript
// lib/api-client.ts - Pattern for automatic token refresh

// The API client (Axios or fetch wrapper) intercepts 401 responses.
// On 401:
//   1. Pause all pending requests
//   2. Call /auth/refresh with the stored refresh token
//   3. On success: update stored tokens, retry all paused requests
//   4. On failure: redirect to login screen
//
// This is implemented using an Axios interceptor or a fetch wrapper
// with a token refresh queue to prevent multiple simultaneous refreshes.
```

---

## 8. 5km Radius Implementation

### How PostGIS ST_DWithin Works

PostGIS provides `ST_DWithin` for efficient radius queries on GEOGRAPHY types. Unlike application-level Haversine calculations that must scan every row, `ST_DWithin` uses a GIST spatial index to quickly eliminate rows outside the bounding box before performing the precise distance calculation.

```sql
-- Core query: Find active listings within 5km of a point
SELECT
    fl.*,
    ST_Distance(
        fl.location,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
    ) AS distance_meters,
    u.name AS seller_name,
    u.avatar_url AS seller_avatar
FROM food_listings fl
JOIN users u ON fl.seller_id = u.id
WHERE
    fl.is_active = true
    AND fl.expires_at > NOW()
    AND fl.available_quantity > 0
    AND ST_DWithin(
        fl.location,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
        :radius_meters  -- 5000 for 5km
    )
ORDER BY distance_meters ASC
LIMIT :limit
OFFSET :offset;
```

**Key details:**

- `ST_MakePoint(longitude, latitude)` -- note longitude comes first in PostGIS.
- `::geography` casts to the GEOGRAPHY type, which calculates distances in meters on the earth's surface (not flat Cartesian).
- `ST_DWithin` on GEOGRAPHY uses the GIST index. The index performs a bounding-box check first (fast), then a precise geodesic distance check on the candidates.
- `ST_Distance` returns the precise distance in meters for display to the user.
- SRID 4326 is the WGS84 coordinate reference system (standard GPS coordinates).

### Drizzle ORM Integration

Since Drizzle does not natively support PostGIS types, geo queries use `sql` template literals:

```typescript
// apps/api/src/utils/geo-query.ts

import { sql } from 'drizzle-orm';

export function withinRadius(
  locationColumn: string,
  longitude: number,
  latitude: number,
  radiusMeters: number = 5000
) {
  return sql`ST_DWithin(
    ${sql.raw(locationColumn)},
    ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
    ${radiusMeters}
  )`;
}

export function distanceMeters(
  locationColumn: string,
  longitude: number,
  latitude: number
) {
  return sql`ST_Distance(
    ${sql.raw(locationColumn)},
    ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
  )`;
}

export function makePoint(longitude: number, latitude: number) {
  return sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`;
}
```

### Getting User Location (Client-Side)

**Web (Next.js):**

```typescript
// hooks/use-location.ts - Pattern

async function requestLocation(): Promise<{ lat: number; lng: number }> {
  // Step 1: Check if geolocation is supported
  if (!navigator.geolocation) {
    throw new Error('Geolocation not supported');
  }

  // Step 2: Request permission and get position
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        // error.code: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        reject(error);
      },
      {
        enableHighAccuracy: true,  // Use GPS if available
        timeout: 10000,            // 10 second timeout
        maximumAge: 300000,        // Cache for 5 minutes
      }
    );
  });
}
```

**Mobile (Expo):**

```typescript
// Uses expo-location
import * as Location from 'expo-location';

async function requestLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,  // Good enough for 5km radius
  });

  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };
}
```

### Fallback Strategy for Location Denial

When the user denies location access, the app cannot show nearby listings. The fallback strategy has three tiers:

```
Tier 1: Precise location (GPS/browser geolocation)
  -> Best experience. Listings sorted by distance.

Tier 2: Manual location entry
  -> Show a search bar: "Enter your area/pincode"
  -> Use a geocoding API (Google Maps Geocoding or free Nominatim)
     to convert the address to lat/lng coordinates.
  -> Store as the user's location.
  -> Less precise but functional.

Tier 3: IP-based geolocation (last resort)
  -> Use a free IP geolocation service (ipapi.co, ip-api.com)
  -> Accuracy: city-level only (1-50km error)
  -> Show a warning: "Showing approximate results. Enable location for accuracy."
  -> Set a wider default radius (10km instead of 5km).
```

The UI flow:

```
1. On first load, request browser/device location.
2. If granted -> use precise coordinates.
3. If denied -> show a modal:
     "We need your location to show nearby food."
     [Enter Location Manually]  [Try Again]
4. If manual entry -> geocode the address.
5. If the user dismisses without providing location ->
     Fall back to IP geolocation with a warning banner.
```

### Query Optimization Notes

1. **GIST Index is critical.** Without it, `ST_DWithin` performs a sequential scan. With it, the index eliminates most rows via bounding-box intersection before computing geodesic distance.

2. **Partial index for active listings.** The index `idx_listings_active_location` only indexes rows where `is_active = true`, reducing index size and improving query speed.

3. **Avoid ORDER BY distance for large result sets.** Spatial indexes are optimized for filtering (WHERE), not sorting. For small result sets (< 1000 rows within 5km for a community app), sorting in the database is fine. For larger datasets, consider a K-nearest-neighbor (KNN) approach with `<->` operator.

4. **Cache location.** The client should cache the user's location for 5 minutes (maximumAge in geolocation options) rather than requesting GPS on every page load.

5. **Coordinate precision.** 4 decimal places gives ~11 meter accuracy. There is no need to store more than 6 decimal places.

---

## 9. Real-Time Chat Architecture

### Socket.io Server Setup

```typescript
// apps/api/src/plugins/socket.plugin.ts - Architecture pattern

// Socket.io is attached to the Fastify server instance.
// Authentication is handled via the Socket.io middleware (not Fastify middleware).
// Each authenticated user joins a personal room: `user:${userId}`
// Each order-based chat uses a room: `order:${orderId}`

// Events:

// Client -> Server:
//   "message:send"    { orderId, content, messageType }
//   "message:read"    { orderId }
//   "typing:start"    { orderId }
//   "typing:stop"     { orderId }

// Server -> Client:
//   "message:new"     { id, orderId, senderId, content, messageType, createdAt }
//   "message:read"    { orderId, readBy }
//   "typing:indicator" { orderId, userId, isTyping }
//   "order:updated"   { orderId, status, updatedBy }
//   "notification"    { type, title, body, data }
```

### Socket.io Authentication

```typescript
// The client sends the JWT access token during the Socket.io handshake.
// The server validates it in the connection middleware.

// Client:
// const socket = io(API_URL, {
//   auth: { token: accessToken }
// });

// Server middleware:
// io.use(async (socket, next) => {
//   const token = socket.handshake.auth.token;
//   try {
//     const payload = verifyJwt(token);
//     socket.data.userId = payload.sub;
//     socket.data.role = payload.role;
//     socket.join(`user:${payload.sub}`);
//     next();
//   } catch {
//     next(new Error('Authentication failed'));
//   }
// });
```

### Message Flow

```
Buyer types message
    |
    v
Client emits "message:send" { orderId, content }
    |
    v
Server receives event in messages.gateway.ts
    |
    v
1. Validate: Is sender a participant of this order?
2. Sanitize content (strip HTML, enforce 2000 char limit)
3. Insert into messages table
4. Emit "message:new" to room `order:${orderId}`
    |
    +--> If receiver is connected: they get the event instantly
    |
    +--> If receiver is disconnected:
         Check push_token in users table
         Send Expo push notification
```

### Offline Message Handling

Messages are always persisted to the database first, then emitted via Socket.io. This means:

- If the receiver is online, they see the message in real time.
- If the receiver is offline, the message is stored in the database. When they open the chat, the REST API `GET /messages/:orderId` returns all messages including those received while offline.
- Push notifications are sent for offline users to alert them.

---

## 10. Three.js and Animation Strategy

### Philosophy

The app's functional surface is small (list food, order food, chat). The visual experience is what differentiates it. Three.js and Framer Motion create a premium feel that makes users want to open the app.

### Where Three.js is Used

| Location | Effect | Performance Budget |
|----------|--------|-------------------|
| Landing page hero | 3D floating food items (stylized low-poly models of plates, bowls, spoons) rotating slowly with parallax on mouse/scroll | 60fps on mid-range devices. Models must be < 500KB total. Use DRACO compression for .glb files. |
| Page transitions | Framer Motion (not Three.js) for smooth page-to-page animations. Shared layout animations for listing cards expanding to detail view. | < 16ms per frame. Use `layoutId` for shared element transitions. |
| Listing card hover | Subtle 3D tilt effect on food cards (CSS perspective + Framer Motion, not Three.js canvas). | CSS-only where possible. |
| Loading states | Animated food-themed skeleton loaders. A spinning plate or bouncing food items. | Lightweight SVG or Lottie animations, not Three.js. |
| Empty states | Illustrated empty states with subtle parallax or floating animation (Framer Motion). | SVG + CSS animation. |
| Order status | Animated timeline with step-by-step progress. Micro-animations on status change (confetti on COMPLETED). | Framer Motion + canvas-confetti library. |

### Three.js Implementation Pattern (React Three Fiber)

```typescript
// components/three/hero-scene.tsx - Architecture pattern, not full code

// Key principles:
// 1. Use React Three Fiber (R3F) for declarative Three.js in React.
// 2. Wrap the Canvas in Suspense with a fallback (loading state).
// 3. Use @react-three/drei for helpers (OrbitControls, useGLTF, Float, etc.).
// 4. Lazy-load the Canvas component (next/dynamic with ssr: false).
// 5. Use drei's Float component for effortless floating animation.
// 6. Keep models low-poly and DRACO-compressed.

// Loading strategy for Next.js:
// const HeroScene = dynamic(() => import('@/components/three/hero-scene'), {
//   ssr: false,
//   loading: () => <HeroFallback />,
// });
```

### Performance Rules for Three.js

1. **Never render a Three.js canvas on pages that do not need it.** The Canvas is only on the landing page and potentially the profile/about page.
2. **Lazy-load all 3D content.** Use `next/dynamic` with `ssr: false` since Three.js requires the DOM.
3. **Total 3D asset budget: 2MB max.** Use DRACO-compressed .glb files. Pre-optimize in Blender.
4. **Disable Three.js on low-power devices.** Check `navigator.hardwareConcurrency < 4` or `navigator.deviceMemory < 4` and show a static image fallback instead.
5. **Use `frameloop="demand"` on R3F Canvas** for scenes that do not need continuous rendering (e.g., only update on scroll or mouse move).

### Framer Motion Usage

Framer Motion handles all non-3D animations:

```
- Page transitions: AnimatePresence + motion.div for enter/exit animations
- List animations: staggerChildren for listing grid appearance
- Shared layout: layoutId on listing cards for expand-to-detail transitions
- Scroll-triggered: useInView for fade-in-on-scroll effects
- Gesture: drag, tap, hover micro-interactions on cards and buttons
- Spring physics: Bouncy, organic motion on interactive elements
```

---

## 11. Security Architecture

### 1. Rate Limiting

```typescript
// Rate limiting configuration using @fastify/rate-limit

// Global: 100 requests per minute per IP
// Auth endpoints: 5 requests per minute per IP (brute force prevention)
// OTP send: 3 requests per 10 minutes per phone number (SMS abuse prevention)
// Message send: 30 messages per minute per user (spam prevention)
// Listing create: 10 per hour per user (spam prevention)
// Upload signature: 20 per hour per user (abuse prevention)
```

### 2. Input Sanitization

```typescript
// Every text input is sanitized before storage:
// 1. Strip HTML tags (DOMPurify on client, sanitize-html on server)
// 2. Trim whitespace
// 3. Enforce maximum lengths at both Zod schema and DB CHECK constraint levels
// 4. Reject or escape special characters in specific fields (phone numbers)
// 5. Parameterized queries via Drizzle ORM prevent SQL injection entirely
```

### 3. JWT Security

```
- Access token: HS256, 15-minute expiry, contains userId + role
- Refresh token: Cryptographically random 64-byte hex, 30-day expiry
- Refresh token stored as SHA-256 hash in DB (not plaintext)
- Refresh token rotation: new token issued on each refresh, old one revoked
- Token revocation: on logout, refresh token is revoked in DB
- JWT_SECRET: minimum 256-bit, stored in environment variable
- JWT_REFRESH_SECRET: separate secret for refresh token signing (if signed)
```

### 4. Role-Based Middleware

```typescript
// Every protected route uses two middleware in sequence:
// 1. authenticate: Verifies JWT, attaches user to request
// 2. authorize(minimumRole): Checks role hierarchy

// Pattern:
// app.get('/admin/stats',
//   { preHandler: [authenticate, authorize('ADMIN')] },
//   adminController.getStats
// );
```

### 5. Image Upload Security

```
- Signed uploads only (server generates Cloudinary signature)
- Allowed formats: JPEG, PNG, WebP, HEIC (no SVG, no GIF, no video)
- Maximum file size: 5MB per image
- Maximum images per listing: 5
- Cloudinary automatically strips EXIF data (GPS location in photos)
- Content moderation: Cloudinary has optional AI-based moderation add-on
  (enable if needed for food safety/appropriateness)
```

### 6. SQL Injection Prevention

```
- All database queries use Drizzle ORM's parameterized queries
- PostGIS queries use sql`` template literals with parameter binding
- No raw string concatenation in any query
- Database user has minimal privileges (SELECT, INSERT, UPDATE, DELETE only,
  no CREATE, DROP, ALTER in production)
```

### 7. CORS Configuration

```typescript
// apps/api/src/config/cors.ts

// CORS whitelist pattern:
const ALLOWED_ORIGINS = [
  'http://localhost:3000',                // Next.js dev
  'http://localhost:8081',                // Expo dev
  'https://gharka.app',                  // Production web
  'https://www.gharka.app',              // Production web (www)
];

// Mobile apps (React Native) do not send an Origin header,
// so they bypass CORS entirely. CORS only applies to browsers.
```

### 8. Additional Security Measures

```
- HTTPS enforced in production (TLS 1.3)
- Helmet.js headers (CSP, HSTS, X-Frame-Options, etc.) via @fastify/helmet
- Request body size limit: 1MB (prevents payload bombs)
- Database connection via SSL in production
- Environment variables: never committed to git, managed via hosting platform
- Admin phone numbers: ONLY in env vars, never in DB or client code
- Dependency scanning: npm audit in CI/CD pipeline
- Content-Security-Policy: restrict script sources, block inline scripts
```

---

## 12. Naming Conventions and Code Standards

### File Naming

```
TypeScript files:  kebab-case.ts          (user-service.ts)
React components:  kebab-case.tsx         (listing-card.tsx)
                   Export PascalCase      (export function ListingCard)
Test files:        *.test.ts / *.test.tsx (user-service.test.ts)
SQL migrations:    NNNN_description.sql   (0001_add_postgis.sql)
Environment:       .env, .env.example     (SCREAMING_SNAKE_CASE keys)
```

### Code Naming

```typescript
// Variables and functions: camelCase
const userId = 'abc';
function getUserById(id: string) { }

// Types and interfaces: PascalCase
type FoodListing = { };
interface CreateOrderInput { }

// Constants: SCREAMING_SNAKE_CASE
const MAX_RADIUS_METERS = 10000;
const ORDER_STATUS = { PENDING: 'PENDING', ... } as const;

// Database columns: snake_case (PostgreSQL convention)
// ORM maps to camelCase in TypeScript automatically

// API routes: kebab-case
// /api/v1/food-listings (not /api/v1/foodListings)

// Environment variables: SCREAMING_SNAKE_CASE
// DATABASE_URL, JWT_SECRET, ADMIN_PHONE_NUMBERS

// Zod schemas: camelCase with Schema suffix
const createListingSchema = z.object({ });
const updateOrderStatusSchema = z.object({ });

// React hooks: use- prefix
function useListings() { }
function useAuth() { }

// React components: PascalCase function declarations
function ListingCard({ listing }: ListingCardProps) { }
```

### Module Pattern (Backend)

Each feature module follows the same three-file pattern:

```
module-name/
  module-name.routes.ts      # Route definitions and schema
  module-name.controller.ts  # Request handling, validation, response formatting
  module-name.service.ts     # Business logic and database queries
```

**routes.ts** defines the Fastify routes and attaches controllers:

```typescript
// Pattern for routes file
import { FastifyInstance } from 'fastify';
import { authenticate, authorize } from '../../middleware';
import * as controller from './listings.controller';

export async function listingsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authenticate] }, controller.getListings);
  app.post('/', { preHandler: [authenticate, authorize('SELLER')] }, controller.createListing);
  // ... etc.
}
```

**controller.ts** handles HTTP concerns (parsing params, sending responses):

```typescript
// Pattern for controller file
import { FastifyRequest, FastifyReply } from 'fastify';
import * as service from './listings.service';
import { createListingSchema } from '@gharka/shared/schemas';

export async function createListing(request: FastifyRequest, reply: FastifyReply) {
  const input = createListingSchema.parse(request.body);
  const listing = await service.createListing(request.user.id, input);
  return reply.status(201).send({ success: true, data: listing });
}
```

**service.ts** contains pure business logic and database operations:

```typescript
// Pattern for service file
import { db } from '../../db';
import { foodListings } from '../../db/schema';
import { eq } from 'drizzle-orm';

export async function createListing(sellerId: string, input: CreateListingInput) {
  const [listing] = await db.insert(foodListings).values({
    sellerId,
    ...input,
  }).returning();
  return listing;
}
```

### Import Order Convention

```typescript
// 1. Node built-ins
import { randomBytes } from 'crypto';

// 2. External packages
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// 3. Internal packages (monorepo)
import { createListingSchema } from '@gharka/shared/schemas';
import { Role } from '@gharka/shared/types';

// 4. Local imports (relative)
import { db } from '../../db';
import { authenticate } from '../../middleware';
```

### Git Conventions

```
Branch naming:
  feature/auth-flow
  feature/listing-crud
  fix/otp-rate-limit
  chore/update-deps

Commit messages (conventional commits):
  feat(auth): add OTP verification flow
  fix(listings): correct PostGIS distance calculation
  chore(deps): update fastify to 4.28
  docs: update API documentation
```

---

## 13. Task Execution Order

### Phase 0: Project Bootstrap (Day 1)

```
0.1  Initialize pnpm monorepo with workspace config
0.2  Set up Turborepo pipeline
0.3  Create packages/shared with TypeScript config
0.4  Define Zod schemas for all entities in packages/shared
0.5  Define TypeScript types (inferred from Zod schemas) in packages/shared
0.6  Define constants (roles, order statuses, categories) in packages/shared
0.7  Set up ESLint + Prettier at root level
0.8  Create .env.example with all required variables
0.9  Initialize git repository and .gitignore
```

### Phase 1: Backend Foundation (Days 2-5)

```
1.1  Initialize Fastify app with TypeScript (apps/api)
1.2  Set up PostgreSQL + PostGIS (Docker Compose for local dev)
1.3  Configure Drizzle ORM and create initial migration
1.4  Implement database schema (all tables + indexes + PostGIS)
1.5  Run migrations and verify with seed data
1.6  Set up Firebase Admin SDK configuration
1.7  Implement auth module:
     - POST /auth/send-otp (Firebase client-side, backend validates)
     - POST /auth/verify-otp (verify Firebase token, issue JWT)
     - POST /auth/refresh (token rotation)
     - POST /auth/logout (revoke refresh token)
1.8  Implement authenticate middleware (JWT verification)
1.9  Implement authorize middleware (role hierarchy)
1.10 Implement users module:
     - GET /users/me
     - PUT /users/me
     - PUT /users/me/location
     - PUT /users/me/role (BUYER -> SELLER upgrade)
1.11 Implement listings module:
     - GET /listings (with PostGIS 5km radius query)
     - GET /listings/:id
     - POST /listings
     - PUT /listings/:id
     - DELETE /listings/:id
     - GET /listings/my
1.12 Implement orders module:
     - POST /orders
     - GET /orders
     - GET /orders/:id
     - PATCH /orders/:id/status (with state machine validation)
1.13 Implement messages module:
     - GET /messages/conversations
     - GET /messages/:orderId
     - POST /messages/:orderId
     - PATCH /messages/:orderId/read
1.14 Implement Socket.io for real-time messaging
1.15 Implement upload module (Cloudinary signed uploads)
1.16 Implement admin module:
     - GET /admin/stats
     - GET /admin/users
     - PATCH /admin/users/:id
     - GET /admin/listings
     - DELETE /admin/listings/:id
1.17 Set up rate limiting on all routes
1.18 Set up error handling plugin (global error handler)
1.19 Set up Pino logger with request ID tracking
1.20 Write seed script with realistic test data
```

### Phase 2: Frontend Web App (Days 6-12)

```
2.1  Initialize Next.js 14 with App Router (apps/web)
2.2  Set up Tailwind CSS + shadcn/ui
2.3  Set up providers (Auth, Query, Socket, Theme)
2.4  Set up API client with auth interceptor and token refresh
2.5  Implement auth pages:
     - Login page (phone input)
     - OTP verification page
     - Firebase client SDK integration
2.6  Implement main layout (navbar, sidebar, mobile nav)
2.7  Implement Three.js landing page hero:
     - React Three Fiber Canvas setup
     - Low-poly food models (floating plates/bowls)
     - Scroll-triggered animations
     - Performance fallback for weak devices
2.8  Implement feed page:
     - Listing grid with location-based data fetching
     - Category filters
     - Search bar
     - Distance badges on cards
     - Framer Motion stagger animations on load
     - Pull-to-refresh equivalent (button or scroll trigger)
2.9  Implement listing detail page:
     - Image carousel
     - Seller info
     - Order button with quantity selector
     - Shared layout animation from card
2.10 Implement seller pages:
     - Create listing form (with image upload to Cloudinary)
     - My listings management page
     - Edit listing page
2.11 Implement orders pages:
     - Order list (buyer and seller tabs)
     - Order detail with status timeline
     - Status update buttons (confirm, ready, picked up, complete, cancel)
     - Animated status transitions
2.12 Implement chat:
     - Conversation list
     - Chat thread with real-time messages via Socket.io
     - Typing indicators
     - Read receipts (subtle checkmarks)
     - Auto-scroll to latest message
2.13 Implement profile page:
     - Edit name, avatar, location
     - Upgrade to seller CTA for buyers
2.14 Implement admin dashboard:
     - Stats overview cards
     - User management table (search, suspend/activate)
     - Listing moderation table
     - Route guarded by ADMIN role
2.15 Implement location flow:
     - Browser geolocation request
     - Manual location entry fallback
     - Location permission modal
2.16 Responsive design pass (mobile-first Tailwind breakpoints)
2.17 Loading states, error states, empty states for all pages
2.18 Framer Motion page transitions (AnimatePresence)
```

### Phase 3: Mobile App (Days 13-18)

```
3.1  Initialize Expo app with Expo Router (apps/mobile)
3.2  Set up shared package imports (@gharka/shared)
3.3  Reuse API client logic from web (adapt for React Native)
3.4  Implement auth screens (phone input, OTP verification)
3.5  Implement tab navigation (Feed, Orders, Chat, Profile)
3.6  Implement feed screen with FlatList and geo-filtering
3.7  Implement listing detail screen
3.8  Implement seller listing creation with expo-image-picker
3.9  Implement orders screens with status management
3.10 Implement chat screens with Socket.io
3.11 Implement push notifications (Expo Notifications)
3.12 Implement location services (expo-location)
3.13 Implement admin screens (conditional on role)
3.14 Three.js on mobile via expo-gl (simplified hero only)
3.15 Reanimated 3 for native gesture animations
3.16 Test on both iOS and Android simulators
```

### Phase 4: Integration and Polish (Days 19-22)

```
4.1  End-to-end testing of full user flows
4.2  Performance profiling (Lighthouse for web, Flipper for mobile)
4.3  Three.js performance optimization (low-power device testing)
4.4  Image loading optimization (Cloudinary transformations, blur hash)
4.5  Accessibility audit (ARIA labels, keyboard nav, screen reader)
4.6  Error boundary testing (API down, network errors, etc.)
4.7  Rate limit testing (verify all limits work correctly)
4.8  Security audit (OWASP top 10 checklist)
4.9  Cross-browser testing (Chrome, Safari, Firefox, Edge)
4.10 Mobile device testing (various screen sizes)
```

### Phase 5: Deployment (Days 23-25)

```
5.1  Set up PostgreSQL + PostGIS on production (Supabase or Railway)
5.2  Deploy Fastify API (Railway, Render, or Fly.io)
5.3  Deploy Next.js web app (Vercel)
5.4  Configure custom domain and SSL
5.5  Set up environment variables on all platforms
5.6  Configure monitoring and alerting (Sentry for errors)
5.7  EAS Build for mobile (TestFlight + Play Store internal testing)
5.8  Load testing with k6 or Artillery
5.9  DNS configuration and final go-live checks
```

### Dependency Graph (What Blocks What)

```
Phase 0 (Bootstrap) blocks everything.

Phase 1 (Backend):
  1.1-1.5 (DB + Fastify setup) blocks all other backend work.
  1.6-1.9 (Auth + Middleware) blocks all protected routes.
  1.10 (Users) blocks 1.11 (Listings needs seller).
  1.11 (Listings) blocks 1.12 (Orders needs listings).
  1.12 (Orders) blocks 1.13-1.14 (Messages/Chat scoped to orders).
  1.15 (Upload) is independent, can parallel with 1.10+.
  1.16 (Admin) can parallel with 1.12+.

Phase 2 (Web) depends on Phase 1 being functional (at minimum 1.1-1.11).
  2.1-2.4 (Setup) blocks all feature pages.
  2.5 (Auth pages) blocks all authenticated pages.
  2.7 (Three.js) is independent, can parallel with everything.
  2.8-2.14 follow the same dependency order as backend modules.

Phase 3 (Mobile) depends on Phase 1 backend being complete.
  Can run in parallel with Phase 2 if backend is ready.

Phases 4-5 depend on Phases 1-3 being substantially complete.
```

---

## 14. Environment Configuration

### .env.example

```bash
# ===== Server =====
NODE_ENV=development
PORT=3001
HOST=0.0.0.0
API_URL=http://localhost:3001

# ===== Database =====
DATABASE_URL=postgresql://gharka:gharka@localhost:5432/gharka?sslmode=disable
# Production: postgresql://user:pass@host:5432/gharka?sslmode=require

# ===== Auth =====
JWT_SECRET=your-256-bit-secret-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# ===== Firebase Admin =====
FIREBASE_PROJECT_ID=gharka-app
FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@gharka-app.iam.gserviceaccount.com

# ===== Admin =====
ADMIN_PHONE_NUMBERS=+919876543210,+919876543211

# ===== Cloudinary =====
CLOUDINARY_CLOUD_NAME=gharka
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=your-cloudinary-secret

# ===== CORS =====
CORS_ORIGINS=http://localhost:3000,http://localhost:8081

# ===== Rate Limiting =====
RATE_LIMIT_GLOBAL=100
RATE_LIMIT_AUTH=5
RATE_LIMIT_OTP=3

# ===== Geolocation Defaults =====
DEFAULT_RADIUS_METERS=5000
MAX_RADIUS_METERS=10000
```

### Docker Compose for Local Development

```yaml
# docker-compose.yml (at monorepo root)

version: '3.8'

services:
  postgres:
    image: postgis/postgis:16-3.4
    container_name: gharka-postgres
    environment:
      POSTGRES_USER: gharka
      POSTGRES_PASSWORD: gharka
      POSTGRES_DB: gharka
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Environment Validation (Server Startup)

```typescript
// apps/api/src/config/env.ts - Pattern

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('30d'),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  ADMIN_PHONE_NUMBERS: z.string().transform((s) => s.split(',')),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CORS_ORIGINS: z.string().transform((s) => s.split(',')),
  DEFAULT_RADIUS_METERS: z.coerce.number().default(5000),
  MAX_RADIUS_METERS: z.coerce.number().default(10000),
});

// This runs at server startup. If any variable is missing or invalid,
// the server refuses to start and logs a clear error message.
export const env = envSchema.parse(process.env);
```

---

## 15. Deployment Architecture

### Production Topology

```
                     [Cloudflare DNS + CDN]
                            |
              +-------------+-------------+
              |                           |
        [Vercel]                    [Railway / Fly.io]
        Next.js Web                 Fastify API + Socket.io
        (apps/web)                  (apps/api)
              |                           |
              |                     +-----+-----+
              |                     |           |
              |              [Supabase]   [Cloudinary]
              |              PostgreSQL    Image Storage
              |              + PostGIS     + CDN
              |                     |
              +---------------------+
                            |
                     [Firebase Auth]
                     Phone + OTP

        [EAS / App Store / Play Store]
        React Native Mobile
        (apps/mobile)
```

### Hosting Choices

| Component | Host | Justification |
|-----------|------|---------------|
| Web (Next.js) | Vercel | Native Next.js support. Edge functions. Automatic preview deployments. Free tier generous. |
| API (Fastify) | Railway or Fly.io | Container-based. WebSocket support (critical for Socket.io). Auto-scaling. Railway has simpler DX; Fly.io has better global distribution. |
| Database | Supabase (PostgreSQL + PostGIS) | Managed Postgres with PostGIS enabled. Connection pooling via PgBouncer. Daily backups. Free tier: 500MB storage, 2 projects. |
| Images | Cloudinary | Discussed in Section 2. CDN built-in. |
| Auth | Firebase | Discussed in Section 2. Google infrastructure. |
| Mobile Builds | EAS (Expo Application Services) | Cloud builds for iOS and Android. OTA updates. TestFlight and Play Store distribution. |
| Error Monitoring | Sentry | Free tier covers small apps. Stack traces, breadcrumbs, performance monitoring. |

### CI/CD Pipeline

```
GitHub Actions workflow:

On push to main:
  1. Install dependencies (pnpm install)
  2. Typecheck (tsc --noEmit across all packages)
  3. Lint (ESLint across all packages)
  4. Run migrations on staging DB
  5. Run tests
  6. Build all packages (turbo run build)
  7. Deploy API to Railway (auto-deploy on main push)
  8. Deploy Web to Vercel (auto-deploy on main push)

On push to feature/* branches:
  1. Steps 1-5 only (typecheck, lint, test)
  2. Vercel preview deployment for web
```

---

## Appendix A: Shared Zod Schemas (packages/shared/src/schemas)

```typescript
// packages/shared/src/schemas/listing.schema.ts

import { z } from 'zod';

export const FOOD_CATEGORIES = [
  'breakfast', 'lunch', 'dinner', 'snacks',
  'desserts', 'beverages', 'tiffin', 'other',
] as const;

export const DIETARY_TAGS = [
  'vegetarian', 'vegan', 'jain', 'eggetarian',
  'non-vegetarian', 'gluten-free', 'sugar-free',
] as const;

export const createListingSchema = z.object({
  title: z.string().min(3).max(150).trim(),
  description: z.string().max(1000).trim().optional(),
  images: z.array(z.string().url()).min(1).max(5),
  price: z.number().positive().multipleOf(0.01),
  quantity: z.number().int().positive().max(100),
  category: z.enum(FOOD_CATEGORIES),
  dietaryTags: z.array(z.enum(DIETARY_TAGS)).default([]),
  expiresAt: z.string().datetime().optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const listingQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(100).max(10000).default(5000),
  category: z.enum(FOOD_CATEGORIES).optional(),
  dietary: z.string().optional(),
  search: z.string().max(100).optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  sort: z.enum(['distance', 'newest', 'price_asc', 'price_desc']).default('distance'),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;
```

```typescript
// packages/shared/src/schemas/order.schema.ts

import { z } from 'zod';

export const ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'READY', 'PICKED_UP', 'COMPLETED', 'CANCELLED',
] as const;

export const createOrderSchema = z.object({
  listingId: z.string().uuid(),
  quantity: z.number().int().positive().max(50),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  cancelReason: z.string().max(500).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
```

```typescript
// packages/shared/src/schemas/auth.schema.ts

import { z } from 'zod';

const phoneRegex = /^\+[1-9]\d{6,14}$/;

export const sendOtpSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid phone number format. Use +<country_code><number>'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(phoneRegex),
  firebaseIdToken: z.string().min(100),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(32),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
```

```typescript
// packages/shared/src/schemas/message.schema.ts

import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(2000).trim(),
  messageType: z.enum(['text', 'image']).default('text'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
```

---

## Appendix B: Constants (packages/shared/src/constants)

```typescript
// packages/shared/src/constants/roles.ts

export const ROLES = {
  BUYER: 'BUYER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
  BUYER: 1,
  SELLER: 2,
  ADMIN: 3,
};
```

```typescript
// packages/shared/src/constants/order-status.ts

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  READY: 'READY',
  PICKED_UP: 'PICKED_UP',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  READY: 'Ready for Pickup',
  PICKED_UP: 'Picked Up',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  READY: 'green',
  PICKED_UP: 'purple',
  COMPLETED: 'emerald',
  CANCELLED: 'red',
};
```

---

## Appendix C: Error Codes

```typescript
// Standardized error codes used across the API

export const ERROR_CODES = {
  // Auth
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  FIREBASE_VERIFICATION_FAILED: 'FIREBASE_VERIFICATION_FAILED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',

  // Authorization
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_ROLE: 'INSUFFICIENT_ROLE',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // Resources
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  LISTING_NOT_FOUND: 'LISTING_NOT_FOUND',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',

  // Business Logic
  LISTING_EXPIRED: 'LISTING_EXPIRED',
  LISTING_SOLD_OUT: 'LISTING_SOLD_OUT',
  INSUFFICIENT_QUANTITY: 'INSUFFICIENT_QUANTITY',
  INVALID_ORDER_TRANSITION: 'INVALID_ORDER_TRANSITION',
  CANNOT_ORDER_OWN_LISTING: 'CANNOT_ORDER_OWN_LISTING',
  PROFILE_INCOMPLETE: 'PROFILE_INCOMPLETE',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  OTP_RATE_LIMIT_EXCEEDED: 'OTP_RATE_LIMIT_EXCEEDED',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;
```

---

## Appendix D: Development Scripts (package.json root)

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:api": "turbo run dev --filter=api",
    "dev:web": "turbo run dev --filter=web",
    "dev:mobile": "turbo run dev --filter=mobile",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "db:migrate": "turbo run db:migrate --filter=api",
    "db:seed": "turbo run db:seed --filter=api",
    "db:studio": "turbo run db:studio --filter=api",
    "clean": "turbo run clean && rm -rf node_modules"
  }
}
```

---

**END OF MASTER ARCHITECTURE DOCUMENT**

This document is the single source of truth for the GharKa project. All implementation decisions must align with the patterns, conventions, and structures defined here. Any deviations require updating this document first.
