import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/sidebar';
import { LocaleProvider } from '@/context/locale-context';
import { SettingsProvider } from '@/context/settings-context';
import { ThemeProvider } from '@/components/theme-provider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Sidebar Navigation', () => {
  it('renders navigation items: Calculator, Doughs, Recipes, Flours', () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <SettingsProvider>
            <Sidebar />
          </SettingsProvider>
        </LocaleProvider>
      </ThemeProvider>
    );

    expect(screen.getByText('Kalkulátor')).toBeInTheDocument();
    expect(screen.getByText('Těsta')).toBeInTheDocument();
    expect(screen.getByText('Recepty')).toBeInTheDocument();
    expect(screen.getByText('Mouky')).toBeInTheDocument();
  });
});
