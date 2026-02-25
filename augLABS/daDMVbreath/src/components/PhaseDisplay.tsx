/**
 * da DMV breath — Phase Display Component
 * Shows current phase, timer, and cycle counter
 */

import type { BreathPhase } from '../types/breath';
import { PHASE_CONFIGS } from '../types/breath';

interface PhaseDisplayProps {
    phase: BreathPhase;
    timeRemaining: number;
    currentCycle: number;
    totalCycles: number;
    isActive: boolean;
}

export function PhaseDisplay({
    phase,
    timeRemaining,
    currentCycle,
    totalCycles,
    isActive,
}: PhaseDisplayProps) {
    const config = PHASE_CONFIGS[phase];

    return (
        <div className="phase-display">
            <div className={`phase-label ${config.colorClass}`}>
                {isActive ? config.label : 'Ready'}
            </div>

            <div className="timer-display">
                {isActive ? timeRemaining : '∞'}
            </div>

            {isActive && (
                <div className="cycle-counter">
                    Cycle {currentCycle} of {totalCycles}
                </div>
            )}

            {!isActive && phase === 'ready' && currentCycle > 0 && (
                <div className="cycle-counter" style={{ color: 'var(--success)' }}>
                    Session Complete — R ≈ 1.0
                </div>
            )}
        </div>
    );
}
