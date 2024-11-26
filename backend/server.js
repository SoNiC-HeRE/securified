import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDatabase, disconnectFromDatabase } from "./utlis/db.js";
import AuthRoutes from "./routes/Auth.js";
import AdminRoutes from "./routes/AdminRoutes.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

// Database connection
(async () => {
    try {
        await connectToDatabase();
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
})();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies
app.use(
    cors({
        credentials: true,
        origin: CLIENT_URL, // Dynamically use the client URL from environment variables
    })
);

// API Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", AdminRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running!" });
});

// Graceful shutdown for termination signals
const shutdown = async () => {
    try {
        console.log("\nGracefully shutting down...");
        await disconnectFromDatabase();
        console.log("Database disconnected.");
        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown:", error.message);
        process.exit(1);
    }
};

// Listen to termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
