/**
 * $THERAPY Token Dispense Service — SERVER ONLY
 *
 * Proof of Breath → on-chain $THERAPY transfer
 *
 * Uses the protocol treasury (therapy-deployer.json) to transfer pre-minted
 * $THERAPY tokens to breathers upon session completion.
 *
 * Mint: H5He8hgt4TRkvcW52ftMGagRbFBJxMNfeyhrFeqgPsoJ (X1 Mainnet)
 * Treasury authority: ~/.config/solana/therapy-deployer.json
 *
 * 🜏 High-Fidelity Stillness. The reward for metabolic coherence. 🜏
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  getMint,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// ─── Config ──────────────────────────────────────────────────────────────────

const RPC_URL = process.env.VITE_SOLANA_RPC_URL || 'https://rpc.mainnet.x1.xyz';
const THERAPY_MINT_ADDRESS = process.env.VITE_THERAPY_MINT || 'H5He8hgt4TRkvcW52ftMGagRbFBJxMNfeyhrFeqgPsoJ';
const KEYPAIR_PATH = process.env.THERAPY_DEPLOYER_KEY_PATH
  || path.join(os.homedir(), '.config', 'solana', 'therapy-deployer.json');

/** $THERAPY token decimals — matches XNM precision (alpha = 9 decimals) */
const THERAPY_DECIMALS = 9;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DispenseResult {
  signature: string;
  amount: number;       // human-readable amount (e.g. 9.5)
  amountRaw: bigint;   // raw lamports (9 decimals)
  mint: string;
  recipient: string;
}

export interface TreasuryStatus {
  balance: number;      // human-readable
  mint: string;
  authority: string;
  isHealthy: boolean;
}

// ─── Internals ───────────────────────────────────────────────────────────────

function loadTreasuryKeypair(): Keypair {
  // Priority 1: environment variable — works on Vercel, Railway, any hosted env
  const envKey = process.env.THERAPY_MINT_AUTHORITY_KEY;
  if (envKey) {
    return Keypair.fromSecretKey(new Uint8Array(JSON.parse(envKey)));
  }
  // Priority 2: filesystem — local dev only
  if (!fs.existsSync(KEYPAIR_PATH)) {
    throw new Error(
      'Treasury keypair not found. ' +
      'Set THERAPY_MINT_AUTHORITY_KEY env var (JSON array) for hosted environments, ' +
      `or ensure ${KEYPAIR_PATH} exists for local dev.`
    );
  }
  return Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf-8')))
  );
}

function toRawAmount(amount: number): bigint {
  // Avoid floating point: multiply by 10^9 using integer math
  return BigInt(Math.round(amount * 10 ** THERAPY_DECIMALS));
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Dispense $THERAPY tokens from the protocol treasury to a recipient wallet.
 * Called by the server after validating a completed breath session.
 *
 * @param recipientAddress - Solana wallet address (base58)
 * @param amount           - Human-readable amount (e.g. 9.5 for 9.5 THERAPY)
 */
export async function dispenseTherapy(
  recipientAddress: string,
  amount: number
): Promise<DispenseResult> {
  if (amount <= 0) throw new Error('Amount must be positive');

  const connection = new Connection(RPC_URL, 'confirmed');
  const treasury = loadTreasuryKeypair();
  const mint = new PublicKey(THERAPY_MINT_ADDRESS);
  const recipient = new PublicKey(recipientAddress);
  const amountRaw = toRawAmount(amount);

  // Get/create treasury's ATA (source)
  const sourceAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    treasury,
    mint,
    treasury.publicKey
  );

  // Get/create recipient's ATA (destination)
  const destAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    treasury,   // treasury pays for ATA creation if needed
    mint,
    recipient
  );

  const tx = new Transaction().add(
    createTransferInstruction(
      sourceAccount.address,
      destAccount.address,
      treasury.publicKey,
      amountRaw,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const signature = await sendAndConfirmTransaction(connection, tx, [treasury]);

  return {
    signature,
    amount,
    amountRaw,
    mint: THERAPY_MINT_ADDRESS,
    recipient: recipientAddress,
  };
}

/**
 * Check the treasury balance and health.
 * Call this on server startup to verify the mint is funded.
 */
export async function getTreasuryStatus(): Promise<TreasuryStatus> {
  const connection = new Connection(RPC_URL, 'confirmed');

  let authority = 'unknown';
  let balance = 0;
  let isHealthy = false;

  try {
    const treasury = loadTreasuryKeypair();
    authority = treasury.publicKey.toBase58();

    const mint = new PublicKey(THERAPY_MINT_ADDRESS);
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      treasury,
      mint,
      treasury.publicKey
    );

    const mintInfo = await getMint(connection, mint);
    balance = Number(ata.amount) / 10 ** mintInfo.decimals;
    isHealthy = balance > 0;
  } catch (_) {
    isHealthy = false;
  }

  return {
    balance,
    mint: THERAPY_MINT_ADDRESS,
    authority,
    isHealthy,
  };
}
