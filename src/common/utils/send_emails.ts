import nodemailer from 'nodemailer';

import { env } from '@/common/utils/envConfig'; // Ensure prismaClient is correctly imported

export const sendMail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: env.MAIL_HOST,
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: env.MAIL_USERNAME,
    to: to,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
