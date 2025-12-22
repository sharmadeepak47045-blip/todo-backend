import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// 🔹 Create transporter with Gmail using App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // must be a 16-char Gmail App Password
  },
});

// 🔹 Verify transporter at startup
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Mailer verification failed:", err);
  } else {
    console.log("✅ Mailer is ready to send emails");
  }
});

// 🔹 Function to send OTP email
export const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Todo App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Password Reset OTP",
    html: `
      <div style="font-family: Arial; padding: 20px; line-height: 1.5;">
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#4f46e5">${otp}</h1>
        <p>This OTP is valid for <b>10 minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    throw new Error("Failed to send OTP email");
  }
};
