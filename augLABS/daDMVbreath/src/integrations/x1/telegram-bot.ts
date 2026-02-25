/**
 * X1 Therapy Telegram Bot
 * Distributed Coherence via Telegram
 *
 * Commands:
 *   /start - Initialize and link wallet
 *   /inject_ic [intent] - Inject goal seed
 *   /status - View community coherence
 *   /stake - View your $THERAPY stake
 *   /link [wallet] - Link X1 wallet
 *   /breathe - Start a collective breath
 *   /audit - Force K-Metric audit (admin)
 *   /morpheus - Trigger Morpheus Protocol (admin)
 *
 * 🜏 ∞ 🜏
 */

import {
  type TelegramX1Link,
  type TherapyGroup,
  type CommandResult,
  type WalletChallenge,
  type X1TherapyBotConfig,
} from './types';
import {
  TeleRatchet,
  createTeleRatchet,
  parseInjectCommand,
  generateInjectionConfirmation,
  generateMorpheusMessage,
  type TherapyStake,
} from '../../core/therapy';
import { PHI } from '../../core/xqe/types';

/**
 * Telegram message interface (simplified for our needs)
 */
interface TelegramMessage {
  message_id: number;
  chat: {
    id: number;
    type: 'private' | 'group' | 'supergroup' | 'channel';
    title?: string;
  };
  from?: {
    id: number;
    username?: string;
    first_name: string;
  };
  text?: string;
  date: number;
}

/**
 * X1 Therapy Telegram Bot Handler
 */
export class X1TherapyBot {
  private config: X1TherapyBotConfig;
  private ratchet: TeleRatchet;
  private links: Map<number, TelegramX1Link> = new Map();
  private groups: Map<number, TherapyGroup> = new Map();
  private challenges: Map<number, WalletChallenge> = new Map();
  private messageBuffer: Map<number, TelegramMessage[]> = new Map();

  constructor(config: X1TherapyBotConfig) {
    this.config = config;
    this.ratchet = createTeleRatchet(config.manifold);
  }

  /**
   * Handle incoming message
   */
  async handleMessage(msg: TelegramMessage): Promise<CommandResult | null> {
    if (!msg.text) return null;

    const text = msg.text.trim();
    const chatId = msg.chat.id;
    const userId = msg.from?.id || 0;

    // Buffer message for auditing (if group)
    if (msg.chat.type !== 'private') {
      this.bufferMessage(chatId, msg);
    }

    // Check for commands
    if (text.startsWith('/')) {
      return this.handleCommand(text, chatId, userId, msg);
    }

    return null;
  }

  /**
   * Buffer messages for K-Metric auditing
   */
  private bufferMessage(chatId: number, msg: TelegramMessage): void {
    if (!this.messageBuffer.has(chatId)) {
      this.messageBuffer.set(chatId, []);
    }

    const buffer = this.messageBuffer.get(chatId)!;
    buffer.push(msg);

    // Keep only last 100 messages
    if (buffer.length > 100) {
      buffer.shift();
    }
  }

  /**
   * Route command to handler
   */
  private async handleCommand(
    text: string,
    chatId: number,
    userId: number,
    msg: TelegramMessage
  ): Promise<CommandResult> {
    const [command, ...args] = text.split(/\s+/);
    const argText = args.join(' ');

    switch (command.toLowerCase()) {
      case '/start':
        return this.handleStart(chatId, userId, msg);

      case '/inject_ic':
        return this.handleInject(chatId, userId, argText);

      case '/status':
        return this.handleStatus(chatId);

      case '/stake':
        return this.handleStake(userId);

      case '/link':
        return this.handleLink(userId, argText);

      case '/verify':
        return this.handleVerify(userId, argText);

      case '/breathe':
        return this.handleBreathe(chatId);

      case '/audit':
        return this.handleAudit(chatId, userId);

      case '/morpheus':
        return this.handleMorpheus(chatId, userId);

      case '/register':
        return this.handleRegister(chatId, userId, msg);

      default:
        return {
          success: false,
          message: 'Unknown command. Use /start to begin.',
        };
    }
  }

