# Testing the Task Manager API

This document provides a step-by-step guide to testing the backend features of the Task Manager API using the Swagger UI.

## Prerequisites

Make sure the backend server is running. You can start it with the following command:

```bash
npm run start:dev
```

The API documentation will be available at [http://localhost:3000/api](http://localhost:3000/api).

## 1. Authentication

### 1.1. Register a New User

1.  Open your browser and navigate to [http://localhost:3000/api](http://localhost:3000/api).
2.  Expand the **auth** section.
3.  Click on the `POST /auth/register` endpoint.
4.  Click the **Try it out** button.
5.  In the request body, provide a name, email, and password for the new user. For example:

    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

6.  Click the **Execute** button. You should get a `201 Created` response.

### 1.2. Log In

1.  In the **auth** section, click on the `POST /auth/login` endpoint.
2.  Click the **Try it out** button.
3.  In the request body, provide the email and password of the user you just registered.

    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

4.  Click the **Execute** button. You should get a `200 OK` response with an `access_token` in the response body.

### 1.3. Authorize Swagger UI

1.  Copy the `access_token` from the response body of the login request.
2.  At the top of the page, click the **Authorize** button.
3.  In the dialog that appears, type `Bearer ` (with a space at the end) and then paste your `access_token` into the **Value** field for the **jwt** authorization.
4.  Click the **Authorize** button in the dialog, and then **Close**.

### 1.4. Password Reset

1.  **Request a password reset link:**
    -   In the **auth** section, click on the `POST /auth/forgot-password` endpoint.
    -   Click the **Try it out** button.
    -   In the request body, provide the email of the user who forgot their password.
    -   Click the **Execute** button. A password reset link will be logged to the console where your backend server is running.
2.  **Reset the password:**
    -   Copy the `token` from the reset link in the console.
    -   In the **auth** section, click on the `POST /auth/reset-password` endpoint.
    -   Click the **Try it out** button.
    -   In the request body, provide the `token` and a `newPassword`.
    -   Click the **Execute** button. You should get a `200 OK` response.

## 2. Tasks

Now that you are authenticated, you can test the **tasks** endpoints.

### 2.1. Create a Task

1.  Expand the **tasks** section.
2.  Click on the `POST /tasks` endpoint.
3.  Click the **Try it out** button.
4.  In the request body, provide a title, description, and optionally `tags` for the new task. For example:

    ```json
    {
      "title": "My first task",
      "description": "This is the description of my first task.",
      "tags": ["work", "urgent"]
    }
    ```

5.  Click the **Execute** button. You should get a `201 Created` response.
6.  Copy the `_id` of the created task from the response body for the next steps.

### 2.2. Get All Tasks

1.  In the **tasks** section, click on the `GET /tasks` endpoint.
2.  Click the **Try it out** button.
3.  You can optionally filter tasks by `tags`. In the `tags` query parameter field, enter a comma-separated list of tags (e.g., `work,personal`).
4.  Click the **Execute** button. You should get a `200 OK` response with an array of tasks belonging to the authenticated user, optionally filtered by tags.

### 2.3. Get a Task by ID

1.  In the **tasks** section, click on the `GET /tasks/{id}` endpoint.
2.  Click the **Try it out** button.
3.  In the **id** parameter field, paste the `_id` of the task you created earlier.
4.  Click the **Execute** button. You should get a `200 OK` response with the details of the task.

### 2.4. Update a Task

1.  In the **tasks** section, click on the `PATCH /tasks/{id}` endpoint.
2.  Click the **Try it out** button.
3.  In the **id** parameter field, paste the `_id` of the task.
4.  In the request body, provide the fields you want to update, including `tags` if desired. For example, to mark the task as completed and add a tag:

    ```json
    {
      "completed": true,
      "tags": ["done"]
    }
    ```

5.  Click the **Execute** button. You should get a `200 OK` response with the updated task.

### 2.5. Delete a Task

1.  In the **tasks** section, click on the `DELETE /tasks/{id}` endpoint.
2.  Click the **Try it out** button.
3.  In the **id** parameter field, paste the `_id` of the task.
4.  Click the **Execute** button. You should get a `200 OK` response.

### 2.6. Task Due Date Notifications

A background job runs every minute to check for tasks that are due within the next 24 hours. If a task is found to be due soon, a warning message will be logged to your backend console, including the task's title, ID, and due date.

## 3. Users

### 3.1. User Settings

As an authenticated user, you can manage your own settings.

1.  **Get your information:**
    -   In the **users** section, click on the `GET /users/me` endpoint.
    -   Click the **Try it out** button.
    -   Click the **Execute** button. You should get a `200 OK` response with your user information.
2.  **Update your information:**
    -   In the **users** section, click on the `PATCH /users/me` endpoint.
    -   Click the **Try it out** button.
    -   In the request body, provide the fields you want to update. For example, to change your name:

        ```json
        {
          "name": "Johnathan Doe"
        }
        ```

    -   Click the **Execute** button. You should get a `200 OK` response with the updated user information.

### 3.2. Admin Operations

The following endpoints are restricted to admin users only:

*   `GET /users`
*   `GET /users/{id}`
*   `PATCH /users/{id}`
*   `DELETE /users/{id}`

To test these endpoints, you need to have a user with the `admin` role.

#### Granting Admin Privileges

I have created a script to grant admin privileges to a user. Here's how to use it:

1.  Make sure you have a user registered in the database.
2.  Run the following command in your terminal, in the `backend` directory:

    ```bash
    npm run add-admin -- <email>
    ```

    Replace `<email>` with the email address of the user you want to make an admin. For example:

    ```bash
    npm run add-admin -- john.doe@example.com
    ```

This will add the 'admin' role to the user, allowing them to access the admin-only endpoints.
