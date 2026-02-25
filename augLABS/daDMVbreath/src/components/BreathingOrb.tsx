/**
 * da DMV breath — Breathing Orb Component
 * The central animated visualization synced to breath phases
 */

import type { BreathPhase } from '../types/breath';

interface BreathingOrbProps {
    phase: BreathPhase;
    isActive: boolean;
}

export function BreathingOrb({ phase, isActive }: BreathingOrbProps) {
    const orbClass = `breathing-orb ${phase}${isActive ? '' : ' ready'}`;

    return (
        <div className="breathing-orb-container">
            <div className={orbClass} />
        </div>
    );
}
