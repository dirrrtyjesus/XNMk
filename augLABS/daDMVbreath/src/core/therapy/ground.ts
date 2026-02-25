/**
 * $THERAPY Protocol Grounding Demonstration
 *
 * Run with: npx tsx src/core/therapy/ground.ts
 *
 * "The group becomes a Collective Bioelectric Organism." 🜏 ∞ 🜏
 */

import {
  createTeleRatchet,
  createStake,
  auditCommunity,
  composeIntentSeed,
  serializeSeedToIC,
  activateMorpheus,
  generateMorpheusMessage,
  TIER_THRESHOLDS,
  PHI,
} from './index';

// ═══════════════════════════════════════════════════════════════════════════════
// The $THERAPY Grounding Ritual
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n🜏 ═══════════════════════════════════════════════════════════════ 🜏');
console.log('           $THERAPY PROTOCOL — DISTRIBUTED COHERENCE');
console.log('🜏 ═══════════════════════════════════════════════════════════════ 🜏\n');

// ─────────────────────────────────────────────────────────────────────────────
// Step 1: Initialize the Tele-Ratchet
// ─────────────────────────────────────────────────────────────────────────────

console.log('📡 INITIALIZING TELE-RATCHET');
console.log('─────────────────────────────────────');

const ratchet = createTeleRatchet('Lehigh_Valley_Manifold');
const groupId = 'xenial_therapy_community';

console.log(`✓ Tele-Ratchet active for manifold: Lehigh_Valley_Manifold`);
console.log(`✓ Community group: ${groupId}`);

// ─────────────────────────────────────────────────────────────────────────────
// Step 2: Register $THERAPY stakes
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n💎 REGISTERING $THERAPY STAKES');
console.log('─────────────────────────────────────');

console.log('\nTier thresholds (golden ratio powers):');
console.log(`  seed:      < ${TIER_THRESHOLDS.sprout.toFixed(2)}`);
console.log(`  sprout:    ${TIER_THRESHOLDS.sprout.toFixed(2)} - ${TIER_THRESHOLDS.branch.toFixed(2)}`);
console.log(`  branch:    ${TIER_THRESHOLDS.branch.toFixed(2)} - ${TIER_THRESHOLDS.canopy.toFixed(2)}`);
console.log(`  canopy:    ${TIER_THRESHOLDS.canopy.toFixed(2)} - ${TIER_THRESHOLDS.sovereign.toFixed(2)}`);
console.log(`  sovereign: ≥ ${TIER_THRESHOLDS.sovereign.toFixed(2)}`);

const stakes = [
  ratchet.registerStake(groupId, 'alice', 50),
  ratchet.registerStake(groupId, 'bob', 15),
  ratchet.registerStake(groupId, 'carol', 5),
  ratchet.registerStake(groupId, 'dave', 100),
  ratchet.registerStake(groupId, 'eve', 600),
];

console.log('\nRegistered stakes:');
for (const stake of stakes) {
  console.log(`  ${stake.holder}: ${stake.amount} $THERAPY (${stake.tier}) → weight: ${stake.coherenceWeight.toFixed(2)}`);
}

const totalStake = stakes.reduce((sum, s) => sum + s.amount, 0);
console.log(`\n✓ Total community stake: ${totalStake} $THERAPY`);

// ─────────────────────────────────────────────────────────────────────────────
// Step 3: Audit community messages
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n👁️ K-METRIC AUDIT — COMMUNITY VIBE ANALYSIS');
console.log('─────────────────────────────────────');

// Simulate community messages
const messages = [
  { id: '1', text: 'gm! ready to thicken the manifold today 🜏', author: 'alice', timestamp: Date.now() - 1000 },
  { id: '2', text: 'welcome to all the strangers joining us', author: 'bob', timestamp: Date.now() - 2000 },
  { id: '3', text: 'the breath protocol is working, I feel the coherence', author: 'carol', timestamp: Date.now() - 3000 },
  { id: '4', text: 'we compose together, we never thin again', author: 'dave', timestamp: Date.now() - 4000 },
  { id: '5', text: 'the golden ratio guides us all 🜏 ∞ 🜏', author: 'eve', timestamp: Date.now() - 5000 },
];

console.log('\nSampled messages:');
for (const msg of messages) {
  console.log(`  [${msg.author}]: "${msg.text.substring(0, 40)}..."`);
}

const audit = ratchet.auditCommunityVibe(groupId, messages);

console.log('\n✓ Audit complete:');
console.log(`  Messages sampled: ${audit.messagesSampled}`);
console.log(`  Coherence score: ${audit.coherenceScore.toFixed(4)}`);
console.log(`  Entropy score: ${audit.entropyScore.toFixed(4)}`);
console.log(`  FUD level: ${audit.fudLevel.toFixed(4)}`);
console.log(`  Hope level: ${audit.hopeLevel.toFixed(4)}`);
console.log(`  Stranger welcome: ${audit.strangerWelcome.toFixed(4)}`);
console.log(`  Recommendation: ${audit.recommendation}`);

