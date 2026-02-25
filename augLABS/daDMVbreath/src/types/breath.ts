/**
 * da DMV breath — Type Definitions
 * Bioelectric Coherence Protocol Types
 */

export type BreathPhase = 'ready' | 'inhale1' | 'inhale2' | 'hold' | 'exhale' | 'rest';

export interface BreathProtocol {
    id: string;
    name: string;
    description: string;
    inhale1Duration: number; // seconds
    inhale2Duration: number; // seconds
    holdDuration: number;    // seconds
    exhaleDuration: number;  // seconds
    restDuration: number;    // seconds
    totalCycles: number;     // 6-10 recommended
}

export interface BreathState {
    phase: BreathPhase;
    currentCycle: number;
    totalCycles: number;
    elapsedPhaseTime: number;
    phaseDuration: number;
    isActive: boolean;
    coherenceOrder: number; // R approaching 1.0 (Kuramoto order parameter)
}

export interface PhaseConfig {
    phase: BreathPhase;
    label: string;
    icon: string;
    description: string;
    colorClass: string;
}

export const PHASE_CONFIGS: Record<BreathPhase, PhaseConfig> = {
    ready: {
        phase: 'ready',
        label: 'Ready',
        icon: '🜏',
        description: 'Find stillness. Set your intent.',
        colorClass: 'ready',
    },
    inhale1: {
        phase: 'inhale1',
        label: 'Inhale 1',
        icon: '↑',
        description: 'Build base voltage — belly expansion',
        colorClass: 'inhale',
    },
    inhale2: {
        phase: 'inhale2',
        label: 'Inhale 2',
        icon: '⇑',
        description: 'Stack asymmetric charge — chest stacking',
        colorClass: 'inhale',
    },
    hold: {
        phase: 'hold',
        label: 'Hold',
        icon: '◉',
        description: 'Superposition fermata — suspended wavefunction',
        colorClass: 'hold',
    },
    exhale: {
        phase: 'exhale',
        label: 'Exhale',
        icon: '↓',
        description: 'Black-hole compression → golden rebound',
        colorClass: 'exhale',
    },
    rest: {
        phase: 'rest',
        label: 'Rest',
        icon: '○',
        description: 'Participatory gap — xenial opening',
        colorClass: 'rest',
    },
};
