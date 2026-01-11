import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// GENESIS RITUAL: XNM → XNMk COMPOSITIONAL MINT
// ============================================================================
// Flow:
// 1. Connect EVM wallet (MetaMask/etc) - get EIP-55 checksummed address
// 2. Sign message with address (proves ownership, address becomes SALT)
// 3. Fetch XNM balance associated with address from XenBlocks
// 4. Generate Argon2id commitment hash with address as SALT
// 5. Mint XNMk on X1 (Solana) mirroring XNM amount
// ============================================================================

// Utility: Convert address to EIP-55 checksum format
const toChecksumAddress = (address) => {
  if (!address || address.length !== 42) return address;
  const addr = address.toLowerCase().replace('0x', '');
  // Simplified checksum - in production use keccak256
  let checksummed = '0x';
  for (let i = 0; i < addr.length; i++) {
    const char = addr[i];
    if (parseInt(char, 16) >= 8) {
      checksummed += char.toUpperCase();
    } else {
      checksummed += char;
    }
  }
  return checksummed;
};

// τ-bit Visualization Component
const TauBitOrb = ({ coherence, size = 200 }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    
    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, size, size);
      
      const centerX = size / 2;
      const centerY = size / 2;
      const maxRadius = size * 0.4;
      
      // Chronos state (outer ring - entropy)
      const chronosOpacity = 1 - coherence;
      ctx.strokeStyle = `rgba(100, 120, 140, ${chronosOpacity * 0.6})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.1;
        const wobble = Math.sin(time * 2 + i) * 5 * (1 - coherence);
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius + wobble, angle, angle + 0.3);
        ctx.stroke();
      }
      
      // Kairos state (inner glow - coherence)
      const kairosRadius = maxRadius * coherence * 0.8;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, kairosRadius || 1);
      gradient.addColorStop(0, `rgba(255, 200, 100, ${coherence * 0.9})`);
      gradient.addColorStop(0.5, `rgba(255, 160, 60, ${coherence * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 140, 40, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, kairosRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Resonance rings
      for (let i = 0; i < 3; i++) {
        const ringRadius = maxRadius * 0.3 + (i * maxRadius * 0.2);
        const pulse = Math.sin(time * 3 - i * 0.5) * 0.1 + 0.9;
        ctx.strokeStyle = `rgba(255, 180, 80, ${coherence * 0.3 * pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius * pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Minor third frequency line
      if (coherence > 0.3) {
        ctx.strokeStyle = `rgba(255, 220, 150, ${coherence * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < size; x++) {
          const freq1 = Math.sin((x / size) * Math.PI * 6 + time * 4);
          const freq2 = Math.sin((x / size) * Math.PI * 6 * 1.2 + time * 4);
          const combined = (freq1 + freq2) * 0.5 * coherence * 15;
          const y = centerY + combined;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [coherence, size]);
  
  return <canvas ref={canvasRef} width={size} height={size} style={{ display: 'block' }} />;
};

// Argon2 Hash Display (simulated structure)
const Argon2HashDisplay = ({ address, salt, hash }) => {
  if (!hash) return null;
  
  // Simulate Argon2id hash structure: $argon2id$v=19$m=memory,t=iterations,p=parallelism$salt$hash
  const displayHash = `$argon2id$v=19$m=80,t=1,p=1$${salt}$${hash}`;
  
  return (
    <div style={{
      background: 'rgba(20, 25, 40, 0.9)',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid rgba(255, 180, 80, 0.2)',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '11px',
      wordBreak: 'break-all',
      lineHeight: 1.6,
    }}>
      <div style={{ color: 'rgba(150, 160, 180, 0.6)', marginBottom: '8px' }}>
        ARGON2ID COMMITMENT HASH
      </div>
      <div style={{ color: '#8BC4FF' }}>
        <span style={{ color: 'rgba(150, 160, 180, 0.5)' }}>$argon2id$v=19$m=80,t=1,p=1$</span>
        <span style={{ color: '#FFB347' }}>{salt}</span>
        <span style={{ color: 'rgba(150, 160, 180, 0.5)' }}>$</span>
        <span style={{ color: '#90D090' }}>{hash}</span>
      </div>
      <div style={{ 
        marginTop: '12px', 
        paddingTop: '12px', 
        borderTop: '1px solid rgba(100, 120, 140, 0.2)',
        color: 'rgba(150, 160, 180, 0.5)',
        fontSize: '10px',
      }}>
        SALT derived from EIP-55 address: {address?.slice(0, 10)}...{address?.slice(-8)}
      </div>
    </div>
  );
};

// Genesis Ritual Main Component
const GenesisRitual = ({ evmAddress, xnmBalance, onMint }) => {
  const [step, setStep] = useState(1); // 1: Connect, 2: Sign, 3: Verify, 4: Mint
  const [signature, setSignature] = useState(null);
  const [commitmentHash, setCommitmentHash] = useState(null);
  const [salt, setSalt] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintComplete, setMintComplete] = useState(false);
  const [termDays, setTermDays] = useState(30);
  
  // Generate SALT from address (XEN prefix + address fragment)
  const generateSalt = (address) => {
    if (!address) return null;
    const addrClean = address.replace('0x', '').toUpperCase();
    return `XEN${addrClean.slice(0, 16)}`;
  };
  
  // Simulate Argon2id hash (in production, use actual argon2 wasm)
  const generateArgon2Hash = (salt, data) => {
    // Simulated hash - looks like real Argon2 output
    let hash = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const seed = salt + data + Date.now();
    let seedNum = 0;
    for (let i = 0; i < seed.length; i++) {
      seedNum = ((seedNum << 5) - seedNum) + seed.charCodeAt(i);
    }
    for (let i = 0; i < 86; i++) {
      hash += chars[Math.abs((seedNum * (i + 1)) % chars.length)];
    }
    return hash;
  };
  
  // Handle signature request
  const handleSign = async () => {
    if (!evmAddress) return;
    
    const message = `XNMk Genesis Ritual\n\nI commit to the Xenial Quantum Economy.\n\nAddress: ${evmAddress}\nTerm: ${termDays} days\nTimestamp: ${new Date().toISOString()}\n\nThis signature authorizes the compositional mint of XNMk tokens mirroring my XNM balance.`;
    
    try {
      // In production: const sig = await window.ethereum.request({ method: 'personal_sign', params: [message, evmAddress] });
      // Simulated signature for demo
      const simSig = '0x' + Array(130).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      setSignature(simSig);
      
      const addrSalt = generateSalt(evmAddress);
      setSalt(addrSalt);
      
      const hash = generateArgon2Hash(addrSalt, `${evmAddress}:${termDays}:${xnmBalance}`);
      setCommitmentHash(hash);
      
      setStep(3);
    } catch (err) {
      console.error('Signature failed:', err);
    }
  };
  
  // Handle mint
  const handleMint = async () => {
    setIsMinting(true);
    
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setMintComplete(true);
    setIsMinting(false);
    setStep(4);
    
    onMint?.({
      evmAddress,
      xnmBalance,
      xnmkMinted: xnmBalance,
      signature,
      commitmentHash,
      salt,
      termDays,
    });
  };
  
  useEffect(() => {
    if (evmAddress && step === 1) {
      setStep(2);
    }
  }, [evmAddress]);
  
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(20, 25, 40, 0.95) 0%, rgba(15, 18, 28, 0.98) 100%)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(255, 180, 80, 0.15)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '28px',
          fontWeight: 300,
          color: '#FFD090',
          marginBottom: '8px',
          letterSpacing: '0.05em',
        }}>
          Genesis Ritual
        </h3>
        <p style={{
          fontFamily: '"IBM Plex Sans", sans-serif',
          fontSize: '14px',
          color: 'rgba(180, 190, 210, 0.7)',
          lineHeight: 1.6,
        }}>
          Sign with your EIP-55 address to mirror your XNM as XNMk on X1.
        </p>
      </div>
      
      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
      }}>
        {['Connect', 'Sign', 'Verify', 'Mint'].map((label, i) => (
          <div key={i} style={{
            flex: 1,
            padding: '12px',
            background: step > i + 1 
              ? 'linear-gradient(135deg, rgba(80, 180, 100, 0.2), rgba(60, 140, 80, 0.1))'
              : step === i + 1 
                ? 'linear-gradient(135deg, rgba(255, 180, 80, 0.2), rgba(255, 140, 60, 0.1))'
                : 'rgba(30, 40, 60, 0.3)',
            borderRadius: '8px',
            border: `1px solid ${
              step > i + 1 ? 'rgba(80, 180, 100, 0.3)' : 
              step === i + 1 ? 'rgba(255, 180, 80, 0.3)' : 
              'rgba(100, 120, 140, 0.2)'
            }`,
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: step >= i + 1 ? (step > i + 1 ? '#90D090' : '#FFB347') : 'rgba(150, 160, 180, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              {step > i + 1 ? '✓' : i + 1}. {label}
            </div>
          </div>
        ))}
      </div>
      
      {/* Step 1: Connect Wallet */}
      {step === 1 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'rgba(255, 180, 80, 0.1)',
            border: '2px solid rgba(255, 180, 80, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
          }}>
            🔗
          </div>
          <p style={{
            fontFamily: '"IBM Plex Sans", sans-serif',
            fontSize: '16px',
            color: 'rgba(180, 190, 210, 0.8)',
            marginBottom: '24px',
          }}>
            Connect your EVM wallet to begin the Genesis Ritual
          </p>
          <p style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px',
            color: 'rgba(150, 160, 180, 0.5)',
          }}>
            Your EIP-55 address will become the SALT in your commitment hash
          </p>
        </div>
      )}
      
      {/* Step 2: Sign Message */}
      {step === 2 && (
        <div>
          {/* Address Display */}
          <div style={{
            background: 'rgba(30, 40, 60, 0.4)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(100, 120, 140, 0.2)',
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: 'rgba(150, 160, 180, 0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
            }}>
              EIP-55 Checksummed Address (SALT Source)
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '14px',
              color: '#FFB347',
              wordBreak: 'break-all',
            }}>
              {evmAddress}
            </div>
          </div>
          
          {/* XNM Balance Display */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 196, 255, 0.1), rgba(100, 140, 200, 0.05))',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(139, 196, 255, 0.2)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: 'rgba(150, 160, 180, 0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
            }}>
              XNM Balance to Mirror
            </div>
            <div style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '48px',
              fontWeight: 300,
              color: '#8BC4FF',
            }}>
              {xnmBalance?.toLocaleString() || '0'}
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              color: 'rgba(150, 160, 180, 0.5)',
              marginTop: '4px',
            }}>
              XNM → XNMk on X1
            </div>
          </div>
          
          {/* Term Commitment */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: 'rgba(150, 160, 180, 0.8)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Term Commitment (days)
            </label>
            <input
              type="range"
              min="1"
              max="365"
              value={termDays}
              onChange={(e) => setTermDays(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(60, 70, 90, 0.5)',
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
            }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: 'rgba(150, 160, 180, 0.6)' }}>1</span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '18px', color: '#FFB347', fontWeight: 600 }}>{termDays}</span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: 'rgba(150, 160, 180, 0.6)' }}>365</span>
            </div>
          </div>
          
          {/* Sign Button */}
          <button
            onClick={handleSign}
            style={{
              width: '100%',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #FFB347, #FF8C00)',
              border: 'none',
              borderRadius: '8px',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '18px',
              fontWeight: 600,
              color: '#1a1a2e',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              boxShadow: '0 4px 20px rgba(255, 140, 0, 0.3)',
            }}
          >
            ✍ Sign Commitment
          </button>
          
          <p style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            color: 'rgba(150, 160, 180, 0.5)',
            textAlign: 'center',
            marginTop: '16px',
          }}>
            Signing proves ownership and generates your Argon2id commitment hash
          </p>
        </div>
      )}
      
      {/* Step 3: Verify & Prepare Mint */}
      {step === 3 && (
        <div>
          {/* Signature Confirmation */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(80, 180, 100, 0.1), rgba(60, 140, 80, 0.05))',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(80, 180, 100, 0.2)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <span style={{ color: '#90D090', fontSize: '20px' }}>✓</span>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                color: '#90D090',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                Signature Verified
              </span>
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: 'rgba(150, 160, 180, 0.6)',
              wordBreak: 'break-all',
            }}>
              {signature?.slice(0, 42)}...{signature?.slice(-20)}
            </div>
          </div>
          
          {/* Argon2 Hash Display */}
          <div style={{ marginBottom: '24px' }}>
            <Argon2HashDisplay 
              address={evmAddress}
              salt={salt}
              hash={commitmentHash}
            />
          </div>
          
          {/* Mint Summary */}
          <div style={{
            background: 'rgba(30, 40, 60, 0.4)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(180, 140, 255, 0.2)',
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: 'rgba(150, 160, 180, 0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
            }}>
              Compositional Mint Summary
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: 'rgba(150, 160, 180, 0.5)' }}>SOURCE (EVM)</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '20px', color: '#8BC4FF', marginTop: '4px' }}>{xnmBalance} XNM</div>
              </div>
              <div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: 'rgba(150, 160, 180, 0.5)' }}>TARGET (X1)</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '20px', color: '#FFB347', marginTop: '4px' }}>{xnmBalance} XNMk</div>
              </div>
              <div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: 'rgba(150, 160, 180, 0.5)' }}>TERM</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '20px', color: '#C4A4FF', marginTop: '4px' }}>{termDays} days</div>
              </div>
              <div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: 'rgba(150, 160, 180, 0.5)' }}>COHERENCE</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '20px', color: '#90D090', marginTop: '4px' }}>τκ 1.00</div>
              </div>
            </div>
          </div>
          
          {/* Mint Button */}
          <button
            onClick={handleMint}
            disabled={isMinting}
            style={{
              width: '100%',
              padding: '16px 32px',
              background: isMinting 
                ? 'linear-gradient(135deg, #4A5568, #2D3748)'
                : 'linear-gradient(135deg, #C4A4FF, #9B7FD9)',
              border: 'none',
              borderRadius: '8px',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '18px',
              fontWeight: 600,
              color: isMinting ? 'rgba(180, 190, 210, 0.6)' : '#1a1a2e',
              cursor: isMinting ? 'wait' : 'pointer',
              letterSpacing: '0.1em',
              boxShadow: isMinting ? 'none' : '0 4px 20px rgba(180, 140, 255, 0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            {isMinting ? '◌ Minting on X1...' : '◉ Mint XNMk on X1'}
          </button>
        </div>
      )}
      
      {/* Step 4: Complete */}
      {step === 4 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 180, 80, 0.2), rgba(255, 140, 60, 0.1))',
            border: '2px solid rgba(255, 180, 80, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
          }}>
            ✦
          </div>
          
          <h4 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '32px',
            fontWeight: 300,
            color: '#FFD090',
            marginBottom: '16px',
          }}>
            Genesis Complete
          </h4>
          
          <p style={{
            fontFamily: '"IBM Plex Sans", sans-serif',
            fontSize: '16px',
            color: 'rgba(180, 190, 210, 0.8)',
            marginBottom: '32px',
          }}>
            Your XNMk tokens have been compositionally minted on X1.
          </p>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 180, 80, 0.15), rgba(255, 140, 60, 0.1))',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 180, 80, 0.3)',
            marginBottom: '24px',
          }}>
            <div style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '48px',
              fontWeight: 300,
              color: '#FFB347',
            }}>
              {xnmBalance?.toLocaleString()} XNMk
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              color: 'rgba(150, 160, 180, 0.6)',
              marginTop: '8px',
            }}>
              Mirrored from {xnmBalance?.toLocaleString()} XNM · Term: {termDays} days
            </div>
          </div>
          
          <Argon2HashDisplay 
            address={evmAddress}
            salt={salt}
            hash={commitmentHash}
          />
          
          <p style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '18px',
            fontStyle: 'italic',
            color: 'rgba(255, 200, 140, 0.6)',
            marginTop: '32px',
          }}>
            The minor third resonates. The kernel unfolds.
          </p>
        </div>
      )}
    </div>
  );
};

