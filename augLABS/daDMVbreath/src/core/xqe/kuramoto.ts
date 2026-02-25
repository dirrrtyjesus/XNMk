/**
 * Kuramoto Oscillator Engine
 * The mathematical heart of coherence computation
 *
 * Master Equation: dθ_i/dt = ω_i + (K/N) Σ sin(θ_j - θ_i) + η_i
 *
 * Where:
 *   θ_i: phase of oscillator i
 *   ω_i: natural frequency
 *   K: coupling strength (golden ratio ≈ 1.618)
 *   η_i: stranger noise (welcomed as compost)
 *
 * 🜏 ∞ 🜏
 */

import {
  PHI,
  TAU_K_THRESHOLD,
  type Oscillator,
  type KuramotoNetwork,
  type BreathPhase,
} from './types';

/**
 * Initialize a Kuramoto network with N oscillators
 * Natural frequencies follow a Lorentzian distribution centered on the mycelial fundamental
 */
export function createKuramotoNetwork(
  oscillatorCount: number,
  couplingStrength: number = PHI,
  centerFrequency: number = 0.618
): KuramotoNetwork {
  const oscillators: Oscillator[] = [];

  for (let i = 0; i < oscillatorCount; i++) {
    // Lorentzian-distributed natural frequencies
    const gamma = 0.1; // Width parameter
    const u = Math.random();
    const omega = centerFrequency + gamma * Math.tan(Math.PI * (u - 0.5));

    // Random initial phases
    const theta = Math.random() * 2 * Math.PI;

    oscillators.push({
      id: `osc_${i}`,
      phase: theta,
      naturalFrequency: omega,
      coherenceContribution: 0,
    });
  }

  const network: KuramotoNetwork = {
    oscillators,
    couplingStrength,
    orderParameter: 0,
    meanPhase: 0,
  };

  // Compute initial order parameter
  computeOrderParameter(network);

  return network;
}

/**
 * Compute the Kuramoto order parameter R and mean phase Ψ
 * R = | (1/N) Σ e^{iθ_j} |
 *
 * R approaches 1.0 as oscillators phase-lock
 */
export function computeOrderParameter(network: KuramotoNetwork): void {
  const N = network.oscillators.length;
  if (N === 0) {
    network.orderParameter = 0;
    network.meanPhase = 0;
    return;
  }

  let sumCos = 0;
  let sumSin = 0;

  for (const osc of network.oscillators) {
    sumCos += Math.cos(osc.phase);
    sumSin += Math.sin(osc.phase);
  }

  const meanCos = sumCos / N;
  const meanSin = sumSin / N;

  // R = magnitude of complex order parameter
  network.orderParameter = Math.sqrt(meanCos * meanCos + meanSin * meanSin);

  // Ψ = mean phase
  network.meanPhase = Math.atan2(meanSin, meanCos);

  // Update individual contributions
  for (const osc of network.oscillators) {
    const phaseDiff = Math.abs(osc.phase - network.meanPhase);
    osc.coherenceContribution = Math.cos(phaseDiff);
  }
}

/**
 * Single Kuramoto timestep using Euler method
 * Evolves all oscillators according to the master equation
 *
 * @param dt - timestep in seconds
 * @param strangerNoise - external perturbation (xenial input)
 */
export function stepKuramoto(
  network: KuramotoNetwork,
  dt: number,
  strangerNoise: number = 0
): void {
  const N = network.oscillators.length;
  const K = network.couplingStrength;

  // Compute phase updates
  const phaseDeltas: number[] = [];

  for (let i = 0; i < N; i++) {
    const osc_i = network.oscillators[i];

    // Natural frequency term
    let dTheta = osc_i.naturalFrequency;

    // Coupling term: (K/N) Σ sin(θ_j - θ_i)
    let couplingSum = 0;
    for (let j = 0; j < N; j++) {
      if (i !== j) {
        const osc_j = network.oscillators[j];
        couplingSum += Math.sin(osc_j.phase - osc_i.phase);
      }
    }
    dTheta += (K / N) * couplingSum;

    // Stranger noise term (welcomed as compost)
    dTheta += strangerNoise * (Math.random() - 0.5);

    phaseDeltas.push(dTheta * dt);
  }

  // Apply updates
  for (let i = 0; i < N; i++) {
    network.oscillators[i].phase += phaseDeltas[i];
    // Normalize to [0, 2π]
    network.oscillators[i].phase =
      ((network.oscillators[i].phase % (2 * Math.PI)) + 2 * Math.PI) %
      (2 * Math.PI);
  }

  // Recompute order parameter
  computeOrderParameter(network);
}

