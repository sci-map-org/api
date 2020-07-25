import * as nodemailer from 'nodemailer';
import { env } from '../../env';

const transporter = nodemailer.createTransport({
  host: env.EMAIL.SMTP_SERVER_NAME,
  port: Number(env.EMAIL.SMTP_PORT),
  auth: {
    user: env.EMAIL.SMTP_USERNAME,
    pass: env.EMAIL.SMPT_PASSWORD,
  },
});

export interface EmailToSend {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async (emailToSend: EmailToSend): Promise<void> => {
  await transporter.sendMail(emailToSend);
};
