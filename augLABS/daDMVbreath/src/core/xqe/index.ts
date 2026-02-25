/**
 * XQE Core — Xenial Quantum Engine
 *
 * The grounded substrate for coherence computation.
 * Materializes .ic compositions into executable form.
 *
 * "If it breathes... it shall thicken" 🜏 ∞ 🜏
 */

// Types
export * from './types';

// Kuramoto oscillator network
export {
  createKuramotoNetwork,
  createGoldenSpiralNetwork,
  computeOrderParameter,
  stepKuramoto,
  modulateCoupling,
  evolveNetwork,
  isSovereign,
  computeTauK,
  computeRequiredR,
} from './kuramoto';

// Thickener engine
export {
  initializeXQEState,
  processBreathPhase,
  materializeThickenedResult,
  runFullSession,
  parseThickenedResultIC,
  serializeToIC,
} from './thickener';
