# GharKa -- Whimsy & Animation Design Document

**Version**: 1.0
**Last Updated**: 2026-05-08
**Document Owner**: Whimsy Injector Agent
**Status**: Implementation-Ready Specification
**Depends On**: BRAND_GUIDE.md, MASTER_ARCHITECTURE.md, behavioral-engagement-system.md, GharKa-UX-Research-Document.md

---

## Philosophy

GharKa's functional surface is intentionally small: browse food, request a dish, chat with the cook, pick it up. That simplicity is the product's strength. But simplicity without soul feels like a database with a pretty face -- and every AI-built app in 2026 looks exactly like that.

This document exists to make GharKa feel like it was made by people who cook. Every animation references the warmth of a kitchen. Every transition has the unhurried confidence of someone who knows their recipe by heart. Every micro-interaction carries the gentle delight of lifting the lid off a pot and finding exactly what you hoped for.

**The core rule**: Every animation must either (a) reduce perceived wait time, (b) provide spatial orientation during navigation, (c) give tactile feedback that an action registered, or (d) create an emotional moment that deepens community connection. If an animation does none of these, it does not ship.

**The anti-pattern**: Bouncing logos, spinning plate icons for the sake of it, confetti on every button press, and motion that makes users wait for the animation to finish before they can act. GharKa is warm, not hyperactive.

---

## Table of Contents

