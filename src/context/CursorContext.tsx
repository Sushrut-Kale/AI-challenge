'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface CursorContextType {
  isCursorEnabled: boolean;
  toggleCursor: () => void;
  setCursorEnabled: (enabled: boolean) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

const STORAGE_KEY = 'agentcraft_custom_cursor_enabled';

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [isCursorEnabled, setIsCursorEnabledState] = useState<boolean>(true);

  // Initialize from localStorage or default to true on fine-pointer devices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsCursorEnabledState(stored === 'true');
      } else {
        const isTouch = window.matchMedia('(pointer: coarse) and not (pointer: fine)').matches;
        setIsCursorEnabledState(!isTouch);
      }
    } catch {
      // localStorage may fail in restricted iframes
    }
  }, []);

  const setCursorEnabled = useCallback((enabled: boolean) => {
    setIsCursorEnabledState(enabled);
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      // ignore storage errors
    }
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.documentElement.classList.add('custom-cursor-active');
      } else {
        document.documentElement.classList.remove('custom-cursor-active');
      }
    }
  }, []);

  const toggleCursor = useCallback(() => {
    setCursorEnabled(!isCursorEnabled);
  }, [isCursorEnabled, setCursorEnabled]);

  return (
    <CursorContext.Provider value={{ isCursorEnabled, toggleCursor, setCursorEnabled }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}
