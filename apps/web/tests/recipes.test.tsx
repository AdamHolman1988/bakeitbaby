import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecipesPage from '@/app/recipes/page';
import { LocaleProvider } from '@/context/locale-context';
import { ThemeProvider } from '@/components/theme-provider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/recipes',
}));

describe('RecipesPage Component', () => {
  it('renders pizza cookbook, pizza recipes with ingredients and baking info', async () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <RecipesPage />
        </LocaleProvider>
      </ThemeProvider>
    );

    // Title
    expect(screen.getByText('Pizza kuchařka & recepty')).toBeInTheDocument();

    // Check pre-seeded cookbook recipes
    const margheritaTitle = await screen.findByText('Pizza Margherita Verace D.O.P.');
    expect(margheritaTitle).toBeInTheDocument();

    const marinaraTitle = await screen.findByText('Pizza Marinara Tradizionale');
    expect(marinaraTitle).toBeInTheDocument();

    // Search filter
    const searchInput = screen.getByPlaceholderText('Hledat recept...');
    fireEvent.change(searchInput, { target: { value: 'Diavola' } });

    const diavola = await screen.findByText("Pizza Diavola con 'Nduja di Spilinga");
    expect(diavola).toBeInTheDocument();
  });
});