1. [Three.js Landing Hero](#1-threejs-landing-hero)
2. [Page Transitions](#2-page-transitions)
3. [Micro-Interactions](#3-micro-interactions)
4. [Scroll Animations](#4-scroll-animations)
5. [Dark Mode Strategy](#5-dark-mode-strategy)
6. [Sound Design Concepts](#6-sound-design-concepts)
7. [CSS Magic](#7-css-magic)
8. [What Makes This Unlike AI-Built Apps](#8-what-makes-this-unlike-ai-built-apps)
9. [Reduced Motion Strategy](#9-reduced-motion-strategy)
10. [Performance Budgets](#10-performance-budgets)
11. [Implementation Priority](#11-implementation-priority)

---

## 1. Three.js Landing Hero

### 1.1 Concept: "The Neighborhood Kitchen Table"

The landing page hero is a softly-lit, stylized 3D kitchen scene viewed from slightly above -- as if you are leaning over a warm kitchen counter. The scene is not photorealistic. It uses a low-poly, handcrafted aesthetic that matches GharKa's illustration style: rounded edges, warm materials, visible geometry that feels intentional rather than limited.

The key emotional beat: you scroll down and the camera gently pulls back to reveal the full table, then the food items drift apart to make room for the app's value proposition text. It feels like the kitchen is welcoming you in.

**Why this concept wins over "floating food in abstract space"**: Floating food feels like every food delivery app. A kitchen table feels like home. GharKa's entire brand is "ghar ka khana" -- food from home. The hero scene should literally feel like you are stepping into someone's kitchen.

### 1.2 Scene Composition

```
Camera Position: (0, 3.5, 5) looking at (0, 0.5, 0)
FOV: 45 degrees (tighter than default -- gives a cozy, intimate framing)
Aspect: Full viewport width, 100vh height

LAYER 0 -- Background:
  - Warm gradient sky (not a literal sky -- a soft #FFF3E0 to #E8913A gradient)
  - Subtle animated grain texture overlay (shader-based, not image)
  - Soft volumetric fog at floor level (warm-tinted, very subtle)

LAYER 1 -- Kitchen Surface:
  - A rounded-rectangle wooden table/counter surface
  - Material: Warm wood with subtle grain (baked texture, not PBR)
  - Size: Extends slightly beyond camera frame edges
  - A single cloth napkin (soft body sim baked to animation, terracotta colored)

LAYER 2 -- Hero Food Items (the stars):
  - A steaming clay pot (matka) -- center-left, lid slightly ajar, steam particles rising
  - A brass thali plate with subtle food mounds -- center-right
  - A small bowl of chutney/raita -- front-left
  - A stack of rotis/naan on a cloth -- front-right
  - A steel glass of chai with steam -- far right, slightly behind
  - Fresh coriander sprigs scattered naturally

LAYER 3 -- Atmospheric Details:
  - Warm directional light from upper-left (simulating kitchen window)
  - Soft ambient light (warm fill, no harsh shadows)
  - Floating dust/particle motes in the light beam (very subtle, 15-20 particles)
  - Gentle steam/vapor rising from the pot and chai glass
```

### 1.3 3D Asset Specifications

| Asset | Polygon Budget | Texture | File Format | Estimated Size |
|-------|---------------|---------|-------------|----------------|
| Wooden table surface | 200 tris | 512x512 baked wood | .glb (DRACO) | ~40KB |
| Clay pot (matka) with lid | 800 tris | 512x512 clay material | .glb (DRACO) | ~60KB |
| Brass thali plate | 400 tris | 256x256 brass metallic | .glb (DRACO) | ~30KB |
| Chutney bowl | 300 tris | 256x256 ceramic | .glb (DRACO) | ~25KB |
| Roti stack | 500 tris | 256x256 bread texture | .glb (DRACO) | ~35KB |
| Chai glass | 200 tris | 128x128 steel | .glb (DRACO) | ~15KB |
| Napkin | 150 tris | 256x256 cloth | .glb (DRACO) | ~20KB |
| Coriander sprigs (x3) | 100 tris each | 256x256 leaf atlas | .glb (DRACO) | ~25KB |
| **Total** | **~2950 tris** | | | **~250KB** |

**Modeling guidelines**:
- All models should have slightly rounded edges (beveled, not sharp). This matches the brand's icon style: "hand-drawn-adjacent but precise."
- Colors should be baked into vertex colors or simple textures. No complex PBR materials. The look is warm and flat-shaded with soft lighting, not photorealistic.
- All models should be created in Blender, exported as .glb with DRACO compression at maximum compression level.
- The pot and chai glass need separate "lid" and "steam origin" empties for animation attachment.

### 1.4 Lighting Setup

```typescript
// Three.js Lighting Configuration

// Key light -- simulates warm kitchen window light
<directionalLight
  position={[4, 6, 3]}
  intensity={1.2}
  color="#FFF0D4"        // Warm white, slightly golden
  castShadow
  shadow-mapSize={[1024, 1024]}
  shadow-camera-far={20}
  shadow-camera-near={0.5}
  shadow-bias={-0.0005}
/>

// Fill light -- soft ambient warmth, prevents harsh shadows
<ambientLight
  intensity={0.4}
  color="#FFE8CC"         // Very warm ambient
/>

// Rim light -- subtle back-light on the pot and thali for depth
<pointLight
  position={[-3, 2, -2]}
  intensity={0.3}
  color="#E8913A"         // Turmeric-tinted rim
  distance={10}
  decay={2}
/>

// Environment -- soft studio HDRI for reflections on brass/steel
// Use a pre-blurred, low-res environment map (64x64 is enough for soft reflections)
<Environment preset="apartment" background={false} blur={0.8} />
```

### 1.5 Animation Keyframes

#### Steam Particle System

```typescript
// steam-particles.tsx
// Custom shader-based steam using instanced geometry (NOT sprite particles)
// This avoids the overhead of hundreds of draw calls

interface SteamConfig {
  origin: [number, number, number];
  count: number;       // 20-30 particles per source
  speed: number;       // Rise speed: 0.3-0.5 units/sec
  spread: number;      // Horizontal drift: 0.1-0.2 units
  opacity: number;     // Start opacity: 0.15-0.25
  scale: number;       // Particle scale: 0.05-0.15 units
  color: string;       // "#FFFFFF" with alpha fade
}

// Animation per particle (continuous loop):
// t=0.0: spawn at origin, scale=0, opacity=0
// t=0.1: scale ramps to full, opacity ramps to config.opacity
// t=0.5: particle has risen ~50% of max height, slight horizontal drift via simplex noise
// t=0.8: opacity begins fading
// t=1.0: opacity=0, particle resets to origin with new random seed
//
// Total cycle: 3-4 seconds per particle, staggered starts
// Easing: opacity uses ease-in-out, position uses linear with noise perturbation
//
// Performance: Use InstancedMesh with a custom ShaderMaterial.
// Single draw call for all steam particles across all sources.
```

#### Food Item Floating Animation

Each food item gently hovers in place with organic motion. This is NOT a bounce -- it is the barely perceptible drift of something resting on a warm surface, like heat shimmer.

```typescript
// Idle floating animation for each food item
// Uses drei's Float component with custom parameters

<Float
  speed={1.2}           // Oscillation speed (slow, meditative)
  rotationIntensity={0.1}  // Very subtle rotation (degrees)
  floatIntensity={0.15}    // Gentle vertical bob (units)
  floatingRange={[-0.03, 0.03]}  // Total range: 6cm in scene units
>
  <FoodModel />
</Float>

// Each item has a slightly different speed to avoid synchronization:
// Pot:       speed=1.0,  floatIntensity=0.10  (heaviest, least motion)
// Thali:     speed=1.2,  floatIntensity=0.12
// Bowl:      speed=1.4,  floatIntensity=0.18
// Rotis:     speed=1.1,  floatIntensity=0.08  (stable, grounded)
// Chai:      speed=1.3,  floatIntensity=0.15
// Coriander: speed=1.8,  floatIntensity=0.25  (lightest, most motion)
```

#### Scroll-Driven Camera Animation

The landing page hero responds to scroll position. As the user scrolls down, the scene transforms.

```typescript
// Scroll phases mapped to normalized scroll position (0 to 1)
// where 0 = top of hero section, 1 = bottom of hero section (100vh)

// PHASE 1: "Welcome" (scroll 0.0 - 0.3)
// Camera holds at initial position
// Food items complete their idle animation
// Text overlay: "Your neighbor's kitchen, one tap away." (Caveat font, handwritten feel)
// Text fades in with stagger over 600ms after scene loads

camera: {
  position: { from: [0, 3.5, 5], to: [0, 3.5, 5] },
  lookAt: [0, 0.5, 0],
  fov: 45
}

// PHASE 2: "Reveal" (scroll 0.3 - 0.7)
// Camera slowly pulls back and rises, revealing more of the table
// Food items drift apart gently (each moves 0.3-0.5 units from center)
// Steam intensifies slightly (more particles, slightly faster)
// Space opens in the center for the CTA text

camera: {
  position: { from: [0, 3.5, 5], to: [0, 5.0, 7] },
  lookAt: { from: [0, 0.5, 0], to: [0, 0.3, 0] },
  fov: { from: 45, to: 50 }
}

foodItems: {
  pot:      { translateX: -0.4, translateZ: -0.2 },
  thali:    { translateX: 0.5,  translateZ: -0.1 },
  bowl:     { translateX: -0.3, translateZ: 0.3 },
  rotis:    { translateX: 0.3,  translateZ: 0.4 },
  chai:     { translateX: 0.6,  translateZ: 0.0 },
}

// PHASE 3: "Invitation" (scroll 0.7 - 1.0)
// Camera continues pulling back
// Scene fades with a warm gradient overlay from bottom
// CTA buttons appear ("Explore Dishes" / "Start Cooking")
// Transition into the main content below

camera: {
  position: { from: [0, 5.0, 7], to: [0, 5.5, 8] },
}

sceneOpacity: { from: 1.0, to: 0.0 }  // Smooth fade via a full-screen gradient mesh
```

#### Mouse/Cursor Parallax (Desktop Only)

```typescript
// Subtle parallax response to mouse position (desktop only)
// Detected via window.matchMedia('(hover: hover)')

// Mouse position mapped to normalized range [-1, 1] for both axes
// Applied as rotation offset to the entire scene group

const mouseInfluence = {
  rotationY: mouseX * 0.03,   // Max 1.7 degrees horizontal
  rotationX: mouseY * -0.02,  // Max 1.1 degrees vertical (inverted for natural feel)
  ease: 'lerp',               // Smooth interpolation, not direct mapping
  lerpFactor: 0.05,           // Slow follow (takes ~20 frames to reach target)
};

// The lerp factor is critical. Direct mouse mapping feels jittery and cheap.
// Slow lerp feels like the scene has physical weight -- like a heavy table
// responding to a gentle nudge.
```

### 1.6 React Three Fiber Component Architecture

```
components/
  three/
    hero-scene.tsx           # Main Canvas wrapper + Suspense boundary
    kitchen-table.tsx         # Table surface model + material
    food-items/
      matka-pot.tsx           # Clay pot with lid animation
      thali-plate.tsx         # Brass thali with food
      chutney-bowl.tsx        # Small bowl
      roti-stack.tsx          # Bread stack
      chai-glass.tsx          # Steel glass
      coriander-sprig.tsx     # Herb decoration
    effects/
      steam-particles.tsx     # Instanced steam particle system
      dust-motes.tsx          # Floating dust in light beam
      warm-fog.tsx            # Ground-level volumetric fog
    controls/
      scroll-camera.tsx       # Scroll-driven camera animation controller
      mouse-parallax.tsx      # Desktop mouse parallax
    fallback/
      hero-fallback.tsx       # Static image fallback for low-end devices
      hero-skeleton.tsx       # Loading skeleton while 3D loads
```

```typescript
// hero-scene.tsx -- Top-level component

'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { HeroSkeleton } from './fallback/hero-skeleton';
import { HeroFallback } from './fallback/hero-fallback';

// Lazy-load the entire Canvas (Three.js must not be in the server bundle)
const Scene3D = dynamic(() => import('./scene-3d'), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});

export function HeroScene() {
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    // Device capability check -- matches MASTER_ARCHITECTURE.md rules
    const cores = navigator.hardwareConcurrency ?? 2;
    const memory = (navigator as any).deviceMemory ?? 2;
    const isLowEnd = cores < 4 || memory < 4;

    // Also check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    setCanRender3D(!isLowEnd && !prefersReducedMotion);
  }, []);

  if (!canRender3D) {
    return <HeroFallback />;
  }

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      aria-label="GharKa welcome scene -- a warm kitchen table with homemade food"
    >
      <Suspense fallback={<HeroSkeleton />}>
        <Scene3D />
      </Suspense>

      {/* Text overlay -- positioned absolutely over the Canvas */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 pointer-events-none">
        <h1
          className="font-caveat text-5xl md:text-7xl text-white drop-shadow-lg"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        >
          Your neighbor's kitchen
        </h1>
        <p className="font-nunito text-xl md:text-2xl text-white/90 mt-2 drop-shadow">
          one tap away
        </p>
        <div className="pointer-events-auto mt-8 flex gap-4">
          <button className="bg-turmeric hover:bg-turmeric-dark text-white font-nunito font-bold px-8 py-3 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl">
            Explore Dishes
          </button>
          <button className="bg-white/20 backdrop-blur-md text-white font-nunito font-semibold px-8 py-3 rounded-2xl border border-white/30 transition-all duration-200 hover:bg-white/30">
            Start Cooking
          </button>
        </div>
      </div>
    </section>
  );
}
```

```typescript
// scene-3d.tsx -- The actual R3F Canvas and scene graph

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, useGLTF, Environment, useScroll } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { SteamParticles } from './effects/steam-particles';
import { DustMotes } from './effects/dust-motes';
import { ScrollCamera } from './controls/scroll-camera';
import { MouseParallax } from './controls/mouse-parallax';

// Pre-load all models at module level
useGLTF.preload('/models/kitchen-table.glb');
useGLTF.preload('/models/matka-pot.glb');
useGLTF.preload('/models/thali-plate.glb');
useGLTF.preload('/models/chutney-bowl.glb');
useGLTF.preload('/models/roti-stack.glb');
useGLTF.preload('/models/chai-glass.glb');
useGLTF.preload('/models/coriander-sprig.glb');

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 3.5, 5], fov: 45, near: 0.1, far: 50 }}
      dpr={[1, 1.5]}                          // Cap at 1.5x for performance
      frameloop="always"                        // Continuous for steam animation
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: 'high-performance',
      }}
      style={{ background: 'linear-gradient(180deg, #FFF3E0 0%, #E8913A 100%)' }}
    >
      {/* Lighting */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.2}
        color="#FFF0D4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={0.4} color="#FFE8CC" />
      <pointLight position={[-3, 2, -2]} intensity={0.3} color="#E8913A" distance={10} />

      <Environment preset="apartment" background={false} />

      {/* Scene group -- mouse parallax applied to this */}
      <MouseParallax>
        <group>
          {/* Table surface */}
          <KitchenTable />

          {/* Food items with Float wrappers */}
          <Float speed={1.0} floatIntensity={0.10} rotationIntensity={0.05}>
            <MatkaPot position={[-0.8, 0.6, 0.2]} />
          </Float>

          <Float speed={1.2} floatIntensity={0.12} rotationIntensity={0.08}>
            <ThaliPlate position={[0.7, 0.35, 0.1]} />
          </Float>

          <Float speed={1.4} floatIntensity={0.18} rotationIntensity={0.10}>
            <ChutneyBowl position={[-0.5, 0.3, 1.0]} />
          </Float>

          <Float speed={1.1} floatIntensity={0.08} rotationIntensity={0.03}>
            <RotiStack position={[0.4, 0.25, 0.9]} />
          </Float>

          <Float speed={1.3} floatIntensity={0.15} rotationIntensity={0.06}>
            <ChaiGlass position={[1.2, 0.35, 0.5]} />
          </Float>

          {/* Steam effects */}
          <SteamParticles origin={[-0.8, 1.1, 0.2]} count={25} speed={0.4} />
          <SteamParticles origin={[1.2, 0.7, 0.5]} count={15} speed={0.3} />

          {/* Atmospheric */}
          <DustMotes count={15} bounds={[4, 3, 3]} />
        </group>
      </MouseParallax>

      {/* Scroll-driven camera controller */}
      <ScrollCamera />
    </Canvas>
  );
}
```

### 1.7 Performance Strategy

| Constraint | Target | Enforcement |
|-----------|--------|-------------|
| Total 3D asset size | < 500KB (DRACO compressed) | Measured at build time via custom webpack plugin |
| Time to first frame | < 2 seconds on 4G | Models preloaded, Canvas lazy-loaded with skeleton |
| Frame rate | 60fps on mid-range (Snapdragon 7-series) | Profile with Chrome DevTools, cap DPR at 1.5 |
| Total triangle count | < 5,000 | Enforced in Blender before export |
| Texture memory | < 4MB uncompressed | Use 256x256-512x512 max, atlas where possible |
| JavaScript bundle | Three.js + R3F chunk < 150KB gzipped | Dynamic import, tree-shake drei |
| Low-end fallback | Static image + CSS gradient | navigator.hardwareConcurrency < 4 |
| Reduced motion | Static image, no animation | prefers-reduced-motion: reduce |

**Loading sequence**:
1. HTML renders immediately with the background gradient (#FFF3E0 to #E8913A) via CSS.
2. The hero text and CTA buttons render as static HTML (visible within 500ms).
3. The HeroSkeleton shows a subtle shimmer animation where the 3D scene will appear.
4. Three.js, R3F, and models load asynchronously (code-split chunk).
5. Scene fades in over 800ms with opacity transition once all models are loaded.
6. Steam particles begin after a 200ms delay (prevents initial frame drop).

### 1.8 Fallback Component

```typescript
// hero-fallback.tsx
// Shown on low-end devices, reduced-motion preference, or while 3D loads

export function HeroFallback() {
  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 30% 60%, rgba(232, 145, 58, 0.15) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 40%, rgba(46, 125, 82, 0.08) 0%, transparent 50%),
          linear-gradient(180deg, #FFF3E0 0%, #F5E6D0 50%, #E8913A 100%)
        `,
      }}
    >
      {/* Static illustration of the kitchen scene */}
      {/* Use a high-quality WebP/AVIF image rendered from the 3D scene */}
      <img
        src="/images/hero-kitchen-static.webp"
        alt="A warm kitchen table with homemade Indian food"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        loading="eager"
        fetchPriority="high"
      />

      {/* Subtle CSS-only atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Same text overlay as 3D version */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24">
        <h1 className="font-caveat text-5xl md:text-7xl text-white drop-shadow-lg">
          Your neighbor's kitchen
        </h1>
        <p className="font-nunito text-xl md:text-2xl text-white/90 mt-2 drop-shadow">
          one tap away
        </p>
      </div>
    </section>
  );
}
```

### 1.9 Mobile Adaptation

On mobile (viewport width < 768px), the 3D scene is simplified:

- Remove dust motes entirely (saves draw calls).
- Reduce steam particle count by 50% (15 on pot, 8 on chai).
- Reduce DPR cap to 1.0.
- Disable mouse parallax (no hover on touch).
- Replace scroll-driven camera animation with a simpler vertical fade (the 3D scene fades out as user scrolls, replaced by content).
- Shadow map reduced to 512x512.
- Consider replacing the full 3D scene with a "hero-lite" version: a single animated element (the steaming matka pot) floating over the gradient background, with the other items as 2D illustrations.

---

## 2. Page Transitions

### 2.1 Transition Philosophy

Page transitions in GharKa serve a spatial purpose: they help users build a mental map of where they are. Forward navigation feels like stepping deeper into a space. Backward navigation feels like stepping back out. Tab switches feel like turning your head. This is not decoration -- it is wayfinding.

### 2.2 Forward Navigation (Deeper into content)

**Trigger**: Tapping a food card, opening a profile, entering chat from an order.

**Animation**: The new page slides in from the right with a slight scale-up, while the current page slides left and scales down slightly. This creates a layered "card stack" feeling.

```typescript
// variants/page-transitions.ts

export const pageForward = {
  initial: {
    x: '30%',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
  },
  animate: {
    x: '0%',
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],       // Custom ease: fast start, gentle deceleration
    },
  },
  exit: {
    x: '-15%',
    opacity: 0.5,
    scale: 0.97,
    filter: 'blur(2px)',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
```

### 2.3 Backward Navigation (Returning)

**Trigger**: Back button, swipe-back gesture, breadcrumb navigation.

**Animation**: The inverse of forward -- current page slides right and fades, previous page slides in from left with scale-up. The key difference: backward is slightly faster (280ms vs 350ms) because users expect instant response when going back.

```typescript
export const pageBackward = {
  initial: {
    x: '-20%',
    opacity: 0.5,
    scale: 0.97,
  },
  animate: {
    x: '0%',
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    x: '30%',
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.25,
      ease: [0.32, 0, 0.67, 0],      // Slightly different ease for "departing" feel
    },
  },
};
```

### 2.4 Shared Element Transition: Food Card to Detail Page

This is the signature transition. When a user taps a food card, the food photo appears to expand from the card position to fill the detail page header. This creates the strongest sense of spatial continuity.

```typescript
// Implementation uses Framer Motion's layoutId

// In the food card component (listing-card.tsx):
<motion.div layoutId={`food-image-${listing.id}`}>
  <img
    src={listing.photo}
    className="w-full aspect-[4/3] object-cover rounded-t-2xl"
    alt={listing.title}
  />
</motion.div>

<motion.h3 layoutId={`food-title-${listing.id}`}>
  {listing.title}
</motion.h3>

<motion.p layoutId={`food-price-${listing.id}`}>
  Rs {listing.price}
</motion.p>

// In the detail page component (listing-detail.tsx):
<motion.div layoutId={`food-image-${listing.id}`}>
  <img
    src={listing.photo}
    className="w-full aspect-[16/9] object-cover"
    alt={listing.title}
  />
</motion.div>

<motion.h1 layoutId={`food-title-${listing.id}`}>
  {listing.title}
</motion.h1>

<motion.p layoutId={`food-price-${listing.id}`}>
  Rs {listing.price}
</motion.p>

// The layout transition config:
<LayoutGroup>
  <AnimatePresence mode="popLayout">
    {/* Router outlet */}
  </AnimatePresence>
</LayoutGroup>

// Transition spring config for shared elements:
const sharedElementTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};
// This gives a confident, quick transition with just a hint of organic overshoot.
// Duration: approximately 350ms to settle.
```

### 2.5 Tab Switching

**Animation**: A crossfade with subtle vertical shift. The exiting tab's content fades out while shifting down 8px. The entering tab's content fades in while shifting up from 8px. This creates a gentle "stack" feeling without the weight of a full page transition.

```typescript
export const tabSwitch = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
```

### 2.6 Modal/Sheet Transitions

**Bottom sheet** (used for filters, quick actions): Slides up from bottom with spring physics. Background dims with a 60% black overlay.

```typescript
export const bottomSheet = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  },
  sheet: {
    initial: { y: '100%' },
    animate: {
      y: '0%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 35,
        mass: 0.8,
      },
    },
    exit: {
      y: '100%',
      transition: {
        duration: 0.25,
        ease: [0.32, 0, 0.67, 0],
      },
    },
  },
};
```

**Full-screen modal** (used for image viewer, full listing creation): Fades in with scale from 0.92 to 1.0.

```typescript
export const fullModal = {
  initial: {
    opacity: 0,
    scale: 0.92,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: {
      duration: 0.2,
    },
  },
};
```

### 2.7 Page Transition Context Provider

```typescript
// providers/transition-context.tsx
// Tracks navigation direction to apply correct transition variant

'use client';

import { createContext, useContext, useRef } from 'react';
import { usePathname } from 'next/navigation';

type Direction = 'forward' | 'backward' | 'tab';

const TransitionContext = createContext<Direction>('forward');

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const history = useRef<string[]>([]);
  const direction = useRef<Direction>('forward');

  // Determine direction based on history
  // If new path is in history, it is a backward navigation
  // If new path is a sibling route (same depth), it is a tab switch
  // Otherwise it is forward navigation

  const prevPath = history.current[history.current.length - 1];

  if (history.current.includes(pathname)) {
    // Going back to a previously visited page
    direction.current = 'backward';
    // Pop history back to that point
    const idx = history.current.indexOf(pathname);
    history.current = history.current.slice(0, idx + 1);
  } else if (
    prevPath &&
    pathname.split('/').length === prevPath.split('/').length
  ) {
    // Same depth -- tab switch
    direction.current = 'tab';
    history.current.push(pathname);
  } else {
    // Deeper -- forward
    direction.current = 'forward';
    history.current.push(pathname);
  }

  return (
    <TransitionContext.Provider value={direction.current}>
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransitionDirection = () => useContext(TransitionContext);
```

---

## 3. Micro-Interactions

### 3.1 Food Card Hover & Tap

The food listing card is the most-interacted element in the app. Its micro-interaction must feel tactile and premium.

```typescript
// components/listing-card.tsx

const cardVariants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 10px 25px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.06)',
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  tap: {
    scale: 0.97,
    y: 0,
    boxShadow: '0 1px 2px rgba(0,0,0,0.10)',
    transition: {
      duration: 0.1,
      ease: 'easeOut',
    },
  },
};

// Image zoom on hover (CSS-only for performance):
const imageStyle = `
  .card-image {
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .card:hover .card-image {
    transform: scale(1.05);
  }
`;

// 3D tilt effect on hover (desktop only, CSS perspective):
// Applied via onMouseMove tracking cursor position relative to card center
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  e.currentTarget.style.transform = `
    perspective(800px)
    rotateY(${x * 5}deg)
    rotateX(${y * -5}deg)
    scale(1.02)
    translateY(-4px)
  `;
};

const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.transform = '';
  e.currentTarget.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
};
```

### 3.2 "Request This Dish" Button

The primary CTA. Three distinct phases: idle, pressing, and success.

```typescript
// components/request-button.tsx

// Phase 1: IDLE
// The button has a subtle gradient shimmer that travels across it every 4 seconds.
// This draws the eye without being aggressive.
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
`;

// The button background:
// background: linear-gradient(
//   110deg,
//   #E8913A 0%,
//   #E8913A 40%,
//   #F0A855 50%,         <-- lighter stripe
//   #E8913A 60%,
//   #E8913A 100%
// );
// background-size: 200% 100%;
// animation: shimmer 4s ease-in-out infinite;

// Phase 2: PRESSING
// On press (tap start), the button compresses:
const pressAnimation = {
  scale: 0.95,
  transition: { duration: 0.1, ease: 'easeOut' },
};

// Phase 3: SUCCESS
// After the API confirms the request, the button transforms:
// 1. Text morphs from "Request This Dish" to a checkmark icon
// 2. Background shifts from Turmeric to Coriander (success green)
// 3. Small particle burst from the button center (6-8 tiny circles in brand colors)
// 4. After 1.5s, button settles into a "Requested" state (Coriander bg, static)

const successSequence = {
  // Step 1: Width contracts slightly as text fades
  morphToCheck: {
    width: ['100%', '48px'],
    borderRadius: ['12px', '24px'],
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },

  // Step 2: Color transition
  colorShift: {
    backgroundColor: ['#E8913A', '#2E7D52'],
    transition: { duration: 0.3, delay: 0.1 },
  },

  // Step 3: Checkmark appears with scale bounce
  checkmark: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: {
      duration: 0.4,
      delay: 0.2,
      ease: [0.34, 1.56, 0.64, 1],    // Overshoot ease for bounce
    },
  },

  // Step 4: Expand back to "Requested" text state
  settle: {
    width: ['48px', '100%'],
    borderRadius: ['24px', '12px'],
    transition: { duration: 0.3, delay: 0.8 },
  },
};

// Particle burst implementation:
// 8 small circles (4px diameter) in Turmeric, Light Turmeric, Coriander, white
// Burst outward from button center in random directions
// Travel 20-40px from origin
// Fade out over 400ms
// Use Framer Motion's useAnimate for orchestration
```

### 3.3 Heart/Save Animation

The heart animation is the single most "delightful" micro-interaction in the app (per BRAND_GUIDE.md). It must be small but satisfying. Think: the Twitter/X heart burst, adapted for GharKa's warm palette.

```typescript
// components/heart-button.tsx

// UNSAVED -> SAVED animation sequence:

// 1. Heart icon scales down to 0 (squish)
//    Duration: 80ms, ease: easeIn

// 2. Heart icon scales back up to 1.3 (overshoot) with fill color
//    Color shifts from Neutral 500 (outline) to Terracotta (#D84315)
//    Duration: 250ms, ease: [0.34, 1.56, 0.64, 1] (spring overshoot)

// 3. Heart settles from 1.3 to 1.0
//    Duration: 150ms, ease: easeOut

// 4. Simultaneously with step 2, burst particles:
//    - 6 small circles arranged in a ring around the heart
//    - Colors: Terracotta, Turmeric, Light Turmeric (alternating)
//    - Start at heart center, scale=0
//    - Expand outward 12-16px from center
//    - Scale up to 1.0, then fade to 0
//    - Duration: 350ms per particle
//    - Staggered start: 30ms between each particle
//    - Each particle has slight random offset for organic feel

// 5. Optional: single-frame "glow" ring around heart
//    A circle that expands from heart size to 2x and fades
//    Color: Terracotta at 20% opacity
//    Duration: 300ms

// SAVED -> UNSAVED animation:
// Simple: heart scales to 0.8 and back to 1.0 (150ms)
// Color fades from Terracotta to Neutral 500
// No particles (unsaving is not a celebration)

const heartSaveAnimation = {
  saved: {
    scale: [1, 0, 1.3, 1],
    transition: {
      times: [0, 0.15, 0.6, 1],
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  unsaved: {
    scale: [1, 0.8, 1],
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
};

// Particle burst (Framer Motion):
const burstParticle = (index: number, total: number) => {
  const angle = (index / total) * Math.PI * 2;
  const distance = 14 + Math.random() * 4;  // 14-18px

  return {
    initial: { x: 0, y: 0, scale: 0, opacity: 1 },
    animate: {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      scale: [0, 1, 0.5],
      opacity: [1, 1, 0],
      transition: {
        duration: 0.35,
        delay: index * 0.03,
        ease: 'easeOut',
      },
    },
  };
};
```

### 3.4 Pull-to-Refresh: Steaming Pot

When the user pulls down on the feed, a small clay pot appears and "steams" proportionally to pull distance. This replaces a generic spinner and reinforces the GharKa brand at every refresh.

```typescript
// components/pull-to-refresh.tsx

// Anatomy:
// - A small SVG/Lottie clay pot icon (the primary loader from BRAND_GUIDE.md)
// - Three steam wisps animated as bezier paths
// - Text below: "Checking what's cooking..."

// Pull distance mapping (0-100px pull):
//
// 0-30px:   Pot appears, scaling from 0 to 1. No steam yet.
//           Pot rotates slightly (-5deg to 0deg) as if being lifted.
//           Text: hidden
//
// 30-60px:  Steam wisp 1 begins animating (slow, short wisps).
//           Pot is fully visible, gentle bounce idle.
//           Text fades in: "Checking what's cooking..."
//
// 60-80px:  Steam wisps 2 and 3 join. All three animate faster.
//           Pot begins a subtle rocking motion (2deg oscillation).
//
// 80-100px: Full steam. Wisps are tall and fast.
//           Pot rocks more noticeably.
//           Text: "Almost ready..."
//
// RELEASE (at >60px threshold):
//           Pot locks into loading position (centered, steady).
//           Steam loops at full intensity.
//           Text: "Stirring the pot..."
//           Stays until data loads, then pot scales down to 0 over 200ms.
//
// REFRESH COMPLETE:
//           Pot does a tiny celebratory bounce (scale 1 -> 1.15 -> 1 over 200ms)
//           Then scales to 0 and disappears.
//           New content fades in from below.

// SVG Steam wisp animation (CSS keyframes):
const steamWisp = `
  @keyframes steam-rise {
    0% {
      transform: translateY(0) scaleX(1);
      opacity: 0;
    }
    15% {
      opacity: var(--steam-opacity, 0.6);
    }
    50% {
      transform: translateY(-12px) scaleX(1.2);
    }
    100% {
      transform: translateY(-24px) scaleX(0.8);
      opacity: 0;
    }
  }

  .steam-wisp {
    animation: steam-rise var(--steam-duration, 1.5s) ease-out infinite;
  }
  .steam-wisp:nth-child(2) {
    animation-delay: 0.3s;
    transform-origin: center;
  }
  .steam-wisp:nth-child(3) {
    animation-delay: 0.6s;
    transform-origin: center;
  }
`;
```

### 3.5 Chat Message Send

When a message is sent, it should feel like it physically "arrives" in the conversation.

```typescript
// Message send animation

const messageSend = {
  // New message enters from bottom-right (sender's side)
  initial: {
    opacity: 0,
    y: 20,
    x: 10,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
      mass: 0.5,
    },
  },
  // Approximate duration: 300ms to settle
};

// Received message enters from bottom-left
const messageReceive = {
  initial: {
    opacity: 0,
    y: 20,
    x: -10,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
      mass: 0.5,
    },
  },
};

// Typing indicator: three dots that pulse in sequence
// (matches the brand's inline loader: "three dots in Turmeric that pulse in sequence")
const typingDot = (index: number) => ({
  animate: {
    y: [0, -6, 0],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      delay: index * 0.15,
      ease: 'easeInOut',
    },
  },
});

// Send button press: the send icon rotates 360deg and the message "launches"
const sendButtonPress = {
  tap: {
    rotate: 360,
    scale: [1, 0.85, 1],
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};
```

### 3.6 Loading State: Steaming Pot (Primary Loader)

No spinners. Ever. The brand uses a small outlined pot with animated steam wisps.

```typescript
// components/loading-pot.tsx

// SVG Structure:
// - Pot body: outlined in Turmeric (#E8913A), 1.5px stroke, rounded corners
// - Pot handles: two small arc handles
// - Lid: slightly offset at an angle (3deg tilt) to show steam escaping
// - Three steam paths: bezier curves rising from the gap between lid and pot

// Animation:
// - Steam wisps animate in a staggered wave pattern
//   Wisp 1: animation-duration 1.5s, delay 0s
//   Wisp 2: animation-duration 1.5s, delay 0.3s
//   Wisp 3: animation-duration 1.5s, delay 0.6s
// - Each wisp: rises from y=0 to y=-24, fades from opacity 0.6 to 0
// - Horizontal sway via scaleX oscillation (1.0 -> 1.2 -> 0.8)
// - Lid has a micro-bounce: translateY 0px -> -1px -> 0px, 2s cycle
//   This makes the pot feel "alive" -- like it is actually simmering

// Size variants:
// - sm: 24x24px (inline, next to text)
// - md: 40x40px (card loading states)
// - lg: 64x64px (full-page loading)
// - xl: 96x96px (empty state illustrations)

// Accessibility:
// <svg role="img" aria-label="Loading content">
//   <title>Loading</title>
// </svg>
// For screen readers, pair with visually hidden text: "Loading, please wait."
```

### 3.7 Order Status Change Celebration

When an order moves to a new status, a brief animation confirms the change.

```typescript
// Status progression: PENDING -> CONFIRMED -> PICKED_UP -> COMPLETED

// PENDING -> CONFIRMED:
// The status badge morphs from yellow/pending to Coriander/confirmed.
// A small pulse ring expands from the badge (like a ripple).
// Duration: 400ms
const confirmedAnimation = {
  badge: {
    backgroundColor: ['#F9A825', '#2E7D52'],
    scale: [1, 1.15, 1],
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },
  ripple: {
    scale: [1, 2.5],
    opacity: [0.4, 0],
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// CONFIRMED -> PICKED_UP:
// Badge color shifts to Turmeric. A small "walking" icon briefly appears
// and translates 20px to the right before fading.
// Duration: 500ms

// PICKED_UP -> COMPLETED:
// This is the big celebration (per behavioral-engagement-system.md).
// Badge turns Coriander with a gold border.
// canvas-confetti fires a small burst (30 particles, brand colors only).
// The entire order card gets a brief golden glow (box-shadow pulse).
// Duration: 1.5s total

const completedCelebration = {
  badge: {
    backgroundColor: '#2E7D52',
    borderColor: '#E8913A',
    scale: [1, 1.2, 1],
    transition: { duration: 0.5 },
  },
  card: {
    boxShadow: [
      '0 0 0 rgba(232, 145, 58, 0)',
      '0 0 30px rgba(232, 145, 58, 0.3)',
      '0 0 0 rgba(232, 145, 58, 0)',
    ],
    transition: { duration: 1.5, ease: 'easeInOut' },
  },
};

// canvas-confetti configuration for COMPLETED:
// import confetti from 'canvas-confetti';
// confetti({
//   particleCount: 30,
//   spread: 60,
//   origin: { y: 0.7 },
//   colors: ['#E8913A', '#2E7D52', '#D84315', '#FFF3E0'],
//   gravity: 1.2,
//   scalar: 0.8,
//   ticks: 100,
//   disableForReducedMotion: true,
// });
```

### 3.8 Navigation Tab Icons

Tab bar icons animate on selection. Each icon has a unique, brief animation that relates to its function.

```typescript
// Tab icon animations (triggered on tab select)

const tabAnimations = {
  home: {
    // Home icon: a tiny chimney smoke puff appears briefly
    // The house icon scales 1 -> 1.15 -> 1 with a bounce
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.35,
      ease: [0.34, 1.56, 0.64, 1],     // Spring overshoot
    },
  },

  orders: {
    // Orders icon (receipt/list): the icon does a subtle "flip" on Y-axis
    // Simulates a receipt being turned over
    rotateY: [0, 180, 360],
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  add: {
    // Add/plus icon: rotates 90deg (plus becomes a different plus orientation)
    // and scales up, giving a "pop" feel
    rotate: [0, 90],
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },

  chat: {
    // Chat icon: a small dot (notification-style) pulses once above the icon
    // The icon itself does a gentle horizontal shake (like a phone vibrating)
    x: [0, -2, 2, -1, 1, 0],
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },

  profile: {
    // Profile icon: the head/avatar gently nods (rotateZ -3deg and back)
    // A warm, friendly gesture
    rotateZ: [0, -3, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.35,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

// Icon color transition:
// Inactive: Neutral 700 (#546E7A)
// Active: Turmeric (#E8913A) with filled variant
// Transition: 200ms ease, color and fill change simultaneously with the scale animation
```

### 3.9 Toast Notifications

Toasts slide in from the top with a spring physics feel and auto-dismiss.

```typescript
// components/toast.tsx

const toastVariants = {
  initial: {
    y: -100,
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.8,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Toast types with personality:
//
// SUCCESS: Left border in Coriander (#2E7D52), small checkmark icon that
//          scales in with bounce. Auto-dismiss: 3 seconds.
//
// ERROR:   Left border in Error Red (#C62828). Icon shakes briefly
//          (horizontal vibrate, 3 cycles, 200ms). Auto-dismiss: 5 seconds.
//          Copy example: "Oops, something went sideways. Give it another try?"
//
// INFO:    Left border in Turmeric (#E8913A). Subtle slide-in, no
//          extra icon animation. Auto-dismiss: 3 seconds.
//
// ORDER:   Special toast for order-related notifications.
//          Left border in Turmeric. Shows the food item's thumbnail (32x32, rounded).
//          Copy: "[Cook name] confirmed your order!" with cook's name in bold.
//          Tappable -- navigates to order detail.

// Auto-dismiss progress bar:
// A thin (2px) bar at the bottom of the toast that shrinks from 100% to 0%
// over the auto-dismiss duration. Color matches the left border.
// Uses CSS animation for performance (no JS frame loop needed).
const progressBar = `
  @keyframes toast-countdown {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
  }
  .toast-progress {
    transform-origin: left;
    animation: toast-countdown var(--toast-duration, 3s) linear forwards;
  }
`;
```

### 3.10 Empty State Idle Animations

Empty states in GharKa have gentle, looping animations that keep the screen feeling alive without being distracting.

```typescript
// Empty state animations (Framer Motion or CSS)

// Pattern 1: Floating plate (used in "No orders yet" empty state)
// A plate illustration gently bobs up and down with slow rotation
const floatingPlate = {
  animate: {
    y: [0, -8, 0],
    rotate: [-1, 1, -1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Pattern 2: Swaying steam (used in "No listings" empty state)
// Steam wisps from an illustrated pot sway side to side
const swayingSteam = `
  @keyframes sway {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(3px) rotate(2deg); }
    75% { transform: translateX(-3px) rotate(-2deg); }
  }
  .empty-state-steam {
    animation: sway 3s ease-in-out infinite;
  }
