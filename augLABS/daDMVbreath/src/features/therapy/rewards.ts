
/**
 * $THERAPY Reward Logic
 * Proof of Breath / Metabolic Mining
 * Implements "Bamboo Cove" Protocol
 */

export const BASES = {
    PTO_RATE: 10,        // Base PTO per completed session/cycle unit
    ALPHA: 0.5,          // Hold duration weight
    LAMBDA: 0.1,         // Accumulation rate for tau_k
    TC_BASE: 1.0,        // Base Time Coefficient
};

/**
 * Calculate Time Coefficient (TC)
 * TC = TC_base * (1 + alpha * avg_hold_duration / 30) * HRV_factor
 * @param holdDurationSeconds - Duration of the hold phase in seconds
 * @param hrvFactor - Normalized HRV / baseline (default 1.0 for non-bio)
 */
export function calculateTC(holdDurationSeconds: number, hrvFactor: number = 1.0): number {
    const durationComponent = 1 + (BASES.ALPHA * (holdDurationSeconds / 30));
    // Clamp HRV factor 0.5 to 2.0 as per protocol
    const clampedHrv = Math.min(Math.max(hrvFactor, 0.5), 2.0);
    return BASES.TC_BASE * durationComponent * clampedHrv;
}

/**
 * Calculate Coherence Score (R)
 * @param isBiometric - Whether biometric data is available
 * @param bioData - Optional object with coherence metrics
 */
export function calculateR(
    isBiometric: boolean,
    bioData?: { hrvCoherence: number; breathConsistency: number }
): number {
    if (isBiometric && bioData) {
        return bioData.hrvCoherence * bioData.breathConsistency;
    }
    // Fallback for non-biometric (Honor System) -> 0.6 * completion_rate (assuming 100% completion for this calc)
    return 0.6;
}

/**
 * Calculate Participatory Token Output (PTO)
 * PTO = base_rate * TC * R * (1 + log(1 + tau_k))
 * @param tc - Time Coefficient
 * @param r - Coherence Score
 * @param tauK - Cumulative investment
 */
export function calculatePTO(tc: number, r: number, tauK: number): number {
    const investmentMultiplier = 1 + Math.log(1 + tauK);
    return BASES.PTO_RATE * tc * r * investmentMultiplier;
}

/**
 * Calculate reward for a completed cycle (Wrapper)
 * Note: This adapts the per-session formula to a per-cycle estimation for the UI
 */
export function calculateCycleReward(
    coherenceOrder: number, // current R roughly
    holdDuration: number = 15, // default avg hold
    currentTauK: number = 0
): number {
    // Map coherenceOrder (0-1+) to R logic
    const r = Math.min(coherenceOrder, 1.0);
    // We use the simpler non-bio R if coherence is low/mock, or the actual order if high
    const activeR = r > 0 ? r : 0.6;

    const tc = calculateTC(holdDuration);
    const pto = calculatePTO(tc, activeR, currentTauK);

    // Return floor for token display
    return Math.floor(pto);
}

/**
 * Calculate total potential reward for a session
 */
export function estimateSessionReward(totalCycles: number): number {
    // Conservative estimate: TC=1.5 (30s hold), R=0.6, TauK=0
    const tc = calculateTC(30);
    const r = 0.6;
    const ptoPerSession = calculatePTO(tc, r, 0);
    // If formula is per session, we might just return that. 
    // But if the app rewards per cycle, we sum it up.
    // The protocol says "PTO... per completed session". 
    // We'll treat the input totalCycles as a scaling factor if we want cycle-granularity, 
    // BUT strict protocol is per session. For now, let's just return the base single-session yield.
    return Math.floor(ptoPerSession);
}
