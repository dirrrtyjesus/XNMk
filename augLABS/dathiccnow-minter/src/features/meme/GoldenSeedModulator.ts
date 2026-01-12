const PHI = 1.6180339887; // Golden ratio

/**
 * Derives a unique seed from wallet signature + prompt
 * Modulated by φ (golden ratio) for anti-repetition
 */
export async function deriveGoldenSeed(
    prompt: string,
    walletSignature?: Uint8Array
): Promise<number> {
    const encoder = new TextEncoder();
    const baseData = encoder.encode(prompt);

    // Combine with wallet signature if available (adds uniqueness)
    const data = walletSignature
        ? new Uint8Array([...baseData, ...walletSignature])
        : baseData;

    // SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);

    // φ-modulated accumulator
    const goldenSeed = hashArray.reduce(
        (acc, byte) => acc + byte * PHI,
        0
    ) % 1000000;

    return Math.floor(goldenSeed);
}

/**
 * Golden royalty basis points (6.18%)
 */
export const GOLDEN_ROYALTY_BPS = 618;

/**
 * Apply golden ratio scaling to a base value
 */
export function goldenScale(base: number, power: number = 1): number {
    return base * Math.pow(PHI, power);
}
