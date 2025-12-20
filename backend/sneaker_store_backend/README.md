# Sneaker Store Backend

Spring Boot service providing catalog, checkout, authentication, and admin capabilities
for the EECS4413 Sneaker Store project.

## Tech Stack

- Java 21 (via Gradle toolchain)
- Spring Boot 3.5 (Web, Data JPA, DevTools)
- Spring Security Crypto (BCrypt hashing)
- PostgreSQL 16 (configured via `application.properties` or env vars)
- Lombok for boilerplate reduction

## Project Structure

```
backend/
  sneaker_store_backend/
    src/main/java/edu/yorku/sneaker_store_backend/
      controller/
        AuthController.java        # `/api/auth` register/login flows
        CheckoutController.java    # `/api/checkout` cart submission
        OrderController.java       # `/api/orders` shared history endpoints
        admin/                     # `/api/admin/*` dashboards
      dto/                         # Request/response payloads
      model/                       # JPA entities (Sneaker, Product, Customer, Order, ...)
      repository/                  # Spring Data repositories
      service/                     # Business logic layers
      config/SecurityConfig.java   # BCrypt password encoder bean
    src/main/resources/
      application.properties       # DB credentials + server port
```

## Database (PostgreSQL)

The backend now targets PostgreSQL. You can either point Spring Boot at an
existing PostgreSQL instance via the standard `SPRING_DATASOURCE_*` environment
variables, or spin one up locally with Docker Compose (recommended for
consistent team testing).

### Option A – Docker Compose (recommended)

```bash
cd backend/sneaker_store_backend
docker compose up -d postgres
```

This starts a PostgreSQL 16 container listening on `localhost:5433` with the
credentials baked into `src/main/resources/application.properties`:

- database: `sneaker_store`
- user / password: `sneaker_app` / `sneaker_pass`

### Option B – Your own PostgreSQL server

Create the `sneaker_store` database (or reuse an existing one) and export the
connection settings before starting the app:

```bash
export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/sneaker_store"
export SPRING_DATASOURCE_USERNAME=your_user
export SPRING_DATASOURCE_PASSWORD=your_password
```
Optionally set `SPRING_SQL_INIT_MODE=always` the first time you boot so Spring runs
`schema.sql` and `data.sql`, or apply them manually with `psql -f`.

## Getting Started

Once PostgreSQL is running:

```bash
cd backend/sneaker_store_backend
./gradlew bootRun
```

The `CommandLineRunner` seeds demo sneakers/products/customers on first run so
the API is immediately usable.

Default API base URL: `http://localhost:8080`

Environment variables (optional locally, required for deployment):

| Variable | Description | Default |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | JDBC URL | `jdbc:postgresql://localhost:5433/sneaker_store` |
| `SPRING_DATASOURCE_USERNAME` | DB user | `sneaker_app` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `sneaker_pass` |
| `SPRING_SQL_INIT_MODE` | `always` to recreate schema, `never` once seeded | `never` |
| `APP_ALLOWED_ORIGINS` | Comma-separated frontend origins for CORS | `http://localhost:5173,https://eecs4413-sneaker-store-deploy.vercel.app` |

Copy `backend/sneaker_store_backend/.env.example` to `.env` (or add the same keys to Render) and update `src/main/resources/application.properties` only if you need different local defaults.

## Deploying on Render

1. **Provision the managed database** – Create a Render PostgreSQL instance. Copy the `Internal Database URL` (format `postgres://user:pass@host:port/db`).
2. **Build the JDBC URL** – Replace the scheme with `jdbc:postgresql://` and append `?sslmode=require` for Render, e.g.
   - Render raw: `postgres://user:pass@dpg-xyz.internal:5432/sneaker`
   - JDBC used by Spring: `jdbc:postgresql://dpg-xyz.internal:5432/sneaker?sslmode=require`
3. **Configure service env vars** – In your Render web service set:
   - `SPRING_DATASOURCE_URL` = converted JDBC URL (or keep Render's `DATABASE_URL` and reference it in `application.properties`).
   - `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` = credentials Render shows beside the database.
   - `SPRING_SQL_INIT_MODE=always` for the first deploy so Spring runs `schema.sql` and `data.sql`, then switch it back to `never` to avoid wiping data on subsequent releases.
   - `APP_ALLOWED_ORIGINS=https://eecs4413-sneaker-store-deploy.vercel.app` (add other origins comma-separated as needed)
4. **Manual seeding option** – Alternatively run
   ```bash
   psql "$DATABASE_URL" -f src/main/resources/schema.sql
   psql "$DATABASE_URL" -f src/main/resources/data.sql
   ```
   and keep `SPRING_SQL_INIT_MODE=never` the whole time.
5. **Build & start commands** – Use `./gradlew bootJar` as the Render build step and `java -jar build/libs/sneaker_store_backend-0.0.1-SNAPSHOT.jar` as the start command.

Local connection reference:

- JDBC URL: `jdbc:postgresql://localhost:5433/sneaker_store`
- Username / password: `sneaker_app / sneaker_pass`

## Deploying the Frontend (Vercel)

1. In the Vercel project settings add `VITE_BASE_URL=https://eecs4413-sneaker-store.onrender.com` under Environment Variables (apply to Production & Preview). Redeploy so the React app points at the hosted API.
2. If you spin up additional frontend previews, append those URLs to `APP_ALLOWED_ORIGINS` on Render so CORS succeeds (`originA,originB`).
3. To test locally, create `frontend/.env.local` with the same `VITE_BASE_URL` but pointing to your local backend (e.g., `http://localhost:8080`).

## Key APIs

- `POST /api/auth/register` – Register new customers (requires `email` + `password`).
- `POST /api/auth/login` – Authenticate and receive a placeholder session token.
- `GET /api/sneakers` / `/api/sneakers/filter` – Catalog browsing endpoints.
- `POST /api/checkout` – Submit cart for ordering; returns order number and normalized line items.
- `GET /api/orders[?customerId=]` – Customers/Admins can read order history (optional `status`).
- `GET /api/orders/{id}` – Fetch order with nested items.

## Admin APIs

- `GET|POST|PUT|DELETE /api/admin/products` – Manage catalog entries.
- `GET|PUT|DELETE /api/admin/customers` – Review or update customer profiles.
- `GET /api/admin/orders` – Sales history dashboard (filter by status).
- `PUT /api/admin/orders/{id}/status` – Update order lifecycle (PAID/SHIPPED/etc.).

All admin endpoints currently rely on front-end gating (no auth middleware yet); integrate
proper authentication/authorization before production use.

## Testing

```
./gradlew test
```

The project ships with a minimal Spring Boot context test; extend with additional service or
controller tests as needed when features evolve. PostgreSQL must be running (via Docker Compose
or your own instance) before executing the test suite.