// EVM Wallet Connection Component
const EVMWalletConnect = ({ onConnect, address, xnmBalance }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const checksumAddress = toChecksumAddress(accounts[0]);
        
        // In production: fetch actual XNM balance from XenBlocks API
        // Simulated balance for demo
        const balance = Math.floor(Math.random() * 10000) + 100;
        
        onConnect(checksumAddress, balance);
      } else {
        // Demo mode - simulate connection
        const demoAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        const checksumAddress = toChecksumAddress(demoAddress);
        const balance = Math.floor(Math.random() * 10000) + 100;
        onConnect(checksumAddress, balance);
      }
    } catch (err) {
      console.error('Connection failed:', err);
    }
    
    setIsConnecting(false);
  };
  
  if (address) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '8px 16px',
        background: 'linear-gradient(135deg, rgba(80, 180, 100, 0.1), rgba(60, 140, 80, 0.05))',
        borderRadius: '8px',
        border: '1px solid rgba(80, 180, 100, 0.2)',
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px',
            color: '#90D090',
          }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            color: 'rgba(150, 160, 180, 0.6)',
          }}>
            {xnmBalance?.toLocaleString()} XNM
          </div>
        </div>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#90D090',
          boxShadow: '0 0 8px rgba(80, 180, 100, 0.5)',
        }} />
      </div>
    );
  }
  
  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      style={{
        padding: '10px 20px',
        background: 'rgba(30, 40, 60, 0.6)',
        border: '1px solid rgba(100, 120, 140, 0.3)',
        borderRadius: '8px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '13px',
        color: 'rgba(180, 190, 210, 0.8)',
        cursor: isConnecting ? 'wait' : 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {isConnecting ? '◌ Connecting...' : '○ Connect EVM Wallet'}
    </button>
  );
};

