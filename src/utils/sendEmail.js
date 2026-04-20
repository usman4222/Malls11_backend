import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async (userEmail, otp, username) => {
  try {
    // Create transporter for Hostinger SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      family: 4, 
    });

    // Verify connection
    await transporter.verify();

    const emailPurpose = username ? "account verification" : "password reset";
    const expirationTime = process.env.EMAIL_VERIFICATION_EXPIRES_IN || '24 hours';

    const mailOptions = {
      from: `Malls11 <${process.env.EMAIL_FROM}>`,
      to: userEmail,
      subject: `${otp} is your verification code - Malls11`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Malls11</h2>
          <p>Dear ${username || 'User'},</p>
          <p>Your verification code for ${emailPurpose} is:</p>
          <div style="font-size: 28px; font-weight: bold; color: #2563eb; text-align: center; padding: 15px; background: #f3f4f6; border-radius: 8px; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This code will expire in ${expirationTime}.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">© Malls11. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, message: 'Verification email sent' };

  } catch (error) {
    console.error('Email error:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};