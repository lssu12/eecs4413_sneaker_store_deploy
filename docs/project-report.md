# EECS 4413 – Project Report  
## Sneaker Store Web Application

---

## 1. Project Overview

The Sneaker Store project is a full-stack web application designed to simulate an online e-commerce platform for sneaker products.  
The system supports both customer-facing features (product browsing, cart, checkout) and administrator-facing features (product, order, and user management).

The project follows a clear front-end and back-end separation and is developed incrementally through multiple project parts.  
This document focuses on **Part 4 (P4): DevOps, Admin UI, and Documentation**.

---

## 2. Architecture Overview

The application follows a layered architecture with a clear separation of concerns:

- **Frontend**: React + Vite  
- **Backend**: Spring Boot (MVC + DAO pattern)  
- **Database**: PostgreSQL (planned)  

### High-Level Architecture

- React frontend communicates with backend REST APIs
- Backend handles business logic through controllers, services, and DAOs
- Data persistence is handled via JPA repositories

A more detailed architecture description is provided in `architecture.md`.

---

## 3. P4 Scope and Responsibilities

Part 4 focuses on the following areas:

- Admin dashboard UI
- Routing for admin pages
- DevOps planning and deployment strategy
- Project documentation and report skeleton

This part ensures that the project is structured, deployable, and well-documented.

---

## 4. Admin UI Implementation

An Admin Dashboard is implemented on the frontend using **React Router**.

### Admin Pages Implemented

- Admin Dashboard
- Product Management Page
- Order Management Page
- User Management Page

### Admin Routes

| Route | Description |
|------|------------|
| `/admin` | Admin dashboard overview |
| `/admin/products` | Manage products |
| `/admin/orders` | View orders and sales history |
| `/admin/users` | Manage user accounts |

Each route renders a dedicated React component under `src/pages/admin/`.

Authentication and authorization are not enforced at this stage and are assumed to be handled in later project parts.

---

## 5. DevOps and Deployment Plan

The project follows a simple and realistic deployment strategy.

### Planned Deployment

- **Frontend**: Vercel  
  - React + Vite static build
  - Environment-based API configuration
- **Backend**: Render  
  - Spring Boot application deployed as a web service
- **Database**: Render PostgreSQL (or equivalent managed service)

### CI/CD Strategy

- Source code is managed using GitHub
- Feature development is organized through branches
- Manual deployment is sufficient for this project scope

Actual deployment is not required for P4; this section documents the intended deployment approach.

---

## 6. Diagrams

Formal UML diagrams are not included in this submission.  
Instead, architectural relationships are documented textually:

- Frontend communicates with backend via REST APIs
- Backend follows MVC + DAO pattern
- Clear separation between presentation, business logic, and data access layers

This approach satisfies the documentation requirement for P4.

---

## 7. Conclusion

Part 4 completes the administrative interface, DevOps planning, and project documentation.  
The project is now well-structured, readable, and ready for future deployment and extension.

All P4 requirements have been addressed through admin UI implementation, deployment planning, and documentation.


