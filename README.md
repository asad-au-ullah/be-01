# Task API

A simple RESTful Task API built with **Node.js**, **Express**, and **OpenAPI/Swagger**.

The project demonstrates basic CRUD operations, request validation, HTTP status codes, and interactive API documentation with Swagger UI.

## Features

* RESTful API built with Express
* Create, read, update, and delete tasks
* Request validation
* Proper HTTP status codes
* Health-check endpoint
* OpenAPI 3.0 API specification
* Interactive Swagger UI documentation

## Tech Stack

* Node.js
* Express.js
* OpenAPI 3.0
* Swagger UI Express

## Project Structure

```text
be-01/
├── app.js
├── openapi.json
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the application

```bash
node app.js
```

The API will be available at:

```text
http://localhost:3000
```

## API Documentation

Interactive Swagger documentation is available at:

```text
http://localhost:3000/api-docs
```

The OpenAPI specification is stored in:

```text
openapi.json
```

## Endpoints

### API Information

```http
GET /
```

Returns basic information about the API.

Example response:

```json
{
  "name": "Task API",
  "version": "1.0",
  "endpoints": [
    "/tasks"
  ]
}
```

### Hello World

```http
GET /hello
```

Returns:

```text
Hello World!
```

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

### Get All Tasks

```http
GET /tasks
```

Returns all tasks.

Example response:

```json
[
  {
    "id": 1,
    "title": "Learn Express",
    "done": false
  },
  {
    "id": 2,
    "title": "Learn OpenAPI",
    "done": true
  }
]
```

### Get Task by ID

```http
GET /tasks/:id
```

Example:

```http
GET /tasks/1
```

Returns the requested task.

If the task doesn't exist:

```json
{
  "error": "Task 1 not found"
}
```

### Create a Task

```http
POST /tasks
```

Request body:

```json
{
  "title": "Learn Swagger"
}
```

Example response:

```json
{
  "id": 3,
  "title": "Learn Swagger",
  "done": false
}
```

Returns HTTP `201 Created` when successful.

An empty or invalid title returns HTTP `400 Bad Request`.

### Update a Task

```http
PUT /tasks/:id
```

Example:

```http
PUT /tasks/1
```

Request body:

```json
{
  "title": "Learn Express and OpenAPI",
  "done": true
}
```

Example response:

```json
{
  "id": 1,
  "title": "Learn Express and OpenAPI",
  "done": true
}
```

Both `title` and `done` are required.

### Delete a Task

```http
DELETE /tasks/:id
```

Example:

```http
DELETE /tasks/1
```

Returns HTTP `204 No Content` when the task is successfully deleted.

If the task doesn't exist, the API returns HTTP `404 Not Found`.

## HTTP Status Codes

| Status | Meaning                       |
| ------ | ----------------------------- |
| `200`  | Request successful            |
| `201`  | Resource created              |
| `204`  | Resource deleted successfully |
| `400`  | Invalid request data          |
| `404`  | Resource not found            |

## Data Model

A task has the following structure:

```json
{
  "id": 1,
  "title": "Learn Express",
  "done": false
}
```

| Field   | Type    | Description            |
| ------- | ------- | ---------------------- |
| `id`    | Integer | Unique task identifier |
| `title` | String  | Task title             |
| `done`  | Boolean | Completion status      |

## API Documentation with Swagger

The API specification is defined in `openapi.json`.

Swagger UI is mounted using:

```js
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
```

This provides an interactive interface where API endpoints can be explored and tested directly from the browser.

## Current Limitations

This project currently stores tasks in memory.

Therefore:

* Data is lost when the application restarts.
* There is no persistent database.
* There is no authentication or authorization.
* The API is intended for learning and demonstration purposes.

## Future Improvements

Possible next steps include:

* Add MongoDB or PostgreSQL persistence
* Add authentication and authorization
* Add centralized error handling
* Add automated tests
* Add environment-based configuration
* Add Docker support
* Add CI/CD
* Deploy the API to a cloud platform

## License

This project is for educational and demonstration purposes.
