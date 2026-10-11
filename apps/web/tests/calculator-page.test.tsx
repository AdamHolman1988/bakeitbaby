import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorPage from '@/app/page';
import { LocaleProvider } from '@/context/locale-context';
import { ThemeProvider } from '@/components/theme-provider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('CalculatorPage Component', () => {
  it('renders dough calculator and recalculates ingredient grams on pizza count change', async () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <CalculatorPage />
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
          <CalculatorPage />
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
});
