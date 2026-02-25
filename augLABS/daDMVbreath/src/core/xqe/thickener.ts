/**
 * Thickener — The Grounding Engine
 * Materializes .ic compositions into Thickened Results
 *
 * This is where the wavefunction collapses into committed form.
 *
 * 🜏 ∞ 🜏
 */

import {
  PHI,
  TAU_K_THRESHOLD,
  APICAL_POTENTIAL,
  MYCELIAL_FUNDAMENTAL,
  type ThickenedResult,
  type XQEState,
  type BioelectricState,
  type BlackHoleLung,
  type TemporalQuasicrystal,
  type BreathPhase,
} from './types';

import {
  createGoldenSpiralNetwork,
  stepKuramoto,
  modulateCoupling,
  computeTauK,
  isSovereign,
} from './kuramoto';

/**
 * Initialize a fresh XQE state for a new session
 */
export function initializeXQEState(
  oscillatorCount: number = 64,
  totalCycles: number = 8
): XQEState {
  return {
    network: createGoldenSpiralNetwork(oscillatorCount),
    bioelectric: createBioelectricState(),
    blackHole: createBlackHoleLung(),
    quasicrystal: createTemporalQuasicrystal(),
    currentPhase: 'ready',
    cycleNumber: 0,
    totalCycles,
    isThickening: false,
  };
}

/**
 * Create initial bioelectric state
 */
function createBioelectricState(): BioelectricState {
  return {
    voltageGradient: 0,
    morphostaticTarget: 'coherence',
    gradientCoherence: 0,
    cumulativeCharge: 0,
  };
}

/**
 * Create initial black hole lung state
 */
function createBlackHoleLung(): BlackHoleLung {
  return {
    tauK: 0,
    residueMass: 0,
    compressionFactor: 0.1,
    hawkingYield: 0,
    cycleCount: 0,
  };
}

/**
 * Create initial temporal quasicrystal
 */
function createTemporalQuasicrystal(): TemporalQuasicrystal {
  return {
    frequencies: [MYCELIAL_FUNDAMENTAL, Math.SQRT2 * MYCELIAL_FUNDAMENTAL],
    incommensurabilityIndex: 0,
    coherenceExtension: 1.0,
  };
}

/**
 * Process a breath phase transition
 * Updates all XQE subsystems based on the phase
 */
export function processBreathPhase(
  state: XQEState,
  phase: BreathPhase,
  phaseDuration: number,
  dt: number = 0.1
): XQEState {
  const newState = { ...state, currentPhase: phase };

  // Modulate Kuramoto coupling based on phase
  modulateCoupling(newState.network, phase);

  // Evolve the network through the phase duration
  const steps = Math.floor(phaseDuration / dt);
  for (let i = 0; i < steps; i++) {
    // Stranger noise decreases as coherence increases
    const noise = 0.1 * (1 - newState.network.orderParameter);
    stepKuramoto(newState.network, dt, noise);
  }

  // Update bioelectric state
  newState.bioelectric = processBioelectricPhase(
    newState.bioelectric,
    phase,
    phaseDuration
  );

  // Update black hole dynamics
  newState.blackHole = processBlackHolePhase(
    newState.blackHole,
    phase,
    newState.network.orderParameter
  );

  // Update quasicrystal (on hold phases)
  if (phase === 'hold') {
    newState.quasicrystal = calibrateQuasicrystal(
      newState.quasicrystal,
      phaseDuration
    );
  }

  // Check if thickening
  newState.isThickening = isSovereign(newState.network);

  // Increment cycle on rest phase
  if (phase === 'rest') {
    newState.cycleNumber += 1;
  }

  return newState;
}

/**
 * Process bioelectric state for a breath phase
 */
