import nodemailer from "nodemailer";

// Uses Gmail's free SMTP relay. See backend/.env.example for setup instructions
// on generating a free Gmail "App Password" (not your normal Gmail password).
//
// IMPORTANT: the transporter is created INSIDE the function below, not at the
// top of this file. If it were created here at module load time, it would run
// before dotenv.config() (in server.js) has actually populated process.env,
// because ES module imports are all resolved before any code in server.js runs.
export const sendResetEmail = async (toEmail, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"AI Fit" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your AI Fit password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#16a34a;">AI Fit</h2>
        <p>You requested a password reset. Click the button below to set a new password.
        This link expires in 30 minutes.</p>
        <a href="${resetUrl}" style="display:inline-block; background:#22c55e; color:white;
          padding:12px 24px; border-radius:24px; text-decoration:none; font-weight:bold; margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#666; font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};
