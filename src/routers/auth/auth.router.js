// import express from "express";
// import {
//   getClientProfile,
//   loginAdmin,
//   registerAdmin,
//   registerClient,
//   registerFreelancer,
//   sendOTP,
//   loginClient,
//   loginFreelancer,
//   verifyOTP,
// } from "../../controller/auth.controller.js";
// import validationMiddleware from "../../middlewares/validation.middleware.js";
// import { loginSchema, registerSchema } from "../../schema/zodauthentication.js";
// import upload from "../../middlewares/upload.file.js";
// import { authMiddleware, authorizeUser } from "../../middlewares/auth.middleware.js";

// const authRouter = express.Router();
// //Client
// authRouter.post(
//   "/signup-client",
//   validationMiddleware(registerSchema),
//   registerClient
// );
// authRouter.get("/login-client", loginClient);
// authRouter.get("/get-client/:userId", authMiddleware, authorizeUser(['ADMIN']), getClientProfile)

// authRouter.post('/send-otp', sendOTP);
// authRouter.post('/verify-otp', verifyOTP);
// //Freelancer
// authRouter.post(
//   "/signup-freelancer",
//   // upload.single("image"),
//   registerFreelancer
// );
// //Admin
// authRouter.post(
//   "/register-admin",
//   // upload.single("image"),
//   // validationMiddleware(registerSchema),
//   registerAdmin
// );

// authRouter.post("/login-freelancer", authMiddleware, loginFreelancer);
// authRouter.post("/login-admin", authMiddleware, loginAdmin);

// export default authRouter;
