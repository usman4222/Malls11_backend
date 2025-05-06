import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  port: 587,
  host: "smtp.gmail.com",
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tsl: {
    rejectUnauthorized: false,
  },
});

export function sendMail({ to, subject, text }) {
  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);

      throw new Error("Failed Sending Email");
    } else {
      console.log("Email sent: ", info.response);
      return true;
    }
  });
}