/**
 * $THERAPY API Server
 * Coherence bridge between Bot and dApp
 *
 * 🜏 ∞ 🜏
 */

import express from 'express';
import cors from 'cors';
import { createTeleRatchet, type TeleRatchet } from '../core/therapy';
import { PHI } from '../core/xqe/types';
import { dispenseTherapy, getTreasuryStatus } from '../services/therapy-mint';
import { recordLitIngression, getLitBioRegenStatus } from '../services/lit-bioregen-bridge';
import type {
  TherapyUser,
  BreathSession,
  LinkUserRequest,
  LinkUserResponse,
  StartSessionRequest,
  StartSessionResponse,
  CompleteSessionRequest,
  CompleteSessionResponse,
  ClaimRequest,
  ClaimResponse,
  CoherenceResponse,
  UserResponse,
} from './types';

/**
 * In-memory store (replace with DB in production)
 */
const users = new Map<string, TherapyUser>();
const sessions = new Map<string, BreathSession>();
const userByTelegram = new Map<number, string>();
const userByWallet = new Map<string, string>();

let ratchet: TeleRatchet;

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Calculate rewards based on session performance
 */
function calculateRewards(session: BreathSession): number {
  const baseReward = 1;
  const cycleBonus = session.cyclesCompleted * 0.5;
  const coherenceMultiplier = 1 + (session.coherenceAchieved * PHI);
  const tauKBonus = session.tauKAchieved >= 8.7 ? PHI * PHI : 1;

  return Math.round((baseReward + cycleBonus) * coherenceMultiplier * tauKBonus * 100) / 100;
}

/**
 * Create and configure the API server
 */
