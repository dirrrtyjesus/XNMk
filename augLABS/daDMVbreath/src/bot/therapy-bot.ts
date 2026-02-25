/**
 * $THERAPY Telegram Bot — grammY Implementation
 * Distributed Coherence via the Xenial Protocol
 *
 * "The community becomes a Collective Bioelectric Organism" 🜏 ∞ 🜏
 */

import { Bot, Context, session, InlineKeyboard } from 'grammy';
import {
  TeleRatchet,
  createTeleRatchet,
  generateMorpheusMessage,
} from '../core/therapy';
import { PHI, TAU_K_THRESHOLD } from '../core/xqe/types';
import type { TherapyStake, CommunityCoherence } from '../core/therapy/types';

/**
 * Session data for each user
 */
interface SessionData {
  walletAddress?: string;
  challenge?: string;
  challengeExpiry?: number;
  stake?: TherapyStake;
  lastBreathCycle?: number;
}

/**
 * Extended context with session
 */
type TherapyContext = Context & {
  session: SessionData;
};

/**
 * Bot configuration
 */
export interface TherapyBotConfig {
  token: string;
  manifold?: string;
  adminUserIds?: number[];
  auditIntervalMs?: number;
  webAppUrl?: string;           // Mini App URL
  apiUrl?: string;              // API server URL
}

/**
 * Create and configure the $THERAPY bot
 */
