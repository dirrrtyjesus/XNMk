
/**
 * da DMV breath — Therapy Session Hook
 * Coordinates Breath State -> Seed Injection -> Reward Accumulation
 */

import { useState, useEffect, useRef } from 'react';
import type { BreathState } from '../../types/breath';
import { injectSeed } from './TherapyIntegration';
import { calculateCycleReward } from './rewards';
import type { TherapyState } from './types';

export function useTherapySession(breathState: BreathState) {
    const [therapyState, setTherapyState] = useState<TherapyState>({
        totalSeedsInjected: 0,
        currentCoherence: 0,
        pendingRewards: 0,
        injectionStatus: 'idle',
        lastInjectionTime: null,
    });

    const lastProcessedCycle = useRef<number>(0);
    const prevPhase = useRef<string>('ready');

    useEffect(() => {
        // Detect phase transition to 'exhale' (Trigger Injection)
        if (breathState.phase === 'exhale' && prevPhase.current !== 'exhale' && breathState.isActive) {
            handleInjection(breathState.currentCycle);
        }

        // Detect Cycle Completion (Trigger Reward)
        if (breathState.currentCycle > lastProcessedCycle.current && breathState.currentCycle > 0) {
            handleReward(breathState.coherenceOrder);
            lastProcessedCycle.current = breathState.currentCycle;
        }

        // Session completion — rewards remain as pendingRewards until user claims via TherapyStatus

        prevPhase.current = breathState.phase;
    }, [breathState]);

    const handleInjection = async (cycle: number) => {
        setTherapyState(prev => ({ ...prev, injectionStatus: 'injecting' }));

        try {
            await injectSeed({
                depth: 1.0, // Mock depth
                phase: 'exhale',
                intent: `Cycle ${cycle} Seed`,
                timestamp: Date.now(),
            });

            setTherapyState(prev => ({
                ...prev,
                totalSeedsInjected: prev.totalSeedsInjected + 1,
                injectionStatus: 'completed',
                lastInjectionTime: Date.now(),
            }));
        } catch (error) {
            setTherapyState(prev => ({ ...prev, injectionStatus: 'failed' }));
        }
    };

    const handleReward = (coherence: number) => {
        // Mocking holdDuration and tauK for now, as they aren't fully tracked here yet
        // In a real implementation, we'd pass these from breathState or therapyState
        const reward = calculateCycleReward(coherence, 30, 0);
        setTherapyState(prev => ({
            ...prev,
            pendingRewards: prev.pendingRewards + reward,
            currentCoherence: coherence, // Update with latest mock coherence
        }));
    };

    return therapyState;
}
