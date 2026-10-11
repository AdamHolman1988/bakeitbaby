'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppLocale } from '@/context/locale-context';
import { Calculator, ChefHat, BookOpen, Wheat, Menu, X, Flame } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';

export function Sidebar() {
  const { t } = useAppLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    {
      href: '/',
      label: t('nav.calculator'),
      icon: Calculator,
      active: pathname === '/' || pathname === '/calculator',
    },
    {
      href: '/doughs',
      label: t('nav.doughs'),
      icon: ChefHat,
      active: pathname.startsWith('/doughs'),
    },
    {
      href: '/recipes',
      label: t('nav.recipes'),
      icon: BookOpen,
      active: pathname.startsWith('/recipes'),
    },
    {
      href: '/flours',
      label: t('nav.flours'),
      icon: Wheat,
      active: pathname.startsWith('/flours'),
    },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-contrast)] shadow-xs">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
              BakeItBaby
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop persistent + Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-contrast)] shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
                BakeItBaby
              </div>
              <div className="text-[11px] font-medium text-[var(--color-text-muted)] tracking-wider uppercase">
                {t('nav.subtitle')}
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  item.active
                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)] shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)]'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <span className="text-[11px] font-mono text-[var(--color-text-subtle)]">v1.2.0</span>
        </div>
      </aside>
    </>
  );
}
