'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import csMessages from '../../messages/cs.json';
import enMessages from '../../messages/en.json';

export type Locale = 'cs' | 'en';

const messageMap: Record<Locale, typeof csMessages> = {
  cs: csMessages,
  en: enMessages,
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: typeof csMessages;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('cs');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('NEXT_LOCALE') as Locale;
    if (saved === 'cs' || saved === 'en') {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('NEXT_LOCALE', newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const messages = messageMap[locale];

  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const parts = path.split('.');
      let current: any = messages;
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return path;
        }
      }
      if (typeof current !== 'string') return path;
      if (!params) return current;
      return Object.entries(params).reduce(
        (str, [key, val]) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val)),
        current
      );
    },
    [messages]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useAppLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useAppLocale must be used within a LocaleProvider');
  }
  return context;
}
