// Renders the customer confirmation email with sample data so we can review the visual.
// Mirrors the template in src/app/api/quote/route.ts (buildCustomerHtml).
// Run with: node scripts/preview-customer-email.mjs

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Inlined copies of the curated review data + selector logic so this preview
// can run as plain ESM without a TS toolchain.
const CURATED_REVIEWS = [
  { author: 'Mohammad Shah', rating: 5, timeAgo: '3 months ago', tags: ['blinds','curtains'], text: 'Amazing service from Dee and Deanne, with great communication and customer care throughout the process. The blinds and curtains look fantastic and are excellent quality. Big thanks to Tate for the professional installation — smooth, efficient, and done perfectly. Would definitely recommend.' },
  { author: 'Esther Yew', rating: 5, timeAgo: '5 months ago', tags: ['curtains','blinds','security'], text: 'I found Modern Curtain Blinds when we first moved in. Would highly recommend for curtains and blinds as well as fly screens/doors. Dee and Deane has been amazing to communicate with and is always lovely, helpful, and reliable. Pricing is very reasonable. Would recommend 1000%' },
  { author: 'Vineel Davuluri', rating: 5, timeAgo: '8 months ago', tags: ['curtains','blinds','shutters'], text: 'Wonderful experience with modern curtains and blinds. So generous couple who decorated my new house with modern curtains and blinds and plantation shutters. Very happy to use their services at humanly possible discounted prices.' },
  { author: 'Jane McAninly', rating: 5, timeAgo: '7 months ago', tags: ['roller_blinds','blinds','curtains','shutters'], text: 'Deane and Dee were so professional and dedicated to helping us with our recent roller blinds, curtains and plantation shutters. The experience in helping us choose the correct colours and options with our renovations was so helpful.' },
  { author: 'Jessica Barry', rating: 5, timeAgo: '9 months ago', tags: ['roller_blinds','blinds','curtains'], text: 'Deane and Dee were very flexible and lovely to work with! Extremely happy with our final product which is of a high quality, looks beautiful and was turned around in a short timeframe.' },
  { author: 'Arafat Mohamed', rating: 5, timeAgo: '7 months ago', tags: ['blinds','curtains'], text: 'We had our blinds and curtains done recently, I just wanted to come here and share my experience. Dee and the team were lovely to work with — they treated us more like family rather than clients.' },
  { author: 'Mike Paterson', rating: 5, timeAgo: '9 months ago', tags: ['blinds','roller_blinds'], text: 'The smoothest, easiest and best experience from start to finish. Dee and Deane give a personal service that is second to none. We are very happy with the privacy and block-out blinds in our brand new house.' },
  { author: 'Hayley', rating: 5, timeAgo: '10 months ago', tags: ['blinds','security','curtains'], text: 'Deane and Dee both came out to my house to give me a free quote on some blinds, doors and curtains (as I have just built my first home). They arrived on time, which some contractors don’t even show up these days!' },
  { author: 'Andrea Atherton', rating: 5, timeAgo: 'a year ago', tags: ['blinds'], text: 'I had blinds installed by Tate and couldn’t be happier! The team was professional, friendly, and helpful. The blinds are high quality, look great, and were installed soo quickly. The whole process was smooth from start to finish. Highly recommend!' },
  { author: 'Anjali Biddanda', rating: 5, timeAgo: '6 months ago', tags: ['curtains','blinds'], text: 'Dee and Deane were so patient with my indecision and going back and forth between the fabrics I had selected. They came out twice to help me decide. I finally have them installed and I love them! They’re professionals and lovely to work with.' },
  { author: 'Imman Saaoud', rating: 5, timeAgo: '11 months ago', tags: ['blinds'], text: 'Absolute best experience with Modern Curtains and Blinds! They were professional, experienced and great with communicating. The blinds they installed are amazing quality and went beyond our expectations!! Highly recommend!' },
  { author: 'Tahlia Castagnini', rating: 5, timeAgo: '10 months ago', tags: ['blinds','roller_blinds'], text: 'We had such a great experience! From the first consultation to the final installation, everything was smooth and professional, the team were all super friendly and super efficient. Could not recommend them enough to anyone looking for good quality blinds and great service.' },
];

