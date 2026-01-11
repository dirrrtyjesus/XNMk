import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Loader2 } from 'lucide-react';
import type { RitualState, DiscoveryData } from '../App';

interface RitualCircleProps {
    state: RitualState;
    data: DiscoveryData;
    onInitiate: () => void;
}

export const RitualCircle: React.FC<RitualCircleProps> = ({ state, data, onInitiate }) => {
    const isProcessing = state === 'SIGNING' || state === 'MINTING';

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center gap-12"
        >
            {/* Data Display */}
            <div className="text-center space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-purple-400/80">
                    Potential Energy Discovered
                </div>
                <div className="text-6xl font-thin tracking-tighter text-white">
                    {data.xnm_amount.toLocaleString()} <span className="text-2xl text-white/40">XNM</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-white/30">
                    <span>BLOCK #{data.block_id}</span>
                    <span>•</span>
                    <span>ARGON2 VALIDIFIED</span>
                </div>
            </div>

            {/* The Circle - Superposition of Chronos and Kairos */}
            <div className="relative group cursor-pointer" onClick={!isProcessing ? onInitiate : undefined}>
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-[50px] group-hover:bg-purple-500/30 transition-all duration-500" />

                {/* Chronos Layer (The Glitch) */}
                <motion.div
                    className="absolute inset-0 rounded-full border border-red-500/30"
                    animate={{
                        scale: [1, 1.02, 0.98, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 2, -2, 0],
                    }}
                    transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                />

                {/* Kairos Layer (The Harmonic) */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-purple-400/50"
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Ring Animation */}
                <svg className="w-64 h-64 transform -rotate-90 relative z-10">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="transparent"
                        className="text-white/10"
                    />
                    <motion.circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-purple-500"
                        initial={{ pathLength: 0 }}
                        animate={{
                            pathLength: isProcessing ? 1 : 0,
                            rotate: isProcessing ? 360 : 0
                        }}
                        transition={{
                            duration: isProcessing ? 4 : 0,
                            ease: "linear",
                            repeat: isProcessing ? Infinity : 0
                        }}
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                            <span className="text-xs font-mono uppercase tracking-widest text-white/50">
                                {state === 'SIGNING' ? 'Collapsing...' : 'Materializing...'}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                            <Fingerprint className="w-16 h-16 text-white/80" />
                            <span className="text-xs font-mono uppercase tracking-widest text-white/50">
                                Initiate Ritual
                            </span>
                            <span className="text-[10px] text-purple-300/50 font-mono">
                                (Collapse Wavefunction)
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Hash Display */}
            <div className="max-w-md text-center">
                <div className="text-[10px] font-mono text-white/20 break-all border border-white/5 p-4 rounded-lg bg-black/40 backdrop-blur-md">
                    {data.hash_to_verify}
                </div>
            </div>
        </motion.div>
    );
};
