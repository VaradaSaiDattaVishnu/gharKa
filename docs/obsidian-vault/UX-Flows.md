# UX Flows Map

## Source Document
Full details: [[../GharKa-UX-Research-Document.md]]

## Personas
1. **Priya** (Buyer) - Busy professional, 28-40, high tech proficiency
2. **Lakshmi** (Seller) - Homemaker/cook, 35-55, moderate tech proficiency
3. **Rajesh** (Admin) - Community manager

## Core Flows

### Onboarding (9 screens, 45-75 sec)
Splash -> 3 intro slides -> Phone input -> OTP -> Name+Avatar -> Location -> Role -> Home

### Buyer Flow
Home feed (5km grid) -> Filter/Search -> Food detail -> Request dish -> Chat -> Pickup -> Done

### Seller Flow
Home -> FAB (+) -> Photo+Title+Desc+Price+Qty+Category -> Preview -> Publish -> Orders -> Chat -> Sold

### Admin Flow
Dashboard -> Users -> Listings moderation -> Reports -> Settings

### Chat Flow
Order context header -> Text messages -> Status updates inline

## Tab Structure
| Tab | Buyer | Seller | Both | Admin |
|-----|-------|--------|------|-------|
| 1 | Home/Feed | Home/Feed | Home/Feed | Dashboard |
| 2 | My Orders | My Listings | My Activity | Users |
| 3 | Chat | Chat | Add Listing (+) | Listings |
| 4 | Profile | Profile | Chat | Settings |
| 5 | - | - | Profile | - |

## Screen Count: 33 unique screens
## 3-Tap Ceiling: All primary actions within 3 taps

## Links
- [[Architecture]] for API endpoints per screen
- [[Brand]] for visual treatment per screen
- [[Behavioral]] for nudge placement per screen
- [[Whimsy]] for animations per screen
