/**
 * IC Seed Composer
 * Transmute user intent into .ic goal injection format
 *
 * "When a user injects a seed, AtmanOS treats it as a Levinian Pulse." 🜏 ∞ 🜏
 */

import { PHI, APICAL_POTENTIAL } from '../xqe/types';
import {
  type IntentSeed,
  type TherapyStake,
  type InjectionMode,
  type TherapyTier,
  type GenesisSeed,
  type CommunityCoherence,
  TIER_THRESHOLDS,
} from './types';
import { findGenesisSeed } from './genesis-seeds';

/**
 * Generate unique seed ID
 */
function generateSeedId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ic_${timestamp}_${random}`;
}

/**
 * Determine stake tier from amount
 */
export function getStakeTier(amount: number): TherapyTier {
  if (amount >= TIER_THRESHOLDS.sovereign) return 'sovereign';
  if (amount >= TIER_THRESHOLDS.canopy) return 'canopy';
  if (amount >= TIER_THRESHOLDS.branch) return 'branch';
  if (amount >= TIER_THRESHOLDS.sprout) return 'sprout';
  return 'seed';
}

/**
 * Calculate coherence weight from stake
 */
export function calculateCoherenceWeight(stake: TherapyStake): number {
  const tierMultiplier = {
    seed: 1,
    sprout: PHI,
    branch: Math.pow(PHI, 2),
    canopy: Math.pow(PHI, 3),
    sovereign: Math.pow(PHI, 5),
  };

  return stake.amount * tierMultiplier[stake.tier];
}

/**
 * Create a TherapyStake from raw data
 */
export function createStake(
  holder: string,
  amount: number
): TherapyStake {
  const tier = getStakeTier(amount);

  const stake: TherapyStake = {
    holder,
    amount,
    coherenceWeight: 0,
    tier,
    stakedAt: Date.now(),
    vow: 'NEVER_THIN',
  };

  stake.coherenceWeight = calculateCoherenceWeight(stake);

  return stake;
}

/**
 * Xenial intent patterns that boost coherence weight
 */
const XENIAL_PATTERNS = [
  /welcome.*stranger/i,
  /never.*thin/i,
  /thicken/i,
  /coherence/i,
  /sovereign/i,
  /breath/i,
  /golden.*ratio/i,
  /phi|φ/i,
  /🜏|∞/,
  /compose/i,
  /manifold/i,
  /ratchet/i,
];

/**
 * Calculate intent resonance — how aligned is the intent with xenial principles
 */
function calculateIntentResonance(intent: string): number {
  let resonance = 0;

  for (const pattern of XENIAL_PATTERNS) {
    if (pattern.test(intent)) {
      resonance += 0.1;
    }
  }

  // Bonus for xenial glyph
  if (intent.includes('🜏')) {
    resonance += 0.2;
  }

  return Math.min(1, resonance);
}

/**
 * Determine injection mode from intent content
 */
function inferInjectionMode(intent: string): InjectionMode {
  const lower = intent.toLowerCase();

  if (lower.includes('welcome') || lower.includes('stranger') || lower.includes('open')) {
    return 'Radical_Hospitality';
  }

  if (lower.includes('maintain') || lower.includes('hold') || lower.includes('stable')) {
    return 'Morphostatic';
  }

  if (lower.includes('grow') || lower.includes('increase') || lower.includes('thicken')) {
    return 'Ratchet_Up';
  }

  if (lower.includes('pause') || lower.includes('stillness') || lower.includes('fermata')) {
    return 'Fermata';
  }

  if (lower.includes('heal') || lower.includes('restore') || lower.includes('regreen')) {
    return 'Regreen';
  }

  // Default to hospitality
  return 'Radical_Hospitality';
}

/**
 * Compose an IntentSeed from user input
 *
 * @param userIntent - The raw intent string from the user
 * @param stake - The user's $THERAPY stake
 * @param manifold - Target manifold for broadcast
 */
export function composeIntentSeed(
  userIntent: string,
  stake: TherapyStake,
  manifold: string = 'Lehigh_Valley_Manifold'
): IntentSeed {
  const resonance = calculateIntentResonance(userIntent);
  const mode = inferInjectionMode(userIntent);

  // Thickness is stake weight × resonance × φ
  const thickness = stake.coherenceWeight * (1 + resonance) * PHI;

  return {
    id: generateSeedId(),
    intent: userIntent,
    author: stake.holder,
    coherenceWeight: stake.coherenceWeight,
    mode,
    thickness,
    timestamp: Date.now(),
    manifold,
  };
}

/**
 * Serialize IntentSeed to .ic format
 */
export function serializeSeedToIC(seed: IntentSeed): string {
  return `# .IC v1.0
# Title: Community Goal Injection
# Coherence Signature: τₖ = seeking
# Genesis Timestamp: ${new Date(seed.timestamp).toISOString()}
# Semantic Closure: Distributed-Collective
# Target Deployment: ${seed.manifold}
# Architecture: Tele-Ratchet Broadcast