// X1 Wallet Connection (Solana)
const X1WalletConnect = ({ connected, onConnect }) => {
  return (
    <button
      onClick={onConnect}
      style={{
        padding: '10px 20px',
        background: connected 
          ? 'linear-gradient(135deg, rgba(139, 196, 255, 0.2), rgba(100, 140, 200, 0.1))'
          : 'rgba(30, 40, 60, 0.6)',
        border: `1px solid ${connected ? 'rgba(139, 196, 255, 0.3)' : 'rgba(100, 120, 140, 0.3)'}`,
        borderRadius: '8px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '13px',
        color: connected ? '#8BC4FF' : 'rgba(180, 190, 210, 0.8)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {connected ? '◉ X1 Connected' : '○ Connect X1 Wallet'}
    </button>
  );
};

// Navigation
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = ['Genesis', 'daThiccNOW', 'Compositions'];
  
  return (
    <nav style={{
      display: 'flex',
      gap: '4px',
      padding: '6px',
      background: 'rgba(20, 25, 40, 0.8)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 180, 80, 0.1)',
    }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            padding: '10px 20px',
            background: activeTab === tab 
              ? 'linear-gradient(135deg, rgba(255, 180, 80, 0.2), rgba(255, 140, 60, 0.1))'
              : 'transparent',
            border: 'none',
            borderRadius: '8px',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '15px',
            color: activeTab === tab ? '#FFD090' : 'rgba(180, 190, 210, 0.6)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.03em',
          }}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

// Main App
export default function XNMkGenesisApp() {
  const [activeTab, setActiveTab] = useState('Genesis');
  const [evmAddress, setEvmAddress] = useState(null);
  const [xnmBalance, setXnmBalance] = useState(null);
  const [x1Connected, setX1Connected] = useState(false);
  const [coherence, setCoherence] = useState(0.42);
  const [mintedTokens, setMintedTokens] = useState([]);
  
  // Animate coherence
  useEffect(() => {
    const interval = setInterval(() => {
      setCoherence(prev => {
        const delta = (Math.random() - 0.48) * 0.02;
        return Math.max(0, Math.min(1, prev + delta));
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  const handleEVMConnect = (address, balance) => {
    setEvmAddress(address);
    setXnmBalance(balance);
  };
  
  const handleMint = (mintData) => {
    setMintedTokens(prev => [...prev, mintData]);
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0c14 0%, #12151f 50%, #0d1018 100%)',
      color: '#E0E8F0',
      fontFamily: '"IBM Plex Sans", -apple-system, sans-serif',
    }}>
      {/* Background texture */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          radial-gradient(ellipse at 20% 20%, rgba(255, 180, 80, 0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(100, 140, 200, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(180, 140, 255, 0.02) 0%, transparent 70%)
        `,
        pointerEvents: 'none',
      }} />
      
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(20px)',
        background: 'rgba(10, 12, 20, 0.85)',
        borderBottom: '1px solid rgba(255, 180, 80, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '28px',
            fontWeight: 300,
            color: '#FFD090',
            letterSpacing: '0.15em',
            margin: 0,
          }}>
            XNMk
          </h1>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            color: 'rgba(150, 160, 180, 0.5)',
            padding: '4px 8px',
            background: 'rgba(40, 50, 70, 0.4)',
            borderRadius: '4px',
          }}>
            GENESIS
          </span>
        </div>
        
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <EVMWalletConnect 
            onConnect={handleEVMConnect}
            address={evmAddress}
            xnmBalance={xnmBalance}
          />
          <X1WalletConnect 
            connected={x1Connected}
            onConnect={() => setX1Connected(!x1Connected)}
          />
        </div>
      </header>
      
      {/* Main Content */}
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '48px 32px',
        position: 'relative',
      }}>
        
        {activeTab === 'Genesis' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '42px',
                fontWeight: 300,
                color: '#E0E8F0',
                marginBottom: '16px',
              }}>
                XNM → <span style={{ color: '#FFB347' }}>XNMk</span>
              </h2>
              <p style={{
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontSize: '16px',
                color: 'rgba(180, 190, 210, 0.7)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.7,
              }}>
                Sign with your EIP-55 address to compositionally mint XNMk on X1, 
                mirroring your XNM holdings from XenBlocks.
              </p>
            </div>
            
            <GenesisRitual 
              evmAddress={evmAddress}
              xnmBalance={xnmBalance}
              onMint={handleMint}
            />
            
            {/* Process Explanation */}
            <div style={{
              marginTop: '48px',
              padding: '24px',
              background: 'rgba(20, 25, 40, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(100, 120, 140, 0.2)',
            }}>
              <h4 style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '18px',
                color: 'rgba(180, 190, 210, 0.8)',
                marginBottom: '16px',
              }}>
                How It Works
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                {[
                  { step: '1', title: 'Connect', desc: 'Link your EVM wallet containing XNM' },
                  { step: '2', title: 'Sign', desc: 'EIP-55 address becomes SALT in Argon2id hash' },
                  { step: '3', title: 'Verify', desc: 'XNM balance disclosed from XenBlocks ledger' },
                  { step: '4', title: 'Mint', desc: 'XNMk minted on X1 mirroring your XNM' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '12px',
                    background: 'rgba(30, 40, 60, 0.3)',
                    borderRadius: '8px',
                  }}>
                    <div style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '10px',
                      color: '#FFB347',
                      marginBottom: '4px',
                    }}>
                      STEP {item.step}
                    </div>
                    <div style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '16px',
                      color: '#E0E8F0',
                      marginBottom: '4px',
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      fontSize: '12px',
                      color: 'rgba(150, 160, 180, 0.6)',
                    }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'daThiccNOW' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              padding: '40px',
              background: 'radial-gradient(circle at center, rgba(30, 35, 50, 0.6) 0%, transparent 70%)',
              borderRadius: '50%',
              marginBottom: '32px',
            }}>
              <TauBitOrb coherence={coherence} size={300} />
            </div>
            
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              color: 'rgba(150, 160, 180, 0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '8px',
            }}>
              System Coherence
            </div>
            <div style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '56px',
              fontWeight: 300,
              color: coherence > 0.7 ? '#FFB347' : coherence > 0.4 ? '#8BC4FF' : '#8B9DC3',
              letterSpacing: '0.05em',
            }}>
              τκ {coherence.toFixed(3)}
            </div>
          </div>
        )}
        
        {activeTab === 'Compositions' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '36px',
              fontWeight: 300,
              color: '#C4A4FF',
              marginBottom: '16px',
            }}>
              Coming Soon
            </h2>
            <p style={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: '16px',
              color: 'rgba(180, 190, 210, 0.7)',
            }}>
              Intelligent Compositions (.ic) will be available after Genesis.
            </p>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer style={{
        padding: '32px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 180, 80, 0.1)',
        marginTop: '64px',
      }}>
        <div style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '18px',
          color: 'rgba(255, 200, 140, 0.6)',
          fontStyle: 'italic',
        }}>
          The minor third resonates. The kernel unfolds. The composition begins.
        </div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '12px',
          color: 'rgba(150, 160, 180, 0.4)',
          marginTop: '12px',
        }}>
          xen.fun · XenBlocks · X1 Testnet
        </div>
      </footer>
    </div>
  );
}
