import { NextFunction } from 'express';
import nodemailer from 'nodemailer';

import { InternalServerError } from '../errors/InternalServerError';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
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
