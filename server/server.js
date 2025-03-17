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

connectDB();

// const allowedOrigins = ["https://ape-authentication.up.railway.app", "http://localhost:5174"];

app.use(
	cors({
		origin: 'https://ape-auth.vercel.app',
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("API IS WORKING");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
	console.log(`Server started on PORT: ${port}`);
});
