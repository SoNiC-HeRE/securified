import express from "express";
import { register, login, logout, checkUser, resetPassword, updateProfile } from "../controllers/Auth.js";
import { isUser } from "../middleware/verifyToken.js";

const authRoutes = express.Router();

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
authRoutes.post("/register", register);

/**
 * @route POST /auth/login
 * @desc Login a user
 * @access Public
 */
authRoutes.post("/login", login);

/**
 * @route POST /auth/logout
 * @desc Logout the logged-in user
 * @access User
 */
authRoutes.post("/logout", isUser, logout);

/**
 * @route GET /auth/check-user
 * @desc Check details of the currently logged-in user
 * @access User
 */
authRoutes.get("/check-user", isUser, checkUser);

/**
 * @route POST /auth/reset-password
 * @desc Reset the password for a user
 * @access Public
 */
authRoutes.post("/reset-password", resetPassword);

/**
 * @route PUT /auth/update-profile
 * @desc Update profile details of the currently logged-in user
 * @access User
 */
authRoutes.put("/update-profile", isUser, updateProfile);

export default authRoutes;
