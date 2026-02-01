import { type FC, type ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // X1 Network Configuration
    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = 'https://rpc.mainnet.x1.xyz';

    const wallets = useMemo(
        () => [
            // Standard adapters will auto-detect extensions that support the Solana standard.
            // This includes Backpack, Phantom, Solflare, and likely the X1 Wallet if it follows the standard.
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