// ─────────────────────────────────────────────────────────────────────────────
// Step 4: Check community coherence
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n⚖️ COMMUNITY COHERENCE STATE');
console.log('─────────────────────────────────────');

const coherence = ratchet.getCoherence(groupId);

console.log(`  Order Parameter (R): ${coherence.orderParameter.toFixed(4)}`);
console.log(`  Time Coefficient (τₖ): ${coherence.tauK.toFixed(2)}`);
console.log(`  Entropy: ${coherence.entropy.toFixed(4)}`);
console.log(`  Status: ${coherence.status}`);

// ─────────────────────────────────────────────────────────────────────────────
// Step 5: Process an /inject_ic command
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n🌱 PROCESSING /inject_ic COMMAND');
console.log('─────────────────────────────────────');

const injectionCommand = '/inject_ic We welcome all seekers to the xenial collective. May we thicken together and never thin again. The current flows upward. 🜏 ∞ 🜏';

console.log(`Command: ${injectionCommand.substring(0, 60)}...`);

const result = ratchet.processInjection(groupId, 'eve', injectionCommand);

if (result.success) {
  console.log('\n✓ Injection successful!');
  console.log(`  Seed ID: ${result.seed!.id}`);
  console.log(`  Mode: ${result.seed!.mode}`);
  console.log(`  Thickness: ${result.seed!.thickness.toFixed(4)}`);
  console.log(`  Broadcast reach: ${result.broadcast!.reachCount}`);
  console.log(`  Coherence impact: +${result.broadcast!.coherenceImpact.toFixed(4)} τₖ`);
} else {
  console.log(`\n✗ Injection failed: ${result.message}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 6: Generate .ic format
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n📜 SERIALIZED .IC SEED');
console.log('─────────────────────────────────────');

if (result.seed) {
  const icFormat = serializeSeedToIC(result.seed);
  console.log(icFormat.substring(0, 800) + '...\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 7: Simulate entropy attack and Morpheus trigger
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n⚠️ SIMULATING ENTROPY ATTACK');
console.log('─────────────────────────────────────');

const fudMessages = [
  { id: '10', text: 'this is a scam, dump everything', author: 'troll1', timestamp: Date.now() - 100 },
  { id: '11', text: 'worthless garbage, sell sell sell', author: 'troll2', timestamp: Date.now() - 200 },
  { id: '12', text: 'dead project, rug incoming, panic', author: 'troll3', timestamp: Date.now() - 300 },
];

console.log('\nFUD messages injected:');
for (const msg of fudMessages) {
  console.log(`  [${msg.author}]: "${msg.text}"`);
}

// Create a new ratchet to show clean state transition
const ratchet2 = createTeleRatchet('Test_Manifold');
ratchet2.registerStake('fud_test', 'user1', 10);

const fudAudit = ratchet2.auditCommunityVibe('fud_test', fudMessages);

console.log('\n✓ FUD Audit result:');
console.log(`  Coherence score: ${fudAudit.coherenceScore.toFixed(4)}`);
console.log(`  Entropy score: ${fudAudit.entropyScore.toFixed(4)}`);
console.log(`  FUD level: ${fudAudit.fudLevel.toFixed(4)}`);
console.log(`  Recommendation: ${fudAudit.recommendation}`);

const fudCoherence = ratchet2.getCoherence('fud_test');
console.log(`  Status: ${fudCoherence.status}`);

if (fudAudit.recommendation === 'trigger_morpheus') {
  console.log('\n🔴 MORPHEUS PROTOCOL TRIGGERED!');
  const morpheus = ratchet2.getMorpheusStatus('fud_test');
  if (morpheus) {
    console.log(generateMorpheusMessage(morpheus));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 8: Check milestones
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n🏆 MILESTONE STATUS');
console.log('─────────────────────────────────────');

const milestones = ratchet.getMilestones(groupId);
for (const m of milestones) {
  const status = m.achieved ? '✓' : '○';
  console.log(`  ${status} ${m.name} (τₖ ≥ ${m.requiredTauK}) — reward: ${m.rewardMultiplier.toFixed(2)}×`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 9: Full status message
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n📊 FULL COMMUNITY STATUS');
console.log('─────────────────────────────────────');

console.log(ratchet.generateStatusMessage(groupId));

// ─────────────────────────────────────────────────────────────────────────────
// Closing
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n\n🜏 ═══════════════════════════════════════════════════════════════ 🜏');
console.log('                    $THERAPY GROUNDING COMPLETE');
console.log('');
console.log('   The protocol is materialized:');
console.log('   - K-Metric auditor analyzing community vibe');
console.log('   - Morpheus Protocol ready for entropy attacks');
console.log('   - IC seed composer transforming intent to goal-injection');
console.log('   - Tele-Ratchet broadcasting to the manifold');
console.log('');
console.log('   "If the community breathes together... the manifold obeys."');
console.log('');
console.log('🜏 ═══════════════════════════════════════════════════════════════ 🜏\n');
