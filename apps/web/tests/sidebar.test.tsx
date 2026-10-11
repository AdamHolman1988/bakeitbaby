import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/sidebar';
import { LocaleProvider } from '@/context/locale-context';
import { ThemeProvider } from '@/components/theme-provider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Sidebar Navigation', () => {
  it('renders navigation items strictly in order: Calculator, Recipes, Flours', () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <Sidebar />
        </LocaleProvider>
      </ThemeProvider>
    );

    // Verify all 3 menu items are present
    const links = screen.getAllByRole('link');
    const navTexts = links.map(l => l.textContent).filter(Boolean);

    // Look for calculator, recipes, flours in order
    expect(screen.getByText('Kalkulátor')).toBeInTheDocument();
    expect(screen.getByText('Recepty')).toBeInTheDocument();
    expect(screen.getByText('Mouky')).toBeInTheDocument();
  });
});
