# Payment Service

## Overview

The Payment Service is responsible for managing payment processing and transactions within the Billing System. It handles creating payment intents, processing payments, and updating payment statuses.

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
  payments/
    entities/
      payment.entity.ts
    payments.controller.ts
    payments.module.ts
    payments.service.ts
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

This service primarily listens to events and does not expose REST endpoints. It handles the following events:

### Create Initial Payment

- **Event**: `payment.createInitial`
- **Description**: Creates an initial payment record and processes the payment.
- **Payload**:
    ```json
    {
      "subId": "subscription_id",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "paymentMethod": "payment_method_id"
      },
      "product": {
        "price": 100,
        "currency": "KZT"
      }
    }
    ```

### Payment Status

- **Event**: `notification.paying`
- **Description**: Sends an email about the payment status.
- **Payload**:
    ```json
    {
      "payment": { /* payment details */ },
      "user": { /* user details */ }
    }
    ```

## Configuration

The service uses environment variables for configuration. Create a `.env` file in the root directory and add the necessary variables:

```
STRIPE_SECRET_KEY=your_stripe_secret_key
KAFKA_BROKER=kafka:9092
```

## Payment Entity

The `Payment` entity represents a payment record in the database. Here are some key fields:

- `id`: The unique identifier for the payment.
- `subscriptionId`: The ID of the related subscription.
- `amount`: The amount of the payment.
- `currency`: The currency of the payment.
- `status`: The status of the payment (`success`, `failed`, `pending`).
- `transactionId`: The ID of the transaction in Stripe.
- `metadata`: Additional metadata for the payment.
- `createdAt`: The date and time when the payment was created.

## Payment Service

The `PaymentsService` is responsible for handling payment-related operations. Here are some key methods:

- `createInitialPayment(data: any)`: Creates an initial payment record and processes the payment.
- `paying(payment: Payment, user: any)`: Processes the payment using Stripe and updates the payment status.
- `sendTopic(topic: string, payment: Payment, user: any)`: Sends a message to a Kafka topic.

## Contributing

If you have any questions or suggestions, please open an issue.

For more details about the Billing System, refer to the main [README](../README.md) file.