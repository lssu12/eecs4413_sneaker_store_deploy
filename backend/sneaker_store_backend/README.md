# Sneaker Store Backend

Spring Boot service providing catalog, checkout, authentication, and admin capabilities
for the EECS4413 Sneaker Store project.

## Tech Stack

- Java 21 (via Gradle toolchain)
- Spring Boot 3.5 (Web, Data JPA, DevTools)
- Spring Security Crypto (BCrypt hashing)
- MySQL (configured via `application.properties`)
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

## Database (MySQL)

The backend now targets MySQL only. You can either point Spring Boot at an
existing MySQL instance via the standard `SPRING_DATASOURCE_*` environment
variables, or spin one up locally with Docker Compose (recommended for
consistent team testing).

### Option A – Docker Compose (recommended)

```bash
cd backend/sneaker_store_backend
docker compose up -d mysql
```

This starts a MySQL 8 container listening on `localhost:3307` with the
credentials baked into `src/main/resources/application.properties`:

- database: `sneaker_store`
- user / password: `sneaker_app` / `sneaker_pass`

### Option B – Your own MySQL server

Create the `sneaker_store` database (or reuse an existing one) and export the
connection settings before starting the app:

```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/sneaker_store?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME=your_user
export SPRING_DATASOURCE_PASSWORD=your_password
```

## Getting Started

Once MySQL is running:

```bash
cd backend/sneaker_store_backend
./gradlew bootRun
```

The `CommandLineRunner` seeds demo sneakers/products/customers on first run so
the API is immediately usable.

Default API base URL: `http://localhost:8080`

Update `src/main/resources/application.properties` to match your MySQL credentials.

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
controller tests as needed when features evolve. MySQL must be running (via Docker Compose
or your own instance) before executing the test suite.
