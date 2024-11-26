import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Controller to handle user registration
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Error in register:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controller to handle user login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 3600000 });
        res.status(200).json({ success: true, message: "Login successful", user: user.sanitize(), token });
    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controller to handle user logout
export const logout = (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Error in logout:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controller to check the current user
export const checkUser = (req, res) => {
    try {
        const user = req.user.sanitize();
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error in checkUser:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controller to reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await UserModel.findByEmail(email);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = req.user;

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();
        res.status(200).json({ success: true, message: "Profile updated successfully", user: user.sanitize() });
    } catch (error) {
        console.error("Error in updateProfile:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
