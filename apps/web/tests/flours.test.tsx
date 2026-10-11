import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FloursPage from '@/app/flours/page';
import { LocaleProvider } from '@/context/locale-context';
import { ThemeProvider } from '@/components/theme-provider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/flours',
}));

describe('FloursPage Component', () => {
  it('renders flour registry table with elasticity, Caputo Nuvola Super, and Fioreglut', async () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <FloursPage />
        </LocaleProvider>
      </ThemeProvider>
    );

    // Check heading
    expect(screen.getByText('Katalog a registr mouk')).toBeInTheDocument();

    // Check table headers
    expect(screen.getByText('Elasticita (P/L)')).toBeInTheDocument();
    expect(screen.getByText('V kalkulátoru')).toBeInTheDocument();

    // Wait for initial flours to load
    const caputoPizzeria = await screen.findByText('Caputo Pizzeria Tipo 00');
    expect(caputoPizzeria).toBeInTheDocument();

    // Verify Caputo Nuvola Super and Caputo Fioreglut
    expect(await screen.findByText('Caputo Nuvola Super (Super Cloud)')).toBeInTheDocument();
    expect(await screen.findByText('Caputo Fioreglut (Gluten-Free)')).toBeInTheDocument();

    // Test search filter
    const searchInput = screen.getByPlaceholderText('Hledat mouku podle názvu, značky...');
    fireEvent.change(searchInput, { target: { value: 'Nuvola' } });

    const nuvola = await screen.findByText('Caputo Nuvola Tipo 0');
    expect(nuvola).toBeInTheDocument();
  });
});
