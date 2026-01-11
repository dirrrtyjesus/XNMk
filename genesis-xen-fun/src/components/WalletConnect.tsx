import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Zap, CheckCircle2 } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

interface WalletConnectProps {
    evmAddress: string | null;
    x1Address: string | null;
    onConnectEvm: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
    evmAddress,
    x1Address,
    onConnectEvm,
}) => {
    const { publicKey } = useWallet();
    const { setVisible } = useWalletModal();

    const handleX1Connect = () => {
        setVisible(true);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full">
            {/* Left Pillar: Identity (EVM) */}
            <ConnectCard
                title="IDENTITY"
                subtitle="Connect EVM Wallet"
                icon={<Wallet className="w-6 h-6" />}
                address={evmAddress}
                onClick={onConnectEvm}
                activeColor="border-blue-500/50 bg-blue-500/5"
            />

            {/* Divider */}
            <div className="h-px w-12 md:w-px md:h-12 bg-white/10" />

            {/* Right Pillar: Destination (X1) */}
            <ConnectCard
                title="DESTINATION"
                subtitle="Connect X1 Wallet"
                icon={<Zap className="w-6 h-6" />}
                address={publicKey ? publicKey.toBase58() : x1Address}
                onClick={handleX1Connect}
                activeColor="border-purple-500/50 bg-purple-500/5"
            />
        </div>
    );
};

interface ConnectCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    address: string | null;
    onClick: () => void;
    activeColor: string;
}

const ConnectCard: React.FC<ConnectCardProps> = ({
    title,
    subtitle,
    icon,
    address,
    onClick,
    activeColor,
}) => {
    const isConnected = !!address;

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={isConnected}
            className={`
        relative group w-full md:w-80 p-8 rounded-2xl border backdrop-blur-sm transition-all duration-500
        ${isConnected
? `${activeColor} shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]`
: 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'}
      `}
        >
            <div className="flex flex-col items-center gap-4">
                <div className={`
          p-4 rounded-full transition-colors duration-500
          ${isConnected ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40 group-hover:text-white/70'}
        `}>
                    {isConnected ? <CheckCircle2 className="w-6 h-6" /> : icon}
                </div>

                <div className="text-center">
                    <div className="text-xs font-mono uppercase tracking-widest text-white/30 mb-2">
                        {title}
                    </div>
                    {isConnected ? (
                        <div className="font-mono text-sm text-white/90 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                            {address.slice(0, 6)}...{address.slice(-4)}
                        </div>
                    ) : (
                        <div className="text-lg font-light text-white/80">
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
        </motion.button>
    );
};
