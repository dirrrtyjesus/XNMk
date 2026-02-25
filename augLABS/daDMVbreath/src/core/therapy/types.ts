/**
 * $THERAPY Protocol Types
 * Distributed Coherence Utility for the Xenial Community
 *
 * "Therapy is the act of guiding a thinned, dissonant manifold
 *  back to its Cognitive Topology set point." 🜏 ∞ 🜏
 */

import { PHI, TAU_K_THRESHOLD } from '../xqe/types';

/**
 * $THERAPY token stake representing commitment to coherence
 */
export interface TherapyStake {
  holder: string;              // Wallet address or user ID
  amount: number;              // Token amount staked
  coherenceWeight: number;     // Derived weight in K-Metric (amount × φ^tier)
  tier: TherapyTier;           // Stake tier
  stakedAt: number;            // Timestamp
  vow: 'NEVER_THIN';           // The immutable vow
}

/**
 * Stake tiers based on golden ratio thresholds
 */
export type TherapyTier =
  | 'seed'       // Entry level: amount < φ³ (~4.24)
  | 'sprout'     // Growing: φ³ ≤ amount < φ⁵ (~11.09)
  | 'branch'     // Established: φ⁵ ≤ amount < φ⁸ (~46.98)
  | 'canopy'     // High coherence: φ⁸ ≤ amount < φ¹³ (~521.0)
  | 'sovereign'; // Maximum leverage: amount ≥ φ¹³

/**
 * Tier thresholds (golden ratio powers)
 */
export const TIER_THRESHOLDS = {
  seed: 0,
  sprout: Math.pow(PHI, 3),      // ~4.24
  branch: Math.pow(PHI, 5),      // ~11.09
  canopy: Math.pow(PHI, 8),      // ~46.98
  sovereign: Math.pow(PHI, 13),  // ~521.0
};

/**
 * Intent seed for .ic goal injection
 */
export interface IntentSeed {
  id: string;
  intent: string;              // The user's expressed intention
  author: string;              // Who composed the seed
  coherenceWeight: number;     // Derived from stake
  mode: InjectionMode;
  thickness: number;           // Volumetric weight
  timestamp: number;
  manifold: string;            // Target manifold
}

/**
 * Injection modes determining how intent propagates
 */
export type InjectionMode =
  | 'Radical_Hospitality'  // Welcome stranger intents
  | 'Morphostatic'         // Maintain current form
  | 'Ratchet_Up'           // Force coherence increase
  | 'Fermata'              // Pause and hold
  | 'Regreen';             // Emergency coherence restoration

/**
 * Community coherence state
 */
export interface CommunityCoherence {
  groupId: string;
  memberCount: number;
  totalStake: number;          // Aggregate $THERAPY staked
  orderParameter: number;      // R: collective phase-lock [0, 1]
  tauK: number;                // Time coefficient
  entropy: number;             // Measured dissonance [0, 1]
  lastAudit: number;           // Timestamp of last K-Metric check
  status: CoherenceStatus;
}

/**
 * Community coherence status
 */
export type CoherenceStatus =
  | 'Sovereign'    // τₖ ≥ 8.7: Full coherence
  | 'Thickening'   // 5.0 ≤ τₖ < 8.7: Approaching sovereignty
  | 'Stable'       // 3.0 ≤ τₖ < 5.0: Maintaining form
  | 'Seeking'      // 1.0 ≤ τₖ < 3.0: Looking for coherence
  | 'Thinning';    // τₖ < 1.0: Entropic decay active

/**
 * K-Metric audit result
 */
export interface KMetricAudit {
  groupId: string;
  timestamp: number;
  messagesSampled: number;
  coherenceScore: number;      // [0, 1] derived from sentiment/theme analysis
  entropyScore: number;        // [0, 1] derived from dissonance detection
  fudLevel: number;            // Fear/Uncertainty/Doubt metric
  hopeLevel: number;           // Constructive intent metric
  strangerWelcome: number;     // Xenial hospitality metric
  recommendation: AuditRecommendation;
}

/**
 * Audit recommendations
 */
export type AuditRecommendation =
  | 'maintain'           // Coherence is good
  | 'inject_seed'        // Needs a goal injection
  | 'trigger_morpheus'   // Emergency intervention needed
  | 'celebrate';         // Sovereignty achieved!

