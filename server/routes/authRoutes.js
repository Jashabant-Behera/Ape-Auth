import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  resetOTP,
  resetPassword,
  sendOTP,
  signup,
  verifyEmail,
} from "../controller/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verifyOTP", userAuth, sendOTP);
authRouter.post("/verifyAccount", userAuth, verifyEmail);
authRouter.get("/isAuth", userAuth, isAuthenticated);
authRouter.post("/resetOTP", resetOTP);
authRouter.post("/resetPassword", resetPassword);

export default authRouter;
