// src/lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendConfirmationEmail(email: string, token: string) {
  const url = `${process.env.BASE_URL}/api/auth/confirm?token=${encodeURIComponent(token)}`;

  const message = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Confirm your account",
    text: `Please confirm your account by visiting: ${url}`,
    html: `<p>Please confirm your account by visiting: <a href="${url}">${url}</a></p>`,
  };

  try {
    let info = await transporter.sendMail(message);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
}
