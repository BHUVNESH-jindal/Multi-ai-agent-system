# Adaptive Multi-Agent AI Orchestration Platform (Step 1)

This repository contains **Step 1** of the Adaptive Multi-Agent AI Orchestration Platform. It implements the Task Ingestion pipeline allowing clients to submit prompts and file attachments, store tasks in MongoDB with `pending` status, determine task modality, and list recent tasks.

---

## Technical Stack

- **Backend**: Node.js (CommonJS), Express, Mongoose (v8), Multer, Cors, Morgan, Dotenv
- **Frontend**: React 18, Vite, Plain JavaScript, Native Fetch API, Plain CSS
- **Database**: MongoDB (v6/v7 running on `127.0.0.1:27017`)
- **Ports**: Server `5001`, Client `5173`

---

## Directory Structure

```
multi-agent-platform/
  server/
    package.json
    .env.example
    .env
    .gitignore
    uploads/
      .gitkeep
    src/
      index.js
      app.js
      config/db.js
      models/Task.js
      routes/taskRoutes.js
      controllers/taskController.js
      middleware/upload.js
      middleware/errorHandler.js
      services/orchestrator.js
  client/
    package.json
    index.html
    vite.config.js
    src/
      main.jsx
      App.jsx
      api.js
      components/TaskForm.jsx
      components/TaskList.jsx
      styles.css
  README.md
```

---

## Setup & Running Instructions

### Prerequisites
- Node.js 18+
- MongoDB instance running on `127.0.0.1:27017`

---

### 1. Server Setup & Run

1. Navigate to the `server` directory:
   ```bash
   cd multi-agent-platform/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured (defaults to port 5001 and local MongoDB):
   ```env
   PORT=5001
   MONGO_URI=mongodb://127.0.0.1:27017/multi_agent_platform
   CLIENT_ORIGIN=http://localhost:5173
   ```

4. Run the server in development mode:
   ```bash
   npm run dev
   ```
   Or production mode:
   ```bash
   npm start
   ```

---

### 2. Client Setup & Run

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd multi-agent-platform/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Access the web interface at `http://localhost:5173`.

---

## API Documentation

### `GET /api/health`
Returns system health status.
- **Response 200 OK**: `{"ok": true}`

### `POST /api/tasks`
Creates a new task.
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `prompt`: String (required, 1 - 10000 characters)
  - `files`: Array of files (0 to 5 files max, up to 10MB each)
- **Allowed File Types**: `image/png`, `image/jpeg`, `image/webp`, `image/gif`, `application/pdf`, `text/plain`
- **Response 201 Created**: Task object with status `"pending"` and determined `modality` (`text`, `image`, `document`, or `mixed`).
- **Response 400 Bad Request**: Invalid prompt or file validation error.

### `GET /api/tasks/:id`
Retrieves a specific task by its MongoDB ObjectId.
- **Response 200 OK**: Task JSON object.
- **Response 400 Bad Request**: Invalid ObjectId format.
- **Response 404 Not Found**: Task not found.

### `GET /api/tasks?limit=20`
Retrieves recent tasks sorted newest first.
- **Query Params**: `limit` (optional, integer between 1 and 50, default 20)
- **Response 200 OK**: Array of task JSON objects.
