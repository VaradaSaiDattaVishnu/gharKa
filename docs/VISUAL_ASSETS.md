# GharKa -- Visual Asset Guide

**Version**: 1.0
**Date**: May 2026
**Status**: Production Specification
**Scope**: Complete visual asset inventory, generation prompts, sourcing specifications, and style direction for every graphic element in the GharKa app.
**Dependencies**: [BRAND_GUIDE.md](./BRAND_GUIDE.md) (color, typography, voice), [MASTER_ARCHITECTURE.md](./MASTER_ARCHITECTURE.md) (Three.js specs, file structure), [behavioral-engagement-system.md](./behavioral-engagement-system.md) (onboarding copy, empty state copy)

---

## Table of Contents

1. [App Icon Concepts](#1-app-icon-concepts)
2. [Onboarding Illustration Concepts](#2-onboarding-illustration-concepts)
3. [Empty State Illustrations](#3-empty-state-illustrations)
4. [3D Model Specifications for Three.js Hero](#4-3d-model-specifications-for-threejs-hero)
5. [Default Avatar Set](#5-default-avatar-set)
6. [Food Category Icons](#6-food-category-icons)
7. [Background Textures and Patterns](#7-background-textures-and-patterns)
8. [Photography Style Guide](#8-photography-style-guide)

---

## 1. App Icon Concepts

The GharKa app icon must communicate three things at a glance: home, food, and warmth. It must be instantly recognizable at 16x16px on a notification badge and still feel detailed at 1024x1024px on the App Store. It must work on both iOS (rounded superellipse mask) and Android (adaptive icon with separate foreground and background layers).

### Technical Requirements

| Specification | Value |
|---|---|
| Master canvas | 1024 x 1024 px |
| Safe zone (icon content) | Central 640 x 640 px (accounts for all OS masks) |
| Export formats | SVG (source), PNG (1024, 512, 192, 144, 96, 72, 48), ICO (web) |
| Android adaptive icon | Foreground layer (108dp, transparent BG) + Background layer (108dp, solid fill) |
| iOS mask compatibility | No content in outer 20% of canvas (iOS superellipse clips corners) |
| Color mode | sRGB, 8-bit |
| No text in icon | The word "GharKa" must not appear inside the icon. Lettering does not survive at small sizes. |

### Concept A: "The Warm Pot"

**Description**: A rounded, slightly stylized cooking pot (handi or degchi shape -- the wide-bellied pot common in Indian kitchens) viewed from a three-quarter top angle. Three soft wisps of steam rise from the open top, curving gently to the right. The pot sits on nothing -- it floats, giving it a modern, app-icon feel rather than a realistic kitchen illustration.

**Shape language**: The pot body is a single continuous curve -- no hard edges. The rim is a slightly thicker stroke that gives it substance. The handles are small, rounded loops on either side, hinting at the brass handles on traditional Indian cookware. The steam wisps are organic curves with tapered ends, not rigid sine waves.

**Color treatment**: The pot body is Turmeric (#E8913A) with a subtle gradient -- slightly darker (#C47425, Deep Turmeric) at the base, full Turmeric at the rim. The steam wisps are white (#FFFFFF) at 80% opacity, creating a soft, ethereal quality against any background. The pot interior visible through the open top is a warm shadow using Charcoal (#263238) at 40% opacity -- you sense depth but cannot see specific contents.

**Background**: A rounded square fill of Coriander (#2E7D52). This creates a warm-cool contrast that is appetizing and distinctive. The green anchors the warm orange and prevents the icon from looking like a generic food app.

**Recognizability at small sizes**: The pot silhouette is distinct even at 16px. The steam wisps simplify to two strokes below 48px. The green-orange contrast remains visible even as a tiny notification badge.

**Dark/light background behavior**: On dark backgrounds, the Coriander green background provides sufficient contrast. On light backgrounds, the same. The icon never needs an outline or shadow to separate from its surroundings.

**Why this works**: The handi is unmistakably Indian without being exclusionary. Steam implies freshness and warmth ("something is cooking right now"). The shape is simple enough to survive extreme reduction.

### Concept B: "The Home Plate"

**Description**: A circular dinner plate viewed directly from above, tilted at a very slight 5-degree angle to give it dimensionality. A stylized house silhouette sits at the center of the plate -- small, simple, with a triangular roof and a rectangular body. The house is not detailed; it is an iconic shape. A single curved line below the house suggests a gentle smile, making the plate-and-house combination feel like a friendly face. Around the plate rim, four small dots are evenly spaced, evoking both the decorative rim of traditional Indian steel plates (thali) and the four cardinal directions (suggesting "from all around your neighborhood").

**Shape language**: The plate is a perfect circle with a subtle inner ring (the thali rim). The house is geometric but with rounded corners to match the brand's softness. The smile curve below the house is a single bezier stroke, not a full semicircle -- it should feel gentle, not cartoonish.

**Color treatment**: The plate rim and inner ring are Light Turmeric (#FFF3E0) with a subtle warm shadow on the lower half. The house silhouette is Turmeric (#E8913A), solid fill. The smile curve is Turmeric at 70% opacity. The four rim dots are Terracotta (#D84315). The plate interior (between rim and house) is white (#FFFFFF).

**Background**: Charcoal (#263238). The dark background makes the warm plate glow and creates excellent contrast on both light and dark device themes. Android adaptive icon: the foreground layer is the plate; the background layer is Charcoal.

**Recognizability at small sizes**: The circle-with-center-mark reads clearly at any size. The house detail is visible down to about 32px; below that, it reads as a warm circle with a central mark, which is still distinctive. The rim dots disappear below 48px, which is acceptable since they are decorative.

**Why this works**: Plate equals food. House equals home. Together: home food. The thali reference is culturally rooted. The face-like quality (house as nose, smile below) creates subconscious friendliness.

### Concept C: "The Tiffin Stack"

**Description**: A stylized three-tier tiffin carrier (dabba) viewed from a slight three-quarter angle. The tiffin is the iconic cylindrical stacking container used across India to carry home-cooked meals. The three tiers are stacked and slightly offset from each other (each tier shifted 2-3px to the right of the one below), creating a sense of casual stacking rather than rigid alignment. The handle/clasp at the top is a simple arc. A single small heart shape is cut out of the middle tier, like a window through which a warm glow emanates.

**Shape language**: Each tier is a rounded rectangle with generous corner radius (nearly capsule-shaped). The offset stacking gives the icon personality -- it is not a corporate logo, it is a slightly imperfect, human object. The handle is a single smooth arc connecting the top tier's edges.

**Color treatment**: Bottom tier is Coriander (#2E7D52). Middle tier is Turmeric (#E8913A). Top tier is Terracotta (#D84315). This creates a vertical warm gradient that reads as appetizing and lively. The heart cutout in the middle tier reveals a Light Turmeric (#FFF3E0) glow behind it. The handle/clasp is Charcoal (#263238).

**Background**: Light Turmeric (#FFF3E0). The pale warm background lets the three tiers pop with their distinct colors and feels like warm kitchen light.

**Recognizability at small sizes**: The three-tier stacked shape is highly distinctive in an app icon grid. No other major app uses a tiffin silhouette. At 16px, it reads as a simple three-segment vertical stack, which remains unique. The heart cutout disappears below 48px, which is acceptable.

**Why this works**: The tiffin carrier is the most iconic symbol of Indian home-cooked food being shared. It is literally the object used to carry homemade food from one home to another. The three colors use the full brand palette. The offset stacking and heart cutout add personality.

### Recommendation

**Concept A ("The Warm Pot") is recommended as the primary icon.** It has the strongest silhouette at small sizes, uses the simplest shape language, and communicates the brand instantly. Concept C ("The Tiffin Stack") is the strongest alternative and should be tested in A/B icon testing if the platform supports it.

---

## 2. Onboarding Illustration Concepts

These illustrations appear once, during the three-slide introduction flow on first launch. They are swipeable, skippable, and must communicate their message in under 2 seconds of viewing. Per the behavioral engagement system, each slide addresses one of the three core user barriers: discovery (effort), connection (social), and trust.

### Technical Requirements

| Specification | Value |
|---|---|
| Canvas size | 360 x 320 px (@1x), export at @1x, @2x, @3x |
| Format | SVG (primary, for web), PNG fallback (mobile), Lottie (if animated) |
| Art style | Flat illustration with paper-grain texture overlay at 5% opacity |
| Color palette | Turmeric, Coriander, Light Turmeric, Terracotta (sparingly), Charcoal for outlines, Cloud for negative space |
| Character style | Slightly oversized heads (1:5 head-to-body ratio), minimal facial features (dot eyes, curve smile), diverse skin tones (3-4 distinct warm brown tones), Indian attire details (dupatta, kurta, saree drape) without being costume-like |
| Outline weight | 1.5px consistent with icon system |
| Maximum unique colors per illustration | 6 (excluding skin tones and white) |
| Animation (optional) | Subtle loop: floating elements, gentle bobbing, steam wisps. 2-3 second loop. Lottie format, under 80KB per animation. |

### Slide 1: "Discover Homemade Food Near You"

**Headline (from behavioral doc)**: "Your neighbors are amazing cooks."
**Body**: "GharKa lets you discover and order homemade food from people who live near you."

**Illustration concept**: A warm, illustrated bird's-eye view of a small cluster of 5-6 homes arranged in a loose circle, as if looking down at a section of a gated community. The homes are simplified -- rectangles with triangular or flat roofs, each in a slightly different warm neutral tone (Cloud, Light Turmeric, white with Mist borders). Above 3 of the homes, small food icons float: a steaming bowl, a plate of round items (suggesting rotis or parathas), and a covered tiffin. These food icons are rendered in Turmeric and Coriander, brighter than the houses, drawing the eye. Thin dotted curved lines connect the food icons to each other, suggesting a network of sharing. At the bottom of the cluster, one home is slightly larger and shows a tiny figure standing at the doorway, looking up at the food icons with a hand raised in a gentle wave. The ground between houses has small organic blob shapes in Mint Wash (#E8F5E9), suggesting garden patches and softening the geometry.

**Key visual signals**: Proximity (homes are close together), abundance (multiple food sources), discovery (the figure looking up and noticing), community (the connecting lines).

**What to avoid**: Do not make it look like a map or a delivery route. No roads, no pin markers, no GPS-style elements. This is a neighborhood, not a logistics diagram. Do not show any phone or device in the illustration -- the app is the frame, so the illustration should be the world, not the tool.

**Color breakdown**: Houses in Cloud (#F5F7F8) and Light Turmeric (#FFF3E0). Food icons in Turmeric (#E8913A) and Coriander (#2E7D52). Connecting lines in Turmeric at 40% opacity. Ground blobs in Mint Wash (#E8F5E9). Figure's clothing in Coriander. Outlines in Charcoal (#263238) at 60% opacity.

**Optional animation**: The food icons gently bob up and down (2px travel, 2-second loop, staggered timing so they do not move in sync). The steam wisp on the bowl slowly drifts and fades. The dotted connecting lines draw on in sequence, as if the network is forming.

**AI Image Generation Prompt (for reference/concepting)**:

```
Flat vector illustration, bird's-eye view of a small Indian gated
community neighborhood, 5-6 simplified warm-toned homes arranged in
a loose cluster, three homes have small floating food icons above
them (steaming bowl, plate of rotis, tiffin carrier), thin dotted
curved lines connect the food icons suggesting a sharing network,
one small friendly figure standing at a doorway looking up, soft
green garden patches between homes, warm color palette of turmeric
orange (#E8913A) and coriander green (#2E7D52) on cream (#FFF3E0)
background, minimal outlines, paper grain texture overlay, slightly
whimsical proportions, Indian residential architecture style with
flat and angled roofs, no text, no devices, no roads or map markers,
community warmth feeling, clean modern illustration style with
hand-drawn quality, suitable for mobile onboarding screen
```

### Slide 2: "Connect with Neighborhood Cooks"

**Headline (from behavioral doc)**: "Browse. Chat. Eat."
**Body**: "Find something you love, message the cook directly, and work out pickup between yourselves."

**Illustration concept**: Two people standing face-to-face across a low wall or railing (suggesting a balcony divider or compound wall in a gated community). The person on the left is a woman in her late 30s-40s, wearing a comfortable salwar kameez with a dupatta draped over one shoulder, holding a covered dish (a round casserole with a lid, or a steel dabba) extended toward the other person. She has a warm, confident expression (upward curve mouth, slightly closed eyes suggesting a genuine smile). The person on the right is younger, perhaps late 20s, in casual modern Indian attire (t-shirt and jeans, or a casual kurta), reaching out to receive the dish with both hands, body language showing anticipation and gratitude (slight lean forward, open palms). Between them, a large speech bubble shape floats -- but instead of text, it contains a small heart icon rendered in Terracotta. The wall/railing between them is low and non-threatening, rendered as a simple horizontal line with small vertical posts, in Mist (#E0E7EA). Behind each person, a partial doorway is visible, anchoring them to their respective homes.

**Key visual signals**: Human connection (face-to-face, not screen-to-screen), the physical act of food sharing, the chat/message element (speech bubble), warmth and trust (the heart, the expressions), ease (the low wall -- there are no barriers between neighbors).

**What to avoid**: Do not show a phone screen or chat interface. The speech bubble is metaphorical. Do not make the food exchange look transactional -- no money visible, no bags, no receipts. Do not make either person look like a delivery person. They are equals sharing across a common wall.

**Color breakdown**: Left person's clothing in Coriander (#2E7D52) with Light Turmeric (#FFF3E0) dupatta. Right person's clothing in Turmeric (#E8913A) with Charcoal (#263238) details. Dish/dabba in metallic silver-gray (Neutral 500, #90A4AE) with a Turmeric lid. Speech bubble outline in Light Turmeric, heart in Terracotta (#D84315). Wall in Mist (#E0E7EA). Doorways in Cloud (#F5F7F8). Skin tones: two distinct warm brown tones reflecting diversity.

**Optional animation**: The dish gently transfers from left to right (a slow 3-second arc). The speech-bubble heart pulses once softly. Both figures have a subtle idle sway (0.5-degree rotation, 3-second loop).

**AI Image Generation Prompt (for reference/concepting)**:

```
Flat vector illustration, two Indian people exchanging a covered food
dish across a low balcony wall in a gated community, woman on left
wearing salwar kameez with dupatta holding a steel dabba extended
forward with warm smile, younger person on right in casual kurta
reaching to receive the dish with grateful expression, a floating
speech bubble between them contains a small heart icon instead of
text, low dividing wall rendered as simple railing, partial doorways
visible behind each person suggesting their homes, warm color palette
of turmeric orange (#E8913A) and coriander green (#2E7D52), diverse
Indian skin tones, paper grain texture overlay, minimal facial
features (dot eyes, curve smiles), slightly whimsical proportions
with oversized heads, no phones or screens visible, no money or
transaction elements, neighborly and equal interaction, clean modern
flat illustration style, suitable for mobile onboarding screen, cream
(#FFF3E0) background
```

### Slide 3: "Simple. No Payments in App. Just Neighbors Helping Neighbors."

**Headline (from behavioral doc)**: "Real food from real neighbors."
**Body**: "Everyone on GharKa lives in your area. You'll see who they are, what others say about them, and how active they are."

**Illustration concept**: A wider scene showing three people seated together at a low table or chowki (a small traditional Indian wooden platform table), sharing food. The table is round, viewed from a slight elevated angle so the surface is visible. On the table: two or three bowls and a plate, a small stack of rotis, and a cup -- enough to suggest a shared meal without overloading detail. The three people are diverse: different ages (one older, perhaps 50s with gray hair; one middle-aged, 30s-40s; one younger, 20s), different genders (at least one woman), and different attire styles (one in a saree, one in a kurta, one in a t-shirt). They are not looking at the food -- they are looking at each other, mid-conversation, with relaxed postures (one leaning back, one gesturing while talking, one laughing). Behind them, a subtle suggestion of apartment buildings -- just two or three vertical rectangles with small square windows, rendered in very light Cloud tones so they recede into the background. A small community badge or shield shape floats above the scene, outlined in Coriander green, containing a tiny checkmark -- suggesting trust and community verification without being heavy-handed.

**Key visual signals**: Community (three diverse people together), trust (eye contact, laughter, the badge), simplicity (a shared meal with no technology in sight), authenticity (real food, real people, real setting).

**What to avoid**: Do not make it look like a restaurant scene. No menus, no waitstaff, no formal dining setup. The table should feel like someone's living room or a shared community space. Do not make the community badge look like a corporate "verified" stamp -- it should be small, gentle, almost an afterthought.

**Color breakdown**: Table/chowki in a warm wood tone (a desaturated Turmeric, like #C4956A). Food items in Turmeric and Coriander. People in varied clothing using all three brand colors distributed across them. Buildings in Cloud (#F5F7F8) with Mist (#E0E7EA) window outlines. Community badge outline in Coriander (#2E7D52), checkmark in Coriander. Skin tones: three distinct warm tones representing diversity.

**Optional animation**: Gentle steam rises from one of the bowls. The community badge fades in with a subtle scale-up after a 1-second delay. The gesturing figure's hand moves slightly in a conversational loop.

**AI Image Generation Prompt (for reference/concepting)**:

```
Flat vector illustration, three diverse Indian people of different
ages sitting together around a small round low wooden table sharing
a home-cooked meal, slight elevated camera angle showing the table
surface with bowls of curry and stack of rotis and a chai cup, older
person with gray hair in saree, middle-aged person in kurta, younger
person in casual t-shirt, all looking at each other mid-conversation
with relaxed happy expressions rather than looking at food, subtle
apartment buildings faintly visible in background, a small green
shield badge with checkmark floating gently above the scene, warm
color palette of turmeric orange (#E8913A) and coriander green
(#2E7D52), diverse warm brown skin tones, paper grain texture
overlay, minimal facial features (dot eyes, curve smiles), slightly
whimsical proportions, no phones or technology visible, no money,
community trust feeling, clean modern flat illustration style,
suitable for mobile onboarding screen, cream (#FFF3E0) background
```

---

## 3. Empty State Illustrations

Empty states are dead ends reframed as invitations. Per the brand guide, each empty state gets a scene-based illustration (not just an icon), uses the limited brand palette, and includes characters with the same art style as onboarding. The illustration carries the emotional weight; the copy stays short and action-oriented.

### Technical Requirements

| Specification | Value |
|---|---|
| Canvas size | 240 x 200 px (@1x), export at @1x, @2x, @3x |
| Format | SVG (primary), PNG fallback |
| Color limit | 5 colors per illustration (plus skin tones and white) |
| Character style | Same as onboarding -- oversized heads, dot eyes, curve smiles |
| Texture | Paper-grain overlay at 5% opacity |
| Composition | Centered, with main subject in the upper 60% and a clear "ground" or base in the lower 40% for visual stability |
| CTA hint | Each illustration should visually suggest the action the user should take next, without containing text |

### 3.1 No Listings Nearby

**Screen context**: Home feed is empty because no cooks within 5km have active listings.
**Copy (from brand guide)**: "No one's cooking right now. Check back soon -- or be the first to share!"
**CTA button below**: "Share a Dish" (for users who can be sellers) or "Invite a Cook" (for buyer-only users)

**Illustration concept**: Two neighbors leaning on a shared balcony railing, side by side, both looking out into the distance with a relaxed, expectant posture -- as if waiting for something pleasant. One holds an empty plate loosely at their side. The other has a hand shading their eyes, scanning the horizon. Between them on the railing, a small potted tulsi (basil) plant adds life. The balcony railing is the visual "ground." Behind them, a warm sky gradient (Light Turmeric at top fading to white at bottom) suggests early morning or golden hour -- a time when cooking is about to begin. No food is visible, which is intentional: the scene is about anticipation, not absence.

**Emotional tone**: Patient, optimistic, companionable. Two people waiting together is warmer than one person waiting alone. The scanning gesture adds a hint of playfulness.

**Color breakdown**: Railing in Mist (#E0E7EA). Figures in Turmeric (#E8913A) and Coriander (#2E7D52). Empty plate in Neutral 200 (#E0E7EA). Tulsi pot in Coriander, pot in Terracotta (#D84315). Sky in Light Turmeric (#FFF3E0) to white gradient.

**AI Image Generation Prompt**:

```
Flat vector illustration, two Indian neighbors standing side by side
leaning on a balcony railing looking out expectantly, one holds an
empty plate loosely at their side, the other shades their eyes
scanning the horizon, small potted tulsi basil plant on the railing
between them, warm golden sky gradient behind them, no food visible,
feeling of patient anticipation, warm turmeric orange and coriander
green color palette, minimal facial features, paper grain texture,
slightly whimsical proportions, clean flat illustration style,
240x200 composition, cream background
```

### 3.2 No Orders Yet (Buyer)

**Screen context**: "My Orders" tab is empty because the buyer has not yet requested any dishes.
**Copy (from brand guide)**: "No orders yet. Your neighbor's kitchen is waiting."
**CTA button below**: "Browse What's Cooking"

**Illustration concept**: A plate and a steel spoon resting on a doorstep welcome mat. The mat has a simple geometric border pattern (a nod to Indian rangoli/kolam designs, rendered in Coriander green on a Light Turmeric mat). The plate is a traditional Indian steel thali -- round, with a subtle rim. The spoon rests across the plate at a casual angle. Behind the doorstep, a partially open door reveals a sliver of warm golden light (suggesting a kitchen just inside). The door is a solid warm color (desaturated Turmeric). A small pair of sandals/chappals sits beside the mat, adding domesticity and the culturally resonant detail of removing shoes at the door.

**Emotional tone**: Welcoming, domestic, "your meal is just one step away." The open door with warm light is an invitation.

**Color breakdown**: Mat in Light Turmeric (#FFF3E0) with Coriander (#2E7D52) border pattern. Plate in Neutral 200 (#E0E7EA) with subtle metallic sheen. Spoon in Neutral 500 (#90A4AE). Door in desaturated Turmeric. Warm light through door crack in Turmeric (#E8913A) at 30% opacity. Chappals in Terracotta (#D84315). Doorstep ground in Cloud (#F5F7F8).

**AI Image Generation Prompt**:

```
Flat vector illustration, Indian steel thali plate and spoon resting
on a doorstep welcome mat with simple rangoli-style border pattern,
partially open door behind revealing warm golden kitchen light, small
pair of chappals beside the mat, welcoming domestic scene, no people,
warm turmeric orange and coriander green color palette, minimal
detail, paper grain texture, clean flat illustration style, feeling
of invitation and warmth, 240x200 composition, light cream background
```

### 3.3 No Listings Yet (Seller / Cook)

**Screen context**: "My Listings" tab is empty because the cook has not yet shared any food.
**Copy (from brand guide)**: "Your kitchen is ready. Share your first dish with the community."
**CTA button below**: "Share Your First Dish"

**Illustration concept**: A person standing in a kitchen with arms spread wide in a welcoming, "ta-da" gesture, facing the viewer. The kitchen is suggested with minimal elements: a counter surface in front of the person, two or three jars on a shelf behind them (in brand colors -- Turmeric, Coriander, Terracotta), and a single gas burner or stove element to the side. The counter is conspicuously clean and empty -- a blank canvas. The person's expression is confident and excited (wide curve smile, raised hands). They wear a casual apron over home clothes. The entire scene says: "I'm ready, the kitchen is ready, let's go."

**Emotional tone**: Empowering, exciting, a beginning. The open arms and clean counter are visual calls to action -- this space is waiting to be filled by the cook's creativity.

**Color breakdown**: Counter in Cloud (#F5F7F8) with Mist (#E0E7EA) edge. Shelf jars in Turmeric, Coriander, and Terracotta. Person's apron in Light Turmeric (#FFF3E0) with a Turmeric tie. Clothing in Coriander. Stove element in Neutral 700 (#546E7A). Background in Light Turmeric (#FFF3E0).

**AI Image Generation Prompt**:

```
Flat vector illustration, Indian person standing in a simple kitchen
with arms spread wide in welcoming gesture facing the viewer, clean
empty counter in front of them, a few colorful jars on a shelf
behind (orange, green, red), small gas stove to the side, person
wearing a casual apron over home clothes with excited expression,
the counter is deliberately empty suggesting a blank canvas ready
to be filled, warm turmeric orange and coriander green color palette,
minimal facial features, paper grain texture, empowering and
exciting feeling, clean flat illustration style, 240x200 composition,
cream background
```

### 3.4 No Messages Yet

**Screen context**: Chat tab is empty because the user has no conversations yet.
**Copy (from brand guide)**: "No chats yet. Start a conversation with a cook whose food catches your eye."
**CTA button below**: "Browse Nearby Dishes"

**Illustration concept**: Two empty speech bubbles floating side by side, slightly overlapping. The left bubble is Turmeric-outlined (representing the cook), the right is Coriander-outlined (representing the buyer). Between and slightly below the two bubbles, a small red heart in Terracotta floats, acting as a bridge. Below the bubbles, two small steaming cups of chai sit on a shared surface -- the universal Indian symbol for "let's talk." The cups are simple rounded shapes with a wisp of steam each. The composition suggests two people about to have a conversation over chai, but the people are absent -- just their future conversation space, waiting to be filled.

**Emotional tone**: Anticipatory, warm, intimate. The chai cups ground the floating bubbles in something tangible and culturally familiar. The heart bridges the gap between strangers.

**Color breakdown**: Left speech bubble outline in Turmeric (#E8913A) at full opacity, fill in Light Turmeric (#FFF3E0) at 30%. Right speech bubble outline in Coriander (#2E7D52) at full opacity, fill in Mint Wash (#E8F5E9) at 30%. Heart in Terracotta (#D84315). Chai cups in Neutral 500 (#90A4AE) with Turmeric chai color inside. Steam in white at 60% opacity. Surface line in Mist (#E0E7EA).

**AI Image Generation Prompt**:

```
Flat vector illustration, two empty speech bubbles floating side by
side slightly overlapping, left bubble outlined in turmeric orange
and right in coriander green, a small red heart floating between
them as a bridge, below the bubbles two small steaming chai cups
sit on a subtle surface line, warm and anticipatory feeling of a
conversation about to begin, no people present, minimal clean
composition, warm turmeric orange and coriander green color palette,
paper grain texture, clean flat illustration style, 240x200
composition, cream background
```

### 3.5 No Search Results

**Screen context**: User searched for a specific dish or keyword and nothing matched.
**Copy (from brand guide)**: "No dishes match your search. Try something else, or browse what's fresh today."
**CTA button below**: "Browse All Dishes"

**Illustration concept**: A person peeking into an open tiffin carrier with a curious, slightly surprised expression. The tiffin lid is hinged open, and the interior of the tiffin is visibly empty (a clean circle of Neutral 200). The person is crouched or leaning forward, one hand on the tiffin lid, the other hand's index finger on their chin in a "hmm" thinking pose. Their eyebrows are slightly raised (two small arcs above dot eyes). Around the tiffin, three or four small question marks float in Neutral 500 (Ash), keeping the tone light and curious rather than frustrated or sad. A faint magnifying glass shape in the background (very subtle, in Mist color at 20% opacity) connects the scene to the search context.

**Emotional tone**: Curious, light, "that's odd" rather than "something is wrong." The tiffin is empty, but the person is intrigued, not disappointed.

**Color breakdown**: Tiffin exterior in Turmeric (#E8913A). Tiffin interior in Neutral 200 (#E0E7EA). Person in Coriander (#2E7D52) clothing. Question marks in Neutral 500 (#90A4AE). Background magnifying glass in Mist (#E0E7EA) at 20% opacity. Skin tone: warm brown.

**AI Image Generation Prompt**:

```
Flat vector illustration, Indian person peeking curiously into an
open empty tiffin carrier with surprised expression, one hand on
the hinged lid and other hand with finger on chin in thinking pose,
the tiffin interior is clearly empty, small question marks floating
around, faint magnifying glass shape very subtle in background,
curious and lighthearted tone not sad, warm turmeric orange tiffin
and coriander green clothing, minimal facial features with raised
eyebrow arcs, paper grain texture, clean flat illustration style,
240x200 composition, cream background
```

### 3.6 Location Not Shared

**Screen context**: The app needs location permission to show nearby listings, but the user has not granted it.
**Copy**: "GharKa needs your location to find cooks nearby. We only check your neighborhood -- never track you."
**CTA button below**: "Share My Location"

**Illustration concept**: A simplified overhead view of a neighborhood (similar to Onboarding Slide 1 but smaller and simpler -- just 3-4 house shapes). Over the entire scene, a large, soft, translucent cloud or fog layer obscures the houses partially -- they are visible but muted, as if behind frosted glass. In the center of the cloud, a location pin icon (the classic map pin shape) with a question mark inside it. The pin is rendered in Turmeric, the question mark in white. The overall message: "Your neighborhood is here, waiting -- we just need to know where 'here' is."

**Emotional tone**: Gentle, non-threatening, transparent. The fog/cloud should feel soft and temporary, not ominous. The location pin with a question mark is honest about what the app needs without being demanding.

**Color breakdown**: Houses beneath the fog in Cloud (#F5F7F8) and Light Turmeric (#FFF3E0), muted by the overlay. Fog/cloud layer in white (#FFFFFF) at 60% opacity with soft edges. Location pin in Turmeric (#E8913A). Question mark inside pin in white (#FFFFFF). Ground color beneath houses in Mint Wash (#E8F5E9) at 30%.

**AI Image Generation Prompt**:

```
Flat vector illustration, overhead view of a small neighborhood with
3-4 simplified houses partially obscured by a soft translucent white
fog or cloud layer, a location map pin icon with a question mark
inside it floating in the center of the fog, houses visible but
muted beneath the fog as if behind frosted glass, gentle and
non-threatening feeling of something waiting to be revealed, warm
turmeric orange location pin on muted cream and green tones, minimal
detail, paper grain texture, clean flat illustration style, 240x200
composition, soft cream background
```

---

## 4. 3D Model Specifications for Three.js Hero

Per the Master Architecture document (Section 10), the landing page hero uses Three.js via React Three Fiber to display stylized low-poly 3D food items floating with parallax on mouse/scroll. This section specifies every model needed, sourcing strategy, and technical constraints.

### Performance Budget (from Architecture Doc)

| Constraint | Value |
|---|---|
| Total asset budget | 2 MB maximum (all models combined, compressed) |
| Individual model budget | 500 KB maximum per model (DRACO compressed) |
| Target frame rate | 60fps on mid-range devices |
| Polygon budget per model | 500-2,000 triangles (low-poly stylized aesthetic) |
| Texture resolution | 512x512 px maximum per texture atlas |
| Compression | DRACO compression for all .glb files |
| Fallback | Static image for devices with `navigator.hardwareConcurrency < 4` or `navigator.deviceMemory < 4` |
| Canvas rendering | `frameloop="demand"` -- only re-render on scroll/mouse input |
| Lazy loading | `next/dynamic` with `ssr: false`, wrapped in Suspense |

### Models Required

#### 4.1 Indian Steel Thali Plate

**Purpose**: The central hero model. Floats at the center of the scene, slightly tilted, rotating very slowly (0.5 RPM).

**Visual description**: A round plate modeled after the traditional Indian stainless steel thali. Flat base with a raised rim approximately 1.5cm high. The rim has a subtle rolled edge (one additional edge loop at the top of the rim). Diameter: proportionally the largest element in the scene. Surface finish: brushed stainless steel look -- not mirror-shiny, but with subtle directional highlights that catch light as it rotates.

**Geometry specifications**:
- Triangle count: 800-1,200
- Topology: Clean quads converted to tris, no n-gons
- UV unwrapped: single UV island, cylindrical projection
- Scale: 1 unit = 1 cm in Blender, final diameter ~30 units

**Material specifications**:
- Base color: Light silver-gray (#C0C4C8) -- not the blue-white of chrome, the warmer gray of real stainless steel
- Metalness: 0.85
- Roughness: 0.35 (brushed, not polished mirror)
- Normal map: Subtle circular brush marks (512x512 normal map, blue channel)
- Emissive: None
- No textures beyond normal map -- keep PBR material shader-based for file size

**Animation**: Floats using drei `<Float>` component. Speed: 1.5, rotationIntensity: 0.3, floatIntensity: 0.5. Additionally, continuous Y-axis rotation at 0.5 RPM via `useFrame`.

**Sourcing options**:
1. **Custom (recommended)**: Model in Blender. 30 minutes of work for an experienced modeler. Simple lathe operation on a cross-section profile.
2. **Sketchfab**: Search "Indian thali plate low poly" or "steel plate stylized." License: CC-BY or purchased.
3. **Poly Pizza**: Search "plate" for basic shapes, then modify rim height in Blender.

#### 4.2 Rounded Serving Bowl (Katori)

**Purpose**: Floats near the thali, slightly above and to the right. Contains a suggested "curry" surface inside (a warm-colored disc with subtle bump).

**Visual description**: A small, deep, rounded bowl -- the katori that accompanies a thali. Smooth exterior, slightly flared rim. Inside the bowl, a filled "surface" disc sits at about 70% height, colored in warm Turmeric tones to suggest dal or curry without being literal. A very subtle bulge in the surface normal gives it a liquid look.

**Geometry specifications**:
- Triangle count: 400-600
- Topology: Sphere-derived, bottom half scaled inward
- UV: Cylindrical projection, single island
- The "curry surface" disc inside is a separate flat circle mesh, 200 tris max

**Material specifications**:
- Bowl exterior: Same stainless steel material as thali (shared material instance for performance)
- Bowl interior: Slightly darker metalness (0.7) to suggest depth
- Curry surface: Base color Turmeric (#E8913A), metalness: 0.0, roughness: 0.7, subtle normal map for surface irregularity (128x128)

**Animation**: Floats independently of thali. `<Float>` speed: 2.0, rotationIntensity: 0.2, floatIntensity: 0.7. No continuous rotation (just floating bob).

**Sourcing**: Custom model in Blender (15 minutes). Basic sphere boolean subtraction.

#### 4.3 Stylized Spoon (Chamcha)

**Purpose**: Floats near the thali, to the lower left. Rotates slowly on its long axis.

**Visual description**: A traditional Indian serving spoon -- slightly larger and rounder than a Western tablespoon, with a thicker handle. The bowl of the spoon is nearly circular (not oval). The handle tapers gently and ends in a simple flat tip (not ornamental). Overall proportions are slightly exaggerated (bowl 20% larger than realistic, handle 10% shorter) to read clearly as a spoon at the low-poly triangle count.

**Geometry specifications**:
- Triangle count: 300-500
- Topology: Modeled from a single mesh, no boolean operations
- UV: Simple planar projection (the model is simple enough)

**Material specifications**:
- Same stainless steel material as thali (shared instance)
- Slightly higher roughness on handle (0.45) to suggest grip wear

**Animation**: `<Float>` speed: 1.8, rotationIntensity: 0.4, floatIntensity: 0.6. Gentle Z-axis rotation at 0.3 RPM.

**Sourcing**: Custom (10 minutes in Blender) or Poly Pizza "spoon" modified.

#### 4.4 Stack of Rotis / Flatbreads

**Purpose**: Floats above and to the left of the thali. Adds organic warmth to the metallic elements.

**Visual description**: Three to four slightly irregular circles stacked with casual offsets (each one rotated 5-10 degrees from the one below, and shifted 1-2 units). The topmost roti has a few subtle brown spots (ghee marks) painted in texture. The edges are slightly wavy (not perfect circles) to suggest handmade bread. Each roti is a slightly puffed disc -- not flat paper, but gently domed.

**Geometry specifications**:
- Triangle count: 200-300 per roti, 800-1,200 for the stack
- Topology: Displaced circle meshes with subdivision
- UV: Planar top-down projection per disc

**Material specifications**:
- Base color: Warm wheat tone (#D4A76A)
- Roughness: 0.9 (matte, bread-like)
- Metalness: 0.0
- Color map (512x512): Subtle brown spots scattered across surface, lighter center, slightly darker edges (the characteristic roti browning pattern). This is the one texture in the scene that needs actual painted detail.
- Normal map: Very subtle (128x128) for surface grain/irregularity

**Animation**: `<Float>` speed: 1.2, rotationIntensity: 0.15, floatIntensity: 0.4. The stack floats as a single group, rotating very slowly on Y-axis at 0.2 RPM.

**Sourcing**: Custom (30 minutes -- the texture painting is the bulk of the work). No good pre-made low-poly roti models exist.

#### 4.5 Steam Particle System

**Purpose**: Rises from the katori bowl and from the roti stack, adding life and movement to the scene.

**Visual description**: Not a 3D model but a particle system. Soft, translucent white wisps that rise slowly, drift slightly to one side, and fade out. Each "wisp" is a simple 2D quad (billboard sprite) with a soft cloud texture, fading from 40% opacity at birth to 0% at death. Particles spawn at the surface of the katori and the top roti, rise 15-20 units, and die over 3-4 seconds.

**Technical specifications**:
- Particle count: 8-12 active particles at any time (very sparse, not a steam cloud)
- Sprite texture: 64x64 px, soft radial gradient from white center to transparent edge
- Billboard mode: Always face camera
- Spawn rate: 2-3 particles per second per emitter
- Lifetime: 3-4 seconds
- Velocity: Y-up at 3 units/second, with X-drift of 0.5 units/second (wind effect)
- Scale: Start at 2 units, grow to 5 units at death
- Opacity: Start 0.4, end 0.0 (linear fade)

**Implementation**: Use `@react-three/drei`'s `<Billboard>` for individual sprites, or a custom particle system using instanced meshes. Avoid Three.js `Points` for this effect (sprites need to be soft-edged quads, not point sprites).

**Sourcing**: Code-only. No external model needed. The sprite texture is generated programmatically or is a single 64x64 PNG (<1KB).

#### 4.6 Small Chili Pepper (accent)

**Purpose**: A single small red chili pepper floating in the far right of the scene, adding a pop of Terracotta color and breaking the symmetry.

**Visual description**: A curved, tapered chili shape. Simple geometry -- essentially a deformed cone with a slight S-curve. A tiny green stem cap at the wide end. The curve gives it a playful, organic silhouette.

**Geometry specifications**:
- Triangle count: 150-250
- Topology: Deformed cone or swept profile

**Material specifications**:
- Body: Terracotta (#D84315), roughness: 0.6, metalness: 0.0, slight glossy sheen
- Stem: Coriander (#2E7D52), roughness: 0.8
- No textures needed -- solid colors read well at this scale

**Animation**: `<Float>` speed: 2.5, rotationIntensity: 0.5, floatIntensity: 0.8. Rotates on all axes slowly and irregularly.

**Sourcing**: Custom (10 minutes) or Poly Pizza "chili" / "pepper."

#### 4.7 Coriander Leaf Cluster (accent)

**Purpose**: Two to three small coriander (cilantro) leaves floating in the lower right area, adding the secondary brand color and organic softness.

**Visual description**: Simple leaf shapes -- each leaf is a flat quad with an alpha-masked texture creating the distinctive coriander leaf silhouette (three-lobed, fan-shaped). The leaves are grouped but not touching, each at a slightly different angle. The flat nature of the leaves creates visual contrast with the volumetric food items.

**Geometry specifications**:
- Triangle count: 4-8 per leaf (they are textured quads), ~20 tris total
- UV: Simple planar

**Material specifications**:
- Base color: Coriander (#2E7D52)
- Alpha map: 128x128 leaf silhouette cutout
- Roughness: 0.7
- Metalness: 0.0
- Double-sided rendering: enabled (leaves flip during float)
- No backface culling

**Animation**: `<Float>` speed: 3.0, rotationIntensity: 0.8, floatIntensity: 1.0. Highest float and rotation values in the scene -- leaves are light and drift the most.

**Sourcing**: Custom (5 minutes geometry + 10 minutes alpha texture).

### Scene Composition

```
                    [Roti Stack]
                         \
                          \
    [Coriander Leaves]  [Thali Plate]  [Chili Pepper]
                          /    \
                         /      \
                   [Katori]   [Spoon]
                      |
                   [Steam]
```

**Camera**: Perspective camera, FOV 50, positioned at (0, 2, 8), looking at origin. On scroll, the camera Y position shifts slightly (parallax effect via `useScroll` from drei).

**Lighting**:
- Ambient light: intensity 0.4, color Light Turmeric (#FFF3E0) -- warm base
- Directional light (key): intensity 1.0, position (5, 8, 5), color white, casting soft shadows
- Point light (fill): intensity 0.3, position (-3, 2, 3), color Turmeric (#E8913A) -- warm fill
- Environment map: None (keep it simple, the warm-tinted ambient + directional is sufficient)

**Background**: Transparent canvas (`<Canvas style={{ background: 'transparent' }}>`) so the web page background (Light Turmeric or gradient) shows through.

### Asset File Structure

```
apps/web/public/models/
  thali-plate.glb          # ~80KB DRACO compressed
  katori-bowl.glb          # ~40KB DRACO compressed
  spoon.glb                # ~25KB DRACO compressed
  roti-stack.glb           # ~60KB DRACO compressed (includes texture)
  chili-pepper.glb         # ~15KB DRACO compressed
  coriander-leaves.glb     # ~10KB DRACO compressed (includes alpha)
  steam-sprite.png         # ~1KB

Total estimated: ~231KB (well under 2MB budget)
```

### Blender Export Settings

| Setting | Value |
|---|---|
| Format | glTF Binary (.glb) |
| Include | Selected Objects only |
| Transform | +Y Up |
| Geometry | Apply Modifiers, UVs, Normals, Vertex Colors |
| Compression | DRACO (quantization: Position 14, Normal 10, TexCoord 12) |
| Animation | None (all animation is handled in React Three Fiber) |
| Materials | Export Materials, Images: JPEG quality 85 |

---

## 5. Default Avatar Set

Users who do not upload a profile photo receive a default avatar. Per the brand guide, the default must never be a blank silhouette or a generic gray person icon. Each avatar should feel like a character -- warm, friendly, and slightly stylized.

### Technical Requirements

| Specification | Value |
|---|---|
| Canvas size | 200 x 200 px (circular crop in UI) |
| Format | SVG (primary, scalable), PNG @2x fallback |
| Shape | Design for circular mask -- keep all content within a centered 180px circle |
| Background | Each avatar has a distinct solid background color from the brand palette |
| Style | Flat, minimal, same character proportions as onboarding illustrations |
| Outline | 1.5px, Charcoal (#263238) |

### Avatar Descriptions

#### Avatar 1: "The Biryani Aunty"
**Background color**: Turmeric (#E8913A)
**Description**: A woman with her hair pulled back in a bun, wearing a simple saree drape over one shoulder. Her expression is a confident, knowing smile (the "I make the best biryani and I know it" face). Minimal jewelry -- a single small nose stud dot and small earring circles. Skin tone: medium warm brown.
**Gender/Age suggestion**: Woman, 40s-50s

#### Avatar 2: "The Weekend Baker"
**Background color**: Coriander (#2E7D52)
**Description**: A younger person wearing a simple apron over a t-shirt. A small dusting of flour is suggested on the apron (three small white dots). Their expression is cheerful and slightly mischievous (one eye slightly larger than the other -- a playful asymmetry). Hair is short and slightly tousled. Skin tone: lighter warm brown.
**Gender/Age suggestion**: Gender-neutral, 20s-30s

#### Avatar 3: "The Chai Expert"
**Background color**: Deep Turmeric (#C47425)
**Description**: A person holding a small cup of chai close to their face with both hands, as if warming their palms. The cup partially obscures their lower face, but their eyes are visible above -- crinkled in a warm smile. They wear a simple collared shirt or kurta neck. Small reading glasses perched on their nose. Skin tone: deep warm brown.
**Gender/Age suggestion**: Man, 50s-60s

#### Avatar 4: "The Pickle Pro"
**Background color**: Terracotta (#D84315)
**Description**: A person with a wide, bright smile, wearing a headscarf or bandana tied at the top. They hold up a small jar (pickle jar silhouette) triumphantly in one hand. The jar has a small checkered cloth lid tied with a string. Skin tone: medium warm brown. Expression is proud and accomplished.
**Gender/Age suggestion**: Woman, 30s-40s

#### Avatar 5: "The Snack Master"
**Background color**: Coriander (#2E7D52)
**Description**: A person mid-bite, holding a samosa near their mouth. Their eyes are closed in the "this is delicious" expression (curved-line eyes, not dot eyes for this one). They wear a casual round-neck t-shirt. Hair is medium length, slightly wavy. Skin tone: lighter warm brown.
**Gender/Age suggestion**: Gender-neutral, 20s

#### Avatar 6: "The Chef Hat"
**Background color**: Light Turmeric (#FFF3E0), outline in Turmeric
**Description**: No person. A simple, slightly floppy chef's toque (not a tall rigid restaurant hat -- a softer, homely version with a slight lean to one side). Below the hat, a curve suggesting a smile. The hat has a small heart shape embroidered/drawn on the front in Terracotta. This is the most "icon-like" avatar for users who prefer not to have a character representation.
**Gender/Age suggestion**: Non-gendered, non-age-specific

#### Avatar 7: "The Steel Spoon"
**Background color**: Mint Wash (#E8F5E9), outline in Coriander
**Description**: No person. A single large steel serving spoon (chamcha), rendered in the same style as the 3D model but as a flat illustration. The spoon bowl faces upward and contains a small swirl of color (Turmeric orange) suggesting food. A tiny steam wisp rises from the spoon. The handle extends below at a slight angle.
**Gender/Age suggestion**: Non-gendered object avatar

#### Avatar 8: "The Cooking Pot"
**Background color**: Turmeric (#E8913A)
**Description**: No person. The handi/pot shape from App Icon Concept A, rendered in flat illustration style (white outline on Turmeric background). Three steam wisps rise from the top. The pot has a slight friendly quality -- the two handles look like ears, the open top looks like a smile if you squint. Not literally a face, but facelike enough to be endearing.
**Gender/Age suggestion**: Non-gendered object avatar

#### Avatar 9: "The New Neighbor"
**Background color**: Cloud (#F5F7F8), outline in Coriander
**Description**: A person waving with one hand raised, palm open, in a friendly "hello" gesture. Their other arm is at their side. They wear a simple kurta. Expression is warm and slightly tentative (a newcomer's smile). This is the default avatar assigned to all new users before they choose one. Skin tone: medium warm brown.
**Gender/Age suggestion**: Gender-neutral, 30s

#### Avatar 10: "The Tiffin Carrier"
**Background color**: Deep Coriander (#1B5E3A)
**Description**: No person. A three-tier tiffin carrier (same concept as App Icon Concept C) rendered flat. The three tiers are in Turmeric, Light Turmeric, and white, creating a warm gradient stack. The clasp/handle at top is a simple arc in Charcoal. One tier is slightly open, revealing a warm glow inside.
**Gender/Age suggestion**: Non-gendered object avatar

#### Avatar 11: "The Masala Dabba"
**Background color**: Terracotta (#D84315)
**Description**: No person. A top-down view of a round spice box (masala dabba) with its lid removed, showing 6-7 small circular compartments arranged in a ring around a center compartment. Each compartment is filled with a different color representing common spices: Turmeric yellow, Terracotta red (chili), Coriander green, a warm brown (cumin), a golden yellow (mustard), white (salt), and a deep brown center (garam masala). The circular composition fits perfectly in the round avatar crop.
**Gender/Age suggestion**: Non-gendered object avatar

#### Avatar 12: "The Morning Riser"
**Background color**: Light Turmeric (#FFF3E0), outline in Turmeric
**Description**: A person stretching with both arms up, yawning contentedly, eyes as happy curved lines. They wear a simple t-shirt. Behind them, a tiny sun shape (quarter circle) peeks from the bottom corner of the circular avatar frame. The feeling is "just woke up, ready to cook" or "just woke up, ready to find breakfast." Skin tone: deep warm brown. Hair is wrapped in a loose bun or covered with a simple cloth.
**Gender/Age suggestion**: Woman, 30s-40s

### Assignment Logic

- **New users** receive Avatar 9 ("The New Neighbor") by default.
- **After choosing a role**: Cooks are nudged to select from the full set; buyers keep their choice or the default.
- **Avatar selection screen**: All 12 avatars displayed in a 3x4 grid on the profile setup screen, with "Upload your own photo" as the first option (a camera icon in a dashed circle).
- **Object avatars** (6, 7, 8, 10, 11) are useful for users who prefer not to show a person for cultural or personal reasons.

---

## 6. Food Category Icons

These icons appear in the horizontal scrollable category filter on the home feed, in the listing creation form's category picker, and in search filters. They must be legible at 24x24px and attractive at 48x48px.

### Technical Requirements

| Specification | Value |
|---|---|
| Design grid | 24 x 24 px with 2px padding (20x20 active area) |
| Stroke weight | 1.5px consistent (as per brand guide icon system) |
| Corner radius | 2px minimum on all corners |
| Style | Outlined with rounded caps and joins. No fills in default state. |
| Default color | Neutral 700 (#546E7A) |
| Active/selected color | Turmeric (#E8913A) with optional Light Turmeric (#FFF3E0) fill at 30% |
| Format | SVG with `currentColor` for easy theming |
| Variants needed | Default (outlined), Active (Turmeric outlined + light fill), Disabled (Neutral 500) |

### 6.1 Rice and Biryani

**Icon description**: A rounded bowl viewed from a three-quarter angle, filled with a mound of rice that rises above the rim. The rice mound has three small lines on top suggesting the layered texture of biryani (saffron streaks). A single small leaf shape sits on top of the rice mound (bay leaf / tej patta garnish). Two small wisps of steam rise from the left side.

**Key shapes**: Bowl (half-ellipse base + elliptical rim), rice mound (dome curve above rim), three horizontal texture lines on mound, leaf (small pointed ellipse), two steam curves.

**Stroke details**: Bowl outline is 1.5px. Rice mound outline is 1.5px, continuous with the bowl rim. Texture lines inside are 1px (thinner for hierarchy). Steam wisps are 1px with rounded ends. Leaf is 1.5px with a center vein line at 1px.

**What to avoid**: Do not draw individual rice grains. Do not make the bowl look like a Western cereal bowl (too shallow). The bowl should be deeper, more katori-shaped.

### 6.2 Roti and Paratha

**Icon description**: A stack of two circular flatbreads viewed from a slight overhead angle, with the top one partially overlapping the bottom one (offset by about 3px to the upper-right, so both are visible). The top flatbread has three subtle diagonal lines across its surface suggesting the folds/layers of a paratha. A small triangular wedge is cut or folded from the top circle's edge (suggesting a torn piece, which is how rotis are actually eaten).

**Key shapes**: Two overlapping circles (slightly elliptical to suggest overhead perspective), three diagonal lines on top circle, triangular notch on top circle's edge.

**Stroke details**: Both circle outlines at 1.5px. Diagonal fold lines at 1px. The torn-wedge notch is a simple V-shaped negative space in the circle's outline.

**What to avoid**: Do not draw a single flat circle (that could be anything). The stack and the paratha fold lines are what make it identifiable.

### 6.3 Curries

**Icon description**: A wide, shallow bowl (a handi or kadhai shape -- wider at the top, narrower at the base) with two small handles on either side. Inside the bowl, a wavy line suggests the surface of a curry/gravy. Above the bowl, three wisps of steam rise. The overall shape is reminiscent of the Indian kadhai (wok) used for making curries.

**Key shapes**: Kadhai bowl (trapezoid-ish shape, wider top, narrower bottom, curved sides), two small circular handle loops on sides, wavy interior line (curry surface), three steam curves.

**Stroke details**: All outlines at 1.5px. Wavy interior line at 1px. Steam at 1px with rounded ends. Handles are small circles (4px diameter) attached to the bowl sides.

**What to avoid**: Do not use a Western saucepan shape. The kadhai/handi shape is culturally specific and communicates "Indian curry" instantly.

### 6.4 Snacks and Chaat

**Icon description**: A samosa shape as the primary element -- a triangle with slightly curved sides (not a rigid equilateral triangle but an organic, slightly asymmetric one that suggests a hand-folded pastry). Beside the samosa, a small round shape represents a chaat element (a puri or a golgappa). Below both, a tiny zigzag line suggests a paper plate or napkin.

**Key shapes**: Samosa triangle (three curves forming a triangle, with a crimped/ridged line along the longest edge suggesting the sealed seam), small circle (puri/golgappa), zigzag line below (napkin/paper).

**Stroke details**: Samosa outline at 1.5px. The crimped seam along the longest edge is a small zigzag at 1px. Puri circle at 1.5px. Napkin zigzag at 1px.

**What to avoid**: Do not use a generic "plate of food" icon. The samosa silhouette is one of the most recognizable food shapes in Indian cuisine and should be the hero element.

### 6.5 Sweets

**Icon description**: A round ladoo (spherical sweet) in the center, with a subtle cross-hatch texture on its surface suggesting the coconut or besan coating. Below the ladoo, a small rectangular shape represents a piece of barfi (square-cut sweet). The ladoo sits slightly above and in front of the barfi, overlapping it. Small dot accents (2-3 dots) around the ladoo suggest sugar crystals or decorative elements.

**Key shapes**: Circle (ladoo) with light cross-hatch surface texture (4 intersecting lines), rectangle with rounded corners (barfi), 2-3 small dots.

**Stroke details**: Ladoo circle at 1.5px. Cross-hatch interior lines at 0.75px (very subtle). Barfi rectangle at 1.5px. Dots at 1.5px fill.

**What to avoid**: Do not use a cupcake or Western cake icon. Do not use a generic "dessert" concept. Ladoo and barfi are immediately recognizable as Indian sweets.

### 6.6 Beverages

**Icon description**: A cutting chai glass shape -- the distinctive small, tapered glass used at tea stalls across India (wide at the top, narrow at the base, no handle). Inside the glass, a fill line at about 70% height with a subtle meniscus curve suggests the chai level. Above the glass, two small steam wisps. The glass sits on a tiny saucer line.

**Key shapes**: Tapered glass (wider top, narrow base, straight sides with slight outward flare at top), horizontal fill line inside, two steam wisps, horizontal saucer line below.

**Stroke details**: Glass outline at 1.5px. Fill line at 1px. Steam at 1px. Saucer line at 1.5px.

**What to avoid**: Do not use a coffee cup with a handle (too Western). Do not use a tall glass or tumbler. The cutting chai glass is distinctively Indian and immediately sets the right cultural context.

### 6.7 Thali

**Icon description**: A large circle (the thali plate) with 4-5 smaller circles arranged inside along the inner rim (the katoris/bowls). The center of the large circle has a slightly smaller area that is empty or contains a subtle horizontal line (suggesting the space for rice or roti in a real thali). The composition is a top-down view of a thali setup.

**Key shapes**: Large outer circle (plate rim), inner circle (plate base), 4-5 small circles arranged evenly along the space between inner and outer circles (katoris), center area with optional line.

**Stroke details**: Outer circle at 1.5px. Inner circle at 1px. Small katori circles at 1.5px. Center line at 1px.

**What to avoid**: Do not overcrowd the small circles -- at 24px, only 4 katori circles will be legible. 5 is the maximum. This icon has the most geometric precision of any in the set and should feel orderly (a well-set thali is a point of pride).

### 6.8 Other

**Icon description**: Four small dots arranged in a 2x2 grid, each in a slightly different size, enclosed within a rounded square outline. This is the universal "more" / "grid" / "other" pattern, but the varying dot sizes give it slight personality. Below the grid, a subtle horizontal ellipsis (three tiny dots) reinforces "there's more."

**Key shapes**: Rounded square outline, four dots inside (2x2), three-dot ellipsis below.

**Stroke details**: Rounded square at 1.5px, corner radius 4px. Dots at 2px, 2.5px, 2px, 2.5px (subtle size variation). Ellipsis dots at 1px.

**What to avoid**: Do not use a question mark (implies confusion). Do not use a plus sign (implies adding). The grid pattern says "variety" and "more options" without suggesting any specific action.

---

## 7. Background Textures and Patterns

These textures and patterns are used as subtle environmental layers throughout the app -- never as primary visual elements, always as backdrop treatments that add warmth and tactility without competing with content.

### 7.1 Paper Grain Overlay

**Purpose**: Applied over flat-colored backgrounds (Light Turmeric, Cloud, white) to add subtle tactile warmth. Referenced in the brand guide as a 5% opacity overlay on illustrations. Used more broadly as a screen-level texture.

**Technical specifications**:
- Dimensions: 512 x 512 px, seamlessly tileable
- Format: PNG with alpha channel (grain is in the alpha, not the color)
- Application: CSS `background-image` overlaid on solid colors via pseudo-element, `mix-blend-mode: multiply`, `opacity: 0.03-0.05`
- Grain character: Fine, organic, slightly irregular. Mimics the texture of handmade paper (washi or khadi paper), not digital noise. Grain particles are 1-3px, distributed unevenly with natural clustering. Slightly warmer density in the center, lighter at edges (subtle vignette within the tile).
- Color: Monochrome. The alpha channel carries the texture; the overlay div's background-color can be set to Charcoal (#263238) at low opacity for a warm grain, or left transparent for a neutral grain.

**How to generate**: In Photoshop or GIMP, create a 512x512 canvas filled with 50% gray. Apply Filter > Noise > Add Noise (Gaussian, Monochromatic, Amount: 3-5%). Apply Filter > Blur > Gaussian Blur (0.5px). Set the layer to Multiply and reduce opacity. Export as PNG. Alternatively, photograph a sheet of real handmade paper, desaturate, and process into a seamless tile.

**CSS implementation pattern**:
```css
.surface-textured::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/paper-grain.png');
  background-repeat: repeat;
  mix-blend-mode: multiply;
  opacity: 0.04;
  pointer-events: none;
}
```

### 7.2 Kitchen Tile Pattern

**Purpose**: Used as a section background for promotional areas, the "What's Cooking Today" header section, or the about/settings page. Evokes the ceramic tile backsplash common in Indian kitchens without being literal or photographic.

**Technical specifications**:
- Tile unit size: 64 x 64 px, seamlessly tileable in a grid
- Format: SVG (scalable, tiny file size)
- Pattern type: A simple geometric pattern inspired by Indian jali (lattice) screens or basic kolam/rangoli geometry. Not a complex Moroccan-tile-level pattern -- simpler, more restrained.

**Pattern description**: Each 64x64 tile contains a single geometric motif: a rounded diamond (rotated square with rounded corners) centered in the tile. The diamond is outlined (1px stroke) in Mist (#E0E7EA), with the interior empty (transparent). At each corner of the tile (where four tiles meet), a small circle (6px diameter) creates a secondary pattern of dots at the grid intersections. The circles are also Mist-colored.

**Color and opacity**: The pattern is rendered in Mist (#E0E7EA) at 40-50% opacity on a Cloud (#F5F7F8) or white background. The result is extremely subtle -- visible if you look for it, invisible if you don't. The pattern adds depth to large flat areas without introducing visual noise.

**Variation**: For warmer sections (cook profiles, onboarding), the same pattern can be recolored to Light Turmeric (#FFF3E0) at 30% opacity on a white background. Never use Turmeric at full saturation for the tile pattern -- it must remain a background texture, not a foreground element.

**SVG pattern definition**:
```svg
<pattern id="kitchen-tile" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
  <rect x="16" y="16" width="32" height="32" rx="4" transform="rotate(45 32 32)"
        fill="none" stroke="#E0E7EA" stroke-width="1" opacity="0.5"/>
  <circle cx="0" cy="0" r="3" fill="#E0E7EA" opacity="0.4"/>
  <circle cx="64" cy="0" r="3" fill="#E0E7EA" opacity="0.4"/>
  <circle cx="0" cy="64" r="3" fill="#E0E7EA" opacity="0.4"/>
  <circle cx="64" cy="64" r="3" fill="#E0E7EA" opacity="0.4"/>
</pattern>
```

### 7.3 Organic Blob Shapes

**Purpose**: Decorative background elements used to break up rigid rectangular layouts. Appear behind sections, cards, or illustrations as soft, organic accent shapes. They add the "homemade" imperfection that separates GharKa from corporate apps.

**Technical specifications**:
- Format: SVG paths
- Size: Variable (100-400px in largest dimension), always scaled relative to the section they decorate
- Number of blob variants: 5-6 unique shapes, reused across the app with different colors and rotations
- Application: Positioned absolutely behind content, `z-index: -1`, with `transform: rotate()` for variety

**Shape language**: Each blob is an organic, amoeba-like closed shape with no sharp corners. The curves are smooth and continuous (cubic bezier). No blob should be symmetrical -- the irregularity is the point. Think of the shapes formed when pouring batter into a pan, or the silhouette of a spreading spice pile. Each blob has 5-8 control points creating the outline, with curves that flow naturally between them.

**Color application rules**:
- **Behind hero sections**: Light Turmeric (#FFF3E0) blob on white background, or Mint Wash (#E8F5E9) blob on Light Turmeric background.
- **Behind cards**: Cloud (#F5F7F8) blob on white background (barely visible, just adds depth).
- **Behind illustrations**: Turmeric (#E8913A) at 8% opacity, or Coriander (#2E7D52) at 6% opacity.
- **Never**: Full-opacity brand colors. Blobs are environmental, not focal.

**Blob set descriptions**:

1. **"Daal Drop"**: Wide, horizontal blob. Widest in the center, tapers at both ends. Slight downward sag on the right side. Used behind section headers.
2. **"Roti Round"**: Nearly circular but with 3-4 subtle bumps on the perimeter that make it imperfect. Used behind avatar circles and profile sections.
3. **"Spice Splash"**: Elongated vertically with a small secondary bump branching off the upper right. Used behind side panels and vertical card stacks.
4. **"Ghee Pool"**: A very flat, wide ellipse with one edge that dips inward slightly (like a spilled liquid shape). Used as a base/ground element under illustrations.
5. **"Tadka Pop"**: Small and compact with one pronounced bump on top (like a droplet that just splashed). Used as an accent dot behind small elements.
6. **"Chapati Stretch"**: Oblong, wider on one side than the other, with smooth continuous curves. Used behind horizontal scroll areas and carousels.

### 7.4 Gradient Mesh Specifications

**Purpose**: Smooth, multi-point gradients used as full-screen backgrounds for special screens (onboarding, splash, celebration modals) and as hero section backgrounds. These are not simple two-point gradients but multi-stop, multi-directional gradients that create a warm, enveloping atmosphere.

**Gradient definitions**:

#### Gradient A: "Morning Kitchen" (Primary, used for splash and onboarding)
```css
background: linear-gradient(
  135deg,
  #FFF3E0 0%,    /* Light Turmeric -- top left */
  #FFFFFF 35%,    /* White -- center-left */
  #E8F5E9 65%,   /* Mint Wash -- center-right */
  #FFF3E0 100%   /* Light Turmeric -- bottom right */
);
```
**Character**: Warm to fresh to warm. Evokes morning light coming through a kitchen window, catching both the warm wooden counter and the green of herbs on the windowsill.

#### Gradient B: "Warm Welcome" (Used for celebration modals, success states)
```css
background: radial-gradient(
  ellipse at 30% 20%,
  #FFF3E0 0%,    /* Light Turmeric -- origin point */
  #FFFFFF 50%,   /* White -- mid */
  #F5F7F8 100%   /* Cloud -- edges */
);
```
**Character**: A warm glow radiating from the upper-left (where the "light source" lives in the brand's visual language). The glow fades to neutral, keeping the edges clean and letting content breathe.

#### Gradient C: "Evening Warmth" (Used for cook profiles, seller dashboard headers)
```css
background: linear-gradient(
  180deg,
  #E8913A 0%,    /* Turmeric -- top */
  #C47425 40%,   /* Deep Turmeric -- mid */
  #FFF3E0 100%   /* Light Turmeric -- bottom */
);
```
**Character**: A strong-to-subtle warm gradient. The full Turmeric at the top establishes brand presence; the fade to Light Turmeric at the bottom lets text and cards sit comfortably. Used sparingly -- this is the boldest gradient in the system.

#### Gradient D: "Trust Foundation" (Used for community verification sections, trust badges)
```css
background: linear-gradient(
  160deg,
  #E8F5E9 0%,    /* Mint Wash -- top */
  #FFFFFF 50%,   /* White -- center */
  #F5F7F8 100%   /* Cloud -- bottom */
);
```
**Character**: Cool and clean, anchored in the secondary green family. Used where trust signals are presented (community verification, ratings sections). The green is so muted it reads as "clean" rather than "green."

#### Gradient E: "Dark Mode Hero" (Used for dark mode splash, onboarding dark variant)
```css
background: linear-gradient(
  135deg,
  #263238 0%,    /* Charcoal -- top left */
  #1B2A30 50%,   /* Darker Charcoal -- center */
  #2E3D44 100%   /* Slightly lighter Charcoal -- bottom right */
);
```
**Character**: A subtle variation within the dark spectrum. Never pure black (#000000). The slight directional shift prevents the dark background from feeling flat.

**Usage rules**:
- Never apply gradients to interactive elements (buttons, cards, inputs).
- Gradients are for page/section backgrounds only.
- No animated gradients. Stillness is sophistication.
- In dark mode, only Gradient E is used. All other gradients map to the dark palette.

---

## 8. Photography Style Guide

Food photos are the single most important visual in GharKa. They are uploaded by home cooks (not professional photographers), so the style guide must define both the ideal aesthetic and the realistic processing the app applies to normalize user-submitted photos.

### 8.1 The GharKa Photography Aesthetic

**In one sentence**: "A home cook's best photo, taken with care but without a studio."

The photos should look like what happens when someone who loves their food takes a picture of it with a good phone, near a window, on their actual kitchen counter. Not a food blogger's meticulously styled flat lay. Not a restaurant menu's studio-lit hero shot. Somewhere in between: intentional but authentic.

**Reference photographers and styles** (for mood board, not for literal replication):
- **David Loftus** (Jamie Oliver's photographer): Natural light, real kitchens, slightly imperfect compositions that feel candid
- **Indian food Instagram accounts** like @maboroshi_kitchen, @ministryofcurry: Warm tones, real props, overhead and 45-degree angles, wooden and steel surfaces
- **Kodak Portra 400 film stock aesthetic**: Warm highlights, slightly lifted shadows, gentle grain, muted but rich colors. NOT the oversaturated "food delivery app" look.

### 8.2 Lighting Direction

**Ideal**: Natural daylight, indirect. The light source should be visible in its effect (directional shadows, highlight on one side of a dish) but the source itself should never be in frame.

**Best directions**:
1. **Side lighting (45 degrees from left or right)**: Creates dimension on the food surface. Curries glisten. Rice grains cast tiny shadows. Roti surfaces show their texture. This is the gold standard for food photography and the direction cooks should be nudged toward.
2. **Overhead (directly above)**: Works for flat-lay compositions (thali setups, a spread of multiple dishes). Eliminates cast shadows but can flatten texture. Best for colorful, multi-item shots.
3. **Backlight (from behind the dish)**: Creates rim lighting and makes steam visible. Beautiful for beverages (chai glowing from behind) and soups/dals. Can silhouette the front of the dish if not balanced with a reflective surface in front.

**What to avoid**:
- Direct flash from the phone. Kills texture, creates harsh white hotspots on glossy curries, makes food look flat and clinical. The app should detect flash-lit photos (high contrast ratio, centralized hotspot) and gently suggest: "This photo might look better in natural light. Want to retake it?"
- Direct overhead fluorescent tube lighting. Creates a greenish cast common in Indian kitchens. The app's warm-tint post-processing (see 8.5) partially corrects this.
- Mixed lighting (window light + tube light). Creates competing color temperatures (warm + cool) that confuse the eye. No amount of post-processing fixes this elegantly.

### 8.3 Background and Surface Context

**Ideal backgrounds**:
- **Wooden surface**: A real wooden table, cutting board, or chakla (rolling board). Warm wood tones complement Indian food colors. The grain of the wood adds texture without competing.
- **Indian steel surface**: A clean steel thali, steel counter, or the top of a steel container. Culturally authentic and creates appealing reflections.
- **Granite or stone counter**: Common in Indian kitchens. Dark granite creates excellent contrast with lighter foods (rice, rotis). Light granite works for darker curries.
- **Fabric**: A simple cotton cloth (a kitchen towel, a clean tea towel, or a piece of plain fabric) in a neutral or warm color. NOT a tablecloth with busy patterns.
- **Banana leaf**: For South Indian food, a banana leaf is the ideal surface. Its green adds freshness and is immediately culturally recognizable.

**What to avoid as backgrounds**:
- **Plain white studio backdrop**: Too clinical, too "stock photo." Food from a home kitchen should show the kitchen.
- **Busy patterned tablecloths**: Competes with the food. A small section of pattern is fine; a full-frame busy print is not.
- **Cluttered kitchen counters**: The background should be intentional. A gas stove burner in the background is charming. A pile of dirty dishes is not.
- **Phone screen or app visible**: No meta-photography. The photo is of the food, not of someone using GharKa.

### 8.4 Composition Guidelines

**For in-app tips shown on the upload screen (simplified for non-photographers)**:

1. **Fill the frame**: The dish should occupy 60-80% of the photo. Do not photograph a small bowl in the center of a large table from far away.
2. **One hero, one or two props**: The main dish is the focus. A cup of chai beside a plate of snacks adds context. A spoon, a napkin, a small bowl of chutney -- these are acceptable supporting elements. More than two props and the composition becomes cluttered.
3. **Rule of thirds**: Place the dish slightly off-center. Not exactly in the middle, not crammed into a corner. This is the one composition rule that applies universally and is worth nudging cooks toward.
4. **Angle**: Either 45 degrees (the "eating angle" -- how you see food when you sit down to eat) or directly overhead (90 degrees -- the "flat lay" angle). Avoid extreme low angles (food does not look appetizing from below).

**App-side crop**:
- Feed cards: 4:3 aspect ratio, 8px border-radius on top corners (matching card radius per brand guide)
- Detail view: Full-width, 16:9 or original aspect ratio, gentle parallax scroll
- Avatar/thumbnail: 1:1 square crop, center-weighted

### 8.5 Color Treatment (App-Side Post-Processing)

Per the brand guide (Section 4.2): "Apply a barely perceptible warm tint (+2% warmth in post-processing) to normalize photos taken under different lighting conditions."

**Exact specifications for the image processing pipeline**:

| Adjustment | Value | Purpose |
|---|---|---|
| Color temperature | +150K (shift toward warm) | Counteracts cool fluorescent lighting common in Indian homes |
| Saturation | +3% | Very subtle. Adds just enough to make curries and vegetables pop. NOT the +20% saturation of food delivery apps. |
| Contrast | +2% | Marginally lifts the tonal range without crushing shadows |
| Shadows | +5% lift | Prevents dark areas (common in phone photos) from going fully black |
| Highlights | -3% recovery | Prevents blown-out white hotspots on steel plates and glossy surfaces |
| Vignette | 0% | No vignette. Vignettes look like filters, and GharKa does not apply filters. |
| Grain | 0% | No added grain. The paper-grain texture overlay on the UI provides enough tactile warmth. |
| Sharpening | +10% (output sharpening) | Compensates for slight softness in phone photos, especially after resize/compression. Applied at the end of the pipeline. |

**Implementation**: These adjustments are applied server-side during image upload processing (Sharp.js or similar), saved as the "display" version. The original unmodified photo is always preserved. The processing is invisible to the user -- no "filter" UI, no before/after. The feed simply looks cohesive.

### 8.6 What to Avoid (Anti-Patterns for Cook Education)

The following should be addressed through gentle, encouraging tips on the photo upload screen -- never as error messages or rejections.

| Anti-Pattern | Why It Is Bad | Suggested Nudge Copy |
|---|---|---|
| Flash photography | Kills texture, creates hotspots, makes food look clinical | "Natural light makes food look its best. Try near a window?" |
| Heavy phone filters | Instagram-style filters distort color, making food look unnatural | "We keep your food looking real -- no filters needed." |
| Extreme overhead on deep bowls | Shows only the surface of curries/dals, hiding the depth and richness | "Try holding your phone at an angle to show the whole dish." |
| Multiple dishes in one photo | Confuses the listing (which dish is being sold?) | "One dish per photo works best. You can add more photos of the same dish." |
| Hands in frame without intent | Accidental fingers at frame edge, partial hand shadows | (No nudge needed -- this is minor and adds authenticity) |
| Text overlays or watermarks | Looks like a forwarded WhatsApp image, not original content | "Is this your own photo? Listings with original photos get 3x more interest." |
| Screenshots of other food apps | Attempting to use someone else's food photo | Automated detection + "This looks like a screenshot. Upload a photo of your actual dish to build trust with neighbors." |

### 8.7 Placeholder Image for No-Photo Listings

Per the brand guide: when a cook lists food without uploading a photo, the listing card shows a branded placeholder.

**Description**: A warm, minimal illustration of a plate with gentle steam rising from it. The plate is the same thali shape used in the app icon and 3D model -- a circle with a raised rim. The steam is three soft curves. Below the plate, text in Caveat (handwritten font) reads: "No photo yet." The entire illustration sits on a Light Turmeric (#FFF3E0) background with the paper-grain overlay.

**Technical specifications**:
- Size: 600 x 450 px (4:3 to match card crop)
- Format: SVG (embedded in the component, not a separate file download)
- The cook's name is dynamically inserted: "No photo yet -- ask [Name] about this dish" as a text layer below the illustration, in Inter 400, 12px, Neutral 500 color

**AI Image Generation Prompt (for reference)**:

```
Minimal flat vector illustration of an Indian steel thali plate with
three gentle steam wisps rising from it, centered on a warm cream
(#FFF3E0) background with subtle paper grain texture, the plate is
simple and outlined in light gray, steam in white at low opacity,
warm and inviting feeling, no food on the plate, no text in the
illustration itself, clean and minimal, suitable as a placeholder
image for a food listing card, 600x450 composition
```

---

## Appendix A: Asset Delivery Checklist

Before development begins on any screen, verify these assets exist:

| Screen | Required Assets | Status |
|---|---|---|
| Splash / Loading | App icon (all sizes), loading pot animation (Lottie) | Pending |
| Onboarding Slide 1 | "Discover" illustration (@1x, @2x, @3x), optional Lottie | Pending |
| Onboarding Slide 2 | "Connect" illustration (@1x, @2x, @3x), optional Lottie | Pending |
| Onboarding Slide 3 | "Trust" illustration (@1x, @2x, @3x), optional Lottie | Pending |
| Home Feed | 8 food category icons (SVG), paper-grain texture (PNG), kitchen-tile pattern (SVG) | Pending |
| Home Feed (empty) | "No listings" empty state illustration (SVG) | Pending |
| Listing Card | Food placeholder illustration (SVG), organic blob decorative shapes (SVG) | Pending |
| My Orders (empty) | "No orders" empty state illustration (SVG) | Pending |
| My Listings (empty) | "No listings (cook)" empty state illustration (SVG) | Pending |
| Chat (empty) | "No messages" empty state illustration (SVG) | Pending |
| Search (no results) | "No results" empty state illustration (SVG) | Pending |
| Location prompt | "Location not shared" empty state illustration (SVG) | Pending |
| Profile setup | 12 default avatars (SVG + PNG @2x), camera upload icon | Pending |
| Landing page hero | 7 GLTF/GLB models, steam sprite texture, scene component | Pending |
| Global | Paper-grain texture, 6 organic blob SVGs, 5 gradient CSS definitions | Pending |

## Appendix B: File Naming Convention

All asset files follow this naming pattern:

```
{category}-{name}-{variant}.{format}

Examples:
icon-app-1024.png
icon-app-192.png
icon-category-rice-default.svg
icon-category-rice-active.svg
illustration-onboarding-discover.svg
illustration-onboarding-discover@2x.png
illustration-empty-no-listings.svg
illustration-empty-no-orders.svg
avatar-default-biryani-aunty.svg
avatar-default-chef-hat.svg
model-thali-plate.glb
model-katori-bowl.glb
texture-paper-grain.png
texture-kitchen-tile.svg
shape-blob-daal-drop.svg
shape-blob-roti-round.svg
placeholder-food-no-photo.svg
```

## Appendix C: AI Generation Platform Notes

When using the prompts in this document to generate reference images or final assets:

| Platform | Optimization Notes |
|---|---|
| **Midjourney** | Append `--ar 3:2` for onboarding illustrations, `--ar 1:1` for avatars. Use `--style raw` for flat illustrations (avoids over-rendering). Add `--no photorealistic, 3d render, gradient` to keep the flat style. Version 6+ recommended. |
| **DALL-E 3** | Natural language prompts work best. Be explicit about "flat vector illustration style" to avoid photorealistic output. Specify "no text in image" explicitly -- DALL-E tends to add text. |
| **Stable Diffusion (SDXL)** | Use a flat-illustration LoRA if available. Negative prompt: "photorealistic, 3d, gradient, shadow, text, watermark, signature." CFG scale: 7-9 for flat illustrations. |
| **Flux** | Strong with detailed natural language descriptions. Emphasize "clean flat vector style" and "limited color palette" in every prompt. Good at maintaining color consistency when hex codes are specified. |

**Post-generation workflow**: AI-generated images are reference material, not final assets. Final SVG assets should be hand-traced or recreated in Figma/Illustrator using the AI output as a visual guide, ensuring pixel-perfect alignment with the brand's 1.5px stroke weight, exact hex colors, and consistent character proportions across all illustrations.

---

**End of Visual Asset Guide -- Version 1.0**

*This document is the single source of truth for all visual asset specifications in GharKa. It should be read alongside the [Brand Guide](./BRAND_GUIDE.md) for color, typography, and voice context, and the [Master Architecture](./MASTER_ARCHITECTURE.md) for technical implementation constraints. Any deviation requires explicit approval and should be reflected in an updated version of this guide.*
