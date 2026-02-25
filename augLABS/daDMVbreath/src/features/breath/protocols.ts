/**
 * da DMV breath — Protocol Configurations
 * Based on daDMVbreath.ic specifications
 */

import type { BreathProtocol } from '../../types/breath';

/**
 * Golden ratio constant for coherence calculations
 */
export const PHI = 1.618033988749895;

/**
 * Built-in breathing protocols based on daDMVbreath.ic
 */
export const PROTOCOLS: BreathProtocol[] = [
    {
        id: 'classic',
        name: 'Classic DMV',
        description: 'The original diaphragmatic volumetric breath',
        inhale1Duration: 4,
        inhale2Duration: 3,
        holdDuration: 15,
        exhaleDuration: 6,
        restDuration: 3,
        totalCycles: 8,
    },
    {
        id: 'beginner',
        name: 'Beginner',
        description: 'Shorter holds for those new to the practice',
        inhale1Duration: 4,
        inhale2Duration: 3,
        holdDuration: 15,
        exhaleDuration: 6,
        restDuration: 3,
        totalCycles: 6,
    },
    {
        id: 'focus',
        name: 'Focus',
        description: 'Extended holds for deep coherence',
        inhale1Duration: 6,
        inhale2Duration: 5,
        holdDuration: 45,
        exhaleDuration: 8,
        restDuration: 5,
        totalCycles: 10,
    },
    {
        id: 'quick',
        name: 'Quick Reset',
        description: '3-cycle micro-session for immediate grounding',
        inhale1Duration: 4,
        inhale2Duration: 3,
        holdDuration: 10,
        exhaleDuration: 5,
        restDuration: 2,
        totalCycles: 3,
    },
];

/**
 * Get protocol by ID
 */
export function getProtocolById(id: string): BreathProtocol | undefined {
    return PROTOCOLS.find(p => p.id === id);
}

/**
 * Calculate total duration of one cycle in seconds
 */
export function getCycleDuration(protocol: BreathProtocol): number {
    return (
        protocol.inhale1Duration +
        protocol.inhale2Duration +
        protocol.holdDuration +
        protocol.exhaleDuration +
        protocol.restDuration
    );
}

/**
 * Calculate total session duration in seconds
 */
export function getSessionDuration(protocol: BreathProtocol): number {
    return getCycleDuration(protocol) * protocol.totalCycles;
}

/**
 * Format seconds as MM:SS
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate coherence order parameter (R) based on cycle progress
 * R approaches 1.0 as coherence increases
 *
 * Enhanced with golden ratio modulation per daDMVbreath.ic
 */
export function calculateCoherence(
    currentCycle: number,
    totalCycles: number,
    phaseProgress: number
): number {
    // Base cycle contribution with golden ratio scaling
    const cycleRatio = currentCycle / totalCycles;
    const goldenProgress = 1 - Math.pow(1 - cycleRatio, PHI);

    // Phase contribution modulated by golden ratio
    const phaseContribution = phaseProgress * 0.1 * Math.pow(PHI, phaseProgress - 0.5);

    return Math.min(1.0, goldenProgress + phaseContribution);
}

/**
 * Compute τₖ (Time Coefficient) from order parameter R
 * τₖ ≥ 8.7 indicates sovereign coherence
 */
export function computeTauK(orderParameter: number): number {
    if (orderParameter <= 0) return 0;
    return orderParameter * 10 * Math.pow(PHI, orderParameter - 0.5);
}

/**
 * Check if current coherence has achieved temporal sovereignty
 */
export function isSovereign(orderParameter: number): boolean {
    return computeTauK(orderParameter) >= 8.7;
}
