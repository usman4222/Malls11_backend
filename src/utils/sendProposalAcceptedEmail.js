import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendProposalAcceptedEmail = async (freelancerEmail, freelancerName, projectTitle) => {
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

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: `Rana Usman <${process.env.EMAIL_FROM}>`,
            to: freelancerEmail,
            subject: `Your Proposal for "${projectTitle}" Has Been Accepted!`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .project-title { 
                            font-size: 20px; 
                            font-weight: bold; 
                            color: #2563eb;
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
                        <p>Dear ${freelancerName},</p>
                        <p>We're excited to inform you that your proposal for the project:</p>
                        <div class="project-title">"${projectTitle}"</div>
                        <p>has been accepted by the client!</p>
                        <p>You can now start working on the project. Please check your dashboard for more details.</p>
                        <p>If you have any questions, don't hesitate to contact our support team.</p>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Rana Usman. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Rana Usman - Proposal Accepted\n
                Dear ${freelancerName},\n
                We're excited to inform you that your proposal for the project "${projectTitle}"\n
                has been accepted by the client!\n\n
                You can now start working on the project. Please check your dashboard for more details.\n\n
                If you have any questions, don't hesitate to contact our support team.\n\n
                © ${new Date().getFullYear()} Rana Usman
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Proposal acceptance email sent:', info.messageId);
        return { success: true, message: 'Proposal acceptance email sent' };

    } catch (error) {
        console.error('Proposal acceptance email error:', error);
        throw new Error(`Failed to send proposal acceptance email: ${error.message}`);
    }
};