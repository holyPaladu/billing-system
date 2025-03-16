# Notification Service

## Overview

The Notification Service is responsible for sending various types of notifications within the Billing System. It handles email notifications for user registration, billing reminders, and payment statuses.

## Project Structure

```
.env
.eslintrc.js
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
  app.module.ts
  email/
    email.service.ts
  notification/
    notification.module.ts
    notification.controller.ts
    notification.service.ts
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

### User Registered

- **Event**: `user.registered`
- **Description**: Sends a verification email to the user.
- **Payload**:
    ```json
    {
      "email": "user@example.com",
      "ottp": "123456"
    }
    ```

### Billing Reminder

- **Event**: `billing.notification.reminder.product`
- **Description**: Sends a reminder email about a product subscription.
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
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
KAFKA_BROKER=kafka:9092
```

## Email Service

The `EmailService` is responsible for sending emails. It uses `nodemailer` for SMTP communication. Here are some key methods:

- `sendVerificationEmail(to: string, code: string)`: Sends a verification email.
- `sendReminder(id: number, to: string, product: { price: number; plan: string; name: string; is_active: boolean })`: Sends a reminder email.
- `sendPayingStatus(data: { payment: any; user: any })`: Sends an email about the payment status.

## Contributing

If you have any questions or suggestions, please open an issue.

For more details about the Billing System, refer to the main [README](../README.md) file.