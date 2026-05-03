# TODO.md - Việc của Kim

> Last updated: 2026-05-03
> ⚠️ **Hỏi Sếp trước khi làm bất kỳ việc gì.**

---

## ✅ ĐÃ XONG

- [x] Clone dự án `ticketbox` từ GitHub về workspace
- [x] Cấu hình `.env` kết nối MySQL local trên WSL
- [x] Seed database: 100 events, 6 venues, 2 demo users
- [x] Sửa CORS mở cho development
- [x] Thay Elasticsearch → MySQL `contains` cho search
- [x] Thêm `GET /health` endpoint
- [x] Tạo centralized response helper (`src/utils/response.js`)
- [x] Thêm request validation với Zod
- [x] Auth middleware: verify JWT
- [x] `POST /api/orders` — tạo đơn, lock seats (AVAILABLE → RESERVED)
- [x] `POST /api/orders/:id/pay` — mock payment → seats (RESERVED → SOLD)
- [x] `DELETE /api/orders/:id` — hủy đơn, release seats
- [x] `GET /api/orders` — danh sách đơn hàng
- [x] `GET /api/orders/:id` — chi tiết đơn hàng
- [x] Tạo `.env.example`
- [x] Chạy backend + frontend trên WSL

---

## 🔲 CHƯA LÀM — CẦN HỎI SẾP TRƯỚC

- [ ] **Admin routes** — CRUD venues, events (bảo vệ bằng role ADMIN)
- [ ] **Structured logging** — winston/pino
- [ ] **Docker setup** — Dockerfile + docker-compose.yml
- [ ] **GitHub Actions CI/CD** — test + build + deploy
- [ ] **README.md** — hướng dẫn setup đầy đủ

---gi

## 📌 GHI CHÚ

**Backend đang chạy:** `http://localhost:8000`
**Frontend đang chạy:** `http://localhost:5173`
**Demo user:** demo@ticketbox.com / 123456
**Admin user:** admin@ticketbox.com / 123456
**Database:** MySQL local WSL, 100 events, ~9500 seats

---

_Kim hỏi Sếp trước khi tick ô nào._
