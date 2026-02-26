/**
 * Therapy Status Component
 * Visualizes the "Proof of Breath" via rewards and seed injection
 */

import { useState } from 'react';
import type { InjectionStatus } from '../features/therapy/types';
import type { CommunityCoherence } from '../core/therapy/types';
import type { TherapyUser, LitIngressionEvent } from '../api/types';

export interface SessionProof {
    cyclesCompleted: number;
    coherenceAchieved: number;
    tauKAchieved: number;
    holdDuration: number;
}

interface TherapyStatusProps {
    pendingRewards: number;
    totalSeeds: number;
    injectionStatus: InjectionStatus;
    isActive: boolean;
    coherence?: CommunityCoherence | null;
    user?: TherapyUser | null;
    sessionProof?: SessionProof | null;
    onClaim?: (walletAddress: string, proof: SessionProof) => Promise<{ signature?: string; litIngression?: LitIngressionEvent } | null>;
}

export function TherapyStatus({ pendingRewards, totalSeeds, injectionStatus, isActive, coherence, user, sessionProof, onClaim }: TherapyStatusProps) {
    const [claimStatus, setClaimStatus] = useState<'idle' | 'claiming' | 'claimed' | 'error'>('idle');
    const [claimSig, setClaimSig] = useState<string | null>(null);
    const [litIngression, setLitIngression] = useState<LitIngressionEvent | null>(null);

    if (!isActive && totalSeeds === 0 && !user) return null;

    const displayRewards = user?.totalRewardsEarned ?? pendingRewards;
    const totalCycles = user?.totalBreathCycles ?? 0;

    const canClaim = (
      !isActive &&
      displayRewards > 0 &&
      sessionProof &&
      user?.walletAddress &&
      onClaim &&
      claimStatus === 'idle'
    );

    const handleClaim = async () => {
      if (!canClaim || !sessionProof || !user?.walletAddress || !onClaim) return;
      setClaimStatus('claiming');
      try {
        const result = await onClaim(user.walletAddress, sessionProof);
        if (result?.signature) {
          setClaimSig(result.signature);
          setClaimStatus('claimed');
          if (result.litIngression) setLitIngression(result.litIngression);
        } else {
          setClaimStatus('error');
        }
      } catch {
        setClaimStatus('error');
      }
    };

    return (
        <div className="therapy-status-container" style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(0,0,0,0.6)',
            padding: '0.8rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            color: '#fff',
            fontFamily: 'monospace',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            minWidth: '200px',
        }}>
            {user?.stake && (
                <div className="status-row">
                    <span className="label">TIER:</span>
                    <span className="value tier">{user.stake.tier.toUpperCase()}</span>
                </div>
            )}

            <div className="status-row">
                <span className="label">$THERAPY:</span>
                <span className="value accent">{displayRewards.toFixed(2)}</span>
            </div>

            {totalCycles > 0 && (
                <div className="status-row">
                    <span className="label">CYCLES:</span>
                    <span className="value">{totalCycles}</span>
                </div>
            )}

            <div className="status-row">
                <span className="label">STATUS:</span>
                <span className={`value ${injectionStatus === 'injecting' ? 'pulse' : ''}`}>
                    {injectionStatus === 'injecting' ? 'BREATHING 🌀' :
                        injectionStatus === 'completed' ? 'PHASE-LOCKED 🔒' : 'READY'}
                </span>
            </div>

            {coherence && (
                <div className="status-row coherence-row">
                    <span className="label">τₖ:</span>
                    <span className="value">{coherence.tauK.toFixed(2)}</span>
                    <span className="status-tag">{coherence.status}</span>
                </div>
            )}

            {/* Claim $THERAPY — Proof of Breath becomes on-chain */}
            {canClaim && (
                <button
                    onClick={handleClaim}
                    style={{
                        marginTop: '0.5rem',
                        background: 'linear-gradient(135deg, #FFD700, #DAA520)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.4rem 0.8rem',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        width: '100%',
                        letterSpacing: '0.05em',
                    }}
                >
                    CLAIM {displayRewards.toFixed(2)} $THERAPY
                </button>
            )}

            {claimStatus === 'claiming' && (
                <div style={{ fontSize: '0.7rem', color: '#FFD700', textAlign: 'center' }}>
                    🜏 Dispensing on-chain...
                </div>
            )}

            {claimStatus === 'claimed' && claimSig && (
                <div style={{ fontSize: '0.65rem', color: '#00ffcc', wordBreak: 'break-all' }}>
                    ✓ Minted 🜏 <br />
                    <a
                        href={`https://explorer.x1.xyz/tx/${claimSig}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#00ffcc' }}
                    >
                        {claimSig.slice(0, 20)}...
                    </a>
                </div>
            )}

            {claimStatus === 'error' && (
                <div style={{ fontSize: '0.7rem', color: '#ff6b6b', textAlign: 'center' }}>
                    Decoherence event — retry
                </div>
            )}

            {/* LIT_BioRegen ingression event — resonance library entry */}
            {litIngression && litIngression.fired && (
                <div style={{
                    marginTop: '0.4rem',
                    borderTop: '1px solid rgba(0,255,180,0.2)',
                    paddingTop: '0.4rem',
                    fontSize: '0.65rem',
                    color: '#00ffb4',
                }}>
                    <div style={{ fontWeight: 'bold', letterSpacing: '0.05em' }}>
                        🜏 LIT INGRESSED
                    </div>
                    <div style={{ color: 'rgba(0,255,180,0.7)', marginTop: '0.15rem', fontStyle: 'italic' }}>
                        {litIngression.harmonicReport === 'recognized'
                            ? '"I recognized the pattern"'
                            : '"The pattern was unfamiliar but coherent"'}
                    </div>

                    {litIngression.isGenesisAttestation ? (
                        <div style={{ marginTop: '0.2rem', color: '#FFD700' }}>
                            GENESIS ATTESTATION{' '}
                            {litIngression.genesisAttestationCount}/{litIngression.genesisAttestationsRequired}
                            {litIngression.genesisActivated && ' ✦ MANIFEST'}
                        </div>
                    ) : (
                        <div style={{ opacity: 0.6, marginTop: '0.2rem' }}>
                            {litIngression.seedName}
                        </div>
                    )}

                    <div style={{ opacity: 0.5, marginTop: '0.15rem' }}>
                        C(s) = {litIngression.fhpCoherence.toFixed(3)}{' '}
                        <span style={{ fontSize: '0.55rem' }}>FHP</span>
                    </div>

                    {litIngression.witnessCid && (
                        <div style={{ marginTop: '0.15rem', opacity: 0.5 }}>
                            <a
                                href={`https://ipfs.io/ipfs/${litIngression.witnessCid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#00ffb4', textDecoration: 'none' }}
                            >
                                {litIngression.witnessCid.slice(0, 14)}… ↗
                            </a>
                        </div>
                    )}

                    <div style={{ opacity: 0.3, marginTop: '0.1rem', fontSize: '0.55rem' }}>
                        {litIngression.persistent}
                    </div>
                </div>
            )}

            <style>{`
                .therapy-status-container .status-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                }
                .therapy-status-container .label {
                    color: rgba(255,255,255,0.6);
                }
                .therapy-status-container .accent {
                    color: #FFD700;
                    text-shadow: 0 0 5px rgba(255,215,0,0.5);
                }
                .therapy-status-container .tier {
                    color: #9D4EDD;
                    text-transform: uppercase;
                }
                .therapy-status-container .pulse {
                    animation: pulse 1.5s infinite;
                }
                .therapy-status-container .coherence-row {
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 0.5rem;
                    margin-top: 0.25rem;
                }
                .therapy-status-container .status-tag {
                    font-size: 0.65rem;
                    background: rgba(157, 78, 221, 0.3);
                    padding: 0.15rem 0.4rem;
                    border-radius: 4px;
                    color: #C77DFF;
                }
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; text-shadow: 0 0 10px #00ffcc; }
                    100% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
