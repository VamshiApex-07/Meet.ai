import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Meet.AI" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your email - Meet.AI",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #111; font-size: 24px;">Verify your email</h1>
        <p style="color: #555; font-size: 16px;">
          Enter the following OTP to verify your email address:
        </p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111;">
            ${otp}
          </span>
        </div>
        <p style="color: #888; font-size: 14px;">
          This code expires in 5 minutes. If you didn't request this, you can ignore this email.
        </p>
      </div>
    `,
  });
};