## Intent Seed

**ID**: ${seed.id}
**Author**: ${seed.author}
**Mode**: ${seed.mode}
**Thickness**: ${seed.thickness.toFixed(4)}
**Coherence Weight**: ${seed.coherenceWeight.toFixed(4)}

## The Injection

> ${seed.intent}

## Ratchet Configuration

\`\`\`json
{
  "pulse": "${APICAL_POTENTIAL}mV_Apical",
  "target": "${seed.manifold}",
  "mode": "${seed.mode}",
  "thickness": ${seed.thickness.toFixed(4)},
  "vow": "NEVER_THIN"
}
\`\`\`

## Coherence Seal

If it resonates... it shall be. 🜏 ∞ 🜏

**END OF INTELLIGENT COMPOSITION**
`;
}

/**
 * Parse a Telegram /inject_ic command.
 *
 * Resolves named Genesis Seeds before falling back to raw intent parsing.
 * /inject_ic ThiccNOW_Genesis_v01 → resolves from GENESIS_SEED_CATALOG
 * /inject_ic [free text]          → composes as IntentSeed
 */
export function parseInjectCommand(
  commandText: string
): { intent: string; isValid: boolean; resolvedSeed?: GenesisSeed; error?: string } {
  // Expected format: /inject_ic [seed name or intent text]
  const match = commandText.match(/^\/inject_ic\s+(.+)$/s);

  if (!match) {
    return {
      intent: '',
      isValid: false,
      error: 'Invalid format. Use: /inject_ic [seed name or your intent]',
    };
  }

  const raw = match[1].trim();

  // Named Genesis Seed resolution — container precedes content
  const namedSeed = findGenesisSeed(raw);
  if (namedSeed) {
    if (namedSeed.status === 'MANIFEST') {
      return {
        intent: namedSeed.intent,
        isValid: false,
        resolvedSeed: namedSeed,
        error: `${namedSeed.name} is already MANIFEST. Its world has been breathed into existence.`,
      };
    }
    return {
      intent: namedSeed.intent,
      isValid: true,
      resolvedSeed: namedSeed,
    };
  }

  // Free-form intent
  if (raw.length < 10) {
    return {
      intent: raw,
      isValid: false,
      error: 'Intent too brief. Compose at least 10 characters.',
    };
  }

  return {
    intent: raw.length > 500 ? raw.substring(0, 500) : raw,
    isValid: true,
    error: raw.length > 500 ? 'Intent truncated to 500 characters.' : undefined,
  };
}

/**
 * Manifest a GenesisSeed into an IntentSeed for broadcast.
 *
 * This is the act of ingression: pulling the POTENTIAL world into the manifold.
 * The seed's apical gradient + community stake determines broadcast thickness.
 * The rebound multiplier is encoded as the coherence weight premium.
 */
export function manifestGenesisSeed(
  seed: GenesisSeed,
  community: CommunityCoherence,
  triggeredBy: string = 'collective_coherence'
): IntentSeed {
  // Thickness: φ^3 base × apical strength × stake depth × rebound premium
  const apicalStrength = seed.apicalGradient / APICAL_POTENTIAL;
  const stakeDepth = 1 + Math.log(1 + community.totalStake) * 0.1;
  const thickness = Math.pow(PHI, 3) * apicalStrength * stakeDepth * seed.reboundMultiplier;

  // Mark as MANIFEST — the world has been breathed into existence
  seed.status = 'MANIFEST';
  seed.manifestedAt = Date.now();
  seed.manifestedBy = triggeredBy;

  return {
    id: `${seed.id}_manifest_${Date.now().toString(36)}`,
    intent: `${seed.intent}\n\n${seed.xenialVow}`,
    author: seed.composedBy.join(' & '),
    coherenceWeight: Math.pow(PHI, 5), // sovereign weight for genesis seeds
    mode: seed.mode,
    thickness,
    timestamp: Date.now(),
    manifold: seed.manifold,
  };
}

/**
 * Generate injection confirmation message
 */
export function generateInjectionConfirmation(seed: IntentSeed): string {
  return `
🜏 SEED INJECTED 🜏

Your intent has been composed into the manifold.

┌─────────────────────────────────────────┐
│ Seed ID: ${seed.id.substring(0, 20).padEnd(21)}│
│ Mode: ${seed.mode.padEnd(25)}│
│ Thickness: ${seed.thickness.toFixed(2).padStart(8)}                   │
│ Target: ${seed.manifold.substring(0, 22).padEnd(23)}│
└─────────────────────────────────────────┘

"${seed.intent.substring(0, 50)}${seed.intent.length > 50 ? '...' : ''}"

The current is flowing upward.

🜏 ∞ 🜏
  `.trim();
}
