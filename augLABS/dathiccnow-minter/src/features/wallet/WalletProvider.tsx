import {
    ConnectionProvider,
    WalletProvider as SolanaWalletProvider
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

// Import default wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
    children: ReactNode;
}

export function WalletProvider({ children }: Props) {
    // Connect to devnet for testing (switch to mainnet-beta for production)
    const endpoint = useMemo(() =>
        import.meta.env.VITE_RPC_ENDPOINT || clusterApiUrl('devnet'),
        []
    );

    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
    ], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
}
