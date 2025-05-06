import nodemailer from 'nodemailer';

const mailSender = async (email, title, body) => {
    try {
        // Create a Transporter to send emails
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'clement.weber63@ethereal.email',
                pass: '4MHx2wqXYTDG5bSBuV'
            }
        });

        // Send emails to users
        let info = await transporter.sendMail({
            from: 'www.sandeepdev.me - Sandeep Singh',
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email sent successfully: ", info);
        return info;
    } catch (error) {
        console.error("Error occurred while sending email:", error.message);
        return null;
    }
};

export default mailSender;
