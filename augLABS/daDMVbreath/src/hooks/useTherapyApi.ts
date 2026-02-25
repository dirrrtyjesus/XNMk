/**
 * $THERAPY API Client Hook
 *
 * Connects dApp to the shared coherence backend
 * 🜏 ∞ 🜏
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  TherapyUser,
  BreathSession,
  LinkUserRequest,
  StartSessionRequest,
  CompleteSessionRequest,
  ClaimResponse,
  CoherenceResponse,
} from '../api/types';
import type { CommunityCoherence } from '../core/therapy/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';

/**
 * API client state
 */
interface ApiState {
  user: TherapyUser | null;
  currentSession: BreathSession | null;
  coherence: CommunityCoherence | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for $THERAPY API communication
 */
export function useTherapyApi(telegramId?: number, walletAddress?: string) {
  const [state, setState] = useState<ApiState>({
    user: null,
    currentSession: null,
    coherence: null,
    isLoading: false,
    error: null,
  });

  /**
   * Make API request
   */
  const apiRequest = useCallback(async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T | null> => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || 'Request failed');
      }

      return await res.json();
    } catch (err) {
      console.error(`API error (${endpoint}):`, err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'API error',
      }));
      return null;
    }
  }, []);

  /**
   * Link/create user identity
   */
  const linkUser = useCallback(async (
    request: LinkUserRequest
  ): Promise<TherapyUser | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const result = await apiRequest<{ success: boolean; user?: TherapyUser }>(
      '/api/user/link',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (result?.success && result.user) {
      setState(prev => ({
        ...prev,
        user: result.user!,
        isLoading: false,
      }));
      return result.user;
    }

    setState(prev => ({ ...prev, isLoading: false }));
    return null;
  }, [apiRequest]);

  /**
   * Start a breath session
   */
  const startSession = useCallback(async (
    protocol: string,
    totalCycles: number
  ): Promise<string | null> => {
    if (!state.user) {
      setState(prev => ({ ...prev, error: 'User not linked' }));
      return null;
    }

    const request: StartSessionRequest = {
      userId: state.user.id,
      protocol,
      totalCycles,
      source: 'dapp',
    };

    const result = await apiRequest<{ success: boolean; sessionId?: string }>(
      '/api/session/start',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (result?.success && result.sessionId) {
      setState(prev => ({
        ...prev,
        currentSession: {
          id: result.sessionId!,
          userId: state.user!.id,
          protocol,
          cyclesCompleted: 0,
          totalCycles,
          startedAt: Date.now(),
          coherenceAchieved: 0,
          tauKAchieved: 0,
          rewardsEarned: 0,
          source: 'dapp',
        },
      }));
      return result.sessionId;
    }

    return null;
  }, [state.user, apiRequest]);

  /**
   * Update session progress
   */
  const updateSession = useCallback(async (
    cyclesCompleted: number,
    currentCoherence: number,
    currentTauK: number
  ) => {
    if (!state.currentSession) return;

    await apiRequest('/api/session/update', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: state.currentSession.id,
        cyclesCompleted,
        currentCoherence,
        currentTauK,
      }),
    });

    setState(prev => ({
      ...prev,
      currentSession: prev.currentSession ? {
        ...prev.currentSession,
        cyclesCompleted,
        coherenceAchieved: Math.max(prev.currentSession.coherenceAchieved, currentCoherence),
        tauKAchieved: Math.max(prev.currentSession.tauKAchieved, currentTauK),
      } : null,
    }));
  }, [state.currentSession, apiRequest]);

  /**
   * Complete session
   */
  const completeSession = useCallback(async (
    cyclesCompleted: number,
    coherenceAchieved: number,
    tauKAchieved: number
  ): Promise<{ rewardsEarned: number; totalRewards: number } | null> => {
    if (!state.currentSession) return null;

    const request: CompleteSessionRequest = {
      sessionId: state.currentSession.id,
      cyclesCompleted,
      coherenceAchieved,
      tauKAchieved,
    };

    const result = await apiRequest<{
      success: boolean;
      rewardsEarned: number;
      totalRewards: number;
    }>('/api/session/complete', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (result?.success) {
      setState(prev => ({
        ...prev,
        currentSession: null,
        user: prev.user ? {
          ...prev.user,
          totalRewardsEarned: result.totalRewards,
          lastBreathSession: Date.now(),
        } : null,
      }));
      return {
        rewardsEarned: result.rewardsEarned,
        totalRewards: result.totalRewards,
      };
    }

    return null;
  }, [state.currentSession, apiRequest]);

  /**
   * Claim $THERAPY tokens — Proof of Breath.
   *
   * Sends session proof to /api/session/claim (Vercel serverless in production,
   * proxied to Express on localhost:3333 in dev). Stateless — no sessionId needed.
   */
  const claimSession = useCallback(async (
    walletAddress: string,
    proof: {
      cyclesCompleted: number;
      coherenceAchieved: number;
      tauKAchieved: number;
      holdDuration: number;
    }
  ): Promise<ClaimResponse | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const result = await apiRequest<ClaimResponse>('/api/session/claim', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, ...proof }),
    });

    setState(prev => ({ ...prev, isLoading: false }));
    return result;
  }, [apiRequest]);

  /**
   * Fetch coherence state
   */
  const fetchCoherence = useCallback(async (manifold: string = 'global') => {
    const result = await apiRequest<CoherenceResponse>(
      `/api/coherence/${manifold}`
    );

    if (result) {
      setState(prev => ({
        ...prev,
        coherence: result.coherence,
      }));
    }

    return result;
  }, [apiRequest]);

  /**
   * Auto-link user on mount if we have identity info
   */
  useEffect(() => {
    if (telegramId || walletAddress) {
      linkUser({ telegramId, walletAddress });
    }
  }, [telegramId, walletAddress, linkUser]);

  /**
   * Poll coherence periodically
   */
  useEffect(() => {
    fetchCoherence();
    const interval = setInterval(() => fetchCoherence(), 30000);
    return () => clearInterval(interval);
  }, [fetchCoherence]);

  return {
    ...state,
    linkUser,
    startSession,
    updateSession,
    completeSession,
    claimSession,
    fetchCoherence,
    clearError: () => setState(prev => ({ ...prev, error: null })),
  };
}