`;

// Pattern 3: Gentle pulse (used in "No chats" empty state)
// The speech bubble illustration gently scales between 0.97 and 1.03
const gentlePulse = {
  animate: {
    scale: [1, 1.03, 1, 0.97, 1],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Pattern 4: Waiting dots (used alongside "Your neighborhood kitchen is warming up")
// Three small circles that sequentially light up in Turmeric, then fade
// Gives a sense of anticipation without urgency
```

### 3.11 Image Upload Progress

When a cook uploads a food photo, the upload progress is shown with personality.

```typescript
// Upload animation:
// 1. Photo thumbnail appears in a circular frame with a Turmeric border
// 2. The border acts as a circular progress indicator (like a donut chart filling)
// 3. As progress advances, the photo gradually de-blurs
//    - 0%: blur(12px), grayscale(50%)
//    - 50%: blur(6px), grayscale(25%)
//    - 100%: blur(0px), grayscale(0%)
// 4. On completion: the circular frame does a small bounce (scale 1 -> 1.08 -> 1)
//    and a tiny sparkle appears at the 12-o'clock position of the ring
// 5. Text transitions: "Uploading your masterpiece..." -> "Looking delicious!"

const uploadProgress = {
  container: {
    // Circular clip-path on the thumbnail
    // Border stroke-dasharray animated based on upload %
  },
  image: {
    filter: `blur(${12 - (progress / 100) * 12}px)`,
    opacity: 0.5 + (progress / 100) * 0.5,
  },
  complete: {
    scale: [1, 1.08, 1],
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};
```

