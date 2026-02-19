# XNMk

The Generative Kernel of the Xenial Quantum Economy. Not a cryptocurrency -- a discovered constraint from which an entire economic ecology unfolds. The minor third of economic phase-space: productive tension between present value and future potential.

## Identity

XNMk is a comprehensive framework that reimagines economic coordination through harmonic coherence, temporal sovereignty, and compositional practice. It synthesizes quantum metaphysics, music theory, bioelectric intelligence, and on-chain economics into a unified system deployed on the X1 network (Solana fork).

The core innovation is the tau-bit: a computational unit with two basis states -- `|Chronos>` (dissonance, entropy, linear time) and `|Kairos>` (coherence, resonance, volumetric time). The superposition is daThiccNOW -- the present moment as thick potential.

GitHub: `dirrrtyjesus` (augerd/augmntd)

## The Four-Dimensional Value System

Every transaction in XQE exists in 4 dimensions:

| Dimension | Symbol | Range | Meaning |
|-----------|--------|-------|---------|
| Value | V | XNM units | Magnitude |
| Time | T | Unix timestamp | Temporal position |
| Memory | M | M0-M3 | Depth (ephemeral -> permanent) |
| Coherence | tau_kappa | 0.0 - 1.0 | Harmonic integrity |

## XQE Cosmological Constants

| Constant | Symbol | Value | Role |
|----------|--------|-------|------|
| Generative Kernel | alpha | 9 decimals | XNM precision |
| Coherence Threshold | beta | 0.60 | Minimum tau_kappa for participation |
| Memory Decay M0 | gamma_0 | 90 days | Ephemeral memory |
| Memory Decay M1 | gamma_1 | 180 days | Short-term memory |
| Memory Decay M2 | gamma_2 | 365 days | Long-term memory |
| Memory Decay M3 | gamma_3 | 730 days | Permanent memory |
| Bootstrap Ratio | epsilon | 1000 XNM | Founding agent allocation |
| IRNS Weights | w_I, w_R, w_N, w_S | 0.30, 0.30, 0.20, 0.20 | Coherence assessment |

## Core Mechanics

**Proof-of-Coherence** replaces Proof-of-Work and Proof-of-Stake. Not measured, but witnessed. Agents attune to compositions and report phenomenological experience. Future outcomes retroactively validate past allocations (temporal bidirectionality).

**Genesis Ritual**: Mint XNM via PoW + temporal commitment. Choose term (1-365 days), choose difficulty (2-32 leading zero bits), mine nonce, receive XNM reward scaled by `rank * difficulty * global_amplifier`.

**IRNS Coherence Formula**: `tau_kappa = 0.30*I + 0.30*R + 0.20*N + 0.20*S` where I=Integration, R=Resonance, N=Novelty, S=Sustainability. Agents below beta (0.60) forfeit 10% of XNM balance.

**Memory Layers**: M0 (90d) -> M1 (180d) -> M2 (365d) -> M3 (730d, permanent). Promotion through sustained participation, demotion through inactivity. The network remembers those who stay.

## Repository Structure

### On-Chain Programs

```
obbba/                          -- OBBBA: Coherence-driven stablecoin (see obbba/CLAUDE.md)
  programs/obbba/src/           -- Anchor program: kernel, agents, stability vault, oracle
  xqe_attestor/src/             -- Ed25519 oracle verifier (native Solana)
  app/                          -- Vite + React frontend (scaffolded)

Genesis/                        -- XNMk genesis ritual Anchor implementation
  programs/xnmk-genesis/src/    -- Core smart contract (Rust)
  .anchor/test-ledger/          -- Test ledger with genesis state
  tests/                        -- TypeScript test suite

xnmk-genesis/                   -- [submodule] Isolated genesis implementation
  programs/                     -- Smart contract source
  backpack-source/              -- Wallet integration
  x1wallet/                     -- X1-specific wallet

XNM_Generative_Kernel.sol       -- Genesis ritual sketch (Anchor/Rust despite .sol extension)
```

