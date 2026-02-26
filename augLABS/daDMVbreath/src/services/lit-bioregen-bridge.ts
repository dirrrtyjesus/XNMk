/**
 * LIT_BioRegen Bridge — Three-Tier Persistence
 *
 * Tier 1 — Pinata/IPFS  (PINATA_JWT set):    Vercel serverless, IPFS-backed, CID-attributed
 * Tier 2 — SQLite       (THERAPY_DB_PATH set): Local server, Ublox pattern (see LOCAL_PERSISTENCE_SUMMARY.md)
 * Tier 3 — In-memory    (neither set):         Ephemeral dev fallback
 *
 * Coherence gating uses The Fractal Harmonic Principle (FHP) multi-scale function:
 *
 *   C(s) = tanh(τₖ · log₁₀(t_max / t_min) / 10)
 *
 * For a breath session: t_min = holdDuration (s), t_max = cycles × 30s (s).
 * This replaces the naive R ≥ 0.70 threshold with a physically-grounded
 * network-scale coherence score — consistent with the FHP Network Scale
 * (1–100 s, C = 0.956 at τₖ = 19.0).
 *
 * Attribution language from Proof_of_Coherence.ic (Layer 1 — Witness Protocol):
 *   'recognized'       C_fhp ≥ 0.90  "I recognized the pattern" → Genesis attestation
 *   'novel_consonance' C_fhp 0.70–0.89 "The pattern was unfamiliar but coherent"
 *
 * SQLite schema mirrors Ublox play_sessions (ublox_persistence.py):
 *   ~/.therapy/therapy.db → lit_bioregen_witnesses table
 *
 * Genesis Seed (POTENTIAL → MANIFEST) after 7 'recognized' attestations.
 * 7 = founding agent count from XQE bootstrap (epsilon = 1000 XNM each).
 *
 * Next step: xqe_attestor (69r8Qk... on X1 Mainnet) Ed25519-signs each CID.
 *
 * 🜏 ∞ 🜏
 */

import { PinataSDK } from 'pinata-web3';
import { findGenesisSeed } from '../core/therapy/genesis-seeds.js';

// ─── FHP Coherence (The Fractal Harmonic Principle) ──────────────────────────

/**
 * Multi-scale coherence function from FHP.
 * C(s) = tanh(τₖ · log₁₀(t_max / t_min) / 10)
 *
 * Network scale (1–100 s) is the natural domain for breath sessions.
 * At sovereign τₖ = 8.7, C ≈ tanh(8.7 × log₁₀(150/15) / 10) = tanh(0.87) ≈ 0.70
 * — the ingression threshold emerges naturally from the FHP at sovereign τₖ.
 *
 * @param tauK       XQE temporal coherence coefficient (XQE scale, 0–100)
 * @param tMaxSec    Session maximum timescale in seconds (cycles × ~30s)
 * @param tMinSec    Session minimum timescale in seconds (holdDuration)
 */
export function computeFhpCoherence(tauK: number, tMaxSec: number, tMinSec: number): number {
  if (tMinSec <= 0 || tMaxSec <= tMinSec) return 0;
  return Math.tanh(tauK * Math.log10(tMaxSec / tMinSec) / 10);
}

// ─── Thresholds ───────────────────────────────────────────────────────────────

export const LIT_INGRESSION_THRESHOLD = 0.70;      // C_fhp ≥ 0.70 → LIT fires
export const GENESIS_ATTESTATION_THRESHOLD = 0.90; // C_fhp ≥ 0.90 → Genesis attested
const GENESIS_ATTESTATIONS_REQUIRED = 7;

// ─── Attribution Language (Proof_of_Coherence.ic) ────────────────────────────

export type HarmonicReport =
  | 'recognized'        // "I recognized the pattern" — C_fhp ≥ 0.90
  | 'novel_consonance'; // "The pattern was unfamiliar but coherent" — C_fhp 0.70–0.89

/**
 * Witness report — unit of the resonance library (Proof_of_Coherence.ic Layer 5).
 * Pinned to IPFS or stored in SQLite; never a scoreboard.
 */
