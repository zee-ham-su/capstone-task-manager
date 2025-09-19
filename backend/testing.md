# Testing the Capstone Task Manager Backend

This document outlines the testing strategy and how to run tests for the Capstone Task Manager Backend application.

## Overview

The project utilizes Jest for unit and end-to-end (e2e) testing. Tests are crucial for ensuring the reliability and correctness of the application's features, including authentication, task management, and notifications.

## Running Tests

You can run various types of tests using the following npm scripts:

*   **Unit Tests**: Focus on individual components (e.g., services, controllers without their HTTP context, utility functions) in isolation.
    ```bash
    npm run test
    ```

*   **End-to-End (e2e) Tests**: Test the entire system or major flows, simulating real user interactions with the API endpoints.
    ```bash
    npm run test:e2e
    ```

*   **Test Coverage**: Generate a report showing how much of your code is covered by tests.
    ```bash
    npm run test:cov
    ```

## Test File Locations

*   **Unit Tests**: Typically located alongside the source files they test, with a `.spec.ts` suffix (e.g., `src/users/users.service.spec.ts`).
*   **End-to-End Tests**: Located in the `test/` directory, with an `.e2e-spec.ts` suffix (e.g., `test/app.e2e-spec.ts`).

## Testing Specific Modules

### Authentication Module

*   **Unit Tests**: Verify the logic within `AuthService`, `LocalStrategy`, `JwtStrategy`, and guards.
*   **E2E Tests**: Test the `/auth/register`, `/auth/login`, `/auth/forgot-password`, and `/auth/reset-password` endpoints to ensure correct user creation, token generation, and password management flows.

### Users Module

*   **Unit Tests**: Validate `UsersService` methods for CRUD operations on users.
*   **E2E Tests**: Cover API endpoints like `/users/profile` (for authenticated user actions) and `/users` (for admin-level user management).

### Tasks Module

*   **Unit Tests**: Test `TasksService` logic for creating, retrieving, updating, and deleting tasks, including any business rules related to task states or due dates.
*   **E2E Tests**: Verify the `/tasks` API endpoints for task creation, retrieval, updates, and deletion, ensuring proper authentication and authorization.

### Notification Module

*   **Unit Tests**: You would typically mock the `MailerService` to ensure `NotificationService` correctly calls its methods with the right parameters. This avoids actually sending emails during unit tests.
*   **E2E Tests**: To test the `/notification/email` endpoint:
    1.  **Mock Email Sending**: For true e2e tests, you might want to mock the underlying `MailerService` to prevent actual emails from being sent during automated runs. Tools like `jest-mock-extended` or custom mocks can be used.
    2.  **API Call**: Send a `POST` request to `http://localhost:3000/notification/email` (or your configured port) with a valid `SendEmailDto` payload.
    3.  **Verification**: Assert that the API returns a success response (e.g., `status 201` or `200` with `{ success: true }`). If you're not mocking the `MailerService`, you would need to check an email inbox (e.g., a test email account or a service like Mailtrap) to verify the email content, which is generally not recommended for automated e2e tests due to external dependencies.

    **Example Payload for E2E Test:**
    ```json
    {
      "to": "test@example.com",
      "subject": "E2E Test Notification",
      "template": "task-reminder",
      "context": {
        "name": "Test User",
        "title": "E2E Task",
        "interval": 5,
        "dueDate": "2025-09-20 10:00 AM"
      }
    }
    ```

## Best Practices

*   **Mock External Services**: Always mock external dependencies like databases (for unit tests), email services, and third-party APIs to ensure tests are fast, reliable, and isolated.
*   **Clear Naming**: Use descriptive names for your test files and test cases.
*   **Arrange-Act-Assert**: Structure your tests clearly into these three phases.
*   **Test Edge Cases**: Don't forget to test invalid inputs, error conditions, and boundary cases.
