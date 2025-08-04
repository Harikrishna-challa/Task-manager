// routes/taskRoutes.js
import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskById,
  getDashboardTasks,
} from "../controllers/taskController.js";
import {checkRole} from "../middleware/role.js";

import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

//  Create a task
router.post("/create", isAuthenticated, checkRole(["admin"]), createTask);

//  Get all tasks of logged-in user
router.get("/", isAuthenticated, getTasks);           

//  Get dashboard grouped tasks
router.get("/dashboard", isAuthenticated, getDashboardTasks);  //  NEW route

// Get a single task by ID
router.get("/:id", isAuthenticated, getTaskById);      

//  Update a task
router.put("/:id", isAuthenticated, updateTask);      

//  Delete a task
router.delete("/:id", isAuthenticated, checkRole(["admin"]), deleteTask);

export default router;
