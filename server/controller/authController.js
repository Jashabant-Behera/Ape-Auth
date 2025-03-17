/** @format */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import {
	EMAIL_VERIFY_TEMPLATE,
	PASSWORD_RESET_TEMPLATE,
	WELCOME_TEMPLATE
} from "../config/emailTemplates.js";

export const signup = async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res
			.status(400)
			.json({ success: false, message: "Required Field Details are Missing" });
	}

	try {
		const existingUser = await userModel.findOne({ email });

		if (existingUser) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new userModel({ name, email, password: hashedPassword });

		await user.save();

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		const frontendurl = "https://ape-auth.vercel.app/login"
		const mailOptions = {
			from: process.env.SENDER_EMAIL,
			to: email,
			subject: "Welcome Message",
			html: WELCOME_TEMPLATE.replace("{{username}}", user.name).replace("{{frontend_url}}", frontendurl),
		};

		await transporter.sendMail(mailOptions);

		return res
			.status(201)
			.json({ success: true, message: "Successfully Registered" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "An error occurred during registration",
		});
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res
			.status(400)
			.json({ success: false, message: "Email and password are required" });
	}

	try {
		const user = await userModel.findOne({ email });

		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "User Not Found" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Incorrect Password" });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return res
			.status(200)
			.json({ success: true, message: "Successfully Logged In", token });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, message: "An error occurred during login" });
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie("token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		});

		return res.status(200).json({ success: true, message: "Logged Out" });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, message: "An error occurred during logout" });
	}
};

export const sendOTP = async (req, res) => {
	try {
		const { userId } = req.body;

		const user = await userModel.findById(userId);

		if (user.isAccountVerified) {
			return res
				.status(400)
				.json({ success: false, message: "Account is already verified" });
		}

		const OTP = String(Math.floor(100000 + Math.random() * 900000));

		user.verifyOTP = OTP;
		user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;

		await user.save();

		const mailOptions = {
			from: process.env.SENDER_EMAIL,
			to: user.email,
			subject: "Account Verification",
			html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", OTP).replace(
				"{{email}}",
				user.email
			),
		};

		await transporter.sendMail(mailOptions);

		return res.status(200).json({
			success: true,
			message: "Verification Message Sent to The Mail",
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, message: "An error occurred while sending OTP" });
	}
};

export const verifyEmail = async (req, res) => {
	const { userId, OTP } = req.body;

	if (!userId || !OTP) {
		return res.status(400).json({ success: false, message: "Missing Details" });
	}

	try {
		const user = await userModel.findById(userId);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (user.verifyOTP === "" || user.verifyOTP !== OTP) {
			return res.status(400).json({ success: false, message: "Invalid OTP" });
		}

		if (user.verifyOTPExpireAt < Date.now()) {
			return res.status(400).json({ success: false, message: "OTPis expired" });
		}

		user.isAccountVerified = true;
		user.verifyOTP = "";
		user.verifyOTPExpireAt = 0;

		await user.save();
		return res
			.status(200)
			.json({ success: true, message: "Email Verified Successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "An error occurred during email verification",
		});
	}
};

export const isAuthenticated = async (req, res) => {
	try {
        const { userId } = req;

        if (!userId) {
			return res.status(401).json({ success: false, message: "User not authenticated" });
		}

        const user = await userModel.findById(userId);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
        
        if (!user.isAccountVerified) {
			return res.status(403).json({ success: false, message: "Account not verified" });
		}

		return res
			.status(200)
			.json({ success: true, message: "User is authenticated" });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, message: "Authentication error" });
	}
};

export const resetOTP = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res
			.status(400)
			.json({ success: false, message: "Email is required" });
	}

	try {
		const user = await userModel.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User Not Found" });
		}

		const OTP = String(Math.floor(100000 + Math.random() * 900000));

		user.resetOTP = OTP;
		user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000;

		await user.save();

		const mailOptions = {
			from: process.env.SENDER_EMAIL,
			to: user.email,
			subject: "Reset Password",
			// text: `Your OTPis ${OTP}. Reset your password using this OTP. Do not share this OTP.`,
			html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", OTP).replace(
				"{{email}}",
				user.email
			),
		};

		await transporter.sendMail(mailOptions);

		return res
			.status(200)
			.json({ success: true, message: "OTPsent to your email" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "An error occurred while sending reset OTP",
		});
	}
};

export const resetPassword = async (req, res) => {
	const { email, OTP, newPassword } = req.body;

	if (!email || !OTP || !newPassword) {
		return res.status(400).json({
			success: false,
			message: "Email, OTP, and new Password are required",
		});
	}

	try {
		const user = await userModel.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (
			user.resetOTP !== OTP ||
			user.resetOTP === "" ||
			user.resetOTPExpireAt < Date.now()
		) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid or expired OTP" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;
		user.resetOTP = "";
		user.resetOTPExpireAt = 0;

		await user.save();
		return res
			.status(200)
			.json({ success: true, message: "Password reset successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "An error occurred during password reset",
		});
	}
};
