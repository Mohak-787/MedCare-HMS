import nodemailer from "nodemailer";
import env from "../constants/env.constant";
import { Logger } from "../utils/chalk";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GOOGLE_USER,
    pass: env.GOOGLE_APP_PASSWORD,
  }
});

transporter.verify((error, success) => {
  if (error) {
    Logger.error(`Error connecting to email server: ${error}`);
  } else {
    Logger.success(`Email server is ready to send messages`);
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  try {
    const info = await transporter.sendMail({
      from: `"MedCare-HMS" <${env.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html
    });

    Logger.info(`Message sent: ${info.messageId}`);
  } catch (error) {
    Logger.error(`Error sending email: ${error}`);
  }
};