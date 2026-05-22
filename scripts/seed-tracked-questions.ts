/**
 * Seed the public.tracked_questions table with the top 30 questions
 * identified in the AI search strategy research memo.
 *
 * Usage:
 *   npx tsx scripts/seed-tracked-questions.ts
 *
 * Requires the same env vars used by the rest of the server code:
 *   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Idempotent — upserts on `question` unique index. Run as many times as you
 * like; rows aren't duplicated.
 */

import { createClient } from "@supabase/supabase-js";

type SeedQuestion = {
  question: string;
  category: string;
  intent: "commercial" | "informational" | "navigational";
  priority: number;
  expected_volume?: number;
  notes?: string;
};

// Ranked priorities mirror the research memo's "top 30 by likely value".
const QUESTIONS: SeedQuestion[] = [
  { question: "How much do plantation shutters cost per window in Melbourne?",                          category: "pricing",    intent: "commercial",    priority: 1, expected_volume: 1200 },
  { question: "Are plantation shutters dated in 2026?",                                                  category: "style",      intent: "informational", priority: 1, expected_volume: 900 },
  { question: "Blinds vs curtains for bedroom — which is better?",                                  category: "comparison", intent: "informational", priority: 1, expected_volume: 1800 },
  { question: "Best blinds to block heat in a west-facing Melbourne window",                             category: "functional", intent: "commercial",    priority: 2, expected_volume: 600 },
  { question: "How do I know if a blinds quote is fair?",                                                category: "vendor",     intent: "commercial",    priority: 2, expected_volume: 400 },
  { question: "PVC vs basswood plantation shutters for Melbourne homes",                                 category: "comparison", intent: "commercial",    priority: 2, expected_volume: 500 },
  { question: "S-fold vs pinch pleat vs eyelet curtains — what's the difference?",                  category: "comparison", intent: "informational", priority: 2, expected_volume: 800 },
  { question: "How much does it cost to curtain a whole house in Australia?",                            category: "pricing",    intent: "commercial",    priority: 2, expected_volume: 500 },
  { question: "Are motorised blinds worth it?",                                                          category: "functional", intent: "commercial",    priority: 3, expected_volume: 600 },
  { question: "Are plantation shutters good for Victorian terraces?",                                    category: "au_specific",intent: "commercial",    priority: 3, expected_volume: 350 },
  { question: "Do Victorian landlords have to provide curtains and blinds?",                             category: "au_specific",intent: "informational", priority: 3, expected_volume: 400 },
  { question: "Blackout curtains for a baby's nursery — what actually blocks 100% of light?",       category: "functional", intent: "commercial",    priority: 4, expected_volume: 700 },
  { question: "How do I measure a window for blinds (inside vs outside mount)?",                         category: "install",    intent: "informational", priority: 4, expected_volume: 1500 },
  { question: "Are sheer curtains private at night?",                                                    category: "functional", intent: "informational", priority: 4, expected_volume: 1000 },
  { question: "What colour blinds go with grey walls?",                                                  category: "style",      intent: "informational", priority: 4, expected_volume: 2000 },
  { question: "How long does it take to install plantation shutters?",                                   category: "install",    intent: "commercial",    priority: 4, expected_volume: 350 },
  { question: "Plantation shutters vs blinds vs curtains for resale value",                              category: "comparison", intent: "commercial",    priority: 4, expected_volume: 300 },
  { question: "Best window furnishings for double glazing in Melbourne",                                 category: "functional", intent: "commercial",    priority: 5, expected_volume: 250 },
  { question: "How to fix a roller blind that won't retract",                                            category: "maintenance",intent: "informational", priority: 5, expected_volume: 900 },
  { question: "Honeycomb vs roller blinds — is the price difference worth it?",                     category: "comparison", intent: "commercial",    priority: 5, expected_volume: 300 },
  { question: "Why are custom curtains so expensive?",                                                   category: "pricing",    intent: "informational", priority: 5, expected_volume: 500 },
  { question: "Do plantation shutters add value to my home?",                                            category: "pricing",    intent: "informational", priority: 5, expected_volume: 400 },
  { question: "What questions should I ask a blinds company before signing?",                            category: "vendor",     intent: "commercial",    priority: 5, expected_volume: 200 },
  { question: "How long do plantation shutters last in Australia?",                                      category: "maintenance",intent: "informational", priority: 6, expected_volume: 300 },
  { question: "Can you layer sheer curtains over plantation shutters?",                                  category: "style",      intent: "informational", priority: 6, expected_volume: 250 },
  { question: "What's the best window covering for a south-facing room that gets no light?",             category: "functional", intent: "commercial",    priority: 6, expected_volume: 200 },
  { question: "Are vertical blinds outdated, and what do you replace them with?",                        category: "style",      intent: "commercial",    priority: 6, expected_volume: 400 },
  { question: "Can plantation shutters be installed in a bathroom (moisture)?",                          category: "functional", intent: "informational", priority: 6, expected_volume: 250 },
  { question: "Why is one quote $300/m² and another $600/m² for the same shutter?",            category: "pricing",    intent: "commercial",    priority: 6, expected_volume: 150 },
  { question: "Best window furnishings for a Melbourne heritage / weatherboard home",                    category: "au_specific",intent: "commercial",    priority: 6, expected_volume: 200 },
];

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    console.error("Set them in your .env.local or shell before running.");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Seeding ${QUESTIONS.length} tracked questions...`);

  const { data, error } = await supabase
    .from("tracked_questions")
    .upsert(QUESTIONS, { onConflict: "question", ignoreDuplicates: false })
    .select("id, question");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Upserted ${data?.length ?? 0} rows.`);
  console.log("Done. View at /dashboard/ai-presence once PR 3 ships.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