### 3.12 First Listing Published Celebration

This is the strongest celebration in the system (per behavioral-engagement-system.md). It appears full-screen after a seller publishes their first listing.

```typescript
// Full-screen celebration for first listing

// Sequence:
// 1. Screen fills with a warm gradient overlay (Light Turmeric to transparent)
//    Duration: 300ms fade-in

// 2. Confetti burst from bottom-center of screen
//    canvas-confetti config:
//    {
//      particleCount: 80,
//      spread: 100,
//      startVelocity: 35,
//      origin: { x: 0.5, y: 0.9 },
//      colors: ['#E8913A', '#2E7D52', '#D84315', '#FFF3E0', '#FFFFFF'],
//      gravity: 0.8,
//      ticks: 150,
//      shapes: ['circle', 'square'],
//      scalar: 0.9,
//      disableForReducedMotion: true,
//    }

// 3. Headline "You are live!" appears with a typewriter effect
//    Caveat font, 48px, white text with subtle shadow
//    Each character appears with a 30ms delay
//    Total: ~400ms for the full headline

// 4. Body text fades in 200ms after headline completes
//    Inter font, 16px, white/90

// 5. Two CTA buttons slide up from bottom with stagger
//    Button 1 at 600ms, Button 2 at 700ms
//    Spring transition: stiffness 300, damping 25

// 6. After 2 seconds, a second smaller confetti burst (30 particles)
//    from a random horizontal position

// Total on-screen time: user-dismissed (tap a CTA or background)
// Exit: fade-out over 300ms
```

