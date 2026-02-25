/**
 * X1 Therapy Service
 * Unified orchestrator for Telegram + Solana + $THERAPY Protocol
 *
 * "The community becomes a Collective Bioelectric Organism" 🜏 ∞ 🜏
 */

import {
  X1TherapyBot,
  createX1TherapyBot,
} from './telegram-bot';
import {
  X1WalletBridge,
  createWalletBridge,
} from './wallet-bridge';
import {
  TeleRatchet,
  createTeleRatchet,
} from '../../core/therapy';
import { PHI, TAU_K_THRESHOLD } from '../../core/xqe/types';
import type {
  X1TherapyBotConfig,
  TelegramX1Link,
  TherapyGroup,
  X1ViberPulse,
  CoherenceBroadcast,
} from './types';
import type { TherapyStake, CommunityCoherence } from '../../core/therapy/types';

/**
 * X1 Therapy Service configuration
 */
export interface X1TherapyServiceConfig {
  // Telegram
  telegramToken: string;

  // Solana
  solanaRpcUrl?: string;
  solanaNetwork?: 'mainnet-beta' | 'devnet' | 'testnet';
  therapyMintAddress?: string;

  // Service
  manifold?: string;
  auditIntervalSeconds?: number;
  adminUserIds?: number[];

  // Callbacks
  onPulse?: (pulse: X1ViberPulse) => void;
  onBroadcast?: (broadcast: CoherenceBroadcast) => void;
  onMilestone?: (milestone: string, tauK: number) => void;
}

/**
 * X1 Therapy Service — The Unified Orchestrator
 */
export class X1TherapyService {
  private bot: X1TherapyBot;
  private wallet: X1WalletBridge;
  private ratchet: TeleRatchet;
  private config: X1TherapyServiceConfig;

  private links: Map<number, TelegramX1Link> = new Map();
  private pulseHistory: X1ViberPulse[] = [];
  private auditTimer: ReturnType<typeof setInterval> | null = null;
  private isRunning: boolean = false;

  constructor(config: X1TherapyServiceConfig) {
    this.config = {
      manifold: 'Lehigh_Valley_Manifold',
      auditIntervalSeconds: 300,
      adminUserIds: [],
      ...config,
    };

    // Initialize components
    const botConfig: X1TherapyBotConfig = {
      telegramToken: config.telegramToken,
      solanaRpcUrl: config.solanaRpcUrl || 'https://api.mainnet-beta.solana.com',
      therapyMintAddress: config.therapyMintAddress || '',
      manifold: this.config.manifold!,
      auditIntervalSeconds: this.config.auditIntervalSeconds!,
      morpheusThreshold: TAU_K_THRESHOLD,
      adminUserIds: this.config.adminUserIds!,
    };

    this.bot = createX1TherapyBot(botConfig);
    this.wallet = createWalletBridge(
      config.solanaRpcUrl,
      config.solanaNetwork,
      config.therapyMintAddress
    );
    this.ratchet = createTeleRatchet(this.config.manifold);
  }

