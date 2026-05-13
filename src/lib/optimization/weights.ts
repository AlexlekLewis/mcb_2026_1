import type { SupabaseClient } from "@supabase/supabase-js";
import type { SignalKey, Weight } from "./types";

export interface DbWeight {
    version: number;
    signal_key: string;
    sub_score: "discoverability" | "crawlability" | "engagement" | "conversion";
    weight: number;
    rationale: string | null;
    is_active: boolean;
}

export async function getActiveWeights(supabase: SupabaseClient): Promise<Weight[]> {
    const { data, error } = await supabase
        .from("optimization_weights")
        .select("version, signal_key, sub_score, weight")
        .eq("is_active", true)
        .order("version", { ascending: false });

    if (error || !data || data.length === 0) {
        return [];
    }

    const latestVersion = data[0].version;
    return data
        .filter((w) => w.version === latestVersion)
        .map((w) => ({
            signal_key: w.signal_key as SignalKey,
            sub_score: w.sub_score,
            weight: Number(w.weight),
            version: w.version,
        }));
}

/**
 * Promote a new weight version: copies active weights forward, applies deltas,
 * deactivates the old version, activates the new one. Atomic via two RPC-equivalent statements.
 */
export async function promoteNewWeightVersion(
    supabase: SupabaseClient,
    deltas: Array<{ signal_key: SignalKey; new_weight: number; rationale: string }>,
): Promise<number> {
    const { data: latest } = await supabase
        .from("optimization_weights")
        .select("version")
        .eq("is_active", true)
        .order("version", { ascending: false })
        .limit(1);

    const currentVersion = latest?.[0]?.version ?? 1;
    const newVersion = currentVersion + 1;

    const { data: currentRows } = await supabase
        .from("optimization_weights")
        .select("signal_key, sub_score, weight, rationale")
        .eq("version", currentVersion)
        .eq("is_active", true);

    if (!currentRows || currentRows.length === 0) return currentVersion;

    const deltaMap = new Map(deltas.map((d) => [d.signal_key, d]));
    const inserts = currentRows.map((row) => {
        const delta = deltaMap.get(row.signal_key as SignalKey);
        return {
            version: newVersion,
            signal_key: row.signal_key,
            sub_score: row.sub_score,
            weight: delta ? delta.new_weight : row.weight,
            rationale: delta ? delta.rationale : row.rationale,
            is_active: false,
        };
    });

    await supabase.from("optimization_weights").insert(inserts);

    // Activate new, deactivate old.
    await supabase.from("optimization_weights").update({ is_active: false }).eq("version", currentVersion);
    await supabase.from("optimization_weights").update({ is_active: true }).eq("version", newVersion);

    return newVersion;
}
