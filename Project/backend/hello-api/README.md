# Hello API – Express + TypeScript

A simple REST API built using **Node.js, Express.js, and TypeScript**. This project demonstrates basic API development, HTTP methods, query parameters, input validation, and HTTP status codes.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- tsx

## Project Structure

```text
hello-api/
├── src/
│   ├── app.ts
│   └── server.ts
├── dist/
├── node_modules/
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Installation

Clone the repository and navigate to the project directory.

Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The server starts at:

`http://localhost:3000`

### Production Build

Compile TypeScript into JavaScript:

```bash
npm run build
```

Run the compiled application:

```bash
npm start
```

## API Endpoints

### 1. Health Check

**GET** `/health`

Checks whether the API server is running.

Example:

`http://localhost:3000/health`

Response – `200 OK`

```json
{
  "status": "UP",
  "message": "Hello API is running successfully"
}
```

### 2. Hello with Name

**GET** `/hello?name=Prakash`

Accepts a name through a query parameter and returns a greeting.

Example:

`http://localhost:3000/hello?name=Prakash`

Response – `200 OK`

```json
{
  "message": "Hello, Prakash!"
}
```

### 3. Hello without Name

**GET** `/hello`

If the name parameter is not provided, the API returns a default greeting.

Response – `200 OK`

```json
{
  "message": "Hello, World!"
}
```

### 4. Invalid Input

**GET** `/hello?name=`

If an empty name is provided, the API returns a validation error.

Response – `400 Bad Request`

```json
{
  "error": "Name must be a non-empty string"
}
```

### 5. Unknown Endpoint

Any endpoint that is not defined returns a 404 response.

Example:

`http://localhost:3000/anything`

Response – `404 Not Found`

```json
{
  "error": "Endpoint not found"
}
```

## HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 400 | Invalid request input |
| 404 | Endpoint not found |

## Key Concepts Learned

- Setting up an Express application with TypeScript.
- Creating and starting an HTTP server.
- Implementing GET endpoints.
- Handling query parameters using `req.query`.
- Validating request input.
- Returning JSON responses.
- Handling unknown routes.
- Compiling TypeScript into JavaScript.

---

**Project:** Hello API  
**Category:** Backend Development  
**Status:** Completed