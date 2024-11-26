import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if user is an admin
        if (user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized: User is not an admin" });
        }

        // Attach user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in isAdmin middleware:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Middleware to check if the user is authenticated
const isUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Attach user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in isUser middleware:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Middleware to check if the user is authenticated and has a specific role
const hasRole = (role) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token;

            // Check if token is provided
            if (!token) {
                return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from database
            const user = await UserModel.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // Check if user has the required role
            if (user.role !== role) {
                return res.status(403).json({ success: false, message: `Unauthorized: User is not a ${role}` });
            }

            // Attach user to the request object
            req.user = user;
            next();
        } catch (error) {
            console.error(`Error in hasRole middleware (${role}):`, error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };
};

export { isAdmin, isUser, hasRole };
