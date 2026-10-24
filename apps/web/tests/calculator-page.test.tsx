import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorPage from '@/app/page';
import { LocaleProvider } from '@/context/locale-context';
import { SettingsProvider } from '@/context/settings-context';
import { ThemeProvider } from '@/components/theme-provider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('CalculatorPage Component', () => {
  it('renders dough calculator and recalculates ingredient grams on pizza count change', async () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <SettingsProvider>
            <CalculatorPage />
          </SettingsProvider>
        </LocaleProvider>
      </ThemeProvider>
    );

    // Title
    expect(screen.getByText('Kalkulátor pizza těsta')).toBeInTheDocument();

    // Default 4 pizzas of 260g
    expect(screen.getByText(/4 × 260 g/)).toBeInTheDocument();

    // Change pizza count to 6
    const countInputs = screen.getAllByRole('spinbutton');
    const pizzaCountInput = countInputs[0];
    fireEvent.change(pizzaCountInput, { target: { value: '6' } });

    // 6 × 260 g
    expect(screen.getByText(/6 × 260 g/)).toBeInTheDocument();
  });

  it('renders method buttons and displays two-phase breakdown when Biga is selected', () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <SettingsProvider>
            <CalculatorPage />
          </SettingsProvider>
        </LocaleProvider>
      </ThemeProvider>
    );

    // Switch to Biga
    const bigaBtn = screen.getByText('Biga');
    fireEvent.click(bigaBtn);

    // Should show Phase 1 and Phase 2 breakdown
    expect(screen.getByText(/Fáze 1: Biga/)).toBeInTheDocument();
    expect(screen.getByText(/Fáze 2: Finální těsto/)).toBeInTheDocument();
  });

  it('displays Metoda přípravy těsta, allows Biga hydration adjustment and oven selection', () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <SettingsProvider>
            <CalculatorPage />
          </SettingsProvider>
        </LocaleProvider>
      </ThemeProvider>
    );

    // Natural Czech phrasing check
    expect(screen.getByText(/Metoda přípravy těsta/)).toBeInTheDocument();

    // Select Biga and check hydration slider
    const bigaBtn = screen.getByText('Biga');
    fireEvent.click(bigaBtn);
    expect(screen.getByText(/Hydratace bigy/)).toBeInTheDocument();
    expect(screen.getAllByText('50%').length).toBeGreaterThanOrEqual(1);

    // Select Wood oven (AVPN 2024 standard)
    const woodOvenBtn = screen.getByText('Pec na dřevo');
    fireEvent.click(woodOvenBtn);
    expect(screen.getByText('AVPN 2024')).toBeInTheDocument();
    expect(screen.getAllByText('485 °C').length).toBeGreaterThanOrEqual(1);
  });
});
