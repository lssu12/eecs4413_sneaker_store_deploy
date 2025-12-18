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

## Getting Started

1. Make sure MySQL is running and create the database (once):

```sql
CREATE DATABASE sneaker_store;
```

2. Edit `src/main/resources/application-mysql.properties` and set your own
MySQL username and password:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sneaker_store?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USER
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=none
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema.sql
spring.sql.init.data-locations=classpath:data.sql
```

3. Start the backend with the MySQL profile:

```bash
cd backend/sneaker_store_backend
./gradlew bootRun --args="--spring.profiles.active=mysql"
```

The application will apply `schema.sql` to create tables and `data.sql` to
insert sample customers, products, sneakers, carts and orders.

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
controller tests as needed when features evolve.
