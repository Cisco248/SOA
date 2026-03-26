# Node JS Order Micro-Service

## Bug Fixes Applied

### 🔴 Critical

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `routes/auth_router.js` | JWT signed with `CLIENT_SECRET` ("secret123") but `authentication.js` verified with `TOKEN` ("secret_key") — **every issued token would fail verification** | Introduced `JWT_SECRET` constant used consistently in both sign and verify |
| 2 | `index.js` | `authenticateToken` middleware was imported but **never applied** to `/orders` — all order routes were publicly accessible | Moved `authenticateToken` into each route handler in `routes/orders.js` |
| 3 | `Integration/setupRabbitMQ.js` | Function named `rabbitMG` (typo) and **never exported** — file was useless; `index.js` never called it | Renamed to `setupRabbitMQ`, exported it, called from `index.js` on startup |

### 🟠 Logic Errors

| # | File | Bug | Fix |
|---|------|-----|-----|
| 4 | `services/payment_service.js` | `try/catch` wrapped a `setTimeout` — errors inside the callback run **asynchronously** and escape the try/catch entirely | Moved all logic (including try/catch) inside the setTimeout callback |
| 5 | `services/shipping_service.js` | Same `try/catch` around `setTimeout` issue | Same fix as above |

### 🟡 Minor Issues

| # | File | Bug | Fix |
|---|------|-----|-----|
| 6 | `config/constant.js` | `VARIFICATION_ERROR` typo | Renamed to `VERIFICATION_ERROR` everywhere |
| 7 | `routes/auth_router.js` | Missing semicolons | Added |
| 8 | `services/payment_service.js` | `ch.nack` inside `setTimeout` did not update `orderData.status` before republishing | Clones order with `status: 'PAYMENT_COMPLETED'` before publishing |
| 9 | `Integration/setupRabbitMQ.js` | Queue DLQ args used `deadLetterExchange` property (amqplib v1 API) instead of `arguments` map | Fixed to use `arguments: { 'x-dead-letter-exchange': ... }` |

### ✅ Additions (Incomplete Codebase Completion)

- `GET /orders` — list all orders (was missing)
- Global Express error-handling middleware in `index.js`
- Connection-level `error` and `close` event handlers on RabbitMQ connections
- `process.exit(1)` in services so a process manager restarts them on fatal failures

---

## Installation

```bash
npm install
```

## Running

```bash
# Start the API server
npm start

# Start services (each in a separate terminal or via PM2)
node services/payment_service.js
node services/shipping_service.js
```

## API Testing

### 1. Health Check — `GET /`

```http
GET http://localhost:3000/
```

### 2. Get Access Token — `POST /oauth/token`

```http
POST http://localhost:3000/oauth/token
Content-Type: application/json

{
  "client_id": "globalbooks_client",
  "client_secret": "secret123"
}
```

Response:
```json
{
  "access_token": "<JWT>",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### 3. Create Order — `POST /orders`

```http
POST http://localhost:3000/orders
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "bookIsbn": "978-0132350884",
  "quantity": 3,
  "customerEmail": "dev_expert@example.com"
}
```

Response (201):
```json
{
  "id": "ORD-1715634821000",
  "bookIsbn": "978-0132350884",
  "quantity": 3,
  "customerEmail": "dev_expert@example.com",
  "status": "PENDING_PAYMENT",
  "createdAt": "2026-03-23T15:05:00.000Z"
}
```

### 4. Get All Orders — `GET /orders`

```http
GET http://localhost:3000/orders
Authorization: Bearer <JWT>
```

### 5. Get Order by ID — `GET /orders/:id`

```http
GET http://localhost:3000/orders/ORD-1715634821000
Authorization: Bearer <JWT>
```
