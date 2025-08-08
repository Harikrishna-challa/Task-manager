import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
// Import routes
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // Import user routes
// Import DB connector
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

//  Proper CORS setup
const allowedOrigins = [
  "https://task-manager-smoky-zeta.vercel.app",
  "http://localhost:3000", // for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl) or allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// ➤ Parse cookies & JSON bodies
app.use(cookieParser());
app.use(express.json());

//  MongoDB connection
connectDB();

//  API routes
app.use("/api/auth", authRoutes);// Use auth routes
app.use("/api/tasks", taskRoutes);// Use task routes
app.use("/api/users", userRoutes); // Use user routes

//  Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port http://localhost:${PORT}`);
});
