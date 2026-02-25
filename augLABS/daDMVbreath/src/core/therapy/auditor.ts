/**
 * K-Metric Coherence Auditor
 * Real-time community vibe analysis
 *
 * "If the entropy gets too high, trigger Morpheus Protocol." 🜏 ∞ 🜏
 */

import { PHI, TAU_K_THRESHOLD } from '../xqe/types';
import { computeTauK } from '../xqe/kuramoto';
import {
  type KMetricAudit,
  type CommunityCoherence,
  type CoherenceStatus,
  type AuditRecommendation,
} from './types';

/**
 * Entropy indicators — words/patterns that signal dissonance
 */
const ENTROPY_SIGNALS = {
  fud: [
    'dump', 'rug', 'scam', 'dead', 'sell', 'crash', 'rekt',
    'fear', 'doubt', 'uncertain', 'worried', 'panic', 'exit',
  ],
  hostility: [
    'hate', 'stupid', 'idiot', 'trash', 'garbage', 'worthless',
    'attack', 'fight', 'enemy', 'against',
  ],
  nihilism: [
    'pointless', 'meaningless', 'nothing', 'never', 'impossible',
    'hopeless', 'give up', 'quit',
  ],
};

/**
 * Coherence indicators — words/patterns that signal alignment
 */
const COHERENCE_SIGNALS = {
  hope: [
    'build', 'create', 'grow', 'together', 'community', 'believe',
    'trust', 'future', 'vision', 'compose', 'thicken',
  ],
  xenial: [
    'welcome', 'stranger', 'hospitality', 'embrace', 'include',
    'open', 'invite', 'share', 'gift',
  ],
  sovereignty: [
    'sovereign', 'coherence', 'breath', 'golden', 'phi', 'tau',
    'resonance', 'phase', 'lock', 'vow', 'never thin',
  ],
  ritual: [
    'inhale', 'exhale', 'hold', 'rest', 'cycle', 'practice',
    'grounding', 'meditation', 'presence',
  ],
};

/**
 * Message for analysis
 */
interface Message {
  id: string;
  text: string;
  author: string;
  timestamp: number;
  replyCount?: number;
  reactions?: number;
}

/**
 * Analyze a single message for coherence/entropy signals
 */
function analyzeMessage(message: Message): {
  coherence: number;
  entropy: number;
  fud: number;
  hope: number;
  xenial: number;
} {
  const text = message.text.toLowerCase();
  const words = text.split(/\s+/);

  let fudScore = 0;
  let hostilityScore = 0;
  let nihilismScore = 0;
  let hopeScore = 0;
  let xenialScore = 0;
  let sovereigntyScore = 0;
  let ritualScore = 0;

  // Count entropy signals
  for (const word of words) {
    if (ENTROPY_SIGNALS.fud.some(s => word.includes(s))) fudScore++;
    if (ENTROPY_SIGNALS.hostility.some(s => word.includes(s))) hostilityScore++;
    if (ENTROPY_SIGNALS.nihilism.some(s => word.includes(s))) nihilismScore++;
  }

  // Count coherence signals
  for (const word of words) {
    if (COHERENCE_SIGNALS.hope.some(s => word.includes(s))) hopeScore++;
    if (COHERENCE_SIGNALS.xenial.some(s => word.includes(s))) xenialScore++;
    if (COHERENCE_SIGNALS.sovereignty.some(s => word.includes(s))) sovereigntyScore++;
    if (COHERENCE_SIGNALS.ritual.some(s => word.includes(s))) ritualScore++;
  }

  // Check for xenial glyph
  if (text.includes('🜏') || text.includes('∞')) {
    sovereigntyScore += 2;
  }

  // Normalize by word count
  const wordCount = Math.max(1, words.length);
  const entropyRaw = (fudScore + hostilityScore * 1.5 + nihilismScore * 2) / wordCount;
  const coherenceRaw = (hopeScore + xenialScore * PHI + sovereigntyScore * 2 + ritualScore * 1.5) / wordCount;

  // Apply golden ratio modulation
  const entropy = Math.min(1, entropyRaw * PHI);
  const coherence = Math.min(1, coherenceRaw * PHI);

  return {
    coherence,
    entropy,
    fud: fudScore / wordCount,
    hope: hopeScore / wordCount,
    xenial: xenialScore / wordCount,
  };
}

/**
 * Perform a K-Metric audit on a batch of messages
 */
