import ErrorHandler from "../middlewares/errorHandler.js";

export const validateRequiredFields = (fields, next) => {
  const missingFields = Object.entries(fields)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return next(
      new ErrorHandler(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      )
    );
  }
};

export const validateEmail = (email, next) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Please enter a valid email address", 400));
  }
};

export const validatePassword = (password, next) => {
  if (password.length < 6) {
    return next(
      new ErrorHandler("Password must be at least 6 characters long", 400)
    );
  }
};