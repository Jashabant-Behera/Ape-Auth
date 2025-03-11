/** @format */

import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return res.json({ success: false, message: "Not Authorized Login" });
	}

	try {
		const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

		if (tokenDecode.id) {
			req.body.userId = tokenDecode.id;
		} else {
			console.log("JWT Verification Error:", error.message);
			return res.json({ success: false, message: error.message });
		}

		next();
	} catch (error) {
		return res.json({ success: false, message: error.message });
	}
};

export default userAuth;