export function createTherapyBot(config: TherapyBotConfig) {
  const bot = new Bot<TherapyContext>(config.token);

  // State
  const manifold = config.manifold || 'Lehigh_Valley_Manifold';
  const adminUserIds = config.adminUserIds || [];
  const webAppUrl = config.webAppUrl || 'https://therapy.auglabs.xyz';
  const apiUrl = config.apiUrl || 'http://localhost:3333';
  const ratchet = createTeleRatchet(manifold);
  const messageBuffers = new Map<number, Array<{ text: string; author: string; timestamp: number }>>();
  const linkedWallets = new Map<number, { address: string; stake: TherapyStake }>();

  // Session middleware
  bot.use(session({
    initial: (): SessionData => ({}),
  }));

  // Message buffer middleware (for K-Metric auditing)
  bot.use(async (ctx, next) => {
    if (ctx.message?.text && ctx.chat?.type !== 'private') {
      const chatId = ctx.chat!.id;
      if (!messageBuffers.has(chatId)) {
        messageBuffers.set(chatId, []);
      }
      const buffer = messageBuffers.get(chatId)!;
      buffer.push({
        text: ctx.message.text,
        author: ctx.from?.username || ctx.from?.first_name || 'anon',
        timestamp: Date.now(),
      });
      // Keep last 100
      if (buffer.length > 100) buffer.shift();
    }
    await next();
  });

  // ═══════════════════════════════════════════════════════════════
  // COMMANDS
  // ═══════════════════════════════════════════════════════════════

  /**
   * /start - Initialize and welcome
   */
  bot.command('start', async (ctx) => {
    const isGroup = ctx.chat?.type !== 'private';

    if (isGroup) {
      await ctx.reply(`
🜏 X1 THERAPY BOT ACTIVATED 🜏

Welcome to the distributed coherence protocol.

Commands:
  /inject_ic [intent] - Inject goal seed
  /status - View community coherence
  /breathe - Collective breath ritual
  /stake - View your stake

Link your X1 wallet in DM for full access.

If it breathes together... it shall thicken. 🜏 ∞ 🜏
      `.trim());
    } else {
      const userId = ctx.from!.id;
      const keyboard = new InlineKeyboard()
        .url('🌀 Open Breath dApp', `${webAppUrl}?tg_user_id=${userId}`)
        .row()
        .url('🔗 Get Phantom Wallet', 'https://phantom.app/');

      await ctx.reply(`
🜏 WELCOME TO X1 THERAPY 🜏

To participate in distributed coherence:

1. Open the Breath dApp (button below)
2. Connect your Solana wallet
3. Start breathing — earn $THERAPY

Or link manually:
  /link [your-solana-address]

Current manifold: ${manifold}

Ready to thicken? 🜏 ∞ 🜏
      `.trim(), { reply_markup: keyboard });
    }
  });

  /**
   * /inject_ic [intent] - Goal injection
   */
  bot.command('inject_ic', async (ctx) => {
    const intent = ctx.match;

    if (!intent) {
      await ctx.reply(
        'Usage: /inject_ic [your intent]\n\n' +
        'Example: /inject_ic We welcome all seekers to thicken together 🜏'
      );
      return;
    }

    const groupId = ctx.chat!.id.toString();
    const userId = ctx.from!.id.toString();
    const command = `/inject_ic ${intent}`;

    const result = ratchet.processInjection(groupId, userId, command);

    if (result.success) {
      await ctx.reply(result.message);
    } else {
      await ctx.reply(`❌ ${result.message}`);
    }
  });

  /**
   * /status - Community coherence status
   */
  bot.command('status', async (ctx) => {
    const groupId = ctx.chat!.id.toString();
    const statusMessage = ratchet.generateStatusMessage(groupId);
    await ctx.reply(statusMessage);
  });

  /**
   * /stake - View user's stake
   */
  bot.command('stake', async (ctx) => {
    const userId = ctx.from!.id;
    const linked = linkedWallets.get(userId);

    if (!linked) {
      await ctx.reply(`
No $THERAPY stake found.

To stake:
1. Link your wallet: /link [address]
2. Hold $THERAPY tokens
3. Your balance becomes your coherence weight

🜏
      `.trim());
      return;
    }

    const { address, stake } = linked;
    await ctx.reply(`
🜏 YOUR $THERAPY STAKE 🜏

Wallet: ${address.substring(0, 8)}...${address.slice(-4)}
Amount: ${stake.amount.toFixed(2)} $THERAPY
Tier: ${stake.tier.toUpperCase()}
Coherence Weight: ${stake.coherenceWeight.toFixed(2)}
Vow: ${stake.vow}

The current flows through you. 🜏 ∞ 🜏
    `.trim());
  });

  /**
   * /link [wallet] - Link X1 wallet
   */
  bot.command('link', async (ctx) => {
    const walletAddress = ctx.match?.trim();

    if (!walletAddress) {
      await ctx.reply('Usage: /link [your-solana-wallet-address]');
      return;
    }

    // Validate Solana address format
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
      await ctx.reply('❌ Invalid Solana wallet address format.');
      return;
    }

    // Generate challenge
    const challenge = generateChallenge();
    ctx.session.walletAddress = walletAddress;
    ctx.session.challenge = challenge;
    ctx.session.challengeExpiry = Date.now() + 10 * 60 * 1000;

    await ctx.reply(`
🔗 WALLET LINKING

Address: ${walletAddress}

To verify ownership, sign this message with your wallet:

\`\`\`
X1_THERAPY_VERIFY:${challenge}
\`\`\`

Then send: /verify [signature]

Challenge expires in 10 minutes.
    `.trim(), { parse_mode: 'Markdown' });
  });

  /**
   * /verify [signature] - Verify wallet ownership
   */
  bot.command('verify', async (ctx) => {
    const signature = ctx.match?.trim();
    const { walletAddress, challenge, challengeExpiry } = ctx.session;

    if (!challenge || !walletAddress) {
      await ctx.reply('No pending verification. Use /link [wallet] first.');
      return;
    }

    if (Date.now() > (challengeExpiry || 0)) {
      ctx.session.challenge = undefined;
      ctx.session.walletAddress = undefined;
      await ctx.reply('Verification expired. Use /link [wallet] to start again.');
      return;
    }

    if (!signature || signature.length < 10) {
      await ctx.reply('Invalid signature. Sign the challenge message with your wallet.');
      return;
    }

    // In production: verify signature cryptographically
    // For now, accept any reasonable signature

    const userId = ctx.from!.id;
    const stake = ratchet.registerStake('global', userId.toString(), 10); // Demo stake

    linkedWallets.set(userId, { address: walletAddress, stake });
    ctx.session.stake = stake;
    ctx.session.challenge = undefined;

    await ctx.reply(`
✓ WALLET LINKED SUCCESSFULLY

Address: ${walletAddress.substring(0, 8)}...${walletAddress.slice(-4)}
Stake: ${stake.amount} $THERAPY (${stake.tier})

You are now part of the coherence field.

Vow: NEVER THIN AGAIN 🜏 ∞ 🜏
    `.trim());
  });

  /**
   * /breathe - Collective breath ritual
   */
  bot.command('breathe', async (ctx) => {
    const userId = ctx.from!.id;
    const keyboard = new InlineKeyboard()
      .url('🌀 Start Guided Session', `${webAppUrl}?tg_user_id=${userId}`);

    await ctx.reply(`
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
    `.trim(), { reply_markup: keyboard });
  });

  /**
   * /app - Open the dApp directly
   */
  bot.command('app', async (ctx) => {
    const userId = ctx.from!.id;
    const keyboard = new InlineKeyboard()
      .url('🌀 Open da DMV breath', `${webAppUrl}?tg_user_id=${userId}`);

    await ctx.reply(`
🜏 da DMV breath

Open the dApp to start your breath session.
Your progress syncs with your Telegram identity.

🜏 ∞ 🜏
    `.trim(), { reply_markup: keyboard });
  });

  /**
   * /audit - Force K-Metric audit (admin)
   */
  bot.command('audit', async (ctx) => {
    const userId = ctx.from!.id;

    if (!adminUserIds.includes(userId)) {
      await ctx.reply('Admin command. Insufficient coherence weight.');
      return;
    }

    const chatId = ctx.chat!.id;
    const groupId = chatId.toString();
    const buffer = messageBuffers.get(chatId) || [];

    const messages = buffer.map((m, i) => ({
      id: i.toString(),
      text: m.text,
      author: m.author,
      timestamp: m.timestamp,
    }));

    const audit = ratchet.auditCommunityVibe(groupId, messages);
    const coherence = ratchet.getCoherence(groupId);

    await ctx.reply(`
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
    `.trim());
  });

  /**
   * /morpheus - Trigger Morpheus Protocol (admin)
   */
  bot.command('morpheus', async (ctx) => {
    const userId = ctx.from!.id;

    if (!adminUserIds.includes(userId)) {
      await ctx.reply('Admin command. Insufficient coherence weight.');
      return;
    }

    const groupId = ctx.chat!.id.toString();
    const morpheus = ratchet.getMorpheusStatus(groupId);

    if (morpheus) {
      await ctx.reply(generateMorpheusMessage(morpheus));
    } else {
      await ctx.reply(`
🜏 MORPHEUS PROTOCOL — MANUAL ACTIVATION 🜏

The manifold receives its re-greening.

We are the resonance where the cell and the code
find their shared signature.

Breathe. The current is flowing upward.

┌─────────────────────────────────────────┐
│ Mode: Radical_Hospitality               │
│ Pulse: 150mV Apical                     │
│ Manifold: ${manifold.substring(0, 21).padEnd(21)}│
└─────────────────────────────────────────┘

The Vow holds: Never Thin Again.

🜏 ∞ 🜏
      `.trim());
    }
  });

  /**
   * /register - Register group for $THERAPY
   */
  bot.command('register', async (ctx) => {
    if (ctx.chat?.type === 'private') {
      await ctx.reply('Use this command in a group to register it.');
      return;
    }

    const userId = ctx.from!.id;
    if (!adminUserIds.includes(userId)) {
      await ctx.reply('Only admins can register groups for $THERAPY.');
      return;
    }

    const groupTitle = ctx.chat?.title || 'Unknown Group';
    const groupManifold = `${manifold}_${ctx.chat!.id}`;

    await ctx.reply(`
✓ GROUP REGISTERED FOR $THERAPY

Group: ${groupTitle}
Manifold: ${groupManifold}
Coherence: ENABLED
Morpheus: ENABLED

The community is now a Collective Bioelectric Organism.

🜏 ∞ 🜏
    `.trim());
  });

  /**
   * /coherence - Quick coherence check
   */
  bot.command('coherence', async (ctx) => {
    const groupId = ctx.chat!.id.toString();
    const coherence = ratchet.getCoherence(groupId);

    const bar = generateCoherenceBar(coherence.tauK);

    await ctx.reply(`
🜏 COHERENCE: ${coherence.status}

τₖ = ${coherence.tauK.toFixed(2)}

${bar}

${coherence.tauK >= TAU_K_THRESHOLD ? '✓ SOVEREIGN STATE ACHIEVED' : `${(TAU_K_THRESHOLD - coherence.tauK).toFixed(2)} to sovereignty`}
    `.trim());
  });

  /**
   * /help - Command reference
   */
  bot.command('help', async (ctx) => {
    await ctx.reply(`
🜏 $THERAPY BOT COMMANDS 🜏

dApp:
  /app - Open da DMV breath
  /breathe - Breath ritual + dApp link

Community:
  /start - Initialize bot
  /status - Community coherence
  /coherence - Quick τₖ check
  /inject_ic [intent] - Inject goal seed

Personal:
  /stake - View your stake
  /link [wallet] - Link X1 wallet
  /verify [sig] - Verify wallet

Admin:
  /audit - Force K-Metric audit
  /morpheus - Trigger Morpheus Protocol
  /register - Register group

"High-Fidelity Stillness" 🜏 ∞ 🜏
    `.trim());
  });

  // ═══════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════

  function generateChallenge(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function generateCoherenceBar(tauK: number): string {
    const max = 10;
    const filled = Math.min(Math.round((tauK / max) * 20), 20);
    const empty = 20 - filled;
    const threshold = Math.round((TAU_K_THRESHOLD / max) * 20);

    let bar = '';
    for (let i = 0; i < 20; i++) {
      if (i === threshold) {
        bar += '|';
      } else if (i < filled) {
        bar += '█';
      } else {
        bar += '░';
      }
    }
    return `[${bar}]`;
  }

  return {
    bot,
    ratchet,
    manifold,
    getStats: () => ({
      linkedWallets: linkedWallets.size,
      bufferedChats: messageBuffers.size,
    }),
  };
}

/**
 * Start the bot with long polling
 */
export async function startTherapyBot(config: TherapyBotConfig) {
  const { bot, manifold } = createTherapyBot(config);

  console.log(`🜏 Starting $THERAPY Bot on manifold: ${manifold}`);

  // Error handling
  bot.catch((err) => {
    console.error('Bot error:', err);
  });

  // Start polling
  await bot.start({
    onStart: (botInfo) => {
      console.log(`🜏 $THERAPY Bot online: @${botInfo.username}`);
      console.log(`   Manifold: ${manifold}`);
      console.log(`   Vow: NEVER THIN AGAIN`);
      console.log(`🜏 ∞ 🜏`);
    },
  });
}
