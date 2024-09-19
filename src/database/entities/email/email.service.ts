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
  const verificationUrl = `http://localhost:4000/auth/verify-email?token=${token}`;

  const mailOptions = {
    //ToDo: Change these values to desired email
    from: "lasnavesgeekshubs@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the link: ${verificationUrl}`,
  };

  await transporter.sendMail(mailOptions);
}
