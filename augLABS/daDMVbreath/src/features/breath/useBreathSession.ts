/**
 * da DMV breath — Breath Session Hook
 * State machine implementation for the breathing protocol
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { BreathPhase, BreathState, BreathProtocol } from '../../types/breath';
import { calculateCoherence } from './protocols';

const INITIAL_STATE: BreathState = {
    phase: 'ready',
    currentCycle: 0,
    totalCycles: 8,
    elapsedPhaseTime: 0,
    phaseDuration: 0,
    isActive: false,
    coherenceOrder: 0,
};

/**
 * Get the next phase in the breath cycle
 */
function getNextPhase(current: BreathPhase, isLastCycle: boolean): BreathPhase {
    switch (current) {
        case 'ready':
            return 'inhale1';
        case 'inhale1':
            return 'inhale2';
        case 'inhale2':
            return 'hold';
        case 'hold':
            return 'exhale';
        case 'exhale':
            return 'rest';
        case 'rest':
            return isLastCycle ? 'ready' : 'inhale1';
        default:
            return 'ready';
    }
}

/**
 * Get the duration for a specific phase from the protocol
 * Adds dynamic hold duration (+1s per cycle)
 */
function getPhaseDuration(phase: BreathPhase, protocol: BreathProtocol, currentCycle: number): number {
    switch (phase) {
        case 'inhale1':
            return protocol.inhale1Duration;
        case 'inhale2':
            return protocol.inhale2Duration;
        case 'hold':
            // Base duration + 1s per cycle (starting from cycle 1)
            // Cycle 1: Base + 0
            // Cycle 2: Base + 1
            // etc.
            const cycleIncrement = Math.max(0, currentCycle - 1);
            return protocol.holdDuration + cycleIncrement;
        case 'exhale':
            return protocol.exhaleDuration;
        case 'rest':
            return protocol.restDuration;
        default:
            return 0;
    }
}

export interface UseBreathSessionReturn {
    state: BreathState;
    protocol: BreathProtocol;
    start: () => void;
    pause: () => void;
    reset: () => void;
    setProtocol: (protocol: BreathProtocol) => void;
    phaseProgress: number;
    timeRemaining: number;
}

export function useBreathSession(initialProtocol: BreathProtocol): UseBreathSessionReturn {
    const [state, setState] = useState<BreathState>({
        ...INITIAL_STATE,
        totalCycles: initialProtocol.totalCycles,
    });
    const [protocol, setProtocolState] = useState<BreathProtocol>(initialProtocol);

    const intervalRef = useRef<number | null>(null);
    const lastTickRef = useRef<number>(0);

    /**
     * Clean up interval on unmount
     */
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    /**
     * Main tick function - runs every 100ms for smooth countdown
     */
    const tick = useCallback(() => {
        const now = Date.now();
        const delta = (now - lastTickRef.current) / 1000;
        lastTickRef.current = now;

        setState(prev => {
            if (!prev.isActive || prev.phase === 'ready') {
                return prev;
            }

            const newElapsed = prev.elapsedPhaseTime + delta;

            // Check if phase is complete
            if (newElapsed >= prev.phaseDuration) {
                const isLastCycle = prev.currentCycle >= prev.totalCycles;
                const nextPhase = getNextPhase(prev.phase, isLastCycle);

                // Session complete
                if (nextPhase === 'ready' && isLastCycle) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    return {
                        ...prev,
                        phase: 'ready',
                        isActive: false,
                        elapsedPhaseTime: 0,
                        phaseDuration: 0,
                        coherenceOrder: 1.0, // Full coherence achieved
                    };
                }

                // Increment cycle when starting new inhale1
                const newCycle = nextPhase === 'inhale1' && prev.phase === 'rest'
                    ? prev.currentCycle + 1
                    : prev.currentCycle;

                return {
                    ...prev,
                    phase: nextPhase,
                    currentCycle: newCycle,
                    elapsedPhaseTime: 0,
                    phaseDuration: getPhaseDuration(nextPhase, protocol, newCycle),
                    coherenceOrder: calculateCoherence(newCycle, prev.totalCycles, 0),
                };
            }

            // Update elapsed time
            return {
                ...prev,
                elapsedPhaseTime: newElapsed,
                coherenceOrder: calculateCoherence(
                    prev.currentCycle,
                    prev.totalCycles,
                    newElapsed / prev.phaseDuration
                ),
            };
        });
    }, [protocol]);

    /**
     * Start the breathing session
     */
    const start = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        lastTickRef.current = Date.now();

        setState(prev => ({
            ...prev,
            phase: 'inhale1',
            currentCycle: 1,
            isActive: true,
            elapsedPhaseTime: 0,
            phaseDuration: getPhaseDuration('inhale1', protocol, 1),
            coherenceOrder: 0,
        }));

        intervalRef.current = window.setInterval(tick, 100);
    }, [protocol, tick]);

    /**
     * Pause the session
     */
    const pause = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setState(prev => ({ ...prev, isActive: false }));
    }, []);

    /**
     * Reset to initial state
     */
    const reset = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setState({
            ...INITIAL_STATE,
            totalCycles: protocol.totalCycles,
        });
    }, [protocol]);

    /**
     * Change the protocol
     */
    const setProtocol = useCallback((newProtocol: BreathProtocol) => {
        setProtocolState(newProtocol);
        reset();
        setState(prev => ({
            ...prev,
            totalCycles: newProtocol.totalCycles,
        }));
    }, [reset]);

    // Calculate derived values
    const phaseProgress = state.phaseDuration > 0
        ? state.elapsedPhaseTime / state.phaseDuration
        : 0;

    const timeRemaining = Math.max(0, Math.ceil(state.phaseDuration - state.elapsedPhaseTime));

    return {
        state,
        protocol,
        start,
        pause,
        reset,
        setProtocol,
        phaseProgress,
        timeRemaining,
    };
}
