// backend/routes/userRoutes.js
import express from "express";
import {getUsers} from "../controllers/userController.js"; // Import the controller function
import { isAuthenticated} from "../middleware/auth.js"; // Import the authentication middleware

// define the router
const router = express.Router();

// define the route to get all the users
router.get("/", isAuthenticated, getUsers); // Use the authentication middleware

// define the route to update user role
router.put("/:id/role", isAuthenticated,checkRole(["admin"]),updateUserRole); // Use the authentication middleware and role check

//define the route to delete the user
router.delete("/:id", isAuthenticated. checkRole(["admin"]), deleteUser)

// export the router
export default router;