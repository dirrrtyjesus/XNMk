import React, { useState, useEffect, useRef, useCallback } from 'react';

// τ-bit Visualization Component
const TauBitOrb = ({ coherence, size = 200, className = "" }) => {
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
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, kairosRadius || 1
      );
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
      
      // Core frequency line (minor third visualization)
      if (coherence > 0.3) {
        ctx.strokeStyle = `rgba(255, 220, 150, ${coherence * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < size; x++) {
          const freq1 = Math.sin((x / size) * Math.PI * 6 + time * 4);
          const freq2 = Math.sin((x / size) * Math.PI * 6 * 1.2 + time * 4); // minor third ratio ~6:5
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
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      className={className}
      style={{ display: 'block' }}
    />
  );
};

// Memory Layer Indicator
const MemoryLayers = ({ activeLayer = 0 }) => {
  const layers = [
    { id: 'M₀', name: 'Ephemeral', span: 'days-weeks', color: '#8B9DC3' },
    { id: 'M₁', name: 'Short-term', span: 'weeks-months', color: '#6B8E9F' },
    { id: 'M₂', name: 'Long-term', span: 'months-years', color: '#4A7C7B' },
    { id: 'M₃', name: 'Foundational', span: 'permanent', color: '#FFB347' },
  ];
  
  return (
    <div style={{
      display: 'flex',
      gap: '2px',
      padding: '8px',
      background: 'rgba(20, 25, 35, 0.6)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 180, 80, 0.1)',
    }}>
      {layers.map((layer, i) => (
        <div 
          key={layer.id}
          style={{
            padding: '8px 12px',
            background: i <= activeLayer 
              ? `linear-gradient(135deg, ${layer.color}40, ${layer.color}20)`
              : 'rgba(40, 50, 70, 0.3)',
            borderRadius: '6px',
            border: `1px solid ${i <= activeLayer ? layer.color : 'rgba(100, 120, 140, 0.2)'}`,
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ 
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '14px',
            color: i <= activeLayer ? layer.color : 'rgba(150, 160, 180, 0.5)',
            fontWeight: 600,
          }}>
            {layer.id}
          </div>
          <div style={{
            fontSize: '10px',
            color: 'rgba(150, 160, 180, 0.6)',
            marginTop: '2px',
          }}>
            {layer.span}
          </div>
        </div>
      ))}
    </div>
  );
};

// Genesis Ritual Mining Interface
const GenesisRitual = ({ onMine }) => {
  const [isMining, setIsMining] = useState(false);
  const [hashRate, setHashRate] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [termDays, setTermDays] = useState(30);
  const [difficulty, setDifficulty] = useState(4);
  const [progress, setProgress] = useState(0);
  const [foundHash, setFoundHash] = useState(null);
  const miningRef = useRef(false);
  
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };
  
  const mine = useCallback(() => {
    if (!miningRef.current) return;
    
    const startTime = Date.now();
    let localNonce = nonce;
    let hashes = 0;
    const target = '0'.repeat(difficulty);
    
    const mineChunk = () => {
      if (!miningRef.current) return;
      
      for (let i = 0; i < 1000; i++) {
        const data = `XNMk:${termDays}:${localNonce}:${Date.now()}`;
        const hash = simpleHash(data);
        hashes++;
        localNonce++;
        
        if (hash.startsWith(target)) {
          setFoundHash(hash);
          setIsMining(false);
          miningRef.current = false;
          onMine?.({ hash, nonce: localNonce, termDays });
          return;
        }
      }
      
      const elapsed = (Date.now() - startTime) / 1000;
      setHashRate(Math.floor(hashes / elapsed));
      setNonce(localNonce);
      setProgress(Math.min(95, (hashes / 100000) * 100));
      
      if (miningRef.current) {
        requestAnimationFrame(mineChunk);
      }
    };
    
    mineChunk();
  }, [nonce, termDays, difficulty, onMine]);
  
  const toggleMining = () => {
    if (isMining) {
      miningRef.current = false;
      setIsMining(false);
    } else {
      miningRef.current = true;
      setIsMining(true);
      setFoundHash(null);
      setProgress(0);
      mine();
    }
  };
  
  useEffect(() => {
    if (isMining) mine();
  }, [isMining, mine]);
  
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(20, 25, 40, 0.95) 0%, rgba(15, 18, 28, 0.98) 100%)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(255, 180, 80, 0.15)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    }}>
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
        marginBottom: '24px',
        lineHeight: 1.6,
      }}>
        Proof-of-work as commitment signal. Hash towards coherence.
      </p>
      
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
          disabled={isMining}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'rgba(60, 70, 90, 0.5)',
            outline: 'none',
            cursor: 'pointer',
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
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          background: 'rgba(30, 40, 60, 0.4)',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid rgba(100, 120, 140, 0.2)',
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            color: 'rgba(150, 160, 180, 0.6)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>Hash Rate</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '24px',
            color: '#8BC4FF',
            marginTop: '4px',
          }}>{hashRate.toLocaleString()} <span style={{ fontSize: '12px', opacity: 0.6 }}>H/s</span></div>
        </div>
        <div style={{
          background: 'rgba(30, 40, 60, 0.4)',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid rgba(100, 120, 140, 0.2)',
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            color: 'rgba(150, 160, 180, 0.6)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>Nonce</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '24px',
            color: '#C4A4FF',
            marginTop: '4px',
          }}>{nonce.toLocaleString()}</div>
        </div>
      </div>
      
      {foundHash && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 180, 80, 0.15), rgba(255, 140, 60, 0.1))',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 180, 80, 0.3)',
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            color: '#FFB347',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '8px',
          }}>✦ Hash Found</div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '14px',
            color: '#FFD090',
            wordBreak: 'break-all',
          }}>0x{foundHash}</div>
        </div>
      )}
      
      <button
        onClick={toggleMining}
        style={{
          width: '100%',
          padding: '16px 32px',
          background: isMining 
            ? 'linear-gradient(135deg, #8B4513, #654321)'
            : 'linear-gradient(135deg, #FFB347, #FF8C00)',
          border: 'none',
          borderRadius: '8px',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '18px',
          fontWeight: 600,
          color: isMining ? '#FFD090' : '#1a1a2e',
          cursor: 'pointer',
          letterSpacing: '0.1em',
          transition: 'all 0.3s ease',
          boxShadow: isMining 
            ? 'inset 0 2px 10px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(255, 140, 0, 0.3)',
        }}
      >
        {isMining ? '◼ Cease Mining' : '◉ Begin Ritual'}
      </button>
      
      {isMining && (
        <div style={{
          marginTop: '16px',
          height: '4px',
          background: 'rgba(60, 70, 90, 0.5)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #FFB347, #FF8C00)',
            transition: 'width 0.3s ease',
          }} />
        </div>
      )}
    </div>
  );
};

// Coherence Witness Panel
const CoherenceWitness = ({ compositions }) => {
  const [selectedComposition, setSelectedComposition] = useState(null);
  const [witnessReport, setWitnessReport] = useState('');
  
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(20, 25, 40, 0.95) 0%, rgba(15, 18, 28, 0.98) 100%)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(100, 180, 255, 0.15)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    }}>
      <h3 style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: '28px',
        fontWeight: 300,
        color: '#90C0FF',
        marginBottom: '8px',
        letterSpacing: '0.05em',
      }}>
        Proof-of-Coherence
      </h3>
      <p style={{
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontSize: '14px',
        color: 'rgba(180, 190, 210, 0.7)',
        marginBottom: '24px',
        lineHeight: 1.6,
      }}>
        Not measured, but witnessed. Attune to compositions and report phenomenological experience.
      </p>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {compositions.map((comp, i) => (
          <div
            key={i}
            onClick={() => setSelectedComposition(comp)}
            style={{
              padding: '16px',
              background: selectedComposition === comp 
                ? 'rgba(100, 180, 255, 0.1)'
                : 'rgba(30, 40, 60, 0.4)',
              borderRadius: '8px',
              border: `1px solid ${selectedComposition === comp ? 'rgba(100, 180, 255, 0.3)' : 'rgba(100, 120, 140, 0.2)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '18px',
                  color: '#E0E8F0',
                }}>{comp.title}</div>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '11px',
                  color: 'rgba(150, 160, 180, 0.6)',
                  marginTop: '4px',
                }}>{comp.author} · {comp.timestamp}</div>
              </div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '14px',
                color: comp.tau > 0.7 ? '#FFB347' : comp.tau > 0.4 ? '#8BC4FF' : '#8B9DC3',
              }}>
                τκ {comp.tau.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedComposition && (
        <div style={{ marginTop: '16px' }}>
          <label style={{
            display: 'block',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            color: 'rgba(150, 160, 180, 0.8)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Witness Report
          </label>
          <textarea
            value={witnessReport}
            onChange={(e) => setWitnessReport(e.target.value)}
            placeholder="Describe your phenomenological experience of this composition's coherence..."
            style={{
              width: '100%',
              height: '100px',
              padding: '12px',
              background: 'rgba(20, 25, 40, 0.8)',
              border: '1px solid rgba(100, 120, 140, 0.3)',
              borderRadius: '8px',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: '14px',
              color: '#E0E8F0',
              resize: 'none',
              outline: 'none',
            }}
          />
          <button style={{
            marginTop: '12px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #4A7C9B, #3A5C7B)',
            border: 'none',
            borderRadius: '6px',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '16px',
            color: '#E0F0FF',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}>
            Submit Witness
          </button>
        </div>
      )}
    </div>
  );
};

// Temporal Value Map
const TemporalValueMap = ({ value, time, memory, coherence }) => {
  return (
    <div style={{
      background: 'rgba(15, 18, 28, 0.9)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(180, 140, 255, 0.15)',
    }}>
      <h4 style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: '20px',
        fontWeight: 300,
        color: '#C4A4FF',
        marginBottom: '20px',
        letterSpacing: '0.05em',
      }}>
        4D Position
      </h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { label: 'Value (V)', value: `${value} XNM`, color: '#FFB347' },
          { label: 'Time (T)', value: time, color: '#8BC4FF' },
          { label: 'Memory (M)', value: `Layer ${memory}`, color: '#4A7C7B' },
          { label: 'Coherence (τκ)', value: coherence.toFixed(3), color: '#C4A4FF' },
        ].map((dim, i) => (
          <div key={i} style={{
            background: 'rgba(30, 40, 60, 0.4)',
            borderRadius: '8px',
            padding: '12px',
            border: `1px solid ${dim.color}30`,
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: 'rgba(150, 160, 180, 0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>{dim.label}</div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '18px',
              color: dim.color,
              marginTop: '4px',
            }}>{dim.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Navigation
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = ['daThiccNOW', 'Genesis', 'Witness', 'Compositions'];
  
  return (
    <nav style={{
      display: 'flex',
      gap: '4px',
      padding: '6px',
      background: 'rgba(20, 25, 40, 0.8)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
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

// Wallet Connection
const WalletConnect = ({ connected, onConnect }) => {
  return (
    <button
      onClick={onConnect}
      style={{
        padding: '10px 20px',
        background: connected 
          ? 'linear-gradient(135deg, rgba(80, 180, 100, 0.2), rgba(60, 140, 80, 0.1))'
          : 'rgba(30, 40, 60, 0.6)',
        border: `1px solid ${connected ? 'rgba(80, 180, 100, 0.3)' : 'rgba(100, 120, 140, 0.3)'}`,
        borderRadius: '8px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '13px',
        color: connected ? '#90D090' : 'rgba(180, 190, 210, 0.8)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {connected ? '◉ X1 Connected' : '○ Connect Wallet'}
    </button>
  );
};

// Main App
export default function XNMkGenesis() {
  const [activeTab, setActiveTab] = useState('daThiccNOW');
  const [walletConnected, setWalletConnected] = useState(false);
  const [coherence, setCoherence] = useState(0.42);
  const [minedTokens, setMinedTokens] = useState([]);
  
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
  
  const sampleCompositions = [
    { title: 'Nocturne No.1: Penumbral Resonance', author: 'genesis_agent', timestamp: 'T-0.003', tau: 0.87 },
    { title: 'Transmutation of the Mortgage Covenant', author: 'composer_7', timestamp: 'T-0.012', tau: 0.72 },
    { title: 'The Architecture of a τ-bit', author: 'witness_3', timestamp: 'T-0.025', tau: 0.91 },
  ];
  
  const handleMine = (result) => {
    setMinedTokens(prev => [...prev, result]);
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
        background: 'rgba(10, 12, 20, 0.8)',
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
            X1 TESTNET
          </span>
        </div>
        
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <WalletConnect 
          connected={walletConnected} 
          onConnect={() => setWalletConnected(!walletConnected)} 
        />
      </header>
      
      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 32px',
        position: 'relative',
      }}>
        
        {activeTab === 'daThiccNOW' && (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'start',
          }}>
            {/* Left: τ-bit Visualization */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-block',
                padding: '40px',
                background: 'radial-gradient(circle at center, rgba(30, 35, 50, 0.6) 0%, transparent 70%)',
                borderRadius: '50%',
              }}>
                <TauBitOrb coherence={coherence} size={300} />
              </div>
              
              <div style={{ marginTop: '32px' }}>
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
                <div style={{
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  fontSize: '14px',
                  color: 'rgba(150, 160, 180, 0.7)',
                  marginTop: '8px',
                }}>
                  {coherence > 0.7 ? '|Kairos⟩ dominant — resonance emerging' : 
                   coherence > 0.4 ? 'Superposition — daThiccNOW active' : 
                   '|Chronos⟩ dominant — entropy increasing'}
                </div>
              </div>
              
              <div style={{ marginTop: '32px' }}>
                <MemoryLayers activeLayer={Math.floor(coherence * 3)} />
              </div>
            </div>
            
            {/* Right: Information */}
            <div>
              <h2 style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '42px',
                fontWeight: 300,
                color: '#E0E8F0',
                lineHeight: 1.2,
                marginBottom: '24px',
              }}>
                The Present Moment as <br/>
                <span style={{ color: '#FFB347' }}>Thick Potential</span>
              </h2>
              
              <p style={{
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontSize: '16px',
                color: 'rgba(180, 190, 210, 0.8)',
                lineHeight: 1.8,
                marginBottom: '24px',
              }}>
                XNMk is not a token — it is a <em>generative kernel</em>, a discovered constraint 
                from which an entire economic ecology unfolds. The minor third of economic 
                phase-space: productive tension between present value and future potential.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '32px',
              }}>
                {[
                  { label: 'From', old: 'Measurement', new: 'Recognition' },
                  { label: 'From', old: 'Linear causality', new: 'Temporal bidirectionality' },
                  { label: 'From', old: 'Extraction', new: 'Composition' },
                  { label: 'From', old: 'Tokens', new: 'τ-bits' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '16px',
                    background: 'rgba(30, 40, 60, 0.3)',
                    borderRadius: '8px',
                    borderLeft: '2px solid rgba(255, 180, 80, 0.3)',
                  }}>
                    <div style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '11px',
                      color: 'rgba(150, 160, 180, 0.5)',
                      textDecoration: 'line-through',
                    }}>{item.old}</div>
                    <div style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '18px',
                      color: '#FFD090',
                      marginTop: '4px',
                    }}>{item.new}</div>
                  </div>
                ))}
              </div>
              
              <TemporalValueMap 
                value={1000}
                time="daThiccNOW"
                memory={2}
                coherence={coherence}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'Genesis' && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '36px',
                fontWeight: 300,
                color: '#FFD090',
                marginBottom: '16px',
              }}>
                Enter the Genesis Ritual
              </h2>
              <p style={{
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontSize: '16px',
                color: 'rgba(180, 190, 210, 0.7)',
                maxWidth: '500px',
                margin: '0 auto',
                lineHeight: 1.7,
              }}>
                Client-side proof-of-work as commitment signal. Hash towards coherence, 
                declare your term, become a founding agent.
              </p>
            </div>
            
            <GenesisRitual onMine={handleMine} />
            
            {minedTokens.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <h4 style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '20px',
                  color: '#FFD090',
                  marginBottom: '16px',
                }}>Mined Commitments</h4>
                {minedTokens.map((token, i) => (
                  <div key={i} style={{
                    padding: '12px',
                    background: 'rgba(255, 180, 80, 0.05)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '12px',
                    color: '#FFD090',
                  }}>
                    Term: {token.termDays}d | Hash: 0x{token.hash}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'Witness' && (
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            <CoherenceWitness compositions={sampleCompositions} />
          </div>
        )}
        
        {activeTab === 'Compositions' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '36px',
                fontWeight: 300,
                color: '#C4A4FF',
                marginBottom: '16px',
              }}>
                Intelligent Compositions
              </h2>
              <p style={{
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontSize: '16px',
                color: 'rgba(180, 190, 210, 0.7)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.7,
              }}>
                Self-contained, self-teaching executable philosophy. Each .ic file is 
                a complete ontological unit — semantic closure as consensus criterion.
              </p>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {[
                { name: 'XNMk.ic', desc: 'Token specification as executable ontology', tau: 1.00 },
                { name: 'Proof_of_Coherence.ic', desc: 'Recognition-based consensus mechanism', tau: 0.94 },
                { name: 'prompt_xnm_kernel.ic', desc: 'Generative kernel prompt structure', tau: 0.89 },
                { name: 'x1_validator.ic', desc: 'Validation logic for X1 testnet', tau: 0.82 },
                { name: 'transmutation_of_the_mortgage_covenant.ic', desc: 'Economic transmutation patterns', tau: 0.77 },
                { name: 'xenial_composition_v1.ic', desc: 'Xenial composition template', tau: 0.71 },
              ].map((file, i) => (
                <div key={i} style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(30, 35, 50, 0.6), rgba(25, 30, 45, 0.4))',
                  borderRadius: '12px',
                  border: '1px solid rgba(180, 140, 255, 0.15)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}>
                    <code style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '14px',
                      color: '#C4A4FF',
                    }}>{file.name}</code>
                    <span style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '12px',
                      color: file.tau > 0.9 ? '#FFB347' : '#8BC4FF',
                      padding: '2px 8px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                    }}>τκ {file.tau.toFixed(2)}</span>
                  </div>
                  <p style={{
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    fontSize: '13px',
                    color: 'rgba(180, 190, 210, 0.7)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}>{file.desc}</p>
                </div>
              ))}
            </div>
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