---

## 4. Scroll Animations

### 4.1 Food Card Stagger-In

When food cards enter the viewport on the listing feed, they animate in with a staggered sequence. This is the most frequent scroll animation in the app.

```typescript
// components/listing-grid.tsx

// Container variant -- orchestrates children
const gridContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,        // 80ms between each card
      delayChildren: 0.05,          // 50ms initial delay
    },
  },
};

// Individual card variant
const gridItem = {
  hidden: {
    opacity: 0,
    y: 30,                          // Start 30px below final position
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],    // Quick start, smooth settle
    },
  },
};

// Usage with IntersectionObserver-based trigger:
<motion.div
  variants={gridContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-50px' }}   // Trigger 50px before entering viewport
>
  {listings.map((listing) => (
    <motion.div key={listing.id} variants={gridItem}>
      <ListingCard listing={listing} />
    </motion.div>
  ))}
</motion.div>

// IMPORTANT: viewport.once = true
// Cards animate in only once. Re-scrolling past them does NOT re-trigger.
// This prevents the "disco effect" of cards constantly animating on every scroll.
```

### 4.2 Parallax on Listing Detail

The food photo on the listing detail page scrolls at a different rate than the content below it, creating a subtle depth effect.

```typescript
// app/(main)/listing/[id]/page.tsx

// Implementation: CSS-based parallax for performance (no JS scroll listeners)
// The photo is positioned with transform: translateZ(-1px) scale(2)
// inside a perspective container.

// Alternative (if CSS parallax causes issues): Framer Motion useScroll

const { scrollY } = useScroll();
const photoY = useTransform(scrollY, [0, 300], [0, -80]);
const photoScale = useTransform(scrollY, [0, 300], [1, 1.1]);
const photoOpacity = useTransform(scrollY, [0, 250, 350], [1, 0.8, 0]);

// The effect:
// As user scrolls down on the detail page:
// - Food photo moves up slower than the scroll (parallax ratio 0.7)
// - Photo scales up slightly (1.0 to 1.1) for a "zooming away" feel
// - Photo fades out as content scrolls over it
// - Content has a rounded top edge (border-radius-top: 24px) that
//   slides over the photo, creating a "card pulling up over image" effect

// This rounded overlap is the key visual trick:
const contentContainer = `
  .detail-content {
    position: relative;
    z-index: 10;
    margin-top: -24px;                 /* Overlap the photo */
    border-radius: 24px 24px 0 0;
    background: white;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  }
`;
```

### 4.3 Section Reveals with Spring Physics

Larger content sections (seller profile section, "How It Works" section, etc.) reveal with a spring-based animation.

```typescript
// components/section-reveal.tsx

const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,           // Gentle spring (not bouncy)
      damping: 20,
      mass: 0.5,
      // This gives approximately 500ms to settle with minimal overshoot
      // The spring feel makes it organic without being distracting
    },
  },
};

// Trigger: IntersectionObserver with threshold 0.15 (15% visible)
// once: true (does not re-animate)
<motion.section
  variants={sectionReveal}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
>
  {children}
</motion.section>
```

### 4.4 Infinite Scroll: New Cards Pop-In

When new cards load during infinite scroll, they should not just appear -- they should arrive.

```typescript
// When new listing data loads:
// 1. A skeleton row appears immediately at the bottom (no layout shift)
// 2. When data resolves, skeleton morphs into real cards:
//    - Skeleton's pulse animation stops
//    - Content fades in over 200ms
//    - Cards stagger with the same gridItem animation from 4.1
//    - But with a slightly faster stagger (60ms instead of 80ms)
//      because the user is actively scrolling and expects quick loading
// 3. Load trigger: fire request when last card is 200px from viewport bottom
//    This preloads content before the user reaches the end

const infiniteScrollItem = {
  hidden: {
    opacity: 0,
    y: 20,                     // Less travel than initial load (20px vs 30px)
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,          // Slightly faster than initial load
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
```

### 4.5 Scroll-Linked Seller Profile Header

On the seller profile page, the header transforms as the user scrolls down.

```typescript
// Seller profile scroll behavior:

// SCROLL POSITION 0 (top):
// - Large circular avatar (80px)
// - Full name in Nunito 24px bold
// - "Why I cook" quote in Caveat 16px italic
// - Trust badges displayed in a row
// - Background: Light Turmeric gradient

// SCROLL POSITION 100px+:
// - Header compresses into a sticky bar (56px height)
// - Avatar shrinks to 32px and moves to the left
// - Name moves next to avatar, shrinks to 16px
// - Quote and badges fade out
// - Background transitions to white with bottom shadow

// The transition is continuous (not a snap):
const { scrollY } = useScroll();
const avatarSize = useTransform(scrollY, [0, 100], [80, 32]);
const headerHeight = useTransform(scrollY, [0, 100], [200, 56]);
const quoteFade = useTransform(scrollY, [0, 60], [1, 0]);
const bgColor = useTransform(scrollY, [0, 100], ['#FFF3E0', '#FFFFFF']);

// The continuous transform (not a snap at a threshold) feels natural,
// like the header is physically being compressed by the content pushing up.
```

---

## 5. Dark Mode Strategy

### 5.1 Palette Adaptation

GharKa's warm palette must retain its warmth in dark mode. This is not a simple inversion -- cold dark backgrounds with warm accents would feel dissonant. Instead, use deep, warm darks.

```
DARK MODE COLOR MAP:

| Light Mode               | Dark Mode                | Variable Name         |
|--------------------------|--------------------------|----------------------|
| #FFFFFF (White bg)       | #1A1412 (Warm charcoal)  | --bg-primary         |
| #F5F7F8 (Cloud bg)       | #231E1A (Warm dark)      | --bg-secondary       |
| #FFF3E0 (Light Turmeric) | #2D2218 (Dark amber)     | --bg-accent          |
| #E8913A (Turmeric)       | #E8913A (unchanged)      | --color-primary      |
| #2E7D52 (Coriander)      | #3A9D6A (lightened 15%)  | --color-secondary    |
| #D84315 (Terracotta)     | #E65100 (lightened 10%)  | --color-accent       |
| #263238 (Charcoal text)  | #EDE7E0 (Warm white)     | --text-primary       |
| #546E7A (Slate text)     | #B0A89E (Warm gray)      | --text-secondary     |
| #E0E7EA (Mist border)    | #3D3530 (Warm border)    | --border             |

KEY PRINCIPLE: Background colors are warm-shifted (brown-black, not blue-black).
The Turmeric primary color does NOT change in dark mode -- it is the anchor.
```

```css
/* tailwind.config.ts dark mode colors */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1A1412;
    --bg-secondary: #231E1A;
    --bg-accent: #2D2218;
    --text-primary: #EDE7E0;
    --text-secondary: #B0A89E;
    --border: #3D3530;

    /* Card surfaces: slightly lighter than background for elevation */
    --bg-card: #261F1B;
    --bg-card-hover: #302822;
  }
}
```

