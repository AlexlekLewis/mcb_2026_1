import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nextPath = getSafeNextPath(String(formData.get("next") || "/dashboard"));

  const dashboardUsername = process.env.DASHBOARD_USERNAME;
  const dashboardPassword = process.env.DASHBOARD_PASSWORD;

  const normalizedEmail = email.toLowerCase();
  const normalizedDashboardUsername = dashboardUsername?.trim().toLowerCase();

  if (
    !normalizedDashboardUsername ||
    !dashboardPassword ||
    normalizedEmail !== normalizedDashboardUsername ||
    password !== dashboardPassword
  ) {
    return NextResponse.redirect(new URL(`/dashboard/login?error=1&next=${encodeURIComponent(nextPath)}`, request.url), 303);
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), 303);
  response.cookies.set("mcb_dashboard_session", dashboardPassword, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}

function getSafeNextPath(value: string) {
  return value.startsWith("/dashboard") && value !== "/dashboard/login" ? value : "/dashboard";
}
