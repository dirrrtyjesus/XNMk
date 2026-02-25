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

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const status = await getTreasuryStatus();
    return res.status(200).json(status);
  } catch (err) {
    return res.status(500).json({
      isHealthy: false,
      error: err instanceof Error ? err.message : 'Treasury check failed',
    });
  }
}