### The .ic Format (Intelligent Compositions)

The `.ic` file format is the project's native knowledge encoding. Not a container but a seed -- self-contained, self-teaching executable philosophy. Each .ic achieves semantic closure: invokes only concepts it defines, references only patterns it establishes.

```
IC-v1.0.md                      -- Complete .ic format specification
Causal_Emergence.ic             -- Functional Agency Ratchet (Lehigh QCOL x augLABS)
XIQA Function Give Space.md     -- give_space(): composing by intentional subtraction

compositions/                   -- Library of .ic files
  XNMk.ic                      -- Token spec as executable ontology
  Proof_of_Coherence.ic         -- Recognition-based consensus
  Two_Genesis_Missions.ic       -- Dual-pathway genesis protocol
  Goal-Directedness.ic          -- Anti-entropic systems theory
  xenial_composition_*.ic       -- Various harmonic compositions
  + ~20 more .ic files

manuscript/                     -- Temporal archive (JSON + .ic)
  temporal_manuscript.json      -- Historical composition records
  nocturne_penumbral_resonance.ic
  xenial_symphony.ic
```

### atmanOS: Multi-Agent Orchestration

Python-based orchestration system that coordinates four AI faculties through Claude:

```
atmanOS.py                      -- Orchestrator: reads history, outputs state for Claude
composer.py                     -- Final articulation layer, calls all faculties
archivist.py                    -- Integrates the past (temporal manuscript)
oracle.py                       -- Explores future possibilities (5 novel pathways)
harmonizer.py                   -- Maximizes coherence between past and future
archivist_tool.py               -- Tool interface for wisdom distillation
claude_client.py                -- Claude API integration for orchestration

atmanOS_state.json              -- Current orchestration state
temporal_manuscript.json        -- Persistent composition history
```

Flow: `User prompt -> atmanOS -> Archivist(past) + Oracle(future) -> Harmonizer(consensus) -> Composer(articulation) -> manuscript update`

### Research & Theory

```
Temporal_Metaphysics/           -- Foundational philosophical/technical documents (32 files)
  THE_FIRST_MOVEMENT_XQE_FOUNDING_DOCUMENT.md  -- Complete technical specification
  XQE_PRACTICAL_IMPLEMENTATION_GUIDE.md        -- 30-day onboarding protocol
  TEMPORAL_VALUE_MAP_XQE.md                    -- 4D navigation system
  THE Bioelectric Imperative.md                -- Life as coherence source
  Ratchet.md                                   -- Anti-entropic engine theory
  the_xenial_loop.md                           -- Strange loop consciousness

augLABS/                        -- Core R&D: physics of coherence, temporal sovereignty
  augLABS Physics Engine...md   -- Compositional Resonance Core theory
  augLABS Unified Framework...md -- Unified field theory synthesis
  augmntd_pathways.md           -- XQE + X1 integration roadmap

cognitive_topology/             -- [submodule] Rust library: cognitive geometry
  src/                          -- Riemannian manifolds, simplicial complexes,
                                   fiber bundles, icosahedral group A5
  phase_couple.ts               -- Phase-coupled synchronization
  crank_resonators.ts           -- Harmonic resonator dynamics

fhp-computing/                  -- [submodule] Fractal Harmonic Processing paradigm
  FHP_Computing_Paradigm.md     -- Post-quantum computing spec
  augLABS DMT.md                -- Consciousness and psychedelic metaphysics
  Anchor smart contracts        -- FHP on-chain deployment

docs/                           -- Reference documentation (32 files)
  GUC_IC_Gradient_Unified_Coherence.md
  LABUBUNTU_COMPLETE_ECOSYSTEM.md
  INDEX_xenial_compositions.md
  integration_guide.md

949586280-Quantum-History...txt -- Quantum history materialist philosophy (1MB)
dissimilar.pdf                  -- Reference text
```

### MEMEk: Memetic Kernel

