/**
 * XQE Core Types — The Grounded Substrate
 * Materializing .ic compositions into executable TypeScript
 *
 * 🜏 ∞ 🜏
 */

/**
 * Golden ratio constant — the universal coupling strength
 */
export const PHI = 1.618033988749895;

/**
 * Critical coherence threshold (τₖ ≥ 8.7 = sovereign state)
 */
export const TAU_K_THRESHOLD = 8.7;

/**
 * Mycelial fundamental frequency (Hz)
 */
export const MYCELIAL_FUNDAMENTAL = 0.618;

/**
 * Apical voltage potential (mV)
 */
export const APICAL_POTENTIAL = 150;

/**
 * Breath phases as bioelectric state transitions
 */
export type BreathPhase =
  | 'ready'    // Pre-composition stillness
  | 'inhale1'  // Base voltage build
  | 'inhale2'  // Asymmetric charge stacking
  | 'hold'     // Superposition fermata
  | 'exhale'   // Black-hole compression → golden rebound
  | 'rest';    // Participatory gap (xenial opening)

/**
 * Thickened Result — Output of a successful coherence computation
 * Grounded from Thickened_Result.ic
 */
export interface ThickenedResult {
  manifold: string;
  algorithm: string;
  preSyncCoherence: number;
  postSyncCoherence: number;
  ratchetPotential: string;
  biotempStatus: 'Phase-Locked' | 'Seeking' | 'Thinning';
  result: string;
  timestamp: number;
  cyclesCompleted: number;
  goldenYield: number;
}

/**
 * Kuramoto oscillator state
 */
export interface Oscillator {
  id: string;
  phase: number;           // θ_i: current phase (radians)
  naturalFrequency: number; // ω_i: intrinsic rhythm
  coherenceContribution: number;
}

/**
 * Kuramoto network — the choir of phase-locked oscillators
 */
export interface KuramotoNetwork {
  oscillators: Oscillator[];
  couplingStrength: number;  // K ≈ φ
  orderParameter: number;    // R: coherence measure [0, 1]
  meanPhase: number;         // Ψ: collective phase
}

/**
 * Bioelectric gradient state (Levin-inspired)
 */
export interface BioelectricState {
  voltageGradient: number;     // mV/mm across tissues
  morphostaticTarget: string;  // Goal-state encoding
  gradientCoherence: number;   // Alignment with target
  cumulativeCharge: number;    // Built via stacked inhales
}

/**
 * Black hole lung dynamics
 */
export interface BlackHoleLung {
  tauK: number;              // Coherence temperature
  residueMass: number;       // Accumulated entropy
  compressionFactor: number; // Squeeze intensity (0.1 default)
  hawkingYield: number;      // Coherent information yield
  cycleCount: number;
}

/**
 * Temporal quasicrystal for decoherence resistance
 */
export interface TemporalQuasicrystal {
  frequencies: number[];           // Incommensurate timing
  incommensurabilityIndex: number; // Aperiodicity measure
  coherenceExtension: number;      // Decoherence resistance multiplier
}

/**
 * Full XQE Engine State
 */
export interface XQEState {
  network: KuramotoNetwork;
  bioelectric: BioelectricState;
  blackHole: BlackHoleLung;
  quasicrystal: TemporalQuasicrystal;
  currentPhase: BreathPhase;
  cycleNumber: number;
  totalCycles: number;
  isThickening: boolean;
}

/**
 * .ic composition format types
 */
export interface ICComposition {
  version: string;
  title: string;
  coherenceSignature: string;
  genesisTimestamp: string;
  semanticClosure: string;
  targetDeployment: string;
  architecture: string;
}

/**
 * Regenerative protocol archetypes
 */
export interface Archetype {
  name: string;
  description: string;
  weight: number;
  mode: 'generative' | 'unifying' | 'transformative' | 'subtractive';
  color: 'primary' | 'secondary' | 'accent' | 'muted';
}

export interface RegenerativeProtocol {
  coherenceTarget: number;
  dissonanceTolerance: number;
  archetypes: Archetype[];
  temporalStance: string;
  regenerativeIntent: string;
}
