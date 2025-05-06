import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async (userEmail, otp, username) => {
  try {
    // Validate required email configuration
    const requiredConfig = [
      'EMAIL_SERVICE',
      'EMAIL_USERNAME',
      'EMAIL_PASSWORD',
      'EMAIL_FROM'
    ];

    const missingConfig = requiredConfig.filter(key => !process.env[key]);
    if (missingConfig.length > 0) {
      throw new Error(`Missing email configuration: ${missingConfig.join(', ')}`);
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email content
    const emailPurpose = username ? "account verification" : "password reset";
    const expirationTime = process.env.EMAIL_VERIFICATION_EXPIRES_IN || '24 hours';

    const mailOptions = {
      from: `Rana Usman <${process.env.EMAIL_FROM}>`,
      to: userEmail,
      subject: `${otp} is your Rana Usman verification code`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .otp { 
                    font-size: 24px; 
                    font-weight: bold; 
                    color: #2563eb;
                    text-align: center;
                    margin: 20px 0;
                }
                .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Rana Usman</h2>
                </div>
                <p>Dear ${username || 'User'},</p>
                <p>Your verification code for ${emailPurpose} is:</p>
                <div class="otp">${otp}</div>
                <p>This code will expire in ${expirationTime}.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} Rana Usman. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
        Rana Usman Verification\n
        Dear ${username || 'User'},\n
        Your verification code is: ${otp}\n
        This code will expire in ${expirationTime}.\n
        If you didn't request this, please ignore this email.\n
        © ${new Date().getFullYear()} Rana Usman
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, message: 'Verification email sent' };

  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};