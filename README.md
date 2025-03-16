# Billing System

## Overview

The Billing System is a microservices-based application that handles various aspects of billing, including authentication, notifications, payments, product management, and subscriptions. Each service is containerized using Docker and orchestrated with Docker Compose.

## Project Structure

```
docker-compose.yml
init.sql
auth-service/
notification-service/
payment-service/
product-service/
subscription-service/
```

## Services

- **Auth Service**: Manages user authentication and authorization.
- **Notification Service**: Handles sending notifications to users.
- **Payment Service**: Manages payment processing and transactions.
- **Product Service**: Manages product information and inventory.
- **Subscription Service**: Manages user subscriptions and plans.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/billing_system.git
   cd billing_system
   ```

2. Start the services using Docker Compose:

   ```sh
   docker-compose up --build -d
   ```

3. Access the services:
   - Auth Service: `http://localhost:3000`
   - Notification Service: `http://localhost:3001`
   - Payment Service: `http://localhost:3002`
   - Product Service: `http://localhost:3003`
   - Subscription Service: `http://localhost:3004`

## Configuration

Each service has its own `.env` file for configuration. Make sure to set the necessary environment variables before starting the services.

## Database Initialization

The `init.sql` file contains the initial database setup. It will be executed automatically when the services are started.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## Contact

If you have any questions or suggestions, please open an issue.

For more details about each service, refer to their respective README files.
