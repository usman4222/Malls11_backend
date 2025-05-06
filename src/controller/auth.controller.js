// import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
// import ErrorHandler from "../middlewares/errorHandler.js";
// import { UserModel } from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import { generateJwtToken } from "../utils/jwt.helper.js";
// import jwt from "jsonwebtoken";
// import { USER_ROLE } from "../config/enums/enums.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { sendMail } from "../config/NodeMailer.js";
// import otpGenerator from "otp-generator";
// import { OTP } from "../models/otpModel.js";
// import {
//   validateEmail,
//   validatePassword,
//   validatePasswordMatch,
//   validateRequiredFields,
// } from "../utils/validators.js";
// import TempUser from "../models/TempUser.js";

// // export const registerClient = catchAsyncErrors(async (req, res, next) => {
// //   const { fullname, email, password } = req.body;

// //   const user = await UserModel.exists({ email });

// //   if (Boolean(user)) {
// //     return next(new ErrorHandler("Client already exists", 400));
// //   }

// //   const hashedPassword = await bcrypt.hash(password, 10);

// //   const userInstance = new UserModel({
// //     fullname,
// //     email,
// //     password: hashedPassword,
// //     role: USER_ROLE.CLIENT,
// //   });

// //   const savedUser = (await userInstance.save()).toJSON();

// //   // const token = generateJwtToken({
// //   //   data: {
// //   //     role: savedUser?.role,
// //   //     email: savedUser?.email,
// //   //     type: USER_ROLE.CLIENT,
// //   //   },
// //   //   exp: "30m",
// //   // });

// //   // Find the most recent OTP for the email
// //   // const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
// //   // if (response.length === 0 || otp !== response[0].otp) {
// //   //   return res.status(400).json({
// //   //     success: false,
// //   //     message: 'The OTP is not valid',
// //   //   });
// //   // }

// //   // const verificationUrl = `https://malls11.com/api/auth/verify-client?token=${token}`;

// //   // sendMail({
// //   //   to: email,
// //   //   subject: "Please verify your Client Account",
// //   //   text: `Please visit this link to verify your account : ${verificationUrl}`,
// //   // });

// //   const { password: dummyPass, ...resUser } = savedUser;
// //   res
// //     .status(201)
// //     .json(ApiResponse(true, "Verify link has been sent.", { user: resUser }));
// // });

// export const registerClient = catchAsyncErrors(async (req, res, next) => {
//   const { fullname, email, password, confirmPassword } = req.body;

//   if (
//     validateRequiredFields({ fullname, email, password, confirmPassword }, next)
//   )
//     return;
//   if (validateEmail(email, next)) return;
//   if (validatePassword(password, next)) return;
//   if (validatePasswordMatch(password, confirmPassword, next)) return;

//   const user = await UserModel.exists({ email });

