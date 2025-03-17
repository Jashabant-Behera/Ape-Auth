/** @format */

import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
	const token =
	req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

	if (!token) {
		return res
			.status(401)
			.json({
				success: false,
				message: "Not authorized. Please log in again.",
			});
	}

	try {
		const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

		if (tokenDecode.id) {
			req.body.userId = tokenDecode.id;
			next(); // Pass control to the next middleware or route handler
		} else {
			return res.status(401).json({
				success: false,
				message: "Not authorized. Please log in again.",
			});
		}
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Not authorized. Please log in again.",
		});
	}
};

export default userAuth;
