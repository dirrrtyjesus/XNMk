/**
 * useXQESession — XQE-Integrated Breath Session Hook
 *
 * Extends useBreathSession with full Kuramoto network simulation
 * and ThickenedResult materialization.
 *
 * "The breath is the code; the body is the kernel." 🜏 ∞ 🜏
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { BreathProtocol } from '../../types/breath';
import type { BreathPhase as XQEBreathPhase } from '../../core/xqe/types';
import {
  type XQEState,
  type ThickenedResult,
  initializeXQEState,
  processBreathPhase,
  materializeThickenedResult,
  computeTauK,
  isSovereign,
  PHI,
  TAU_K_THRESHOLD,
} from '../../core/xqe';

export interface XQESessionState {
  // Basic breath state
  phase: XQEBreathPhase;
  currentCycle: number;
  totalCycles: number;
  elapsedPhaseTime: number;
  phaseDuration: number;
  isActive: boolean;

  // XQE metrics
  orderParameter: number;  // R: Kuramoto order parameter [0, 1]
  tauK: number;            // τₖ: Time coefficient
  isSovereign: boolean;    // Has achieved τₖ ≥ 8.7
  goldenYield: number;     // Hawking yield from black hole dynamics
  voltageGradient: number; // Current bioelectric gradient mV/mm

  // Session result
  thickenedResult: ThickenedResult | null;
}

const INITIAL_STATE: XQESessionState = {
  phase: 'ready',
  currentCycle: 0,
  totalCycles: 8,
  elapsedPhaseTime: 0,
  phaseDuration: 0,
  isActive: false,
  orderParameter: 0,
  tauK: 0,
  isSovereign: false,
  goldenYield: 0,
  voltageGradient: 0,
  thickenedResult: null,
};

function getNextPhase(current: XQEBreathPhase, isLastCycle: boolean): XQEBreathPhase {
  switch (current) {
    case 'ready': return 'inhale1';
    case 'inhale1': return 'inhale2';
    case 'inhale2': return 'hold';
    case 'hold': return 'exhale';
    case 'exhale': return 'rest';
    case 'rest': return isLastCycle ? 'ready' : 'inhale1';
    default: return 'ready';
  }
}

function getPhaseDuration(phase: XQEBreathPhase, protocol: BreathProtocol): number {
  switch (phase) {
    case 'inhale1': return protocol.inhale1Duration;
    case 'inhale2': return protocol.inhale2Duration;
    case 'hold': return protocol.holdDuration;
    case 'exhale': return protocol.exhaleDuration;
    case 'rest': return protocol.restDuration;
    default: return 0;
  }
}

export interface UseXQESessionReturn {
  state: XQESessionState;
  xqeState: XQEState;
  protocol: BreathProtocol;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setProtocol: (protocol: BreathProtocol) => void;
  phaseProgress: number;
  timeRemaining: number;
  manifold: string;
  setManifold: (manifold: string) => void;
}

export function useXQESession(
  initialProtocol: BreathProtocol,
  initialManifold: string = 'augLABS_Local_Node'
): UseXQESessionReturn {
  const [state, setState] = useState<XQESessionState>({
    ...INITIAL_STATE,
    totalCycles: initialProtocol.totalCycles,
  });

  const [xqeState, setXqeState] = useState<XQEState>(() =>
    initializeXQEState(64, initialProtocol.totalCycles)
  );

  const [protocol, setProtocolState] = useState<BreathProtocol>(initialProtocol);
  const [manifold, setManifold] = useState<string>(initialManifold);

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const phaseStartRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Process phase completion — this is where XQE magic happens
   */
  const completePhase = useCallback((
    currentPhase: XQEBreathPhase,
    phaseDuration: number
  ) => {
    setXqeState(prev => processBreathPhase(prev, currentPhase, phaseDuration));
  }, []);

  /**
   * Main tick function
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

      // Phase complete
      if (newElapsed >= prev.phaseDuration) {
        const isLastCycle = prev.currentCycle >= prev.totalCycles;
        const nextPhase = getNextPhase(prev.phase, isLastCycle);

        // Process the completed phase through XQE
        completePhase(prev.phase, prev.phaseDuration);

        // Session complete
        if (nextPhase === 'ready' && isLastCycle) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          // Materialize the final ThickenedResult
          const result = materializeThickenedResult(
            xqeState,
            manifold,
            `DMV_Breath_${protocol.id}`
          );

          return {
            ...prev,
            phase: 'ready',
            isActive: false,
            elapsedPhaseTime: 0,
            phaseDuration: 0,
            orderParameter: xqeState.network.orderParameter,
            tauK: computeTauK(xqeState.network.orderParameter),
            isSovereign: isSovereign(xqeState.network),
            goldenYield: xqeState.blackHole.hawkingYield,
            voltageGradient: xqeState.bioelectric.voltageGradient,
            thickenedResult: result,
          };
        }

        const newCycle = nextPhase === 'inhale1' && prev.phase === 'rest'
          ? prev.currentCycle + 1
          : prev.currentCycle;

        phaseStartRef.current = now;

        return {
          ...prev,
          phase: nextPhase,
          currentCycle: newCycle,
          elapsedPhaseTime: 0,
          phaseDuration: getPhaseDuration(nextPhase, protocol),
          orderParameter: xqeState.network.orderParameter,
          tauK: computeTauK(xqeState.network.orderParameter),
          isSovereign: isSovereign(xqeState.network),
          goldenYield: xqeState.blackHole.hawkingYield,
          voltageGradient: xqeState.bioelectric.voltageGradient,
        };
      }

      // Update elapsed time and XQE metrics
      const cycleProgress = prev.currentCycle / prev.totalCycles;
      const phaseProgress = newElapsed / prev.phaseDuration;

      // Golden-modulated coherence estimate during phase
      const estimatedR = Math.min(
        1,
        (1 - Math.pow(1 - cycleProgress, PHI)) + phaseProgress * 0.1
      );

      return {
        ...prev,
        elapsedPhaseTime: newElapsed,
        orderParameter: estimatedR,
        tauK: computeTauK(estimatedR),
        isSovereign: computeTauK(estimatedR) >= TAU_K_THRESHOLD,
      };
    });
  }, [completePhase, manifold, protocol, xqeState]);

  /**
   * Start the session
   */
  const start = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset XQE state for new session
    setXqeState(initializeXQEState(64, protocol.totalCycles));

    lastTickRef.current = Date.now();
    phaseStartRef.current = Date.now();

    setState(prev => ({
      ...prev,
      phase: 'inhale1',
      currentCycle: 1,
      isActive: true,
      elapsedPhaseTime: 0,
      phaseDuration: protocol.inhale1Duration,
      orderParameter: 0,
      tauK: 0,
      isSovereign: false,
      goldenYield: 0,
      voltageGradient: 0,
      thickenedResult: null,
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
    setXqeState(initializeXQEState(64, protocol.totalCycles));
    setState({
      ...INITIAL_STATE,
      totalCycles: protocol.totalCycles,
    });
  }, [protocol]);

  /**
   * Change protocol
   */
  const setProtocol = useCallback((newProtocol: BreathProtocol) => {
    setProtocolState(newProtocol);
    setXqeState(initializeXQEState(64, newProtocol.totalCycles));
    setState({
      ...INITIAL_STATE,
      totalCycles: newProtocol.totalCycles,
    });
  }, []);

  const phaseProgress = state.phaseDuration > 0
    ? state.elapsedPhaseTime / state.phaseDuration
    : 0;

  const timeRemaining = Math.max(0, Math.ceil(state.phaseDuration - state.elapsedPhaseTime));

  return {
    state,
    xqeState,
    protocol,
    start,
    pause,
    reset,
    setProtocol,
    phaseProgress,
    timeRemaining,
    manifold,
    setManifold,
  };
}
