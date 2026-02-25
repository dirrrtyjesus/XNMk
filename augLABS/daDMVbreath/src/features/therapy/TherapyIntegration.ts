
/**
 * $THERAPY Integration Service
 * Simulates the injection of .ic seeds into the local manifold
 */

import type { SeedPayload } from './types';

const MOCK_DELAY = 618; // ms (Golden Ratio related)

/**
 * Simulates broadcasting an Intent Seed to the Mountaintop Node
 */
export async function injectSeed(payload: SeedPayload): Promise<boolean> {
    console.log(`[AugLabs] Injecting Seed... 
    Depth: ${payload.depth}
    Intent: ${payload.intent}
    Phase: ${payload.phase}
    Timestamp: ${payload.timestamp}`);

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[AugLabs] Seed Injected. 🜏 Coherence Ratcheted.`);
            resolve(true);
        }, MOCK_DELAY);
    });
}

/**
 * Claims $THERAPY tokens for a completed session — Proof of Breath
 * Uses the /api/session/claim endpoint backed by the protocol treasury.
 */
export async function claimRewards(
    sessionId: string,
    walletAddress: string
): Promise<{ success: boolean; signature?: string }> {
    console.log(`[XNMk] Claiming $THERAPY for session ${sessionId.slice(0, 12)}...`);

    try {
        const ORACLE_URL = import.meta.env.VITE_ORACLE_URL || 'http://localhost:3333';
        const response = await fetch(`${ORACLE_URL}/api/session/claim`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, walletAddress }),
        });

        const data = await response.json();

        if (data.success) {
            console.log(`[XNMk] $THERAPY Dispensed 🜏 Sig: ${data.signature}`);
            return { success: true, signature: data.signature };
        } else {
            console.error(`[XNMk] Oracle Error: ${data.error}`);
            return { success: false };
        }
    } catch (e) {
        console.error(`[XNMk] Oracle Unreachable:`, e);
        return { success: false };
    }
}
