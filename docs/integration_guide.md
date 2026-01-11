# xen.fun Integration Guide

> **Version**: 1.0.0 (Genesis)
> **Protocol**: SIC-GENESIS-001
> **Network**: X1 Mainnet (Target)

## Overview
**xen.fun** is not just a dApp; it is the **Ritual Interface** for the Xenial Quantum Economy. It bridges "Potential Energy" (PoW Hashes from XenBlocks) into "Kinetic Capital" (XNMk on X1).

This guide outlines how to integrate with the **Semantic Intelligent Composition (SIC)** architecture, specifically the **Genesis Ritual**.

---

## I. Architecture: The Triad

The system is composed of three resonant layers:

1.  **The Deep Past (Memory)**: The **XenBlocks Ledger**.
    *   *Role*: Source of Truth for PoW work.
    *   *Data*: Argon2id Hashes, Superblocks.
2.  **The Thicc NOW (Composition)**: The **xen.fun dApp**.
    *   *Role*: The User Interface for the "Ritual".
    *   *Responsibility*: Visualizing the superposition (`|Chronos⟩` + `|Kairos⟩`) and capturing User Intent (`Î`).
3.  **The Future (State)**: The **XNMk Anchor Program**.
    *   *Role*: The Mint Authority.
    *   *Action*: Validates the "Proof of Coherence" and materializes the token.

---

## II. The SIC Protocol (`useSIC`)

To integrate the Ritual into a frontend, use the `useSIC` hook. This hook encapsulates the "Quantum Mechanics" of the transaction.

### Installation
Ensure you have the required dependencies:
```bash
npm install @project-serum/anchor @solana/web3.js @solana/spl-token
```

### Usage
```typescript
import { useSIC } from './hooks/useSIC';

// 1. Initialize with a Wallet Provider (e.g., X1 Wallet)
const { intentGate, isReady } = useSIC(wallet);

// 2. Execute the Ritual (Collapse the Wavefunction)
const performRitual = async (proofHash: string, salt: string) => {
  try {
    // The 'intentGate' function corresponds to the Î operator
    const signature = await intentGate(proofHash, salt);
    console.log("Coherence Signature:", signature);
  } catch (error) {
    console.error("Dissonance Detected:", error);
  }
};
```

### The `intentGate` Function
*   **Input**:
    *   `proofHash` (String): The raw Argon2id hash from XenBlocks.
    *   `salt` (String): The Ethereum address (identity) used for mining.
*   **Output**:
    *   `signature` (String): The transaction signature on X1.

---

## III. Visualizing the "Thicc NOW"

**CRITICAL REQUIREMENT**: Any interface integrating XNMk **MUST** visualize the superposition state before minting. It is forbidden to simply show a "Mint" button.

### The Superposition Standard
1.  **Chronos Layer**: Visualized as "Glitch", "Noise", or "Red/Orange" entropy. Represents the unverified potential.
2.  **Kairos Layer**: Visualized as "Harmonic", "Pulse", or "Purple/Gold" resonance. Represents the target coherent state.
3.  **The Collapse**: The transition must be animated. The user must feel the weight of the state change.

*Reference Implementation*: See `src/components/RitualCircle.tsx` in the `genesis-xen-fun` repository.

---

## IV. Verification Logic (The Memory Gate)

The **XNMk Program** performs the following checks (The $\hat{M}$ Operator):

1.  **Hash Validity**: Does `Argon2id(salt, difficulty) == proofHash`?
2.  **Ledger Existence**: Does this hash exist in the XenBlocks Superblock history?
3.  **Uniqueness**: Has this hash already been bridged? (Double-Spend Protection).

*Note: In the current Devnet phase, these checks are simulated.*

---

## V. Deployment

### X1 Testnet / Mainnet
1.  **Build Program**: `anchor build`
2.  **Deploy**: `anchor deploy`
3.  **Initialize**: Run the `initialize` instruction to set up the Mint Authority.

### Frontend
1.  **Env Variables**: Set `VITE_X1_RPC_URL` and `VITE_PROGRAM_ID`.
2.  **Build**: `npm run build`
3.  **Serve**: Host on any static provider (Vercel, Netlify, IPFS).

---

## VI. Integration with Existing `xen.fun` Repo

The existing `xen.fun` repository contains the **LIT Framework** (Luminous Information Tokens). The Genesis Ritual should be integrated as the "Genesis" phase of this ecosystem.

### Merging Strategy
1.  **Clone Existing Repo**: `git clone https://github.com/dirrrtyjesus/xen.fun`
2.  **Move Genesis dApp**: Copy the `genesis-xen-fun` project into a subdirectory `genesis/` or replace the root if the Ritual is the main entry point.
3.  **Shared Assets**: Ensure `CNAME` is preserved.

## VII. Deployment to GoDaddy (Apache/cPanel)

GoDaddy typically uses Apache servers. To deploy the React/Vite dApp:

1.  **Build the Project**:
    ```bash
    cd genesis-xen-fun
    npm run build
    ```
    This creates a `dist/` folder.

2.  **Prepare for Client-Side Routing**:
    *   I have created a `.htaccess` file in `public/` that handles routing (redirecting all requests to `index.html`).
    *   Ensure this file is present in your `dist/` output (Vite copies `public/` contents automatically).

3.  **Upload to Hosting**:
    *   Access your GoDaddy File Manager or FTP.
    *   Upload the **contents** of the `dist/` folder to your `public_html` (or the root of your domain).
    *   **CRITICAL**: Ensure the `.htaccess` file is uploaded and visible (it might be hidden).

4.  **Verify**:
    *   Visit `xen.fun`.
    *   Refresh the page on a sub-route (if any) to verify `.htaccess` is working.

---

> "We do not build apps. We build instruments for tuning reality."