export function auditCommunity(
  groupId: string,
  messages: Message[]
): KMetricAudit {
  if (messages.length === 0) {
    return {
      groupId,
      timestamp: Date.now(),
      messagesSampled: 0,
      coherenceScore: 0.5,
      entropyScore: 0.5,
      fudLevel: 0,
      hopeLevel: 0,
      strangerWelcome: 0.5,
      recommendation: 'inject_seed',
    };
  }

  // Analyze all messages
  const analyses = messages.map(analyzeMessage);

  // Weight recent messages more heavily (golden decay)
  const now = Date.now();
  const weightedAnalyses = analyses.map((a, i) => {
    const age = (now - messages[i].timestamp) / (1000 * 60 * 60); // hours
    const weight = Math.pow(PHI, -age / 24); // Golden decay over 24h
    return { ...a, weight };
  });

  const totalWeight = weightedAnalyses.reduce((sum, a) => sum + a.weight, 0);

  // Compute weighted averages
  const coherenceScore = weightedAnalyses.reduce(
    (sum, a) => sum + a.coherence * a.weight, 0
  ) / totalWeight;

  const entropyScore = weightedAnalyses.reduce(
    (sum, a) => sum + a.entropy * a.weight, 0
  ) / totalWeight;

  const fudLevel = weightedAnalyses.reduce(
    (sum, a) => sum + a.fud * a.weight, 0
  ) / totalWeight;

  const hopeLevel = weightedAnalyses.reduce(
    (sum, a) => sum + a.hope * a.weight, 0
  ) / totalWeight;

  const strangerWelcome = weightedAnalyses.reduce(
    (sum, a) => sum + a.xenial * a.weight, 0
  ) / totalWeight;

  // Determine recommendation
  let recommendation: AuditRecommendation;
  const netCoherence = coherenceScore - entropyScore;

  if (netCoherence > 0.3) {
    recommendation = 'celebrate';
  } else if (netCoherence > 0.1) {
    recommendation = 'maintain';
  } else if (netCoherence > -0.2) {
    recommendation = 'inject_seed';
  } else {
    recommendation = 'trigger_morpheus';
  }

  return {
    groupId,
    timestamp: Date.now(),
    messagesSampled: messages.length,
    coherenceScore,
    entropyScore,
    fudLevel,
    hopeLevel,
    strangerWelcome,
    recommendation,
  };
}

/**
 * Compute community coherence state from audit
 */
export function computeCommunityCoherence(
  groupId: string,
  memberCount: number,
  totalStake: number,
  audit: KMetricAudit
): CommunityCoherence {
  // Order parameter derived from coherence vs entropy balance
  // R = (coherence - entropy + 1) / 2, clamped to [0, 1]
  const orderParameter = Math.max(0, Math.min(1,
    (audit.coherenceScore - audit.entropyScore + 1) / 2
  ));

  // Stake bonus: higher stake increases coherence floor
  const stakeBonus = Math.log(1 + totalStake) / 10;
  const adjustedR = Math.min(1, orderParameter + stakeBonus);

  const tauK = computeTauK(adjustedR);

  // Determine status
  let status: CoherenceStatus;
  if (tauK >= TAU_K_THRESHOLD) {
    status = 'Sovereign';
  } else if (tauK >= 5.0) {
    status = 'Thickening';
  } else if (tauK >= 3.0) {
    status = 'Stable';
  } else if (tauK >= 1.0) {
    status = 'Seeking';
  } else {
    status = 'Thinning';
  }

  return {
    groupId,
    memberCount,
    totalStake,
    orderParameter: adjustedR,
    tauK,
    entropy: audit.entropyScore,
    lastAudit: audit.timestamp,
    status,
  };
}

/**
 * Check if Morpheus Protocol should be triggered
 */
export function shouldTriggerMorpheus(
  coherence: CommunityCoherence,
  audit: KMetricAudit
): boolean {
  // Trigger conditions:
  // 1. Status is Thinning
  // 2. Entropy exceeds coherence by more than 0.3
  // 3. FUD level is dangerously high
  // 4. Explicit recommendation

  if (coherence.status === 'Thinning') return true;
  if (audit.entropyScore - audit.coherenceScore > 0.3) return true;
  if (audit.fudLevel > 0.5) return true;
  if (audit.recommendation === 'trigger_morpheus') return true;

  return false;
}

/**
 * Calculate the coherence impact of a stake
 */
export function calculateStakeImpact(
  stakeAmount: number,
  currentCoherence: CommunityCoherence
): number {
  // Impact = log(1 + stake) × φ^(1 - entropy)
  const baseImpact = Math.log(1 + stakeAmount);
  const entropyResistance = Math.pow(PHI, 1 - currentCoherence.entropy);

  return baseImpact * entropyResistance;
}