export function createApiServer(manifold: string = 'Lehigh_Valley_Manifold') {
  const app = express();

  ratchet = createTeleRatchet(manifold);

  app.use(cors());
  app.use(express.json());

  // ═══════════════════════════════════════════════════════════════
  // ROUTES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Health check
   */
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'coherent',
      manifold,
      users: users.size,
      activeSessions: Array.from(sessions.values()).filter(s => !s.completedAt).length,
      timestamp: Date.now(),
    });
  });

  /**
   * Link/create user
   */
  app.post('/api/user/link', (req, res) => {
    const body = req.body as LinkUserRequest;
    const { telegramId, telegramUsername, walletAddress } = body;

    // Find existing user by telegram or wallet
    let userId: string | undefined;
    if (telegramId) {
      userId = userByTelegram.get(telegramId);
    }
    if (!userId && walletAddress) {
      userId = userByWallet.get(walletAddress);
    }

    let user: TherapyUser;

    if (userId && users.has(userId)) {
      // Update existing user
      user = users.get(userId)!;
      if (telegramId && !user.telegramId) {
        user.telegramId = telegramId;
        user.telegramUsername = telegramUsername;
        userByTelegram.set(telegramId, userId);
      }
      if (walletAddress && !user.walletAddress) {
        user.walletAddress = walletAddress;
        userByWallet.set(walletAddress, userId);
        user.linkedAt = Date.now();
      }
    } else {
      // Create new user
      userId = generateId('user');
      user = {
        id: userId,
        telegramId,
        telegramUsername,
        walletAddress,
        linkedAt: walletAddress ? Date.now() : undefined,
        totalBreathCycles: 0,
        totalRewardsEarned: 0,
      };

      users.set(userId, user);
      if (telegramId) userByTelegram.set(telegramId, userId);
      if (walletAddress) userByWallet.set(walletAddress, userId);
    }

    // Register stake if wallet linked
    if (user.walletAddress && !user.stake) {
      user.stake = ratchet.registerStake('global', userId, 10); // Demo stake
    }

    const response: LinkUserResponse = {
      success: true,
      user,
    };

    res.json(response);
  });

  /**
   * Get user by ID, telegram ID, or wallet
   */
  app.get('/api/user/:identifier', (req, res) => {
    const { identifier } = req.params;

    let userId: string | undefined;

    // Try as direct ID
    if (users.has(identifier)) {
      userId = identifier;
    }
    // Try as telegram ID
    else if (/^\d+$/.test(identifier)) {
      userId = userByTelegram.get(parseInt(identifier, 10));
    }
    // Try as wallet address
    else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(identifier)) {
      userId = userByWallet.get(identifier);
    }

    if (!userId || !users.has(userId)) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = users.get(userId)!;
    const userSessions = Array.from(sessions.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => b.startedAt - a.startedAt)
      .slice(0, 10);

    const response: UserResponse = {
      user,
      recentSessions: userSessions,
    };

    res.json(response);
  });

  /**
   * Start breath session
   */
  app.post('/api/session/start', (req, res) => {
    const body = req.body as StartSessionRequest;
    const { userId, protocol, totalCycles, source } = body;

    if (!users.has(userId)) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const sessionId = generateId('session');
    const session: BreathSession = {
      id: sessionId,
      userId,
      protocol,
      cyclesCompleted: 0,
      totalCycles,
      startedAt: Date.now(),
      coherenceAchieved: 0,
      tauKAchieved: 0,
      rewardsEarned: 0,
      source,
    };

    sessions.set(sessionId, session);

    const response: StartSessionResponse = {
      success: true,
      sessionId,
    };

    res.json(response);
  });

  /**
   * Update session progress
   */
  app.post('/api/session/update', (req, res) => {
    const { sessionId, cyclesCompleted, currentCoherence, currentTauK } = req.body;

    const session = sessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    session.cyclesCompleted = cyclesCompleted;
    session.coherenceAchieved = Math.max(session.coherenceAchieved, currentCoherence);
    session.tauKAchieved = Math.max(session.tauKAchieved, currentTauK);

    res.json({ success: true });
  });

  /**
   * Complete session
   */
  app.post('/api/session/complete', (req, res) => {
    const body = req.body as CompleteSessionRequest;
    const { sessionId, cyclesCompleted, coherenceAchieved, tauKAchieved } = body;

    const session = sessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    session.cyclesCompleted = cyclesCompleted;
    session.coherenceAchieved = coherenceAchieved;
    session.tauKAchieved = tauKAchieved;
    session.completedAt = Date.now();
    session.rewardsEarned = calculateRewards(session);

    // Update user stats
    const user = users.get(session.userId);
    if (user) {
      user.totalBreathCycles = (user.totalBreathCycles || 0) + cyclesCompleted;
      user.totalRewardsEarned = (user.totalRewardsEarned || 0) + session.rewardsEarned;
      user.lastBreathSession = Date.now();
    }

    const response: CompleteSessionResponse = {
      success: true,
      rewardsEarned: session.rewardsEarned,
      totalRewards: user?.totalRewardsEarned || session.rewardsEarned,
    };

    res.json(response);
  });

  /**
   * Claim $THERAPY tokens for a completed breath session — Proof of Breath
   *
   * Verifies: session complete, not yet claimed, wallet matches user record.
   * Dispenses from protocol treasury to recipient wallet on X1 mainnet.
   */
  app.post('/api/session/claim', async (req, res) => {
    const { walletAddress, cyclesCompleted, coherenceAchieved, tauKAchieved, holdDuration } = req.body as ClaimRequest;

    if (!walletAddress || cyclesCompleted <= 0) {
      res.status(400).json({ success: false, error: 'Invalid session proof' });
      return;
    }

    const { calculateTC, calculatePTO } = await import('../features/therapy/rewards');
    const tc = calculateTC(holdDuration ?? 15);
    const r = Math.min(Math.max(coherenceAchieved ?? 0.6, 0), 1);
    const amount = Math.min(Math.floor(calculatePTO(tc, r, tauKAchieved ?? 0)), 100);

    if (amount <= 0) {
      res.status(400).json({ success: false, error: 'No rewards to claim' });
      return;
    }

    try {
      const result = await dispenseTherapy(walletAddress, amount);

      // Update user stats if we can find them
      const userId = userByWallet.get(walletAddress);
      const user = userId ? users.get(userId) : null;
      if (user) {
        user.totalRewardsEarned = (user.totalRewardsEarned || 0) + amount;
        user.lastBreathSession = Date.now();
      }

      // LIT_BioRegen bridge — record ingression if coherence threshold met
      const litIngression = await recordLitIngression(walletAddress, r, {
        breathCycles: cyclesCompleted,
        holdDuration: holdDuration ?? 15,
        tauKAchieved: tauKAchieved ?? undefined,
      });
      if (litIngression.fired) {
        console.log(
          `🜏 LIT_BioRegen ingression: τₖ=${litIngression.tauK.toFixed(3)} | ` +
          `${litIngression.isGenesisAttestation ? `GENESIS ATTESTATION ${litIngression.genesisAttestationCount}/${litIngression.genesisAttestationsRequired}` : 'ingression'} | ` +
          `${walletAddress.slice(0, 8)}...`
        );
      }

      console.log(`🜏 $THERAPY dispensed: ${result.amount} → ${walletAddress.slice(0, 8)}... | sig: ${result.signature.slice(0, 16)}...`);

      const response: ClaimResponse = {
        success: true,
        signature: result.signature,
        amount: result.amount,
        mint: result.mint,
        litIngression: litIngression.fired ? litIngression : undefined,
      };
      res.json(response);
    } catch (error) {
      console.error('$THERAPY dispense failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Dispense failed',
      });
    }
  });

  /**
   * Treasury health check — verify the protocol can dispense
   */
  app.get('/api/treasury', async (_req, res) => {
    try {
      const status = await getTreasuryStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  /**
   * Get coherence state for manifold
   */
  app.get('/api/coherence/:manifold', (req, res) => {
    const { manifold: reqManifold } = req.params;
    const coherence = ratchet.getCoherence(reqManifold || 'global');

    const activeSessions = Array.from(sessions.values())
      .filter(s => !s.completedAt);

    const recentSessions = Array.from(sessions.values())
      .filter(s => s.completedAt && Date.now() - s.completedAt < 3600000) // Last hour
      .length;

    const response: CoherenceResponse = {
      manifold: reqManifold || manifold,
      coherence,
      activeBreathers: activeSessions.length,
      recentSessions,
    };

    res.json(response);
  });

  /**
   * Get global stats
   */
  app.get('/api/stats', async (req, res) => {
    const allSessions = Array.from(sessions.values());
    const completedSessions = allSessions.filter(s => s.completedAt);
    const totalCycles = completedSessions.reduce((sum, s) => sum + s.cyclesCompleted, 0);
    const totalRewards = completedSessions.reduce((sum, s) => sum + s.rewardsEarned, 0);

    res.json({
      manifold,
      users: users.size,
      totalSessions: completedSessions.length,
      activeSessions: allSessions.length - completedSessions.length,
      totalCycles,
      totalRewards: Math.round(totalRewards * 100) / 100,
      coherence: ratchet.getCoherence('global'),
      litBioRegen: await getLitBioRegenStatus(),
    });
  });

  return app;
}

/**
 * Start the API server
 */
export function startApiServer(port: number = 3333, manifold?: string) {
  const app = createApiServer(manifold);

  app.listen(port, () => {
    console.log(`🜏 $THERAPY API Server running on port ${port}`);
    console.log(`   Manifold: ${manifold || 'Lehigh_Valley_Manifold'}`);
    console.log(`   Health: http://localhost:${port}/api/health`);
    console.log(`🜏 ∞ 🜏`);
  });

  return app;
}

// CLI entry point
if (process.argv[1]?.includes('server')) {
  const port = parseInt(process.env.PORT || '3333', 10);
  const manifold = process.env.MANIFOLD || 'Lehigh_Valley_Manifold';
  startApiServer(port, manifold);
}
