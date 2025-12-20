# 👟 SoleMate - Premium Sneaker Store

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

> **EECS 4413 Project - York University**
>
> A full-stack e-commerce platform designed for sneaker enthusiasts.

---

## ✨ Key Features

* **🛒 Comprehensive Product Catalog**: Browse a wide variety of sneakers with detailed descriptions, prices, and high-quality images.
* **🔐 Secure User Authentication**: Full sign-up and login functionality to manage user sessions securely.
* **🛍️ Dynamic Shopping Cart**: Real-time cart management allowing users to add items, update quantities, and remove products seamlessly.
* **💳 Simulated Checkout Process**: A smooth checkout flow that simulates order placement and confirmation.
* **👮 Powerful Admin Dashboard**: Dedicated admin panel for managing inventory, adding new products, and updating stock levels.
* **🔍 Advanced Search & Filtering**: Easily find sneakers by searching for names or filtering by categories.
* **📱 Fully Responsive Design**: A modern, mobile-friendly interface built with React and Tailwind CSS that works on all devices.

---

## 🚀 Live Demo

- **Frontend (Vercel):** https://eecs4413-sneaker-store-deploy.vercel.app
- **Backend API (Render):** https://eecs4413-sneaker-store-backend.onrender.com
- **Database (Render):** PostgreSQL 16

---

## ⚙️ Local Development Setup

### Prerequisites
- Java JDK 21
- Node.js (v18+)
- Docker + Docker Compose (to run PostgreSQL 16 locally)
  - or an accessible PostgreSQL instance (adjust credentials accordingly)

### 1. Clone the Repository

```bash
git clone [https://github.com/dyu55/eecs4413_sneaker_store.git](https://github.com/dyu55/eecs4413_sneaker_store.git)
cd eecs4413_sneaker_store
```

### 2. Database Configuration
```bash
cd backend/sneaker_store_backend
docker compose up -d postgres
```

The container exposes PostgreSQL on `localhost:5433` with:

- database: `sneaker_store`
- username / password: `sneaker_app` / `sneaker_pass`

To (re)seed locally, either run `SPRING_SQL_INIT_MODE=always ./gradlew bootRun` once or execute the SQL files manually:

```bash
psql -h localhost -p 5433 -U sneaker_app -d sneaker_store -f src/main/resources/schema.sql
psql -h localhost -p 5433 -U sneaker_app -d sneaker_store -f src/main/resources/data.sql
```

### 3. Backend Setup (Spring Boot)

```bash
cd backend/sneaker_store_backend

# On macOS/Linux
./gradlew bootRun

# On Windows
gradlew.bat bootRun
```
*Server starts at http://localhost:8080*

Environment variables (optional locally, required for deployment):

| Variable | Description | Default |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | JDBC URL | `jdbc:postgresql://localhost:5433/sneaker_store` |
| `SPRING_DATASOURCE_USERNAME` | DB user | `sneaker_app` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `sneaker_pass` |
| `SPRING_SQL_INIT_MODE` | `always` to recreate schema, `never` once seeded | `never` |

### 4. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```
*Frontend starts at http://localhost:5173*

Create `frontend/.env` (or `.env.local`) and set the API endpoint:

```
VITE_BASE_URL=http://localhost:8080
```

For deployments change the value to your backend URL (e.g. `https://your-backend.onrender.com`).

---

## 📝 SQL Scripts Location

Required for database initialization:
`backend/sneaker_store_backend/src/main/resources/`

- **schema.sql**
- **data.sql**

---

## ☁️ Deploying on Render

1. **Database** – Provision a Render PostgreSQL instance. Copy the `Internal Database URL` (format `postgres://user:pass@host:port/db`).
2. **Backend web service** – Point to `backend/sneaker_store_backend` with:
   - Build: `./gradlew bootJar`
   - Start: `java -jar build/libs/sneaker_store_backend-0.0.1-SNAPSHOT.jar`
   - Env vars:
     - `SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:<port>/<db>?sslmode=require`
     - `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`
     - `SPRING_SQL_INIT_MODE=always` for the first deploy only (flip back to `never`).
3. **Schema/data** – Let Spring run `schema.sql` & `data.sql` during the first boot or execute them manually with `psql "$DATABASE_URL" -f ...`.
4. **Frontend static site** – Point Render’s static site to `frontend/` with build `npm install && npm run build`, publish directory `dist`, env var `VITE_BASE_URL=https://<backend-service>.onrender.com`, and add a rewrite rule `/* -> /index.html`.
5. **Verify** – `https://<backend>/api/sneakers` should return JSON; the frontend should load live data.

## 🔑 Admin Credentials

- **Username:** demo@sneakerstore.test
- **Password:** password

## 👥 Contributors

Dongling Yu 219511039

Yifei Liu 218968735

Hang Chen 218426106

Li Sha Su 213581772

<!-- end list -->