const PRODUCT_TAG_KEYWORDS = {
  curtains: /curtain/i,
  roller_blinds: /roller|blockout|block-out|honeycomb|cellular|venetian|vertical/i,
  blinds: /blind/i,
  shutters: /shutter/i,
  security: /security|fly.?screen|crimsafe|screen.?door/i,
  awnings: /awning|outdoor|zip.?screen|folding.?arm/i,
  motorisation: /motoris|motoriz|automat|smart.?home|remote/i,
};

function selectReviewsForProducts(products, count = 3) {
  const tags = new Set();
  for (const p of products || []) {
    for (const [tag, re] of Object.entries(PRODUCT_TAG_KEYWORDS)) {
      if (re.test(p)) tags.add(tag);
    }
  }
  const customerTags = Array.from(tags);
  const scored = CURATED_REVIEWS.map((r, i) => ({
    review: r,
    index: i,
    matchCount: customerTags.length === 0 ? 0 : r.tags.filter((t) => customerTags.includes(t)).length,
  }));
  scored.sort((a, b) => (b.matchCount - a.matchCount) || (b.review.rating - a.review.rating) || (a.index - b.index));
  return scored.slice(0, count).map((s) => s.review);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const SITE_URL = 'https://www.moderncurtainsandblinds.com.au';
const LOGO_URL = `${SITE_URL}/assets/logo-nav.png`;
const OWNERS_PHOTO_URL = `${SITE_URL}/assets/mcb-owners.jpg`;
const GBP_REVIEWS_URL = 'https://maps.app.goo.gl/zRBNX1LBoTc2DK2g9';

function buildCustomerHtml(f) {
  const greetingName = (f.firstName || '').trim() || 'there';
  const productsLine = f.selectedProducts?.length
    ? f.selectedProducts.map(escapeHtml).join(', ')
    : 'Not specified';
  const reviews = selectReviewsForProducts(f.selectedProducts || [], 3);

  const detailRow = (label, value) => value
    ? `<tr>
         <td style="padding:8px 0;border-bottom:1px solid #E8E1D6;color:#6B655C;font-size:13px;width:42%;vertical-align:top;">${escapeHtml(label)}</td>
         <td style="padding:8px 0;border-bottom:1px solid #E8E1D6;color:#2D2D2D;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
       </tr>`
    : '';

  const reviewCard = (r) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid #E8E1D6;border-radius:6px;margin-bottom:12px;">
      <tr><td style="padding:16px 18px;">
        <div style="color:#B26E2D;font-size:14px;letter-spacing:2px;line-height:1;margin-bottom:8px;">${'★'.repeat(r.rating)}</div>
        <p style="margin:0 0 12px 0;color:#2D2D2D;font-size:14px;line-height:1.65;font-style:italic;">&ldquo;${escapeHtml(r.text)}&rdquo;</p>
        <div style="color:#6B655C;font-size:12px;">
          <strong style="color:#2D2D2D;">${escapeHtml(r.author)}</strong>
          <span style="color:#A8A29E;">&nbsp;·&nbsp;Google review&nbsp;·&nbsp;${escapeHtml(r.timeAgo)}</span>
        </div>
      </td></tr>
    </table>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Thanks for your enquiry — Modern Curtains and Blinds</title>
</head>
<body style="margin:0;padding:0;background-color:#F9F8F6;font-family:Helvetica,Arial,sans-serif;color:#2D2D2D;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9F8F6;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">

          <tr>
            <td style="background-color:#2D2D2D;padding:32px 24px;text-align:center;">
              <img src="${LOGO_URL}" alt="Modern Curtains and Blinds" width="240" style="display:inline-block;width:240px;max-width:65%;height:auto;" />
            </td>
          </tr>

          <tr><td style="height:4px;background-color:#C69C85;line-height:4px;font-size:0;">&nbsp;</td></tr>

          <tr>
            <td style="padding:36px 32px 12px 32px;">
              <h1 style="margin:0 0 18px 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#2D2D2D;font-weight:normal;">
                Hi ${escapeHtml(greetingName)} &mdash; thank you for reaching out.
              </h1>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                <tr>
                  <td width="92" style="vertical-align:top;padding-right:18px;">
                    <img src="${OWNERS_PHOTO_URL}" alt="Dean and Dee, owners" width="80" style="display:block;width:80px;height:80px;border-radius:40px;object-fit:cover;border:2px solid #C69C85;" />
                  </td>
                  <td style="vertical-align:top;color:#2D2D2D;font-size:15px;line-height:1.7;">
                    <p style="margin:0 0 12px 0;">
                      Just a quick note from Dee and me &mdash; we've got your enquiry, and one of us will personally be in touch <strong style="color:#B26E2D;">within the next 24 hours</strong> to organise a time that suits you.
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
                <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#2D2D2D;">Dean &amp; Dee</span><br />
                <span style="color:#6B655C;font-size:13px;">Modern Curtains and Blinds</span>
              </p>
            </td>
          </tr>

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
                    ${detailRow('Needs design advice', f.needsAdvice ? 'Yes — please bring samples and ideas' : '')}
                    ${detailRow('Best time to call', f.bestContactTime)}
                    ${detailRow('Appointment preference', f.appointmentPreference)}
                    ${detailRow('Suburb', f.suburb)}
                    ${detailRow('How you found us', (f.referral || '') + (f.referrerName ? ` (${f.referrerName})` : ''))}
                  </table>
                  ${f.message ? `<div style="margin-top:14px;padding-top:14px;border-top:1px solid #E8E1D6;">
                      <div style="color:#6B655C;font-size:13px;margin-bottom:6px;">Your message</div>
                      <div style="color:#2D2D2D;font-size:14px;line-height:1.6;font-style:italic;">&ldquo;${escapeHtml(f.message)}&rdquo;</div>
                    </div>` : ''}
                </td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px 32px;background-color:#F9F8F6;">
              <h2 style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#748B69;font-weight:normal;letter-spacing:1.2px;text-transform:uppercase;">
                A few recent reviews
              </h2>
              <p style="margin:0 0 14px 0;color:#6B655C;font-size:13px;line-height:1.55;">
                In case you'd like to hear from people we've recently helped &mdash; here are a few${f.selectedProducts?.length ? " that touch on what you've enquired about" : ""}.
              </p>
              ${reviews.map(reviewCard).join('')}
              <p style="margin:6px 0 0 0;color:#6B655C;font-size:13px;line-height:1.55;">
                Read more on our <a href="${GBP_REVIEWS_URL}" style="color:#B26E2D;text-decoration:underline;font-weight:bold;">Google Business Profile</a>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 36px 32px;background-color:#F9F8F6;">
              <h2 style="margin:0 0 10px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#748B69;font-weight:normal;letter-spacing:1.2px;text-transform:uppercase;">
                Need to reach us sooner?
              </h2>
              <p style="margin:0;color:#2D2D2D;font-size:15px;line-height:1.7;">
                Call us on <a href="tel:1300732319" style="color:#B26E2D;text-decoration:none;font-weight:bold;">1300 732 319</a> or simply reply to this email &mdash; it lands directly with Dean and Dee.
              </p>
            </td>
          </tr>

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

const sample = {
  firstName: 'Sarah',
  selectedProducts: ['Plantation Shutters', 'Roller Blinds', 'Sheer Curtains'],
  windowCount: '5-10',
  referral: 'Google search',
  referrerName: '',
  bestContactTime: 'Weekday mornings',
  appointmentPreference: 'In-home consultation',
  projectStage: 'Renovating — ready in 4-6 weeks',
  needsAdvice: true,
  message: 'Hi, we\'re finishing a renovation in Hampton and would love some advice on shutters for the front of the house and softer fabric blinds for the bedrooms. Looking for something that works with a coastal style.',
  suburb: 'Hampton',
};

const html = buildCustomerHtml(sample);
const out = resolve(__dirname, '..', 'audits', 'customer-email-preview.html');
writeFileSync(out, html, 'utf8');
console.log(`Preview written: ${out}`);
console.log(`Reviews picked for products [${sample.selectedProducts.join(', ')}]:`);
selectReviewsForProducts(sample.selectedProducts, 3).forEach((r, i) => {
  console.log(`  ${i + 1}. ${r.author} — tags: ${r.tags.join(', ')}`);
});
