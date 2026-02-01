import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import AgencyControl from './components/AgencyControl';
import MetricsPanel from './components/MetricsPanel';
import ReEntryVis from './components/ReEntryVis';
import X1Connect from './components/X1Connect';
import { INITIAL_STATE, calculateNextState, type SimState } from './simulation';
import { WalletContextProvider } from './components/WalletContextProvider';

function AppContent() {
  const [ac, setAc] = useState(0.0);
  const [state, setState] = useState<SimState>(INITIAL_STATE);
  const [hasRamped, setHasRamped] = useState(false);

  const { connected } = useWallet();

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setState(curr => {
        const next = calculateNextState({ ...curr, Ac: ac }, 0.1);
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [ac]);

  // Sovereign Ramp on Connection
  useEffect(() => {
    if (connected && !hasRamped) {
      setHasRamped(true);
      let ramp = 0.0;
      const interval = setInterval(() => {
        ramp += 0.05;
        if (ramp >= 0.95) {
          ramp = 0.97;
          clearInterval(interval);
        }
        setAc(ramp);
      }, 50);
    } else if (!connected && hasRamped) {
      setHasRamped(false);
      setAc(0.0);
    }
  }, [connected, hasRamped]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden selection:bg-xenial-500 selection:text-black">

      {/* Background Visuals */}
      <ReEntryVis state={state} />

      {/* Header */}
      <div className="fixed top-8 left-8 z-50 pointer-events-none">
        <h1 className="text-4xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-xenial-500 to-xenial-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          STARSHIP DMT
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="h-px w-12 bg-xenial-500/50"></span>
          <span className="text-xs font-mono text-xenial-500 tracking-widest">
            QUANTUM COHERENCE FORGE v0.9.1
          </span>
        </div>
      </div>

      {/* Components */}
      <X1Connect isConnected={connected} onConnect={() => { }} />
      <MetricsPanel state={state} />
      <AgencyControl ac={ac} setAc={setAc} disabled={!connected} />

      {/* Footer / Status */}
      <div className="fixed bottom-6 right-6 z-40 text-right">
        <div className="text-[10px] font-mono text-xenial-700">
          AUGMENTED PATHWAY: XQE-X1-INTEGRATION<br />
          SESSION ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </div>
      </div>

      {/* Introduction Overlay (Fades out on Connect) */}
      {!connected && (
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="max-w-2xl text-center space-y-6">
            <h2 className="text-5xl font-display font-bold text-white/10 blur-[1px]">
              DECOHERENCE DETECTED
            </h2>
          </div>
        </div>
      )}

    </div>
  );
}

function App() {
  return (
    <WalletContextProvider>
      <AppContent />
    </WalletContextProvider>
  );
}

export default App;
