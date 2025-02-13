import { Router } from "express";
import { auth, sendMessage, sendOtp, verifyOtp } from "../controller/userController.js";

const authRouter = Router();

authRouter.post('/auth/send-otp', auth, sendOtp);
authRouter.post('/auth/verify-otp', verifyOtp);
authRouter.post('/auth/send-message', sendMessage);

export default authRouter;