### 5.2 Three.js Scene in Dark Mode

The 3D hero scene adapts to dark mode by shifting the lighting temperature.

```
DARK MODE SCENE CHANGES:

Background gradient: #1A1412 to #2D2218 (warm dark gradient)
Key light intensity: 0.8 (reduced from 1.2 -- more intimate, dimmer)
Key light color: #FFD699 (warmer, more golden -- like candlelight)
Ambient light intensity: 0.2 (reduced -- more dramatic shadows)
Ambient light color: #332211 (very warm, low)
Rim light: #E8913A at intensity 0.5 (increased -- Turmeric glow becomes more prominent)
Fog: enabled, warm tinted (#1A1412), near=3 far=15 (creates intimate close space)

The overall feeling shifts from "sunlit kitchen" to "evening kitchen with warm lamp."
Steam particles become slightly more visible against the dark background.
Dust motes gain a golden tint (they catch the rim light).
```

### 5.3 Card and Surface Treatment

```css
/* Dark mode card styling */
.card-dark {
  background: var(--bg-card);
  border: 1px solid var(--border);
  /* Subtle inner glow replaces the shadow */
  box-shadow:
    inset 0 1px 0 rgba(255, 243, 224, 0.03),   /* Top edge highlight */
    0 2px 8px rgba(0, 0, 0, 0.3);                /* Deeper shadow */
}

.card-dark:hover {
  background: var(--bg-card-hover);
  box-shadow:
    inset 0 1px 0 rgba(255, 243, 224, 0.05),
    0 8px 25px rgba(0, 0, 0, 0.4);
}

/* Food photos get a subtle warm vignette in dark mode */
/* This makes them sit better against the dark background */
.food-photo-dark::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 40px rgba(26, 20, 18, 0.3);
  pointer-events: none;
}
```

---

## 6. Sound Design Concepts

### 6.1 Philosophy

Sound in GharKa is entirely optional, off by default, and toggled via a single setting: "Enable UI sounds." When enabled, sounds are extremely subtle -- more felt than heard. Think of the quiet sounds in a kitchen: a gentle tap of a spoon, a soft click of a lid.

### 6.2 Sound Inventory

| Interaction | Sound Concept | Duration | Volume |
|-------------|--------------|----------|--------|
| Tap/press a button | Soft, warm "tok" -- like tapping a wooden spoon on a counter | 80ms | 15% |
| Send message | Quick, ascending two-note tone -- like a small bell | 120ms | 20% |
| Receive message | Gentle, descending two-note tone (inverse of send) | 120ms | 25% |
| Order confirmed | Warm, resonant "ding" -- like a brass bowl being tapped | 300ms | 30% |
| Order completed | Three ascending notes -- a small celebratory chord | 500ms | 30% |
| Heart/save | Soft "pop" -- like a bubble | 60ms | 15% |
| Pull-to-refresh | Gentle simmer/bubble sound (looping while pulling) | Variable | 10% |
| Error | Low, soft "dum" -- not alarming, just a gentle bump | 100ms | 20% |
| Achievement/badge unlock | Bright, sparkling three-note arpeggio | 600ms | 35% |

### 6.3 Technical Implementation

```typescript
// Use the Web Audio API (not <audio> elements) for low-latency playback
// Pre-load all sounds as AudioBuffers on app initialization
// Total audio asset budget: < 100KB (use short, compressed .webm or .mp3 files)
// Fall back to silence if Web Audio API is unavailable

// Sound manager:
class GharKaSoundManager {
  private context: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = false;

  async init() {
    if (!('AudioContext' in window)) return;
    this.context = new AudioContext();
    // Pre-load all sound files
    const sounds = ['tap', 'send', 'receive', 'confirm', 'complete', 'heart', 'error', 'badge'];
    await Promise.all(sounds.map(s => this.loadSound(s)));
  }

  play(soundName: string) {
    if (!this.enabled || !this.context) return;
    const buffer = this.buffers.get(soundName);
    if (!buffer) return;
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = buffer;
    gain.gain.value = VOLUME_MAP[soundName];
    source.connect(gain).connect(this.context.destination);
    source.start();
  }
}
```

---

## 7. CSS Magic

### 7.1 Glassmorphism for Overlays and Cards

Used sparingly on bottom sheets, the navigation bar, and the hero text overlay.

```css
/* Glass card -- used for overlays on top of the 3D hero and food images */
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06);
}

/* Dark mode glass */
.dark .glass-card {
  background: rgba(26, 20, 18, 0.7);
  border: 1px solid rgba(255, 243, 224, 0.08);
}

/* Glass navigation bar -- sticky at bottom */
.glass-navbar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* Fallback for browsers without backdrop-filter support */
@supports not (backdrop-filter: blur(1px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.95);
  }
  .glass-navbar {
    background: rgba(255, 255, 255, 0.97);
  }
}
```

### 7.2 Gradient Mesh Backgrounds

Used on the onboarding slides and the landing page sections below the hero.

```css
/* Warm gradient mesh -- simulates the look of overlapping warm light sources */
.mesh-bg-warm {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(232, 145, 58, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(46, 125, 82, 0.08) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 80%, rgba(216, 67, 21, 0.06) 0%, transparent 45%),
    linear-gradient(180deg, #FFF3E0 0%, #FFFFFF 100%);
}

/* Animated gradient mesh for the onboarding background */
.mesh-bg-animated {
  background:
    radial-gradient(ellipse at var(--mesh-x1, 20%) var(--mesh-y1, 50%),
      rgba(232, 145, 58, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at var(--mesh-x2, 80%) var(--mesh-y2, 20%),
      rgba(46, 125, 82, 0.10) 0%, transparent 45%),
    #FFF3E0;
  animation: mesh-drift 20s ease-in-out infinite;
}

@keyframes mesh-drift {
  0%, 100% {
    --mesh-x1: 20%; --mesh-y1: 50%;
    --mesh-x2: 80%; --mesh-y2: 20%;
  }
  33% {
    --mesh-x1: 40%; --mesh-y1: 30%;
    --mesh-x2: 60%; --mesh-y2: 60%;
  }
  66% {
    --mesh-x1: 25%; --mesh-y1: 70%;
    --mesh-x2: 75%; --mesh-y2: 35%;
  }
}
/* NOTE: CSS custom property animation requires @property registration or
   use Framer Motion to animate the gradient positions via inline style. */
```

### 7.3 Custom Cursor (Desktop Only)

On desktop, the default cursor is replaced with a warm-themed custom cursor when hovering over interactive food elements.

```css
/* Default cursor: standard arrow (do not replace globally -- that annoys people) */

/* Food card hover: custom cursor -- a small spoon/fork icon */
.food-card:hover {
  cursor: url('/cursors/spoon-cursor.svg') 4 4, pointer;
}

/* CTA buttons: a warm hand-pointer */
.btn-primary:hover {
  cursor: url('/cursors/hand-warm.svg') 8 0, pointer;
}

/* Drag areas (reordering listings): a grab hand */
.drag-handle {
  cursor: grab;
}
.drag-handle:active {
  cursor: grabbing;
}

/* SVG cursor specs:
   - Size: 24x24 or 32x32 pixels
   - Style: matches the brand's icon style (1.5px stroke, rounded, outlined)
   - Color: Turmeric outline on transparent background
   - Hotspot: top-left of the spoon bowl, or fingertip of the hand
*/
```

### 7.4 Smooth Scrollbar Styling

Custom scrollbar that matches the warm palette. Applied on desktop where scrollbars are visible.

```css
/* WebKit scrollbar (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(232, 145, 58, 0.25);    /* Turmeric at 25% */
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(232, 145, 58, 0.45);
}

::-webkit-scrollbar-thumb:active {
  background: rgba(232, 145, 58, 0.65);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(232, 145, 58, 0.25) transparent;
}

/* Dark mode */
.dark ::-webkit-scrollbar-thumb {
  background: rgba(232, 145, 58, 0.2);
}
```

### 7.5 Hero Text Gradient

The main landing page heading uses a gradient text effect.

```css
/* Gradient text for the hero heading */
.text-gradient-warm {
  background: linear-gradient(
    135deg,
    #E8913A 0%,           /* Turmeric */
    #D84315 50%,           /* Terracotta */
    #E8913A 100%           /* Back to Turmeric */
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient-shift 6s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* For the "one tap away" subheading -- subtler gradient */
.text-gradient-subtle {
  background: linear-gradient(90deg, #546E7A 0%, #2E7D52 50%, #546E7A 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 7.6 Wavy Section Dividers

Instead of straight horizontal lines between sections, use organic wave shapes.

```css
/* SVG wave divider between sections */
.wave-divider {
  width: 100%;
  height: 40px;
  overflow: hidden;
}

.wave-divider svg {
  width: 100%;
  height: 100%;
}

/* Generated inline SVG path for organic wave:
   <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
     <path
       d="M0,20 C200,35 400,5 600,20 C800,35 1000,5 1200,20 L1200,40 L0,40 Z"
       fill="currentColor"
     />
   </svg>

   The key: the wave is slightly asymmetric. Perfect sine waves look mechanical.
   Shift the control points by 5-10% from perfect symmetry.
*/

/* Alternate: blob-shaped divider for more organic sections */
.blob-divider {
  clip-path: ellipse(60% 100% at 50% 100%);
  margin-top: -20px;
}
```

### 7.7 Paper/Grain Texture Overlay

A barely-visible grain texture gives surfaces a handmade quality. Per BRAND_GUIDE.md, illustrations use "paper-grain overlay at 5% opacity."

```css
/* Noise texture overlay -- applied to specific backgrounds, not globally */
.texture-grain {
  position: relative;
}

.texture-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.04;                           /* Very subtle -- felt, not seen */
  pointer-events: none;
  z-index: 1;
  background-image: url('/textures/grain-256.png');
  background-repeat: repeat;
  background-size: 256px 256px;
  mix-blend-mode: multiply;
}

/* Dark mode: use overlay blend mode instead */
.dark .texture-grain::after {
  mix-blend-mode: overlay;
  opacity: 0.06;
}

/* Alternative: CSS-generated noise (no image dependency) */
/* Uses a tiny SVG filter for procedural noise */
.texture-grain-css::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.05;
  pointer-events: none;
  filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E#n");
}
```

---

## 8. What Makes This Unlike AI-Built Apps

### 8.1 The Problem with AI-Built UIs

Every AI-generated UI in 2026 has the same DNA: perfectly centered grids, uniform card sizes, predictable spacing, system font stacks or safely generic Google Fonts, and animations that are either absent or gratuitously bouncy. They are technically correct and emotionally dead. They feel like they were designed by someone who has read about food but never tasted it.

GharKa must feel like it was designed by someone who cooks.

### 8.2 Asymmetric Layouts

**Rule**: Not every section needs to be a centered, equal-width grid.

```
LISTING FEED:
Instead of a uniform 2-column grid, use a staggered masonry-like layout
where cards have varying heights based on content:

