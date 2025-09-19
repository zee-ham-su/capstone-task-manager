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
3.  In the dialog that appears, paste your `access_token` into the **Value** field for the **jwt** authorization.
4.  Click the **Authorize** button in the dialog, and then **Close**.

## 2. Tasks

Now that you are authenticated, you can test the **tasks** endpoints.

### 2.1. Create a Task

1.  Expand the **tasks** section.
2.  Click on the `POST /tasks` endpoint.
3.  Click the **Try it out** button.
4.  In the request body, provide a title and description for the new task. For example:

    ```json
    {
      "title": "My first task",
      "description": "This is the description of my first task."
    }
    ```

5.  Click the **Execute** button. You should get a `201 Created` response.
6.  Copy the `_id` of the created task from the response body for the next steps.

### 2.2. Get All Tasks

1.  In the **tasks** section, click on the `GET /tasks` endpoint.
2.  Click the **Try it out** button.
3.  Click the **Execute** button. You should get a `200 OK` response with an array of tasks belonging to the authenticated user.

### 2.3. Get a Task by ID

1.  In the **tasks** section, click on the `GET /tasks/{id}` endpoint.
2.  Click the **Try it out** button.
3.  In the **id** parameter field, paste the `_id` of the task you created earlier.
4.  Click the **Execute** button. You should get a `200 OK` response with the details of the task.

### 2.4. Update a Task

1.  In the **tasks** section, click on the `PATCH /tasks/{id}` endpoint.
2.  Click the **Try it out** button.
3.  In the **id** parameter field, paste the `_id` of the task.
4.  In the request body, provide the fields you want to update. For example, to mark the task as completed:

    ```json
    {
      "completed": true
    }
    ```

5.  Click the **Execute** button. You should get a `200 OK` response with the updated task.

### 2.5. Delete a Task

1.  In the **tasks** section, click on the `DELETE /tasks/{id}` endpoint.
2.  Click the **Try it out** button.
3.  In the **id** parameter field, paste the `_id` of the task.
4.  Click the **Execute** button. You should get a `200 OK` response.

## 3. Users

You can also test the **users** endpoints.

### 3.1. Get All Users

1.  Expand the **users** section.
2.  Click on the `GET /users` endpoint.
3.  Click the **Try it out** button.
4.  Click the **Execute** button. You should get a `200 OK` response with an array of all users.

### 3.2. Get a User by ID

1.  In the **users** section, click on the `GET /users/{id}` endpoint.
2.  Click the **Try it out** button.
3.  In the **id** parameter field, paste the `_id` of the user you created earlier.
4.  Click the **Execute** button. You should get a `200 OK` response with the details of the user.

### 3.3. Update a User

1.  In the **users** section, click on the `PATCH /users/{id}` endpoint.
2.  Click the **Try it out** button.
3.  In the **id** parameter field, paste the `_id` of the user.
4.  In the request body, provide the fields you want to update. For example, to change the user's name:

    ```json
    {
      "name": "Johnathan Doe"
    }
    ```

5.  Click the **Execute** button. You should get a `200 OK` response with the updated user.

### 3.4. Delete a User

1.  In the **users** section, click on the `DELETE /users/{id}` endpoint.
2.  Click the **Try it out** button.
3.  In the **id** parameter field, paste the `_id` of the user.
4.  Click the **Execute** button. You should get a `200 OK` response.
