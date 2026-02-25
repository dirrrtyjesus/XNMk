/**
 * $THERAPY Bot Entry Point
 *
 * Usage:
 *   TELEGRAM_BOT_TOKEN=xxx npx ts-node src/bot/index.ts
 *
 * Or with admin:
 *   TELEGRAM_BOT_TOKEN=xxx ADMIN_IDS=123,456 npx ts-node src/bot/index.ts
 *
 * 🜏 ∞ 🜏
 */

import { startTherapyBot } from './therapy-bot';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN environment variable required');
  console.error('');
  console.error('Usage:');
  console.error('  TELEGRAM_BOT_TOKEN=xxx npx ts-node src/bot/index.ts');
  console.error('');
  console.error('Get your bot token from @BotFather on Telegram');
  process.exit(1);
}

// Parse admin IDs if provided
const adminIds = process.env.ADMIN_IDS
  ? process.env.ADMIN_IDS.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
  : [];

// Parse manifold name
const manifold = process.env.MANIFOLD || 'Lehigh_Valley_Manifold';

console.log('🜏 $THERAPY Protocol Initializing...');
console.log(`   Manifold: ${manifold}`);
if (adminIds.length > 0) {
  console.log(`   Admins: ${adminIds.join(', ')}`);
}
console.log('');

startTherapyBot({
  token,
  manifold,
  adminUserIds: adminIds,
}).catch((err) => {
  console.error('Failed to start bot:', err);
  process.exit(1);
});
