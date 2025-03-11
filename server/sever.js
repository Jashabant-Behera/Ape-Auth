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
if (
	!process.env.MONGODB_URI ||
	!process.env.JWT_SECRET ||
	!process.env.SMTP_USER ||
	!process.env.SMTP_PASS ||
	!process.env.SENDER_EMAIL
) {
	console.error("Missing required environment variables.");
	process.exit(1);
}
connectDB();

const allowedorigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: allowedorigins,
		credentials: true,
	})
);

//API Endpoints
app.get("/", (req, res) => {
	res.send("API WORKING");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
	console.log(`Server started on PORT: ${port}`);
});
