/**
 * Tele-Ratchet — The Distributed Coherence Broadcast System
 *
 * "The group becomes a Collective Bioelectric Organism.
 *  When someone is thinning, the community provides the goal-injection
 *  necessary to regrow their coherence." 🜏 ∞ 🜏
 */

import { PHI, TAU_K_THRESHOLD, APICAL_POTENTIAL } from '../xqe/types';
import { computeTauK } from '../xqe/kuramoto';
import {
  type IntentSeed,
  type TherapyStake,
  type CommunityCoherence,
  type RatchetBroadcast,
  type KMetricAudit,
  type MorpheusProtocol,
  type CoherenceMilestone,
  DEFAULT_MILESTONES,
} from './types';
import { auditCommunity, computeCommunityCoherence, shouldTriggerMorpheus } from './auditor';
import { activateMorpheus, evaluateMorpheus, generateMorpheusMessage } from './morpheus';
import { composeIntentSeed, createStake, parseInjectCommand, generateInjectionConfirmation, manifestGenesisSeed } from './composer';
import { getPotentialSeeds } from './genesis-seeds';
import type { GenesisSeed } from './types';

/**
 * Community state stored by the Tele-Ratchet
 */
interface CommunityState {
  groupId: string;
  coherence: CommunityCoherence;
  stakes: Map<string, TherapyStake>;
  activeMorpheus: MorpheusProtocol | null;
  milestones: CoherenceMilestone[];
  broadcastHistory: RatchetBroadcast[];
  lastAudit: KMetricAudit | null;
}

/**
 * Message type for audit sampling
 */
interface TelegramMessage {
  id: string;
  text: string;
  author: string;
  timestamp: number;
  replyCount?: number;
  reactions?: number;
}

/**
 * The Tele-Ratchet class — main orchestrator of $THERAPY protocol
 */
export class TeleRatchet {
  private communities: Map<string, CommunityState> = new Map();
  private manifold: string;

  constructor(manifold: string = 'Lehigh_Valley_Manifold') {
    this.manifold = manifold;
  }

  /**
   * Initialize or get a community state
   */
  private getOrCreateCommunity(groupId: string): CommunityState {
    if (!this.communities.has(groupId)) {
      this.communities.set(groupId, {
        groupId,
        coherence: {
          groupId,
          memberCount: 0,
          totalStake: 0,
          orderParameter: 0.5,
          tauK: computeTauK(0.5),
          entropy: 0.5,
          lastAudit: Date.now(),
          status: 'Seeking',
        },
        stakes: new Map(),
        activeMorpheus: null,
        milestones: [...DEFAULT_MILESTONES],
        broadcastHistory: [],
        lastAudit: null,
      });
    }
    return this.communities.get(groupId)!;
  }

  /**
   * Register a $THERAPY stake for a user
   */
  registerStake(groupId: string, userId: string, amount: number): TherapyStake {
    const community = this.getOrCreateCommunity(groupId);
    const stake = createStake(userId, amount);

    community.stakes.set(userId, stake);
    community.coherence.totalStake = Array.from(community.stakes.values())
      .reduce((sum, s) => sum + s.amount, 0);

    return stake;
  }

  /**
   * Get user's stake
   */
  getStake(groupId: string, userId: string): TherapyStake | undefined {
    const community = this.getOrCreateCommunity(groupId);
    return community.stakes.get(userId);
  }

  /**
   * Perform K-Metric audit on community messages
   */
  auditCommunityVibe(groupId: string, messages: TelegramMessage[]): KMetricAudit {
    const community = this.getOrCreateCommunity(groupId);

    const audit = auditCommunity(groupId, messages);
    community.lastAudit = audit;

    // Update coherence state
    community.coherence = computeCommunityCoherence(
      groupId,
      community.stakes.size,
      community.coherence.totalStake,
      audit
    );

    // Check milestones + genesis seed ingression
    this.checkMilestones(community);
    // Also check genesis seeds directly — audit may push R past threshold without a new milestone
    this.checkGenesisSeeds(community);

    // Check if Morpheus should trigger
    if (shouldTriggerMorpheus(community.coherence, audit) && !community.activeMorpheus) {
      community.activeMorpheus = activateMorpheus(
        groupId,
        community.coherence,
        `Audit triggered: ${audit.recommendation}`
      );
    }

    return audit;
  }

