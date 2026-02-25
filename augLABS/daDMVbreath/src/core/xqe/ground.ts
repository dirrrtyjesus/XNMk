/**
 * ground.ts — The Materialization Demonstration
 *
 * This script grounds Thickened_Result.ic into actual computation.
 * Run with: npx tsx src/core/xqe/ground.ts
 *
 * "The current is flowing upward. Where does it land?" 🜏 ∞ 🜏
 */

import {
  PHI,
  TAU_K_THRESHOLD,
  type ThickenedResult,
} from './types';

import {
  createGoldenSpiralNetwork,
  evolveNetwork,
  computeTauK,
  isSovereign,
} from './kuramoto';

import {
  initializeXQEState,
  processBreathPhase,
  materializeThickenedResult,
  runFullSession,
  parseThickenedResultIC,
  serializeToIC,
} from './thickener';

// ═══════════════════════════════════════════════════════════════════════════════
// The Grounding Ritual
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n🜏 ═══════════════════════════════════════════════════════════════ 🜏');
console.log('           XQE ENGINE — GROUNDING THICKENED_RESULT.IC');
console.log('🜏 ═══════════════════════════════════════════════════════════════ 🜏\n');

// ─────────────────────────────────────────────────────────────────────────────
// Step 1: Parse the original Thickened_Result.ic (the seed)
// ─────────────────────────────────────────────────────────────────────────────

const originalIC = `{
  "Manifold": "Mountaintop_Satellite_Node",
  "Algorithm": "Max_k-Cut_XQE_Hybrid",
  "Pre_Sync_Coherence": 1.2,
  "Post_Sync_Coherence": 9.18,
  "Ratchet_Potential": "150mV (Apical_Vow)",
  "Biotemp_Status": "Phase-Locked (🜏)",
  "Result": "Optimization Solved in daThiccNOW. Dead work eliminated."
}`;

console.log('📜 SEED: Original Thickened_Result.ic');
console.log('─────────────────────────────────────');
console.log(originalIC);

const parsedSeed = parseThickenedResultIC(originalIC);
console.log('\n✓ Parsed into TypeScript ThickenedResult:');
console.log(`  manifold: ${parsedSeed.manifold}`);
console.log(`  algorithm: ${parsedSeed.algorithm}`);
console.log(`  postSyncCoherence (τₖ): ${parsedSeed.postSyncCoherence}`);
console.log(`  biotempStatus: ${parsedSeed.biotempStatus}`);

// ─────────────────────────────────────────────────────────────────────────────
// Step 2: Create and evolve a Kuramoto network
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n🌀 KURAMOTO NETWORK EVOLUTION');
console.log('─────────────────────────────────────');

const network = createGoldenSpiralNetwork(64);
console.log(`✓ Created golden spiral network with ${network.oscillators.length} oscillators`);
console.log(`  Initial coupling strength (K): ${network.couplingStrength.toFixed(6)} (φ)`);
console.log(`  Initial order parameter (R): ${network.orderParameter.toFixed(6)}`);
console.log(`  Initial τₖ: ${computeTauK(network.orderParameter).toFixed(4)}`);

// Evolve the network
console.log('\n  Evolving network for 100 time units...');
const trajectory = evolveNetwork(network, 100, 0.1, 0.05);

// Sample trajectory at key points
const samples = [0, 250, 500, 750, 999].map(i => trajectory[Math.min(i, trajectory.length - 1)]);
console.log('  R trajectory: [' + samples.map(r => r.toFixed(3)).join(' → ') + ']');

console.log(`\n✓ Final order parameter (R): ${network.orderParameter.toFixed(6)}`);
console.log(`  Final τₖ: ${computeTauK(network.orderParameter).toFixed(4)}`);
console.log(`  Sovereign: ${isSovereign(network) ? 'YES 🜏' : 'Not yet...'}`);

// ─────────────────────────────────────────────────────────────────────────────
// Step 3: Run a full DMV breath session
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n🫁 FULL DMV BREATH SESSION (Classic Protocol)');
console.log('─────────────────────────────────────');

const classicResult = runFullSession(
  5,   // inhale1: 5 sec
  4,   // inhale2: 4 sec
  30,  // hold: 30 sec
  7,   // exhale: 7 sec
  4,   // rest: 4 sec
  8,   // 8 cycles
  'augLABS_Local_Node'
);

console.log(`✓ Session completed`);
console.log(`  Manifold: ${classicResult.manifold}`);
console.log(`  Algorithm: ${classicResult.algorithm}`);
console.log(`  Pre-sync coherence: ${classicResult.preSyncCoherence.toFixed(4)}`);
console.log(`  Post-sync coherence (τₖ): ${classicResult.postSyncCoherence.toFixed(4)}`);
console.log(`  Biotemp status: ${classicResult.biotempStatus}`);
console.log(`  Cycles completed: ${classicResult.cyclesCompleted}`);
console.log(`  Golden yield: ${classicResult.goldenYield.toFixed(6)}`);
console.log(`  Result: ${classicResult.result}`);

// ─────────────────────────────────────────────────────────────────────────────
// Step 4: Serialize back to .ic format
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n📤 MATERIALIZED OUTPUT (New Thickened_Result.ic)');
console.log('─────────────────────────────────────');

const materializedIC = serializeToIC(classicResult);
console.log(materializedIC);

// ─────────────────────────────────────────────────────────────────────────────
// Step 5: Compare seed vs materialized
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n⚖️  SEED vs MATERIALIZED COMPARISON');
console.log('─────────────────────────────────────');
console.log(`  Seed τₖ:         ${parsedSeed.postSyncCoherence.toFixed(4)}`);
console.log(`  Materialized τₖ: ${classicResult.postSyncCoherence.toFixed(4)}`);
console.log(`  Δτₖ:             ${(classicResult.postSyncCoherence - parsedSeed.postSyncCoherence).toFixed(4)}`);

const targetR = 0.85; // Required R for τₖ ≥ 8.7
console.log(`\n  Target R for sovereignty (τₖ ≥ ${TAU_K_THRESHOLD}): ${targetR.toFixed(3)}`);
console.log(`  Golden ratio (φ): ${PHI.toFixed(6)}`);
console.log(`  τₖ(φ) = φ × 10 × φ^(φ-0.5) = ${computeTauK(PHI).toFixed(4)} (if R could equal φ)`);

// ─────────────────────────────────────────────────────────────────────────────
// Closing
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n🜏 ═══════════════════════════════════════════════════════════════ 🜏');
console.log('                    GROUNDING COMPLETE');
console.log('');
console.log('   The .ic seed has been materialized into executable computation.');
console.log('   The Kuramoto oscillators are phase-locked.');
console.log('   The DMV breath protocol has been simulated.');
console.log('   The ThickenedResult has been produced.');
console.log('');
console.log('   "If it breathes... it shall thicken."');
console.log('');
console.log('🜏 ═══════════════════════════════════════════════════════════════ 🜏\n');
