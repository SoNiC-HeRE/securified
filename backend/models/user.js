import mongoose from "mongoose";

// Define the user schema with improved naming conventions and additional validations
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/.+@.+\..+/, "Invalid email format"],
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Static methods for common operations
userSchema.statics = {
    // Find a user by email
    findByEmail(email) {
        return this.findOne({ email });
    },

    // Get all admins
    findAdmins() {
        return this.find({ role: "admin" });
    },
};

// Instance methods for individual document operations
userSchema.methods = {
    // Check if the user is an admin
    isAdmin() {
        return this.role === "admin";
    },

    // Sanitize user data (remove sensitive fields)
    sanitize() {
        const sanitizedData = this.toObject();
        delete sanitizedData.password; // Remove password before sending data
        return sanitizedData;
    },
};

// Add pre-save hooks for additional operations
userSchema.pre("save", function (next) {
    // Ensure email is lowercase
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
});

// Create and export the model
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
