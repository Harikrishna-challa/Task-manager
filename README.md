# Task-manager
 full-stack task management web application built with React, Node.js, Express, and MongoDB, inspired by platforms like Jira and ServiceNow.
# Task Manager, Full-Stack MERN Application

This project is a full-stack Task Manager built using the MERN stack (MongoDB, Express, React, Node.js).  
I created it to practice and showcase real-world backend and frontend engineering. This includes authentication, real-time updates, and clear project structure.

The goal of this project is not just to manage tasks. It also demonstrates how to design and expand a production-ready system.

---

## Why I built this

Most task manager demos only include basic CRUD functions.

This project goes further by focusing on:
- clean backend architecture
- secure authentication
- real-time collaboration
- scalability and future expansion, including AI, mobile apps, and cloud

It’s designed in the same way I would start a real product.

---

## What the app does

### Authentication
- Users can register and log in
- Passwords are securely hashed using bcrypt
- JWT protects private routes

### Task Management
- Create, view, update, and delete tasks
- Assign tasks to users
- Track task status, priority, and due date
- View all tasks relevant to the logged-in user

### Real-Time Updates
- When a task is created or updated, all connected clients see it right away
- Powered by Socket.io

### Clean Architecture
- Controllers, routes, middleware, and models are separated
- Easy to maintain and extend
- Backend is stateless and scalable

---

## Tech Stack

**Frontend**
- React 18
- Vite
- Axios
- Socket.io client

**Backend**
- Node.js
- Express
- MongoDB with Mongoose
- Socket.io
- JWT and bcrypt
- Helmet and CORS

---

## Project Structure

backend/
├─ config/
├─ controllers/
├─ middleware/
├─ models/
├─ routes/
└─ server.js

frontend/
├─ src/
│ ├─ api/
│ ├─ components/
│ ├─ pages/
│ └─ App.jsx

---

## Getting Started, Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```
### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Environment Variables
Create a .env file using .env.example:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```
## API Overview

**Auth**
- POST /api/auth/register
- POST /api/auth/login

**Tasks**
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

All task routes are protected and require authentication.

### Real-Time Example
Open the app in two browser windows.

Log in using the same account.

Create a task in one window.

The task appears right away in the other window.

This works through WebSockets, not polling.

### Security Notes
- Passwords are never stored in plain text.
- JWT is validated on every protected request.
- Security middleware (Helmet) is enabled.
- Designed to support httpOnly cookies and CSRF protection in production.

### What I plan to add next
- httpOnly cookie-based authentication
- AI-assisted task creation using natural language input
- Task priority prediction
- Team workspaces and roles
- Comments and activity logs
- Mobile app using React Native
- Better test coverage and CI pipeline

## Author
Hari  
Aspiring Full-Stack Developer  
Focused on building scalable, real-world applications.

## Final note
This project is intentionally built as a foundation, not a finished product. It shows how I approach real applications: start clean, build securely, and leave room to grow.

If you’re reviewing this project, any feedback is always welcome.
