'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useAppLocale } from '@/context/locale-context';

export function ThemeToggle() {
  const { t } = useAppLocale();
  const labelLight = t('theme.light');
  const labelDark = t('theme.dark');
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] opacity-50" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-main)] transition-colors cursor-pointer"
      title={isDark ? labelLight : labelDark}
      aria-label={t('theme.toggle')}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-[var(--color-mustard)]" />
          <span>{labelLight}</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-[var(--color-navy)]" />
          <span>{labelDark}</span>
        </>
      )}
    </button>
  );
}
