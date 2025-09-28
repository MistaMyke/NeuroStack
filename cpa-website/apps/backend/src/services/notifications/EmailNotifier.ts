import { createTransport } from 'nodemailer';

import type { ContactSubmission } from '@services/contact/ContactService';

type EmailEnvConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
  secure: boolean;
};

export interface ContactNotifier {
  sendNewContactNotification(submission: ContactSubmission): Promise<void>;
}

const loadConfig = (): EmailEnvConfig | null => {
  const host = process.env.EMAIL_SMTP_HOST;
  const port = process.env.EMAIL_SMTP_PORT ? Number(process.env.EMAIL_SMTP_PORT) : NaN;
  const user = process.env.EMAIL_SMTP_USER;
  const pass = process.env.EMAIL_SMTP_PASS;
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;
  const secure = process.env.EMAIL_SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass || !from || !to || !Number.isFinite(port)) {
    return null;
  }

  return { host, port, user, pass, from, to, secure };
};

const formatBody = (submission: ContactSubmission): string => {
  const lines = [
    `A new contact request was submitted at ${submission.createdAt.toISOString()}.`,
    '',
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone ?? 'Not provided'}`,
    `Reason: ${submission.reason ?? 'Not specified'}`,
    '',
    'Message:',
    submission.message,
  ];

  return lines.join('\n');
};

export const createEmailNotifier = (): ContactNotifier | null => {
  const config = loadConfig();

  if (!config) {
    return null;
  }

  const transporter = createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const sendNewContactNotification = async (submission: ContactSubmission): Promise<void> => {
    await transporter.sendMail({
      from: config.from,
      to: config.to,
      subject: `New contact from ${submission.name}`,
      text: formatBody(submission),
    });
  };

  return { sendNewContactNotification };
};

export class NoOpNotifier implements ContactNotifier {
  async sendNewContactNotification(): Promise<void> {
    // Intentionally empty
  }
}
