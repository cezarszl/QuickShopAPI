# Overview
QuickShop API is a RESTful API built using NestJS and Prisma that allows users to manage products, users, orders, and cart items within a shop. It provides endpoints for creating, reading, updating, and deleting products, users, managing cart items, and handling orders. The API also includes authentication with JWT and Google OAuth2, along with payment integration using Stripe. The application is using Docker, with PostgreSQL running as the database.

## Features
### User Management:
- Create, read, and delete user profiles.
- Google OAuth2 login and registration.

### Product Management:
- Create, read, update, and delete products.

### Cart Management:
- Add items to the cart.
- Remove items from the cart.
- Update the quantity of items in the cart.
- Retrieve all items in the cart for a specific user.

### Order Management:
- Create and process new orders.
- Retrieve order details for users.
- Handle order status updates.

### Payment Integration:
- Handle payments using Stripe API.
- Endpoint to initiate payments with fake data or demo Stripe payments.

### Authentication:
- JWT-based authentication.
- Google OAuth2 login and registration.

### Database Integration:
- Prisma is used as the ORM to interact with the database, which is running in a Docker container with PostgreSQL.

### Swagger Documentation:
- API documentation generated using Swagger for better development and testing.

## Documentation
- [QuickShop API Swagger Docs](https://quickshopapi-844fd64d6465.herokuapp.com/api) - See full API documentation online.

## Progress Tracking
- You can track the progress of this project on [Trello](https://trello.com/invite/b/66d020cfa5c358f331c3c2f8/ATTId951596145cea872dad191e72980677377CA810F/quickshop-api).

## Technologies
- **NestJS** - A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Prisma** - A next-generation ORM that can be used to build GraphQL, REST, and gRPC APIs.
- **Stripe** - Payment processing for handling online payments.
- **Swagger** - Used for API documentation.
- **Docker** - Used for containerization of the application and running PostgreSQL.