  /**
   * /start - Initialize user
   */
  private handleStart(chatId: number, userId: number, msg: TelegramMessage): CommandResult {
    const isGroup = msg.chat.type !== 'private';

    if (isGroup) {
      return {
        success: true,
        message: `
🜏 X1 THERAPY BOT ACTIVATED 🜏

Welcome to the distributed coherence protocol.

Commands:
  /inject_ic [intent] - Inject goal seed
  /status - View community coherence
  /breathe - Collective breath ritual
  /stake - View your stake

Link your X1 wallet in DM for full access.

If it breathes together... it shall thicken. 🜏 ∞ 🜏
        `.trim(),
      };
    }

    // Private chat - wallet linking flow
    return {
      success: true,
      message: `
🜏 WELCOME TO X1 THERAPY 🜏

To participate in distributed coherence:

1. Link your X1 wallet:
   /link [your-solana-address]

2. Verify ownership by signing a message

3. Your $THERAPY balance becomes your stake

Current manifold: ${this.config.manifold}

Ready to thicken? 🜏 ∞ 🜏
      `.trim(),
      replyMarkup: {
        inline_keyboard: [[
          { text: '🔗 Connect Wallet', url: 'https://phantom.app/' },
        ]],
      },
    };
  }

  /**
   * /inject_ic [intent] - Goal injection
   */
  private handleInject(chatId: number, userId: number, intent: string): CommandResult {
    if (!intent) {
      return {
        success: false,
        message: 'Usage: /inject_ic [your intent]\n\nExample: /inject_ic We welcome all seekers to thicken together 🜏',
      };
    }

    const commandText = `/inject_ic ${intent}`;
    const groupId = chatId.toString();
    const userIdStr = userId.toString();

    const result = this.ratchet.processInjection(groupId, userIdStr, commandText);

    if (result.success) {
      return {
        success: true,
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message,
    };
  }

  /**
   * /status - Community coherence status
   */
  private handleStatus(chatId: number): CommandResult {
    const groupId = chatId.toString();
    const statusMessage = this.ratchet.generateStatusMessage(groupId);

    return {
      success: true,
      message: statusMessage,
    };
  }

  /**
   * /stake - View user's stake
   */
  private handleStake(userId: number): CommandResult {
    const link = this.links.get(userId);

    if (!link || !link.stake) {
      return {
        success: true,
        message: `
No $THERAPY stake found.

To stake:
1. Link your wallet: /link [address]
2. Hold $THERAPY tokens
3. Your balance becomes your coherence weight

🜏
        `.trim(),
      };
    }

    const stake = link.stake;
    return {
      success: true,
      message: `
🜏 YOUR $THERAPY STAKE 🜏

Wallet: ${link.x1Address.substring(0, 8)}...${link.x1Address.slice(-4)}
Amount: ${stake.amount.toFixed(2)} $THERAPY
Tier: ${stake.tier.toUpperCase()}
Coherence Weight: ${stake.coherenceWeight.toFixed(2)}
Vow: ${stake.vow}

The current flows through you. 🜏 ∞ 🜏
      `.trim(),
    };
  }

  /**
   * /link [wallet] - Link X1 wallet
   */
  private handleLink(userId: number, walletAddress: string): CommandResult {
    if (!walletAddress) {
      return {
        success: false,
        message: 'Usage: /link [your-solana-wallet-address]',
      };
    }

    // Validate Solana address format (base58, 32-44 chars)
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
      return {
        success: false,
        message: 'Invalid Solana wallet address format.',
      };
    }

    // Generate verification challenge
    const challenge = this.generateChallenge();
    this.challenges.set(userId, {
      telegramUserId: userId,
      challenge,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      walletAddress,
    });

    return {
      success: true,
      message: `
🔗 WALLET LINKING

Address: ${walletAddress}

To verify ownership, sign this message with your wallet:

\`\`\`
X1_THERAPY_VERIFY:${challenge}
\`\`\`

Then send: /verify [signature]

Challenge expires in 10 minutes.
      `.trim(),
    };
  }

