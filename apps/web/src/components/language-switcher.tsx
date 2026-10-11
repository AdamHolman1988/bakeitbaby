'use client';

import * as React from 'react';
import { useAppLocale, type Locale } from '@/context/locale-context';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useAppLocale();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 text-xs font-semibold">
      <Languages className="w-3.5 h-3.5 ml-1 text-[var(--color-text-muted)]" />
      <button
        type="button"
        onClick={() => setLocale('cs')}
        className={`px-2 py-1 rounded transition-colors cursor-pointer ${
          locale === 'cs'
            ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)] font-bold shadow-xs'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)]'
        }`}
      >
        CZ
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2 py-1 rounded transition-colors cursor-pointer ${
          locale === 'en'
            ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)] font-bold shadow-xs'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)]'
        }`}
      >
        EN
      </button>
    </div>
  );
}
