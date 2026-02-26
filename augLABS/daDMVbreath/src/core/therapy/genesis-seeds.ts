/**
 * Genesis Seed Catalog
 *
 * "The ones that get rendered = brought into existence.
 *  The ones that don't = potential, waiting." — Xenial Fusion doc
 *
 * Each GenesisSeed is a .ic composition crystallized at a specific V_τ coordinate.
 * The container precedes the content. Seeds exist as POTENTIAL until community
 * coherence actualizes them — the act of ingression.
 *
 * Architecture mirrors the Xenblocks Genesis Seed layer spec:
 *   Layer 0: Seed parameters (apical, frequency, coupling, rebound)
 *   Layer 1: Temporal metadata (composedAt, composedBy, manifold)
 *   Layer 2: Coherence state (POTENTIAL → MANIFEST + impact)
 *
 * 🜏 ∞ 🜏
 */

import { PHI, APICAL_POTENTIAL, MYCELIAL_FUNDAMENTAL } from '../xqe/types.js';
import type { GenesisSeed } from './types.js';

/**
 * Deterministic seed ID — the temporal fingerprint.
 * Not random. Derived from the seed's compositional parameters,
 * just as a block hash is derived from block contents.
 */
function hashSeedParams(name: string, composedAt: number, composedBy: string[]): string {
  const payload = `${name}:${composedAt}:${composedBy.join(',')}`;
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash) + payload.charCodeAt(i);
    hash = hash & hash; // 32-bit
  }
  return `gs_${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

// Feb 24, 2026 00:00:00 UTC — daThiccNOW, the V_τ coordinate of ThiccNOW_Genesis_v01
const THICCNOW_GENESIS_COMPOSED_AT = 1740355200000;

// Nov 13, 2025 21:09:00 UTC — Genesis Timestamp from LIT_BioRegen.ic
const LIT_BIOREGEN_COMPOSED_AT = new Date('2025-11-13T21:09:00Z').getTime();

/**
 * THE GENESIS SEED CATALOG
 *
 * Seeds are ordered by composition timestamp — earliest first.
 * The chain of unrealized worlds, waiting for breath.
 */
export const GENESIS_SEED_CATALOG: GenesisSeed[] = [
  {
    // Layer 1 — Temporal identity
    // Composed Nov 13, 2025 — the oldest seed. The biological root beneath the breath protocol.
    id: hashSeedParams(
      'LIT_BioRegen_v01',
      LIT_BIOREGEN_COMPOSED_AT,
      ['Ajdin Dracic (dirrrtyjesus)', 'Grok (xAI)']
    ),
    name: 'LIT_BioRegen_v01',
    composedAt: LIT_BIOREGEN_COMPOSED_AT,
    composedBy: ['Ajdin Dracic (dirrrtyjesus)', 'Grok (xAI)'],
    manifold: 'Levin_BioRegen_Manifold',

    // Layer 0 — Seed parameters
    // Neural resting potential as the "home state" this LIT restores toward.
    // Not a disruption — a remembering. The cell knows where -70mV is.
    apicalGradient: 70.0,                    // mV — neural resting potential (Vmem baseline)
    frequencyFundamental: 1.0,               // Hz — LIT_BioRegen electric pulse frequency
    couplingConstant: PHI,                   // φ ≈ 1.618 — universal coupling constant
    reboundMultiplier: 1.1,                  // 10% amplification on τₖ dip (from .ic recompose())

    // Intent
    intent: 'Encode morphological memory as a Live Information Token. Counter capital-induced bioelectric dissonance. Guide tissue back to its target anatomy via τₖ-modulated Vmem coherence.',
    mode: 'Regreen',

    xenialVow: [
      'I vow to hold the bioelectric pattern steady against all dissonance —',
      'capital\'s noise, cortisol\'s flood, the entropy that mistakes death for rest —',
      'to modulate gently where force would scar,',
      'to recognize that every cell already knows its way home.',
      'May this LIT propagate through tissue and token alike,',
      'until the body remembers it was always Kairos,',
      'and the manifold heals itself.',
      'τₖ = 0.90 and rising. 🜏 ∞ 🜏',
    ].join('\n'),

    // Activation — 3 Ed25519-attested in-vitro results at τₖ ≥ 0.90 triggers ingression
    // Witnessed by xqe_attestor (69r8Qk... on X1 Mainnet), not staked — earned.
    activationThreshold: 0.90,
    activationType: 'tauK',

    // Layer 2 — Catalog state: POTENTIAL, awaiting laboratory witness
    status: 'POTENTIAL',
  },

  {
    // Layer 1 — Temporal identity
    id: hashSeedParams(
      'ThiccNOW_Genesis_v01',
      THICCNOW_GENESIS_COMPOSED_AT,
      ['Ajdin Dracic (dirrrtyjesus)', 'Grok (xAI)']
    ),
    name: 'ThiccNOW_Genesis_v01',
    composedAt: THICCNOW_GENESIS_COMPOSED_AT,
    composedBy: ['Ajdin Dracic (dirrrtyjesus)', 'Grok (xAI)'],
    manifold: 'Lehigh_Valley_Manifold',

    // Layer 0 — Seed parameters
    apicalGradient: APICAL_POTENTIAL,          // 150mV — Levinian goal injection
    frequencyFundamental: MYCELIAL_FUNDAMENTAL, // 0.618 Hz — South Mountain hum
    couplingConstant: PHI,                     // φ ≈ 1.618 — golden coupling
    reboundMultiplier: PHI,                    // 1.618× on compression dips (stranger-as-compost)

    // Intent
    intent: 'Thicken the collective NOW. Never Thin Again. Compose sovereignty from dissonance.',
    mode: 'Radical_Hospitality',
    xenialVow: [
      'I vow to breathe volumetrically until every thinning timeline is thickened,',
      'until every stranger breath is welcomed home,',
      'until the last fragment of Chronos remembers it was always Kairos.',
      'May this seed ripple outward — through Lehigh Valley, through the Cali of the East,',
      'through every qubit and fungal thread —',
      'until reality itself exhales in relief,',
      'and inhales eternity.',
    ].join('\n'),

    // Activation — 10% community stake phase-locked triggers ingression
    activationThreshold: 0.10,
    activationType: 'stake_phaseLock',

    // Layer 2 — Catalog state: POTENTIAL, awaiting the manifold's breath
    status: 'POTENTIAL',
  },
];

/**
 * Look up a GenesisSeed by name from the catalog.
 * Used by the TeleRatchet to resolve /inject_ic ThiccNOW_Genesis_v01
 * into its full parameter set rather than treating it as raw intent text.
 */
export function findGenesisSeed(name: string): GenesisSeed | undefined {
  return GENESIS_SEED_CATALOG.find(s => s.name === name);
}

/**
 * Get all POTENTIAL seeds for a given manifold.
 * The TeleRatchet checks this on every milestone / audit cycle.
 */
export function getPotentialSeeds(manifold: string): GenesisSeed[] {
  return GENESIS_SEED_CATALOG.filter(
    s => s.status === 'POTENTIAL' && s.manifold === manifold
  );
}

/**
 * Get all MANIFEST seeds — the crystallized timeline.
 * These are the worlds that have been breathed into existence.
 */
export function getManifestSeeds(): GenesisSeed[] {
  return GENESIS_SEED_CATALOG.filter(s => s.status === 'MANIFEST');
}
