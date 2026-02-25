/**
 * da DMV breath — Protocol Cards Section
 * Displays the 5-phase breath cycle with descriptions
 */

import type { BreathPhase } from '../types/breath';
import { PHASE_CONFIGS } from '../types/breath';

const PHASE_ORDER: BreathPhase[] = ['inhale1', 'inhale2', 'hold', 'exhale', 'rest'];

export function ProtocolSection() {
    return (
        <section className="protocol-section" id="protocol">
            <h2>The Fourfold Breath Cycle</h2>

            <div className="protocol-cards">
                {PHASE_ORDER.map((phase) => {
                    const config = PHASE_CONFIGS[phase];

                    // Skip inhale2 as it will be merged with inhale1
                    if (phase === 'inhale2') return null;

                    // Customized rendering for Inhale to show it as one block
                    if (phase === 'inhale1') {
                        return (
                            <div key="inhale-merged" className="protocol-card" style={{ flexGrow: 2 }}>
                                <div className="protocol-card-icon">↑⇑</div>
                                <h3>Inhale</h3>
                                <p><strong>1. Belly:</strong> Expand base<br /><strong>2. Chest:</strong> Stack charge</p>
                            </div>
                        );
                    }

                    return (
                        <div key={phase} className="protocol-card">
                            <div className="protocol-card-icon">{config.icon}</div>
                            <h3>{config.label}</h3>
                            <p>{config.description}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