+-------------------+  +-----------+
|                   |  |           |
|  Featured Card    |  | Standard  |
|  (larger photo,   |  |   Card    |
|   more height)    |  |           |
|                   |  +-----------+
+-------------------+  +-----------+
+-----------+  +-------------------+
|           |  |                   |
| Standard  |  |  Standard Card    |
|   Card    |  |  (with review     |
|           |  |   quote)          |
+-----------+  +-------------------+

Implementation: CSS Grid with grid-auto-rows: minmax(200px, auto)
and occasional span-2 cards for featured/promoted listings.
The irregularity feels human -- like a real kitchen counter with
plates of different sizes.
```

**Seller profile**: The profile header is not centered. The avatar sits to the left with text flowing around it, like a newspaper feature. The "Why I cook" quote (Caveat font) is positioned as a pull-quote in the margin.

**Onboarding slides**: Each slide has a different layout. Slide 1 has the illustration on top, text below. Slide 2 has the illustration on the left, text right. Slide 3 has the illustration as a background with text overlaid. This prevents the "slideshow of identical frames" feel.

### 8.3 Organic Shapes

```css
/* Blob border for the cook's avatar on their profile */
.avatar-blob {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  /* Each visit, slightly different blob via CSS custom properties set by JS */
  /* This makes each cook's profile feel unique */
  transition: border-radius 0.6s ease;
}
.avatar-blob:hover {
  border-radius: 40% 60% 70% 30% / 30% 60% 40% 70%;
}

/* Organic container for the "How It Works" section */
.organic-container {
  border-radius: 30% 70% 53% 47% / 26% 46% 54% 74%;
  background: #FFF3E0;
  padding: 2rem;
}

/* Wavy underline for the Caveat-font "Why I cook" quote */
.wavy-underline {
  text-decoration: underline;
  text-decoration-style: wavy;
  text-decoration-color: rgba(232, 145, 58, 0.4);
  text-underline-offset: 4px;
  text-decoration-thickness: 1.5px;
}
```

### 8.4 Texture Overlays

Beyond the grain texture in 7.7, specific surfaces get additional texture treatment:

```
- Food cards: a very faint warm gradient overlay (2% opacity) that makes
  all food photos feel cohesive (per BRAND_GUIDE.md: "+2% warmth in post-processing")

- Empty state illustrations: paper-grain texture at 5% opacity (per BRAND_GUIDE.md)

- Onboarding slide backgrounds: soft cloth/linen texture at 3% opacity

- The hero section: subtle atmospheric haze via the Three.js fog

- Chat bubbles: for the sender's messages (Turmeric background), a barely
  perceptible noise texture that makes the flat color feel less digitally flat
```

### 8.5 Custom Illustration Style Integration

Illustrations in GharKa are not clip art dropped into boxes. They interact with the UI.

```
SPECIFIC INTEGRATION POINTS:

1. Empty state illustrations break their container:
   The pot in the "No listings" empty state extends 20px above the container's
   top edge, with steam wisps extending further. The illustration is not
   confined to a box -- it breathes into the surrounding space.

2. Onboarding illustrations have parallax:
   On the intro slides, the illustration is composed of 2-3 layers:
   - Background layer (buildings, scenery): scrolls at 0.8x rate
   - Midground layer (characters): scrolls at 1.0x rate
   - Foreground layer (food items, details): scrolls at 1.2x rate
   This creates depth even in flat illustrations.

3. Profile illustrations are personalized:
   The seller profile page has a small illustrated kitchen scene in the header.
   The scene subtly varies based on the seller's activity:
   - New cook: empty counter, ready to start
   - Active cook (5+ listings): bustling kitchen, multiple pots
   - Trusted cook (badge): warm glow, community elements

4. Loading illustrations animate:
   The steaming pot loader is not a static SVG loop. The steam wisps are
   procedurally generated (slightly different each time), making each
   loading moment feel unique.
```

### 8.6 Easter Eggs & Seasonal Touches

**Easter eggs** (always accessible, never required to find):

```
1. KONAMI CODE (desktop):
   Up, Up, Down, Down, Left, Right, Left, Right, B, A
   Effect: The entire page temporarily transforms into a "masala mode" --
   all brand colors shift to a spicier palette (deeper reds, more saturated
   yellows) for 10 seconds. A small toast appears: "Spice level: maximum!"

2. FIVE-TAP LOGO:
   Tapping the GharKa logo on the profile page 5 times in rapid succession
   triggers a small animation: the logo transforms into a steaming pot,
   then back. A toast: "You found the secret kitchen!"

3. SCROLL TO THE VERY BOTTOM:
   If a user scrolls to the absolute bottom of any infinite-scrollable feed
   (past all content), instead of a generic "You have reached the end,"
   they see a small illustration of a satisfied person patting their full
   stomach with the text: "You have seen everything. Time for a chai break."

4. FIRST ORDER ANNIVERSARY:
   On the anniversary of a user's first completed order, their profile
   briefly shows a small cake icon with "1 year of ghar ka khana!"
```

**Seasonal touches** (per BRAND_GUIDE.md guidelines):

```
FESTIVAL ADAPTATIONS (subtle, tasteful, never garish):

- DIWALI (October/November):
  - Hero scene: add 2-3 small diya (oil lamp) models on the table, with
    flickering point lights (warm orange)
  - Navigation bar: a single small rangoli pattern as a subtle texture
  - Toast for returning users: "Diwali ki shubhkaamnayein! See festive
    dishes from your neighbors."

- HOLI (March):
  - Hero scene: subtle color powder particles mixed with the dust motes
    (very faint pastels: pink, yellow, green)
  - Food cards: a barely-perceptible color splash watermark behind the
    card (different color per card, 3% opacity)

- EID (variable):
  - Hero scene: a crescent moon and star as a small decorative element
    on the table (like a table decoration, not floating in space)
  - Profile section: "Eid Mubarak" in Caveat font as a temporary badge

- CHRISTMAS (December):
  - Hero scene: a single small star ornament hanging from the top of frame
  - Toast: "Merry Christmas! Discover holiday treats from your neighbors."

- PONGAL / MAKAR SANKRANTI (January):
  - Hero scene: a small pot of pongal (sweet rice) added to the table items
  - Navigation: subtle sugarcane motif on the header edge

IMPLEMENTATION:
- Festival detection: based on date ranges stored in a config file
- All festival elements are additive (they do not replace existing elements)
- A single config flag disables all seasonal elements for testing
- All seasonal 3D assets share the same polygon/texture budgets
- Seasonal sounds: none (do not add festival music or sounds)
```

### 8.7 Typography That Breathes

AI apps set type in rigid containers. GharKa lets type breathe.

```css
/* The "Why I cook" quote on seller profiles */
.cook-quote {
  font-family: var(--font-handwritten);  /* Caveat */
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 280px;
  /* Rotate very slightly -- like a handwritten note pinned to a board */
  transform: rotate(-0.5deg);
  /* Subtle letter-spacing variation */
  letter-spacing: 0.01em;
}

/* Section headings with personality */
.section-heading {
  font-family: var(--font-heading);  /* Nunito */
  font-weight: 800;
  /* Slight negative letter-spacing for tighter, warmer headings */
  letter-spacing: -0.02em;
  /* Color: NOT black. Use Charcoal for warmth */
  color: var(--text-primary);
}

/* Price display -- the number should feel confident and clear */
.price {
  font-family: var(--font-heading);
  font-weight: 700;
  font-variant-numeric: tabular-nums;  /* Aligned digits for clean grids */
  /* Turmeric colored for primary listings */
  color: #E8913A;
}

/* Listing description -- slightly more generous line height than body text */
.listing-description {
  font-family: var(--font-body);
  line-height: 1.75;  /* More air than standard 1.5 */
  color: var(--text-secondary);
  /* Hyphenation for narrow mobile columns */
  hyphens: auto;
  -webkit-hyphens: auto;
}
```

---

## 9. Reduced Motion Strategy

### 9.1 Detection

```typescript
// hooks/use-reduced-motion.ts

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
```

### 9.2 What Changes with Reduced Motion

| Feature | Normal | Reduced Motion |
|---------|--------|---------------|
| Three.js hero | Full 3D scene with animation | Static hero image (hero-fallback.tsx) |
| Page transitions | Slide + scale + blur | Instant cut (no animation) |
| Shared element transitions | Layout animation | Instant cut |
| Food card hover | Lift + shadow + tilt | Subtle color change only (no transform) |
| Heart animation | Burst particles + scale | Instant fill, no particles |
| Request button success | Morph + confetti | Color change + checkmark (no motion) |
| Pull-to-refresh | Animated pot + steam | Static refresh icon + text |
| Scroll animations | Stagger-in cards | Cards appear instantly (no stagger) |
| Tab icon animations | Bounce/flip/shake | No animation, instant state change |
| Toast notifications | Slide in with spring | Instant appear, instant disappear |
| Empty state idle | Floating/swaying animation | Static illustration |
| Loading pot | Steam animation | Static pot icon + "Loading..." text |
| Confetti (celebrations) | canvas-confetti burst | No confetti, text celebration only |
| Gradient mesh animation | Drifting radial gradients | Static gradient |

### 9.3 CSS Implementation

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Selective override: some transitions are too important to remove entirely.
   Color changes (hover states, active states) should still happen, just instantly. */
@media (prefers-reduced-motion: reduce) {
  .btn-primary {
    transition: background-color 0.01ms, color 0.01ms;
    /* No transform, no shadow transition */
  }
}
```

### 9.4 Framer Motion Global Config

```typescript
// app/providers.tsx

import { MotionConfig } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function Providers({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>
      {children}
    </MotionConfig>
  );
}
```

---

## 10. Performance Budgets

### 10.1 Animation Frame Budgets

| Animation Category | Target Frame Time | Max Concurrent |
|-------------------|-------------------|----------------|
| Three.js rendering | 16ms (60fps) | 1 Canvas only |
| Page transitions | 16ms (60fps) | 1 at a time |
| Micro-interactions | 16ms (60fps) | Up to 3 simultaneous |
| Scroll animations | 16ms (60fps) | Up to 8 simultaneous (staggered cards) |
| CSS animations | Compositor-only (transform + opacity) | Unlimited |
| Canvas confetti | 16ms (60fps) | 1 instance, auto-cleans after 3s |

