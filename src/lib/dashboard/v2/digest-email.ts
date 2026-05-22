import nodemailer from "nodemailer";

/**
 * Weekly digest email transport.
 *
 * Reads SMTP config from env. Missing config = no-op (the digest cron logs
 * "skipped" and exits cleanly). No new third-party services required —
 * supports any SMTP server. Gmail app passwords work, as does Postmark /
 * SendGrid SMTP / your hosting provider's SMTP.
 *
 * Required env vars:
 *   SMTP_HOST
 *   SMTP_PORT          (default 587)
 *   SMTP_USER
 *   SMTP_PASS
 *   DIGEST_FROM_EMAIL  (the "from" address, e.g. "MCB Dashboard <hello@...>")
 *   DIGEST_TO_EMAIL    (where to send the digest, e.g. "alex@...")
 *
 * If any of SMTP_HOST / SMTP_USER / SMTP_PASS / DIGEST_TO_EMAIL is missing,
 * sendDigest() returns { skipped: true } without throwing.
 */

export interface DigestPayload {
  subject: string;
  htmlBody: string;
  textBody: string;
}

export async function sendDigest(payload: DigestPayload): Promise<
  { skipped: true; reason: string } | { skipped: false; messageId: string }
> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.DIGEST_TO_EMAIL;
  const from = process.env.DIGEST_FROM_EMAIL ?? user;
  const port = Number(process.env.SMTP_PORT ?? 587);

  if (!host || !user || !pass || !to || !from) {
    return {
      skipped: true,
      reason: "SMTP config missing — set SMTP_HOST / SMTP_USER / SMTP_PASS / DIGEST_TO_EMAIL",
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject: payload.subject,
    text: payload.textBody,
    html: payload.htmlBody,
  });

  return { skipped: false, messageId: info.messageId };
}
