import UserModel from "../models/user.js";

// Controller to get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select("-password"); // Exclude password field
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controller to get a single user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user by ID:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controller to delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Prevent admin from deleting themselves
        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Admins cannot delete themselves" });
        }

        await UserModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controller to update a user's details
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();
        res.status(200).json({ success: true, message: "User updated successfully", user: user.sanitize() });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
