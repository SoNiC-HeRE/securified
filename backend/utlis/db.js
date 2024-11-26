import mongoose from "mongoose";

/**
 * Establish a connection to the MongoDB database.
 * @returns {Promise<void>}
 */
const connectToDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit process with failure
    }
};

/**
 * Close the MongoDB connection.
 * Useful for shutting down the app gracefully.
 * @returns {Promise<void>}
 */
const disconnectFromDatabase = async () => {
    try {
        await mongoose.disconnect();
        console.log("MongoDB connection closed.");
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error.message);
    }
};

export { connectToDatabase, disconnectFromDatabase };
