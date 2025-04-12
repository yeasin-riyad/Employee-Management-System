import { Router } from "express";
import { forgotPasswordController, getUserDetailsController, loginUserController, logoutController, refreshTokenController, registerUserController, resetPasswordOtpController, updatePasswordController, verifyEmailController } from "../controller/user.controller.js";
import { auth } from "../middleware/auth.js";


const userRouter = Router();

// Register User Api
userRouter.post('/register',registerUserController)
// Verify Email Route
userRouter.post('/verify-email',verifyEmailController)
// Login user Route
userRouter.post('/login-user',loginUserController)

// Forgot Password Route
userRouter.post('/forgot-password',forgotPasswordController)

// Verify Otp
userRouter.put('/verify-otp',resetPasswordOtpController)

//update Password
userRouter.put('/update-password',updatePasswordController)

// Get User Details
userRouter.get('/get-user',auth,getUserDetailsController)

// Refresh Token Api
userRouter.post('/refresh-token',refreshTokenController)

// Logout User Api
userRouter.post('/logout',auth,logoutController)




export default userRouter;