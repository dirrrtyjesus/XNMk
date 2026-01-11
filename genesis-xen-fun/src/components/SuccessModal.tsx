import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Share2 } from 'lucide-react';

interface SuccessModalProps {
    amount: number;
    txHash: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ amount, txHash }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-50 max-w-md w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl"
        >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                    <span className="text-4xl">✨</span>
                </div>
            </div>

            <div className="mt-12 space-y-6">
                <div>
                    <h2 className="text-2xl font-light text-white mb-2">Ritual Complete</h2>
                    <p className="text-white/40 text-sm">
                        Your potential energy has crystallized.
                    </p>
                </div>

                <div className="py-8 border-y border-white/5">
                    <div className="text-5xl font-thin text-white tracking-tighter">
                        {amount.toLocaleString()} <span className="text-xl text-purple-400">XNMk</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <a
                        href={`https://explorer.x1.xyz/tx/${txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-mono text-white/70 transition-colors"
                    >
                        View on Explorer <ExternalLink className="w-4 h-4" />
                    </a>

                    <button className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition-colors">
                        Share Proof <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