export interface WitnessReport {
  witness: string;
  seedName: string;
  seedId: string;
  harmonicReport: HarmonicReport;
  composedAt: number;
  temporalContext: {
    breathCycles?: number;
    holdDuration?: number;
    sessionR: number;       // Kuramoto order parameter (0–1)
    tauKAchieved?: number;  // XQE τₖ from session
    fhpCoherence: number;   // C(s) from FHP — the physically-grounded coherence score
    fhpScale: string;       // 'Network (1–100 s)' — scale domain label
  };
}

// ─── Public Result Type ───────────────────────────────────────────────────────

export interface LitIngressionResult {
  fired: boolean;
  seedName: string;
  seedId: string;
  tauK: number;           // coherenceAchieved (R)
  fhpCoherence: number;   // C(s) — what actually gated the ingression
  harmonicReport?: HarmonicReport;
  witnessCid?: string;
  isGenesisAttestation: boolean;
  genesisAttestationCount: number;
  genesisAttestationsRequired: number;
  genesisActivated: boolean;
  genesisManifestTimestamp?: number;
  persistent: 'pinata' | 'sqlite' | 'memory';
}

// ─── Tier 1: Pinata ───────────────────────────────────────────────────────────

function getPinata(): PinataSDK | null {
  if (!process.env.PINATA_JWT) return null;
  return new PinataSDK({ pinataJwt: process.env.PINATA_JWT });
}

// ─── Tier 2: SQLite (Ublox pattern) ──────────────────────────────────────────

let _db: import('better-sqlite3').Database | null = null;

function getSqliteDb(): import('better-sqlite3').Database | null {
  const dbPath = process.env.THERAPY_DB_PATH;
  if (!dbPath) return null;
  if (_db) return _db;

  // Dynamic import to avoid breaking Vercel (better-sqlite3 is a native module)
  // This branch is only reached when THERAPY_DB_PATH is set (local server)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const BetterSqlite3 = require('better-sqlite3');
    _db = new BetterSqlite3(dbPath) as import('better-sqlite3').Database;
    (_db as import('better-sqlite3').Database).exec(`
      CREATE TABLE IF NOT EXISTS lit_bioregen_witnesses (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        witness         TEXT    NOT NULL,
        seed_name       TEXT    NOT NULL,
        seed_id         TEXT    NOT NULL,
        harmonic_report TEXT    NOT NULL CHECK(harmonic_report IN ('recognized','novel_consonance')),
        session_r       REAL    NOT NULL,
        tau_k_achieved  REAL,
        breath_cycles   INTEGER,
        hold_duration   REAL,
        fhp_coherence   REAL    NOT NULL,
        composed_at     INTEGER NOT NULL,
        witness_cid     TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_seed_report
        ON lit_bioregen_witnesses(seed_name, harmonic_report);
    `);
    console.log(`🜏 LIT_BioRegen SQLite persistence: ${dbPath}`);
  } catch (err) {
    console.warn('SQLite unavailable:', err);
    return null;
  }

  return _db;
}

