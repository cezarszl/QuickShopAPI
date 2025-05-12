# QuickShop API

The **QuickShop API** is a RESTful backend built with **NestJS** and **Prisma ORM**, designed to power an e-commerce platform. It supports user authentication (including Google OAuth2), product and cart management, Stripe-based payments, and order processing – all running in a Dockerized environment with a PostgreSQL database.

## 🚀 Features

### 👤 User Authentication
- JWT-based authentication
- Google OAuth2 login & registration

### 🛍️ Product Management
- Add, update, delete, and list products
- Filter by category, brand, color, price range

### 🛒 Cart System
- Anonymous + user-bound cart support
- Add/update/remove items
- Merge cart on login

### 💳 Stripe Payments
- Create Stripe checkout sessions
- Test card support for demo purchases

### 📦 Orders
- Create orders after successful payment
- List orders per user
- Store product quantity and amount per order

### 🧰 Dev Features
- Swagger API docs (auto-generated)
- Prisma ORM for DB access
- Docker + PostgreSQL

## 📄 API Documentation

🔗 [**View Swagger Docs**](https://quickshopapi-844fd64d6465.herokuapp.com/api)

## 🧱 Tech Stack

- **NestJS** – TypeScript backend framework
- **Prisma** – ORM for PostgreSQL
- **Stripe** – Payment processing integration
- **Swagger** – REST API documentation
- **Docker** – Containerization & DB hosting
- **PostgreSQL** – Relational database
