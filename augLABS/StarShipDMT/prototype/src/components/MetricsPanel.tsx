import React from 'react';
import { BrainCircuit, Flame } from 'lucide-react';
import type { SimState } from '../simulation';

interface Props {
    state: SimState;
}

const MetricsPanel: React.FC<Props> = ({ state }) => {
    // Formatters
    const fmt = (n: number, d = 2) => n.toFixed(d);

    return (
        <div className="fixed left-6 top-24 bottom-6 w-80 flex flex-col gap-4 z-40">

            {/* Primary Bio-Metric */}
            <div className="p-6 bg-xenial-800/50 backdrop-blur border border-xenial-700 rounded-2xl">
                <div className="flex items-center gap-2 mb-4 text-xenial-500">
                    <BrainCircuit size={18} />
                    <h3 className="text-xs font-display tracking-widest">TEMPORAL COHERENCE</h3>
                </div>
                <div className="text-4xl font-mono text-xenial-100 font-bold mb-1">
                    τ_k: {fmt(state.tau_k, 3)}
                </div>
                <div className="h-1 w-full bg-xenial-900 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-xenial-500 to-xenial-400 transition-all duration-300"
                        style={{ width: `${state.tau_k * 100}%` }}
                    />
                </div>
            </div>

            {/* Plasma Physics Data */}
            <div className="p-6 bg-xenial-800/50 backdrop-blur border border-xenial-700 rounded-2xl flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-6 text-plasma-400">
                    <Flame size={18} />
                    <h3 className="text-xs font-display tracking-widest">PLASMA DYNAMICS</h3>
                </div>

                <div className="space-y-6 font-mono text-sm">
                    <div className="flex justify-between items-end border-b border-xenial-700 pb-2">
                        <span className="text-xenial-500">Gamma Eff (Decoherence)</span>
                        <span className={`text-lg font-bold ${state.gamma_eff > 10 ? 'text-plasma-500' : 'text-green-400'}`}>
                            {fmt(state.gamma_eff)} s⁻¹
                        </span>
                    </div>

                    <div className="flex justify-between items-end border-b border-xenial-700 pb-2">
                        <span className="text-xenial-500">Hull Integrity</span>
                        <span className={`text-lg font-bold ${state.integrity < 50 ? 'text-plasma-500' : 'text-xenial-500'}`}>
                            {fmt(state.integrity)}%
                        </span>
                    </div>

                    <div className="flex justify-between items-end border-b border-xenial-700 pb-2">
                        <span className="text-xenial-500">Altitude</span>
                        <span className="text-lg text-xenial-100">{fmt(state.altitude, 1)} km</span>
                    </div>

                    <div className="flex justify-between items-end">
                        <span className="text-xenial-500">Velocity</span>
                        <span className="text-lg text-xenial-100">{fmt(state.velocity, 2)} km/s</span>
                    </div>
                </div>

                <div className="mt-auto pt-6">
                    <div className="p-3 bg-black/40 rounded border border-xenial-700 font-mono text-xs text-xenial-400">
                        PHASE STATUS:<br />
                        <span className="text-lg text-xenial-100 typing-effect">
                            {state.phase}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsPanel;
