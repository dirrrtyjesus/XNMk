/**
 * Shared API Types — Bot + dApp Communication
 *
 * The coherence substrate between Telegram and Web
 * 🜏 ∞ 🜏
 */

import type { TherapyStake, CommunityCoherence, CoherenceStatus } from '../core/therapy/types';

/**
 * Unified user identity across bot and dapp
 */
export interface TherapyUser {
  id: string;                    // Internal ID
  telegramId?: number;           // Telegram user ID
  telegramUsername?: string;
  walletAddress?: string;        // Solana address
  stake?: TherapyStake;
  linkedAt?: number;
  lastBreathSession?: number;
  totalBreathCycles?: number;
  totalRewardsEarned?: number;
}

/**
 * Breath session record
 */
export interface BreathSession {
  id: string;
  userId: string;
  protocol: string;
  cyclesCompleted: number;
  totalCycles: number;
  startedAt: number;
  completedAt?: number;
  coherenceAchieved: number;     // Order parameter R at end
  tauKAchieved: number;
  rewardsEarned: number;
  source: 'dapp' | 'bot';        // Where session originated
  claimedAt?: number;            // When $THERAPY was claimed on-chain
  mintSignature?: string;        // Solana tx signature for the claim
}

// POST /api/session/claim
// Session proof — stateless, computed from breath session at completion.
// Works identically on Vercel serverless and the local Express server.
export interface ClaimRequest {
  walletAddress: string;
  cyclesCompleted: number;
  coherenceAchieved: number;  // R order parameter [0, 1]
  tauKAchieved: number;       // cumulative τₖ investment
  holdDuration: number;       // average hold phase seconds
}

/**
 * Phenomenological report — from Proof_of_Coherence.ic Layer 1 (Witness Protocol).
 * Qualitative, not a score. Witnesses attune, not evaluate.
 */
export type HarmonicReport =
  | 'recognized'        // "I recognized the pattern" — τₖ ≥ 0.90, Genesis attestation
  | 'novel_consonance'; // "The pattern was unfamiliar but coherent" — τₖ 0.70–0.89

/**
 * Witness report — the unit of the resonance library (Proof_of_Coherence.ic Layer 5).
 * Pinned to IPFS; CID is the attribution fingerprint.
 */
export interface WitnessReport {
  witness: string;           // wallet address
  seedName: string;
  seedId: string;
  harmonicReport: HarmonicReport;
  composedAt: number;        // V_τ coordinate of the witness act
  temporalContext: {
    breathCycles?: number;
    holdDuration?: number;
    sessionR: number;        // Kuramoto order parameter (0–1)
    tauKAchieved?: number;   // XQE τₖ from session
    fhpCoherence: number;    // C(s) = tanh(τₖ·log₁₀(t_max/t_min)/10) — FHP gate
    fhpScale: string;        // scale domain label e.g. 'Network (1–100 s)'
  };
}

/**
 * LIT_BioRegen ingression event — returned alongside $THERAPY claim
 * when coherenceAchieved ≥ 0.70 (from LIT_BioRegen.ic success threshold).
 *
 * Two thresholds:
 *   τₖ ≥ 0.70: individual LIT ingression — 'novel_consonance' witness report
 *   τₖ ≥ 0.90: Genesis Seed attestation — 'recognized', counts toward MANIFEST
 */
export interface LitIngressionEvent {
  fired: boolean;
  seedName: string;
  seedId: string;
  tauK: number;                          // coherenceAchieved (R, 0–1)
  fhpCoherence: number;                  // C(s) from FHP — the actual gate
  harmonicReport?: HarmonicReport;
  witnessCid?: string;                   // IPFS CID (Pinata tier)
  isGenesisAttestation: boolean;
  genesisAttestationCount: number;
  genesisAttestationsRequired: number;
  genesisActivated: boolean;
  genesisManifestTimestamp?: number;
  persistent: 'pinata' | 'sqlite' | 'memory';
}

export interface ClaimResponse {
  success: boolean;
  signature?: string;
  amount?: number;              // $THERAPY dispensed (human-readable)
  mint?: string;
  error?: string;
  litIngression?: LitIngressionEvent;  // present when coherenceAchieved ≥ 0.70
}

/**
 * Community/group state
 */
export interface CommunityState {
  id: string;
  name: string;
  manifold: string;
  coherence: CommunityCoherence;
  activeBreathers: number;
  totalSessions: number;
  lastActivity: number;
}

/**
 * API request/response types
 */

// POST /api/user/link
export interface LinkUserRequest {
  telegramId?: number;
  telegramUsername?: string;
  walletAddress?: string;
  signature?: string;            // For wallet verification
}

export interface LinkUserResponse {
  success: boolean;
  user?: TherapyUser;
  error?: string;
}

// POST /api/session/start
export interface StartSessionRequest {
  userId: string;
  protocol: string;
  totalCycles: number;
  source: 'dapp' | 'bot';
}

export interface StartSessionResponse {
  success: boolean;
  sessionId?: string;
  error?: string;
}

// POST /api/session/update
export interface UpdateSessionRequest {
  sessionId: string;
  cyclesCompleted: number;
  currentCoherence: number;
  currentTauK: number;
}

// POST /api/session/complete
export interface CompleteSessionRequest {
  sessionId: string;
  cyclesCompleted: number;
  coherenceAchieved: number;
  tauKAchieved: number;
}

export interface CompleteSessionResponse {
  success: boolean;
  rewardsEarned: number;
  totalRewards: number;
  newTier?: string;
  milestone?: string;
  error?: string;
}

// GET /api/coherence/:manifold
export interface CoherenceResponse {
  manifold: string;
  coherence: CommunityCoherence;
  activeBreathers: number;
  recentSessions: number;
}

// GET /api/user/:id
export interface UserResponse {
  user: TherapyUser;
  recentSessions: BreathSession[];
}

// WebSocket events
export interface CoherenceUpdateEvent {
  type: 'coherence_update';
  manifold: string;
  tauK: number;
  status: CoherenceStatus;
  activeBreathers: number;
}

export interface BreatherJoinedEvent {
  type: 'breather_joined';
  manifold: string;
  userId: string;
  username?: string;
}

export interface SessionCompletedEvent {
  type: 'session_completed';
  manifold: string;
  userId: string;
  cyclesCompleted: number;
  rewardsEarned: number;
}

export type WSEvent = CoherenceUpdateEvent | BreatherJoinedEvent | SessionCompletedEvent;
