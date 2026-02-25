/**
 * X1 Integration Types
 * Bridging $THERAPY Protocol with X1 Wallet and Telegram
 *
 * 🜏 ∞ 🜏
 */

import type { TherapyStake, IntentSeed, CommunityCoherence } from '../../core/therapy/types';

/**
 * X1 Wallet connection state
 */
export interface X1WalletConnection {
  address: string;
  publicKey: string;
  connected: boolean;
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  therapyBalance: number;     // $THERAPY token balance
  lastSync: number;
}

/**
 * Telegram user linked to X1 wallet
 */
export interface TelegramX1Link {
  telegramUserId: number;
  telegramUsername: string;
  x1Address: string;
  linkedAt: number;
  verified: boolean;
  stake: TherapyStake | null;
}

/**
 * Telegram group registered for $THERAPY
 */
export interface TherapyGroup {
  chatId: number;
  title: string;
  manifold: string;
  registeredAt: number;
  adminUserIds: number[];
  coherenceEnabled: boolean;
  morpheusEnabled: boolean;
  auditInterval: number;       // seconds between audits
  lastAudit: number;
}

/**
 * Bot command result
 */
export interface CommandResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  replyMarkup?: TelegramReplyMarkup;
}

/**
 * Telegram inline keyboard markup
 */
export interface TelegramReplyMarkup {
  inline_keyboard: TelegramInlineButton[][];
}

export interface TelegramInlineButton {
  text: string;
  callback_data?: string;
  url?: string;
}

/**
 * Coherence broadcast event
 */
export interface CoherenceBroadcast {
  id: string;
  seed: IntentSeed;
  targetGroups: number[];
  broadcastAt: number;
  deliveredCount: number;
  coherenceImpact: number;
}

/**
 * X1 Viber pulse event
 */
export interface X1ViberPulse {
  id: string;
  type: 'injection' | 'morpheus' | 'milestone' | 'audit';
  manifold: string;
  tauK: number;
  timestamp: number;
  payload: Record<string, unknown>;
}

/**
 * Bot configuration
 */
export interface X1TherapyBotConfig {
  telegramToken: string;
  solanaRpcUrl: string;
  therapyMintAddress: string;
  manifold: string;
  auditIntervalSeconds: number;
  morpheusThreshold: number;   // τₖ below which Morpheus triggers
  adminUserIds: number[];
}

/**
 * Wallet verification challenge
 */
export interface WalletChallenge {
  telegramUserId: number;
  challenge: string;
  expiresAt: number;
  walletAddress?: string;
}