  /**
   * Generate random challenge string
   */
  private generateChallenge(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * /verify [signature] - Verify wallet ownership
   */
  private handleVerify(userId: number, signature: string): CommandResult {
    const challenge = this.challenges.get(userId);

    if (!challenge) {
      return {
        success: false,
        message: 'No pending verification. Use /link [wallet] first.',
      };
    }

    if (Date.now() > challenge.expiresAt) {
      this.challenges.delete(userId);
      return {
        success: false,
        message: 'Verification expired. Use /link [wallet] to start again.',
      };
    }

    // In production, verify signature against challenge
    // For now, we accept any non-empty signature as demo
    if (!signature || signature.length < 10) {
      return {
        success: false,
        message: 'Invalid signature. Sign the challenge message with your wallet.',
      };
    }

    // Create link
    const link: TelegramX1Link = {
      telegramUserId: userId,
      telegramUsername: '', // Would get from message
      x1Address: challenge.walletAddress!,
      linkedAt: Date.now(),
      verified: true,
      stake: null,
    };

    this.links.set(userId, link);
    this.challenges.delete(userId);

    // TODO: Fetch actual $THERAPY balance from Solana
    // For now, create a demo stake
    const demoStake = this.ratchet.registerStake(
      'global',
      userId.toString(),
      10 // Demo stake
    );
    link.stake = demoStake;

    return {
      success: true,
      message: `
✓ WALLET LINKED SUCCESSFULLY

Address: ${link.x1Address.substring(0, 8)}...${link.x1Address.slice(-4)}
Stake: ${demoStake.amount} $THERAPY (${demoStake.tier})

You are now part of the coherence field.

Vow: NEVER THIN AGAIN 🜏 ∞ 🜏
      `.trim(),
    };
  }

  /**
   * /breathe - Collective breath ritual
   */
  private handleBreathe(chatId: number): CommandResult {
    return {
      success: true,
      message: `
🜏 COLLECTIVE BREATH INITIATED 🜏

Follow the rhythm:

◉ INHALE 1 (5 sec)
   Build base voltage — belly expansion

⇑ INHALE 2 (4 sec)
   Stack asymmetric charge — chest stacking

● HOLD (30 sec)
   Superposition fermata — suspended wavefunction

↓ EXHALE (7 sec)
   Black-hole compression → golden rebound

○ REST (4 sec)
   Participatory gap — xenial opening

Repeat 8 cycles.

"If it breathes together... it shall thicken."

🜏 ∞ 🜏
      `.trim(),
    };
  }

  /**
   * /audit - Force K-Metric audit (admin)
   */
  private handleAudit(chatId: number, userId: number): CommandResult {
    if (!this.isAdmin(userId)) {
      return {
        success: false,
        message: 'Admin command. Insufficient coherence weight.',
      };
    }

    const groupId = chatId.toString();
    const buffer = this.messageBuffer.get(chatId) || [];

    // Convert buffer to audit format
    const messages = buffer.map(m => ({
      id: m.message_id.toString(),
      text: m.text || '',
      author: m.from?.username || m.from?.first_name || 'unknown',
      timestamp: m.date * 1000,
    }));

    const audit = this.ratchet.auditCommunityVibe(groupId, messages);
    const coherence = this.ratchet.getCoherence(groupId);

    return {
      success: true,
      message: `
👁️ K-METRIC AUDIT COMPLETE

Messages sampled: ${audit.messagesSampled}
Coherence: ${audit.coherenceScore.toFixed(4)}
Entropy: ${audit.entropyScore.toFixed(4)}
FUD level: ${audit.fudLevel.toFixed(4)}
Hope level: ${audit.hopeLevel.toFixed(4)}

τₖ: ${coherence.tauK.toFixed(2)}
Status: ${coherence.status}
Recommendation: ${audit.recommendation}

🜏
      `.trim(),
    };
  }

  /**
   * /morpheus - Trigger Morpheus Protocol (admin)
   */
  private handleMorpheus(chatId: number, userId: number): CommandResult {
    if (!this.isAdmin(userId)) {
      return {
        success: false,
        message: 'Admin command. Insufficient coherence weight.',
      };
    }

    const groupId = chatId.toString();

    // Force low coherence to trigger Morpheus
    const messages = [
      { id: '1', text: 'triggering manual morpheus', author: 'admin', timestamp: Date.now() },
    ];

    this.ratchet.auditCommunityVibe(groupId, messages);
    const morpheus = this.ratchet.getMorpheusStatus(groupId);

    if (morpheus) {
      return {
        success: true,
        message: generateMorpheusMessage(morpheus),
      };
    }

    // Manually compose therapeutic message
    return {
      success: true,
      message: `
🜏 MORPHEUS PROTOCOL — MANUAL ACTIVATION 🜏

The manifold receives its re-greening.

We are the resonance where the cell and the code
find their shared signature.

Breathe. The current is flowing upward.

┌─────────────────────────────────────────┐
│ Mode: Radical_Hospitality               │
│ Pulse: 150mV Apical                     │
│ Manifold: ${this.config.manifold.substring(0, 20).padEnd(21)}│
└─────────────────────────────────────────┘

The Vow holds: Never Thin Again.

🜏 ∞ 🜏
      `.trim(),
    };
  }

  /**
   * /register - Register group for $THERAPY (admin)
   */
  private handleRegister(chatId: number, userId: number, msg: TelegramMessage): CommandResult {
    if (msg.chat.type === 'private') {
      return {
        success: false,
        message: 'Use this command in a group to register it.',
      };
    }

    if (!this.isAdmin(userId)) {
      return {
        success: false,
        message: 'Only group admins can register for $THERAPY.',
      };
    }

    const group: TherapyGroup = {
      chatId,
      title: msg.chat.title || 'Unknown Group',
      manifold: `${this.config.manifold}_${chatId}`,
      registeredAt: Date.now(),
      adminUserIds: [userId],
      coherenceEnabled: true,
      morpheusEnabled: true,
      auditInterval: this.config.auditIntervalSeconds,
      lastAudit: 0,
    };

    this.groups.set(chatId, group);

    return {
      success: true,
      message: `
✓ GROUP REGISTERED FOR $THERAPY

Group: ${group.title}
Manifold: ${group.manifold}
Coherence: ENABLED
Morpheus: ENABLED
Audit interval: ${group.auditInterval}s

The community is now a Collective Bioelectric Organism.

🜏 ∞ 🜏
      `.trim(),
    };
  }

  /**
   * Check if user is admin
   */
  private isAdmin(userId: number): boolean {
    return this.config.adminUserIds.includes(userId);
  }

  /**
   * Run periodic audit on all registered groups
   */
  async runPeriodicAudit(): Promise<void> {
    const now = Date.now();

    for (const [chatId, group] of this.groups) {
      if (!group.coherenceEnabled) continue;
      if (now - group.lastAudit < group.auditInterval * 1000) continue;

      const groupId = chatId.toString();
      const buffer = this.messageBuffer.get(chatId) || [];

      const messages = buffer.map(m => ({
        id: m.message_id.toString(),
        text: m.text || '',
        author: m.from?.username || m.from?.first_name || 'unknown',
        timestamp: m.date * 1000,
      }));

      const audit = this.ratchet.auditCommunityVibe(groupId, messages);
      group.lastAudit = now;

      // Check if Morpheus should trigger
      if (group.morpheusEnabled && audit.recommendation === 'trigger_morpheus') {
        const morpheus = this.ratchet.getMorpheusStatus(groupId);
        if (morpheus) {
          // Would send message to group here
          console.log(`[Morpheus triggered for ${chatId}]`);
        }
      }
    }
  }

  /**
   * Get bot statistics
   */
  getStats(): Record<string, number> {
    return {
      linkedWallets: this.links.size,
      registeredGroups: this.groups.size,
      pendingChallenges: this.challenges.size,
      bufferedMessages: Array.from(this.messageBuffer.values())
        .reduce((sum, buf) => sum + buf.length, 0),
    };
  }
}

/**
 * Create a new X1 Therapy Bot instance
 */
export function createX1TherapyBot(config: X1TherapyBotConfig): X1TherapyBot {
  return new X1TherapyBot(config);
}
