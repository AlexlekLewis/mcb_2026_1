import { NextResponse } from "next/server";
import { runOptimization } from "@/lib/optimization/runner";
import { authoriseCron } from "@/lib/optimization/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Manual trigger for an immediate scoring run. Used by:
 *   - Dashboard "Run now" button
 *   - Internal hooks (lead_submitted triggers a fast follow-up run)
 */
export async function POST(request: Request) {
    const unauthorised = authoriseCron(request);
    if (unauthorised) return unauthorised;

    const url = new URL(request.url);
    const trigger = url.searchParams.get("trigger") === "event" ? "event" : "manual";

    const result = await runOptimization({ trigger });
    return NextResponse.json(result);
}
