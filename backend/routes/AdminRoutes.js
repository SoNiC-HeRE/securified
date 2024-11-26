import express from "express";
import { getAllUsers, deleteUser, updateUser, getUserById } from "../controllers/Admin.js";
import { isAdmin } from "../middleware/verifyToken.js";

const adminRoutes = express.Router();

/**
 * Route to get all users
 * Access: Admin only
 */
adminRoutes.get("/users", isAdmin, getAllUsers);

/**
 * Route to get a single user by ID
 * Access: Admin only
 */
adminRoutes.get("/users/:id", isAdmin, getUserById);

/**
 * Route to delete a user by ID
 * Access: Admin only
 */
adminRoutes.delete("/users/:id", isAdmin, deleteUser);

/**
 * Route to update a user's details
 * Access: Admin only
 */
adminRoutes.put("/users/:id", isAdmin, updateUser);

export default adminRoutes;
