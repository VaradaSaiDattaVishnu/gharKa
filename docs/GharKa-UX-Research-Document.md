# GharKa -- UX Research & Information Architecture Document

**Document Version**: 1.0
**Date**: 2026-05-08
**Researcher**: UX Research Agent
**Product**: GharKa -- Community Food-Sharing App for Gated Communities

---

## Table of Contents

1. [Research Overview](#1-research-overview)
2. [User Personas](#2-user-personas)
3. [Information Architecture](#3-information-architecture)
4. [Complete User Flows](#4-complete-user-flows)
5. [Screen Inventory](#5-screen-inventory)
6. [Interaction Patterns](#6-interaction-patterns)
7. [Behavioral Nudge Placement](#7-behavioral-nudge-placement)
8. [Simplicity Audit](#8-simplicity-audit)
9. [Accessibility Considerations](#9-accessibility-considerations)
10. [Research Recommendations & Next Steps](#10-research-recommendations--next-steps)

---

## 1. Research Overview

### 1.1 Product Context

GharKa replaces the informal WhatsApp food-sharing groups that already exist in Indian gated communities. The core insight: people already buy home-cooked food from neighbors -- they just lack a purpose-built tool. The app must feel as easy as sending a WhatsApp message but look like a premium food brand.

### 1.2 Design Tensions

| Tension | Resolution Strategy |
|---|---|
| Extreme simplicity vs. visual grandeur | Three.js animations reserved for non-blocking moments (splash, empty states, celebrations). Core flows remain tap-and-go. |
| No payment gateway vs. trust | Social proof, ratings, and transparent seller profiles replace transactional guarantees. |
| Three distinct roles vs. one unified experience | Tab bar adapts based on role. Shared shell, role-specific content. |
| 5km radius constraint vs. discovery | Location is set once and operates silently. No manual radius controls. |
| No food safety guarantee vs. user confidence | Disclaimers are honest but non-alarming. Community moderation and reporting carry the trust burden. |

### 1.3 Core Design Principles

1. **Three-tap ceiling**: Every primary action completes in 3 taps or fewer from the home screen.
2. **Zero-learning curve**: If a user can order food on WhatsApp, they can use GharKa. No tutorials required for core actions.
3. **Progressive disclosure**: Complexity appears only when the user asks for it.
4. **Trust through transparency**: Seller identity, food photos, neighbor reviews -- all visible upfront.
5. **Grandeur in the margins**: Visual polish lives in transitions, micro-animations, and empty states -- never blocking user progress.

---

## 2. User Personas

### 2.1 Primary Persona: The Buyer -- "Priya"

**Profile**

| Attribute | Detail |
|---|---|
| Age | 28-40 |
| Occupation | IT professional, dual-income household |
| Location | Gated community apartment, Tier 1/2 Indian city |
| Tech proficiency | High (daily Swiggy/Zomato user, WhatsApp power user) |
| Devices | Android phone (primary), occasionally iPhone |
| Language | English + regional language |

**Behavioral Patterns**
- Orders food 3-5 times per week from delivery apps but craves home-cooked variety.
- Already participates in apartment WhatsApp food groups but finds them chaotic -- messages get buried, no structure.
- Makes food decisions in under 30 seconds. If the photo looks good and the price is right, she orders.
- Shops for food between 10:00 AM and 12:00 PM (planning lunch/dinner) and again at 5:00 PM to 7:00 PM (evening snacks/dinner).
- Trusts neighbor recommendations far more than anonymous online reviews.

**Goals**
- Find home-cooked food fast without scrolling through 50 WhatsApp messages.
- Know exactly what is available right now, not yesterday's stale listing.
- Communicate pickup/delivery details without phone-tag.

**Pain Points**
- WhatsApp groups have no search, no categorization, no order tracking.
- Cannot tell if a listing is still available or already sold out.
- Feels awkward negotiating price or asking logistics questions in a group chat visible to 200 people.

**Decision Factors**
- Food photo quality (the single biggest conversion driver).
- Price relative to Swiggy/Zomato equivalents.
- Seller's proximity within the community.
- Number and recency of positive ratings.

**Quote from analogous user research**
> "I know Lakshmi aunty on the 3rd floor makes amazing biryani every Friday. But by the time I see her WhatsApp message, it is already sold out. I need to know the moment she posts."

---

### 2.2 Primary Persona: The Seller -- "Lakshmi"

**Profile**

| Attribute | Detail |
|---|---|
| Age | 35-55 |
| Occupation | Homemaker, part-time home cook |
| Location | Same gated community |
| Tech proficiency | Moderate (comfortable with WhatsApp, camera, UPI payments) |
| Devices | Mid-range Android phone |
| Language | Regional language primary, basic English |

**Behavioral Patterns**
- Cooks in batches. Decides what to sell based on what she is already cooking for her family.
- Posts to WhatsApp with a photo and a price. No structured listing process.
- Manages orders mentally or on paper. Loses track when volume exceeds 5-6 orders.
- Prefers cash or direct UPI transfer. Does not want a middleman handling her money.
- Cooks in morning hours, lists by 10:00 AM, fulfills orders by 1:00 PM for lunch.

**Goals**
- Earn a steady side income (INR 10,000-30,000/month) from cooking she is already doing.
- Reach more buyers than her current WhatsApp circle.
- Manage orders without confusion -- know who ordered what, how many portions left.

**Pain Points**
- WhatsApp messages pile up. She cannot tell who confirmed vs. who was just asking.
- No way to mark "sold out" -- keeps getting messages after food is gone.
- Has to manually track payments. Sometimes forgets who paid.
- Feels undervalued -- no reviews, no reputation, no way to grow her brand.

**Decision Factors**
- Listing must take under 60 seconds (she is mid-cooking when she posts).
- Needs clear order count visibility at a glance.
- Wants to feel like a professional, not just someone selling leftovers.

**Quote from analogous user research**
> "I make 20 plates of idli on Sunday. I post in the group, then my phone does not stop buzzing. I do not know who is confirmed and who is just asking. By noon I am stressed, not happy."

---

### 2.3 Secondary Persona: The Admin -- "Rajesh"

**Profile**

| Attribute | Detail |
|---|---|
| Age | 30-50 |
| Occupation | Community association secretary or appointed moderator |
| Tech proficiency | High |
| Devices | Phone + occasionally laptop/tablet |

**Behavioral Patterns**
- Checks the app 1-2 times daily, not continuously.
- Acts on reports and flags rather than proactively scanning every listing.
- Values efficiency -- wants a dashboard that surfaces problems, not one that requires hunting.

**Goals**
- Keep the community food marketplace trustworthy and conflict-free.
- Handle disputes quickly without getting personally involved.
- Maintain food quality standards through community norms, not policing.

**Pain Points**
- No visibility into who is selling what in current WhatsApp groups.
- Cannot enforce basic hygiene or quality standards without a formal system.
- Complaint resolution happens through side-chats and is exhausting.

**Quote**
> "I do not want to be the food police. I just want a simple way to handle the one or two bad situations that come up each month."

---

## 3. Information Architecture

### 3.1 Role-Adaptive Tab Structure (Mobile)

The bottom tab bar adapts based on the user's selected role. This is the single most important architectural decision -- it keeps the interface simple for each role while supporting users who both buy and sell.

```
BUYER TABS (4 tabs)
+----------+------------+---------+-----------+
|   Home   | My Orders  |  Chat   |  Profile  |
+----------+------------+---------+-----------+

SELLER TABS (4 tabs)
+----------+------------+---------+-----------+
|   Home   | My Listings|  Chat   |  Profile  |
+----------+------------+---------+-----------+

BOTH (Buyer + Seller) TABS (5 tabs)
+----------+------------+--------------+---------+-----------+
|   Home   | My Orders  | My Listings  |  Chat   |  Profile  |
+----------+------------+--------------+---------+-----------+

ADMIN TABS (separate interface)
+------------+-----------+-----------+-----------+
| Dashboard  |  Users    | Listings  |  Settings |
+------------+-----------+-----------+-----------+
```

**Rationale for 4-5 tabs maximum**: Research on mobile navigation shows that beyond 5 tabs, discoverability drops and tap accuracy suffers, especially for users with lower tech proficiency (Lakshmi persona). The "Add Listing" action is NOT a tab -- it is a floating action button (FAB) on the Seller's Home and My Listings screens, because it is a creation action, not a navigation destination.

### 3.2 Complete Site Map

```
ROOT
|
+-- Onboarding (linear, one-time)
|   +-- Splash Screen
|   +-- Intro Carousel (3 slides)
|   +-- Phone Number Input
|   +-- OTP Verification
|   +-- Name + Avatar Setup
|   +-- Location Permission
|   +-- Role Selection
|
+-- Home (Buyer View)
|   +-- Food Grid (within 5km)
|   +-- Search Bar (inline, top)
|   +-- Filter Bottom Sheet
|   |   +-- Category Filter
|   |   +-- Price Range
|   |   +-- Availability (Available Now toggle)
|   |   +-- Sort (Nearest / Newest / Price)
|   +-- Food Detail Screen
|   |   +-- Seller Mini-Profile
|   |   +-- "I Want This" Action
|   |   +-- Quantity Selector (bottom sheet)
|   |   +-- Similar Items Section
|   +-- Seller Profile Screen (from food detail)
|       +-- Active Listings
|       +-- Ratings & Reviews
|       +-- Distance Badge
|
+-- Home (Seller View)
|   +-- My Active Listings (cards)
|   +-- Quick Stats Bar (orders today, items sold)
|   +-- Recent Orders Feed
|   +-- [FAB] Add New Listing
|       +-- Photo Capture/Upload
|       +-- Title Input
|       +-- Description Input
|       +-- Category Picker (bottom sheet)
|       +-- Price Input
|       +-- Quantity Input
|       +-- Availability Window (optional)
|       +-- Preview Screen
|       +-- Publish Confirmation
|
+-- My Orders (Buyer)
|   +-- Active Orders Tab
|   |   +-- Order Card (status, seller, item, time)
|   |   +-- Order Detail Screen
|   |       +-- Status Timeline
|   |       +-- Chat Shortcut
|   |       +-- Mark as Picked Up
|   |       +-- Rate & Review (post-pickup)
|   +-- Past Orders Tab
|       +-- Order History Cards
|       +-- Reorder Action
|
+-- My Listings (Seller)
|   +-- Active Listings Tab
|   |   +-- Listing Card (orders count, remaining qty)
|   |   +-- Listing Detail/Edit
|   |   +-- Mark as Sold Out
|   |   +-- View Orders for This Listing
|   +-- Past Listings Tab
|       +-- Listing History
|       +-- Relist Action
|
+-- Chat
|   +-- Conversations List
|   +-- Chat Thread
|       +-- Order Context Card (pinned at top)
|       +-- Text Messages
|       +-- Quick Reply Suggestions
|       +-- Status Update Chips (Picked Up, On the Way, etc.)
|
+-- Profile
|   +-- Name & Avatar (editable)
|   +-- Phone Number (display only)
|   +-- Role Toggle (Buyer/Seller/Both)
|   +-- My Ratings (if seller)
|   +-- Location Settings
|   +-- Notification Preferences
|   +-- Help & Support
|   +-- About GharKa
|   +-- Logout
|
+-- Admin Panel
|   +-- Dashboard
|   |   +-- Active Users Count
|   |   +-- Listings Today
|   |   +-- Orders Today
|   |   +-- Pending Reports
|   +-- User Management
|   |   +-- User List (search, filter)
|   |   +-- User Detail (activity, listings, orders)
|   |   +-- Suspend/Warn Actions
|   +-- Listing Moderation
|   |   +-- Flagged Listings Queue
|   |   +-- All Listings (search, filter)
|   |   +-- Remove/Hide Actions
|   +-- Reports & Disputes
|   |   +-- Report Queue
|   |   +-- Report Detail
|   |   +-- Resolution Actions
|   +-- Community Settings
|       +-- Allowed Categories
|       +-- Community Guidelines Text
|       +-- Announcement Push
```

### 3.3 Navigation Depth Analysis

| Action | Tap Count from Home | Path |
|---|---|---|
| Browse food | 0 | Already on Home |
| View food detail | 1 | Home > tap card |
| Place an order | 2 | Home > tap card > "I Want This" |
| Open chat with seller | 3 | Home > tap card > "I Want This" > chat opens |
| Add a new listing | 1 | Home (seller) > tap FAB |
| Publish a listing | 3 | FAB > fill form > preview > publish |
| Check order status | 1 | My Orders tab > visible on card |
| Mark sold out | 2 | My Listings tab > tap card > "Sold Out" |
| View seller profile | 2 | Home > tap card > tap seller name |
| Change role | 2 | Profile tab > Role toggle |
| Search food | 1 | Home > tap search bar (always visible) |
| Filter food | 2 | Home > tap filter icon > select filters |

Every primary action completes within the 3-tap ceiling.

---

## 4. Complete User Flows

### 4.1 First-Time Onboarding Flow

This is the only linear flow in the app. Every other flow is non-linear and user-directed.

```
SCREEN 1: Splash Screen
+----------------------------------+
|                                  |
|     [Three.js Animation:        |
|      Warm kitchen scene with    |
|      floating food elements     |
|      morphing into the          |
|      GharKa logo]               |
|                                  |
|         GharKa                   |
|   "Ghar ka khana, padosi se"    |
|                                  |
|     Auto-advances in 2.5s       |
+----------------------------------+
Duration: 2.5 seconds, auto-advance
Purpose: Brand impression, emotional warmth
Three.js element: Warm-toned particle animation that coalesces into the logo

SCREEN 2: Intro Carousel -- Slide 1 of 3
+----------------------------------+
|                                  |
|   [Illustration: Neighbor       |
|    handing food over fence]     |
|                                  |
|   "Your neighbors cook          |
|    amazing food"                 |
|                                  |
|   Discover homemade dishes      |
|   from cooks in your            |
|   community                     |
|                                  |
|   [ o  .  . ]                   |
|                                  |
|   [    Next    ]                |
|   Skip                          |
+----------------------------------+

SCREEN 3: Intro Carousel -- Slide 2 of 3
+----------------------------------+
|                                  |
|   [Illustration: Phone with     |
|    food photos and chat]        |
|                                  |
|   "Order with a single tap"     |
|                                  |
|   See what is available,        |
|   tap to order, chat to         |
|   coordinate                    |
|                                  |
|   [ .  o  . ]                   |
|                                  |
|   [    Next    ]                |
|   Skip                          |
+----------------------------------+

SCREEN 4: Intro Carousel -- Slide 3 of 3
+----------------------------------+
|                                  |
|   [Illustration: Cook with      |
|    phone, happy customers]      |
|                                  |
|   "Cook? Earn from your         |
|    kitchen"                      |
|                                  |
|   List your dishes, get         |
|   orders from neighbors,        |
|   earn on your schedule         |
|                                  |
|   [ .  .  o ]                   |
|                                  |
|   [  Get Started  ]            |
+----------------------------------+

SCREEN 5: Phone Number Input
+----------------------------------+
|                                  |
|   GharKa                        |
|                                  |
|   Enter your phone number       |
|                                  |
|   +91  [__________]             |
|                                  |
|   We will send you a            |
|   one-time code                 |
|                                  |
|   [  Send OTP  ]               |
|                                  |
|   By continuing, you agree      |
|   to our Terms & Privacy Policy |
+----------------------------------+
Validation: 10-digit Indian mobile number
Error state: "Please enter a valid 10-digit number"
Auto-format: Spaces after 5 digits (98765 43210)

SCREEN 6: OTP Verification
+----------------------------------+
|                                  |
|   [<- Back]                     |
|                                  |
|   Enter the code sent to        |
|   +91 98765 43210               |
|                                  |
|   [ _ ] [ _ ] [ _ ] [ _ ]      |
|                                  |
|   Auto-reading SMS...           |
|                                  |
|   Did not receive it?           |
|   [Resend in 28s]              |
|                                  |
+----------------------------------+
Behavior: Auto-read OTP from SMS (Android). Manual entry on iOS.
Auto-submit on 4th digit entry.
Resend timer: 30 seconds.
Error state: "Incorrect code. Please try again." with shake animation.
Max retries: 3 before cooldown.

SCREEN 7: Name + Avatar Setup
+----------------------------------+
|                                  |
|   Almost there!                 |
|                                  |
|   [  Default Avatar Circle  ]   |
|   [  Tap to choose  ]          |
|                                  |
|   What should we call you?      |
|   [__________________________]  |
|                                  |
|   This is how your neighbors    |
|   will see you                  |
|                                  |
|   [  Continue  ]               |
+----------------------------------+
Avatar options: 12 pre-designed illustrated avatars (diverse, warm, friendly).
No camera/upload (keeps it simple and avoids privacy concerns).
Name: Free text, 2-30 characters, no special characters.
Validation: Name is required. Avatar defaults to a random one if not chosen.

SCREEN 8: Location Permission
+----------------------------------+
|                                  |
|   [Illustration: Map pin        |
|    on a community layout]       |
|                                  |
|   Find food near you            |
|                                  |
|   GharKa uses your location     |
|   to show food available        |
|   within your community         |
|                                  |
|   [  Allow Location  ]         |
|                                  |
|   Your exact address is         |
|   never shown to others         |
+----------------------------------+
Triggers OS-level location permission dialog.
If denied: Show manual community/area selector as fallback.
Privacy reassurance is critical here -- research shows 30-40% of Indian users
hesitate on location permissions without explicit privacy explanation.

SCREEN 9: Role Selection
+----------------------------------+
|                                  |
|   How will you use GharKa?      |
|                                  |
|   +---------------------------+ |
|   | [Food plate icon]         | |
|   | I want to BUY             | |
|   | homemade food             | |
|   +---------------------------+ |
|                                  |
|   +---------------------------+ |
|   | [Cooking pot icon]        | |
|   | I want to SELL            | |
|   | my cooking                | |
|   +---------------------------+ |
|                                  |
|   +---------------------------+ |
|   | [Both icons]              | |
|   | I want BOTH               | |
|   +---------------------------+ |
|                                  |
|   You can change this later     |
|   in your profile               |
|                                  |
+----------------------------------+
Selection: Single tap, card highlights with animation.
"You can change this later" reduces decision anxiety.
After selection: Navigate directly to role-appropriate Home screen.
```

**Onboarding Flow Summary**

| Step | Screen | Required Action | Time Estimate |
|---|---|---|---|
| 1 | Splash | None (auto) | 2.5s |
| 2-4 | Intro slides | Swipe/tap (skippable) | 10-15s |
| 5 | Phone input | Type number | 8-12s |
| 6 | OTP verify | Auto-read or type 4 digits | 5-15s |
| 7 | Name + Avatar | Type name, optional avatar pick | 10-15s |
| 8 | Location | Tap allow | 3-5s |
| 9 | Role select | Single tap | 3-5s |

**Total onboarding time: 45-75 seconds**

---

### 4.2 Buyer Flow: Discovering and Ordering Food

```
ENTRY POINT: Home Screen (Buyer)
+----------------------------------+
|  GharKa          [bell] [search]|
|                                  |
|  [Search: What are you          |
|   craving today?]               |
|                                  |
|  [Veg] [Non-Veg] [Snacks]      |
|  [Meals] [Sweets] [Drinks]     |
|  (horizontal scroll chips)      |
|                                  |
|  Available Now                   |
|  +------------+ +------------+  |
|  | [Photo]    | | [Photo]    |  |
|  | Dal Makhani| | Chicken    |  |
|  | Lakshmi A. | | Biryani    |  |
|  | Rs 80/plate| | Meena K.   |  |
|  | 0.3 km     | | Rs 150     |  |
|  | 4.5 stars  | | 0.8 km     |  |
|  +------------+ +------------+  |
|                                  |
|  +------------+ +------------+  |
|  | [Photo]    | | [Photo]    |  |
|  | Idli       | | Samosa     |  |
|  | ...        | | ...        |  |
|  +------------+ +------------+  |
|                                  |
| [Home] [Orders] [Chat] [Profile]|
+----------------------------------+

INTERACTION: Tap on food card

SCREEN: Food Detail
+----------------------------------+
|  [<- Back]             [share]  |
|                                  |
|  [    Large food photo         ]|
|  [    (swipeable if multiple)  ]|
|                                  |
|  Dal Makhani                    |
|  Rs 80 per plate                |
|                                  |
|  +--[Lakshmi A. avatar]-------+|
|  | Lakshmi Aunty   4.5 stars  ||
|  | 0.3 km away     12 sold    ||
|  +-----------------------------+|
|                                  |
|  "Made with fresh cream and     |
|  slow-cooked dal. Mild spice.   |
|  Comes with 2 rotis."          |
|                                  |
|  Available: 6 plates left       |
|  Category: Meals > North Indian |
|                                  |
|  Similar nearby                 |
|  [card] [card] [card] (scroll) |
|                                  |
|  [    I Want This    ]          |
+----------------------------------+

INTERACTION: Tap "I Want This"

BOTTOM SHEET: Quantity Selection
+----------------------------------+
|                                  |
|  How many plates?               |
|                                  |
|   [ - ]    2    [ + ]           |
|                                  |
|  Total: Rs 160                  |
|                                  |
|  Note to seller (optional)      |
|  [Less spicy please]           |
|                                  |
|  [  Confirm Order  ]           |
|                                  |
|  Pay Rs 160 directly to        |
|  seller (cash or UPI)          |
+----------------------------------+

INTERACTION: Tap "Confirm Order"

SCREEN: Order Confirmed (momentary overlay)
+----------------------------------+
|                                  |
|  [Three.js: Checkmark with     |
|   warm particle burst]         |
|                                  |
|   Order placed!                 |
|                                  |
|   Chat with Lakshmi to          |
|   arrange pickup or delivery    |
|                                  |
|  [  Chat Now  ]  [  Later  ]   |
|                                  |
+----------------------------------+

TRANSITION: "Chat Now" opens chat thread with order context pinned.

SCREEN: Chat with Seller
+----------------------------------+
|  [<- Back]  Lakshmi Aunty       |
|                                  |
|  +-----------------------------+|
|  | ORDER CONTEXT (pinned)      ||
|  | 2x Dal Makhani - Rs 160    ||
|  | Status: Preparing           ||
|  | [View Order Details]        ||
|  +-----------------------------+|
|                                  |
|  [Lakshmi]: Hi! I will have    |
|  it ready by 12:30 PM.         |
|  Pickup from my door?          |
|                                  |
|  [You]: Yes, that works!       |
|                                  |
|  [Quick replies:]              |
|  [On my way] [Running late]    |
|  [Where to pick up?]           |
|                                  |
|  [Type a message...] [Send]    |
+----------------------------------+

INTERACTION: After pickup, buyer taps status chip or order detail

BOTTOM SHEET: Confirm Pickup
+----------------------------------+
|                                  |
|  Did you pick up your order?    |
|                                  |
|  2x Dal Makhani from            |
|  Lakshmi Aunty                   |
|                                  |
|  [  Yes, received  ]           |
|  [  Not yet  ]                 |
+----------------------------------+

INTERACTION: After confirming pickup

BOTTOM SHEET: Rate & Review
+----------------------------------+
|                                  |
|  How was the food?              |
|                                  |
|  [star] [star] [star] [star] [] |
|                                  |
|  Leave a note (optional)        |
|  [Delicious! Just like home]   |
|                                  |
|  [  Submit  ]   [  Skip  ]     |
+----------------------------------+
```

**Buyer Flow Summary**

| Step | Action | Taps from Home |
|---|---|---|
| 1 | Browse food grid | 0 (default view) |
| 2 | View food detail | 1 |
| 3 | Tap "I Want This" | 2 |
| 4 | Set quantity + confirm | 3 (sheet appears inline) |
| 5 | Chat with seller | 3 (auto-navigates) |
| 6 | Confirm pickup | Via notification or My Orders |
| 7 | Rate (optional) | Prompted after confirmation |

---

### 4.3 Seller Flow: Listing Food and Managing Orders

```
ENTRY POINT: Home Screen (Seller)
+----------------------------------+
|  GharKa              [bell]     |
|                                  |
|  Good morning, Lakshmi!         |
|                                  |
|  +-----------------------------+|
|  | Today's Stats               ||
|  | 3 orders | 8 plates sold   ||
|  | Rs 640 earned              ||
|  +-----------------------------+|
|                                  |
|  Your Active Listings            |
|  +-----------------------------+|
|  | [Photo] Dal Makhani         ||
|  | Rs 80 | 6 of 12 left       ||
|  | 3 orders  [Mark Sold Out]   ||
|  +-----------------------------+|
|  +-----------------------------+|
|  | [Photo] Aloo Paratha        ||
|  | Rs 40 | 10 of 10 left      ||
|  | 0 orders                    ||
|  +-----------------------------+|
|                                  |
|  Recent Orders                   |
|  +-----------------------------+|
|  | Priya - 2x Dal Makhani     ||
|  | Status: Preparing           ||
|  | [Chat] [Mark Ready]        ||
|  +-----------------------------+|
|                                  |
|             [+ FAB]             |
| [Home] [Listings] [Chat] [Prof]|
+----------------------------------+

INTERACTION: Tap the FAB (+) button

SCREEN: Add Listing -- Photo
+----------------------------------+
|  [<- Cancel]   New Listing      |
|                                  |
|  +-----------------------------+|
|  |                             ||
|  |    [Camera icon]            ||
|  |                             ||
|  |    Take a photo of          ||
|  |    your dish                ||
|  |                             ||
|  |    [Take Photo]             ||
|  |    [Choose from Gallery]    ||
|  |                             ||
|  +-----------------------------+|
|                                  |
|  Tip: Natural light makes       |
|  food look more appetizing      |
|                                  |
|  Step 1 of 2                    |
|  [    Next    ]  (disabled)    |
+----------------------------------+
Photo is required. "Next" enables only after photo is selected.
Photo auto-enhances brightness/warmth subtly (no heavy filters).

SCREEN: Add Listing -- Details
+----------------------------------+
|  [<- Back]    New Listing       |
|                                  |
|  [Photo thumbnail]  [Change]   |
|                                  |
|  What did you make?             |
|  [Dal Makhani________________] |
|                                  |
|  Describe it                    |
|  [Slow cooked dal with cream.  |
|   Comes with 2 rotis.________] |
|                                  |
|  Category                       |
|  [Meals > North Indian     v]  |
|                                  |
|  Price per plate                |
|  Rs [80___]                     |
|                                  |
|  How many available?            |
|   [ - ]    12    [ + ]          |
|                                  |
|  Available until (optional)     |
|  [Today, 2:00 PM            v] |
|                                  |
|  Step 2 of 2                    |
|  [    Preview    ]             |
+----------------------------------+
Title: Required, 3-50 characters. Auto-suggest from past listings.
Description: Optional, max 200 characters.
Category: Bottom sheet picker with common categories.
Price: Number input, Rs prefix, minimum Rs 10.
Quantity: Stepper, minimum 1, maximum 100.
Availability window: Optional. Defaults to "Until sold out."

SCREEN: Listing Preview
+----------------------------------+
|  [<- Edit]     Preview          |
|                                  |
|  This is how buyers will        |
|  see your listing               |
|                                  |
|  +-----------------------------+|
|  | [Large food photo]          ||
|  |                             ||
|  | Dal Makhani                 ||
|  | Rs 80 per plate             ||
|  |                             ||
|  | Lakshmi A.   [your avatar]  ||
|  |                             ||
|  | Slow cooked dal with cream. ||
|  | Comes with 2 rotis.        ||
|  |                             ||
|  | 12 available                ||
|  | Meals > North Indian       ||
|  +-----------------------------+|
|                                  |
|  [    Publish    ]             |
+----------------------------------+

INTERACTION: Tap "Publish"

OVERLAY: Listing Published
+----------------------------------+
|                                  |
|  [Three.js: Food item rises    |
|   with sparkle animation]      |
|                                  |
|   Your listing is live!         |
|                                  |
|   Neighbors within 5km can     |
|   now see and order your       |
|   Dal Makhani                   |
|                                  |
|  [  View Listing  ]            |
|  [  Add Another   ]            |
|                                  |
+----------------------------------+

SCREEN: Manage Listing (from My Listings tab or Home)
+----------------------------------+
|  [<- Back]   Dal Makhani       |
|                                  |
|  [Photo]                        |
|  Rs 80 per plate                |
|  6 of 12 remaining             |
|  Available until 2:00 PM        |
|                                  |
|  Orders (3)                     |
|  +-----------------------------+|
|  | Priya - 2 plates           ||
|  | Status: Preparing          ||
|  | [Chat] [Mark Ready]        ||
|  +-----------------------------+|
|  | Amit - 1 plate             ||
|  | Status: Ready for pickup   ||
|  | [Chat] [Mark Picked Up]    ||
|  +-----------------------------+|
|  | Sneha - 3 plates           ||
|  | Status: Confirmed          ||
|  | [Chat] [Mark Ready]        ||
|  +-----------------------------+|
|                                  |
|  [Edit Listing] [Mark Sold Out] |
+----------------------------------+
```

**Seller Flow Summary**

| Step | Action | Taps from Home |
|---|---|---|
| 1 | Tap FAB to add listing | 1 |
| 2 | Take/choose photo + tap Next | 2 |
| 3 | Fill details + tap Preview | 3 |
| 4 | Tap Publish | 4 (one over ceiling; acceptable for creation flow) |
| 5 | Mark order as ready | 2 (Home > order card > Mark Ready) |
| 6 | Mark sold out | 2 (Home > listing card > Mark Sold Out) |

Note: The listing creation flow is 4 taps, which exceeds the 3-tap ceiling. This is acceptable because creation flows inherently require more input. The critical constraint is that the form itself fits on 2 screens maximum, and the total creation time stays under 60 seconds.

---

### 4.4 Admin Flow

```
SCREEN: Admin Dashboard
+----------------------------------+
|  GharKa Admin                   |
|                                  |
|  [Community Name]               |
|                                  |
|  +--------+ +--------+         |
|  | 142    | | 23     |         |
|  | Users  | | Active |         |
|  |        | | Today  |         |
|  +--------+ +--------+         |
|  +--------+ +--------+         |
|  | 15     | | 2      |         |
|  |Listings| |Pending |         |
|  | Today  | |Reports |         |
|  +--------+ +--------+         |
|                                  |
|  Pending Reports  [View All >]  |
|  +-----------------------------+|
|  | [!] User reported listing   ||
|  | "Expired food sold"         ||
|  | 2 hours ago   [Review]      ||
|  +-----------------------------+|
|  +-----------------------------+|
|  | [!] User flagged by 3 users||
|  | Amit K. - multiple issues   ||
|  | 5 hours ago   [Review]      ||
|  +-----------------------------+|
|                                  |
|  Recent Activity (feed)         |
|  New user joined: Priya M.     |
|  New listing: Dal Makhani      |
|  ...                            |
|                                  |
| [Dash] [Users] [Listings] [Set]|
+----------------------------------+

SCREEN: Report Review
+----------------------------------+
|  [<- Back]    Report #47        |
|                                  |
|  Reported by: Priya M.         |
|  Against: Amit K.              |
|  Listing: Chicken Curry         |
|  Reason: Expired food sold     |
|                                  |
|  Reporter's note:              |
|  "The food smelled off when    |
|  I opened it. Looked old."     |
|                                  |
|  Seller history:               |
|  12 listings | 4.2 avg rating  |
|  1 previous report (resolved)  |
|                                  |
|  Actions:                       |
|  [Dismiss Report]              |
|  [Warn Seller]                 |
|  [Remove Listing]              |
|  [Suspend Seller (7 days)]     |
+----------------------------------+
```

---

### 4.5 Chat Flow

```
SCREEN: Chat List
+----------------------------------+
|  [<- Back]      Chats           |
|                                  |
|  +-----------------------------+|
|  | [avatar] Lakshmi Aunty     ||
|  | 2x Dal Makhani             ||
|  | "I will have it ready by..." ||
|  | 10 min ago       [unread]  ||
|  +-----------------------------+|
|  | [avatar] Priya M.          ||
|  | 1x Aloo Paratha            ||
|  | "On my way!"               ||
|  | 1 hour ago                  ||
|  +-----------------------------+|
|  | [avatar] Meena K.          ||
|  | 3x Biryani                 ||
|  | "Order picked up"          ||
|  | Yesterday                   ||
|  +-----------------------------+|
|                                  |
|  No standalone chats.           |
|  Every conversation is tied     |
|  to an order.                   |
|                                  |
| [Home] [Orders] [Chat] [Profile]|
+----------------------------------+

SCREEN: Chat Thread
+----------------------------------+
|  [<-]  Lakshmi Aunty     [...]  |
|                                  |
|  +-----------------------------+|
|  | ORDER #142 (pinned)        ||
|  | 2x Dal Makhani - Rs 160   ||
|  | Status: [Preparing >>>]    ||
|  +-----------------------------+|
|                                  |
|  -- Today --                    |
|                                  |
|  [Lakshmi]: Order confirmed!   |
|  I will start cooking.          |
|          11:00 AM               |
|                                  |
|  [Lakshmi]: Ready! You can     |
|  pick up from Flat B-204.      |
|          12:25 PM               |
|                                  |
|  [System]: Lakshmi marked      |
|  order as Ready for Pickup     |
|          12:25 PM               |
|                                  |
|  Quick replies:                 |
|  [On my way!] [5 min]          |
|  [Which floor?] [Thanks!]      |
|                                  |
|  [Type a message...] [Send]    |
+----------------------------------+
```

**Chat Design Decisions**:
- Every chat thread is anchored to a specific order. No freestanding conversations. This prevents the app from becoming a general messenger and keeps interactions purposeful.
- The pinned order context card at the top eliminates the need to explain "what is this conversation about?"
- Quick reply chips reduce typing for common messages (especially important for the Lakshmi persona who may be mid-cooking).
- System messages for status changes create a shared timeline both parties can reference.

---

### 4.6 Order Lifecycle State Machine

```
                    +-------------+
                    |   PLACED    |
                    | (buyer taps |
                    | "I Want     |
                    |  This")     |
                    +------+------+
                           |
                    Seller sees order
                           |
                    +------v------+
              +---->|  CONFIRMED  |<----+
              |     | (seller     |     |
              |     |  accepts)   |     |
              |     +------+------+     |
              |            |            |
              |     Seller cooks        |
              |            |            |
              |     +------v------+     |
              |     |  PREPARING  |     |
              |     +------+------+     |
              |            |            |
              |     Seller marks ready  |
              |            |            |
              |     +------v------+     |
              |     |    READY    |     |
              |     | (for pickup)|     |
              |     +------+------+     |
              |            |            |
              |     Buyer picks up      |
              |            |            |
              |     +------v------+     |
              |     |  COMPLETED  |     |
              |     +------+------+     |
              |            |            |
              |     Buyer rates         |
              |     (optional)          |
              |            |            |
              |     +------v------+     |
              |     |   RATED     |     |
              |     +-------------+     |
              |                         |
              |     +-------------+     |
              +-----|  CANCELLED  |-----+
                    | (either     |
                    |  party)     |
                    +-------------+
```

---

## 5. Screen Inventory

### 5.1 Complete Screen List

Total unique screens: **31**

| # | Screen Name | Role(s) | Purpose | Key Elements |
|---|---|---|---|---|
| **Onboarding (7 screens)** | | | | |
| 1 | Splash Screen | All | Brand impression, loading | Three.js animation, logo, tagline |
| 2 | Intro Slide 1 | All | Explain concept: discover food | Illustration, headline, skip option |
| 3 | Intro Slide 2 | All | Explain concept: order easily | Illustration, headline, next |
| 4 | Intro Slide 3 | All | Explain concept: sell food | Illustration, headline, CTA |
| 5 | Phone Input | All | Authentication | Phone field, country code, send OTP button |
| 6 | OTP Verification | All | Authentication | 4-digit input, auto-read, resend timer |
| 7 | Profile Setup | All | Name and avatar creation | Avatar grid, name field, continue button |
| 8 | Location Permission | All | Enable proximity features | Illustration, permission CTA, privacy note |
| 9 | Role Selection | All | Set initial experience | 3 role cards (Buy/Sell/Both), change-later note |
| **Buyer Screens (8 screens)** | | | | |
| 10 | Buyer Home | Buyer | Browse available food | Search bar, category chips, food card grid, pull-to-refresh |
| 11 | Food Detail | Buyer | View dish information | Photo carousel, title, price, seller card, description, CTA |
| 12 | Quantity Sheet | Buyer | Select quantity | Stepper, total price, optional note, confirm button |
| 13 | Order Confirmed | Buyer | Confirmation feedback | Three.js celebration, chat CTA |
| 14 | My Orders - Active | Buyer | Track current orders | Order cards with status, chat shortcut |
| 15 | My Orders - Past | Buyer | View order history | Past order cards, reorder button |
| 16 | Order Detail | Buyer | Full order information | Status timeline, seller info, chat, pickup confirmation |
| 17 | Rate and Review Sheet | Buyer | Post-order feedback | Star rating, text field, submit |
| **Seller Screens (8 screens)** | | | | |
| 18 | Seller Home | Seller | Overview of activity | Stats bar, active listings, recent orders, FAB |
| 19 | Add Listing - Photo | Seller | Capture dish photo | Camera/gallery options, photo tip |
| 20 | Add Listing - Details | Seller | Enter listing information | Title, description, category, price, quantity, availability |
| 21 | Listing Preview | Seller | Review before publishing | Buyer-perspective preview, edit/publish actions |
| 22 | Listing Published | Seller | Publish confirmation | Three.js animation, view/add-another actions |
| 23 | My Listings - Active | Seller | Manage current listings | Listing cards with order count, remaining qty, sold-out action |
| 24 | My Listings - Past | Seller | View listing history | Past listing cards, relist action |
| 25 | Listing Management | Seller | Manage single listing and its orders | Order list per listing, status actions, edit, sold-out |
| **Shared Screens (4 screens)** | | | | |
| 26 | Chat List | Both | View all conversations | Conversation cards with order context, unread badges |
| 27 | Chat Thread | Both | Message exchange | Pinned order card, messages, quick replies, status chips |
| 28 | Profile | All | Account management | Avatar, name, role toggle, settings links |
| 29 | Seller Public Profile | Buyer | View seller reputation | Avatar, name, rating, active listings, reviews |
| **Admin Screens (4 screens)** | | | | |
| 30 | Admin Dashboard | Admin | Community overview | Stats cards, pending reports, activity feed |
| 31 | User Management | Admin | Manage community members | User list, search, filter, user detail, actions |
| 32 | Listing Moderation | Admin | Review flagged content | Flagged queue, listing detail, moderation actions |
| 33 | Report Detail | Admin | Resolve disputes | Report info, history, resolution actions |

### 5.2 Shared Components (not full screens, but reusable UI)

| Component | Used In | Description |
|---|---|---|
| Food Card | Home, Search, Seller Profile | Photo, title, price, seller name, distance, rating. Two-column grid. |
| Order Card | My Orders, Seller Home, Listing Management | Item name, quantity, status badge, buyer/seller name, action buttons |
| Listing Card | Seller Home, My Listings | Photo, title, price, remaining qty, orders count, sold-out toggle |
| Bottom Sheet | Filters, Quantity, Category Picker, Confirmations | Draggable sheet from bottom, 40-60% screen height |
| Status Badge | Order Card, Chat, Order Detail | Colored pill: Placed (gray), Confirmed (blue), Preparing (orange), Ready (green), Completed (dark green) |
| Empty State | All list screens | Three.js subtle animation + contextual message + primary CTA |
| Toast Notification | Global | Slide-down confirmation messages for non-critical feedback |
| Chat Bubble | Chat Thread | Left-aligned (other party), right-aligned (self), system (centered, muted) |

---

## 6. Interaction Patterns

### 6.1 Food Card Behavior

```
FOOD CARD ANATOMY
+---------------------------+
| [Photo - 1:1 ratio]      |
|                           |
| [Veg/Non-veg indicator]  |
+---------------------------+
| Title (1 line, truncate)  |
| Seller Name + Avatar tiny |
| Rs XX   |   0.3 km       |
| [stars]  |  "4 left"      |
+---------------------------+

STATES:
- Default: As shown above
- Pressed: Card depresses slightly (scale 0.97), subtle shadow reduction
- Sold Out: Photo desaturates, "Sold Out" overlay, card moves to bottom of grid
- Low Stock: "Only 2 left" badge appears in warm orange
- New: "New" badge appears in top-right corner for listings under 1 hour old
```

**Card Grid Layout**:
- 2 columns on phone (optimal for food photo visibility)
- 3 columns on tablet
- Consistent card height via fixed photo ratio (1:1) and text truncation
- 16px gap between cards, 16px horizontal padding

### 6.2 Pull to Refresh

- Available on: Buyer Home, My Orders, My Listings, Chat List
- Animation: Custom Three.js micro-animation -- a small pot lid lifts and steam emerges
- Threshold: 80px pull distance
- Haptic: Light haptic feedback on threshold reach (iOS) / vibrate (Android)
- Behavior: Fetches latest data, new items appear at top with subtle slide-in animation

### 6.3 Infinite Scroll vs. Pagination

**Decision: Infinite scroll with virtual windowing.**

Rationale: Within a 5km radius of a gated community, total listings at any time will be 10-50 items. This is well within infinite scroll performance thresholds. No pagination needed.

- Load initial 20 items
- Load next 10 on scroll threshold (200px from bottom)
- Show skeleton cards during load
- End of list: "That is everything nearby right now" message with pull-to-refresh hint

### 6.4 Toast Notifications

| Trigger | Message | Duration | Position |
|---|---|---|---|
| Order placed | "Order sent to [Seller]!" | 3s | Top |
| Listing published | "Your listing is live!" | 3s | Top |
| Order status change | "[Seller] marked your order as Ready" | 4s | Top, tappable (goes to order) |
| Sold out marked | "Listing marked as sold out" | 3s | Top |
| Error states | "Something went wrong. Try again." | 5s | Top, red accent |
| Network offline | "You are offline. Showing cached data." | Persistent | Top, amber accent |

### 6.5 Bottom Sheets

Used for: Filters, quantity selection, category picker, confirmations, quick actions.

```
BOTTOM SHEET BEHAVIOR
- Appears from bottom with spring animation (300ms)
- Background dims to 40% black opacity
- Drag handle at top center (40px wide, 4px tall, rounded)
- Swipe down to dismiss
- Tap outside to dismiss
- Maximum height: 60% of screen
- If content exceeds 60%, sheet becomes scrollable internally

FILTER BOTTOM SHEET LAYOUT
+----------------------------------+
|          [drag handle]           |
|                                  |
|  Filters              [Clear]   |
|                                  |
|  Category                       |
|  [Meals] [Snacks] [Sweets]     |
|  [Drinks] [Tiffin] [Other]     |
|                                  |
|  Diet                           |
|  [Veg] [Non-Veg] [Egg]        |
|                                  |
|  Price Range                    |
|  [slider: Rs 10 --- Rs 500]    |
|                                  |
|  Sort By                        |
|  ( ) Nearest first              |
|  ( ) Newest first               |
|  (o) Price: low to high         |
|  ( ) Price: high to low         |
|  ( ) Highest rated              |
|                                  |
|  [  Show 12 results  ]         |
+----------------------------------+
```

### 6.6 Swipe Gestures

Swipe gestures are used sparingly to maintain simplicity. Only contextual, non-destructive actions.

| Screen | Gesture | Action | Visual Feedback |
|---|---|---|---|
| Chat List | Swipe left on conversation | Mute notifications | Bell-slash icon reveal |
| My Orders (Seller) | Swipe right on order card | Mark as Ready | Green "Ready" background reveal |
| My Listings | Swipe left on listing | Mark Sold Out | Red "Sold Out" background reveal |
| Intro Carousel | Swipe left/right | Navigate slides | Standard page indicator |
| Food Detail Photos | Swipe left/right | Browse photos | Photo counter updates |

All swipe actions also have explicit button alternatives for discoverability.

### 6.7 Notification Patterns

| Event | Push Notification | In-App |
|---|---|---|
| New order received (seller) | "Priya ordered 2x Dal Makhani!" | Badge on Chat tab + order card in Seller Home |
| Order status change (buyer) | "Lakshmi marked your order as Ready!" | Badge on Orders tab + toast |
| New message | "Lakshmi: Flat B-204, pick up anytime" | Badge on Chat tab + unread dot |
| Listing running low (seller) | "Only 2 plates of Dal Makhani left!" | Alert card on Seller Home |
| New listing from favorite seller (buyer) | "Lakshmi posted Biryani (Rs 150)" | Highlighted card on Buyer Home |
| Report resolved (admin) | "Report #47 resolved" | Badge on Reports tab |

---

## 7. Behavioral Nudge Placement

### 7.1 Contextual Education ("How It Works")

The app should never require a help page. Instead, education happens at the moment of relevance.

| Moment | Nudge | Format | Show Condition |
|---|---|---|---|
| First time on Buyer Home | "Tap any dish to see details and order" | Tooltip pointing at first food card | First session only |
| First time on food detail | "Pay the seller directly with cash or UPI -- GharKa does not handle payments" | Info banner below price | First 3 orders |
| First time on Seller Home | "Tap the + button to list your first dish" | Pulsing FAB with tooltip | No listings yet |
| First listing - photo step | "Natural light makes food look appetizing. Try near a window!" | Inline tip below camera button | First 3 listings |
| First chat opened | "Use quick replies for common messages" | Highlight on quick reply chips | First chat session |
| First order received (seller) | "Tap 'Mark Ready' when the food is ready for pickup" | Tooltip on the action button | First order |

### 7.2 First Listing Encouragement (Seller)

This is the most critical activation moment. A seller who lists once is likely to list again.

**Empty State on Seller Home (no listings yet)**
```
+----------------------------------+
|                                  |
|  [Three.js: Gentle animation   |
|   of ingredients floating into  |
|   a cooking pot]               |
|                                  |
|   Your kitchen, their craving   |
|                                  |
|   142 neighbors nearby are      |
|   looking for home food         |
|                                  |
|   [  List Your First Dish  ]   |
|                                  |
|   Takes less than 60 seconds    |
|                                  |
+----------------------------------+
```

**Social proof nudge after first listing gets an order**:
- Toast: "Your first order! Neighbors love your cooking."
- One-time celebration overlay with Three.js confetti animation.

**Re-engagement nudge if seller has not listed in 7 days**:
- Push notification: "Your neighbors miss your cooking. 23 people are browsing food right now."
- In-app: "It has been a while! What are you cooking today?" banner on Seller Home.

### 7.3 Trust-Building Placements

Trust is the central challenge for a food-sharing app with no quality guarantees.

| Trust Signal | Placement | Mechanism |
|---|---|---|
| Seller rating + review count | Food card, food detail, seller profile | Aggregate star rating + "12 orders fulfilled" |
| "Neighbor" framing | Throughout copy | "Your neighbor Lakshmi" not "Seller #142" |
| Real food photos required | Listing creation | No stock photos. Camera-first flow. |
| Recent activity indicator | Food card | "Posted 30 min ago" or "Lakshmi is cooking now" |
| Community size | Empty states, seller nudge | "142 neighbors in your community" |
| Order count social proof | Food detail | "8 plates sold today" |
| Verified community badge | Seller profile | Admin-granted badge for trusted sellers |
| Report mechanism | Food detail, order detail, seller profile | "Report this listing" link (not prominent, but always accessible) |
| Transparent disclaimers | Order confirmation, profile setup | "Food is homemade by your neighbors. GharKa does not inspect or guarantee food quality." |

### 7.4 Return Visit Hooks

| Hook | Trigger | Channel |
|---|---|---|
| New listing from previously ordered seller | Seller publishes new listing | Push notification to past buyers |
| Daily food availability digest | 10:00 AM daily (if listings exist) | Push notification: "5 dishes available near you today" |
| Order follow-up | 24h after order pickup, if not rated | Push notification: "How was Lakshmi's Dal Makhani?" |
| Seller earnings summary | Weekly on Sunday evening | Push notification: "You earned Rs 2,400 this week!" |
| Community milestone | First 50/100/200 community orders | In-app celebration overlay |
| "Trending in your community" | When a listing gets 5+ orders | Badge on food card + potential push |

### 7.5 Engagement Loop Map

```
BUYER LOOP:
Browse --> Order --> Chat --> Pickup --> Rate --> Browse again
  ^                                               |
  |   [Push: "New listing from Lakshmi"]          |
  +-----------------------------------------------+

SELLER LOOP:
Cook --> List --> Get Orders --> Fulfill --> See Earnings --> Cook again
  ^                                                          |
  |   [Push: "23 neighbors browsing now"]                    |
  +----------------------------------------------------------+

CROSS-LOOP:
Buyer rates highly --> Seller sees positive review --> Seller lists again
                   --> Other buyers see rating --> More orders
```

---

## 8. Simplicity Audit

### 8.1 Three-Tap Ceiling Verification

Every primary user action audited against the 3-tap maximum from the home screen.

| User Goal | Tap 1 | Tap 2 | Tap 3 | Within Limit? |
|---|---|---|---|---|
| Browse food | On Home already | -- | -- | YES (0 taps) |
| View food detail | Tap food card | -- | -- | YES (1 tap) |
| Place an order | Tap food card | "I Want This" | Confirm (sheet) | YES (3 taps) |
| Search for food | Tap search bar | Type + see results | -- | YES (2 taps) |
| Filter food | Tap filter icon | Select filters | "Show results" | YES (3 taps) |
| Check order status | Tap "My Orders" tab | Status visible on card | -- | YES (1-2 taps) |
| Chat with seller | Tap "Chat" tab | Tap conversation | -- | YES (2 taps) |
| Add a listing (seller) | Tap FAB | -- | -- | YES for initiation (1 tap) |
| Mark listing sold out | Tap listing card | "Sold Out" button | -- | YES (2 taps) |
| Mark order ready (seller) | Tap order card on Home | "Mark Ready" | -- | YES (2 taps) |
| View profile | Tap "Profile" tab | -- | -- | YES (1 tap) |
| Change role | Profile tab | Role toggle | -- | YES (2 taps) |
| Report a listing | Food detail | "Report" link | Select reason + submit | YES (3 taps) |
| Reorder past food | "My Orders" > Past | Tap "Reorder" | Confirm | YES (3 taps) |

**Creation flows (listing a dish) require 4 taps total** (FAB > fill photo > fill details > preview > publish). This is the only flow that exceeds 3 taps, and it is acceptable because it is a content creation flow that inherently requires input steps.

### 8.2 Zero-Explanation Audit

Each feature assessed: would a WhatsApp-proficient user understand this without any instruction?

| Feature | Self-Explanatory? | Risk Level | Mitigation |
|---|---|---|---|
| Food grid on Home | Yes -- identical mental model to Swiggy/Zomato | None | -- |
| "I Want This" button | Yes -- clear intent language | Low | -- |
| Quantity stepper | Yes -- universal +/- pattern | None | -- |
| Chat with seller | Yes -- WhatsApp mental model | None | -- |
| FAB for adding listing | Moderate -- FAB is familiar from Google apps but not universal | Low | Pulsing animation + tooltip on first visit |
| Category chips for filtering | Yes -- common pattern | None | -- |
| Status badges on orders | Mostly -- "Preparing" and "Ready" are clear | Low | Color coding reinforces meaning |
| Role selection | Yes -- simple card selection | None | "Change later" note reduces pressure |
| Pull to refresh | Yes for younger users, maybe not for 55+ | Low | Loading states make refresh visible anyway |
| Swipe gestures | Not obvious without discovery | Medium | All swipe actions have button alternatives |
| Rating after pickup | Yes -- ubiquitous pattern | None | -- |
| Bottom sheet filters | Moderate -- some users may not know to swipe up | Low | Explicit "Filter" button triggers the sheet |

### 8.3 Progressive Disclosure Strategy

Information and features are revealed in layers. Layer 1 is visible by default. Layer 2 appears on interaction. Layer 3 is accessible but requires intentional seeking.

**Buyer Home Screen**:
- Layer 1 (visible): Food photo, title, price, distance, rating
- Layer 2 (tap card): Full description, seller profile, availability count, similar items
- Layer 3 (intentional): Seller's full profile, past reviews, report option

**Seller Home Screen**:
- Layer 1 (visible): Active listing count, orders today, earnings today
- Layer 2 (tap listing): Order details, individual order status, chat access
- Layer 3 (intentional): Edit listing, view past listings, relist old items

**Order Card**:
- Layer 1 (visible): Item name, quantity, status badge, seller/buyer name
- Layer 2 (tap card): Full status timeline, chat shortcut, pickup confirmation
- Layer 3 (intentional): Report order, cancel order

**Profile Screen**:
- Layer 1 (visible): Name, avatar, role toggle
- Layer 2 (tap sections): Notification settings, location settings
- Layer 3 (intentional): Help, terms, privacy, logout

### 8.4 Cognitive Load Reduction Techniques

| Technique | Implementation |
|---|---|
| Smart defaults | Quantity defaults to 1. Availability defaults to "until sold out." Category remembers last used. |
| Auto-fill from history | Seller's listing form auto-suggests title and description from past listings after 3+ listings. |
| Reduced choice | Maximum 8 food categories (not 30). Sort options limited to 5. |
| Visual hierarchy | One primary CTA per screen. Secondary actions are text links or outlined buttons. |
| Recognition over recall | Food photos are large and prominent. Seller avatars appear consistently. Status uses color. |
| Chunked information | Listing creation is 2 screens, not 1 long form. Order detail uses a timeline, not a wall of text. |
| Error prevention | Phone field only accepts digits. Price field rejects decimals. Quantity stepper prevents 0. |

---

## 9. Accessibility Considerations

### 9.1 Visual Accessibility

| Requirement | Implementation |
|---|---|
| Color contrast | All text meets WCAG AA (4.5:1 for body, 3:1 for large text). Status badges use color + text label. |
| Text sizing | Support system font scaling up to 200%. Layout reflows, does not clip. |
| Color independence | Veg/non-veg indicator uses shape (circle vs. triangle) in addition to color (green vs. red). Status badges always include text, never color alone. |
| Touch targets | All interactive elements minimum 44x44pt. Food cards are large tap targets. |
| Motion sensitivity | Three.js animations respect "Reduce Motion" OS setting. Fallback: static illustrations. |

### 9.2 Motor Accessibility

| Requirement | Implementation |
|---|---|
| One-handed operation | All primary actions reachable in bottom 60% of screen. Tab bar at bottom. FAB in bottom-right. |
| Swipe alternatives | Every swipe action has a tap-based alternative (button or long-press menu). |
| Input simplification | OTP auto-reads from SMS. Category uses picker (not free text). Quantity uses stepper (not keyboard). |

### 9.3 Cognitive Accessibility

| Requirement | Implementation |
|---|---|
| Plain language | All copy at 6th-grade reading level. "I Want This" not "Place Order." "How many plates?" not "Select quantity." |
| Consistent navigation | Tab bar never changes position. Back button always in top-left. |
| Error recovery | All destructive actions (cancel order, remove listing) require confirmation. Undo available for accidental sold-out marking. |
| Status clarity | Order status uses both text labels and visual timeline. Never relies on implied state. |

### 9.4 Language Accessibility

| Requirement | Implementation |
|---|---|
| Regional language support | App shell supports Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati (phase 1). |
| Script rendering | All UI text uses system fonts that support Devanagari, Tamil, Telugu, and other Indic scripts. |
| User-generated content | Food titles and descriptions stay in the language the seller writes. No forced translation. |
| RTL consideration | Not required for Indian languages (all LTR), but layout architecture supports it for future Urdu support. |

---

## 10. Research Recommendations & Next Steps

### 10.1 Pre-Development Validation (Priority: Critical)

| Research Activity | Method | Sample | Timeline | Purpose |
|---|---|---|---|---|
| Concept test with WhatsApp food group members | 1:1 interviews | 8-10 active buyers, 5-6 active sellers from existing WhatsApp food groups | 1 week | Validate that the app concept solves real pain points over WhatsApp |
| Onboarding flow paper prototype test | Moderated usability test | 6-8 participants across tech proficiency levels | 1 week | Validate 45-75 second onboarding completion and comprehension |
| Role selection comprehension test | Unmoderated task test | 15-20 participants | 3 days | Validate that users understand Buy/Sell/Both distinction and feel comfortable choosing |
| Food card design preference test | A/B preference test | 30+ participants | 3 days | Validate 2-column grid vs. list view, card information density |

### 10.2 Post-Prototype Validation (Priority: High)

| Research Activity | Method | Sample | Purpose |
|---|---|---|---|
| Seller listing creation task test | Moderated usability test (interactive prototype) | 6-8 home cooks (Lakshmi persona) | Validate sub-60-second listing creation. Identify friction in photo-first flow. |
| Buyer ordering end-to-end test | Moderated usability test | 8-10 participants | Validate 3-tap ordering. Test search/filter discoverability. |
| Trust signal effectiveness | Survey + interview | 20 survey + 6 interview | Measure which trust signals (ratings, photos, neighbor framing) most influence order decisions |
| Chat flow comprehension | Moderated usability test | 6 participants | Validate order-anchored chat model. Test quick reply usage. |

### 10.3 Post-Launch Measurement Plan

| Metric | Target | Measurement Method |
|---|---|---|
| Onboarding completion rate | Above 80% | Analytics funnel |
| Time to first order (buyer) | Under 5 minutes from onboarding complete | Analytics event timing |
| Time to first listing (seller) | Under 3 minutes from onboarding complete | Analytics event timing |
| Listing creation time | Under 60 seconds | Analytics event timing |
| Order placement taps | 3 or fewer from Home | Analytics tap counting |
| Daily active users / Monthly active users | Above 30% | Analytics ratio |
| Seller retention (listed in 2 consecutive weeks) | Above 40% | Cohort analysis |
| Buyer retention (ordered in 2 consecutive weeks) | Above 35% | Cohort analysis |
| Chat response time (seller to buyer) | Under 15 minutes | Analytics event timing |
| Order fulfillment rate | Above 90% | Order completion analytics |
| User satisfaction (in-app survey) | Above 4.0 out of 5 | Quarterly pulse survey |

### 10.4 Known Risks and Research Questions for Future Investigation

| Risk | Question | Recommended Research |
|---|---|---|
| Cold start problem | How do we create supply (sellers) before demand (buyers) exists? | Seed community with 3-5 anchor sellers. Measure minimum viable supply for buyer activation. |
| Payment disputes | Without in-app payments, how do disputes get resolved? | Monitor chat logs and reports for payment-related conflicts. Interview users quarterly. |
| Food safety liability | How do users perceive risk of unregulated food? | Concept test the disclaimer language. Measure trust levels pre and post order. |
| Seller burnout | Do high-volume sellers burn out and leave? | Longitudinal seller interviews at 1, 3, 6 months. Track listing frequency over time. |
| Photo quality variance | Do poor food photos reduce buyer trust across the whole platform? | A/B test listings with coaching tips vs. without. Measure conversion rate difference. |
| Seasonal variation | Does usage drop when people travel or during festivals? | 6-month usage pattern analysis. Plan re-engagement campaigns for low periods. |

---

## Appendix A: Three.js Animation Inventory

These are the specific moments where visual grandeur enhances the experience without blocking user progress.

| Moment | Animation | Duration | Blocking? |
|---|---|---|---|
| Splash screen | Warm particles coalesce into GharKa logo | 2.5s | Yes (intentional brand moment) |
| Order confirmed | Checkmark with particle burst | 1.5s | Semi (auto-dismisses, tap to skip) |
| Listing published | Food item rises with sparkle trail | 1.5s | Semi (auto-dismisses, tap to skip) |
| First order celebration (seller) | Confetti burst | 2s | Semi (auto-dismisses, tap to skip) |
| Empty states (all) | Gentle looping ambient animation (cooking pot, floating ingredients) | Continuous | No (background, non-blocking) |
| Pull to refresh | Pot lid lift with steam | 0.8s | No (replaces standard spinner) |
| Community milestone | Number counter with particle effects | 2s | Overlay, tap to dismiss |

All animations respect the "Reduce Motion" system setting and fall back to static illustrations.

---

## Appendix B: Category Taxonomy

Kept intentionally small (8 categories) to reduce cognitive load.

| Category | Examples | Icon |
|---|---|---|
| Meals | Biryani, dal rice, thali, curry with roti | Plate with steam |
| Snacks | Samosa, pakora, chaat, vada pav | Triangle samosa |
| Tiffin | Idli, dosa, upma, poha | Round idli plate |
| Sweets | Gulab jamun, halwa, ladoo, kheer | Ladoo |
| Drinks | Chai, lassi, buttermilk, juice | Glass with straw |
| Bread | Roti, paratha, naan, puri | Flatbread |
| Pickles and Sides | Pickle, chutney, raita, papad | Jar |
| Other | Anything not above | Star |

---

## Appendix C: Copy Style Guide

| Principle | Example: Yes | Example: No |
|---|---|---|
| Conversational, warm | "What are you craving today?" | "Search food items" |
| Action over label | "I Want This" | "Place Order" |
| Human over system | "Chat with Lakshmi" | "Open message thread" |
| Specific over vague | "6 plates left" | "Limited availability" |
| Encouraging over neutral | "Your listing is live!" | "Listing published successfully" |
| Honest over promotional | "Pay the seller directly" | "Seamless payment experience" |
| Short over complete | "Takes 60 seconds" | "The listing creation process typically requires approximately one minute" |

---

**Document End**

*This document should be treated as a living artifact. Update it after each research round, usability test, or significant product decision. Version history and change log should be maintained in the project repository.*
