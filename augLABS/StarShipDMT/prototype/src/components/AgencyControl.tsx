import React from 'react';

interface Props {
    ac: number;
    setAc: (val: number) => void;
    disabled?: boolean;
}

const AgencyControl: React.FC<Props> = ({ ac, setAc, disabled }) => {
    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[500px] z-50">
            <div className="bg-xenial-900/80 backdrop-blur-xl border border-xenial-500/50 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                <div className="flex justify-between mb-4 font-display tracking-widest text-xs text-xenial-500">
                    <span>CHRONOS (PASSIVE)</span>
                    <span>KAIROS (SOVEREIGN)</span>
                </div>

                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={ac}
                    onChange={(e) => setAc(parseFloat(e.target.value))}
                    disabled={disabled}
                    className="w-full h-2 bg-xenial-800 rounded-lg appearance-none cursor-pointer accent-xenial-500 hover:accent-xenial-400 transition-all"
                />

                <div className="mt-4 flex justify-between items-center">
                    <div className="text-xenial-500 text-xs font-mono">
                        AGENCY COEFFICIENT (A_c)
                    </div>
                    <div className={`text-2xl font-bold font-mono ${ac > 0.8 ? 'text-xenial-400' : 'text-xenial-100'}`}>
                        {ac.toFixed(2)}
                    </div>
                </div>

                {disabled && (
                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center backdrop-blur-[2px]">
                        <div className="px-4 py-2 border border-plasma-500 text-plasma-500 font-mono text-xs bg-black">
                            CONNECT WALLET TO ENABLE SOVEREIGN CONTROL
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgencyControl;
