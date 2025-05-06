// import { USER_ROLE } from "../config/enums/enums.js";
// import { UserModel } from "../models/userSchema.js";
// import { decodeJwtToken, verifyJwtToken } from "../utils/jwt.helper.js";
// import { catchAsyncErrors } from "./catchAsyncErrors.js";
// import ErrorHandler from "./errorHandler.js";

// export const authMiddleware = catchAsyncErrors(async (req, res, next) => {
//   const authorizationHeader = req.headers.authorization;

//   if (!authorizationHeader) {
//     req.user = null;
//     return next();
//   }

//   const token = authorizationHeader.split(" ")[1];

//   if (!token) {
//     req.user = null;
//     return next();
//   }

//   let decoded;
//   try {
//     decoded = verifyJwtToken(token);  // Decode the token and verify expiration
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       return res.status(401).json({
//         message: "Token expired. Please log in again."
//       });
//     }
//     return next(new ErrorHandler("Invalid token. Please log in again", 401));
//   }

//   const user = await UserModel.findOne({ email: decoded.email });

//   req.user = user;

//   return next();
// });


// export const authorizeUser = (allowedRoles = []) => {
//   return catchAsyncErrors(async (req, res, next) => {
//     // 1. Check if user is authenticated
//     if (!req.user) {
//       return next(new ErrorHandler("Authentication required", 401));
//     }

//     // 2. Check if account is verified
//     // if (req.user.isVerified === false) {
//     //   return next(new ErrorHandler("Please verify your account", 403));
//     // }

//     // 3. If no specific roles required, allow access
//     if (allowedRoles.length === 0) {
//       return next();
//     }

//     // 4. Check if user has required role
//     if (!allowedRoles.includes(req.user.role)) {
//       return next(new ErrorHandler(
//         `Role: ${req.user.role} is not allowed to access this resource.`,
//         403
//       ));
//     }

//     // 5. If all checks passed, allow access
//     next();
//   });
// };
