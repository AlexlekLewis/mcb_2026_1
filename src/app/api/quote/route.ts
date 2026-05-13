import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { booleanValue, getRequestMeta, objectOrEmpty, stringArray, stringOrNull } from '@/lib/server/request-meta';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { selectReviewsForProducts, type CuratedReview } from '@/lib/customer-reviews';

const GBP_REVIEWS_URL = 'https://maps.app.goo.gl/zRBNX1LBoTc2DK2g9';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  try {
    const body = objectOrEmpty(await request.json());
    const {
      firstName,
      lastName,
      email,
      phone,
      suburb,
      products,
      windowCount,
      referral,
      referrerName,
      bestContactTime,
      appointmentPreference,
      projectStage,
      needsAdvice,
      message,
    } = body;
    const selectedProducts = stringArray(products);

    await storeLeadSubmission(request, body, selectedProducts);

    // 1. Create a Transporter
    // Note: You must configure these env vars in .env.local
    const port = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 2. Format the Email Content
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1c1917; border-bottom: 2px solid #e6d5c3; padding-bottom: 10px;">New Quote Request</h2>
        
        <div style="background-color: #f5f5f4; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #44403c;">Contact Details</h3>
          <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>
          <p><strong>Suburb:</strong> ${escapeHtml(suburb)}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #44403c;">Project Details</h3>
          <p><strong>Products Interested:</strong> ${escapeHtml(selectedProducts.join(', ') || 'None selected')}</p>
          <p><strong>Number of Windows/Doors:</strong> ${escapeHtml(windowCount || 'N/A')}</p>
          <p><strong>Needs Advice:</strong> ${needsAdvice ? 'Yes' : 'No'}</p>
          <p><strong>Project Stage:</strong> ${escapeHtml(projectStage || 'N/A')}</p>
          <p><strong>Best Contact Time:</strong> ${escapeHtml(bestContactTime || 'N/A')}</p>
          <p><strong>Appointment Preference:</strong> ${escapeHtml(appointmentPreference || 'N/A')}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #44403c;">Referral & Message</h3>
          <p><strong>Found via:</strong> ${escapeHtml(referral || 'N/A')} ${referrerName ? `(${escapeHtml(referrerName)})` : ''}</p>
          <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 12px; border-radius: 4px;">
            <p style="margin: 0; color: #57534e;">${escapeHtml(message || 'No additional message provided.')}</p>
          </div>
        </div>
        
        <p style="font-size: 12px; color: #a8a29e; margin-top: 30px; text-align: center;">
          Sent from Modern Curtains Website
        </p>
      </div>
    `;

    // 3. Send Email
    // If no env vars are set, we just log it in dev
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️ SMTP Credentials missing. Logging mock email instead.");
      if (!process.env.SMTP_USER) console.warn("❌ Missing SMTP_USER");
      if (!process.env.SMTP_PASS) console.warn("❌ Missing SMTP_PASS");

      console.log("📧 Mock Email Content:", htmlContent);
      return NextResponse.json({ message: "Mock email processed (Env vars missing). Check server logs for details." }, { status: 200 });
    }

    await transporter.sendMail({
      from: `"MCB Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`, // sender address
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // list of receivers (default to sender if admin not set)
      subject: `New Quote: ${firstName} ${lastName || ''} (${suburb})`, // Subject line
      html: htmlContent,
    });

    // Customer confirmation — wrapped so a failure here can't break the route.
    // The lead is already saved in Supabase and the internal email has gone out.
    if (isLikelyValidEmail(email)) {
      try {
        const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || '';
        await transporter.sendMail({
          from: `"Modern Curtains and Blinds" <${fromAddress}>`,
          to: String(email),
          replyTo: fromAddress,
          subject: `Thank You ${String(firstName || '').trim() || 'there'} — we've received your enquiry`,
          html: buildCustomerHtml({
            firstName: stringOrNull(firstName, 120) || '',
            selectedProducts,
            windowCount: stringOrNull(windowCount, 80) || '',
            referral: stringOrNull(referral, 180) || '',
            referrerName: stringOrNull(referrerName, 180) || '',
            bestContactTime: stringOrNull(bestContactTime, 120) || '',
            appointmentPreference: stringOrNull(appointmentPreference, 180) || '',
            projectStage: stringOrNull(projectStage, 180) || '',
            needsAdvice: booleanValue(needsAdvice),
            message: stringOrNull(message, 4000) || '',
            suburb: stringOrNull(suburb, 180) || '',
          }),
          text: buildCustomerText({
            firstName: stringOrNull(firstName, 120) || '',
            selectedProducts,
            windowCount: stringOrNull(windowCount, 80) || '',
            bestContactTime: stringOrNull(bestContactTime, 120) || '',
            appointmentPreference: stringOrNull(appointmentPreference, 180) || '',
            message: stringOrNull(message, 4000) || '',
          }),
        });
      } catch (customerEmailError) {
        console.error('Customer confirmation email failed (non-fatal):', customerEmailError);
      }
    }

    return NextResponse.json({ message: "Quote sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

function isLikelyValidEmail(value: unknown) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

type CustomerEmailFields = {
  firstName: string;
  selectedProducts: string[];
  windowCount: string;
  referral: string;
  referrerName: string;
  bestContactTime: string;
  appointmentPreference: string;
  projectStage: string;
  needsAdvice: boolean;
  message: string;
  suburb: string;
};

function buildCustomerHtml(f: CustomerEmailFields) {
  // Email images must use the canonical www host directly — Gmail's image proxy
  // does not follow the 307 redirect from the bare domain, so the bare URL
  // results in a broken image icon in the inbox.
  const SITE_URL = 'https://www.moderncurtainsandblinds.com.au';
  // Use email-optimised copies (smaller dimensions/file size). Gmail's image proxy
  // is unreliable with very large source files (the original mcb-owners.jpg was 2.5 MB).
  const LOGO_URL = `${SITE_URL}/assets/logo-nav-email.png`;
  const OWNERS_PHOTO_URL = `${SITE_URL}/assets/mcb-owners-email.jpg`;
  const greetingName = f.firstName.trim() || 'there';
  const productsLine = f.selectedProducts.length
    ? f.selectedProducts.map(escapeHtml).join(', ')
    : 'Not specified';

  const reviews = selectReviewsForProducts(f.selectedProducts, 3);

  const detailRow = (label: string, value: string) => value
    ? `<tr>
         <td style="padding:8px 0;border-bottom:1px solid #E8E1D6;color:#6B655C;font-size:13px;width:42%;vertical-align:top;">${escapeHtml(label)}</td>
         <td style="padding:8px 0;border-bottom:1px solid #E8E1D6;color:#2D2D2D;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
       </tr>`
    : '';

  const reviewCard = (r: CuratedReview) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid #E8E1D6;border-radius:6px;margin-bottom:12px;">
      <tr><td style="padding:16px 18px;">
        <div style="color:#B26E2D;font-size:14px;letter-spacing:2px;line-height:1;margin-bottom:8px;">${'★'.repeat(r.rating)}</div>
        <p style="margin:0 0 12px 0;color:#2D2D2D;font-size:14px;line-height:1.65;font-style:italic;">&ldquo;${escapeHtml(r.text)}&rdquo;</p>
        <div style="color:#6B655C;font-size:12px;">
          <strong style="color:#2D2D2D;">${escapeHtml(r.author)}</strong>
          <span style="color:#A8A29E;">&nbsp;·&nbsp;Google review</span>
        </div>
      </td></tr>
    </table>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thank you for your enquiry — Modern Curtains and Blinds</title>
</head>
<body style="margin:0;padding:0;background-color:#F9F8F6;font-family:Helvetica,Arial,sans-serif;color:#2D2D2D;">
  <span style="display:none !important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">
    Thank you ${escapeHtml(greetingName)}, we've received your enquiry. Deane and I will be in touch within 24 hours.
  </span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9F8F6;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">

          <!-- Branded logo header -->
          <tr>
            <td style="background-color:#ffffff;padding:28px 24px;text-align:center;">
              <img src="${LOGO_URL}" alt="Modern Curtains and Blinds" width="240" style="display:inline-block;width:240px;max-width:65%;height:auto;" />
            </td>
          </tr>

          <!-- Clay accent strip -->
          <tr><td style="height:4px;background-color:#C69C85;line-height:4px;font-size:0;">&nbsp;</td></tr>

          <!-- Personal note from Deane & Dee -->
          <tr>
            <td style="padding:36px 32px 12px 32px;">
              <h1 style="margin:0 0 18px 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#2D2D2D;font-weight:normal;">
                Thank You, ${escapeHtml(greetingName)}.
              </h1>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                <tr>
                  <td width="92" style="vertical-align:top;padding-right:18px;">
                    <img src="${OWNERS_PHOTO_URL}" alt="Deane and Dee, owners" width="80" style="display:block;width:80px;height:80px;border-radius:40px;object-fit:cover;border:2px solid #C69C85;" />
                  </td>
                  <td style="vertical-align:top;color:#2D2D2D;font-size:15px;line-height:1.7;">
                    <p style="margin:0 0 12px 0;">
                      Just a quick note from us &mdash; Deane and I have got your enquiry, and one of us will personally be in touch <strong style="color:#B26E2D;">within the next 24 hours</strong> to organise a time that suits you.
                    </p>
                    <p style="margin:0;">
                      We're a family-owned Melbourne business and we genuinely care about getting this right for you. When we come out, we'll bring samples, measure properly, and walk you through every option so you can make a confident decision &mdash; no scripts, no pressure, no upsell.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#2D2D2D;font-size:15px;line-height:1.7;">
                If anything's urgent before we call, just reply to this email &mdash; it lands directly with us.
              </p>

              <p style="margin:18px 0 0 0;color:#2D2D2D;font-size:15px;line-height:1.5;">
                Warm regards,<br />
                <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#2D2D2D;">Dee</span><br />
                <span style="color:#6B655C;font-size:13px;">Modern Curtains and Blinds</span>
              </p>
            </td>
          </tr>

          <!-- What happens next -->
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <h2 style="margin:0 0 14px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#748B69;font-weight:normal;letter-spacing:1.2px;text-transform:uppercase;">
                What happens next
              </h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="32" style="vertical-align:top;padding-top:2px;">
                    <div style="width:24px;height:24px;border-radius:12px;background-color:#C69C85;color:#ffffff;text-align:center;line-height:24px;font-size:13px;font-weight:bold;font-family:Helvetica,Arial,sans-serif;">1</div>
                  </td>
                  <td style="padding:0 0 14px 8px;color:#2D2D2D;font-size:14px;line-height:1.6;">
                    <strong>We call you back</strong> within 24 hours, at a time that suits you.
                  </td>
                </tr>
                <tr>
                  <td width="32" style="vertical-align:top;padding-top:2px;">
                    <div style="width:24px;height:24px;border-radius:12px;background-color:#C69C85;color:#ffffff;text-align:center;line-height:24px;font-size:13px;font-weight:bold;font-family:Helvetica,Arial,sans-serif;">2</div>
                  </td>
                  <td style="padding:0 0 14px 8px;color:#2D2D2D;font-size:14px;line-height:1.6;">
                    <strong>Free in-home consultation</strong> &mdash; we bring the samples, measure properly, and explain every option.
                  </td>
                </tr>
                <tr>
                  <td width="32" style="vertical-align:top;padding-top:2px;">
                    <div style="width:24px;height:24px;border-radius:12px;background-color:#C69C85;color:#ffffff;text-align:center;line-height:24px;font-size:13px;font-weight:bold;font-family:Helvetica,Arial,sans-serif;">3</div>
                  </td>
                  <td style="padding:0 0 0 8px;color:#2D2D2D;font-size:14px;line-height:1.6;">
                    <strong>Detailed written quote</strong>, no pressure and no obligation.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Recap of submission -->
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <h2 style="margin:0 0 14px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#748B69;font-weight:normal;letter-spacing:1.2px;text-transform:uppercase;">
                Your enquiry
              </h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F3EFE6;border-radius:6px;padding:0;">
                <tr><td style="padding:16px 18px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${detailRow('Products of interest', productsLine)}
                    ${detailRow('Number of windows/doors', f.windowCount)}
                    ${detailRow('Project stage', f.projectStage)}
                    ${detailRow('Needs design advice', f.needsAdvice ? 'Yes &mdash; please bring samples and ideas' : '')}
                    ${detailRow('Best time to call', f.bestContactTime)}
                    ${detailRow('Appointment preference', f.appointmentPreference)}
                    ${detailRow('Suburb', f.suburb)}
                    ${detailRow('How you found us', f.referral + (f.referrerName ? ` (${f.referrerName})` : ''))}
                  </table>
                  ${f.message ? `<div style="margin-top:14px;padding-top:14px;border-top:1px solid #E8E1D6;">
                      <div style="color:#6B655C;font-size:13px;margin-bottom:6px;">Your message</div>
                      <div style="color:#2D2D2D;font-size:14px;line-height:1.6;font-style:italic;">&ldquo;${escapeHtml(f.message)}&rdquo;</div>
                    </div>` : ''}
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Recent reviews -->
          <tr>
            <td style="padding:28px 32px 8px 32px;background-color:#F9F8F6;">
              <h2 style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#748B69;font-weight:normal;letter-spacing:1.2px;text-transform:uppercase;">
                A few recent reviews
              </h2>
              <p style="margin:0 0 14px 0;color:#6B655C;font-size:13px;line-height:1.55;">
                In case you'd like to hear from people we've recently helped &mdash; here are a few${f.selectedProducts.length ? " that touch on what you've enquired about" : ""}.
              </p>
              ${reviews.map(reviewCard).join('')}
              <p style="margin:6px 0 0 0;color:#6B655C;font-size:13px;line-height:1.55;">
                Read more on our <a href="${GBP_REVIEWS_URL}" style="color:#B26E2D;text-decoration:underline;font-weight:bold;">Google Business Profile</a>.
              </p>
            </td>
          </tr>

          <!-- Contact us sooner -->
          <tr>
            <td style="padding:28px 32px 36px 32px;background-color:#F9F8F6;">
              <h2 style="margin:0 0 10px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#748B69;font-weight:normal;letter-spacing:1.2px;text-transform:uppercase;">
                Need to reach us sooner?
              </h2>
              <p style="margin:0;color:#2D2D2D;font-size:15px;line-height:1.7;">
                Call us on <a href="tel:1300732319" style="color:#B26E2D;text-decoration:none;font-weight:bold;">1300 732 319</a> or simply reply to this email &mdash; it lands directly with me.
              </p>
            </td>
          </tr>

          <!-- Charcoal footer -->
          <tr>
            <td style="background-color:#2D2D2D;padding:28px 32px;text-align:center;">
              <p style="margin:0 0 6px 0;color:#DBC4B5;font-family:Georgia,'Times New Roman',serif;font-size:15px;">
                Modern Curtains and Blinds
              </p>
              <p style="margin:0 0 14px 0;color:#A8A29E;font-size:12px;line-height:1.6;">
                Custom curtains, blinds, shutters, security screens &amp; outdoor shade.<br />
                Measured and installed across Melbourne. Australian Made &amp; Owned.
              </p>
              <p style="margin:0;color:#A8A29E;font-size:12px;line-height:1.6;">
                <a href="${SITE_URL}" style="color:#DBC4B5;text-decoration:none;">moderncurtainsandblinds.com.au</a>
                &nbsp;·&nbsp;
                <a href="tel:1300732319" style="color:#DBC4B5;text-decoration:none;">1300 732 319</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0 0;color:#A8A29E;font-size:11px;text-align:center;">
          You're receiving this email because you submitted an enquiry at moderncurtainsandblinds.com.au.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildCustomerText(f: Pick<CustomerEmailFields, 'firstName' | 'selectedProducts' | 'windowCount' | 'bestContactTime' | 'appointmentPreference' | 'message'>) {
  const greetingName = f.firstName.trim() || 'there';
  const reviews = selectReviewsForProducts(f.selectedProducts, 3);
  const lines = [
    `Hi ${greetingName},`,
    '',
    `Just a quick note from us — Deane and I have got your enquiry, and one of us will personally be in touch within the next 24 hours to organise a time that suits you.`,
    '',
    `We're a family-owned Melbourne business and we genuinely care about getting this right for you. When we come out, we'll bring samples, measure properly, and walk you through every option so you can make a confident decision — no scripts, no pressure, no upsell.`,
    '',
    `If anything's urgent before we call, just reply to this email — it lands directly with me.`,
    '',
    'Warm regards,',
    'Dee',
    'Modern Curtains and Blinds',
    '',
    '— — —',
    '',
    'WHAT HAPPENS NEXT',
    '1. We call you back within 24 hours, at a time that suits.',
    '2. Free in-home consultation — we bring the samples, measure properly, and explain every option.',
    '3. Detailed written quote, no pressure and no obligation.',
    '',
    'YOUR ENQUIRY',
    `Products: ${f.selectedProducts.length ? f.selectedProducts.join(', ') : 'Not specified'}`,
    f.windowCount ? `Windows/doors: ${f.windowCount}` : '',
    f.bestContactTime ? `Best time to call: ${f.bestContactTime}` : '',
    f.appointmentPreference ? `Appointment preference: ${f.appointmentPreference}` : '',
    f.message ? `Your message: "${f.message}"` : '',
    '',
    'A FEW RECENT REVIEWS',
    ...reviews.flatMap((r) => [
      `${'★'.repeat(r.rating)} — ${r.author}`,
      `"${r.text}"`,
      '',
    ]),
    `Read more: ${GBP_REVIEWS_URL}`,
    '',
    'NEED TO REACH US SOONER?',
    'Call 1300 732 319 or reply to this email.',
    '',
    'Modern Curtains and Blinds',
    'moderncurtainsandblinds.com.au · Australian Made & Owned',
  ].filter(Boolean);
  return lines.join('\n');
}

async function storeLeadSubmission(
  request: Request,
  body: Record<string, unknown>,
  selectedProducts: string[]
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { userAgent, ipHash } = getRequestMeta(request);
  const source = getLeadSource(body.source);
  const trackingContext = objectOrEmpty(body.trackingContext);

  // gclid is also stored in tracking_context JSON, but we surface it as a top-level
  // column so we can JOIN / filter efficiently when uploading offline conversions
  // back to Google Ads. Prefer the top-level body.gclid (sent by QuoteForm) and
  // fall back to whatever is in tracking_context for older clients.
  const gclid =
    stringOrNull(body.gclid, 200) ||
    stringOrNull((trackingContext as Record<string, unknown>).gclid, 200);

  const { data: inserted, error } = await supabase.from("lead_submissions").insert({
    source,
    first_name: stringOrNull(body.firstName, 120),
    last_name: stringOrNull(body.lastName, 120),
    email: stringOrNull(body.email, 254),
    phone: stringOrNull(body.phone, 80),
    suburb: stringOrNull(body.suburb, 180),
    product_interests: selectedProducts,
    window_count: stringOrNull(body.windowCount, 80),
    referral: stringOrNull(body.referral, 180),
    referrer_name: stringOrNull(body.referrerName, 180),
    best_contact_time: stringOrNull(body.bestContactTime, 120),
    appointment_preference: stringOrNull(body.appointmentPreference, 180),
    project_stage: stringOrNull(body.projectStage, 180),
    needs_advice: booleanValue(body.needsAdvice),
    message: stringOrNull(body.message, 4000),
    gclid,
    tracking_context: trackingContext,
    user_agent: userAgent,
    ip_hash: ipHash,
  }).select("id").single();

  if (error) {
    console.error("Failed to store lead submission:", error);
    return;
  }

  // Emit server-side lead_submitted event — conversion funnel reflects server reality.
  try {
    await supabase.from("analytics_events").insert({
      event_name: "lead_submitted",
      visitor_id: stringOrNull((trackingContext as Record<string, unknown>).visitorId, 120),
      session_id: stringOrNull((trackingContext as Record<string, unknown>).sessionId, 120),
      page_path: "/api/quote",
      properties: { lead_id: inserted?.id, source, product_count: selectedProducts.length },
    });
  } catch { /* non-fatal */ }

  // Auto-trigger an optimization run on the live signal change (fire-and-forget).
  triggerOptimizationRun().catch(() => undefined);
}

async function triggerOptimizationRun() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moderncurtainsandblinds.com.au";
  const secret = process.env.CRON_SECRET;
  if (!secret) return;
  try {
    await fetch(`${baseUrl}/api/optimization/score?trigger=event`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
    });
  } catch { /* fire-and-forget */ }
}

function getLeadSource(value: unknown) {
  if (value === "chat_widget") return "chat_widget";
  if (value === "manual") return "manual";
  if (value === "import") return "import";
  if (value === "other") return "other";
  return "quote_form";
}
