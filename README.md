# 💰 FINANCE MANAGER WEB APPLICATION (Monorepo)

[![pnpm](https://img.shields.io/badge/pnpm-9.0.0-blue.svg)](https://pnpm.io/)
[![Powered by Turborepo](https://img.shields.io/badge/powered%20by-turborepo-blue.svg)](https://turbo.build/repo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive **Personal Finance Manager** web application built using a **Monorepo architecture** powered by Turborepo.

**Current status:** The project has fully implemented **User Authentication**, including Sign Up, Login, Forgot Password, and Reset Password flows.

---

## ✨ Features (Completed)

- **JWT Authentication**
  - Sign up, login, and protected routes using JSON Web Tokens (`@nestjs/jwt`)
- **Forgot / Reset Password**
  - Full flow including email-based password reset (DTOs + service logic included)
- **Refresh Tokens**
  - Maintain session without forcing re-login
- **Secure Password Storage**
  - Hashing using `bcrypt`
- **API Documentation**
  - Auto-generated API documentation using Swagger (`@nestjs/swagger`)

---

## 🛠️ Tech Stack

| Category     | Technology      | Description |
|--------------|----------------|-------------|
| **Monorepo** | Turborepo      | High-performance task runner |
|              | pnpm           | Fast, disk-efficient package manager |
| **Backend**  | NestJS v10     | Main backend framework (`apps/api`) |
|              | TypeORM        | ORM for database interaction |
|              | PostgreSQL     | Relational database (`pg`) |
|              | Passport-JWT   | Authentication strategy for NestJS |
|              | Swagger (OpenAPI) | Auto API docs |
| **Frontend** | Next.js v15    | Main frontend framework (`apps/web`) |
|              | React v19 (RC) | UI library |
|              | TypeScript     | Main language |
|              | Chakra UI      | UI component library |
|              | Tailwind CSS   | Utility-first CSS styling |
|              | React Hook Form + Yup | Form handling and validation |
|              | Axios          | HTTP client for API calls |

---

## 🚀 Quick Start

### Điều kiện tiên quyết

- **Node.js** (v18+)
- **pnpm** (v9.0.0+)
- **PostgreSQL** instance đang chạy (local hoặc remote)
- **Docker & Docker Compose** (tùy chọn, cho Option 2)

### Cài đặt & Cấu hình

1.  **Clone dự án:**
    ```bash
    git clone [https://github.com/your-username/finance-manager.git](https://github.com/your-username/finance-manager.git)
    cd finance-manager
    ```

2.  **Thiết lập Backend (API):**
    Sao chép file `.env.example` và cấu hình các biến môi trường, đặc biệt là `DATABASE_URL` và `JWT_SECRET`.
    ```bash
    cp apps/api/.env.example apps/api/.env
    ```
    *Sau đó, mở file `apps/api/.env` và chỉnh sửa các giá trị.*

3.  **Chạy Database Migration:**
    Lệnh này sẽ áp dụng schema mới nhất vào database đã cấu hình ở bước 3.
    ```bash
    pnpm --filter api migration:run
    ```

Bạn có thể chạy dự án bằng một trong hai cách sau:

### ✅ Option 1 — Cài đặt Local (Manual Setup)

Chạy các dịch vụ (API, Web) trực tiếp trên máy của bạn.

**Cài đặt dependencies:**
(Chạy từ thư mục gốc)
```bash
pnpm install
```

**Chế độ Development (Khuyên dùng khi lập trình):**
Chạy cả `api` và `web` ở chế độ "watch" (tự động build lại khi có thay đổi).
```bash
pnpm dev
```

**Chế độ Production (Chạy bản build):**
```bash
pnpm build
```

```bash
pnpm start
```

### ✅ Option 2 — Cài đặt docker

```bash
docker compose up --build -d
```

