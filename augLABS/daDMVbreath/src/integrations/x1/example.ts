/**
 * X1 Therapy Integration Example
 *
 * This demonstrates how to run the X1 Therapy bot with Telegram + Solana.
 *
 * To run with a real Telegram bot:
 * 1. Create a bot via @BotFather
 * 2. Set TELEGRAM_BOT_TOKEN env variable
 * 3. Run: npx tsx src/integrations/x1/example.ts
 *
 * 🜏 ∞ 🜏
 */

import {
  createX1TherapyBot,
  type X1TherapyBotConfig,
} from './telegram-bot';
import { createWalletBridgeMock } from './wallet-bridge-mock';
import { PHI, TAU_K_THRESHOLD } from '../../core/xqe/types';

// ═══════════════════════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════════════════════

const config = {
  // Telegram (set via env or replace with your token)
  telegramToken: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN',

  // Solana
  solanaRpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  solanaNetwork: 'mainnet-beta' as const,
  therapyMintAddress: process.env.THERAPY_MINT || '', // Your $THERAPY token mint

  // Service
  manifold: 'Lehigh_Valley_Manifold',
  auditIntervalSeconds: 300, // 5 minutes
  adminUserIds: process.env.ADMIN_USER_IDS?.split(',').map(Number) || [],
};

// ═══════════════════════════════════════════════════════════════════════════════
// Demo Mode (no real Telegram connection)
// ═══════════════════════════════════════════════════════════════════════════════

