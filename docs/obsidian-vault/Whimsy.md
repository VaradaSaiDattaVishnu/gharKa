# Whimsy & Animation Map

## Source Document
Full details: [[../WHIMSY_DESIGN.md]]

## Three.js Hero Scene
- Concept: "The Neighborhood Kitchen Table" -- warm, low-poly, handcrafted
- 3D elements: matka pot, brass thali, chutney bowl, roti stack, chai glass, coriander
- Interactions: scroll-driven camera, mouse parallax (desktop), steam particles
- Budget: < 500KB total, < 5000 tris, 60fps on mid-range
- Fallback: static image for low-end devices and reduced-motion

## Page Transitions
- Forward: slide right + scale up (350ms)
- Backward: slide left, faster (280ms)
- Tab switch: crossfade + 8px vertical shift (200ms)
- Shared element: food card photo expands to detail header (spring: 300/30/0.8)

## Micro-Interactions
| Element | Animation | Duration |
|---------|-----------|----------|
| Food card tap | scale(0.97) press | 150ms |
| Heart/save | burst 6 particles, Terracotta fill | 350ms |
| Request button | morph to checkmark, color shift | 400ms |
| Pull-to-refresh | steaming pot, steam maps to pull distance | variable |
| Chat send | slide up + bounce (spring) | 300ms |
| Loading | steaming pot SVG, 3 wisps | 1.5s loop |
| Order complete | confetti (30 particles, brand colors) | 1.5s |
| Tab icons | unique per tab (bounce, flip, shake) | 300-400ms |
| Toast | spring slide from top, auto-dismiss 3s | 300ms in |

## Easing Reference
- **smoothOut**: `[0.22, 1, 0.36, 1]` -- most enter animations
- **smoothIn**: `[0.32, 0, 0.67, 0]` -- exit animations
- **bounce**: `[0.34, 1.56, 0.64, 1]` -- playful arrivals
- **Spring snappy**: stiffness 500, damping 30
- **Spring confident**: stiffness 300, damping 30
- **Spring gentle**: stiffness 100, damping 20

## Scroll Animations
- Cards stagger-in: 80ms between cards, 30px rise + scale 0.95->1
- Parallax on detail: food photo at 0.7x scroll rate
- Section reveals: gentle spring (100/20/0.5)
- Infinite scroll: faster stagger (60ms), less travel (20px)

## Dark Mode
- Backgrounds: warm charcoal (#1A1412), not blue-black
- Turmeric primary: unchanged
- 3D scene: "evening kitchen" lighting (dimmer, more golden)

## CSS Treatments
- Glassmorphism: overlays and nav bar (backdrop-blur 16-20px)
- Gradient mesh: onboarding and landing sections
- Grain texture: 4% opacity multiply blend
- Wavy dividers: asymmetric SVG paths
- Organic blob borders: cook avatars

## Unlike AI-Built Apps
- Asymmetric masonry layouts (not rigid grids)
- Organic shapes (blob borders, wavy dividers)
- Texture overlays (grain, linen)
- Illustrations that break containers
- Typography with personality (rotated quotes, breathing line-height)
- Easter eggs (konami code, logo tap, scroll-to-end)
- Seasonal festival touches (Diwali, Holi, Eid)

## Reduced Motion
All animations have a reduced-motion fallback. Three.js replaced with static image. Transitions become instant cuts. Confetti disabled. Idle animations become static.

## Links
- [[Brand]] for color and typography specs
- [[Architecture]] for Three.js performance rules
- [[UX-Flows]] for which screens get which animations
- [[Behavioral]] for celebration trigger conditions