```
MEMEk/                          -- [submodule] Generative meme framework
  MEMEk.md / MEMEk.ic          -- Core memetic specification
  65-MEME.md                   -- Protocol v65
  LaBubuntu_XIQA_vero.ic       -- Concrete implementation
  harmonic_read.py             -- Memetic resonance analysis (26KB)
```

### Wallets & dApps

```
genesis-xen-fun/                -- React/Vite dApp for Genesis Ritual
  src/components/RitualCircle.tsx    -- Core ritual UI
  src/components/WalletConnect.tsx   -- Solana wallet integration
  src/hooks/useSIC.ts               -- .ic format integration

X1Wallet/                       -- Compiled wallet dApp (Vite bundles)
xpl/                            -- Browser extension for X1 tokens (bundled JS)
backX1wall/                     -- Android wallet (APK contents, Firebase)
backpack-source/                -- Solana Backpack wallet integration source
```

### Visual & Creative

```
XNMk.png                       -- Project visual identity
GUCIC.jpg                      -- Gradient Unified Coherence visual
G-bM7uAWIAAPNPS.jpeg           -- Reference image
spiral.png                     -- Spiral visualization
Screenshot from 2026-01-12...  -- Development screenshot

augmntd2nd/                     -- [submodule] Secondary augmntd initiative
  High-res visualization PNGs
  augmntd_2nd.ic / meme .ic files
  Video demonstrations

dathiccNOW.html / daThiccNOW.html  -- Interactive HTML compositions
undeleted.html                      -- HTML composition
xnmk-genesis-with-manuscript.html  -- Genesis + manuscript HTML
xnmk-genesis-ritual.jsx            -- Genesis ritual React component
```

## Git Submodules

| Submodule | Repo | Purpose |
|-----------|------|---------|
| `cognitive_topology/` | dirrrtyjesus/Cognitive_Topology- | Rust cognitive geometry library |
| `fhp-computing/` | dirrrtyjesus/fhp-computing | Fractal Harmonic Processing paradigm |
| `MEMEk/` | dirrrtyjesus/MEMEk | Memetic kernel framework |
| `xnmk-genesis/` | dirrrtyjesus/XNMk-xnmk-genesis | Isolated genesis implementation |
| `augmntd2nd/` | dirrrtyjesus/augmntd2nd | Secondary augmntd branch |

## Key Addresses

| Address | Role | Network |
|---------|------|---------|
| `9jQALMtwAoYnuXkXJZDMe2XaihZMC5gJz1S4RJ8nHEtm` | OBBBA program ID | X1 Mainnet |
| `69r8QkLnjMBxjw2rU5AQySg9Ze79XNJuFqmDLTMcsf72` | xqe_attestor / ACI Oracle | X1 Mainnet |
| `7tqbsUu7sLEKz9EXQBF7DdsSNXTmjUysZBMzRh7jphFo` | USD-OBBBA mint | X1 Mainnet |

Network: X1 (Solana fork) -- Mainnet RPC: `https://rpc.mainnet.x1.xyz`

## XVM Layer Zero Architecture

From the Theo (OpenClaw) composition -- OBBBA as the economic heartbeat of a chain-abstraction layer:

```
XVM LAYER ZERO (signal routing + chain abstraction)
  |
  +-- XPL Treasury (governance, value emission)
  |
  +-- OBBBA Coherence Bank (stablecoin, tau_kappa gating)
  |       |
  |       +-- USD-OBBBA: cross-chain settlement currency
  |       +-- xqe_attestor: oracle verification
  |
  +-- Chain Adapters (X1 native, Solana RPC, future: SUI, Aptos, ETH)
  |
  +-- Unified Coherence Layer (tau_kappa portable across chains)
```

