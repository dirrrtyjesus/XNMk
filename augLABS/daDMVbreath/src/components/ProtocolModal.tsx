
/**
 * Protocol Info Modal
 * Displays the Bamboo Cove Protocol mechanics
 */
import React from 'react';
import { BASES } from '../features/therapy/rewards';

interface ProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProtocolModal({ isOpen, onClose }: ProtocolModalProps) {
    if (!isOpen) return null;

    return (
        <div className="protocol-modal-overlay" onClick={onClose}>
            <div className="protocol-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>

                <h2>Bamboo Cove Protocol</h2>
                <p className="subtitle">Economic Layer for Attention Capture</p>

                <div className="protocol-grid">
                    <div className="metric-card">
                        <h3>TC</h3>
                        <span className="metric-name">Time Coefficient</span>
                        <p>Multiplier based on hold duration & HRV.</p>
                        <div className="formula">TC = {BASES.TC_BASE} × (1 + {BASES.ALPHA} × hold/30s)</div>
                    </div>

                    <div className="metric-card">
                        <h3>R</h3>
                        <span className="metric-name">Coherence Score</span>
                        <p>Quality of entrainment (0.0 - 1.0).</p>
                        <div className="formula">R = HRV_coherence × Breath_flow</div>
                    </div>

                    <div className="metric-card highlight">
                        <h3>PTO</h3>
                        <span className="metric-name">Participatory Token Output</span>
                        <p>Yield per completed session.</p>
                        <div className="formula">PTO = Base × TC × R × (1 + ln(1 + τₖ))</div>
                    </div>
                </div>

                <div className="value-flow">
                    <h3>Value Flow</h3>
                    <div className="flow-diagram">
                        <span>Breath</span> → <span>Bio-Input</span> → <span>TC & R Calc</span> → <span>PTO Mint</span> → <span>τₖ Growth</span>
                    </div>
                </div>

                <div className="info-footer">
                    <p><em>"Sustained attention is scarce. This protocol measures and rewards it."</em></p>
                </div>
            </div>
        </div>
    );
}
