# Subscription Service

## Overview

The Subscription Service is responsible for managing user subscriptions and plans within the Billing System. It provides endpoints for creating, updating, retrieving, and deleting subscriptions. It also handles subscription-related events and communicates with other services via Kafka.

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
  subscriptions/
    dto/
      sub.dto.ts
    entities/
      subscription.entity.ts
    subscriptions.controller.ts
    subscriptions.module.ts
    subscriptions.service.ts
    subscription-cron.service.ts
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

### Create Subscription

- **URL**: `/subscriptions/create/:productId`
- **Method**: `POST`
- **Description**: Creates a new subscription.
- **Request Body**:
    ```json
    {
      "billingPlan": "monthly"
    }
    ```

### Get All Subscriptions

- **URL**: `/subscriptions`
- **Method**: `GET`
- **Description**: Retrieves all subscriptions.
- **Response**:
    ```json
    [
      {
        "id": "subscription_id",
        "userId": 1,
        "userEmail": "user@example.com",
        "productId": "product_id",
        "billingPlan": "monthly",
        "startDate": "2023-01-01",
        "endDate": "2023-12-31",
        "nextBillingDate": "2023-02-01",
        "status": "active",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
    ```

### Get Subscription by User ID

- **URL**: `/subscriptions/users`
- **Method**: `GET`
- **Description**: Retrieves subscriptions by user ID.
- **Response**:
    ```json
    [
      {
        "id": "subscription_id",
        "userId": 1,
        "userEmail": "user@example.com",
        "productId": "product_id",
        "billingPlan": "monthly",
        "startDate": "2023-01-01",
        "endDate": "2023-12-31",
        "nextBillingDate": "2023-02-01",
        "status": "active",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
    ```

### Get Subscription by Product ID

- **URL**: `/subscriptions/:productId`
- **Method**: `GET`
- **Description**: Retrieves subscriptions by product ID.
- **Response**:
    ```json
    [
      {
        "id": "subscription_id",
        "userId": 1,
        "userEmail": "user@example.com",
        "productId": "product_id",
        "billingPlan": "monthly",
        "startDate": "2023-01-01",
        "endDate": "2023-12-31",
        "nextBillingDate": "2023-02-01",
        "status": "active",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
    ```

### Delete Subscription

- **URL**: `/subscriptions/:subscriptionId`
- **Method**: `DELETE`
- **Description**: Deletes a subscription by ID.
- **Response**:
    ```json
    {
      "message": "Subscription deleted successfully"
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

## Cron Jobs

The `SubscriptionCronService` handles scheduled tasks for checking subscriptions. It runs a daily check at midnight to process subscriptions and send reminders.

## Contributing

If you have any questions or suggestions, please open an issue.

For more details about the Billing System, refer to the main [README](../README.md) file.