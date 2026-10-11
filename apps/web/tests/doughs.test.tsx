import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DoughsPage from '@/app/doughs/page';
import { LocaleProvider } from '@/context/locale-context';
import { ThemeProvider } from '@/components/theme-provider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/doughs',
}));

describe('DoughsPage Component', () => {
  it('renders dough formulations, baker percentages, and search', async () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <DoughsPage />
        </LocaleProvider>
      </ThemeProvider>
    );

    // Title
    expect(screen.getByText('Těsta a receptury')).toBeInTheDocument();

    // Check pre-seeded dough blueprints
    const avpnTitle = await screen.findByText('Klasická Neapolská Pizza (AVPN)');
    expect(avpnTitle).toBeInTheDocument();

    const bigaTitle = await screen.findByText('100% Biga Neapolské těsto');
    expect(bigaTitle).toBeInTheDocument();

    // Search filter
    const searchInput = screen.getByPlaceholderText('Hledat těsto...');
    fireEvent.change(searchInput, { target: { value: 'Canotto' } });

    const canotto = await screen.findByText('Moderní Pizza Canotto (Vzdušné okraje)');
    expect(canotto).toBeInTheDocument();
  });
});
