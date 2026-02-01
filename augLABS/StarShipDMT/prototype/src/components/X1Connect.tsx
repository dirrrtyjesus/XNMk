import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ShieldCheck } from 'lucide-react';

interface Props {
    isConnected: boolean;
    onConnect: () => void;
}

const X1Connect: React.FC<Props> = ({ onConnect }) => {
    const { connected } = useWallet();

    useEffect(() => {
        if (connected) {
            onConnect();
        }
    }, [connected, onConnect]);

    return (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
            {/* Custom styled wrapper for the standard button to match Neon aesthetics */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-xenial-500 to-xenial-400 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-xenial-900 rounded-lg">
                    <WalletMultiButton className="!bg-transparent !text-xenial-100 !font-display !font-bold hover:!bg-transparent !h-12 !px-6" />
                </div>
            </div>

            {connected && (
                <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-right duration-500">
                    <div className="flex items-center gap-3 px-6 py-3 bg-xenial-900/90 border border-xenial-400 rounded-full shadow-[0_0_15px_rgba(123,44,191,0.4)]">
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />
                        <span className="text-xenial-400 font-display text-sm tracking-wider font-bold">
                            SOVEREIGN MODE
                        </span>
                        <ShieldCheck className="w-4 h-4 text-xenial-400" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default X1Connect;
