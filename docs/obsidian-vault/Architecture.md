# Architecture Map

## Source Document
Full details: [[../MASTER_ARCHITECTURE.md]]

## Tech Stack Quick Reference
| Layer | Tech | Why |
|-------|------|-----|
| Web | Next.js 14 + App Router | SSR, RSC, Image optimization |
| Mobile | Expo SDK 52 + React Native | Managed workflow, OTA updates |
| Backend | Fastify 4 + TypeScript | 2-3x faster than Express |
| DB | PostgreSQL 16 + PostGIS 3.4 | Spatial queries for 5km radius |
| ORM | Drizzle | Lightweight, PostGIS escape hatch |
| Auth | Firebase Auth (Phone+OTP) | Free 10k/month, full auth state |
| Realtime | Socket.io 4 | Chat with rooms, auto-reconnect |
| Images | Cloudinary | On-the-fly transforms, CDN |
| 3D | Three.js + React Three Fiber | Landing hero, transitions |
| Animation | Framer Motion | Micro-interactions everywhere |
| CSS | Tailwind 3.4 + shadcn/ui | Utility-first, accessible components |
| State | Zustand | Minimal, 1.1kb |
| Data | TanStack Query v5 | Caching, optimistic updates |
| Validation | Zod | Shared frontend/backend schemas |

## Monorepo Layout
```
gharka/
  packages/shared/     -> Zod schemas, types, constants
  apps/api/            -> Fastify backend
  apps/web/            -> Next.js web app
  apps/mobile/         -> Expo mobile app
```

## Key Patterns
- [[Security]] for auth flow and role matrix
- [[API-Map]] for all endpoints
- [[UX-Flows]] for screen-to-API mapping

## Database Tables
- `users` - name, avatar, phone, role, location (PostGIS GEOGRAPHY)
- `food_listings` - seller_id, title, images, price, qty, location, category
- `orders` - buyer_id, listing_id, quantity, status (state machine)
- `messages` - sender, receiver, order_id, content
- `refresh_tokens` - hashed tokens for JWT rotation
