"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Server actions for dashboard v2 mutating operations.
 *
 * All writes go through the service-role key on the server. The dashboard is
 * already password-gated by middleware, so these actions assume an
 * authenticated dashboard user without re-checking.
 */

// ---------------------------------------------------------------------
// Citation entry — record a manual probe of a tracked question
// ---------------------------------------------------------------------

export interface RecordCitationInput {
  questionId: number;
  engine: "chatgpt" | "perplexity" | "google_ai_mode" | "copilot" | "gemini";
  mcbCited: boolean;
  mcbCitedUrl?: string;
  competitorBrands?: string[];
  notes?: string;
}

export async function recordCitation(input: RecordCitationInput): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const { error } = await supabase.from("ai_citations").insert({
    question_id: input.questionId,
    engine: input.engine,
    mcb_cited: input.mcbCited,
    mcb_cited_url: input.mcbCitedUrl ?? null,
    competitor_brands: input.competitorBrands ?? [],
    source: "manual",
    meta: input.notes ? { notes: input.notes } : {},
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/ai-presence");
  revalidatePath("/dashboard");
  return { ok: true };
}

// ---------------------------------------------------------------------
// Backlog: approve / reject a discovered question
// ---------------------------------------------------------------------

export async function approveBacklogItem(id: number): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const { error } = await supabase
    .from("content_backlog")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/content");
  return { ok: true };
}

export async function rejectBacklogItem(id: number): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const { error } = await supabase
    .from("content_backlog")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/content");
  return { ok: true };
}

// ---------------------------------------------------------------------
// Reviews: mark as posted (manual response entry)
// ---------------------------------------------------------------------

export interface MarkReviewPostedInput {
  id: number;
  postedResponse: string;
}

export async function markReviewPosted(input: MarkReviewPostedInput): Promise<
  { ok: boolean; error?: string }
> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const { error } = await supabase
    .from("gbp_reviews")
    .update({
      response_status: "posted",
      posted_response: input.postedResponse,
      posted_at: new Date().toISOString(),
    })
    .eq("id", input.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/reputation");
  return { ok: true };
}

export async function dismissReview(id: number): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const { error } = await supabase
    .from("gbp_reviews")
    .update({ response_status: "dismissed" })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/reputation");
  return { ok: true };
}

// ---------------------------------------------------------------------
// Adhoc: add a review manually (until GBP API integration ships)
// ---------------------------------------------------------------------

export interface AddManualReviewInput {
  reviewerName: string;
  rating: number;
  reviewText: string;
  reviewCreatedAt?: string;
}

export async function addManualReview(input: AddManualReviewInput): Promise<
  { ok: boolean; error?: string }
> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const reviewId = `manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const { error } = await supabase.from("gbp_reviews").insert({
    review_id: reviewId,
    reviewer_name: input.reviewerName,
    rating: input.rating,
    review_text: input.reviewText,
    review_created_at: input.reviewCreatedAt ?? new Date().toISOString(),
    response_status: "pending",
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/reputation");
  return { ok: true };
}

// ---------------------------------------------------------------------
// Suburb consolidation: bulk-update recommendations + plan export
// ---------------------------------------------------------------------

export async function setSuburbRecommendation(
  ids: number[],
  recommendation: "keep" | "consolidate" | "redirect" | "delete",
  clusterTargetUrl?: string,
): Promise<{ ok: boolean; updated: number; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, updated: 0, error: "Supabase not configured" };
  if (ids.length === 0) return { ok: true, updated: 0 };

  const update: Record<string, unknown> = { recommendation };
  if (clusterTargetUrl) update.cluster_target_url = clusterTargetUrl;

  const { error, count } = await supabase
    .from("suburb_audit")
    .update(update, { count: "exact" })
    .in("id", ids);

  if (error) return { ok: false, updated: 0, error: error.message };

  revalidatePath("/dashboard/content/suburb-audit");
  return { ok: true, updated: count ?? 0 };
}
