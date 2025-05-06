// config.js (ES Modules)
import dotenv from 'dotenv';
dotenv.config();

const config = {
  secretKey: process.env.ACCESS_TOKEN_SECRET,
  refreshKey: process.env.REFRESH_TOKEN_SECRET, // Fixed typo
  expiresIn: process.env.EXPIRES_IN || '1h',
  OTPexpiresIn: process.env.OTP_EXPIRES_IN || '5m',
  slackWebhook: process.env.SLACK_WEBHOOK_URL,
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;