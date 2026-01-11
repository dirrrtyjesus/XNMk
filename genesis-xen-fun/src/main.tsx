import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

const Main = () => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            // Wallets that implement the new Wallet Standard, spec can be found here:
            // https://github.com/solana-labs/wallet-standard
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <StrictMode>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <App />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </StrictMode>
    );
};

createRoot(document.getElementById('root')!).render(<Main />);
