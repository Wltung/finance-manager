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

We recommend running the project using **Docker Compose**, which starts the entire environment (Frontend + Backend + DB) with a single command.

### ✅ Option 1 — Run using Docker Compose (Recommended)

#### Prerequisites

- **Docker Desktop** (or Docker Engine) installed and running

#### Start

From the root directory (`finance-manager/`), run:

```bash
docker compose up --build -d