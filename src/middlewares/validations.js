import { sendError } from "../utils/response.js";
import joi from "joi";

// Define all schemas outside the function for better performance
const schemas = {
  registration: joi.object({
    name: joi.string().min(3).max(30).required().messages({
      "string.base": "Name should be a type of text",
      "string.empty": "Name cannot be an empty field",
      "string.min": "Name should have a minimum length of {#limit}",
      "string.max": "Name should have a maximum length of {#limit}",
      "any.required": "Name is a required field",
    }),
    email: joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email cannot be an empty field",
      "any.required": "Email is a required field",
    }),
    password: joi.string().min(6).max(18).required().messages({
      "string.min": "Password should have a minimum length of {#limit}",
      "string.max": "Password should have a maximum length of {#limit}",
      "string.empty": "Password cannot be an empty field",
      "any.required": "Password is a required field",
    }),
  }),

  otp: joi.object({
    email: joi.string().email().required(),
    otp: joi.string().pattern(/^\d{6}$/).required()
  }),

  passwordReset: joi.object({
    newPassword: joi.string().min(6).max(18).required(),
    otp: joi.string().pattern(/^\d{6}$/).required()
  }),

  otpOnly: joi.object({
    otp: joi.string().pattern(/^\d{6}$/).required()
  })
};

export const validateUserData = (req, res, next) => {
  try {
    let schema;
    const { path, method } = req;

    // Determine schema based on route and method
    if (path === '/register-user' && method === 'POST') {
      schema = schemas.registration;
    } 
    else if (path === '/verify-account' && method === 'POST') {
      schema = req.body.email ? schemas.otp : schemas.otpOnly;
    }
    else if (path === '/reset-password' && method === 'POST') {
      schema = schemas.passwordReset;
    }
    else {
      return sendError(res, {
        message: "Invalid endpoint for validation",
        validEndpoints: [
          "POST /register",
          "POST /verify-account",
          "POST /reset-password"
        ]
      }, 400);
    }

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return sendError(res, {
        message: "Validation failed",
        errors: error.details.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      }, 400);
    }

    next();
  } catch (error) {
    console.error("Validation error:", error);
    return sendError(res, "Internal validation error", 500);
  }
};