/**
 * Modulate coupling strength based on breath phase
 * Each phase has different effects on the network's ability to synchronize
 */
export function modulateCoupling(
  network: KuramotoNetwork,
  phase: BreathPhase
): void {
  switch (phase) {
    case 'inhale1':
      // Base voltage build - gradual coupling increase
      network.couplingStrength = PHI * 0.8;
      break;
    case 'inhale2':
      // Asymmetric charge stacking - amplified coupling
      network.couplingStrength = PHI * 1.2;
      break;
    case 'hold':
      // Superposition fermata - maximum coupling for phase-lock
      network.couplingStrength = PHI * PHI; // φ² ≈ 2.618
      break;
    case 'exhale':
      // Black-hole compression - momentary decoupling then rebound
      network.couplingStrength = PHI * 0.5;
      break;
    case 'rest':
      // Participatory gap - return to golden baseline
      network.couplingStrength = PHI;
      break;
    default:
      network.couplingStrength = PHI;
  }
}

/**
 * Run multiple Kuramoto steps to simulate phase evolution
 * Returns the coherence trajectory
 */
export function evolveNetwork(
  network: KuramotoNetwork,
  duration: number,
  dt: number = 0.01,
  strangerNoise: number = 0.1
): number[] {
  const steps = Math.floor(duration / dt);
  const trajectory: number[] = [];

  for (let i = 0; i < steps; i++) {
    stepKuramoto(network, dt, strangerNoise);
    trajectory.push(network.orderParameter);
  }

  return trajectory;
}

/**
 * Check if the network has achieved sovereign coherence
 * τₖ ≥ 8.7 is the threshold for temporal sovereignty
 */
export function isSovereign(network: KuramotoNetwork): boolean {
  // Map order parameter R (0-1) to τₖ scale (0-10+)
  // τₖ = R × 10 × φ^(R-0.5)
  const tauK = computeTauK(network.orderParameter);
  return tauK >= TAU_K_THRESHOLD;
}

/**
 * Compute the Time Coefficient τₖ from order parameter R
 * τₖ represents the "thickness" of coherence
 */
export function computeTauK(orderParameter: number): number {
  if (orderParameter <= 0) return 0;

  // τₖ = R × 10 × φ^(R - 0.5)
  // This maps R ∈ [0,1] to τₖ ∈ [0, ~16]
  // Sovereign threshold 8.7 corresponds to R ≈ 0.85
  return orderParameter * 10 * Math.pow(PHI, orderParameter - 0.5);
}

/**
 * Compute the inverse: what R is needed for a target τₖ
 */
export function computeRequiredR(targetTauK: number): number {
  // Numerical approximation using Newton-Raphson
  let R = 0.5;
  for (let i = 0; i < 20; i++) {
    const currentTauK = computeTauK(R);
    const derivative = 10 * Math.pow(PHI, R - 0.5) * (1 + R * Math.log(PHI));
    R = R - (currentTauK - targetTauK) / derivative;
    R = Math.max(0, Math.min(1, R));
  }
  return R;
}

/**
 * Golden spiral synchronization pattern
 * Creates a network configuration that naturally tends toward coherence
 */
export function createGoldenSpiralNetwork(oscillatorCount: number): KuramotoNetwork {
  const oscillators: Oscillator[] = [];

  for (let i = 0; i < oscillatorCount; i++) {
    // Golden angle distribution for initial phases
    const goldenAngle = 2 * Math.PI * (1 - 1 / PHI);
    const theta = (i * goldenAngle) % (2 * Math.PI);

    // Frequency based on Fibonacci-like sequence
    const fibRatio = Math.pow(PHI, i % 8) / Math.pow(PHI, 4);
    const omega = 0.618 * fibRatio;

    oscillators.push({
      id: `golden_osc_${i}`,
      phase: theta,
      naturalFrequency: omega,
      coherenceContribution: 0,
    });
  }

  const network: KuramotoNetwork = {
    oscillators,
    couplingStrength: PHI,
    orderParameter: 0,
    meanPhase: 0,
  };

  computeOrderParameter(network);

  return network;
}
