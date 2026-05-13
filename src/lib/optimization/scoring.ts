import type { ScoringResult, Signal, SignalKey, SubScore, Weight } from "./types";
import { clamp01, normalize, SIGNAL_TARGETS } from "./normalize";

const SUB_SCORE_RANGE: Record<SubScore, number> = {
    discoverability: 25,
    crawlability: 15,
    engagement: 25,
    conversion: 35,
};

export function buildSignal(key: SignalKey, subScore: SubScore, value: number, note?: string): Signal {
    return {
        key,
        subScore,
        value,
        target: SIGNAL_TARGETS[key],
        normalized: normalize(key, value),
        note,
    };
}

/**
 * Composite scoring engine.
 * Each sub-score has a maximum contribution to the composite (25/15/25/35).
 * Within a sub-score, weights of its signals are summed and used to compute
 * the weighted average of their normalized values, then scaled to that
 * sub-score's range.
 */
export function scoreRun(signals: Signal[], weights: Weight[]): ScoringResult {
    const weightMap = new Map<SignalKey, Weight>();
    for (const w of weights) weightMap.set(w.signal_key as SignalKey, w);

    const buckets: Record<SubScore, { weighted: number; totalWeight: number }> = {
        discoverability: { weighted: 0, totalWeight: 0 },
        crawlability:   { weighted: 0, totalWeight: 0 },
        engagement:     { weighted: 0, totalWeight: 0 },
        conversion:     { weighted: 0, totalWeight: 0 },
    };

    for (const sig of signals) {
        const w = weightMap.get(sig.key);
        if (!w) continue;
        buckets[sig.subScore].weighted += clamp01(sig.normalized) * w.weight;
        buckets[sig.subScore].totalWeight += w.weight;
    }

    const subScores: Record<SubScore, number> = {
        discoverability: 0, crawlability: 0, engagement: 0, conversion: 0,
    };

    let composite = 0;

    (Object.keys(buckets) as SubScore[]).forEach((sub) => {
        const { weighted, totalWeight } = buckets[sub];
        const avg = totalWeight > 0 ? weighted / totalWeight : 0;     // 0..1
        const range = SUB_SCORE_RANGE[sub];
        const scaled = avg * range;                                    // 0..range
        subScores[sub] = Math.round((avg * 100) * 10) / 10;            // 0..100 for display
        composite += scaled;
    });

    const signalMap: Record<string, Signal> = {};
    for (const s of signals) signalMap[s.key] = s;

    return {
        composite: Math.round(composite * 10) / 10,
        subScores,
        signals: signalMap as Record<SignalKey, Signal>,
        weightsVersion: weights[0]?.version ?? 1,
    };
}
