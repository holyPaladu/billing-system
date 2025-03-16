# Auth Service

## Overview

The Auth Service is responsible for managing user authentication and authorization within the Billing System. It provides endpoints for user registration, login, token refresh, and other authentication-related operations.

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
  auth/
  common/
  users/
  main.ts
test/
```

## Getting Started

### Running the Service

1. Start the service:
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

### Register

- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user.
- **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```

### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Logs in a user and returns JWT tokens.
- **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```

### Refresh Tokens

- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Description**: Refreshes JWT tokens.
- **Request Body**:
    ```json
    {
      "userId": 1,
      "refreshToken": "refreshToken"
    }
    ```

## Configuration

The service uses environment variables for configuration. Create a `.env` file in the root directory and add the necessary variables:

```
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
DATABASE_URL=your_database_url
```

## Contributing

If you have any questions or suggestions, please open an issue.

For more details about the Billing System, refer to the main [README](../README.md) file.