//   if (Boolean(user)) {
//     return next(new ErrorHandler("Client already exists", 400));
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const userInstance = new UserModel({
//     fullname,
//     email,
//     password: hashedPassword,
//     role: USER_ROLE.CLIENT,
//   });

//   const savedUser = (await userInstance.save()).toJSON();

//   // Generate JWT Token
//   const token = generateJwtToken({
//     data: {
//       id: savedUser._id,
//       role: savedUser.role,
//       email: savedUser.email,
//       type: USER_ROLE.CLIENT,
//     },
//     exp: "30m",
//   });

//   // Exclude password from the response
//   const { password: _, ...resUser } = savedUser;

//   res.status(201).json(
//     ApiResponse(true, "Client registered successfully", {
//       user: resUser,
//       token,
//     })
//   );
// });

// export const loginClient = catchAsyncErrors(async (req, res, next) => {
//   const { email, password } = req.body;

//   const user = await UserModel.findOne({ email });
//   if (!user) {
//     return next(new ErrorHandler("Invalid email or password", 401));
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return next(new ErrorHandler("Invalid email or password", 401));
//   }

//   // Generate token with longer expiration time if desired
//   const token = generateJwtToken({
//     data: {
//       id: user._id,
//       role: user.role,
//       email: user.email,
//     },
//     exp: "2m", // Set expiration to 1 hour (for example)
//   });

//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // HTTPS only in production
//     sameSite: 'strict',
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//     path: '/',
//   });

//   const { password: _, ...resUser } = user.toJSON();

//   // ✅ Send token in response
//   res.status(200).json({
//     success: true,
//     message: "Login successful",
//     user: resUser,
//     token, // <-- return token here
//   });
// });

// export const getClientProfile = catchAsyncErrors(async (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({
//       message: "Token expired or invalid. Please log in again.",
//     });
//   }

//   // Proceed to fetch user profile data
//   const user = await UserModel.findById(req.user._id).select("-password");

//   if (!user) {
//     return res.status(404).json({ message: "User not found." });
//   }

//   res
//     .status(200)
//     .json(ApiResponse(true, "User profile fetched successfully", { user }));
// });

// export const registerFreelancer = catchAsyncErrors(async (req, res, next) => {
//   const { fullname, email, password, confirmPassword } = req.body;

//   if (
//     validateRequiredFields({ fullname, email, password, confirmPassword }, next)
//   )
//     return;
//   if (validateEmail(email, next)) return;
//   if (validatePassword(password, next)) return;
//   if (validatePasswordMatch(password, confirmPassword, next)) return;

//   const user = await UserModel.exists({ email });

//   if (Boolean(user)) {
//     return next(new ErrorHandler("Client already exists", 400));
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const userInstance = new UserModel({
//     fullname,
//     email,
//     password: hashedPassword,
//     role: USER_ROLE.FREELANCER,
//   });

//   const savedUser = (await userInstance.save()).toJSON();

//   // Generate JWT Token
//   const token = generateJwtToken({
//     data: {
//       id: savedUser._id,
//       role: savedUser.role,
//       email: savedUser.email,
//       type: USER_ROLE.CLIENT,
//     },
//     exp: "30m",
//   });

//   // Exclude password from the response
//   const { password: _, ...resUser } = savedUser;

//   res.status(201).json(
//     ApiResponse(true, "Client registered successfully", {
//       user: resUser,
//       token,
//     })
//   );
// });

// export const loginFreelancer = catchAsyncErrors(async (req, res, next) => {
//   const { email, password } = req.body;

//   const user = await UserModel.findOne({ email });
//   if (!user) {
//     return next(new ErrorHandler("Invalid email or password", 401));
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return next(new ErrorHandler("Invalid email or password", 401));
//   }

//   // Generate token with longer expiration time if desired
//   const token = generateJwtToken({
//     data: {
//       id: user._id,
//       role: user.role,
//       email: user.email,
//     },
//     exp: "1h", // Set expiration to 1 hour (for example)
//   });

//   const { password: _, ...resUser } = user.toJSON();

//   // ✅ Send token in response
//   res.status(200).json({
//     success: true,
//     message: "Login successful",
//     user: resUser,
//     token, // <-- return token here
//   });
// });

// export const registerAdmin = catchAsyncErrors(async (req, res, next) => {
//   const { fullname, email, password, confirmPassword } = req.body;

//   if (
//     validateRequiredFields({ fullname, email, password, confirmPassword }, next)
//   )
//     return;
//   if (validateEmail(email, next)) return;
//   if (validatePassword(password, next)) return;
//   if (validatePasswordMatch(password, confirmPassword, next)) return;

//   const user = await UserModel.exists({ email });

//   if (user) {
//     return next(new ErrorHandler("User with this email already exists", 400));
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const userInstance1 = await UserModel.create({
//     fullname,
//     email,
//     password: hashedPassword,
//     role: USER_ROLE.ADMIN,
//     isVerified: true,
//   });

//   const savedUser = (await userInstance1.save()).toJSON();

//   // Generate JWT Token
//   const token = generateJwtToken({
//     data: {
//       id: savedUser._id,
//       role: savedUser.role,
//       email: savedUser.email,
//       type: USER_ROLE.ADMIN,
//     },
//     exp: "30m",
//   });

//   const { password: _, ...resUser } = savedUser;

//   res.status(201).json(
//     ApiResponse(true, "Admin registered successfully", {
//       user: resUser,
//       token,
//     })
//   );
// });

// export const loginAdmin = catchAsyncErrors(async (req, res, next) => {
//   const { email, password } = req.body;

//   const user = await UserModel.findOne({ email });
//   if (!user) {
//     return next(new ErrorHandler("Invalid email or password", 401));
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return next(new ErrorHandler("Invalid email or password", 401));
//   }

//   // Generate token with longer expiration time if desired
//   const token = generateJwtToken({
//     data: {
//       id: user._id,
//       role: user.role,
//       email: user.email,
//     },
//     exp: "2m", // Set expiration to 1 hour (for example)
//   });

//   const { password: _, ...resUser } = user.toJSON();

//   // ✅ Send token in response
//   res.status(200).json({
//     success: true,
//     message: "Login successful",
//     user: resUser,
//     token, // <-- return token here
//   });
// });

// export const sendOTP = catchAsyncErrors(async (req, res, next) => {
//   const { email } = req.body;

//   // 1. Validate email format
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid email format",
//     });
//   }

//   // 2. Check if user exists (modify this if you want to allow resends)
//   const existingUser = await UserModel.findOne({ email });
//   if (existingUser && existingUser.emailVerified) {
//     return res.status(409).json({
//       success: false,
//       message: "User already registered with this email",
//     });
//   }

//   // 3. Generate OTP
//   const otp = otpGenerator.generate(6, { digits: true });

//   // 4. Save OTP
//   await TempUser.findOneAndUpdate(
//     { email },
//     { otp, expiresAt: new Date(Date.now() + 900000) }, // 15 minutes
//     { upsert: true }
//   );

//   // 5. Send email to REAL account
//   try {
//     await sendMail({
//       to: email, // This now goes to the real user's email
//       subject: "Your Verification Code",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #2563eb;">Email Verification</h2>
//           <p>Your verification code is:</p>
//           <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
//             ${otp}
//           </div>
//           <p>This code will expire in 15 minutes.</p>
//         </div>
//       `,
//       text: `Your verification code is ${otp}. Expires in 15 minutes.`,
//     });

//     res.status(200).json({
//       success: true,
//       message: "OTP sent to your email",
//       // Only include in development
//       ...(process.env.NODE_ENV === "development" && { debugOtp: otp }),
//     });
//   } catch (error) {
//     console.error("Email error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to send OTP email",
//     });
//   }
// });

// export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
//   const { email, otp } = req.body;

//   // 1. Find the temporary record
//   const tempUser = await TempUser.findOne({ email });

//   if (!tempUser) {
//     return res.status(404).json({
//       success: false,
//       message: "No OTP request found for this email",
//     });
//   }

//   // 2. Check if OTP matches
//   if (tempUser.otp !== otp) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid OTP",
//     });
//   }

//   // 3. Check if OTP is expired
//   if (tempUser.expiresAt < new Date()) {
//     return res.status(401).json({
//       success: false,
//       message: "OTP has expired",
//     });
//   }

//   // 4. If everything is valid
//   // Delete the temporary record (optional)
//   await TempUser.deleteOne({ email });

//   // Return success response
//   res.status(200).json({
//     success: true,
//     message: "OTP verified successfully",
//   });
// });