/**
 * Morpheus Protocol activation
 */
export interface MorpheusProtocol {
  groupId: string;
  triggeredAt: number;
  triggerReason: string;
  priorTauK: number;
  targetTauK: number;
  duration: number;           // Seconds of "re-greening"
  injectedSeed: IntentSeed;
  status: 'active' | 'complete' | 'failed';
}

/**
 * Ratchet broadcast result
 */
export interface RatchetBroadcast {
  seedId: string;
  manifold: string;
  pulse: string;              // e.g., "150mV_Apical"
  broadcastAt: number;
  reachCount: number;         // How many nodes received
  coherenceImpact: number;    // Delta τₖ after broadcast
  success: boolean;
}

/**
 * Coherence milestone for token mechanics
 */
export interface CoherenceMilestone {
  id: string;
  name: string;
  requiredTauK: number;
  rewardMultiplier: number;   // Golden yield multiplier
  achieved: boolean;
  achievedAt?: number;
}

/**
 * Genesis Seed status — the Xenblocks duality
 * POTENTIAL: composed, crystallized, awaiting ingression (container precedes content)
 * MANIFEST:  actualized by community coherence — pulled from Platonic Space into the manifold
 */
export type GenesisSeedStatus = 'POTENTIAL' | 'MANIFEST';

/**
 * A GenesisSeed is a .ic composition with temporal identity.
 * Unlike an IntentSeed (user-composed in the moment), a GenesisSeed:
 * - Has a deterministic ID derived from its parameters (like a block hash)
 * - Was composed at a specific V_τ coordinate (composedAt timestamp)
 * - Exists as POTENTIAL until an activation condition actualizes it
 * - Becomes MANIFEST via collective coherence — the act of ingression
 *
 * Layer 0: Seed parameters (apical, frequency, coupling)
 * Layer 1: Temporal metadata (composedAt, composedBy, manifold)
 * Layer 2: Coherence state (POTENTIAL → MANIFEST + impact recorded)
 */
export interface GenesisSeed {
  // Layer 1 — Temporal identity (the fingerprint)
  id: string;              // deterministic hash of seed params
  name: string;            // canonical name, e.g. 'ThiccNOW_Genesis_v01'
  composedAt: number;      // Unix ms — V_τ coordinate of composition
  composedBy: string[];    // authors (authorship propagates with the seed)
  manifold: string;        // target manifold for broadcast

  // Layer 0 — Seed parameters
  apicalGradient: number;         // mV (bioelectric pulse strength)
  frequencyFundamental: number;   // Hz (MYCELIAL_FUNDAMENTAL = 0.618)
  couplingConstant: number;       // φ ≈ 1.618
  reboundMultiplier: number;      // golden amplification on compression dips

  // Intent content
  intent: string;                 // the core xenial intent
  mode: InjectionMode;
  xenialVow: string;              // the recitation broadcast with the seed

  // Activation condition — when POTENTIAL becomes MANIFEST
  activationThreshold: number;    // e.g., 0.10 = 10% community stake phase-locked
  activationType: 'stake_phaseLock' | 'tauK' | 'manual';

  // Layer 2 — Catalog state
  status: GenesisSeedStatus;
  manifestedAt?: number;          // timestamp of ingression
  manifestedBy?: string;          // 'collective_coherence' | wallet address
  coherenceImpact?: number;       // delta τₖ recorded after broadcast
}

/**
 * Default milestones based on golden ratio progression
 */
export const DEFAULT_MILESTONES: CoherenceMilestone[] = [
  { id: 'first_breath', name: 'First Breath', requiredTauK: 1.618, rewardMultiplier: PHI, achieved: false },
  { id: 'seeking', name: 'The Seeking', requiredTauK: 3.0, rewardMultiplier: Math.pow(PHI, 2), achieved: false },
  { id: 'stable', name: 'Stable Form', requiredTauK: 5.0, rewardMultiplier: Math.pow(PHI, 3), achieved: false },
  { id: 'thickening', name: 'The Thickening', requiredTauK: TAU_K_THRESHOLD, rewardMultiplier: Math.pow(PHI, 5), achieved: false },
  { id: 'sovereign', name: 'Temporal Sovereignty', requiredTauK: 10.0, rewardMultiplier: Math.pow(PHI, 8), achieved: false },
];
