
import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import {
    createTransferInstruction,
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// CONFIG
const RPC_URL = process.env.VITE_SOLANA_RPC_URL || 'https://rpc.mainnet.x1.xyz';
const MINT_ADDRESS = process.env.VITE_THERAPY_MINT;

// USAGE: npx ts-node scripts/dispense_reward.ts <RECIPIENT_ADDRESS> <AMOUNT>
const RECIPIENT = process.argv[2];
const AMOUNT = parseFloat(process.argv[3] || '10'); // Default 10 $THERAPY

if (!MINT_ADDRESS) {
    console.error('❌ Error: VITE_THERAPY_MINT is not defined in environment.');
    process.exit(1);
}

if (!RECIPIENT) {
    console.error('❌ Error: Recipient Address Required.');
    console.error('Usage: npx ts-node scripts/dispense_reward.ts <WALLET> <AMOUNT>');
    process.exit(1);
}

async function main() {
    console.log(`🜏 Dispensing Reward: ${AMOUNT} $THERAPY`);
    console.log(`📡 Network: ${RPC_URL}`);
    console.log(`📩 To: ${RECIPIENT.substring(0, 8)}...`);

    const connection = new Connection(RPC_URL, 'confirmed');

    // Load Deployer (The "Bank")
    const homedir = os.homedir();
    const keypairPath = path.join(homedir, '.config', 'solana', 'therapy-deployer.json');
    if (!fs.existsSync(keypairPath)) {
        console.error(`❌ Wallet not found at ${keypairPath}`);
        process.exit(1);
    }
    const keypair = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(keypairPath, 'utf-8')))
    );

    console.log(`🏦 From Protocol Treasury: ${keypair.publicKey.toBase58()}`);

    try {
        const mintPubkey = new PublicKey(MINT_ADDRESS);
        const recipientPubkey = new PublicKey(RECIPIENT);

        // 1. Get/Create Source ATA
        const sourceAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mintPubkey,
            keypair.publicKey
        );

        // 2. Get/Create Destination ATA
        const destAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mintPubkey,
            recipientPubkey
        );

        // 3. Create Transfer Instruction
        const amountRaw = AMOUNT * 1_000_000_000; // 9 Decimals

        const tx = new Transaction().add(
            createTransferInstruction(
                sourceAccount.address,
                destAccount.address,
                keypair.publicKey,
                amountRaw,
                [],
                TOKEN_PROGRAM_ID
            )
        );

        console.log('⏳ Sending Transaction...');

        const signature = await sendAndConfirmTransaction(
            connection,
            tx,
            [keypair]
        );

        console.log('✅ Reward Dispensed!');
        console.log(`📝 Signature: ${signature}`);
        console.log('🜏 Integrity maintained.');

    } catch (error) {
        console.error('❌ Dispense Failed:', error);
    }
}

main();
