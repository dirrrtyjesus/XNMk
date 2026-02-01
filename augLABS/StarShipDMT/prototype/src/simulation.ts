export interface SimState {
    Ac: number; // Agency Coefficient [0, 1]
    tau_k: number; // Temporal Coherence [0, 1]
    gamma_eff: number; // Effective Decoherence Rate
    integrity: number; // Hull Integrity [0, 100]
    phase: 'ORBITAL' | 'ENTRY_INTERFACE' | 'PEAK_HEATING' | 'TERMINAL';
    altitude: number; // km
    velocity: number; // km/s
}

export const INITIAL_STATE: SimState = {
    Ac: 0.0,
    tau_k: 0.5,
    gamma_eff: 50.0,
    integrity: 100.0,
    phase: 'ORBITAL',
    altitude: 150.0,
    velocity: 7.8,
};

// Master Equation Simulation Step
export const calculateNextState = (current: SimState, dt: number): SimState => {
    // 1. Modulate Tau_K based on Agency (Ac)
    // Master Equation: tau_k(t) = alpha*tau_k(t-1) + Ac * gamma_source
    // We simplify for the visual loop: Target Tau uses sigmoid
    const targetTau = 0.5 + 0.5 * current.Ac;
    const nextTau = current.tau_k + (targetTau - current.tau_k) * 0.1; // Smooth transition

    // 2. Calculate Decoherence (Gamma Eff) based on Tau
    // gamma_eff = gamma0 * exp(-6 * tau * Ac)
    const gamma0 = 50.0;
    const nextGamma = gamma0 * Math.exp(-6.0 * nextTau * current.Ac);
    // If Ac is 0, exp(0) -> 1 -> High Gamma (50)
    // If Ac is 1 and Tau is 1 -> exp(-6) -> ~0.002 -> Low Gamma

    // 3. Simulate Phase & Altitude
    let nextAlt = current.altitude - (current.velocity * dt * 0.1);
    if (nextAlt < 0) nextAlt = 150; // Loop simulation for prototype

    // Update Velocity based on altitude (aerobraking)
    let nextVel = current.velocity;
    let nextPhase = current.phase;

    if (nextAlt > 100) {
        nextPhase = 'ORBITAL';
        nextVel = 7.8;
    } else if (nextAlt > 60) {
        nextPhase = 'ENTRY_INTERFACE';
        nextVel = 7.5;
    } else if (nextAlt > 40) {
        nextPhase = 'PEAK_HEATING';
        nextVel -= 0.05; // Drag
    } else {
        nextPhase = 'TERMINAL';
        nextVel -= 0.1;
    }

    // 4. Integrity Decay
    // Damage = Gamma_Eff * Stress Factor
    const stress = nextPhase === 'PEAK_HEATING' ? 2.0 : 0.1;
    const damage = (nextGamma * stress * dt) / 100.0;
    let nextIntegrity = current.integrity - damage;
    if (nextAlt > 140) nextIntegrity = 100; // Reset on loop start

    return {
        ...current,
        tau_k: nextTau,
        gamma_eff: nextGamma,
        phase: nextPhase,
        altitude: nextAlt,
        velocity: Math.max(0, nextVel),
        integrity: Math.max(0, nextIntegrity),
    };
};
