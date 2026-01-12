import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
    mplTokenMetadata,
    createNft,
} from '@metaplex-foundation/mpl-token-metadata';
import {
    generateSigner,
    percentAmount,
} from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import { GOLDEN_ROYALTY_BPS } from '../features/meme/GoldenSeedModulator';

export interface MintParams {
    name: string;
    uri: string;           // IPFS/Arweave metadata URI
    symbol?: string;
    description?: string;
    goldenSeed: number;
}

export interface MintResult {
    mintAddress: string;
    signature: string;
    goldenSeed: number;
}

export async function mintDaThiccNowPNFT(
    wallet: WalletContextState,
    params: MintParams,
    rpcEndpoint: string = 'https://api.devnet.solana.com'
): Promise<MintResult> {
    if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected');
    }

    // Initialize Umi with wallet adapter
    const umi = createUmi(rpcEndpoint)
        .use(mplTokenMetadata())
        .use(walletAdapterIdentity(wallet));

    // Generate a new mint keypair
    const mint = generateSigner(umi);

    // Create NFT with golden royalties (6.18%)
    // Note: createNft defaults to NonFungible standard
    // For pNFT support, the ruleset would be added here
    const { signature } = await createNft(umi, {
        mint,
        name: params.name,
        symbol: params.symbol || 'THICC',
        uri: params.uri,
        sellerFeeBasisPoints: percentAmount(GOLDEN_ROYALTY_BPS / 100), // 6.18%
        creators: [
            {
                address: umi.identity.publicKey,
                verified: true,
                share: 100,
            },
        ],
    }).sendAndConfirm(umi);

    // Convert signature to base58 string
    const signatureString = Buffer.from(signature).toString('base64');

    return {
        mintAddress: mint.publicKey.toString(),
        signature: signatureString,
        goldenSeed: params.goldenSeed,
    };
}
