import { createHash } from "crypto";

export function getRequestMeta(request: Request) {
  const ipAddress = getIpAddress(request);
  const salt = process.env.ANALYTICS_IP_SALT || "mcb-website-data";

  return {
    userAgent: request.headers.get("user-agent") || null,
    ipHash: ipAddress ? createHash("sha256").update(`${ipAddress}:${salt}`).digest("hex") : null,
  };
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
