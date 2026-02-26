/**
 * GET /api/treasury — Vercel Serverless Function
 *
 * Treasury health check. Returns current $THERAPY balance
 * and readiness to dispense rewards.
 *
 * 🜏 ∞ 🜏
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTreasuryStatus } from '../src/services/therapy-mint.js';
import { getLitBioRegenStatus } from '../src/services/lit-bioregen-bridge.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const [treasury, litBioRegen] = await Promise.all([
      getTreasuryStatus(),
      getLitBioRegenStatus(),
    ]);
    return res.status(200).json({ ...treasury, litBioRegen });
  } catch (err) {
    return res.status(500).json({
      isHealthy: false,
      error: err instanceof Error ? err.message : 'Treasury check failed',
    });
  }
}
