# GharKa -- Behavioral Engagement System
## A Complete Nudge Architecture for Community Food Sharing

**Document Version**: 1.0
**Last Updated**: 2026-05-08
**Purpose**: This document defines every behavioral touchpoint in the GharKa app -- from the moment a user downloads it to the moment they become a loyal community member. Every nudge, tooltip, notification, and piece of micro-copy is designed with one principle: reduce friction, build trust, never manipulate.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Onboarding Nudges](#2-onboarding-nudges)
3. [Engagement Loops](#3-engagement-loops)
4. [Trust-Building Nudges](#4-trust-building-nudges)
5. [Contextual "How It Works" Integration](#5-contextual-how-it-works-integration)
6. [Retention Mechanics](#6-retention-mechanics)
7. [Behavioral Anti-Patterns -- Hard Rules](#7-behavioral-anti-patterns----hard-rules)
8. [Micro-Copy Bank](#8-micro-copy-bank)
9. [Technical Implementation Notes](#9-technical-implementation-notes)

---

## 1. Design Philosophy

### The Core Tension

GharKa connects strangers through food. The fundamental challenge is not technical -- it is psychological. Users must overcome three barriers simultaneously:

1. **Trust barrier**: "Is this food safe? Who made it? Can I trust them?"
2. **Social barrier**: "Is it weird to buy food from a neighbor I don't know?"
3. **Effort barrier**: "How does this even work? Is it complicated?"

Every behavioral decision in this document is designed to lower one or more of these barriers.

### Guiding Principles

| Principle | What It Means in Practice |
|---|---|
| **One thing at a time** | Never show the user more than one action to take. If there are 12 listings nearby, surface the single most relevant one first. |
| **Warmth over efficiency** | Copy should sound like a friendly neighbor, not a corporate notification system. "Priya just posted fresh samosas" beats "New listing available." |
| **Earned complexity** | Features like seller badges, streaks, and community stats are invisible until the user has completed enough actions to understand why they matter. |
| **Transparent simplicity** | GharKa has no payment gateway. No guarantees. No middleman. Users must understand this from the start -- and see it as a strength ("direct connection"), not a weakness. |
| **Respect over retention** | We would rather a user leave happily than stay because we tricked them. No dark patterns. Ever. |

---

## 2. Onboarding Nudges

### 2.1 The Three-Slide Concept Introduction

These three slides appear only once, on first launch. They are swipeable and skippable. Each slide has a single illustration, a headline, and one sentence of body copy. No more.

**Slide 1: "Your Neighborhood Kitchen"**
- Visual: A warm, illustrated bird's-eye view of a small neighborhood with homes, each with a tiny food icon floating above it.
- Headline: "Your neighbors are amazing cooks."
- Body: "GharKa lets you discover and order homemade food from people who live near you."
- Purpose: Establishes the concept. Triggers curiosity.

**Slide 2: "How It Works"**
- Visual: A simple three-step flow -- (1) Browse dishes nearby, (2) Chat with the cook, (3) Pick up or arrange delivery.
- Headline: "Browse. Chat. Eat."
- Body: "Find something you love, message the cook directly, and work out pickup or delivery between yourselves."
- Purpose: Sets the mental model. Crucially, it normalizes the "arrange between yourselves" dynamic so users are not surprised later.

**Slide 3: "Built on Trust"**
- Visual: Two illustrated neighbors exchanging a tiffin box with smiles, a small community badge in the background.
- Headline: "Real food from real neighbors."
- Body: "Everyone on GharKa lives in your area. You will see who they are, what others say about them, and how active they are."
- Purpose: Pre-emptively addresses the trust question. Positions proximity as safety.

**Behavioral rationale**: Three slides is the maximum before drop-off rates spike. Each slide addresses exactly one of the three core barriers (effort, trust, social). The "skip" option respects impatient users.

### 2.2 Post-Signup: The First 60 Seconds

The moment a user completes signup (phone number + OTP + name + locality), they land on their home feed. This is the most critical moment in the entire user journey. If the feed is empty, they will leave. If it is overwhelming, they will freeze.

**Scenario A: Listings exist nearby**

The user sees their home feed with listings. A single, gentle coach mark appears:

```
Coach Mark (pointing to the top listing):
"This is a dish from a neighbor near you.
 Tap to see details and chat with the cook."
[Got it]
```

After dismissing, no further coach marks appear on this visit. The user explores freely. Respect their intelligence.

**Scenario B: No listings nearby (cold start)**

This is the hardest scenario. The user sees an empty feed. The empty state must do three things simultaneously: (1) not feel broken, (2) explain why it is empty, (3) give the user something to do.

```
Empty Feed State:
Illustration: A friendly kitchen scene with an empty table and a "coming soon" vibe.
Headline: "Your neighborhood kitchen is warming up."
Body: "No one nearby has listed food yet -- but you could be the first!
       Or invite a friend who loves to cook."
[List Something I Made]    [Invite a Cook]
```

**Scenario C: User signed up as a seller (indicated during onboarding)**

Skip the feed entirely. Land them on the "Create Your First Listing" screen with a guided flow:

```
Step 1: "What did you make today?"
        [Text field with placeholder: "Dal makhani, Paneer tikka..."]

Step 2: "Add a photo"
        [Camera button]
        Helper text: "A good photo makes all the difference.
                      Natural light, close-up, no filters needed."

Step 3: "Set your price"
        [Price field]
        Helper text: "What feels fair? Most neighbors price
                      between Rs 50-200 per serving."

Step 4: "When can people pick this up?"
        [Time selector]
        Helper text: "Set a window that works for you.
                      Most cooks do lunch (12-2pm) or dinner (7-9pm)."
```

After publishing, an immediate celebration screen appears (see Section 2.4).

### 2.3 The "Aha Moment" -- Identification and Acceleration

The "aha moment" is when the user first viscerally understands the value of the app. Based on behavioral research in marketplace apps, the aha moments for GharKa are:

| User Type | Aha Moment | How We Accelerate It |
|---|---|---|
| **Buyer** | First time they see a dish listed by someone who genuinely lives nearby -- especially if the listing feels personal (a real photo, a short description, a name they might recognize). | Show the seller's first name, approximate distance ("500m away"), and a personal touch ("Priya's special recipe") on the very first listing they see. |
| **Seller** | First time someone messages them about their food. The feeling of "someone actually wants what I made." | The moment a seller publishes their first listing, we show: "Your neighbors can see this now. We will notify you the moment someone is interested." This creates anticipation. |
| **Both** | First successful exchange -- the moment food physically changes hands. | After the first completed exchange, we trigger the strongest celebration in the system (see Section 2.4). |

**Acceleration strategy**: The entire onboarding funnel is designed to get the user to their aha moment in the fewest possible steps. Every screen between signup and aha moment is a potential drop-off. We ruthlessly eliminate unnecessary screens.

### 2.4 Celebration Moments

Celebrations are the reward half of the engagement loop. They must feel genuine, not performative.

**First Listing Published (Seller)**
```
Screen: Full-screen gentle confetti animation (2 seconds, not overwhelming).
Headline: "You are live!"
Body: "Your neighbors within 5km can now see your dish.
       We will let you know the moment someone reaches out."
[See My Listing]    [List Another Dish]
```

**First Message Received (Seller)**
```
In-app notification banner:
"Someone is interested in your [dish name]! Tap to chat with them."
```

**First Order Completed (Buyer)**
```
Screen: Warm illustration of a tiffin/food container.
Headline: "Your first GharKa meal!"
Body: "How was it? A quick thumbs-up helps the community know
       what is great around here."
[Thumbs Up]    [Thumbs Down]    [Skip for Now]
```

**First Order Completed (Seller)**
```
Screen: Simple, warm celebration.
Headline: "Someone just enjoyed your cooking."
Body: "That is what GharKa is all about. Keep going -- your neighbors
       are discovering you."
[See My Stats]    [List Something New]
```

### 2.5 Progressive Disclosure Schedule

Features are revealed on a strict schedule tied to user actions, not time.

| Feature | Revealed After | Tooltip Copy |
|---|---|---|
| Seller badges | User has browsed 3+ listings | (No tooltip. Badges just appear naturally on listings.) |
| Thumbs up/down rating | User completes first order | "How was your meal? A quick tap helps the community." |
| "Trusted Cook" badge visibility | User sees their 5th unique seller | (No tooltip. Just visible on qualifying seller profiles.) |
| Seller analytics dashboard | Seller completes 3rd sale | "You are getting popular! Here is a look at how your dishes are doing." |
| Community streaks | User completes 5th action (listing or order) | (No tooltip. Streak counter appears subtly in profile.) |
| Invite feature | User has been active for 3+ days | "Know someone who would love this? Invite them to your neighborhood kitchen." |

**Why this matters**: A new user who sees badges, streaks, analytics, and invite buttons on their first visit will feel overwhelmed and confused. These features gain meaning only after the user has enough context to understand them.

### 2.6 Tooltip and Coach Mark Strategy

**Hard rules for tooltips:**

1. Maximum ONE tooltip per screen visit. Never stack them.
2. A tooltip must be dismissible with a single tap.
3. Once dismissed, it never appears again.
4. Tooltips appear only on first encounter with a feature.
5. Copy must be 20 words or fewer.

**Coach mark sequence for a buyer's first session:**

| Trigger | Coach Mark | Appears Once? |
|---|---|---|
| First time seeing home feed | Points to top listing: "Tap any dish to see details and chat with the cook." | Yes |
| First time opening a listing detail | Points to chat button: "Chat directly with the cook to arrange your order." | Yes |
| First time in chat | Inline helper text at top of chat: "Work out the details here -- quantity, pickup time, payment method. It is all between you and the cook." | Yes |
| First time after completing an order | Points to thumbs-up icon: "Let the community know how it was." | Yes |

**Coach mark sequence for a seller's first session:**

| Trigger | Coach Mark | Appears Once? |
|---|---|---|
| First time on "Create Listing" screen | Points to photo field: "A clear photo is the single biggest factor in getting orders." | Yes |
| First time listing goes live | Points to listing on feed: "This is how your neighbors see your dish. Tap to edit anytime." | Yes |
| First time receiving a message | Points to chat: "This person is interested! Work out the details here." | Yes |

---

## 3. Engagement Loops

### 3.1 Daily Engagement Hook: "What is Cooking Today?"

The primary daily engagement mechanism is the **"Today's Menu"** concept. Unlike a static marketplace, food is inherently temporal -- today's dal is not tomorrow's dal. This creates natural urgency (real urgency, not manufactured).

**How it works:**
- Sellers list dishes with a date/time window: "Available today, 12pm-2pm."
- The home feed resets conceptually every day, showing "What is available today."
- This gives buyers a genuine reason to check daily: the menu changes.

**Morning nudge (opt-in, buyer, 9-10am):**
```
"Good morning! 3 neighbors are cooking today near you.
 Check out what is on the menu."
[See Today's Menu]
```

**This is NOT artificial urgency.** The food literally will not be available tomorrow. The nudge reflects reality.

### 3.2 Notification Strategy

**Core philosophy**: Every notification must pass the "Would I be grateful I got this?" test. If the answer is no, do not send it.

**Notification Tiers:**

| Tier | Type | Frequency Cap | Example |
|---|---|---|---|
| **Tier 1: Transactional** | Direct messages, order confirmations | No cap (these are requested by user action) | "Priya replied to your message about the biryani." |
| **Tier 2: Discovery** | New listings from followed cooks, nearby dishes | Max 2/day | "Fresh dal makhani just listed 500m from you!" |
| **Tier 3: Social** | Community activity, endorsements | Max 1/day | "Your neighbor Priya just posted something new." |
| **Tier 4: Summary** | Daily/weekly digest | 1/day or 1/week (user choice) | "3 new dishes available near you today." |
| **Tier 5: Re-engagement** | Dormant user nudges | Max 1/week | "5 new cooks joined your area -- come explore." |

**Notification copy examples (Tier 2 -- Discovery):**

```
"Fresh dal makhani just listed 500m from you!"
Tap to see details.

"Your neighbor Priya just posted something new."
She listed gajar ka halwa -- still warm.

"3 new dishes available near you today."
See what your neighborhood is cooking.

"Rajesh just listed his famous chole bhature."
12 neighbors have ordered from him this month.
```

**Notification copy examples (Tier 3 -- Social):**

```
"Priya just earned the 'Trusted Cook' badge!"
She has had 5 happy neighbors. Check out her dishes.

"3 neighbors tried Rajesh's food this week."
Here is what they are saying.
```

**Smart suppression rules:**
- If a user has not opened the last 3 notifications, automatically downgrade them to weekly digest only.
- If a user opens the app organically before a scheduled notification fires, cancel the notification. They do not need it.
- Never send notifications during 10pm-8am unless the user has explicitly opted in.
- Never stack notifications. If 3 would fire within an hour, batch them into one: "3 new things happened near you."

**User control:**
- Notification preferences are accessible from profile, with simple toggles:
  - "New dishes nearby" -- On/Off
  - "Messages" -- Always On (transactional, cannot disable)
  - "Community updates" -- On/Off
  - "Weekly roundup" -- On/Off
- Default: Tier 1 and Tier 2 on. Tier 3 and 4 off. User can adjust after first week.

### 3.3 Gamification -- Subtle, Earned, Never Cheesy

**Design principle**: Gamification in GharKa is not about points and leaderboards. It is about social proof and identity. Badges answer the question "Can I trust this person?" not "How many points do I have?"

#### Seller Badges

| Badge | Criteria | Visual | Purpose |
|---|---|---|---|
| **Active This Week** | At least 1 listing in the past 7 days | Small green dot on profile | Signals freshness and reliability. Buyers know this cook is currently active. |
| **Quick Responder** | Average reply time under 30 minutes (last 10 chats) | Small clock icon on profile | Reduces buyer anxiety about being left on read. |
| **Trusted Cook** | 5 or more thumbs-up ratings | Small shield icon on profile and listings | The primary trust signal. This is the badge that converts hesitant buyers. |
| **Neighborhood Favorite** | 15+ unique buyers with thumbs-up | Highlighted profile card in search results | Aspirational for sellers. Strong social proof for buyers. |
| **GharKa Pioneer** | Among the first 50 sellers in a locality | Small star on profile | Rewards early adopters. Creates a sense of history. |

#### Buyer Badges

| Badge | Criteria | Visual | Purpose |
|---|---|---|---|
| **Food Explorer** | Ordered from 10 different sellers | Visible only on buyer's own profile | Encourages trying new cooks, not just repeat ordering from one. |
| **Community Supporter** | Left 10+ thumbs-up ratings | Small heart on profile | Incentivizes leaving feedback, which is the lifeblood of the trust system. |
| **Regular** | Ordered 3+ times from the same seller | Visible to that specific seller only | Lets sellers know who their loyal customers are. Encourages personalized service. |

#### Streaks (Very Subtle)

Streaks are visible only to the user themselves, on their own profile. They are never public, never competitive, and never punitive.

```
Profile Section: "Your GharKa Activity"

This week: [Mon][Tue][Wed][Thu][Fri][Sat][Sun]
            [x]  [x]  [x]  [ ]  [ ]  [ ]  [ ]

"3-day streak! You have been active 3 days in a row."
```

**Critical rule**: If a streak breaks, we NEVER say "You lost your streak!" Instead, we simply reset the counter silently. No guilt. No loss aversion manipulation.

#### Social Proof Indicators

Social proof is the single most powerful trust tool in GharKa. It appears in three places:

1. **On listings**: "12 neighbors ordered from Priya this week."
2. **On seller profiles**: "Trusted by 28 people in your area."
3. **In search results**: Listings with more social proof appear slightly higher (but never to the point of burying new sellers -- see Section 7).

### 3.4 The Engagement Flywheel

```
  Seller lists dish
       |
       v
  Buyer discovers dish (via feed, notification, or search)
       |
       v
  Buyer messages seller (chat)
       |
       v
  Exchange happens (food for payment, outside app)
       |
       v
  Buyer leaves thumbs-up -----> Seller gets trust signal
       |                              |
       v                              v
  Buyer tells friend          Seller is motivated to list again
       |                              |
       v                              v
  New user joins             More listings on the platform
       |                              |
       +---------> FLYWHEEL <---------+
```

Every behavioral nudge in this document exists to lubricate one specific step in this flywheel.

---

## 4. Trust-Building Nudges

### 4.1 The Trust Problem

Buying food from a stranger is an inherently high-trust action. The food goes into your body. There is no corporate guarantee. No refund policy. The entire trust model of GharKa rests on three pillars:

1. **Proximity** -- "This person lives near me. They are not anonymous."
2. **Social proof** -- "Other people I might know have tried this and liked it."
3. **Transparency** -- "I can see who this person is, how active they are, and what others say."

### 4.2 Soft Ratings: Thumbs Up/Down, Not Stars

**Why not stars?**

Stars create two problems:
1. For buyers: Rating anxiety. "Was it a 3 or a 4? I don't want to be unfair."
2. For sellers: A 3.8 vs 4.2 distinction is meaningless for homemade food but feels devastating.

**Thumbs up/down is binary, low-pressure, and honest.**

**Implementation:**

After a buyer marks an order as complete, a simple prompt appears:

```
"How was Priya's dal makhani?"

[Thumbs Up]    [Thumbs Down]    [Skip]

(Small text below: "This helps your neighbors find great food.")
```

**If Thumbs Up**: Counted toward seller's trust metrics. Buyer sees: "Thanks! Priya will appreciate that."

**If Thumbs Down**: NOT displayed publicly. Instead, it triggers a private follow-up:

```
"Sorry to hear that. Want to tell us what happened?"

[ ] Food quality was not as expected
[ ] Seller was unresponsive
[ ] Pickup/delivery issue
[ ] Other: [text field]

[Send Feedback]    [No thanks]

(Small text: "This goes to us, not the seller. It helps us keep
 the community healthy.")
```

**Why thumbs-down is private**: Public negative ratings on homemade food in a small community would be socially devastating and discourage sellers from participating. Private feedback lets GharKa identify genuinely problematic sellers (pattern of thumbs-down) without creating a hostile review culture.

**Seller visibility**: Sellers see their total thumbs-up count but NOT individual thumbs-down feedback. They see: "28 neighbors liked your food." They do not see: "2 neighbors did not like it."

### 4.3 Seller Profile Trust Signals

A seller's profile is the primary trust-building surface. It must answer the buyer's unspoken question: "Can I trust this person's food?"

**Profile elements, in order of importance:**

```
+-------------------------------------------+
|  [Photo]  Priya Sharma                    |
|           Sector 15, Noida                |
|           [Trusted Cook Badge]            |
|                                           |
|  "I have been cooking Rajasthani food     |
|   for my family for 20 years. Now I am    |
|   sharing it with my neighbors!"          |
|                                           |
|  28 neighbors trust Priya's cooking       |
|  Active this week  |  Quick responder     |
|                                           |
|  --- Current Listings ---                 |
|  [Dal Baati]  [Ghevar]  [Ker Sangri]     |
|                                           |
|  --- What Neighbors Say ---              |
|  "Best dal baati outside Rajasthan!"      |
|  "Always fresh and on time."              |
+-------------------------------------------+
```

**Key trust elements:**
- **Real name and locality**: Not anonymous. This is a neighbor.
- **Bio**: Personal story creates human connection.
- **"X neighbors trust this cook"**: Aggregated social proof.
- **Activity badges**: "Active this week" and "Quick responder" signal reliability.
- **Short testimonials**: Optional one-line reviews from buyers who left thumbs-up. Buyers can add a short comment with their thumbs-up.

### 4.4 Community Endorsements

Beyond thumbs-up, buyers can "endorse" a seller with a one-line comment. This is optional, never prompted aggressively, and appears on the seller's profile.

**Prompt (only after thumbs-up):**

```
"Want to add a quick note for other neighbors?"
[Text field, 100 char limit]
[Post]    [Skip]
```

**Why this works**: Endorsements are voluntary, positive-only, and attributed to real neighbors. They function like word-of-mouth recommendations digitized.

### 4.5 New Seller Trust Bootstrapping

New sellers have zero social proof. This is the cold-start trust problem. Solutions:

1. **"New in Your Area" tag**: New sellers (first 2 weeks) get a special tag that signals freshness, not untrustworthiness. Copy: "New on GharKa -- be their first customer!"

2. **Photo quality prompt**: During listing creation, we gently coach sellers on photo quality because a good photo is the strongest trust signal for a new seller:
   ```
   "Tip: Dishes with clear, well-lit photos get 3x more interest."
   ```

3. **First-listing boost**: A new seller's first listing gets slightly elevated placement in nearby feeds for 24 hours. This is transparent and limited.

4. **Seller verification (optional)**: Sellers can optionally verify their phone number and add a profile photo. Verified sellers get a small checkmark. This is never required but gently encouraged:
   ```
   "Adding a profile photo helps your neighbors trust you.
    People like to know who is cooking their food."
   ```

---

## 5. Contextual "How It Works" Integration

### 5.1 Philosophy

Traditional tutorials front-load information when the user has no context to understand it. GharKa takes the opposite approach: explain things at the exact moment the user needs to know them.

The user should never think "How does this work?" because the answer always appears one second before they would have asked.

### 5.2 Contextual Help Map

Every "how it works" moment is tied to a specific user action, not a screen visit.

| User Action | Context | Help That Appears | Format | Appears |
|---|---|---|---|---|
| First time seeing a listing on the feed | User does not know listings are tappable | "Tap any dish to see details and chat with the cook." | Coach mark pointing to listing | Once only |
| First time opening a listing detail page | User sees price, photo, description but may not know next step | "Interested? Chat with [Cook Name] to arrange your order." | Inline text above the chat button, slightly highlighted | Once only |
| First time tapping "Chat" on a listing | User enters chat but may not know what to discuss | "This is where you work out the details -- quantity, pickup time, and payment. It is all between you and [Cook Name]." | Inline banner at top of chat, dismissible | Once only |
| First time seeing "Payment" mentioned anywhere | User may expect in-app payment | "GharKa does not handle payments. You and [Cook Name] decide how to pay -- cash, UPI, whatever works for both of you." | Tooltip near any payment-related context | Once only |
| First time creating a listing (seller) | Seller may not know what makes a good listing | "A clear photo, a fair price, and a pickup window -- that is all you need." | Inline helper text on the creation form | Persistent on form (not a tooltip) |
| First time receiving a message (seller) | Seller gets their first buyer message and may not know the flow | "Great, someone is interested! Chat with them to arrange pickup and payment." | Inline banner at top of chat | Once only |
| First time buyer marks order as "Done" | User may not know what happens after exchange | "How was it? A quick thumbs-up helps your neighbors find great food." | Post-completion prompt | Once only |
| User tries to browse without location permission | Core feature requires location | "GharKa shows you food from neighbors nearby. To find dishes near you, we need your location." | Bottom sheet with explanation and permission button | Until resolved |
| User has location set but radius is too narrow | No results because of narrow radius | "No dishes in your immediate area right now. Try expanding your search radius." | Inline helper with radius adjustment button | Dynamic |

### 5.3 Tone and Format Rules for Contextual Help

1. **Never say "tutorial" or "guide" or "learn how."** These words signal effort. Instead, help should feel like a friend whispering a quick tip.

2. **Always address the user's immediate question**, not the system's architecture. Bad: "GharKa uses a peer-to-peer model." Good: "You and the cook decide how to pay."

3. **Use the seller's actual name** in contextual help whenever possible. "Chat with Priya" is warmer than "Chat with the seller."

4. **Keep it to one sentence.** If it takes two, the feature is too complex and needs redesign, not more explanation.

5. **Dismissible, never blocking.** Contextual help should never prevent the user from taking action. It should sit alongside the action, not in front of it.

---

## 6. Retention Mechanics

### 6.1 What Keeps Sellers Listing Food?

Sellers are the supply side. Without them, there is no marketplace. Understanding their psychology is critical:

**Seller motivations (in order of importance):**
1. **Income**: Even small amounts. Rs 500-2000/week is meaningful.
2. **Recognition**: Being known as a great cook in the community.
3. **Social connection**: Meeting neighbors, feeling useful.
4. **Creative outlet**: Sharing recipes and specialties.

**Retention nudges for sellers:**

| Seller State | Nudge | Timing |
|---|---|---|
| Active, listing regularly | Positive reinforcement: "You had 8 orders this week! Your neighbors love your cooking." | Weekly, Sunday evening |
| Active, but orders are slowing | Gentle suggestion: "Tip: Cooks who add a new dish every week see 40% more interest. What else do you make?" | After 2 weeks of declining orders |
| Listed once, never again | Encouragement: "Your dal makhani got 3 views! People are curious. Try listing it again this week?" | 5 days after first listing if no second listing |
| Dormant for 1 week | Soft check-in: "It has been a bit since you listed something. Your neighbors in [Area] would love to see what you are cooking." | Day 7 of inactivity |
| Dormant for 2+ weeks | Community pull: "Your neighbors miss your cooking, [Name]! 5 people viewed your profile this week." (Only if true.) | Day 14, only if profile view data supports it |
| Dormant for 1+ month | Gentle, non-guilt re-engagement: "A lot has changed on GharKa! 12 new cooks joined [Area]. Come see what is happening." | Day 30, max 1 message |
| Dormant 2+ months | Stop messaging entirely. | Respect the silence. |

**Key rule**: After 2 months of inactivity with no response to re-engagement, we stop all outreach. We do not pester. If the user returns on their own, we welcome them warmly: "Welcome back! Here is what is new in your neighborhood."

### 6.2 What Keeps Buyers Coming Back?

Buyers are the demand side. Their retention is driven by:

**Buyer motivations:**
1. **Convenience**: Homemade food without cooking.
2. **Variety**: Different cuisines from different neighbors.
3. **Discovery**: The joy of finding a hidden gem cook nearby.
4. **Community**: Feeling connected to where they live.

**Retention mechanisms for buyers:**

| Mechanism | How It Works |
|---|---|
| **Daily menu refresh** | The feed changes daily because food is temporal. Natural reason to return. |
| **"Follow" a cook** | Buyers can follow sellers to get notified when they list new dishes. This creates a personalized feed over time. |
| **Seasonal and festival tie-ins** | "Diwali special: See what your neighbors are making this week." Ties into cultural moments that are genuinely relevant to homemade food. |
| **"Tried and loved" bookmarking** | Buyers can bookmark dishes/sellers for easy reordering. "Your favorites" section on profile. |
| **Neighborhood leaderboard (opt-in)** | "Top dishes in [Area] this week." Based on order volume and thumbs-up. Only visible to users who opt into community features. |

### 6.3 Community Health Indicators

These are internal metrics the GharKa team monitors. They are not visible to users.

| Indicator | Healthy Range | Warning Threshold | Action If Below Threshold |
|---|---|---|---|
| **Seller-to-buyer ratio** | 1:5 to 1:15 | Below 1:20 (not enough sellers) | Run targeted seller acquisition in that area |
| **Listing frequency** | 3+ listings/week in a locality | Below 1/week | Nudge dormant sellers; bootstrap with community events |
| **Chat-to-completion rate** | 60%+ of chats result in a completed exchange | Below 40% | Investigate friction in the chat-to-exchange flow |
| **Thumbs-up rate** | 80%+ of completed exchanges get a rating | Below 60% | Adjust the rating prompt timing or copy |
| **Repeat buyer rate** | 30%+ of buyers order a second time within 2 weeks | Below 20% | Investigate food quality, variety, or trust issues |
| **Notification open rate** | 15%+ | Below 8% | Reduce notification frequency; improve copy relevance |
| **7-day retention (buyers)** | 40%+ | Below 25% | Audit onboarding flow; check for empty-feed problems |
| **7-day retention (sellers)** | 50%+ | Below 30% | Audit seller experience; check if sellers are getting orders |

### 6.4 Re-Engagement Sequences

**Dormant Buyer Sequence:**

```
Day 7 (no app open):
Channel: Push notification
Message: "3 new dishes just popped up in [Area]. Your neighbors have been busy!"
Goal: Curiosity-driven return.

Day 14 (still dormant):
Channel: Push notification
Message: "Priya listed her famous biryani again. Thought you'd want to know."
(Only if user previously interacted with Priya. Otherwise, use top-rated local seller.)
Goal: Personalized, relevant pull.

Day 30 (still dormant):
Channel: Push notification (final)
Message: "A lot is cooking in [Area]! 8 new cooks joined since you last visited."
Goal: FOMO-free community update.

Day 30+:
Channel: None
Action: Stop all notifications. Move user to "dormant" segment. If they return
        organically, show a warm welcome-back state (see Micro-Copy Bank).
```

**Dormant Seller Sequence:**

```
Day 7 (no listing):
Channel: Push notification
Message: "Your neighbors in [Area] are hungry! What are you cooking this week?"
Goal: Gentle prompt, not guilt.

Day 14 (still no listing):
Channel: Push notification
Message: "Your neighbors miss your cooking, [Name]! It has been 2 weeks."
(Only send if the seller has had at least 1 completed order before.)
Goal: Social connection pull.

Day 30 (still no listing):
Channel: Push notification (final)
Message: "5 new cooks joined [Area] -- come see what is happening on GharKa!"
Goal: Community-level update. No personal guilt.

Day 30+:
Channel: None
Action: Stop all notifications.
```

---

## 7. Behavioral Anti-Patterns -- Hard Rules

These are non-negotiable. No feature, no A/B test, no growth metric justifies violating these rules.

### 7.1 No Dark Patterns

| Anti-Pattern | Example of What We Will NEVER Do | Why |
|---|---|---|
| **Confirmshaming** | "No thanks, I don't care about great food." on a dismiss button | Manipulative and disrespectful. Dismiss buttons say "No thanks" or "Skip." Period. |
| **Hidden unsubscribe** | Burying notification settings 4 levels deep | Notification settings are accessible in 2 taps from any screen. |
| **Forced actions** | "You must leave a rating before you can browse again" | Ratings are always optional. Always. |
| **Bait and switch** | Showing a dish that is no longer available to get the user to open the app | If a listing has expired, the notification is cancelled before it sends. |

### 7.2 No Artificial Urgency

| What We Will NEVER Do | What We Do Instead |
|---|---|
| "Only 2 servings left! Order now!" (if we do not actually know inventory) | "Priya listed 5 servings of biryani, available until 2pm." (Only if the seller actually specified quantity.) |
| "This deal expires in 10 minutes!" | Food listings have natural time windows set by the cook. We show those honestly. |
| Countdown timers on anything | The only time-related element is the seller's stated pickup window, which is real. |

### 7.3 No Fake Scarcity

| What We Will NEVER Do | What We Do Instead |
|---|---|
| "23 people are viewing this right now!" | "12 neighbors ordered from Priya this week." (Actual, verified data.) |
| Artificially limiting access to listings | All listings are visible to all users within radius. |
| "Exclusive" or "VIP" tiers | GharKa is a community app. Everyone is equal. |

### 7.4 Respect User Time and Attention

| Rule | Implementation |
|---|---|
| Notification budget: Max 3 non-transactional notifications per day | Hard-coded cap in the notification service. Cannot be overridden by any feature. |
| Auto-downgrade if ignored | If 3 consecutive non-transactional notifications are not opened, automatically switch to weekly digest. |
| Quiet hours | No notifications 10pm-8am by default. User can adjust. |
| No notification for notification's sake | Every notification must contain actionable, relevant information. "Check out GharKa today!" is never acceptable. |
| Easy global mute | One-tap "Mute all notifications" option in settings. |

### 7.5 No Manipulation of New Sellers

| What We Will NEVER Do | What We Do Instead |
|---|---|
| Inflate view counts to make sellers feel popular | Show honest numbers, even if they are small. "2 neighbors saw your dish" is honest. |
| Send fake interest messages | All messages are from real users. |
| Over-promise earnings | No "Earn Rs 10,000/month from home!" messaging. We say: "Share your cooking with neighbors." |

---

## 8. Micro-Copy Bank

### 8.1 Empty States

**Empty Home Feed (New User, No Listings Nearby)**
```
Headline: "Your neighborhood kitchen is warming up."
Body: "No one nearby has listed food yet -- but you could be the first!
       Or invite a friend who loves to cook."
Primary CTA: [List Something I Made]
Secondary CTA: [Invite a Cook]
```

**Empty Home Feed (Returning User, No Listings Today)**
```
Headline: "Nothing cooking right now."
Body: "Your neighbors have not listed anything today yet.
       Check back around lunchtime -- that is when things usually pick up."
CTA: [Set a Reminder for 12pm]
```

**Empty Search Results**
```
Headline: "Nothing matches that search."
Body: "Try a broader search, or browse what is available today."
CTA: [See All Listings]
```

**Empty Seller Dashboard (New Seller, No Orders Yet)**
```
Headline: "Your orders will show up here."
Body: "Once a neighbor places an order, you will see it right here.
       In the meantime, make sure your listing has a great photo!"
CTA: [Review My Listing]
```

**Empty Chat List**
```
Headline: "Your conversations will appear here."
Body: "When you message a cook about their dish -- or a buyer messages you --
       it will show up right here."
```

**Empty Favorites / Bookmarks**
```
Headline: "Save the dishes you love."
Body: "Tap the heart on any listing to save it here for easy access next time."
```

### 8.2 First-Time Achievements

**First Listing Created (Seller)**
```
"You are live! Your neighbors within 5km can now see your dish.
 We will let you know the moment someone reaches out."
```

**First Order Received (Seller)**
```
"Your first order! [Buyer Name] wants your [Dish Name].
 Head to chat to work out the details."
```

**First Order Completed (Seller)**
```
"Someone just enjoyed your cooking. That is what GharKa is all about.
 Keep going -- your neighbors are discovering you."
```

**First Order Placed (Buyer)**
```
"Nice! You just messaged [Cook Name] about [Dish Name].
 They will get back to you soon. Keep an eye on your chats."
```

**First Order Completed (Buyer)**
```
"Your first GharKa meal! How was it?"
[Thumbs Up]  [Thumbs Down]  [Skip for Now]
```

**First Thumbs-Up Given (Buyer)**
```
"Thanks! [Cook Name] will appreciate that.
 Your feedback helps the whole community find great food."
```

**First Thumbs-Up Received (Seller)**
```
"[Buyer Name] gave your [Dish Name] a thumbs-up!
 You are building a reputation. Keep it going."
```

### 8.3 Trust and Badge Moments

**"Trusted Cook" Badge Earned (Seller, 5 Thumbs-Up)**
```
"You earned the Trusted Cook badge!
 5 neighbors have given you a thumbs-up. This badge now shows on all your
 listings, helping new customers feel confident ordering from you."
```

**"Quick Responder" Badge Earned (Seller)**
```
"You are a Quick Responder!
 You reply to messages fast, and your neighbors notice.
 This badge now appears on your profile."
```

**"Food Explorer" Badge Earned (Buyer, 10 Unique Sellers)**
```
"Food Explorer unlocked!
 You have tried dishes from 10 different cooks. You are officially
 one of the most adventurous eaters in [Area]."
```

**"Community Supporter" Badge Earned (Buyer, 10 Ratings)**
```
"Community Supporter badge earned!
 Your ratings help neighbors find great food.
 Thank you for keeping the community strong."
```

### 8.4 Chat and Interaction States

**Chat Started (Buyer to Seller)**
```
System message at top of new chat:
"This is the start of your conversation with [Cook Name].
 Work out the details here -- quantity, pickup time, and payment method.
 GharKa does not handle payments, so arrange that directly."
```

**Seller Has Not Responded in 2+ Hours**
```
Inline helper for buyer (subtle, not alarming):
"[Cook Name] has not replied yet. They may be busy cooking!
 They usually respond within [avg response time]."
```

**Order Marked as Complete**
```
System message:
"Order complete! We hope you enjoyed it.
 If you have a moment, a thumbs-up really helps [Cook Name]."
```

### 8.5 Location and Permissions

**Location Not Shared**
```
Headline: "Where are you?"
Body: "GharKa shows you food from neighbors nearby.
       To find dishes near you, we need your location."
CTA: [Share My Location]
Reassurance: "We only use your location to show you nearby food.
              We never share it with anyone."
```

**Location Shared But No Listings Within Radius**
```
Headline: "No dishes nearby right now."
Body: "There are no listings within 5km of you at the moment.
       This could mean your area is new to GharKa."
CTA: [Be the First Cook in Your Area]  [Invite Your Neighbors]
```

**Location Permission Denied After Initial Prompt**
```
Subtle banner at top of feed:
"We could not find your location. You can browse, but results may
 not be relevant to your area."
[Update Location Settings]
```

### 8.6 Re-Engagement and Welcome Back

**Welcome Back (Buyer, Dormant 1-4 Weeks)**
```
Banner at top of feed:
"Welcome back! Here is what is new in [Area]:
 [X] new cooks joined  |  [Y] dishes listed today"
[Dismiss]
```

**Welcome Back (Seller, Dormant 1-4 Weeks)**
```
Banner at top of dashboard:
"Welcome back, [Name]! [X] people viewed your profile while
 you were away. Ready to list something new?"
[Create Listing]  [Dismiss]
```

**Welcome Back (Any User, Dormant 1+ Month)**
```
Full-screen welcome-back card:
Headline: "Good to see you again!"
Body: "A lot has happened on GharKa since you last visited.
       [X] new cooks joined [Area], and your neighbors have been busy.
       Let's see what is cooking today."
[Explore]
```

### 8.7 Error and Edge Cases

**Network Error While Browsing**
```
"Could not load listings right now. Check your connection and try again."
[Retry]
```

**Message Failed to Send**
```
"That message did not go through. Tap to retry."
[Retry]
```

**Listing Creation Failed**
```
"We could not publish your listing right now. Your draft is saved --
 try again in a moment."
[Retry]
```

**Photo Upload Failed**
```
"That photo did not upload. Try a smaller image, or check your connection."
[Try Again]
```

### 8.8 Seasonal and Cultural Micro-Copy

**Festive Season (Diwali, Eid, Christmas, Pongal, etc.)**
```
Feed banner:
"It is [Festival] season! See what your neighbors are making
 to celebrate."
[Explore Festive Dishes]
```

**Weekend Morning**
```
Push notification (only if user has opted in to Tier 4):
"Lazy Sunday? Your neighbors are cooking.
 [X] breakfast dishes available near you."
```

**Rainy Day (if weather API integrated)**
```
Push notification:
"Perfect weather for something warm.
 [Cook Name] just listed hot pakoras near you."
```

### 8.9 Seller Encouragement and Coaching

**Listing Has Low Views (After 24 Hours)**
```
Subtle in-app nudge on seller dashboard:
"Your [Dish Name] has had [X] views so far.
 Tip: Updating the photo or lowering the price can help."
[Edit Listing]
```

**Listing Has Views But No Messages**
```
"[X] neighbors saw your [Dish Name] but no one has reached out yet.
 Sometimes a lower price or a more detailed description helps.
 Here is what popular listings in your area look like:"
[See Examples]
```

**Seller Completed 5 Orders**
```
"5 orders done! You are becoming a regular in [Area].
 Your neighbors are starting to recognize your cooking."
```

**Seller Completed 25 Orders**
```
"25 orders and counting. You are one of the most active cooks
 in [Area]. Thank you for making this community delicious."
```

---

## 9. Technical Implementation Notes

### 9.1 User Preference Schema

```typescript
interface UserPreferences {
  // Communication
  notificationChannels: {
    push: boolean;         // Default: true
    sms: boolean;          // Default: false (opt-in only)
    email: boolean;        // Default: false (opt-in only)
  };
  quietHours: {
    start: string;         // Default: "22:00"
    end: string;           // Default: "08:00"
  };

  // Engagement
  notificationTier: 'all' | 'important' | 'digest_only' | 'transactional_only';
  digestFrequency: 'daily' | 'weekly' | 'never';  // Default: 'daily'

  // Behavioral
  onboardingCompleted: boolean;
  coachMarksShown: string[];    // IDs of coach marks already dismissed
  tooltipsShown: string[];      // IDs of tooltips already dismissed

  // Preferences learned from behavior (auto-updated)
  engagementPattern: {
    peakActivityHours: number[];  // e.g., [9, 12, 18] -- when they are most active
    averageSessionDuration: number;
    preferredDishCategories: string[];
    followedSellers: string[];
  };

  // Anti-annoyance
  consecutiveIgnoredNotifications: number;  // Auto-downgrade if >= 3
  lastNotificationSent: Date;
  lastAppOpen: Date;
  dormancyStatus: 'active' | 'cooling' | 'dormant' | 'churned';
}
```

### 9.2 Nudge Sequence Engine

```typescript
interface NudgeSequence {
  id: string;
  trigger: NudgeTrigger;
  steps: NudgeStep[];
  exitConditions: ExitCondition[];
}

interface NudgeStep {
  delayDays: number;       // Days after trigger or previous step
  channel: 'push' | 'sms' | 'email' | 'in_app';
  messageTemplate: string; // With {{variable}} placeholders
  ctaLabel: string;
  ctaAction: string;       // Deep link or action ID
  suppressIf: SuppressionRule[];
}

interface SuppressionRule {
  type: 'user_active_today'
      | 'notification_budget_exceeded'
      | 'quiet_hours'
      | 'consecutive_ignores_exceeded'
      | 'user_completed_target_action';
  value?: any;
}

interface ExitCondition {
  type: 'user_completed_action'
      | 'user_opted_out'
      | 'max_attempts_reached'
      | 'user_dormant_too_long';
  action?: string;
  maxAttempts?: number;
  maxDormancyDays?: number;
}
```

### 9.3 Example: Dormant Buyer Re-Engagement Sequence

```typescript
const dormantBuyerSequence: NudgeSequence = {
  id: 'buyer_reengagement_v1',
  trigger: {
    type: 'user_inactivity',
    days: 7,
    userType: 'buyer'
  },
  steps: [
    {
      delayDays: 0,   // Day 7 of inactivity
      channel: 'push',
      messageTemplate: '{{newDishCount}} new dishes just popped up in {{area}}. Your neighbors have been busy!',
      ctaLabel: 'See What\'s New',
      ctaAction: 'deeplink://home',
      suppressIf: [
        { type: 'quiet_hours' },
        { type: 'notification_budget_exceeded' },
        { type: 'user_active_today' }
      ]
    },
    {
      delayDays: 7,   // Day 14 of inactivity
      channel: 'push',
      messageTemplate: '{{favoriteSeller}} listed {{recentDish}} again. Thought you\'d want to know.',
      ctaLabel: 'See Listing',
      ctaAction: 'deeplink://listing/{{listingId}}',
      suppressIf: [
        { type: 'quiet_hours' },
        { type: 'consecutive_ignores_exceeded' },
        { type: 'user_active_today' }
      ]
    },
    {
      delayDays: 16,  // Day 30 of inactivity
      channel: 'push',
      messageTemplate: 'A lot is cooking in {{area}}! {{newCookCount}} new cooks joined since you last visited.',
      ctaLabel: 'Explore',
      ctaAction: 'deeplink://home',
      suppressIf: [
        { type: 'quiet_hours' },
        { type: 'consecutive_ignores_exceeded' }
      ]
    }
  ],
  exitConditions: [
    { type: 'user_completed_action', action: 'app_open' },
    { type: 'user_opted_out' },
    { type: 'max_attempts_reached', maxAttempts: 3 },
    { type: 'user_dormant_too_long', maxDormancyDays: 60 }
  ]
};
```

### 9.4 Notification Budget Enforcement

```typescript
const NOTIFICATION_BUDGET = {
  maxNonTransactionalPerDay: 3,
  maxReengagementPerWeek: 1,
  autoDowngradeAfterIgnores: 3,
  quietHoursDefault: { start: 22, end: 8 },
  batchWindowMinutes: 60  // Batch notifications within this window into one
};

function canSendNotification(
  userId: string,
  tier: NotificationTier,
  userPrefs: UserPreferences
): boolean {
  // Transactional notifications (direct messages, etc.) always pass
  if (tier === 'transactional') return true;

  // Check quiet hours
  const currentHour = new Date().getHours();
  if (currentHour >= userPrefs.quietHours.start ||
      currentHour < userPrefs.quietHours.end) {
    return false;
  }

  // Check daily budget
  const todayCount = getTodayNonTransactionalCount(userId);
  if (todayCount >= NOTIFICATION_BUDGET.maxNonTransactionalPerDay) {
    return false;
  }

  // Check auto-downgrade
  if (userPrefs.consecutiveIgnoredNotifications >=
      NOTIFICATION_BUDGET.autoDowngradeAfterIgnores) {
    // Automatically switch user to digest-only
    updateUserPreferences(userId, {
      notificationTier: 'digest_only'
    });
    return false;
  }

  // Check if user opened the app today (no need to notify active users)
  if (isUserActiveToday(userId) && tier !== 'transactional') {
    return false;
  }

  return true;
}
```

### 9.5 Coach Mark Tracking

```typescript
// Every coach mark has a unique ID. Once dismissed, it is recorded
// in the user's profile and never shown again.

const COACH_MARKS = {
  FEED_FIRST_LISTING: 'cm_feed_first_listing',
  LISTING_DETAIL_CHAT: 'cm_listing_detail_chat',
  CHAT_FIRST_MESSAGE: 'cm_chat_first_message',
  POST_ORDER_RATING: 'cm_post_order_rating',
  SELLER_PHOTO_TIP: 'cm_seller_photo_tip',
  SELLER_LISTING_LIVE: 'cm_seller_listing_live',
  SELLER_FIRST_MESSAGE: 'cm_seller_first_message'
} as const;

function shouldShowCoachMark(
  markId: string,
  userPrefs: UserPreferences
): boolean {
  return !userPrefs.coachMarksShown.includes(markId);
}

function dismissCoachMark(
  userId: string,
  markId: string
): void {
  appendToUserPreferences(userId, 'coachMarksShown', markId);
}
```

### 9.6 Sprint Nudge for Sellers (Momentum Builder)

```typescript
// When a seller has multiple small actions pending (update photo,
// respond to messages, check stats), instead of showing a task list,
// offer a time-boxed micro-sprint.

function generateSellerSprintNudge(
  pendingActions: SellerAction[],
  sellerProfile: UserPreferences
): SprintNudge | null {
  // Only offer sprints if there are 3+ pending actions
  if (pendingActions.length < 3) return null;

  // Pick the single easiest action as the entry point
  const easiest = pendingActions
    .sort((a, b) => a.estimatedSeconds - b.estimatedSeconds)[0];

  return {
    channel: 'in_app',
    message: `You have a few quick things to take care of. ` +
             `Let's start with the easiest one -- it will take about ` +
             `${Math.ceil(easiest.estimatedSeconds / 60)} minute.`,
    actionButton: `Let's Do It`,
    action: easiest.deepLink,
    // After completion, offer continuation or exit
    onComplete: {
      celebration: `Done! That was quick.`,
      continueOption: `Want to knock out one more?`,
      exitOption: `All good for now.`
    }
  };
}
```

---

## Appendix A: Nudge Sequence Summary Table

| Sequence Name | Target User | Trigger | Steps | Max Duration | Exit On |
|---|---|---|---|---|---|
| Buyer Onboarding | New buyer | Signup complete | 3 coach marks over first session | 1 session | All marks seen |
| Seller Onboarding | New seller | First listing created | 3 coach marks over first 3 days | 3 days | All marks seen |
| Buyer Re-engagement | Dormant buyer | 7 days inactive | 3 push notifications over 30 days | 30 days | App open or 60 days total dormancy |
| Seller Re-engagement | Dormant seller | 7 days no listing | 3 push notifications over 30 days | 30 days | New listing or 60 days total dormancy |
| Post-Order Rating | Buyer | Order marked complete | 1 in-app prompt | Immediate | Rating given or skipped |
| Seller Milestone | Active seller | 5th, 25th, 50th order | 1 in-app celebration | Immediate | Seen |
| Badge Earned | Any user | Badge criteria met | 1 in-app notification | Immediate | Seen |
| Weekly Digest | Opted-in users | Every Sunday 6pm | 1 push notification | Recurring | User opts out |

## Appendix B: A/B Testing Roadmap

| Test | Hypothesis | Variants | Primary Metric |
|---|---|---|---|
| Onboarding slides vs. no slides | Slides improve 7-day retention | A: 3 slides, B: Skip to feed | 7-day retention rate |
| Rating prompt timing | Prompting 1 hour after exchange increases rating rate | A: Immediate, B: 1 hour later | Rating completion rate |
| Notification copy style | Personal names increase open rates | A: "New dish near you", B: "Priya just listed biryani" | Notification open rate |
| Sprint nudge for sellers | Micro-sprints increase listing frequency | A: Task list, B: Sprint nudge | Listings per week per seller |
| Badge visibility | Visible badges increase buyer trust | A: Badges shown, B: No badges | Chat initiation rate on badged vs unbadged sellers |
| Empty state CTA | "List something" vs "Invite a cook" | A: Seller CTA primary, B: Invite CTA primary | New listings created from empty state |

## Appendix C: Ethical Review Checklist

Before launching any new nudge or notification, it must pass this checklist:

- [ ] Does this nudge provide genuine value to the user, or only to our metrics?
- [ ] Would the user be grateful they received this? Or annoyed?
- [ ] Is every claim in the copy true and verified? (No inflated numbers.)
- [ ] Can the user easily opt out of or dismiss this?
- [ ] Does this respect quiet hours and notification budgets?
- [ ] Does this work for the user's benefit even if it hurts our engagement numbers?
- [ ] Have we avoided all confirmshaming, artificial urgency, and fake scarcity?
- [ ] Would we be comfortable if a journalist wrote about this nudge?

If any answer is "No," the nudge does not ship.

---

*End of Behavioral Engagement System Document*
*GharKa -- Real food from real neighbors.*
