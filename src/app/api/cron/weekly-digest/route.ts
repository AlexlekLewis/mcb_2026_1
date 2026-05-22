import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { authoriseCron } from "@/lib/optimization/auth";
import { sendDigest } from "@/lib/dashboard/v2/digest-email";
import {
  fetchLeadsHeroData,
  fetchBotCrawlSummary,
  fetchAiCitationSummary,
  fetchStaleContent,
  fetchPendingReviews,
  sumColumn,
  formatPercent,
  formatNumber,
} from "@/lib/dashboard/v2/data";

/**
 * Weekly KPI digest, emailed Fridays at 07:00 UTC (17:00 AEST).
 *
 * Pulls the same data the Home dashboard surfaces and packages it into a
 * one-screen email. Skips silently if SMTP isn't configured — see
 * src/lib/dashboard/v2/digest-email.ts for env requirements.
 */

export const runtime = "nodejs";
export const maxDuration = 30;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moderncurtainsandblinds.com.au";

export async function GET(request: Request) {
  const unauthorised = authoriseCron(request);
  if (unauthorised) return unauthorised;

  const [{ current, prior }, botSummary, citationSummary, staleContent, pendingReviews] =
    await Promise.all([
      fetchLeadsHeroData(),
      fetchBotCrawlSummary(),
      fetchAiCitationSummary(),
      fetchStaleContent(5),
      fetchPendingReviews(5),
    ]);

  const leadsCurrent = sumColumn(current, "leads");
  const leadsPrior = sumColumn(prior, "leads");
  const visitorsCurrent = sumColumn(current, "visitors");
  const leadRate = visitorsCurrent > 0 ? leadsCurrent / visitorsCurrent : 0;
  const leadsDelta = leadsCurrent - leadsPrior;
  const leadsDeltaPct =
    leadsPrior > 0 ? ((leadsCurrent - leadsPrior) / leadsPrior) * 100 : null;

  const sov = citationSummary.share_of_voice_7d;
  const sovLabel =
    citationSummary.total_probes_7d === 0
      ? "no probes logged"
      : `${formatPercent(sov)} (${citationSummary.mcb_cited_count_7d}/${citationSummary.total_probes_7d} probes)`;

  const subject = `MCB · ${leadsCurrent} leads / 28d · ${leadsDelta >= 0 ? "+" : ""}${leadsDelta} vs prior`;

  const html = buildHtml({
    leadsCurrent,
    leadsPrior,
    leadsDelta,
    leadsDeltaPct,
    visitorsCurrent,
    leadRate,
    botTotal7d: botSummary.total7d,
    botPrior7d: botSummary.prior7d,
    botCount: botSummary.byBot.length,
    sovLabel,
    stale: staleContent,
    pendingReviews,
  });

  const text = buildText({
    leadsCurrent,
    leadsPrior,
    leadsDelta,
    visitorsCurrent,
    leadRate,
    botTotal7d: botSummary.total7d,
    sovLabel,
    stale: staleContent,
    pendingReviews,
  });

  const result = await sendDigest({ subject, htmlBody: html, textBody: text });

  // Log to Supabase for observability — same release log dashboard reads.
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("bot_crawls").insert({
      bot_id: "_digest_sent",
      user_agent: "weekly-digest",
      path: "/",
      meta: { result, subject },
    });
  }

  return NextResponse.json({ ok: true, subject, send: result });
}

interface DigestData {
  leadsCurrent: number;
  leadsPrior: number;
  leadsDelta: number;
  leadsDeltaPct: number | null;
  visitorsCurrent: number;
  leadRate: number;
  botTotal7d: number;
  botPrior7d: number;
  botCount: number;
  sovLabel: string;
  stale: Awaited<ReturnType<typeof fetchStaleContent>>;
  pendingReviews: Awaited<ReturnType<typeof fetchPendingReviews>>;
}

