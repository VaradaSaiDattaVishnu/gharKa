# Task Tracker

## Build Phases

### Phase 0: Bootstrap (Current)
- [x] Master Architecture Document
- [x] Brand Guide
- [x] UX Research Document
- [x] Behavioral Engagement System
- [x] Obsidian Vault (mappers)
- [ ] Whimsy & Animation Design
- [ ] Monorepo initialization
- [ ] Shared package (schemas, types, constants)

### Phase 1: Backend Foundation
- [ ] PostgreSQL + PostGIS setup (Docker Compose)
- [ ] Drizzle schema + migrations
- [ ] Fastify app factory + plugins
- [ ] Firebase Auth integration
- [ ] JWT middleware (sign/verify/refresh)
- [ ] Role-based authorization middleware
- [ ] Auth module (verify-firebase, refresh, logout, onboard)
- [ ] Users module (CRUD)
- [ ] Listings module (CRUD + PostGIS 5km queries)
- [ ] Orders module (create, status machine, list)
- [ ] Messages module (REST + Socket.io)
- [ ] Upload module (Cloudinary signatures)
- [ ] Admin module (user mgmt, listing moderation, stats)
- [ ] Rate limiting + security middleware
- [ ] Seed data

### Phase 2: Web Frontend
- [ ] Next.js project + Tailwind + shadcn/ui setup
- [ ] Design system (colors, typography, components)
- [ ] Three.js landing page hero
- [ ] Auth pages (phone input, OTP, onboarding)
- [ ] Main layout (navbar, responsive sidebar)
- [ ] Food feed page (grid, filters, 5km radius)
- [ ] Listing detail page
- [ ] Create/edit listing form
- [ ] Orders page (buyer + seller views)
- [ ] Chat system (Socket.io integration)
- [ ] Profile page
- [ ] Admin dashboard
- [ ] Framer Motion transitions + micro-interactions
- [ ] Behavioral nudges + tooltips
- [ ] Empty states + loading states

### Phase 3: Mobile App
- [ ] Expo project setup
- [ ] Shared component library (RN Paper/Tamagui)
- [ ] Auth flow (phone + OTP)
- [ ] Tab navigation (role-adaptive)
- [ ] Feed screen with location
- [ ] Listing detail + order flow
- [ ] Chat screen
- [ ] Profile screen
- [ ] Push notifications (Expo Notifications)
- [ ] Three.js via expo-gl (adapted)
- [ ] Reanimated 3 animations

### Phase 4: Integration & Polish
- [ ] End-to-end flow testing
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Security audit
- [ ] Cross-browser/device testing

### Phase 5: Deployment
- [ ] API deployment (Railway)
- [ ] Web deployment (Vercel)
- [ ] Mobile build (EAS Build)
- [ ] CI/CD pipeline
- [ ] Monitoring setup

## Links
- [[Architecture]] for tech decisions behind each task
- [[UX-Flows]] for screen specs per task
- [[Brand]] for design tokens to implement
