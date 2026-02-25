/**
 * Telegram Mini App Integration Hook
 *
 * Detects if running inside Telegram and provides user context
 * 🜏 ∞ 🜏
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Telegram WebApp user data
 */
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

/**
 * Telegram Mini App state
 */
export interface TelegramState {
  isInTelegram: boolean;
  isReady: boolean;
  user: TelegramUser | null;
  startParam: string | null;  // Deep link parameter
  colorScheme: 'light' | 'dark';
  viewportHeight: number;
  isExpanded: boolean;
}

/**
 * Telegram WebApp global interface
 */
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  sendData: (data: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

/**
 * Hook for Telegram Mini App integration
 */
export function useTelegram() {
  const [state, setState] = useState<TelegramState>({
    isInTelegram: false,
    isReady: false,
    user: null,
    startParam: null,
    colorScheme: 'dark',
    viewportHeight: window.innerHeight,
    isExpanded: false,
  });

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      // We're inside Telegram
      setState({
        isInTelegram: true,
        isReady: true,
        user: tg.initDataUnsafe.user || null,
        startParam: tg.initDataUnsafe.start_param || null,
        colorScheme: tg.colorScheme,
        viewportHeight: tg.viewportHeight,
        isExpanded: tg.isExpanded,
      });

      // Tell Telegram we're ready
      tg.ready();

      // Expand to full height
      tg.expand();
    } else {
      // Not in Telegram, check URL params for testing
      const params = new URLSearchParams(window.location.search);
      const testUserId = params.get('tg_user_id');
      const startParam = params.get('start');

      setState(prev => ({
        ...prev,
        isReady: true,
        startParam,
        user: testUserId ? {
          id: parseInt(testUserId, 10),
          first_name: 'Test User',
        } : null,
      }));
    }
  }, []);

  /**
   * Trigger haptic feedback (if in Telegram)
   */
  const haptic = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    if (['success', 'warning', 'error'].includes(type)) {
      tg.HapticFeedback.notificationOccurred(type as 'success' | 'warning' | 'error');
    } else {
      tg.HapticFeedback.impactOccurred(type as 'light' | 'medium' | 'heavy');
    }
  }, []);

  /**
   * Show main button
   */
  const showMainButton = useCallback((text: string, onClick: () => void) => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.MainButton.setText(text);
    tg.MainButton.onClick(onClick);
    tg.MainButton.show();
  }, []);

  /**
   * Hide main button
   */
  const hideMainButton = useCallback(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.MainButton.hide();
  }, []);

  /**
   * Close Mini App
   */
  const close = useCallback(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.close();
    } else {
      window.close();
    }
  }, []);

  /**
   * Open link (uses Telegram's browser if in TG)
   */
  const openLink = useCallback((url: string) => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }, []);

  /**
   * Send data back to bot
   */
  const sendData = useCallback((data: Record<string, unknown>) => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.sendData(JSON.stringify(data));
    }
  }, []);

  return {
    ...state,
    haptic,
    showMainButton,
    hideMainButton,
    close,
    openLink,
    sendData,
  };
}
