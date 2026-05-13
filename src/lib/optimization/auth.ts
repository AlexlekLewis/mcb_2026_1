import { NextResponse } from "next/server";

/**
 * Guard for cron + admin-trigger routes. Allows requests if EITHER:
 *  - Vercel Cron header `x-vercel-cron: 1` is present (built-in protection)
 *  - `Authorization: Bearer <CRON_SECRET>` matches process.env.CRON_SECRET
 */
export function authoriseCron(request: Request): NextResponse | null {
    const vercelCron = request.headers.get("x-vercel-cron");
    if (vercelCron) return null;

    const expected = process.env.CRON_SECRET;
    const auth = request.headers.get("authorization");
    if (expected && auth === `Bearer ${expected}`) return null;

    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
