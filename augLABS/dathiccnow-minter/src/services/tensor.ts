/**
 * Tensor Marketplace Integration
 * After minting, the NFT can be listed on Tensor for trading
 */

/**
 * Get direct link to NFT on Tensor marketplace
 */
export function getTensorItemUrl(mintAddress: string): string {
    return `https://www.tensor.trade/item/${mintAddress}`;
}

/**
 * Get link to collection on Tensor
 */
export function getTensorCollectionUrl(collectionSlug: string): string {
    return `https://www.tensor.trade/trade/${collectionSlug}`;
}

/**
 * Get Solana Explorer link for transaction
 */
export function getSolanaExplorerUrl(signature: string, network: 'devnet' | 'mainnet-beta' = 'devnet'): string {
    const cluster = network === 'devnet' ? '?cluster=devnet' : '';
    return `https://explorer.solana.com/tx/${signature}${cluster}`;
}

/**
 * Get Solana Explorer link for token/NFT
 */
export function getSolanaTokenUrl(mintAddress: string, network: 'devnet' | 'mainnet-beta' = 'devnet'): string {
    const cluster = network === 'devnet' ? '?cluster=devnet' : '';
    return `https://explorer.solana.com/address/${mintAddress}${cluster}`;
}

/**
 * Tensor Listing Instructions
 * 
 * Manual listing flow (programmatic listing requires Tensor SDK):
 * 1. Navigate to tensor.trade
 * 2. Connect wallet
 * 3. Go to "My Items" 
 * 4. Select the minted NFT
 * 5. Click "List" and set price
 * 
 * For collection creation:
 * 1. Go to tensor.trade/creator
 * 2. Create new collection hub
 * 3. Add minted NFTs to collection
 */
export const TENSOR_LISTING_GUIDE = {
    step1: 'Connect your wallet at tensor.trade',
    step2: 'Navigate to "My Items" in your profile',
    step3: 'Find your daThiccNOW Deer NFT',
    step4: 'Click "List" and set your price in SOL',
    step5: 'Confirm the listing transaction',
};
