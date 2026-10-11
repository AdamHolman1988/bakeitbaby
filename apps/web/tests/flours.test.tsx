import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FloursPage from '@/app/flours/page';
import { LocaleProvider } from '@/context/locale-context';
import { ThemeProvider } from '@/components/theme-provider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/flours',
}));

describe('FloursPage Component', () => {
  it('renders flour catalog, strength reference table, and filters', async () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <FloursPage />
        </LocaleProvider>
      </ThemeProvider>
    );

    // Check heading
    expect(screen.getByText('Katalog a správa mouk')).toBeInTheDocument();

    // Check W strength reference cards (appears in banner and filter buttons)
    expect(screen.getAllByText('W 160–200').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('W 220–260').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('W 270–310').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('W 320–380+').length).toBeGreaterThanOrEqual(1);

    // Wait for initial flours to load
    const caputoPizzeria = await screen.findByText('Caputo Pizzeria Tipo 00');
    expect(caputoPizzeria).toBeInTheDocument();

    // Test search filter
    const searchInput = screen.getByPlaceholderText('Hledat mouku podle názvu, značky...');
    fireEvent.change(searchInput, { target: { value: 'Nuvola' } });

    const nuvola = await screen.findByText('Caputo Nuvola Tipo 0');
    expect(nuvola).toBeInTheDocument();
  });
});
