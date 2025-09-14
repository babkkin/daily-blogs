import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SMTP_PASS);

export async function sendVerificationEmail(to, token) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify?token=${token}`;

  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: "Verify your DailyBlogs account",
    html: `
      <p>Thanks for signing up!</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}" style="color:blue;">Verify Email</a>
      <p>If you did not sign up, ignore this email.</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Verification email sent");
  } catch (err) {
    console.error("Failed to send verification email", err.response?.body || err);
    throw err;
  }
}
