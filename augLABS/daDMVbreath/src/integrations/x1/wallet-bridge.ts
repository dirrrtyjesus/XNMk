/**
 * X1 Wallet Bridge
 * Connects $THERAPY Protocol to Solana for token verification
 *
 * Uses the same Solana infrastructure as daThiccNOW minter
 *
 * 🜏 ∞ 🜏
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PHI } from '../../core/xqe/types';
import { getStakeTier, calculateCoherenceWeight } from '../../core/therapy/composer';
import type { TherapyStake, TherapyTier } from '../../core/therapy/types';
import type { X1WalletConnection } from './types';

/**
 * Default RPC endpoints
 */
const RPC_ENDPOINTS = {
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
};

/**
 * Token account layout offsets (SPL Token)
 */
const TOKEN_ACCOUNT_LAYOUT = {
  MINT_OFFSET: 0,
  OWNER_OFFSET: 32,
  AMOUNT_OFFSET: 64,
};

/**
 * X1 Wallet Bridge for Solana integration
 */
export class X1WalletBridge {
  private connection: Connection;
  private network: 'mainnet-beta' | 'devnet' | 'testnet';
  private therapyMintAddress: string;
  private connectionCache: Map<string, X1WalletConnection> = new Map();

  constructor(
    rpcUrl?: string,
    network: 'mainnet-beta' | 'devnet' | 'testnet' = 'mainnet-beta',
    therapyMintAddress?: string
  ) {
    this.network = network;
    this.connection = new Connection(
      rpcUrl || RPC_ENDPOINTS[network],
      'confirmed'
    );
    // Default to a placeholder mint address (would be real $THERAPY token)
    this.therapyMintAddress = therapyMintAddress || '11111111111111111111111111111111';
  }

  /**
   * Verify a wallet address is valid
   */
  isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get SOL balance for a wallet
   */
  async getSolBalance(address: string): Promise<number> {
    try {
      const pubkey = new PublicKey(address);
      const balance = await this.connection.getBalance(pubkey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Failed to get SOL balance:', error);
      return 0;
    }
  }

  /**
   * Get $THERAPY token balance for a wallet
   * Returns the token balance (not lamports)
   */
  async getTherapyBalance(walletAddress: string): Promise<number> {
    try {
      const walletPubkey = new PublicKey(walletAddress);
      const mintPubkey = new PublicKey(this.therapyMintAddress);

      // Find associated token account
      const tokenAccounts = await this.connection.getTokenAccountsByOwner(
        walletPubkey,
        { mint: mintPubkey }
      );

      if (tokenAccounts.value.length === 0) {
        return 0;
      }

      // Sum all token account balances
      let totalBalance = 0;
      for (const account of tokenAccounts.value) {
        const data = account.account.data;
        // Amount is at offset 64, 8 bytes (u64)
        const amount = data.readBigUInt64LE(TOKEN_ACCOUNT_LAYOUT.AMOUNT_OFFSET);
        totalBalance += Number(amount);
      }

      // Assuming 9 decimals (standard SPL token)
      return totalBalance / 1e9;
    } catch (error) {
      console.error('Failed to get $THERAPY balance:', error);
      return 0;
    }
  }

  /**
   * Create wallet connection state
   */
  async connectWallet(address: string): Promise<X1WalletConnection | null> {
    if (!this.isValidAddress(address)) {
      return null;
    }

    // Check cache
    if (this.connectionCache.has(address)) {
      const cached = this.connectionCache.get(address)!;
      // Refresh if older than 5 minutes
      if (Date.now() - cached.lastSync < 5 * 60 * 1000) {
        return cached;
      }
    }

    const therapyBalance = await this.getTherapyBalance(address);

    const connection: X1WalletConnection = {
      address,
      publicKey: address,
      connected: true,
      network: this.network,
      therapyBalance,
      lastSync: Date.now(),
    };

    this.connectionCache.set(address, connection);
    return connection;
  }

  /**
   * Convert wallet connection to TherapyStake
   */
  connectionToStake(
    connection: X1WalletConnection,
    userId: string
  ): TherapyStake {
    const amount = connection.therapyBalance;
    const tier = getStakeTier(amount);

    const stake: TherapyStake = {
      holder: userId,
      amount,
      coherenceWeight: 0,
      tier,
      stakedAt: Date.now(),
      vow: 'NEVER_THIN',
    };

    // Calculate coherence weight
    const tierMultiplier = {
      seed: 1,
      sprout: PHI,
      branch: Math.pow(PHI, 2),
      canopy: Math.pow(PHI, 3),
      sovereign: Math.pow(PHI, 5),
    };
    stake.coherenceWeight = amount * tierMultiplier[tier];

    return stake;
  }

  /**
   * Refresh stake from on-chain balance
   */
  async refreshStake(stake: TherapyStake, walletAddress: string): Promise<TherapyStake> {
    const connection = await this.connectWallet(walletAddress);
    if (!connection) {
      return stake;
    }

    return this.connectionToStake(connection, stake.holder);
  }

  /**
   * Verify wallet ownership via signature
   * In production, would verify ed25519 signature
   */
  verifySignature(
    message: string,
    signature: string,
    publicKey: string
  ): boolean {
    // In production, use @solana/web3.js to verify signature
    // For now, basic validation
    try {
      new PublicKey(publicKey);
      return signature.length >= 88; // Base58 encoded signature length
    } catch {
      return false;
    }
  }

  /**
   * Generate signing message for wallet verification
   */
  generateSigningMessage(challenge: string): string {
    return `X1_THERAPY_VERIFY:${challenge}`;
  }

  /**
   * Get cached connection
   */
  getCachedConnection(address: string): X1WalletConnection | undefined {
    return this.connectionCache.get(address);
  }

  /**
   * Clear connection cache
   */
  clearCache(): void {
    this.connectionCache.clear();
  }

  /**
   * Get network info
   */
  getNetworkInfo(): { network: string; rpcUrl: string; mint: string } {
    return {
      network: this.network,
      rpcUrl: this.connection.rpcEndpoint,
      mint: this.therapyMintAddress,
    };
  }
}

/**
 * Create a new X1 Wallet Bridge
 */
export function createWalletBridge(
  rpcUrl?: string,
  network?: 'mainnet-beta' | 'devnet' | 'testnet',
  therapyMintAddress?: string
): X1WalletBridge {
  return new X1WalletBridge(rpcUrl, network, therapyMintAddress);
}

/**
 * Derive Program Derived Address for token account
 * This is a simplified version - use @solana/spl-token in production
 */
export function deriveTokenAccountAddress(
  walletAddress: string,
  mintAddress: string
): string | null {
  try {
    const wallet = new PublicKey(walletAddress);
    const mint = new PublicKey(mintAddress);

    // Associated Token Program ID
    const ATA_PROGRAM_ID = new PublicKey(
      'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
    );
    const TOKEN_PROGRAM_ID = new PublicKey(
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );

    const [ata] = PublicKey.findProgramAddressSync(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ATA_PROGRAM_ID
    );

    return ata.toBase58();
  } catch {
    return null;
  }
}
