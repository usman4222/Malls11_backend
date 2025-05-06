import express from "express";
const authRouter = express.Router();
import {validateUserData} from "../../middlewares/validations.js";
import tokenValidations from "../../middlewares/tokenValidations.js";
import authController from "../../controller/userController/authController.js";


authRouter.post("/register-user",  authController.registerUser);
authRouter.post("/register/resendOtp", tokenValidations.verifyTempToken, authController.resendAccountVerificationOtp);
authRouter.post("/register/verify-account",tokenValidations.verifyTempToken, authController.verifyAccount);
authRouter.post("/login", authController.login);
authRouter.put("/change-password", tokenValidations.verifyToken, authController.changePassword);
authRouter.post("/forget-password", authController.forgetPassword);
authRouter.post("/forget-password/resendOtp", tokenValidations.verifyTempToken, authController.resendPasswordResetOtp);
authRouter.post(
  "/forget-password/verifyOtp",
  // validateUserData,
  tokenValidations.verifyTempToken,
  tokenValidations.otpVerify,
  (req, res) => {
    res.status(200).json({ message: "OTP verified successfully." });
  }
);
authRouter.post("/forget-password/resetPassword",  tokenValidations.verifyTempToken, tokenValidations.otpVerify, authController.setNewPassword);
authRouter.post("/verify-token", tokenValidations.verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid", data: req.body });
});

authRouter.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export default authRouter;
