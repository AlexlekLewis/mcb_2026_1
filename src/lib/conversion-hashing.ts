/**
 * Helpers for Google Ads Enhanced Conversions.
 *
 * We hash PII client-side (SHA-256 of normalized values) before pushing to the
 * dataLayer so raw email/phone/name never appears in DevTools or browser
 * extensions that can read the dataLayer. GTM's Google Ads conversion tag maps
 * these hashed fields to the user_data parameter.
 *
 * Reference: https://support.google.com/google-ads/answer/13262500
 */

export type EnhancedConversionUserData = {
  ec_email_sha256: string;
  ec_phone_e164_sha256: string;
  ec_first_name_sha256: string;
  ec_last_name_sha256: string;
};

export async function sha256(input: string): Promise<string> {
  if (!input) return "";
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Normalize an Australian phone number to E.164 (+61...).
 * Accepts: "0412 345 678", "+61412345678", "61412345678", "412345678".
 * Returns "" if input has no digits.
 */
export function normalizePhoneAU(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("61")) return `+${digits}`;
  if (digits.startsWith("0")) return `+61${digits.slice(1)}`;
  return `+61${digits}`;
}

export async function hashUserData(form: {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}): Promise<EnhancedConversionUserData> {
  const [email, phone, first, last] = await Promise.all([
    sha256(normalizeEmail(form.email)),
    sha256(normalizePhoneAU(form.phone)),
    sha256(normalizeName(form.firstName)),
    sha256(normalizeName(form.lastName)),
  ]);
  return {
    ec_email_sha256: email,
    ec_phone_e164_sha256: phone,
    ec_first_name_sha256: first,
    ec_last_name_sha256: last,
  };
}