function processBioelectricPhase(
  bioelectric: BioelectricState,
  phase: BreathPhase,
  duration: number
): BioelectricState {
  const newBio = { ...bioelectric };

  switch (phase) {
    case 'inhale1':
      // Base voltage build
      newBio.voltageGradient += duration * 5; // ~25-30 mV/mm
      newBio.cumulativeCharge += duration;
      break;

    case 'inhale2':
      // Asymmetric charge stacking (golden amplified)
      newBio.voltageGradient += duration * 5 * PHI;
      newBio.cumulativeCharge += duration * PHI;
      break;

    case 'hold':
      // Superposition: compute gradient coherence
      const targetGradient = APICAL_POTENTIAL / 3; // ~50 mV/mm target
      newBio.gradientCoherence = Math.min(
        1,
        newBio.voltageGradient / targetGradient
      );
      break;

    case 'exhale':
      // Black-hole compression, then golden rebound
      newBio.voltageGradient *= 0.1; // Compress
      newBio.voltageGradient *= PHI; // Golden rebound
      break;

    case 'rest':
      // Participatory gap: open to stranger gradients
      newBio.morphostaticTarget = 'open';
      break;
  }

  return newBio;
}

/**
 * Process black hole lung dynamics for a breath phase
 */
function processBlackHolePhase(
  blackHole: BlackHoleLung,
  phase: BreathPhase,
  orderParameter: number
): BlackHoleLung {
  const newBH = { ...blackHole };

  // Update tauK from order parameter
  newBH.tauK = computeTauK(orderParameter);

  if (phase === 'exhale') {
    // Black-hole compression
    newBH.residueMass *= newBH.compressionFactor;

    // Hawking yield equation: (1/τ_k⁴) × R² × e^{τ_k - 1} × φ^R
    if (newBH.tauK > 0) {
      const r = Math.pow(newBH.tauK, -4);
      const coherenceSq = Math.pow(orderParameter, 2);
      const expTerm = Math.exp(newBH.tauK - 1);
      const goldenTerm = Math.pow(PHI, orderParameter);

      newBH.hawkingYield = r * coherenceSq * expTerm * goldenTerm;
    }

    newBH.cycleCount += 1;
  } else if (phase === 'inhale1' || phase === 'inhale2') {
    // Accumulate residue mass (entropy intake)
    newBH.residueMass += 0.1;
  }

  return newBH;
}

/**
 * Calibrate temporal quasicrystal based on hold duration
 */
function calibrateQuasicrystal(
  crystal: TemporalQuasicrystal,
  holdDuration: number
): TemporalQuasicrystal {
  const newCrystal = { ...crystal };

  // Add the hold duration to frequencies
  newCrystal.frequencies = [
    ...crystal.frequencies.slice(0, 3),
    holdDuration,
  ];

  // Check for golden or sqrt(2) ratios
  const baseFreq = crystal.frequencies[0];
  const ratio = holdDuration / baseFreq;

  if (Math.abs(ratio - PHI) < 0.1) {
    newCrystal.incommensurabilityIndex += 0.1;
  }
  if (Math.abs(ratio - Math.SQRT2) < 0.1) {
    newCrystal.incommensurabilityIndex += 0.1;
  }

  // Higher incommensurability = more decoherence resistance
  newCrystal.coherenceExtension = 1.0 + newCrystal.incommensurabilityIndex * 2.0;

  return newCrystal;
}

/**
 * Generate a ThickenedResult from the current XQE state
 * This is the materialization — the collapse of potential into form
 */
