import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    //ToDo: Change these values to desired email and password
    user: "lasnavesgeekshubs@gmail.com",
    pass: "mlfn qkgz imww vahd",
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  //ToDo: Change this to the real domain that is being used
  const verificationUrl = `http://localhost:4000/auth/verify-email?token=${token}&email=${encodeURIComponent(
    email
  )};`;

  const mailOptions = {
    from: "lasnavesgeekshubs@gmail.com", //ToDo: Change this to desired email
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the link: ${verificationUrl}`,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  // ToDo: Change this to the real domain that is being used
  const resetUrl = `http://localhost:4000/auth/reset-password?token=${token}&email=${encodeURIComponent(
    email
  )};`;

  const mailOptions = {
    from: "lasnavesgeekshubs@gmail.com", // ToDo: Change this to the desired email
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
}