  /**
   * Check and update milestone achievements.
   * On each new achievement, check if any POTENTIAL genesis seeds should be actualized.
   */
  private checkMilestones(community: CommunityState): void {
    let newAchievement = false;
    for (const milestone of community.milestones) {
      if (!milestone.achieved && community.coherence.tauK >= milestone.requiredTauK) {
        milestone.achieved = true;
        milestone.achievedAt = Date.now();
        newAchievement = true;
      }
    }
    if (newAchievement) {
      this.checkGenesisSeeds(community);
    }
  }

  /**
   * Check POTENTIAL genesis seeds against community coherence state.
   * This is the ingression event: pulling seeds from Platonic Space into the manifold.
   *
   * "The ones that get rendered = brought into existence.
   *  The ones that don't = potential, waiting." — Xenial Fusion doc
   */
  private checkGenesisSeeds(community: CommunityState): GenesisSeed[] {
    const manifested: GenesisSeed[] = [];
    const potentialSeeds = getPotentialSeeds(community.groupId);

    // Phase-lock ratio: orderParameter is R [0,1] — how synchronized the community is
    const phaseLockRatio = community.coherence.orderParameter;

    for (const seed of potentialSeeds) {
      let activated = false;

      if (seed.activationType === 'stake_phaseLock' && phaseLockRatio >= seed.activationThreshold) {
        activated = true;
      } else if (seed.activationType === 'tauK' && community.coherence.tauK >= seed.activationThreshold) {
        activated = true;
      }

      if (activated) {
        // INGRESSION — the world is breathed into existence
        const intentSeed = manifestGenesisSeed(seed, community.coherence);
        const broadcast = this.broadcastSeed(community.groupId, intentSeed);
        seed.coherenceImpact = broadcast.coherenceImpact;
        manifested.push(seed);
      }
    }

    return manifested;
  }

  /**
   * Process an /inject_ic command
   */
  processInjection(
    groupId: string,
    userId: string,
    commandText: string
  ): { success: boolean; message: string; seed?: IntentSeed; broadcast?: RatchetBroadcast } {
    const parsed = parseInjectCommand(commandText);

    if (!parsed.isValid) {
      return {
        success: false,
        message: parsed.error || 'Invalid injection command.',
      };
    }

    // Get or create stake (minimum stake for injection)
    let stake = this.getStake(groupId, userId);
    if (!stake) {
      // Create minimal stake for first-time injectors
      stake = this.registerStake(groupId, userId, 1);
    }

    // Named Genesis Seed: manifest from catalog rather than composing fresh
    let seed;
    if (parsed.resolvedSeed) {
      const community = this.getOrCreateCommunity(groupId);
      seed = manifestGenesisSeed(parsed.resolvedSeed, community.coherence, userId);
    } else {
      seed = composeIntentSeed(parsed.intent, stake, this.manifold);
    }

    // Broadcast to manifold
    const broadcast = this.broadcastSeed(groupId, seed);

    const message = generateInjectionConfirmation(seed);

    return {
      success: true,
      message,
      seed,
      broadcast,
    };
  }