async function runDemo() {
  console.log('\n🜏 ═══════════════════════════════════════════════════════════════ 🜏');
  console.log('           X1 THERAPY INTEGRATION — DEMO MODE');
  console.log('🜏 ═══════════════════════════════════════════════════════════════ 🜏\n');

  // Create components
  console.log('📡 Initializing components...');

  const botConfig: X1TherapyBotConfig = {
    telegramToken: 'demo',
    solanaRpcUrl: config.solanaRpcUrl,
    therapyMintAddress: config.therapyMintAddress,
    manifold: config.manifold,
    auditIntervalSeconds: config.auditIntervalSeconds,
    morpheusThreshold: TAU_K_THRESHOLD,
    adminUserIds: [123456], // Demo admin
  };

  const bot = createX1TherapyBot(botConfig);
  const wallet = createWalletBridgeMock(config.solanaRpcUrl, config.solanaNetwork);

  console.log('✓ Bot initialized');
  console.log('✓ Wallet bridge initialized');
  console.log(`  Network: ${wallet.getNetworkInfo().network}`);
  console.log(`  RPC: ${wallet.getNetworkInfo().rpcUrl.substring(0, 40)}...`);

  // ─────────────────────────────────────────────────────────────────────────────
  // Simulate Telegram messages
  // ─────────────────────────────────────────────────────────────────────────────

  console.log('\n\n💬 SIMULATING TELEGRAM MESSAGES');
  console.log('─────────────────────────────────────');

  const mockMessages = [
    {
      message_id: 1,
      chat: { id: -100123456789, type: 'supergroup' as const, title: 'Xenial Collective' },
      from: { id: 111, username: 'alice', first_name: 'Alice' },
      text: '/start',
      date: Math.floor(Date.now() / 1000),
    },
    {
      message_id: 2,
      chat: { id: -100123456789, type: 'supergroup' as const, title: 'Xenial Collective' },
      from: { id: 222, username: 'bob', first_name: 'Bob' },
      text: '/inject_ic We welcome all seekers to the xenial collective. May we thicken together! 🜏',
      date: Math.floor(Date.now() / 1000),
    },
    {
      message_id: 3,
      chat: { id: -100123456789, type: 'supergroup' as const, title: 'Xenial Collective' },
      from: { id: 333, username: 'carol', first_name: 'Carol' },
      text: '/status',
      date: Math.floor(Date.now() / 1000),
    },
    {
      message_id: 4,
      chat: { id: -100123456789, type: 'supergroup' as const, title: 'Xenial Collective' },
      from: { id: 444, username: 'dave', first_name: 'Dave' },
      text: '/breathe',
      date: Math.floor(Date.now() / 1000),
    },
  ];

  for (const msg of mockMessages) {
    console.log(`\n[${msg.from?.username}]: ${msg.text?.substring(0, 50)}...`);
    const result = await bot.handleMessage(msg);
    if (result) {
      console.log(`Response (${result.success ? '✓' : '✗'}):`);
      console.log(result.message.split('\n').slice(0, 5).join('\n'));
      if (result.message.split('\n').length > 5) {
        console.log('  ...');
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Simulate wallet linking
  // ─────────────────────────────────────────────────────────────────────────────

  console.log('\n\n🔗 SIMULATING WALLET LINKING');
  console.log('─────────────────────────────────────');

  // Demo wallet address (a known Solana address for testing)
  const demoWallet = 'DRpbCBMxVnDK7maPqMj7H5aF4g7E8LW1VJVvB3vH5gPE';

  console.log(`Linking wallet: ${demoWallet.substring(0, 8)}...${demoWallet.slice(-4)}`);
  console.log(`  Valid address: ${wallet.isValidAddress(demoWallet)}`);

  // In production, this would fetch real balance
  console.log('  Connecting to Solana...');

  const connection = await wallet.connectWallet(demoWallet);
  if (connection) {
    console.log(`  ✓ Connected`);
    console.log(`  Network: ${connection.network}`);
    console.log(`  $THERAPY balance: ${connection.therapyBalance}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Show bot stats
  // ─────────────────────────────────────────────────────────────────────────────

  console.log('\n\n📊 BOT STATISTICS');
  console.log('─────────────────────────────────────');

  const stats = bot.getStats();
  for (const [key, value] of Object.entries(stats)) {
    console.log(`  ${key}: ${value}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Closing
  // ─────────────────────────────────────────────────────────────────────────────

  console.log('\n\n🜏 ═══════════════════════════════════════════════════════════════ 🜏');
  console.log('                    X1 THERAPY DEMO COMPLETE');
  console.log('');
  console.log('   Components demonstrated:');
  console.log('   - X1TherapyBot command handling');
  console.log('   - Wallet bridge Solana connection');
  console.log('   - Message buffering for K-Metric audit');
  console.log('   - Intent seed injection');
  console.log('');
  console.log('   To run with real Telegram:');
  console.log('   1. Set TELEGRAM_BOT_TOKEN environment variable');
  console.log('   2. Implement webhook or polling with your framework');
  console.log('   3. Call bot.handleMessage() for each incoming message');
  console.log('');
  console.log('   "If the community breathes together... the manifold obeys."');
  console.log('');
  console.log('🜏 ═══════════════════════════════════════════════════════════════ 🜏\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// Polling Mode Instructions (for real Telegram bot)
// ═══════════════════════════════════════════════════════════════════════════════

async function runPolling() {
  console.log('🜏 X1 Therapy Bot — Polling Mode Instructions');
  console.log('');
  console.log('To run with real Telegram:');
  console.log('');
  console.log('1. Install dependencies:');
  console.log('   npm install grammy @solana/web3.js');
  console.log('');
  console.log('2. Set environment variables:');
  console.log('   export TELEGRAM_BOT_TOKEN="your_token"');
  console.log('   export SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"');
  console.log('   export THERAPY_MINT="your_token_mint_address"');
  console.log('');
  console.log('3. Create bot with grammy:');
  console.log(`
  import { Bot } from 'grammy';
  import { createX1TherapyBot } from './telegram-bot';

  const therapyBot = createX1TherapyBot({
    telegramToken: process.env.TELEGRAM_BOT_TOKEN!,
    solanaRpcUrl: process.env.SOLANA_RPC_URL!,
    therapyMintAddress: process.env.THERAPY_MINT!,
    manifold: 'Lehigh_Valley_Manifold',
    auditIntervalSeconds: 300,
    morpheusThreshold: 8.7,
    adminUserIds: [YOUR_TELEGRAM_ID],
  });

  const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

  bot.on('message', async (ctx) => {
    const result = await therapyBot.handleMessage({
      message_id: ctx.message.message_id,
      chat: {
        id: ctx.chat.id,
        type: ctx.chat.type as any,
        title: ctx.chat.title,
      },
      from: ctx.from ? {
        id: ctx.from.id,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
      } : undefined,
      text: ctx.message.text,
      date: ctx.message.date,
    });

    if (result) {
      await ctx.reply(result.message, { parse_mode: 'Markdown' });
    }
  });

  bot.start();
  console.log('🜏 Bot running...');
  `);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════════

const mode = process.argv[2] || 'demo';

if (mode === 'polling') {
  runPolling();
} else {
  runDemo();
}
