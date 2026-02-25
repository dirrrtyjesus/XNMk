
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createMetadataAccountV3 } from '@metaplex-foundation/mpl-token-metadata';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';
import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// CONFIGURATION
const RPC_URL = process.env.VITE_SOLANA_RPC_URL || 'https://rpc.mainnet.x1.xyz';
const MINT_ADDRESS = process.env.VITE_THERAPY_MINT;
// User must provide this argument
const METADATA_URI = process.argv[2];

if (!MINT_ADDRESS) {
    console.error('❌ Error: VITE_THERAPY_MINT is not defined in environment (check .env)');
    process.exit(1);
}

if (!METADATA_URI) {
    console.error('❌ Error: Please provide the Metadata URI as the first argument.');
    console.error('Usage: npx ts-node scripts/inject_metadata.ts <URI>');
    process.exit(1);
}

async function main() {
    console.log('🜏 Starting Metadata Injection Sequence...');
    console.log(`📡 RPC: ${RPC_URL}`);
    console.log(`💎 Mint: ${MINT_ADDRESS}`);
    console.log(`🔗 URI: ${METADATA_URI}`);

    // 1. Setup Umi
    const umi = createUmi(RPC_URL);

    // 2. Load Wallet
    const homedir = os.homedir();
    const keypairPath = path.join(homedir, '.config', 'solana', 'therapy-deployer.json');

    if (!fs.existsSync(keypairPath)) {
        console.error(`❌ Wallet not found at ${keypairPath}`);
        process.exit(1);
    }

    const keypairFile = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
    const keypair = Keypair.fromSecretKey(new Uint8Array(keypairFile));
    const umiKeypair = fromWeb3JsKeypair(keypair);

    umi.use(keypairIdentity(umiKeypair));
    console.log(`🔑 Deployer: ${umiKeypair.publicKey}`);

    // 3. Create Metadata
    console.log('⏳ Injecting Metadata...');

    try {
        const tx = await createMetadataAccountV3(umi, {
            mint: publicKey(MINT_ADDRESS),
            mintAuthority: umiKeypair,
            payer: umiKeypair,
            data: {
                name: 'Therapy',
                symbol: 'THERAPY',
                uri: METADATA_URI,
                sellerFeeBasisPoints: 0,
                creators: [
                    {
                        address: umiKeypair.publicKey,
                        verified: true,
                        share: 100,
                    },
                ],
                collection: null,
                uses: null,
            },
            isMutable: true,
            collectionDetails: null,
        }).sendAndConfirm(umi);

        const signature = Buffer.from(tx.signature).toString('hex');
        console.log('✅ Metadata Injected Successfully!');
        console.log(`📝 Signature: ${signature}`);
        console.log('🜏 The Token is now thick with meaning.');

    } catch (error) {
        console.error('❌ Injection Failed:', error);
    }
}

main();
