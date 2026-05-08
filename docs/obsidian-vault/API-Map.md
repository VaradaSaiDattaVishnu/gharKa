# API Endpoint Map

## Source Document
Full details: [[../MASTER_ARCHITECTURE.md#6-api-endpoints]]

## Auth (Public)
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/verify-firebase` | Exchange Firebase token for app JWT |
| POST | `/api/auth/refresh` | Rotate refresh token |
| POST | `/api/auth/logout` | Invalidate refresh token |
| POST | `/api/auth/onboard` | Set name, avatar, role after first login |

## Users (Authenticated)
| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/api/users/me` | Any | Get current user profile |
| PATCH | `/api/users/me` | Any | Update name/avatar |
| PATCH | `/api/users/me/location` | Any | Update location |
| PATCH | `/api/users/me/role` | Any | Switch buyer/seller role |

## Listings (Authenticated)
| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/api/listings` | Any | Browse (5km filter, pagination) |
| GET | `/api/listings/:id` | Any | Detail view |
| POST | `/api/listings` | Seller | Create listing |
| PATCH | `/api/listings/:id` | Seller (owner) | Update listing |
| DELETE | `/api/listings/:id` | Seller (owner) / Admin | Remove listing |
| PATCH | `/api/listings/:id/toggle` | Seller (owner) | Activate/deactivate |

## Orders
| Method | Path | Role | Purpose |
|--------|------|------|---------|
| POST | `/api/orders` | Buyer | Place order |
| GET | `/api/orders` | Any | My orders (buyer/seller view) |
| GET | `/api/orders/:id` | Owner | Order detail |
| PATCH | `/api/orders/:id/status` | Owner | Update status |

## Messages (Socket.io + REST fallback)
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/messages/conversations` | List conversations |
| GET | `/api/messages/:orderId` | Messages for an order |
| POST | `/api/messages/:orderId` | Send message (REST fallback) |
| PATCH | `/api/messages/:orderId/read` | Mark as read |

## Admin
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/status` | Suspend/activate user |
| GET | `/api/admin/listings` | All listings (unfiltered) |
| DELETE | `/api/admin/listings/:id` | Force-remove listing |
| GET | `/api/admin/stats` | Platform statistics |

## Upload
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/upload/signature` | Get Cloudinary upload signature |

## Links
- [[Security]] for auth requirements per endpoint
- [[Architecture]] for request/response schemas
- [[UX-Flows]] for screen-to-endpoint mapping