### 10.2 Bundle Size Budget

| Package | Gzipped Size | Loading Strategy |
|---------|-------------|-----------------|
| three | ~65KB | Dynamic import, hero page only |
| @react-three/fiber | ~25KB | Dynamic import, hero page only |
| @react-three/drei (subset) | ~15KB | Tree-shake, import only used helpers |
| framer-motion | ~35KB | Main bundle (used on every page) |
| canvas-confetti | ~5KB | Dynamic import, celebration events only |
| 3D model assets | < 500KB | Preload after initial page render |
| Sound files | < 100KB | Lazy load on first interaction |
| Grain texture | ~8KB | Lazy load |
| **Total animation budget** | **~250KB JS + ~600KB assets** | |

### 10.3 Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | < 2.0s | Hero text renders as HTML first; 3D is progressive enhancement |
| FID (First Input Delay) | < 50ms | No heavy JS on main thread during initial load |
| CLS (Cumulative Layout Shift) | < 0.05 | Fixed-size containers for 3D Canvas; skeleton screens match final layout |
| INP (Interaction to Next Paint) | < 100ms | All micro-interactions use compositor-friendly transforms |

---

## 11. Implementation Priority

### Phase 1: Foundation (Week 1-2)
Animations that affect core navigation and daily use.

| Item | Priority | Complexity | Dependencies |
|------|----------|-----------|--------------|
| Page transition system (forward/backward/tab) | Critical | Medium | Framer Motion setup |
| Food card hover/tap micro-interaction | Critical | Low | None |
| Loading pot SVG animation | Critical | Low | SVG asset |
| Toast notification system | Critical | Low | Framer Motion |
| Skeleton loading screens | Critical | Low | Tailwind |
| Reduced motion provider | Critical | Low | None |

### Phase 2: Delight Layer (Week 3-4)
Animations that elevate the experience from functional to memorable.

| Item | Priority | Complexity | Dependencies |
|------|----------|-----------|--------------|
| Shared element transition (card to detail) | High | Medium | Phase 1 transitions |
| Heart/save burst animation | High | Medium | None |
| Request button success sequence | High | Medium | API integration |
| Scroll stagger-in for listing cards | High | Low | Framer Motion |
| Chat message send animation | High | Low | Chat UI |
| Tab icon animations | Medium | Low | Icon components |
| Pull-to-refresh pot animation | Medium | Medium | SVG/Lottie asset |

### Phase 3: Showpiece (Week 5-6)
The Three.js hero and premium CSS treatments.

| Item | Priority | Complexity | Dependencies |
|------|----------|-----------|--------------|
| Three.js hero scene (models + lighting) | High | High | 3D assets from designer |
| Scroll-driven camera animation | High | Medium | Hero scene |
| Mouse parallax (desktop) | Medium | Low | Hero scene |
| Steam particle system | Medium | Medium | Hero scene |
| Hero fallback (static) | Critical | Low | Hero image render |
| Glassmorphism CSS | Medium | Low | None |
| Gradient mesh backgrounds | Medium | Low | None |
| Wavy dividers | Low | Low | SVG path |
| Custom scrollbar | Low | Low | None |
| Custom cursors (desktop) | Low | Low | SVG assets |
| Paper/grain texture | Low | Low | Texture asset |

### Phase 4: Polish (Week 7-8)
Final touches that separate good from exceptional.

| Item | Priority | Complexity | Dependencies |
|------|----------|-----------|--------------|
| Order status celebrations (confetti) | Medium | Low | Order flow |
| First listing celebration screen | Medium | Medium | Seller flow |
| Empty state idle animations | Medium | Low | Empty state illustrations |
| Parallax on listing detail | Medium | Low | Detail page |
| Seller profile scroll header | Medium | Medium | Profile page |
| Dark mode theme + 3D adaptation | Medium | Medium | All visual components |
| Sound design (optional toggle) | Low | Medium | Audio assets |
| Asymmetric layout refinements | Medium | Low | Content components |
| Blob borders + organic shapes | Low | Low | None |
| Seasonal festival config | Low | Medium | Phase 3 hero scene |
| Easter eggs | Low | Low | All |
| Upload progress animation | Low | Medium | Upload feature |
| Image upload de-blur effect | Low | Medium | Upload feature |

---

## Appendix A: Easing Curve Reference

All easing curves used in GharKa, named and documented for consistency.

```typescript
// lib/animation-config.ts

export const EASING = {
  // Primary easing -- used for most enter animations
  // Fast start, smooth deceleration, feels confident
  smoothOut: [0.22, 1, 0.36, 1],

  // Exit easing -- used for leave/dismiss animations
  // Gentle start, quick finish
  smoothIn: [0.32, 0, 0.67, 0],

  // Overshoot easing -- used for elements that "arrive" with personality
  // Slightly overshoots target, then settles (like setting a plate on a table)
  bounce: [0.34, 1.56, 0.64, 1],

  // Symmetric easing -- used for looping animations (idle floats, pulses)
  gentle: [0.45, 0, 0.55, 1],

  // Linear -- used only for progress bars and continuous motion
  linear: [0, 0, 1, 1],
} as const;

export const SPRING = {
  // Snappy spring -- buttons, tab switches, quick interactions
  snappy: { type: 'spring' as const, stiffness: 500, damping: 30, mass: 0.5 },

  // Confident spring -- page elements, cards arriving
  confident: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8 },

  // Gentle spring -- section reveals, large elements
  gentle: { type: 'spring' as const, stiffness: 100, damping: 20, mass: 0.5 },

  // Bouncy spring -- celebrations, achievement unlocks (use sparingly)
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 15, mass: 0.5 },

  // Sheet spring -- bottom sheets, modals
  sheet: { type: 'spring' as const, stiffness: 400, damping: 35, mass: 0.8 },
} as const;

export const DURATION = {
  instant: 0.1,       // Tap feedback, color changes
  fast: 0.2,          // Toast exit, tab switch
  normal: 0.35,       // Page transitions, card animations
  slow: 0.5,          // Celebrations, complex morphs
  leisurely: 1.0,     // Full-screen celebrations, 3D transitions
} as const;

export const STAGGER = {
  tight: 0.04,        // Rapid stagger (infinite scroll items)
  normal: 0.08,       // Standard stagger (grid items on initial load)
  relaxed: 0.12,      // Slow stagger (onboarding steps, important reveals)
} as const;
```

---

## Appendix B: Animation Accessibility Checklist

For every animation added to GharKa, verify the following before shipping:

```
[ ] Animation has a functional purpose (feedback, orientation, delight, or wait-time reduction)
[ ] Animation respects prefers-reduced-motion (tested with both ON and OFF)
[ ] Animation does not block user interaction (user can act before animation completes)
[ ] Animation does not cause layout shift (CLS impact = 0)
[ ] Animated elements have appropriate ARIA labels if they convey meaning
[ ] Animation loop duration is reasonable (no infinite fast animations that cause nausea)
[ ] Animation is tested on low-end devices (Snapdragon 4-series equivalent)
[ ] Animation is tested with screen readers (does not create confusing live region updates)
[ ] Flashing: no element flashes more than 3 times per second (WCAG 2.3.1)
[ ] Color: animation does not rely solely on color change to convey information
[ ] Focus management: animated elements do not steal focus unexpectedly
```

---

## Appendix C: File & Asset Naming Convention

```
3D Models:     public/models/{item-name}.glb          (e.g., matka-pot.glb)
Textures:      public/textures/{name}-{size}.{ext}    (e.g., grain-256.png)
SVG Loaders:   public/icons/loaders/{name}.svg         (e.g., steaming-pot.svg)
Lottie:        public/animations/{name}.json           (e.g., heart-burst.json)
Cursors:       public/cursors/{name}.svg               (e.g., spoon-cursor.svg)
Sounds:        public/sounds/{action}.webm             (e.g., tap.webm)
Illustrations: public/illustrations/{screen}-{state}.svg (e.g., feed-empty.svg)
Seasonal:      public/seasonal/{festival}/{asset}.glb   (e.g., diwali/diya-lamp.glb)
```

---

## Appendix D: Quick Reference -- Exact Values

For copy-paste implementation without hunting through the document.

```
BRAND COLORS:
  Turmeric:        #E8913A    rgb(232, 145, 58)
  Deep Turmeric:   #C47425    rgb(196, 116, 37)
  Light Turmeric:  #FFF3E0    rgb(255, 243, 224)
  Coriander:       #2E7D52    rgb(46, 125, 82)
  Deep Coriander:  #1B5E3A    rgb(27, 94, 58)
  Mint Wash:       #E8F5E9    rgb(232, 245, 233)
  Terracotta:      #D84315    rgb(216, 67, 21)
  Charcoal:        #263238    rgb(38, 50, 56)
  Slate:           #546E7A    rgb(84, 110, 122)
  Mist:            #E0E7EA    rgb(224, 231, 234)
  Cloud:           #F5F7F8    rgb(245, 247, 248)

DARK MODE BACKGROUNDS:
  Primary:         #1A1412
  Secondary:       #231E1A
  Accent:          #2D2218
  Card:            #261F1B
  Card Hover:      #302822

FONTS:
  Headings:        'Nunito', 'Segoe UI', sans-serif
  Body:            'Inter', 'Segoe UI', sans-serif
  Handwritten:     'Caveat', cursive

KEY ANIMATION VALUES:
  Card press:      scale(0.97), 150ms
  Heart burst:     6 particles, 350ms, Terracotta fill
  Page forward:    350ms, ease [0.22, 1, 0.36, 1]
  Page backward:   280ms, ease [0.22, 1, 0.36, 1]
  Tab switch:      200ms fade + 8px vertical shift
  Toast enter:     spring(400, 25, 0.8)
  Toast dismiss:   200ms, auto at 3s (error: 5s)
  Scroll stagger:  80ms between cards, ease [0.22, 1, 0.36, 1]
  Loading pot:     1.5s steam cycle, 3 wisps, stagger 0.3s
  Confetti:        30 particles (status), 80 particles (celebration)
  3D hero FOV:     45 degrees
  3D asset budget: < 500KB total, < 5000 tris total
```

---

*This document is the single source of truth for all animation, delight, and visual personality decisions in GharKa. Every implementation should reference this document. If a decision contradicts the BRAND_GUIDE.md or MASTER_ARCHITECTURE.md, those documents take precedence -- update this document to resolve the conflict.*