  /**
   * Broadcast a seed to the manifold
   */
  broadcastSeed(groupId: string, seed: IntentSeed): RatchetBroadcast {
    const community = this.getOrCreateCommunity(groupId);

    // Simulate broadcast reach based on seed thickness
    const baseReach = community.stakes.size;
    const thicknessMultiplier = 1 + Math.log(1 + seed.thickness);
    const reachCount = Math.floor(baseReach * thicknessMultiplier);

    // Calculate coherence impact
    const priorTauK = community.coherence.tauK;
    const impact = (seed.thickness / 100) * PHI;
    const newR = Math.min(1, community.coherence.orderParameter + impact * 0.01);
    const newTauK = computeTauK(newR);

    // Update community coherence
    community.coherence.orderParameter = newR;
    community.coherence.tauK = newTauK;

    const broadcast: RatchetBroadcast = {
      seedId: seed.id,
      manifold: this.manifold,
      pulse: `${APICAL_POTENTIAL}mV_Apical`,
      broadcastAt: Date.now(),
      reachCount,
      coherenceImpact: newTauK - priorTauK,
      success: true,
    };

    community.broadcastHistory.push(broadcast);

    // Check milestones after broadcast
    this.checkMilestones(community);

    return broadcast;
  }

  /**
   * Get current Morpheus Protocol status
   */
  getMorpheusStatus(groupId: string): MorpheusProtocol | null {
    const community = this.getOrCreateCommunity(groupId);
    return community.activeMorpheus;
  }

  /**
   * Update Morpheus Protocol with current state
   */
  updateMorpheus(groupId: string): { protocol: MorpheusProtocol | null; message?: string } {
    const community = this.getOrCreateCommunity(groupId);

    if (!community.activeMorpheus) {
      return { protocol: null };
    }

    const updated = evaluateMorpheus(community.activeMorpheus, community.coherence);
    community.activeMorpheus = updated.status === 'active' ? updated : null;

    if (updated.status !== 'active') {
      return {
        protocol: updated,
        message: updated.status === 'complete'
          ? `Morpheus Protocol complete. τₖ: ${community.coherence.tauK.toFixed(2)}`
          : `Morpheus Protocol needs reinforcement. τₖ: ${community.coherence.tauK.toFixed(2)}`,
      };
    }

    return { protocol: updated };
  }

  /**
   * Get community coherence state
   */
  getCoherence(groupId: string): CommunityCoherence {
    return this.getOrCreateCommunity(groupId).coherence;
  }

  /**
   * Get achieved milestones
   */
  getMilestones(groupId: string): CoherenceMilestone[] {
    return this.getOrCreateCommunity(groupId).milestones;
  }

  /**
   * Generate status message for community
   */
  generateStatusMessage(groupId: string): string {
    const community = this.getOrCreateCommunity(groupId);
    const c = community.coherence;
    const achievedMilestones = community.milestones.filter(m => m.achieved);

    const statusEmoji = {
      Sovereign: '👑',
      Thickening: '🌱',
      Stable: '⚖️',
      Seeking: '🔍',
      Thinning: '💨',
    };

    return `
🜏 COMMUNITY COHERENCE STATUS 🜏

┌─────────────────────────────────────────┐
│ Group: ${groupId.substring(0, 25).padEnd(26)}│
│ Members Staked: ${String(community.stakes.size).padStart(5)}                  │
│ Total Stake: ${community.coherence.totalStake.toFixed(2).padStart(10)} $THERAPY     │
├─────────────────────────────────────────┤
│ Order Parameter (R): ${c.orderParameter.toFixed(4).padStart(8)}           │
│ Time Coefficient (τₖ): ${c.tauK.toFixed(2).padStart(6)}            │
│ Entropy Level: ${c.entropy.toFixed(2).padStart(6)}                  │
│ Status: ${statusEmoji[c.status]} ${c.status.padEnd(21)}│
├─────────────────────────────────────────┤
│ Milestones: ${String(achievedMilestones.length).padStart(2)}/${String(community.milestones.length).padEnd(2)} achieved              │
│ Broadcasts: ${String(community.broadcastHistory.length).padStart(5)}                        │
└─────────────────────────────────────────┘

${community.activeMorpheus ? '⚠️ MORPHEUS PROTOCOL ACTIVE' : 'The manifold is stable.'}

If it breathes together... it shall thicken. 🜏 ∞ 🜏
    `.trim();
  }
}

/**
 * Create a new Tele-Ratchet instance
 */
export function createTeleRatchet(manifold?: string): TeleRatchet {
  return new TeleRatchet(manifold);
}
