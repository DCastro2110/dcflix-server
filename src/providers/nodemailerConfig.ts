import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

interface IMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(mailOptions: IMailOptions) {
  const options = {
    ...mailOptions,
    from: process.env.USER,
  };

  let isError = false;

  try {
    await transporter.sendMail(options);
  } catch (err) {
    isError = true;
  } finally {
    return isError;
  }
}