function buildHtml(d: DigestData): string {
  const deltaColor = d.leadsDelta >= 0 ? "#748B69" : "#B23A2D";
  const deltaSign = d.leadsDelta >= 0 ? "+" : "";
  const deltaPct = d.leadsDeltaPct !== null ? ` (${deltaSign}${d.leadsDeltaPct.toFixed(0)}%)` : "";

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F9F8F6;font-family:'Helvetica Neue',Arial,sans-serif;color:#2D2D2D;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9F8F6;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #E8E2D7;border-radius:12px;padding:24px;">
        <tr><td>
          <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6B6457;">MCB · Weekly digest</p>
          <h1 style="margin:8px 0 16px;font-family:Georgia,serif;font-size:24px;color:#2D2D2D;">Last 28 days</h1>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:16px;background:#F3EFE6;border-radius:8px;">
                <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#6B6457;">Leads · 28d</p>
                <p style="margin:6px 0 0;font-size:36px;font-weight:600;color:#2D2D2D;">${d.leadsCurrent}</p>
                <p style="margin:4px 0 0;font-size:13px;color:${deltaColor};">${deltaSign}${d.leadsDelta} vs prior 28d${deltaPct}</p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
            <tr>
              <td width="33%" style="padding:12px;background:#F9F8F6;border:1px solid #E8E2D7;border-radius:8px;vertical-align:top;">
                <p style="margin:0;font-size:10px;text-transform:uppercase;color:#6B6457;">Lead rate</p>
                <p style="margin:4px 0 0;font-size:20px;font-weight:600;">${formatPercent(d.leadRate)}</p>
              </td>
              <td width="2"></td>
              <td width="33%" style="padding:12px;background:#F9F8F6;border:1px solid #E8E2D7;border-radius:8px;vertical-align:top;">
                <p style="margin:0;font-size:10px;text-transform:uppercase;color:#6B6457;">Visitors</p>
                <p style="margin:4px 0 0;font-size:20px;font-weight:600;">${formatNumber(d.visitorsCurrent)}</p>
              </td>
              <td width="2"></td>
              <td width="33%" style="padding:12px;background:#F9F8F6;border:1px solid #E8E2D7;border-radius:8px;vertical-align:top;">
                <p style="margin:0;font-size:10px;text-transform:uppercase;color:#6B6457;">AI bots · 7d</p>
                <p style="margin:4px 0 0;font-size:20px;font-weight:600;">${formatNumber(d.botTotal7d)}</p>
              </td>
            </tr>
          </table>

          <h2 style="margin:24px 0 8px;font-family:Georgia,serif;font-size:18px;">AI presence</h2>
          <p style="margin:0;font-size:13px;color:#6B6457;">Citation SoV · 7d: <strong style="color:#2D2D2D;">${d.sovLabel}</strong></p>
          <p style="margin:6px 0 0;font-size:13px;color:#6B6457;">Bots seen this week: <strong style="color:#2D2D2D;">${d.botCount}</strong></p>

          ${d.stale.length > 0 ? `
          <h2 style="margin:24px 0 8px;font-family:Georgia,serif;font-size:18px;">Refresh queue</h2>
          <ul style="margin:0;padding:0 0 0 18px;font-size:13px;color:#2D2D2D;">
            ${d.stale.map((s) => `<li style="margin:6px 0;"><code style="font-family:Menlo,monospace;font-size:12px;">${s.url}</code> · ${s.days_stale ?? "?"}d stale · ${s.ai_citations_30d} AI cites</li>`).join("")}
          </ul>` : ""}

          ${d.pendingReviews.length > 0 ? `
          <h2 style="margin:24px 0 8px;font-family:Georgia,serif;font-size:18px;">Reviews waiting</h2>
          <ul style="margin:0;padding:0 0 0 18px;font-size:13px;color:#2D2D2D;">
            ${d.pendingReviews.map((r) => `<li style="margin:6px 0;">${r.reviewer_name ?? "Anonymous"}${r.rating ? ` (${r.rating}★)` : ""}</li>`).join("")}
          </ul>` : ""}

          <p style="margin:32px 0 0;font-size:12px;color:#6B6457;">
            <a href="${SITE_URL}/dashboard" style="color:#8E5520;text-decoration:none;">Open dashboard →</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildText(d: Omit<DigestData, "leadsDeltaPct" | "botPrior7d" | "botCount">): string {
  const deltaSign = d.leadsDelta >= 0 ? "+" : "";
  return [
    "MCB · Weekly digest",
    "",
    `Leads (28d):        ${d.leadsCurrent} (${deltaSign}${d.leadsDelta} vs prior)`,
    `Lead rate (28d):    ${formatPercent(d.leadRate)}`,
    `Visitors (28d):     ${formatNumber(d.visitorsCurrent)}`,
    `AI bot crawls (7d): ${formatNumber(d.botTotal7d)}`,
    `Citation SoV (7d):  ${d.sovLabel}`,
    "",
    d.stale.length > 0
      ? `Refresh queue (${d.stale.length}):\n${d.stale.map((s) => `  - ${s.url} (${s.days_stale ?? "?"}d stale)`).join("\n")}`
      : "Refresh queue: empty",
    "",
    d.pendingReviews.length > 0
      ? `Reviews waiting (${d.pendingReviews.length}):\n${d.pendingReviews.map((r) => `  - ${r.reviewer_name ?? "Anonymous"}${r.rating ? ` (${r.rating}★)` : ""}`).join("\n")}`
      : "Reviews: all caught up",
    "",
    `${SITE_URL}/dashboard`,
  ].join("\n");
}
