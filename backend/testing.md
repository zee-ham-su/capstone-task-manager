# Testing the Capstone Task Manager Backend

This document outlines the testing strategy and provides a guide on how to test each API endpoint for the Capstone Task Manager Backend.

## Testing Strategy

The project utilizes **Jest** for both unit and end-to-end (e2e) testing. The strategy is as follows:

*   **Unit Tests**: Focus on individual components (services, controllers, guards) in isolation. External dependencies like databases and email services are mocked to ensure tests are fast and predictable.
*   **End-to-End (E2E) Tests**: Test the full application flow by making HTTP requests to the API endpoints. These tests verify that all components work together correctly, from request to response.

## Running Tests

You can run various test suites using the following npm scripts:

```bash
# Run all unit tests
npm run test

# Run all end-to-end (e2e) tests
npm run test:e2e

# Generate a test coverage report
npm run test:cov
```

## How to Test Each Endpoint

Below are instructions and examples for testing each endpoint using tools like `curl` or Postman. Replace placeholders like `<your_jwt_token>`, `<user_id>`, and `<task_id>` with actual values.

--- 

### 1. Authentication Module (`/auth`)

#### Register a New User
*   **Endpoint**: `POST /auth/register`
*   **Description**: Creates a new user account.
*   **Request Body**:
    ```json
    {
      "username": "testuser",
      "email": "test@example.com",
      "password": "strongPassword123",
      "firstName": "Test",
      "lastName": "User"
    }
    ```
*   **Success Response**: `201 Created` with user data (excluding password).

#### Log In
*   **Endpoint**: `POST /auth/login`
*   **Description**: Authenticates a user and returns a JWT.
*   **Request Body**:
    ```json
    {
      "email": "test@example.com",
      "password": "strongPassword123"
    }
    ```
*   **Success Response**: `201 Created` with an `access_token`.

--- 

### 2. Users Module (`/users`)

*Authentication: Requires a valid JWT in the `Authorization` header: `Authorization: Bearer <your_jwt_token>`*

#### Get User Profile
*   **Endpoint**: `GET /users/profile`
*   **Description**: Retrieves the profile of the currently authenticated user.
*   **Success Response**: `200 OK` with the user's profile information.

#### Update User Profile
*   **Endpoint**: `PATCH /users/profile`
*   **Description**: Updates the profile of the currently authenticated user.
*   **Request Body**:
    ```json
    {
      "firstName": "UpdatedFirstName"
    }
    ```
*   **Success Response**: `200 OK` with the updated user profile.

#### Get All Users (Admin Only)
*   **Endpoint**: `GET /users`
*   **Description**: Retrieves a list of all users. Requires an admin role.
*   **Success Response**: `200 OK` with an array of user objects.

--- 

### 3. Tasks Module (`/tasks`)

*Authentication: Requires a valid JWT.*

#### Create a New Task
*   **Endpoint**: `POST /tasks`
*   **Description**: Creates a new task for the authenticated user.
*   **Request Body**:
    ```json
    {
      "title": "My New Task",
      "description": "Complete the project report.",
      "dueDate": "2025-12-31T23:59:59.000Z"
    }
    ```
*   **Success Response**: `201 Created` with the newly created task object.

#### Get All Tasks
*   **Endpoint**: `GET /tasks`
*   **Description**: Retrieves all tasks for the authenticated user. Supports filtering by status.
*   **Example Query**: `GET /tasks?status=PENDING`
*   **Success Response**: `200 OK` with an array of tasks.

#### Get a Task by ID
*   **Endpoint**: `GET /tasks/<task_id>`
*   **Description**: Retrieves a single task by its ID.
*   **Success Response**: `200 OK` with the task object.

#### Update a Task
*   **Endpoint**: `PATCH /tasks/<task_id>`
*   **Description**: Updates a task's details (e.g., title, status).
*   **Request Body**:
    ```json
    {
      "status": "COMPLETED"
    }
    ```
*   **Success Response**: `200 OK` with the updated task object.

#### Delete a Task
*   **Endpoint**: `DELETE /tasks/<task_id>`
*   **Description**: Deletes a task by its ID.
*   **Success Response**: `200 OK`.

--- 

### 4. Notification Module (`/notification`)

#### Send a Test Email
*   **Endpoint**: `POST /notification/email`
*   **Description**: Sends an email using a specified Handlebars template. Useful for testing the email system.
*   **Request Body**:
    ```json
    {
      "to": "recipient@example.com",
      "subject": "Test Email",
      "template": "task-reminder",
      "context": {
        "name": "Test User",
        "title": "Important Task",
        "interval": 24,
        "dueDate": "2025-09-21"
      }
    }
    ```
*   **Success Response**: `201 Created` with `{ "success": true }`.

## Testing Best Practices

*   **Isolate Tests**: Use mocking for external services (like databases and mailers) in unit tests to keep them fast and deterministic.
*   **Use a Test Database**: For e2e tests, always run against a dedicated test database to avoid polluting your development or production data.
*   **Cover Edge Cases**: Write tests for invalid inputs, error responses, and authorization/authentication failures.
*   **Automate**: Integrate tests into a CI/CD pipeline to ensure code quality and prevent regressions automatically.