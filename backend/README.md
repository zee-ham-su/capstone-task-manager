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

## Project Structure

The project follows the standard NestJS application structure:

```
/src
├── /auth           # Authentication (login, registration, JWT)
├── /common         # Common modules (exceptions, filters, logging)
├── /notification   # Email notification system
├── /tasks          # Task management (CRUD, scheduling)
└── /users          # User management (CRUD, profiles)
```

## Project Setup

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community) (local instance or a cloud service like MongoDB Atlas)
*   [Docker](https://www.docker.com/get-started) (optional, for containerized deployment)

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

Here's a brief overview of the main endpoints:

| Module        | Endpoint                   | Method | Description                                | Authentication |
|---------------|----------------------------|--------|--------------------------------------------|----------------|
| **Auth**      | `/auth/register`           | `POST` | Register a new user                        | Public         |
|               | `/auth/login`              | `POST` | Log in and receive a JWT                   | Public         |
|               | `/auth/forgot-password`    | `POST` | Initiate password reset                    | Public         |
|               | `/auth/reset-password`     | `POST` | Reset password with a token                | Public         |
| **Users**     | `/users/profile`           | `GET`  | Get current user's profile                | JWT Required   |
|               | `/users/profile`           | `PATCH`| Update current user's profile             | JWT Required   |
|               | `/users`                   | `GET`  | Get all users                              | Admin Only     |
|               | `/users/:id`               | `GET`  | Get user by ID                             | Admin Only     |
|               | `/users/:id`               | `PATCH`| Update user by ID                          | Admin Only     |
|               | `/users/:id`               | `DELETE`| Delete user by ID                          | Admin Only     |
| **Tasks**     | `/tasks`                   | `POST` | Create a new task                          | JWT Required   |
|               | `/tasks`                   | `GET`  | Get all tasks (with filtering/pagination)| JWT Required   |
|               | `/tasks/:id`               | `GET`  | Get a task by ID                           | JWT Required   |
|               | `/tasks/:id`               | `PATCH`| Update a task by ID                        | JWT Required   |
|               | `/tasks/:id`               | `DELETE`| Delete a task by ID                        | JWT Required   |
| **Notification**| `/notification/email`      | `POST` | Send an email using a template             | Public         |


## Testing

For detailed instructions on how to run and write tests for this project, please refer to the [`testing.md`](./testing.md) file.

## Deployment

### Using Docker

A `Dockerfile` is provided for easy containerization.

1.  **Build the Docker image:**
    ```bash
    docker build -t task-manager-backend .
    ```

2.  **Run the Docker container:**
    Make sure to provide the environment variables, for example by using an `.env` file:
    ```bash
    docker run --env-file ./.env -p 3000:3000 task-manager-backend
    ```

### Other Deployment Options

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information on deploying to platforms like AWS, Google Cloud, or Heroku.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
