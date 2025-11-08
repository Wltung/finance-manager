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

## 📂 Project Structure

This monorepo is managed by Turborepo and contains the following core applications:

---

## 🔑 Environment Variables

The backend (`apps/api`) requires environment variables to run.

First, copy the example file:

```bash
cp apps/api/.env.example apps/api/.env
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **pnpm** (v9.0.0+)
- **PostgreSQL** instance (running locally or remotely)
- **Docker & Docker Compose** (optional, for Option 2)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/finance-manager.git](https://github.com/your-username/finance-manager.git)
    cd finance-manager
    ```

2.  **Configure Environment:**
    Copy the backend environment file and fill in your database/JWT details (as described in the section above).
    ```bash
    cp apps/api/.env.example apps/api/.env
    ```

3.  **Run Database Migrations:**
    This command applies the latest schema to the database you configured in step 2.
    ```bash
    pnpm --filter api migration:run
    ```

---

## 🚦 Running the Application

You can run the project in two ways:

### ✅ Option 1 — Local Development (Manual)

**Install dependencies:**
Run from the root directory
```bash
pnpm install
```

**Development Mode (Recommended for development):**
Run the API and Web services directly on your machine in "watch" mode.
```bash
pnpm dev
```

**Production Mode (Run built version):**
Build the entire project
```bash
pnpm build
```

Start the production server
```bash
pnpm start
```

### ✅ Option 2 — Docker Compose
Run the entire stack (API, Web, DB) in containers.
```bash
docker compose up --build -d
```

