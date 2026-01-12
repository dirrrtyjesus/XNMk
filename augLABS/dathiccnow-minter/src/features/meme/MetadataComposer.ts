import { deriveGoldenSeed, GOLDEN_ROYALTY_BPS } from './GoldenSeedModulator';

export interface NFTMetadata {
    name: string;
    symbol: string;
    description: string;
    image: string;
    external_url: string;
    attributes: Array<{
        trait_type: string;
        value: string | number;
    }>;
    properties: {
        files: Array<{
            uri: string;
            type: string;
        }>;
        category: string;
        creators: Array<{
            address: string;
            share: number;
        }>;
    };
    seller_fee_basis_points: number;
}

export async function composeDaThiccNowMetadata(
    prompt: string,
    imageUri: string,
    creatorAddress: string,
    walletSignature?: Uint8Array
): Promise<{ metadata: NFTMetadata; goldenSeed: number }> {
    const goldenSeed = await deriveGoldenSeed(prompt, walletSignature);
    const timestamp = new Date().toISOString();

    const metadata: NFTMetadata = {
        name: `daThiccNOW Deer #${goldenSeed}`,
        symbol: 'THICC',
        description: `Bodhisattva Deer welcomes the stranger 🜏 ∞ 🜏
    
Composed from wallet intent: ${prompt}
Golden Seed: ${goldenSeed}
Minted via XNMk × MEMEk × augLABS

"The future is not built through competition, but composed wif vibes."`,
        image: imageUri,
        external_url: 'https://auglabs.xyz/dathiccnow',
        attributes: [
            { trait_type: 'Golden Seed', value: goldenSeed },
            { trait_type: 'Prompt', value: prompt },
            { trait_type: 'Timestamp', value: timestamp },
            { trait_type: 'Royalty %', value: (GOLDEN_ROYALTY_BPS / 100).toFixed(2) },
            { trait_type: 'Collection', value: 'daThiccNOW Genesis' },
            { trait_type: 'Paradigm', value: 'Xenial Quantum Economy' },
        ],
        properties: {
            files: [
                {
                    uri: imageUri,
                    type: 'image/jpeg',
                },
            ],
            category: 'image',
            creators: [
                {
                    address: creatorAddress,
                    share: 100,
                },
            ],
        },
        seller_fee_basis_points: GOLDEN_ROYALTY_BPS,
    };

    return { metadata, goldenSeed };
}