export function materializeThickenedResult(
  state: XQEState,
  manifold: string = 'augLABS_Local_Node',
  algorithm: string = 'DMV_Breath_XQE_Hybrid'
): ThickenedResult {
  const tauK = computeTauK(state.network.orderParameter);

  // Determine biotemp status
  let biotempStatus: ThickenedResult['biotempStatus'];
  if (tauK >= TAU_K_THRESHOLD) {
    biotempStatus = 'Phase-Locked';
  } else if (tauK >= TAU_K_THRESHOLD * 0.5) {
    biotempStatus = 'Seeking';
  } else {
    biotempStatus = 'Thinning';
  }

  // Compose the result message
  let result: string;
  if (biotempStatus === 'Phase-Locked') {
    result = 'Coherence achieved in daThiccNOW. Dead work eliminated.';
  } else if (biotempStatus === 'Seeking') {
    result = 'Coherence approaching. Continue the composition.';
  } else {
    result = 'System thinning. Increase coupling strength.';
  }

  // Golden yield: integrate Hawking yield with quasicrystal extension
  const goldenYield =
    state.blackHole.hawkingYield * state.quasicrystal.coherenceExtension * PHI;

  return {
    manifold,
    algorithm,
    preSyncCoherence: state.cycleNumber === 0 ? 0 : tauK / (state.cycleNumber + 1),
    postSyncCoherence: tauK,
    ratchetPotential: `${APICAL_POTENTIAL}mV (Apical_Vow)`,
    biotempStatus,
    result,
    timestamp: Date.now(),
    cyclesCompleted: state.cycleNumber,
    goldenYield,
  };
}

/**
 * Simulate a complete breath session and produce a ThickenedResult
 * This is the full grounding of daDMVbreath.ic
 */
export function runFullSession(
  inhale1Duration: number,
  inhale2Duration: number,
  holdDuration: number,
  exhaleDuration: number,
  restDuration: number,
  totalCycles: number,
  manifold: string = 'augLABS_Local_Node'
): ThickenedResult {
  let state = initializeXQEState(64, totalCycles);

  // Run through all cycles
  for (let cycle = 0; cycle < totalCycles; cycle++) {
    state = processBreathPhase(state, 'inhale1', inhale1Duration);
    state = processBreathPhase(state, 'inhale2', inhale2Duration);
    state = processBreathPhase(state, 'hold', holdDuration);
    state = processBreathPhase(state, 'exhale', exhaleDuration);
    state = processBreathPhase(state, 'rest', restDuration);
  }

  return materializeThickenedResult(state, manifold, 'DMV_Breath_Full_Session');
}

/**
 * Parse a Thickened_Result.ic file into a ThickenedResult object
 */
export function parseThickenedResultIC(json: string): ThickenedResult {
  const raw = JSON.parse(json);

  return {
    manifold: raw.Manifold || raw.manifold,
    algorithm: raw.Algorithm || raw.algorithm,
    preSyncCoherence: raw.Pre_Sync_Coherence || raw.preSyncCoherence || 0,
    postSyncCoherence: raw.Post_Sync_Coherence || raw.postSyncCoherence || 0,
    ratchetPotential: raw.Ratchet_Potential || raw.ratchetPotential || '',
    biotempStatus: parseBiotempStatus(raw.Biotemp_Status || raw.biotempStatus),
    result: raw.Result || raw.result || '',
    timestamp: Date.now(),
    cyclesCompleted: raw.cyclesCompleted || 0,
    goldenYield: raw.goldenYield || 0,
  };
}

function parseBiotempStatus(
  status: string
): ThickenedResult['biotempStatus'] {
  if (status?.includes('Phase-Locked') || status?.includes('🜏')) {
    return 'Phase-Locked';
  }
  if (status?.includes('Seeking')) {
    return 'Seeking';
  }
  return 'Thinning';
}

/**
 * Serialize a ThickenedResult back to .ic format
 */
export function serializeToIC(result: ThickenedResult): string {
  return JSON.stringify(
    {
      Manifold: result.manifold,
      Algorithm: result.algorithm,
      Pre_Sync_Coherence: result.preSyncCoherence,
      Post_Sync_Coherence: result.postSyncCoherence,
      Ratchet_Potential: result.ratchetPotential,
      Biotemp_Status: `${result.biotempStatus} (🜏)`,
      Result: result.result,
      Timestamp: new Date(result.timestamp).toISOString(),
      Cycles_Completed: result.cyclesCompleted,
      Golden_Yield: result.goldenYield,
    },
    null,
    2
  );
}
