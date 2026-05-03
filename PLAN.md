# PLAN.md - TicketBox Next Steps

> Last updated: 2026-05-03

## 📋 Current Status

- **Backend:** Node.js + Express + Prisma (MySQL)
- **Frontend:** Vue 3 + Vite + Axios + Cookie-based auth
- **Search:** Replaced Elasticsearch with Prisma `contains` (MySQL LIKE)
- **Database:** MySQL local on WSL, seeded with 100 events + 6 venues + demo users
- **CORS:** Open (development mode)
- **Auth:** JWT + Cookie (`js-cookie`), register/login/logout implemented
- **Backend running:** `http://localhost:8000`
- **Frontend:** Sếp tự chạy trên Windows

---

## 🎯 Missing / Incomplete Features

### Backend

- [ ] **Order flow** — create order, reserve seats, payment (chưa làm)
- [ ] **Seat locking mechanism** — khi đặt vé cần lock ghế không cho người khác đặt trùng (concurrency race condition)
- [ ] **Payment integration** — mock payment gateway hoặc Stripe/PayPal integration
- [ ] **Admin routes** — CRUD venues, events, view orders (hiện chỉ có USER role)
- [ ] **Middleware: auth + role check** — bảo vệ admin routes
- [ ] **Rate limiting** — hiện có `express-rate-limit` nhưng có thể chưa apply đúng chỗ
- [ ] **Validation layer** — chưa có request validation (joi/zod)
- [ ] **Error handling chuẩn** — nên có centralized error response
- [ ] **Logging** — chưa có structured logging (winston/pino)
- [ ] **Config management** — nên dùng `config` package thay vì `.env` trực tiếp
- [ ] **Health check endpoint** — `/health` để CI/CD check service status

### Frontend

- [ ] **Admin pages** — dashboard, manage events, venues, orders
- [ ] **Order placement UI** — chọn ghế, xem giỏ hàng, thanh toán
- [ ] **Payment UI** — trang thanh toán mock
- [ ] **Seat map visual** — sơ đồ ghế có thể click chọn
- [ ] **User profile page** — xem lịch sử đơn hàng
- [ ] **404 / Error pages** — UI error handling
- [ ] **Loading states / Skeleton screens** — UX tốt hơn
- [ ] **Search debounce** — tránh gọi API quá nhiều
- [ ] **JWT refresh token** — access token hết hạn thì refresh

### DevOps / Infrastructure

- [ ] **Docker** — containerize backend + frontend
- [ ] **Docker Compose** — chạy MySQL + Backend + Frontend cùng lúc
- [ ] **CI/CD** — GitHub Actions (test, lint, build, deploy)
- [ ] **Environment configs** — `.env.example` cho dev/staging/prod
- [ ] **Database migrations** — dùng Prisma Migrate thay vì `db push` khi production
- [ ] **Seed data** — tách seed ra như một script riêng

---

## 🔧 Priority Tasks (Suggested Order)

### Phase 1: Core Order Flow (HIGH)
```
1. POST /api/orders          — tạo đơn hàng, lock seats (AVAILABLE → RESERVED)
2. POST /api/orders/:id/pay — mock payment → seats (RESERVED → SOLD)
3. DELETE /api/orders/:id   — hủy đơn → release seats (RESERVED → AVAILABLE)
```

### Phase 2: Seat Concurrency (HIGH)
- Cần transaction để không có 2 người đặt cùng 1 ghế
- Prisma transaction với `SELECT FOR UPDATE` hoặc optimistic locking

### Phase 3: Admin Pages (MEDIUM)
- CRUD venues, events, orders
- View stats dashboard (total revenue, tickets sold, etc.)

### Phase 4: Frontend Order UI (MEDIUM)
- Seat selection page
- Cart + checkout page
- Order history page

### Phase 5: DevOps & Git (MEDIUM)
- Docker setup
- GitHub Actions CI/CD
- README with setup instructions

---

## 📁 Project Structure

```
ticketbox/
├── backend/
│   ├── src/
│   │   ├── controllers/    ← request handlers
│   │   ├── services/      ← business logic
│   │   ├── routes/        ← API routes
│   │   ├── middlewares/   ← auth, error, rate-limit
│   │   ├── config/        ← db, prisma client
│   │   ├── utils/         ← helpers
│   │   └── app.js         ← Express app
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── views/         ← pages
│   │   ├── components/    ← reusable components
│   │   ├── api/           ← axios service calls
│   │   ├── composables/   ← Vue composables
│   │   └── router/
│   └── package.json
├── docker-compose.yml     ← (sẽ tạo)
├── .github/
│   └── workflows/         ← CI/CD (sẽ tạo)
├── PLAN.md                ← file này
└── README.md              ← (sẽ tạo/cập nhật)
```

---

## 🚀 Quick Wins Có Thể Làm Ngay

1. **Tạo `.env.example`** — để teammate biết cần config gì
2. **Tạo `health` endpoint** — `GET /health` trả về `{ status: "ok", db: "connected" }`
3. **Thêm request validation với Zod** — validate input cho register/login/createOrder
4. **Tách `response.js`** — centralized API response format
5. **Viết unit test đơn giản** cho services (vitest cho backend)

---

_Comments và suggestions từ sếp được ghi lại tại đây để track progress._
