import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

// Define a custom nanoid generator with only letters and numbers
const alphanumeric = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const generateId = customAlphabet(alphanumeric, 16); // 16-character ID


// Define User Schema
const userSchema = new mongoose.Schema(
    {
        // Username must be unique and required
        username: {
            type: String,
            required: [true, "Please provide a username"],
            unique: true,
        },

        // Email must be unique and required
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
        },

        // Password is required
        password: {
            type: String,
            required: [true, "Please provide the password"],
        },

        publicId: {
            type: String,
            required: true,
            unique: true,
            default: generateId,
        },

        // Boolean flag to indicate if user has verified their email
        isVerified: {
            type: Boolean,
            default: false,
        },

        // Boolean flag to indicate admin status
        isAdmin: {
            type: Boolean,
            default: false,
        },

        // Tokens for password reset
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,

        // Tokens for email verification
        verifyToken: String,
        verifyTokenExpiry: Date,
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

// Use existing model if it exists, otherwise create a new one
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
