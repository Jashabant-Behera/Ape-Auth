/** @format */

import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigins = ["https://ape-auth.vercel.app", "http://localhost:5174"];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true, // Allow cookies to be sent
	})
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// API Endpoints
app.get("/", (req, res) => {
	res.send("API IS WORKING");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get('/api/auth/isAuth', (req, res) => {
    res.json({ message: 'CORS is working!' });
});


// Start the Server
app.listen(port, () => {
	console.log(`Server started on PORT: ${port}`);
});
