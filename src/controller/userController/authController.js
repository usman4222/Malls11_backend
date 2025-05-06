import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP } from "../../utils/generateOTP.js";
import { sendVerificationEmail } from "../../utils/sendEmail.js";
import { successResponse, sendError } from "../../utils/response.js";
import { UserModel as User } from "../../models/userSchema.js";
import dotenv from "dotenv";
import { validateEmail, validatePassword, validateRequiredFields } from "../../utils/validators.js";
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
// connst expiresIn = process.env.OTP_EXPIRES_IN
const OTPexpiresIn = process.env.OTP_EXPIRES_IN;

export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      darkMode: user.darkMode,
      tokenVersion: user.tokenVersion,
    },
    secretKey,
    { expiresIn: OTPexpiresIn }
  );
};
export const generateTempToken = (email) => {
  return jwt.sign({ email: email }, secretKey, {
    expiresIn: OTPexpiresIn,
  });
};
export const sendOtp = async (email, name = null) => {
  try {
    const otp = generateOTP();
    await sendVerificationEmail(email, otp, name);

    const tempToken = generateTempToken(email);
    // console.log({ OTP: otp, Token: tempToken });
    // console.log("OTP sent successfully to:", email);
    return { tempToken, otp };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser && existingUser.isVerified) {
//       return sendError(
//         res,
//         "User already registered, Proceed to login or use new email",
//         400
//       );
//     }
//     // console.log (existingUser);

//     const { tempToken, otp } = await sendOtp(email, name);
//     // console.log (otp);

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.findOneAndUpdate(
//       { email },
//       { name, password: hashedPassword, otp },
//       { new: true, upsert: true }
//     );
//     // console.log (user);
//     if (!user) {
//       return sendError(res, "Failed to register user", 500);
//     }

//     const verificationUrl = `${req.protocol}://${req.get("host")}${
//       req.originalUrl
//     }/verify-account?tempToken=${tempToken}`;

//     return successResponse(
//       res,
//       "Verify account using OTP sent to your email",
//       {
//         verificationUrl,
//       },
//       201
//     );
//   } catch (error) {
//     console.error(error);
//     return sendError(res, error.message, 500);
//   }
// };

export const registerUser = async (req, res, next) => {
  try {
    // Destructure only required fields from request body
    const { username, fullname, email, password, role = 'client' } = req.body;

    if (
      validateRequiredFields({ username, fullname, email, password }, next)
    )
      return;
    if (validateEmail(email, next)) return;
    if (validatePassword(password, next)) return;

    // Check for existing verified user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return sendError(res, 'User already registered. Proceed to login or use new email', 400);
      }
      // If user exists but not verified, we'll update their record
    }

    // Generate OTP and temporary token
    const { tempToken, otp } = await sendOtp(email, fullname);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Prepare minimal user data
    const userData = {
      username,
      fullname,
      email,
      password: hashedPassword,
      otp,
      role,
      profile_status: 'pending' // Explicitly set to pending
    };

    // Create or update user with only minimal data
    const user = await User.findOneAndUpdate(
      { email },
      userData,
      {
        new: true,
        upsert: true,
        runValidators: true,
        // Only set the fields we want for initial registration
        setDefaultsOnInsert: true
      }
    );

    if (!user) {
      return sendError(res, 'Failed to register user', 500);
    }

    // Generate verification URL
    const verificationUrl = `${req.protocol}://${req.get('host')}/auth/register/verify-account?tempToken=${tempToken}`;

    // Return success response
    return successResponse(
      res,
      'Verify account using OTP sent to your email',
      {
        verificationUrl,
        userId: user._id,
        email: user.email
      },
      201
    );

  } catch (error) {
    console.error('Registration error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return sendError(res, `Validation failed: ${errors.join(', ')}`, 400);
    }

    return sendError(res, error.message, 500);
  }
};

export const resendAccountVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    if (user.isVerified) {
      return sendError(res, "Your account is already verified", 400);
    }

    const { tempToken, otp } = await sendOtp(email, user.name);

    user.otp = otp;
    await user.save();

    console.log({
      Message: "OTP Resent Successfuly!",
      newTempToken: tempToken,
      OTP: otp,
    });

    return res
      .status(200)
      .json(
        successResponse("OTP Resent Successfully", { newTempToken: tempToken })
      );
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};
export const verifyAccount = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    console.log("user", user.email);
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    if (user.isVerified) {
      return sendError(
        res,
        "User already registered, Proceed to login or use another email",
        400
      );
    }
    if (user.otp !== otp) {
      return sendError(res, "Invalid OTP, not matched", 400);
    }

    user.isVerified = true;
    user.otp = "";
    await user.save();

    const token = generateToken(user);
    console.log("Logged In as_________________________" + user.username);

    return successResponse(
      res,
      "Verify account using OTP sent to your email",
      { user, token },
      201
    );
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return sendError(res, "Invalid email or password", 402);
    }

    if (!user.isVerified) {
      console.log(
        "User is not verified\nTODO: redirect user to the OTP Verification page with email payload"
      );
      return sendError(
        res,
        "Your account is not verified, Please verify first !",
        403
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return sendError(res, "Invalid email or password", 401);
    }

    const token = generateToken(user);
    console.log("Logged In as_________________________" + user.username);

    return successResponse(
      res,
      "User logged in successfully",
      { user, token },
      201
    );
  } catch (error) {
    console.error("Login Error:", error);
    return sendError(res, "Internal server error", 500);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return sendError(res, "Current password is incorrect", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.tokenVersion += 1;
    await user.save();
    return successResponse(res, "Password changed successfully", 200);
  } catch (error) {
    return sendError(res, "Internal server error", 500);
  }
};
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const { tempToken, otp } = await sendOtp(email);

    user.otp = otp;
    await user.save();

    const verificationUrl = `${req.protocol}://${req.get("host")}${req.originalUrl
      }/verifyOtp?tempToken=${tempToken}`;

    console.log({
      Message: "OTP sent Successfuly!",
    });
    return successResponse(
      res,
      "OTP sent Successfully!",
      { verificationUrl },
      200
    );
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};
export const resendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    const { tempToken, otp } = await sendOtp(email);
    user.otp = otp;
    await user.save();
    console.log("OTP Resent Successfully");
    return successResponse(
      res,
      "OTP sent Successfully!",
      { newTempToken: tempToken },
      200
    );
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};
export const setNewPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.tokenVersion += 1;
    await user.save();

    const token = generateToken(user);
    console.log("Logged In as_________________________" + user.username);

    return successResponse(
      res,
      "Password changed successfully",
      { user, token },
      200
    );
  } catch (error) {
    console.error("Set New Password Error:", error);
    return sendError(res, "Internal server error", 500);
  }
};



export default {
  generateToken,
  generateTempToken,
  sendOtp,
  registerUser,
  resendAccountVerificationOtp,
  verifyAccount,
  login,
  changePassword,
  forgetPassword,
  resendPasswordResetOtp,
  setNewPassword
};
