import nodemailer from 'nodemailer';
import createError from 'http-errors';
export const transporter = async (msg: any) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS, // ethereal us er
      pass: process.env.EMAIL_PASSWORD, // ethereal password
    },
  });

  try {
    console.log(msg);
    console.log('transporter', transporter);
    const info = await transporter.sendMail(msg);
    console.log('Message sent: %s', info.messageId);
  } catch (err: any) {
    throw new createError.BadRequest(
      `Error while sending email: ${err.message}`
    );
  }
};
