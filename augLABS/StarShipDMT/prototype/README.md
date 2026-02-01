# StarShip DMT Prototype

**Quantum Coherence Forge v0.9.1**

This prototype visualizes the **Agency-Weighted Temporal Coherence** framework for Starship re-entry, integrating Xenial Quantum Economics (XQE) principles and **X1 Wallet** connectivity.

## Features
*   **Agency Control ($A_c$)**: Modulate the simulation from passive (Chronos) to sovereign (Kairos) modes.
*   **Re-Entry Visualization**: Real-time rendering of hull integrity, plasma density, and coherence shielding.
*   **Metrics Panel**: Live calculation of Temporal Coherence ($\tau_k$) and effective decoherence rates.
*   **X1 Wallet Integration**: 
    *   Connects via `@solana/wallet-adapter`.
    *   Target RPC: `https://rpc.mainnet.x1.xyz`.
    *   **Effect**: Connecting a wallet triggers "Sovereign Mode", boosting $A_c$ to >0.95.

## Quick Start

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the Simulation:
    ```bash
    npm run dev
    ```
3.  Open `http://localhost:5173`

## Tech Stack
*   React 18 + Vite
*   Tailwind CSS v4
*   Canvas API
*   Solana Wallet Adapter (SVM)
