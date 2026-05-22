import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Internal endpoint for AI-bot crawl logging.
 *
 * Called fire-and-forget from src/middleware.ts when an AI bot UA is detected.
 * Not for external use — protected by a shared internal key derived from the
 * service-role key (so no new env var is needed).
 *
 * Writes one row to public.bot_crawls per call.
 *
 * Fails open: any error (no Supabase config, DB unavailable, bad payload)
 * returns 200 with status="skipped". The middleware MUST NOT block on this.
 */

// Node runtime so we can use Supabase admin client + crypto.
export const runtime = "nodejs";

// Never cache.
export const dynamic = "force-dynamic";

function internalKey(): string | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  // First 16 chars of sha256(service-role key). Stable, never logged, not
  // reversible to the actual key.
  return createHash("sha256").update(serviceKey).digest("hex").slice(0, 16);
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

type BotLogPayload = {
  bot_id: string;
  user_agent: string;
  path: string;
  host?: string;
  ip?: string;
  status_code?: number;
  meta?: Record<string, unknown>;
};

export async function POST(request: Request) {
  // 1. Verify internal-call header
  const expected = internalKey();
  const provided = request.headers.get("x-mcb-internal-key");
  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false, status: "unauthorized" }, { status: 401 });
  }

  // 2. Parse + validate payload
  let payload: BotLogPayload;
  try {
    payload = (await request.json()) as BotLogPayload;
  } catch {
    return NextResponse.json({ ok: false, status: "bad_json" }, { status: 400 });
  }

  if (!payload?.bot_id || !payload?.user_agent || !payload?.path) {
    return NextResponse.json({ ok: false, status: "missing_fields" }, { status: 400 });
  }

  // 3. Get Supabase admin client — fail open if unconfigured
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: true, status: "skipped_no_config" });
  }

  // 4. Insert row
  try {
    const { error } = await supabase.from("bot_crawls").insert({
      bot_id: payload.bot_id,
      user_agent: payload.user_agent.slice(0, 1000),
      path: payload.path.slice(0, 2000),
      host: payload.host ?? null,
      status_code: payload.status_code ?? null,
      ip_hash: payload.ip ? sha256(payload.ip) : null,
      meta: payload.meta ?? {},
    });

    if (error) {
      console.warn(JSON.stringify({ type: "bot_log_insert_error", error: error.message }));
      return NextResponse.json({ ok: false, status: "db_error" });
    }

    return NextResponse.json({ ok: true, status: "logged" });
  } catch (err) {
    console.warn(
      JSON.stringify({
        type: "bot_log_unexpected_error",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ ok: false, status: "unexpected_error" });
  }
}
