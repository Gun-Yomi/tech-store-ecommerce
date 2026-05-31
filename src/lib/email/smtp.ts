import "server-only";

import nodemailer from "nodemailer";

type RegistrationCodeEmailInput = {
  to: string;
  code: string;
  expiresAt: Date;
};

type PasswordResetCodeEmailInput = RegistrationCodeEmailInput;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.SMTP_FROM?.trim();

  if (!host || !from) {
    return null;
  }

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();

  return {
    host,
    from,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: user && pass ? { user, pass } : undefined,
  };
}

async function sendCodeEmail({
  to,
  code,
  expiresAt,
  subject,
  intro,
}: RegistrationCodeEmailInput & {
  subject: string;
  intro: string;
}) {
  const config = getSmtpConfig();

  if (!config) {
    return {
      ok: false as const,
      reason: "missing-config" as const,
    };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });

  try {
    await transporter.sendMail({
      from: config.from,
      to,
      subject,
      text: [
        `${intro} ${code}.`,
        `It expires at ${expiresAt.toLocaleTimeString()}.`,
        "If you did not request this code, you can ignore this email.",
      ].join("\n\n"),
      html: `
        <div style="font-family: Arial, sans-serif; color: #253326; line-height: 1.5;">
          <p>${intro}:</p>
          <p style="font-size: 28px; font-weight: 800; letter-spacing: 6px;">${code}</p>
          <p>This code expires at ${expiresAt.toLocaleTimeString()}.</p>
          <p>If you did not request this code, you can ignore this email.</p>
        </div>
      `,
    });

    return {
      ok: true as const,
    };
  } catch {
    return {
      ok: false as const,
      reason: "send-failed" as const,
    };
  }
}

export async function sendRegistrationCodeEmail({
  to,
  code,
  expiresAt,
}: RegistrationCodeEmailInput) {
  return sendCodeEmail({
    to,
    code,
    expiresAt,
    subject: "Your account verification code",
    intro: "Your account verification code is",
  });
}

export async function sendPasswordResetCodeEmail({
  to,
  code,
  expiresAt,
}: PasswordResetCodeEmailInput) {
  return sendCodeEmail({
    to,
    code,
    expiresAt,
    subject: "Reset your password",
    intro: "Your password reset code is",
  });
}
