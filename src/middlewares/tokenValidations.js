import { sendError } from "../utils/response.js";
import jwt from "jsonwebtoken";
import { UserModel as User } from "../models/userSchema.js"; // Fixed consistency

const verifyToken = async (req, res, next) => {
  const tokenString = req.headers.authorization;

  if (!tokenString) {
    return sendError(res, "Authorization header missing", 401);
  }

  const token = tokenString.split(" ")[1];
  if (!token) {
    return sendError(res, "Bearer token missing", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || secretKey);
    const { userId, tokenVersion } = decoded;

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (user.tokenVersion !== tokenVersion) {
      return sendError(res, "Session expired. Please login again.", 401);
    }

    req.user = {
      // Standard practice to attach to req.user
      id: user._id,
      name: user.name,
      email: user.email,
      darkMode: user.darkMode,
      profilePicture: user.profilePicture,
    };

    next();
  } catch (error) {
    return sendError(
      res,
      error.name === "TokenExpiredError"
        ? "Token expired"
        : "Invalid token or malformed",
      401
    );
  }
};

const verifyTempToken = async (req, res, next) => {
  const { tempToken: token } = req.query;

  if (!token) {
    return sendError(res, "Token parameter missing", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "Invalid token", 404);
    }

    req.user = { email }; // Standardize attachment to req.user
    next();
  } catch (error) {
    console.log(error);
    return sendError(
      res,
      error.name === "TokenExpiredError" ? "Token expired" : "Invalid token or",
      401
    );
  }
};

const otpVerify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (user.otp !== otp) {
      return sendError(res, "Invalid OTP", 403);
    }

    // Mark OTP as used
    user.otp = undefined;
    await user.save();

    req.user = user.toObject(); // Attach full user object
    next();
  } catch (error) {
    return sendError(res, "OTP verification failed", 500);
  }
};

export default {
  verifyToken,
  verifyTempToken,
  otpVerify,
};
