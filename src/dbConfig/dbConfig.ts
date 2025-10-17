import mongoose from "mongoose";

// Flag to track connection state across reloads
let isConnected = false;

/**
 * Establishes a connection to the MongoDB database.
 * Uses Mongoose and ensures a single persistent connection
 * during Next.js hot reloads or multiple API invocations.
 */
export async function connect() {
    // ✅ If already connected, skip reconnecting
    if (isConnected) {
        console.log("MongoDB already connected.");
        return;
    }

    try {
        // 🔒 Ensure that MONGO_URL is defined in .env.local
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable not defined.");
        }

        // ⚙️ Attempt to connect using the provided connection string
        const connection = await mongoose.connect(process.env.MONGO_URL);

        // 🔁 Update connection state flag
        isConnected = connection.connections[0].readyState === 1;

        // 🟢 Log connection success or pending state
        if (isConnected) {
            console.log("MongoDB connected successfully.");
        } else {
            console.log("MongoDB connection not yet ready.");
        }

        // 🧩 Listen for runtime connection errors
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

    } catch (error) {
        // Narrow down the error type safely
        if (error instanceof Error) {
            console.error("MongoDB connection failed:", error.message);
        } else {
            console.error("MongoDB connection failed:", error);
        }
        process.exit(1);
    }
}
