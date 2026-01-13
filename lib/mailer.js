import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
} = process.env;

let cachedTransporter = null;

export function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
    throw new Error("Missing SMTP env vars (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL)");
  }

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for others
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return cachedTransporter;
}

export async function sendBookingEmail({ to, subject, html, text }) {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });
}
