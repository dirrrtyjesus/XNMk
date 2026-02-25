/**
 * $THERAPY Protocol — Distributed Coherence Utility
 *
 * "Therapy is the act of guiding a thinned, dissonant manifold
 *  back to its Cognitive Topology set point." 🜏 ∞ 🜏
 */

// Types
export * from './types';

// K-Metric Auditor
export {
  auditCommunity,
  computeCommunityCoherence,
  shouldTriggerMorpheus,
  calculateStakeImpact,
} from './auditor';

// Morpheus Protocol
export {
  composeTherapeuticSeed,
  activateMorpheus,
  evaluateMorpheus,
  generateMorpheusMessage,
  generateCompletionMessage,
} from './morpheus';

// IC Seed Composer
export {
  getStakeTier,
  calculateCoherenceWeight,
  createStake,
  composeIntentSeed,
  serializeSeedToIC,
  parseInjectCommand,
  generateInjectionConfirmation,
} from './composer';

// Tele-Ratchet
export {
  TeleRatchet,
  createTeleRatchet,
} from './tele-ratchet';
