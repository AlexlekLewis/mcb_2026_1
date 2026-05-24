import { createHash } from "crypto";

export type RequestGeo = {
  country: string | null;
  region: string | null;
  city: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type DeviceInfo = {
  deviceType: "mobile" | "tablet" | "desktop" | "bot" | "unknown";
  browser: string | null;
  os: string | null;
};

export function getRequestMeta(request: Request) {
  const ipAddress = getIpAddress(request);
  const salt = process.env.ANALYTICS_IP_SALT || "mcb-website-data";
  const userAgent = request.headers.get("user-agent") || null;

  return {
    userAgent,
    ipHash: ipAddress ? createHash("sha256").update(`${ipAddress}:${salt}`).digest("hex") : null,
    geo: getRequestGeo(request),
    device: parseUserAgent(userAgent),
  };
}

export function getRequestGeo(request: Request): RequestGeo {
  const headers = request.headers;
  const decode = (value: string | null) => {
    if (!value) return null;
    try {
      const decoded = decodeURIComponent(value).trim();
      return decoded || null;
    } catch {
      return value.trim() || null;
    }
  };

  const country =
    decode(headers.get("x-vercel-ip-country")) ||
    decode(headers.get("cf-ipcountry")) ||
    decode(headers.get("x-country-code")) ||
    null;
  const region =
    decode(headers.get("x-vercel-ip-country-region")) ||
    decode(headers.get("cf-region-code")) ||
    null;
  const city =
    decode(headers.get("x-vercel-ip-city")) ||
    decode(headers.get("cf-ipcity")) ||
    null;
  // Vercel sets x-vercel-ip-postal-code for known IPs. We only persist the
  // raw value here — region-validity (must be AU 4-digit) is enforced by
  // resolveLocation() at read-time. For AU traffic this is usually present.
  const postcode = decode(headers.get("x-vercel-ip-postal-code")) || null;
  const latitudeRaw =
    headers.get("x-vercel-ip-latitude") || headers.get("cf-iplatitude");
  const longitudeRaw =
    headers.get("x-vercel-ip-longitude") || headers.get("cf-iplongitude");

  const latitude = latitudeRaw ? Number.parseFloat(latitudeRaw) : NaN;
  const longitude = longitudeRaw ? Number.parseFloat(longitudeRaw) : NaN;

  return {
    country,
    region,
    city,
    postcode,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
  };
}

export function parseUserAgent(userAgent: string | null): DeviceInfo {
  if (!userAgent) {
    return { deviceType: "unknown", browser: null, os: null };
  }

  const ua = userAgent.toLowerCase();

  const isBot = /(bot|crawler|spider|crawling|facebookexternalhit|slurp|preview|googlebot|bingbot)/i.test(ua);
  if (isBot) {
    return { deviceType: "bot", browser: "bot", os: null };
  }

  let deviceType: DeviceInfo["deviceType"] = "desktop";
  if (/ipad|tablet|playbook|silk/.test(ua) || (/android/.test(ua) && !/mobile/.test(ua))) {
    deviceType = "tablet";
  } else if (/mobi|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/.test(ua)) {
    deviceType = "mobile";
  }

  let browser: string | null = "Other";
  if (/edg\//.test(ua)) browser = "Edge";
  else if (/opr\//.test(ua) || /opera/.test(ua)) browser = "Opera";
  else if (/chrome\//.test(ua) && !/chromium/.test(ua)) browser = "Chrome";
  else if (/safari/.test(ua) && !/chrome|crios|fxios/.test(ua)) browser = "Safari";
  else if (/firefox|fxios/.test(ua)) browser = "Firefox";
  else if (/samsungbrowser/.test(ua)) browser = "Samsung Internet";

  let os: string | null = "Other";
  if (/windows nt/.test(ua)) os = "Windows";
  else if (/iphone|ipad|ipod/.test(ua)) os = "iOS";
  else if (/mac os x/.test(ua)) os = "macOS";
  else if (/android/.test(ua)) os = "Android";
  else if (/linux/.test(ua)) os = "Linux";
  else if (/cros/.test(ua)) os = "ChromeOS";

  return { deviceType, browser, os };
}

export function stringOrNull(value: unknown, maxLength = 1000) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export function stringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function objectOrEmpty(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

export function booleanValue(value: unknown) {
  return typeof value === "boolean" ? value : Boolean(value);
}

function getIpAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("true-client-ip") ||
    null
  );
}
