# EECS 4413 – Sneaker Store Web Application

This project is a full-stack web application developed for the EECS 4413 team project. The application simulates an online sneaker store where users can browse products, manage shopping carts, and place orders, while administrators can manage inventory and products.

The system follows a client–server architecture with a React-based frontend, a Spring Boot backend, and a MySQL relational database.

The project emphasizes RESTful API design, database integration, deployment, and team-based software development practices.

---

Technology Stack

Frontend:
- React (Vite)
- JavaScript (ES6)
- HTML / CSS

Backend:
- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate
- RESTful APIs

Database:
- MySQL (hosted on Railway)

Deployment:
- Backend deployed on Render
- MySQL database hosted on Railway

---

System Architecture

The frontend communicates with the backend through REST APIs over HTTP. The backend handles authentication, business logic, and database access using Spring Data JPA. The database stores all persistent data, including users, products, carts, orders, and inventory information.

Environment variables are used to configure database credentials and ports in the production environment.

---

Repository Structure

eecs4413_sneaker_store/
- backend/
  - sneaker_store_backend/
    - src/main/java
    - src/main/resources
    - Dockerfile
- frontend/
  - src/
  - package.json
- README.md

---

Backend Configuration

In production, the backend reads database and port configuration from environment variables provided by Render. The following variables are required:

- SPRING_DATASOURCE_URL
- SPRING_DATASOURCE_USERNAME
- SPRING_DATASOURCE_PASSWORD
- PORT

Sensitive credentials are not hard-coded in the repository.

---

Database Initialization

The database schema is defined using schema.sql, and initial seed data is provided in data.sql. Spring Boot automatically initializes the database when a valid connection to MySQL is available.

---

Deployment Notes

The backend is packaged as a Docker image and deployed on Render. The MySQL database is hosted on Railway. During startup, the backend may log database connection warnings if the database is temporarily unavailable; however, once the database becomes reachable, the application operates normally.

---

Course Information

Course: EECS 4413  
Institution: York University  
Project Type: Team Project

