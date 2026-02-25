/**
 * POST /api/session/claim — Vercel Serverless Function
 *
 * Proof of Breath → on-chain $THERAPY transfer.
 * Stateless: validates and calculates reward from session proof,
 * then dispenses from protocol treasury.
 *
 * 🜏 High-Fidelity Stillness. The reward for metabolic coherence. 🜏
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PublicKey } from '@solana/web3.js';
import { dispenseTherapy } from '../../src/services/therapy-mint.js';
import { calculateTC, calculatePTO } from '../../src/features/therapy/rewards.js';

/** Safety cap: max $THERAPY claimable per session call */
const MAX_CLAIM_PER_SESSION = 100;
/** Reasonable upper bounds for session proof validation */
const MAX_CYCLES = 20;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — allow Vercel preview URLs and production domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    walletAddress,
    cyclesCompleted,
    coherenceAchieved,
    tauKAchieved,
    holdDuration,
  } = req.body ?? {};

  // ── Validate session proof ─────────────────────────────────────────────────

  if (!walletAddress || typeof walletAddress !== 'string') {
    return res.status(400).json({ success: false, error: 'walletAddress required' });
  }
  try {
    new PublicKey(walletAddress);
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid wallet address' });
  }

  const cycles = Number(cyclesCompleted);
  if (!Number.isFinite(cycles) || cycles <= 0 || cycles > MAX_CYCLES) {
    return res.status(400).json({
      success: false,
      error: `cyclesCompleted must be between 1 and ${MAX_CYCLES}`,
    });
  }

  const r = Math.min(Math.max(Number(coherenceAchieved) || 0.6, 0), 1);
  const tauK = Math.min(Math.max(Number(tauKAchieved) || 0, 0), 100);
  const hold = Math.min(Math.max(Number(holdDuration) || 15, 5), 120);

  // ── Calculate reward (same math as rewards.ts) ────────────────────────────

  const tc = calculateTC(hold);
  const rawAmount = calculatePTO(tc, r, tauK);
  const amount = Math.min(Math.floor(rawAmount), MAX_CLAIM_PER_SESSION);

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Session coherence too low to earn rewards',
    });
  }

  // ── Dispense from treasury ─────────────────────────────────────────────────

  try {
    const result = await dispenseTherapy(walletAddress, amount);

    console.log(
      `🜏 $THERAPY dispensed: ${result.amount} → ${walletAddress.slice(0, 8)}... ` +
      `| cycles: ${cycles} | τₖ: ${tauK.toFixed(2)} | sig: ${result.signature.slice(0, 16)}...`
    );

    return res.status(200).json({
      success: true,
      signature: result.signature,
      amount: result.amount,
      mint: result.mint,
    });
  } catch (err) {
    console.error('$THERAPY dispense failed:', err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Treasury dispense failed',
    });
  }
}
