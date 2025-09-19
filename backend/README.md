# Capstone Task Manager Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A robust and scalable backend for a task management application, built with NestJS. This project provides user authentication, task management, and a notification system for reminders.</p>

## Features

*   **User Authentication**: Secure user registration, login, and password management (forgot/reset password) using JWT.
*   **User Management**: CRUD operations for user profiles.
*   **Task Management**: Create, read, update, and delete tasks with due dates and statuses.
*   **Role-Based Access Control (RBAC)**: Differentiate between user roles (e.g., admin, regular user).
*   **Notification System**: Email notifications for task reminders and other events, configurable via SMTP.
*   **Scheduled Tasks**: Automated checks for overdue tasks and upcoming task reminders.
*   **API Documentation**: Interactive API documentation using Swagger.

## Technologies Used

*   **Framework**: [NestJS](https://nestjs.com/) (Node.js framework)
*   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
*   **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/)
*   **Emailing**: [`@nestjs-modules/mailer`](https://www.npmjs.com/package/@nestjs-modules/mailer) with [Handlebars](https://handlebarsjs.com/) templating
*   **Scheduling**: [`@nestjs/schedule`](https://docs.nestjs.com/techniques/task-scheduling)
*   **Validation**: [`class-validator`](https://github.com/typestack/class-validator)
*   **API Docs**: [Swagger](https://swagger.io/)

## Project Setup

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community) (local instance or a cloud service like MongoDB Atlas)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd capstone-task-manager/backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of the `backend` directory and populate it with the following variables:

```env
PORT=3000
MONGODB_URI_ATLAS=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION_TIME=3600s # e.g., 3600s for 1 hour

# SMTP Configuration for Notifications
SMTP_HOST=your_smtp_host_address
SMTP_PORT=your_smtp_port_number # e.g., 587 for TLS, 465 for SSL
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=your_sender_email@example.com
```
*   **`PORT`**: The port on which the NestJS application will run.
*   **`MONGODB_URI_ATLAS`**: Your MongoDB connection string.
*   **`JWT_SECRET`**: A strong, secret key for signing JWTs.
*   **`JWT_EXPIRATION_TIME`**: The expiration time for JWTs (e.g., `3600s`, `1h`, `7d`).
*   **`SMTP_HOST`**: The hostname of your SMTP server (e.g., `smtp.gmail.com`, `smtp.sendgrid.net`).
*   **`SMTP_PORT`**: The port of your SMTP server. Use `465` for SSL/TLS or `587` for STARTTLS.
*   **`SMTP_USER`**: The username for your SMTP server (often your email address).
*   **`SMTP_PASS`**: The password or app-specific password for your SMTP server.
*   **`EMAIL_FROM`**: The email address that will appear as the sender.

## Running the Application

```bash
# development mode (with watch)
$ npm run start:dev

# production mode
$ npm run start:prod
```

The application will typically run on `http://localhost:3000` (or the port specified in your `.env`).

## API Endpoints & Documentation

The API documentation is available via Swagger UI. Once the application is running, navigate to:

`http://localhost:3000/api`

Here's a brief overview of the main modules and their functionalities:

*   **Auth Module**: Handles user registration, login, and token management.
    *   `POST /auth/register`: Register a new user.
    *   `POST /auth/login`: Log in and receive a JWT.
    *   `POST /auth/forgot-password`: Initiate password reset.
    *   `POST /auth/reset-password`: Reset password with a token.
*   **Users Module**: Manages user-related operations.
    *   `GET /users/profile`: Get current user's profile (requires authentication).
    *   `PATCH /users/profile`: Update current user's profile (requires authentication).
    *   `GET /users`: Get all users (admin only).
    *   `GET /users/:id`: Get user by ID (admin only).
    *   `PATCH /users/:id`: Update user by ID (admin only).
    *   `DELETE /users/:id`: Delete user by ID (admin only).
*   **Tasks Module**: Manages task-related operations.
    *   `POST /tasks`: Create a new task.
    *   `GET /tasks`: Get all tasks (with filtering/pagination).
    *   `GET /tasks/:id`: Get a task by ID.
    *   `PATCH /tasks/:id`: Update a task by ID.
    *   `DELETE /tasks/:id`: Delete a task by ID.
*   **Notification Module**: Handles sending email notifications.
    *   `POST /notification/email`: Send an email using a specified template and context. This endpoint is useful for external triggers or direct testing.

## Testing

For detailed instructions on how to run and write tests for this project, please refer to the [`testing.md`](./testing.md) file.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).