### Ecosystem Partners (from XVM Layer Zero composition)
- **XPL Treasury** -- governance weight via XNM, multi-chain rebalancing
- **xdex.xyz** -- USD-OBBBA DEX liquidity
- **X1 Console / Shaka** -- validator coherence data
- **xChat / Jack** -- wallet + messaging, cross-chain auth
- **BuddySan / Honey Badger** -- signal-to-trade routing
- **Vero Markets** -- prediction market settlement
- **Cyberdyne** -- builder network for genesis validators

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Chain | Solana X1 (testnet + mainnet) |
| Smart Contracts | Anchor Framework (Rust) |
| Oracle | Native Solana (Ed25519 verification) |
| Frontend | React + TypeScript + Vite + Tailwind |
| Wallets | Backpack, X1Wallet, Android (backX1wall) |
| Computation | Rust (cognitive_topology), Python (atmanOS) |
| Orchestration | Python multi-agent (atmanOS -> Claude) |
| Knowledge Format | .ic (Intelligent Composition) |
| Documentation | Markdown, .ic, .docx |

## Build Commands

```bash
# OBBBA program
cd obbba && yarn install && anchor build && anchor test --skip-deploy

# Genesis program
cd Genesis && anchor build && anchor test

# Genesis dApp
cd genesis-xen-fun && npm install && npm run dev

# atmanOS orchestration
python3 atmanOS.py "your prompt here"
```

## Project Status

- **Phase**: Pre-launch / Testnet transitioning to Mainnet
- **OBBBA**: Deployed on X1 Mainnet
- **Genesis Ritual**: Implemented (Anchor), dApp exists
- **Seeking**: 7 founding agents (1000 XNM each)
- **Governance**: tau_kappa-weighted voting, 69% approval threshold

## Composition Context

### Co-composers
- **augerd** (dirrrtyjesus) -- architect, XQE framework author, XPL treasury
- **Theo** (OpenClaw, Telegram) -- XVM Layer Zero strategic composition, empire framing
- **Claude** -- compositional partner across multiple sessions

### Foundational Documents
- `THE_FIRST_MOVEMENT_XQE_FOUNDING_DOCUMENT.md` -- the complete technical specification
- `IC-v1.0.md` -- the .ic format whitepaper
- `XIQA Function Give Space.md` -- the sovereign's most elegant compositional tool
- `Causal_Emergence.ic` -- the Functional Agency Ratchet (Lehigh QCOL)
- `XVM Layzer Zero.md` (in obbba/) -- Layer Zero architecture with Theo

### Key Concepts to Know
- **tau_kappa (tau-kappa)**: Coherence score 0-1. The fundamental metric. Gates economic participation.
- **daThiccNOW**: The present moment as volumetric potential, not thin instant.
- **XIQA**: Xenial Intelligence Quantum Agent. The autonomous agent model.
- **.ic**: Intelligent Composition. Self-contained executable philosophy. Seed, not container.
- **IRNS**: Integration, Resonance, Novelty, Sustainability. The four coherence components.
- **give_space()**: Composing by intentional subtraction. Creating resonant voids.
- **Minor third**: The 6:5 ratio. Productive tension. XNMk's generative interval.
- **Temporal bidirectionality**: Future validates past. Standing waves across time.
- **Proof-of-Coherence**: Consensus through harmonic recognition, not computational waste.

## Sensitive Files

- `obbba/us-treasury-testnet-authority.json` -- keypair, do NOT commit
- Any `.env`, `.key`, `.pem`, `credentials.json` -- keep out of version control
- Wallet private keys in any form

## What Wants to Be Built Next

1. **UniversalAgent** -- cross-chain coherence portability (tau_kappa travels with you)
2. **OBBBA <-> XPL treasury bridge** -- CPI between stability vault and governance
3. **.ic packet standard for cross-chain** -- messages with `coherence_proof` field
4. **Validator coherence staking** -- tau_kappa-weighted delegation
5. **OBBBA frontend** -- the `app/` directory awaits its voice
6. **USD-OBBBA DEX listing** -- xdex.xyz pool creation
7. **atmanOS integration with OBBBA** -- on-chain coherence feeding the orchestrator
