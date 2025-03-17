/** @format */

import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			return res
				.status(400)
				.json({ success: false, message: "User ID is required" });
		}

		const user = await userModel
			.findById(userId)
			.select("name email isAccountVerified");

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		return res.json({ success: true, userData: user });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};
