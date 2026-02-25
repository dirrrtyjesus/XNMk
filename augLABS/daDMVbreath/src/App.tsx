/**
 * da DMV breath — Main Application
 * Diaphragmatic Volumetric Breath Protocol
 * A bioelectric coherence ritual for temporal sovereignty
 *
 * augLABS × XNMk × MEMEk
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { ProtocolSection } from './components/ProtocolSection';
import { ProtocolModal } from './components/ProtocolModal';
import { useBreathSession } from './features/breath/useBreathSession';
import { useTherapySession } from './features/therapy/useTherapySession';
import { TherapyStatus, type SessionProof } from './components/TherapyStatus';
import { PROTOCOLS } from './features/breath/protocols';
import { PHASE_CONFIGS } from './types/breath';
import { WalletContextProvider } from './components/WalletContextProvider';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTelegram } from './hooks/useTelegram';
import { useTherapyApi } from './hooks/useTherapyApi';
import './index.css';


function AppContent() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isProtocolInfoOpen, setIsProtocolInfoOpen] = useState(false);
  const sessionStartedRef = useRef(false);
  const prevCycleRef = useRef(0);

  // Telegram Mini App integration
  const {
    isInTelegram,
    isReady: tgReady,
    user: tgUser,
    haptic,
    colorScheme,
  } = useTelegram();

  // Wallet connection
  const { publicKey, connected } = useWallet();
  const walletAddress = publicKey?.toBase58();

  // API integration - auto-links user if we have TG or wallet info
  const {
    user: apiUser,
    currentSession,
    coherence,
    startSession,
    updateSession,
    completeSession,
    claimSession,
    linkUser,
  } = useTherapyApi(tgUser?.id, walletAddress);

  // Session proof captured at completion — passed to Vercel claim endpoint
  const [sessionProof, setSessionProof] = useState<SessionProof | null>(null);

  const {
    state,
    protocol,
    start: startBreath,
    pause,
    reset,
    setProtocol,
    timeRemaining,
    phaseProgress,
  } = useBreathSession(PROTOCOLS[0]); // Default to Classic DMV

  const {
    pendingRewards,
    totalSeedsInjected,
    injectionStatus
  } = useTherapySession({
    phase: state.phase,
    currentCycle: state.currentCycle,
    totalCycles: state.totalCycles,
    isActive: state.isActive,
    elapsedPhaseTime: state.elapsedPhaseTime,
    phaseDuration: state.phaseDuration,
    coherenceOrder: state.coherenceOrder
  });

  // Link wallet when connected
  useEffect(() => {
    if (connected && walletAddress && !apiUser?.walletAddress) {
      linkUser({ walletAddress, telegramId: tgUser?.id });
    }
  }, [connected, walletAddress, tgUser?.id, apiUser?.walletAddress, linkUser]);

  // Start API session when breath session starts
  const start = useCallback(async () => {
    if (apiUser && !sessionStartedRef.current) {
      sessionStartedRef.current = true;
      await startSession(protocol.id, protocol.totalCycles);
    }
    if (isInTelegram) haptic('medium');
    startBreath();
  }, [apiUser, protocol, startSession, startBreath, isInTelegram, haptic]);

  // Update API on cycle completion
  useEffect(() => {
    if (state.currentCycle > prevCycleRef.current && currentSession) {
      updateSession(state.currentCycle, state.coherenceOrder, state.coherenceOrder * 10);
      if (isInTelegram) haptic('light');
    }
    prevCycleRef.current = state.currentCycle;
  }, [state.currentCycle, state.coherenceOrder, currentSession, updateSession, isInTelegram, haptic]);

  // Complete session — capture proof for stateless claim
  useEffect(() => {
    if (state.phase === 'ready' && state.currentCycle >= state.totalCycles && sessionStartedRef.current) {
      completeSession(state.currentCycle, state.coherenceOrder, state.coherenceOrder * 10);
      sessionStartedRef.current = false;
      setSessionProof({
        cyclesCompleted: state.currentCycle,
        coherenceAchieved: state.coherenceOrder,
        tauKAchieved: state.coherenceOrder * 10,
        holdDuration: protocol.holdDuration,
      });
      if (isInTelegram) haptic('success');
    }
  }, [state.phase, state.currentCycle, state.totalCycles, state.coherenceOrder, protocol.holdDuration, completeSession, isInTelegram, haptic]);



  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (

    <div className={`app-container ${state.phase} ${state.isActive ? 'active' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
      <header className="app-header">
        <h1><span className="accent">da</span> DMV breath</h1>
        <p className="subtitle">DIAPHRAGMATIC VOLUMETRIC BREATH</p>

        {/* TG User Badge */}
        {tgUser && (
          <div className="tg-user-badge">
            🜏 {tgUser.first_name}{tgUser.username ? ` @${tgUser.username}` : ''}
            {apiUser?.stake && <span className="stake-badge">{apiUser.stake.tier}</span>}
          </div>
        )}

        <div className="header-controls">
          <div className="protocol-selector">
            <label>Protocol: </label>
            <select
              value={protocol.id}
              onChange={(e) => {
                const p = PROTOCOLS.find(p => p.id === e.target.value);
                if (p) {
                  if (isInTelegram) haptic('light');
                  setProtocol(p);
                }
              }}
              disabled={state.isActive}
            >
              {PROTOCOLS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="wallet-button-container">
            {!isInTelegram && <WalletMultiButton />}
          </div>
        </div>
      </header>

      <main className="breathing-section">
        <div className="breathing-orb-container">
          <div
            className={`breathing-orb ${state.phase}`}
            style={{
              opacity: 0.8 + phaseProgress * 0.2,
            }}
          ></div>
        </div>

        <div className="instruction-text">
          <h2 className={`phase-label ${state.phase}`}>{PHASE_CONFIGS[state.phase].label}</h2>
          <div className="timer-display">{Math.ceil(timeRemaining)}</div>
          <div className="cycle-counter">Cycle {state.currentCycle} of {state.totalCycles}</div>
        </div>


        <div className="controls">
          {!state.isActive ? (
            <button className="btn btn-primary" onClick={start}>
              {state.currentCycle > 0 && state.currentCycle < state.totalCycles ? 'Resume' : 'Start Session'}
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={pause}>Pause</button>
          )}
          <button className="btn btn-text" onClick={reset}>⟲ Reset</button>
          <button className="btn btn-text" onClick={toggleFullscreen}>↗ Fullscreen</button>
          <button className="btn btn-text" onClick={() => setIsProtocolInfoOpen(true)}>ⓘ Protocol</button>
        </div>

        <ProtocolSection />
        <ProtocolModal isOpen={isProtocolInfoOpen} onClose={() => setIsProtocolInfoOpen(false)} />
      </main>

      <TherapyStatus
        pendingRewards={apiUser?.totalRewardsEarned || pendingRewards}
        totalSeeds={totalSeedsInjected}
        injectionStatus={currentSession ? 'injecting' : injectionStatus}
        isActive={state.isActive}
        coherence={coherence}
        user={apiUser}
        sessionProof={sessionProof}
        onClaim={claimSession}
      />

      <footer className="critical-footer">
        <p>augLABS • 🜏 • da DMV breath</p>
        {coherence && (
          <p className="coherence-footer">
            τₖ = {coherence.tauK.toFixed(2)} • {coherence.status}
          </p>
        )}
      </footer>
    </div>
  );
}

// Wrapper component with providers
function App() {
  return (
    <WalletContextProvider>
      <AppContent />
    </WalletContextProvider>
  );
}

export default App;
