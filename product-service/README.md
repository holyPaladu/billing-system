# Product Service

## Overview

The Product Service is responsible for managing product information and inventory within the Billing System. It provides endpoints for creating, updating, retrieving, and deleting products. It also handles product-related events and communicates with other services via Kafka.

## Project Structure

```
.env
.gitignore
.prettierrc
Dockerfile
eslint.config.mjs
nest-cli.json
package.json
README.md
tsconfig.build.json
tsconfig.json
src/
  products/
    dto/
      product.dto.ts
    entities/
      product.entity.ts
    products.controller.ts
    products.module.ts
    products.service.ts
test/
```

## Getting Started

### Project Setup

1. Install dependencies:
    ```bash
    npm install
    ```

2. Start the service:
    ```bash
    # development
    npm run start

    # watch mode
    npm run start:dev

    # production mode
    npm run start:prod
    ```

### Running Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Endpoints

### Get All Products

- **URL**: `/products`
- **Method**: `GET`
- **Description**: Retrieves a list of products with pagination.
- **Query Parameters**:
    - `offset`: The offset for pagination (default: 0).
    - `limit`: The number of items per page (default: 5).
- **Response**:
    ```json
    {
      "data": [
        {
          "id": "1",
          "name": "Product 1",
          "category": { "id": "10", "name": "Category A" }
        }
      ],
      "meta": {
        "total": 100,
        "offset": 0,
        "limit": 10
      }
    }
    ```

### Create Product

- **URL**: `/products`
- **Method**: `POST`
- **Description**: Creates a new product.
- **Request Body**:
    ```json
    {
      "name": "Product Name",
      "description": "This is a great product",
      "price": 199.99,
      "is_active": true,
      "plan": "monthly",
      "categoryId": "550e8400-e29b-41d4-a716-446655440000"
    }
    ```

### Update Product

- **URL**: `/products/:id`
- **Method**: `PATCH`
- **Description**: Updates an existing product.
- **Request Body**:
    ```json
    {
      "name": "Updated Product Name",
      "description": "Updated description",
      "price": 299.99,
      "is_active": false,
      "plan": "yearly",
      "categoryId": "550e8400-e29b-41d4-a716-446655440000"
    }
    ```

### Delete Product

- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Description**: Deletes a product by ID.
- **Response**:
    ```json
    {
      "message": "Product deleted successfully"
    }
    ```

## Configuration

The service uses environment variables for configuration. Create a `.env` file in the root directory and add the necessary variables:

```
DATABASE_URL=your_database_url
KAFKA_BROKER=kafka:9092
```

## Kafka Events

### Billing Notification Reminder

- **Event**: `billing.notification.reminder.product`
- **Description**: Sends a reminder notification for a product subscription.
- **Payload**:
    ```json
    {
      "subId": 1,
      "userEmail": "user@example.com",
      "product": {
        "price": 100,
        "plan": "monthly",
        "name": "Product Name",
        "is_active": true
      }
    }
    ```

## Contributing

If you have any questions or suggestions, please open an issue.

For more details about the Billing System, refer to the main [README](../README.md) file.