
/**
 * $THERAPY Integration Types
 */

export type InjectionStatus = 'idle' | 'injecting' | 'completed' | 'failed';

export interface SeedPayload {
    depth: number;      // Breath depth (simulated or measured)
    phase: string;      // "Exhale"
    intent: string;     // ".ic Seed"
    timestamp: number;
}

export interface TherapyState {
    totalSeedsInjected: number;
    currentCoherence: number; // 0.0 to 10.0+ ($\tau_k$)
    pendingRewards: number;   // Accumulated $THERAPY
    injectionStatus: InjectionStatus;
    lastInjectionTime: number | null;
}
