import { NextResponse } from "next/server";
import { runOptimization } from "@/lib/optimization/runner";
import { authoriseCron } from "@/lib/optimization/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
    const unauthorised = authoriseCron(request);
    if (unauthorised) return unauthorised;

    const result = await runOptimization({ trigger: "cron" });
    return NextResponse.json(result);
}

export async function POST(request: Request) {
    return GET(request);
}