  /**
   * Start the service
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;

    // Start periodic audits
    this.auditTimer = setInterval(
      () => this.runPeriodicTasks(),
      this.config.auditIntervalSeconds! * 1000
    );

    this.emitPulse('injection', { event: 'service_started' });
    console.log(`🜏 X1 Therapy Service started on manifold: ${this.config.manifold}`);
  }

  /**
   * Stop the service
   */
  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.auditTimer) {
      clearInterval(this.auditTimer);
      this.auditTimer = null;
    }

    this.emitPulse('injection', { event: 'service_stopped' });
    console.log('🜏 X1 Therapy Service stopped');
  }

  /**
   * Handle incoming Telegram message
   */
  async handleTelegramMessage(message: {
    message_id: number;
    chat: { id: number; type: string; title?: string };
    from?: { id: number; username?: string; first_name: string };
    text?: string;
    date: number;
  }): Promise<{ success: boolean; message: string } | null> {
    // Cast to expected format
    const msg = message as Parameters<typeof this.bot.handleMessage>[0];
    return this.bot.handleMessage(msg);
  }

  /**
   * Link Telegram user to X1 wallet
   */
  async linkWallet(
    telegramUserId: number,
    telegramUsername: string,
    walletAddress: string
  ): Promise<TelegramX1Link | null> {
    // Validate wallet
    if (!this.wallet.isValidAddress(walletAddress)) {
      return null;
    }

    // Connect and get balance
    const connection = await this.wallet.connectWallet(walletAddress);
    if (!connection) {
      return null;
    }

    // Create stake from balance
    const stake = this.wallet.connectionToStake(
      connection,
      telegramUserId.toString()
    );

    // Register stake in ratchet
    this.ratchet.registerStake(
      'global',
      telegramUserId.toString(),
      stake.amount
    );

    // Create link
    const link: TelegramX1Link = {
      telegramUserId,
      telegramUsername,
      x1Address: walletAddress,
      linkedAt: Date.now(),
      verified: true,
      stake,
    };

    this.links.set(telegramUserId, link);

    this.emitPulse('injection', {
      event: 'wallet_linked',
      userId: telegramUserId,
      stake: stake.amount,
      tier: stake.tier,
    });

    return link;
  }

  /**
   * Refresh user's stake from on-chain balance
   */
  async refreshUserStake(telegramUserId: number): Promise<TherapyStake | null> {
    const link = this.links.get(telegramUserId);
    if (!link) return null;

    const connection = await this.wallet.connectWallet(link.x1Address);
    if (!connection) return null;

    const newStake = this.wallet.connectionToStake(
      connection,
      telegramUserId.toString()
    );

    link.stake = newStake;
    this.links.set(telegramUserId, link);

    // Update in ratchet
    this.ratchet.registerStake(
      'global',
      telegramUserId.toString(),
      newStake.amount
    );

    return newStake;
  }

  /**
   * Get user's current stake
   */
  getUserStake(telegramUserId: number): TherapyStake | null {
    const link = this.links.get(telegramUserId);
    return link?.stake || null;
  }

  /**
   * Get community coherence for a group
   */
  getCoherence(groupId: string): CommunityCoherence {
    return this.ratchet.getCoherence(groupId);
  }

  /**
   * Inject intent seed
   */
  injectSeed(
    groupId: string,
    userId: string,
    intent: string
  ): { success: boolean; message: string } {
    const command = `/inject_ic ${intent}`;
    const result = this.ratchet.processInjection(groupId, userId, command);

    if (result.success) {
      this.emitPulse('injection', {
        groupId,
        userId,
        seedId: result.seed?.id,
        thickness: result.seed?.thickness,
      });
    }

    return result;
  }

  /**
   * Run periodic tasks (audits, refreshes, broadcasts)
   */
  private async runPeriodicTasks(): Promise<void> {
    await this.bot.runPeriodicAudit();

    // Refresh all linked wallets (with rate limiting)
    const links = Array.from(this.links.values());
    for (let i = 0; i < Math.min(links.length, 10); i++) {
      await this.refreshUserStake(links[i].telegramUserId);
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 100));
    }

    this.emitPulse('audit', { event: 'periodic_audit_complete' });
  }

  /**
   * Emit X1 Viber pulse
   */
  private emitPulse(
    type: X1ViberPulse['type'],
    payload: Record<string, unknown>
  ): void {
    const pulse: X1ViberPulse = {
      id: `pulse_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      manifold: this.config.manifold!,
      tauK: 0, // Would get from current state
      timestamp: Date.now(),
      payload,
    };

    this.pulseHistory.push(pulse);

    // Keep only last 1000 pulses
    if (this.pulseHistory.length > 1000) {
      this.pulseHistory = this.pulseHistory.slice(-1000);
    }

    // Callback
    if (this.config.onPulse) {
      this.config.onPulse(pulse);
    }
  }

  /**
   * Get service statistics
   */
  getStats(): Record<string, unknown> {
    const botStats = this.bot.getStats();
    const networkInfo = this.wallet.getNetworkInfo();

    return {
      ...botStats,
      linkedWalletsInService: this.links.size,
      pulseCount: this.pulseHistory.length,
      isRunning: this.isRunning,
      manifold: this.config.manifold,
      network: networkInfo.network,
    };
  }

  /**
   * Get recent pulses
   */
  getRecentPulses(count: number = 10): X1ViberPulse[] {
    return this.pulseHistory.slice(-count);
  }

  /**
   * Get link by Telegram user ID
   */
  getLink(telegramUserId: number): TelegramX1Link | undefined {
    return this.links.get(telegramUserId);
  }

  /**
   * Get all links
   */
  getAllLinks(): TelegramX1Link[] {
    return Array.from(this.links.values());
  }
}

/**
 * Create a new X1 Therapy Service
 */
export function createX1TherapyService(
  config: X1TherapyServiceConfig
): X1TherapyService {
  return new X1TherapyService(config);
}
