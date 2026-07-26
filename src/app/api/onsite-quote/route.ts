import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// nodemailer needs the Node.js runtime (not edge).
export const runtime = 'nodejs';

/**
 * Onsite quote email endpoint.
 *
 * The MCB Onsite Quote tool (a standalone static app used on a phone during a
 * measure-up) POSTs a confirmed quote here; we render it as an HTML table,
 * attach the CSV the tool already builds, and email it to the sales inbox using
 * the SAME nodemailer SMTP transport the website's /api/quote route already
 * uses. No new service or credentials — it reads the existing SMTP_* env vars.
 *
 * CORS: the tool may be hosted on any origin (Netlify Drop, a subdomain,
 * localhost while testing). This route only ever emails a FIXED internal
 * address, so an open CORS policy leaks nothing; the optional ONSITE_QUOTE_TOKEN
 * shared secret gates casual/drive-by abuse of the sales inbox.
 *
 * Env used:
 *   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM   (already set on Vercel)
 *   ONSITE_QUOTE_TO     (optional — override recipient; default sales@moderncurtainsandblinds.com.au)
 *   ONSITE_QUOTE_TOKEN  (optional — if set, the tool must send a matching token)
 */

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

const TO_ADDRESS =
  process.env.ONSITE_QUOTE_TO || 'sales@moderncurtainsandblinds.com.au';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function asString(v: unknown, max = 300) {
  if (v === 0) return '0';
  if (v == null) return '';
  return String(v).slice(0, max);
}

type RawGroup = { title?: unknown; columns?: unknown; rows?: unknown };
type CleanGroup = { title: string; columns: string[]; rows: string[][] };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    // Optional shared-token gate (set ONSITE_QUOTE_TOKEN in Vercel to enable).
    const expected = process.env.ONSITE_QUOTE_TOKEN;
    if (expected && asString(body.token, 200) !== expected) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const customer = asString(body.customer, 200);
    const address = asString(body.address, 300);
    const mobile = asString(body.mobile, 60);
    const email = asString(body.email, 254);
    const date = asString(body.date, 40);
    const houseRules = asString(body.houseRules, 1000);
    const total = asString(body.total, 40);
    const summary = asString(body.summary, 8000);
    const csv =
      typeof body.csv === 'string' ? body.csv.slice(0, 500_000) : '';

    const rawGroups = Array.isArray(body.groups)
      ? (body.groups as RawGroup[])
      : [];
    const groups: CleanGroup[] = rawGroups.slice(0, 6).map((g) => ({
      title: asString(g.title, 80),
      columns: Array.isArray(g.columns)
        ? g.columns.slice(0, 40).map((c) => asString(c, 60))
        : [],
      rows: Array.isArray(g.rows)
        ? g.rows
            .slice(0, 300)
            .map((row) =>
              Array.isArray(row)
                ? row.slice(0, 40).map((c) => asString(c, 300))
                : []
            )
        : [],
    }));

    const rowCount = groups.reduce((n, g) => n + g.rows.length, 0);
    if (!customer && rowCount === 0) {
      return NextResponse.json(
        { error: 'Empty quote — nothing to send.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const html = renderHtml({
      customer,
      address,
      mobile,
      date,
      houseRules,
      total,
      groups,
    });
    const subject = `New onsite quote — ${customer || 'Unnamed'}${
      date ? ` (${date})` : ''
    }`;

    const attachments = csv
      ? [
          {
            filename: `MCB-quote-${(customer || 'unnamed').replace(
              /[^a-z0-9]+/gi,
              '-'
            )}.csv`,
            content: csv,
            contentType: 'text/csv; charset=utf-8',
          },
        ]
      : [];

    // Mock mode when SMTP isn't configured (matches /api/quote behaviour) so the
    // route can be exercised locally without credentials.
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ SMTP credentials missing — onsite quote email mocked.');
      console.log(
        '📧 Mock onsite quote →',
        TO_ADDRESS,
        '| subject:',
        subject,
        '| rows:',
        rowCount
      );
      return NextResponse.json(
        { message: 'Mock email processed (SMTP env missing).', mocked: true },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    const port = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || '';
    await transporter.sendMail({
      from: `"MCB Onsite Quote" <${fromAddress}>`,
      to: TO_ADDRESS,
      // Reply goes to the customer when we have their address, else back to us.
      replyTo: email || fromAddress,
      subject,
      html,
      text: summary || undefined,
      attachments,
    });

    return NextResponse.json(
      { message: 'Quote sent to sales.' },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('Onsite quote email failed:', error);
    return NextResponse.json(
      { error: 'Failed to send quote email.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

function renderHtml(q: {
  customer: string;
  address: string;
  mobile: string;
  date: string;
  houseRules: string;
  total: string;
  groups: CleanGroup[];
}) {
  const meta = (
    [
      ['Customer', q.customer],
      ['Address', q.address],
      ['Mobile', q.mobile],
      ['Quote date', q.date],
    ] as [string, string][]
  )
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<span style="display:inline-block;margin:0 18px 6px 0;"><strong>${escapeHtml(
          k
        )}:</strong> ${escapeHtml(v)}</span>`
    )
    .join('');

  const tables = q.groups
    .map((g) => {
      if (!g.rows.length) return '';
      const head = g.columns
        .map(
          (c) =>
            `<th style="text-align:left;border-bottom:2px solid #C69C85;padding:6px 8px;font-size:12px;color:#44403c;white-space:nowrap;">${escapeHtml(
              c
            )}</th>`
        )
        .join('');
      const rows = g.rows
        .map(
          (row) =>
            `<tr>${row
              .map(
                (cell) =>
                  `<td style="border-bottom:1px solid #e7e5e4;padding:6px 8px;font-size:13px;color:#2D2D2D;">${escapeHtml(
                    cell
                  )}</td>`
              )
              .join('')}</tr>`
        )
        .join('');
      const heading =
        q.groups.length > 1 && g.title
          ? `<h3 style="margin:22px 0 6px;color:#44403c;">${escapeHtml(
              g.title
            )}</h3>`
          : '';
      return `${heading}<div style="overflow-x:auto;"><table style="border-collapse:collapse;width:100%;">
        <thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    })
    .join('');

  return `<div style="font-family:Helvetica,Arial,sans-serif;max-width:860px;margin:0 auto;padding:20px;color:#2D2D2D;">
    <h2 style="border-bottom:2px solid #C69C85;padding-bottom:8px;color:#1c1917;margin:0 0 6px;">Modern Curtains and Blinds — Onsite Quote</h2>
    <div style="font-size:12px;color:#78716c;margin-bottom:12px;">ABN: 49 674 694 832</div>
    <div style="margin:0 0 18px;font-size:13px;">${meta}</div>
    ${tables}
    <div style="margin-top:18px;font-size:16px;font-weight:bold;">TOTAL: $${escapeHtml(
      q.total
    )}</div>
    ${
      q.houseRules
        ? `<div style="margin-top:10px;font-size:12px;color:#57534e;"><strong>House rules:</strong> ${escapeHtml(
            q.houseRules
          )}</div>`
        : ''
    }
    <div style="margin-top:24px;font-size:11px;color:#a8a29e;">Sent from the MCB Onsite Quote tool. CSV attached for the office spreadsheet.</div>
  </div>`;
}
