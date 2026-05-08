# Security Map

## Source Document
Full details: [[../MASTER_ARCHITECTURE.md#11-security-architecture]]

## Authentication Flow
```
Phone -> Firebase OTP -> Firebase ID Token -> Backend verifies ->
Issues custom JWT (userId, role, location) + Refresh Token
```

## Role-Based Access
| Resource | Buyer | Seller | Admin |
|----------|-------|--------|-------|
| Browse listings | Yes | Yes | Yes |
| Create listing | No | Yes | Yes |
| Place order | Yes | No | Yes |
| Manage own orders | Yes | Yes | Yes |
| Chat | Yes | Yes | Yes |
| Moderate listings | No | No | Yes |
| Manage users | No | No | Yes |
| View platform stats | No | No | Yes |

## Admin Detection
- Admin phone numbers stored in `ADMIN_PHONE_NUMBERS` env variable
- NOT in database — prevents SQL injection privilege escalation
- Checked during JWT issuance after Firebase auth

## Security Measures
- Rate limiting: OTP (5/hour), API (100/min), Upload (10/min)
- JWT: HS256, 15min access token, 7-day refresh token
- Refresh tokens: hashed in DB, rotated on use
- Input: Zod validation + DOMPurify sanitization
- Images: type/size validation, Cloudinary handles processing
- SQL: Drizzle ORM (parameterized queries)
- CORS: Whitelist of known origins
- Headers: Helmet middleware
- CSP: Configured for Three.js/WebGL

## Links
- [[Architecture]] for full implementation details
- [[API-Map]] for per-endpoint auth requirements
