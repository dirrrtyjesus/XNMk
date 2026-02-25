/**
 * X1 Wallet Bridge — Mock Version
 * For demonstration without @solana/web3.js dependency
 *
 * In production, use wallet-bridge.ts with full Solana integration.
 *
 * 🜏 ∞ 🜏
 */

import { PHI } from '../../core/xqe/types';
import { getStakeTier } from '../../core/therapy/composer';
import type { TherapyStake } from '../../core/therapy/types';
import type { X1WalletConnection } from './types';

/**
 * Mock X1 Wallet Bridge
 */
export class X1WalletBridgeMock {
  private network: 'mainnet-beta' | 'devnet' | 'testnet';
  private therapyMintAddress: string;
  private mockBalances: Map<string, number> = new Map();

  constructor(
    _rpcUrl?: string,
    network: 'mainnet-beta' | 'devnet' | 'testnet' = 'mainnet-beta',
    therapyMintAddress?: string
  ) {
    this.network = network;
    this.therapyMintAddress = therapyMintAddress || 'THERAPY_MOCK_MINT';

    // Pre-populate some demo balances
    this.mockBalances.set('DRpbCBMxVnDK7maPqMj7H5aF4g7E8LW1VJVvB3vH5gPE', 100);
    this.mockBalances.set('AugM1VxqYqBJJFHnTqkxvGAqzLNFVRvxGCCnLRTkKPxd', 500);
    this.mockBalances.set('XENi4L1CaLioftheEast3XqF6Yh7DMVBreathZ1618', 1000);
  }

  /**
   * Validate Solana address format
   */
  isValidAddress(address: string): boolean {
    // Base58 character set validation
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }

  /**
   * Get mock SOL balance
   */
  async getSolBalance(_address: string): Promise<number> {
    return Math.random() * 10; // Mock 0-10 SOL
  }

  /**
   * Get mock $THERAPY balance
   */
  async getTherapyBalance(walletAddress: string): Promise<number> {
    return this.mockBalances.get(walletAddress) || Math.random() * 50;
  }

  /**
   * Set mock balance (for testing)
   */
  setMockBalance(address: string, balance: number): void {
    this.mockBalances.set(address, balance);
  }

  /**
   * Connect wallet and get state
   */
  async connectWallet(address: string): Promise<X1WalletConnection | null> {
    if (!this.isValidAddress(address)) {
      return null;
    }

    const therapyBalance = await this.getTherapyBalance(address);

    return {
      address,
      publicKey: address,
      connected: true,
      network: this.network,
      therapyBalance,
      lastSync: Date.now(),
    };
  }

  /**
   * Convert connection to stake
   */
  connectionToStake(
    connection: X1WalletConnection,
    userId: string
  ): TherapyStake {
    const amount = connection.therapyBalance;
    const tier = getStakeTier(amount);

    const tierMultiplier = {
      seed: 1,
      sprout: PHI,
      branch: Math.pow(PHI, 2),
      canopy: Math.pow(PHI, 3),
      sovereign: Math.pow(PHI, 5),
    };

    return {
      holder: userId,
      amount,
      coherenceWeight: amount * tierMultiplier[tier],
      tier,
      stakedAt: Date.now(),
      vow: 'NEVER_THIN',
    };
  }

  /**
   * Mock signature verification
   */
  verifySignature(
    _message: string,
    signature: string,
    publicKey: string
  ): boolean {
    return this.isValidAddress(publicKey) && signature.length >= 10;
  }

  /**
   * Get network info
   */
  getNetworkInfo(): { network: string; rpcUrl: string; mint: string } {
    return {
      network: this.network,
      rpcUrl: `https://api.${this.network}.solana.com (MOCK)`,
      mint: this.therapyMintAddress,
    };
  }
}

/**
 * Create mock wallet bridge
 */
export function createWalletBridgeMock(
  rpcUrl?: string,
  network?: 'mainnet-beta' | 'devnet' | 'testnet',
  therapyMintAddress?: string
): X1WalletBridgeMock {
  return new X1WalletBridgeMock(rpcUrl, network, therapyMintAddress);
}
