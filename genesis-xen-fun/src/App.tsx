import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletConnect } from './components/WalletConnect';
import { RitualCircle } from './components/RitualCircle';
import { SuccessModal } from './components/SuccessModal';
import { useSIC } from './hooks/useSIC';
import { PublicKey } from '@solana/web3.js';

// Types
export type RitualState = 'IDLE' | 'CONNECTED' | 'DISCOVERED' | 'SIGNING' | 'MINTING' | 'COMPLETE';

export interface DiscoveryData {
  account: string;
  hash_to_verify: string;
  key: string;
  block_id: number;
  xnm_amount: number;
}

function App() {
  const [state, setState] = useState<RitualState>('IDLE');
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [x1Address, setX1Address] = useState<string | null>(null);
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  // Mock Wallet for SIC
  const mockWallet = useMemo(() => {
    if (!x1Address) return null;
    return {
      publicKey: new PublicKey("11111111111111111111111111111111"), // Mock Key
      signTransaction: async (tx: any) => tx,
      signAllTransactions: async (txs: any[]) => txs,
    };
  }, [x1Address]);

  const { intentGate } = useSIC(mockWallet);

  // Mock Discovery
  const discoverXNM = async (address: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock data based on syncnode.py structure
    const mockData: DiscoveryData = {
      account: address,
      hash_to_verify: "$argon2id$v=19$m=65536,t=2,p=1$SaltIsAddress...",
      key: address,
      block_id: 12345,
      xnm_amount: 1024
    };

    setDiscoveryData(mockData);
    setState('DISCOVERED');
  };

  const handleEvmConnect = async () => {
    // Mock EVM connection
    const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
    setEvmAddress(mockAddress);
  };

  const handleX1Connect = async () => {
    // Mock X1 connection
    const mockAddress = "X1zQ2s...MockAddress";
    setX1Address(mockAddress);
  };

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnect } from './components/WalletConnect';
import { RitualCircle } from './components/RitualCircle';
import { SuccessModal } from './components/SuccessModal';
import { useSIC } from './hooks/useSIC';

// Types
export type RitualState = 'IDLE' | 'CONNECTED' | 'DISCOVERED' | 'SIGNING' | 'MINTING' | 'COMPLETE';

export interface DiscoveryData {
  account: string;
  hash_to_verify: string;
  key: string;
  block_id: number;
  xnm_amount: number;
}

function App() {
  const [state, setState] = useState<RitualState>('IDLE');
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const wallet = useWallet();
  const { intentGate } = useSIC(wallet);

  // Mock Discovery
  const discoverXNM = async (address: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock data based on syncnode.py structure
    const mockData: DiscoveryData = {
      account: address,
      hash_to_verify: "$argon2id$v=19$m=65536,t=2,p=1$SaltIsAddress...",
      key: address,
      block_id: 12345,
      xnm_amount: 1024
    };

    setDiscoveryData(mockData);
    setState('DISCOVERED');
  };

  const handleEvmConnect = async () => {
    // Mock EVM connection
    const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
    setEvmAddress(mockAddress);
  };

  useEffect(() => {
    if (evmAddress && wallet.publicKey && state === 'IDLE') {
      setState('CONNECTED');
      discoverXNM(evmAddress);
    }
  }, [evmAddress, wallet.publicKey, state]);

  const startRitual = async () => {
    if (!discoveryData) return;

    setState('SIGNING');

    // 1. The Intent Gate (Î)
    // We pass the "Chronos State" (Hash) to be collapsed.
    try {
      const signature = await intentGate(
        discoveryData.hash_to_verify,
        discoveryData.key
      );

      setState('MINTING');
      // Simulate network confirmation time if needed, though intentGate handles some
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTxSignature(signature as string);
      setState('COMPLETE');
    } catch (error) {
      console.error("Ritual Failed:", error);
      setState('DISCOVERED'); // Reset on failure
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Background Void Animation */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">

        <AnimatePresence mode="wait">
          {state === 'IDLE' || state === 'CONNECTED' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl"
            >
              <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-center mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                GENESIS RITUAL
              </h1>
              <p className="text-center text-white/40 mb-12 text-lg font-light tracking-wide">
                Bridge your potential energy to kinetic capital.
              </p>

              <WalletConnect
                evmAddress={evmAddress}
                x1Address={wallet.publicKey?.toBase58() || null}
                onConnectEvm={handleEvmConnect}
              />
            </motion.div>
          ) : null}

          {(state === 'DISCOVERED' || state === 'SIGNING' || state === 'MINTING') && discoveryData && (
            <RitualCircle
              state={state}
              data={discoveryData}
              onInitiate={startRitual}
            />
          )}

          {state === 'COMPLETE' && discoveryData && (
            <SuccessModal
              amount={discoveryData.xnm_amount}
              txHash={txSignature || "0x..."}
            />
          )}
        </AnimatePresence>

      </div>

      {/* Footer Status */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-xs text-white/20 font-mono uppercase tracking-widest">
        System Status: {state} | SIC: {wallet.publicKey ? "ACTIVE" : "STANDBY"}
      </div>
    </div>
  );
}

export default App;

  const startRitual = async () => {
    if (!discoveryData) return;

    setState('SIGNING');

    // 1. The Intent Gate (Î)
    // We pass the "Chronos State" (Hash) to be collapsed.
    try {
      const signature = await intentGate(
        discoveryData.hash_to_verify,
        discoveryData.key
      );

      setState('MINTING');
      // Simulate network confirmation time if needed, though intentGate handles some
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTxSignature(signature as string);
      setState('COMPLETE');
    } catch (error) {
      console.error("Ritual Failed:", error);
      setState('DISCOVERED'); // Reset on failure
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Background Void Animation */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">

        <AnimatePresence mode="wait">
          {state === 'IDLE' || state === 'CONNECTED' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl"
            >
              <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-center mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                GENESIS RITUAL
              </h1>
              <p className="text-center text-white/40 mb-12 text-lg font-light tracking-wide">
                Bridge your potential energy to kinetic capital.
              </p>

              <WalletConnect
                evmAddress={evmAddress}
                x1Address={x1Address}
                onConnectEvm={handleEvmConnect}
                onConnectX1={handleX1Connect}
              />
            </motion.div>
          ) : null}

          {(state === 'DISCOVERED' || state === 'SIGNING' || state === 'MINTING') && discoveryData && (
            <RitualCircle
              state={state}
              data={discoveryData}
              onInitiate={startRitual}
            />
          )}

          {state === 'COMPLETE' && discoveryData && (
            <SuccessModal
              amount={discoveryData.xnm_amount}
              txHash={txSignature || "0x..."}
            />
          )}
        </AnimatePresence>

      </div>

      {/* Footer Status */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-xs text-white/20 font-mono uppercase tracking-widest">
        System Status: {state} | SIC: {mockWallet ? "ACTIVE" : "STANDBY"}
      </div>
    </div>
  );
}

export default App;
