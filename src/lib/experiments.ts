"use client";

/**
 * Lightweight A/B experiment harness — owned by the lead agent.
 *
 * No external dependency. Uses deterministic hash-bucketing on the visitor_id
 * already created by lib/analytics.ts. Persists the assignment in localStorage
 * so a returning visitor sees the same variant.
 *
 * Reserved experiment keys (add yours here BEFORE opening a PR):
 *   hero_cta_v2          Agent 2 — static hero vs current carousel
 *   sticky_dismissable   Agent 4 — 24h-dismissible variant on sticky mobile CTA
 *   chat_v2              Agent 6 — three-arm test on chat widget (off / current / call-me-back)
 *
 * Usage:
 *   const variant = getVariant("hero_cta_v2", ["control", "static", "video"]);
 *   if (variant === "static") { ... }
 *
 * Bucketing is uniform across the declared variants. Call sites should pass the
 * SAME variant array in the SAME order across sessions — adding/removing a variant
 * mid-experiment will reshuffle assignments.
 */

import { trackExposure } from "./analytics";

const STORAGE_KEY_PREFIX = "mcb_exp_";
const VISITOR_KEY = "mcb_visitor_id";

export type Variant = string;

export function getVariant<T extends Variant>(
  experiment: string,
  variants: readonly [T, ...T[]],
  options: { override?: T } = {}
): T {
  if (typeof window === "undefined") {
    return variants[0];
  }

  if (options.override && variants.includes(options.override)) {
    return options.override;
  }

  const overrideFromUrl = readOverrideFromUrl(experiment, variants);
  if (overrideFromUrl) {
    return overrideFromUrl;
  }

  const stored = readStored(experiment);
  if (stored && (variants as readonly string[]).includes(stored)) {
    trackExposure(experiment, stored);
    return stored as T;
  }

  const visitorId = readVisitorId();
  const idx = bucketIndex(`${experiment}:${visitorId}`, variants.length);
  const assigned = variants[idx];
  persistAssignment(experiment, assigned);
  trackExposure(experiment, assigned);
  return assigned;
}

/**
 * Force an assignment for QA. Use ?mcb_exp_<experiment>=<variant> in the URL.
 * Persists for the rest of the session via localStorage.
 */
function readOverrideFromUrl<T extends Variant>(
  experiment: string,
  variants: readonly T[]
): T | null {
  try {
    const params = new URL(window.location.href).searchParams;
    const key = `${STORAGE_KEY_PREFIX}${experiment}`;
    const value = params.get(key);
    if (value && (variants as readonly string[]).includes(value)) {
      persistAssignment(experiment, value as T);
      return value as T;
    }
  } catch {
    // ignore malformed URLs
  }
  return null;
}

function readStored(experiment: string): string | null {
  try {
    return window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${experiment}`);
  } catch {
    return null;
  }
}

function persistAssignment(experiment: string, variant: string) {
  try {
    window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${experiment}`, variant);
  } catch {
    // localStorage may be blocked; the visitor will be rebucketed each page load
  }
}

function readVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
  } catch {
    // ignore
  }
  // Fallback: temporary ID for this page load only
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * FNV-1a 32-bit hash → uniform bucket. Deterministic, fast, no deps.
 */
function bucketIndex(input: string, buckets: number): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return Math.abs(hash) % buckets;
}