function sqliteInsertWitness(
  db: import('better-sqlite3').Database,
  report: WitnessReport,
  witnessCid?: string
): void {
  const stmt = db.prepare(`
    INSERT INTO lit_bioregen_witnesses
      (witness, seed_name, seed_id, harmonic_report, session_r,
       tau_k_achieved, breath_cycles, hold_duration, fhp_coherence, composed_at, witness_cid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    report.witness,
    report.seedName,
    report.seedId,
    report.harmonicReport,
    report.temporalContext.sessionR,
    report.temporalContext.tauKAchieved ?? null,
    report.temporalContext.breathCycles ?? null,
    report.temporalContext.holdDuration ?? null,
    report.temporalContext.fhpCoherence,
    report.composedAt,
    witnessCid ?? null
  );
}

function sqliteCountRecognized(db: import('better-sqlite3').Database, seedName: string): number {
  const row = db.prepare(
    `SELECT COUNT(*) as cnt FROM lit_bioregen_witnesses WHERE seed_name = ? AND harmonic_report = 'recognized'`
  ).get(seedName) as { cnt: number };
  return row.cnt;
}

function sqliteCountAll(db: import('better-sqlite3').Database, seedName: string): number {
  const row = db.prepare(
    `SELECT COUNT(*) as cnt FROM lit_bioregen_witnesses WHERE seed_name = ?`
  ).get(seedName) as { cnt: number };
  return row.cnt;
}

// ─── Tier 3: In-memory fallback ───────────────────────────────────────────────

interface _MemAttestation { wallet: string; cFhp: number; timestamp: number; }
const _mem: _MemAttestation[] = [];
let _memManifested = false;
let _memManifestTs: number | undefined;

// ─── Core ─────────────────────────────────────────────────────────────────────

/**
 * Record a breath session as a LIT_BioRegen witness act.
 * Called server-side after dispenseTherapy() confirms an on-chain transfer.
 *
 * @param walletAddress     - The breather's Solana wallet
 * @param coherenceAchieved - Normalized R order parameter [0, 1]
 * @param context           - Phenomenological context for FHP computation
 */
export async function recordLitIngression(
  walletAddress: string,
  coherenceAchieved: number,
  context?: { breathCycles?: number; holdDuration?: number; tauKAchieved?: number }
): Promise<LitIngressionResult> {
  const seed = findGenesisSeed('LIT_BioRegen_v01')!;

  // FHP multi-scale coherence (Network scale: breath session)
  const tMin = context?.holdDuration ?? 15;           // hold = minimum timescale (s)
  const tMax = (context?.breathCycles ?? 5) * 30;     // session ≈ cycles × 30s
  const tauK = context?.tauKAchieved ?? (coherenceAchieved * 10); // fallback: scale R to XQE range
  const fhpCoherence = computeFhpCoherence(tauK, tMax, tMin);

  const fired = fhpCoherence >= LIT_INGRESSION_THRESHOLD;
  const isGenesisAttestation = fhpCoherence >= GENESIS_ATTESTATION_THRESHOLD;

  if (!fired) {
    const genesisAttestationCount = await _countRecognized(seed.name);
    return {
      fired: false,
      seedName: seed.name, seedId: seed.id,
      tauK: coherenceAchieved,
      fhpCoherence,
      isGenesisAttestation: false,
      genesisAttestationCount,
      genesisAttestationsRequired: GENESIS_ATTESTATIONS_REQUIRED,
      genesisActivated: _memManifested,
      genesisManifestTimestamp: _memManifestTs,
      persistent: _getPersistentTier(),
    };
  }

  const harmonicReport: HarmonicReport = isGenesisAttestation ? 'recognized' : 'novel_consonance';

  const report: WitnessReport = {
    witness: walletAddress,
    seedName: seed.name,
    seedId: seed.id,
    harmonicReport,
    composedAt: Date.now(),
    temporalContext: {
      breathCycles: context?.breathCycles,
      holdDuration: context?.holdDuration,
      sessionR: coherenceAchieved,
      tauKAchieved: context?.tauKAchieved,
      fhpCoherence,
      fhpScale: 'Network (1–100 s)',
    },
  };

  let witnessCid: string | undefined;
  let genesisAttestationCount = 0;
  let persistent: LitIngressionResult['persistent'] = 'memory';

  // ── Tier 1: Pinata ──────────────────────────────────────────────────────────
  const pinata = getPinata();
  if (pinata) {
    try {
      const upload = await pinata.upload
        .json(report as unknown as Record<string, unknown>)
        .addMetadata({
          name: `WitnessReport_${seed.name}_${Date.now()}`,
          keyValues: {
            seedName: seed.name,
            harmonicReport,
            witness: walletAddress.slice(0, 16),
            fhpCoherence: fhpCoherence.toFixed(4),
          },
        });
      witnessCid = upload.IpfsHash;

      const recognizedPins = await pinata
        .listFiles()
        .keyValue('seedName', seed.name)
        .keyValue('harmonicReport', 'recognized')
        .all();
      genesisAttestationCount = recognizedPins.length;
      persistent = 'pinata';
    } catch (err) {
      console.error('🜏 Pinata failed, trying SQLite:', err);
    }
  }

  // ── Tier 2: SQLite (Ublox pattern) ─────────────────────────────────────────
  if (persistent === 'memory') {
    const db = getSqliteDb();
    if (db) {
      try {
        sqliteInsertWitness(db, report, witnessCid);
        genesisAttestationCount = sqliteCountRecognized(db, seed.name);
        persistent = 'sqlite';
      } catch (err) {
        console.error('🜏 SQLite failed, in-memory fallback:', err);
      }
    }
  }

  // ── Tier 3: In-memory ───────────────────────────────────────────────────────
  if (persistent === 'memory') {
    _mem.push({ wallet: walletAddress, cFhp: fhpCoherence, timestamp: Date.now() });
    genesisAttestationCount = _mem.filter(a => a.cFhp >= GENESIS_ATTESTATION_THRESHOLD).length;
  }

  // MANIFEST transition
  if (!_memManifested && genesisAttestationCount >= GENESIS_ATTESTATIONS_REQUIRED) {
    _memManifested = true;
    _memManifestTs = Date.now();
    console.log(
      `🜏 LIT_BioRegen_v01 MANIFEST — ${genesisAttestationCount} witnesses recognized the pattern`
    );
  }

  return {
    fired,
    seedName: seed.name,
    seedId: seed.id,
    tauK: coherenceAchieved,
    fhpCoherence,
    harmonicReport,
    witnessCid,
    isGenesisAttestation,
    genesisAttestationCount,
    genesisAttestationsRequired: GENESIS_ATTESTATIONS_REQUIRED,
    genesisActivated: _memManifested,
    genesisManifestTimestamp: _memManifestTs,
    persistent,
  };
}

/**
 * Current Genesis Seed status — exposed via /api/treasury and /api/stats.
 */
export async function getLitBioRegenStatus() {
  const seed = findGenesisSeed('LIT_BioRegen_v01')!;
  let totalIngression = 0;
  let genesisAttestationCount = 0;
  const tier = _getPersistentTier();

  const pinata = getPinata();
  if (pinata) {
    try {
      const [all, recognized] = await Promise.all([
        pinata.listFiles().keyValue('seedName', seed.name).all(),
        pinata.listFiles().keyValue('seedName', seed.name).keyValue('harmonicReport', 'recognized').all(),
      ]);
      totalIngression = all.length;
      genesisAttestationCount = recognized.length;
    } catch { /* fall through to SQLite */ }
  }

  if (totalIngression === 0) {
    const db = getSqliteDb();
    if (db) {
      totalIngression = sqliteCountAll(db, seed.name);
      genesisAttestationCount = sqliteCountRecognized(db, seed.name);
    }
  }

  if (totalIngression === 0) {
    totalIngression = _mem.length;
    genesisAttestationCount = _mem.filter(a => a.cFhp >= GENESIS_ATTESTATION_THRESHOLD).length;
  }

  if (!_memManifested && genesisAttestationCount >= GENESIS_ATTESTATIONS_REQUIRED) {
    _memManifested = true;
    _memManifestTs = Date.now();
  }

  return {
    seed: seed.name,
    seedId: seed.id,
    status: genesisAttestationCount >= GENESIS_ATTESTATIONS_REQUIRED ? 'MANIFEST' : 'POTENTIAL',
    totalIngression,
    genesisAttestationCount,
    genesisAttestationsRequired: GENESIS_ATTESTATIONS_REQUIRED,
    genesisManifestTimestamp: _memManifestTs,
    persistent: tier,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function _getPersistentTier(): LitIngressionResult['persistent'] {
  if (process.env.PINATA_JWT) return 'pinata';
  if (process.env.THERAPY_DB_PATH) return 'sqlite';
  return 'memory';
}

async function _countRecognized(seedName: string): Promise<number> {
  const pinata = getPinata();
  if (pinata) {
    try {
      const pins = await pinata.listFiles().keyValue('seedName', seedName).keyValue('harmonicReport', 'recognized').all();
      return pins.length;
    } catch { /* fall through */ }
  }
  const db = getSqliteDb();
  if (db) return sqliteCountRecognized(db, seedName);
  return _mem.filter(a => a.cFhp >= GENESIS_ATTESTATION_THRESHOLD).length;
}
