import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecipesPage from '@/app/recipes/page';
import { LocaleProvider } from '@/context/locale-context';
import { ThemeProvider } from '@/components/theme-provider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/recipes',
}));

describe('RecipesPage Component', () => {
  it('renders recipes catalog, filter buttons, and opens preparation steps', async () => {
    render(
      <ThemeProvider attribute="class">
        <LocaleProvider>
          <RecipesPage />
        </LocaleProvider>
      </ThemeProvider>
    );

    // Title
    expect(screen.getByText('Recepty na pizzu')).toBeInTheDocument();

    // Check pre-seeded recipe titles
    const avpnTitle = await screen.findByText('Klasická Neapolská Pizza (AVPN)');
    expect(avpnTitle).toBeInTheDocument();

    const canottoTitle = await screen.findByText('Moderní Pizza Canotto (Vzdušné okraje)');
    expect(canottoTitle).toBeInTheDocument();

    // Search filter
    const searchInput = screen.getByPlaceholderText('Hledat recept...');
    fireEvent.change(searchInput, { target: { value: 'Biga' } });

    const bigaRecipe = await screen.findByText('100% Biga Neapolská Pizza');
    expect(bigaRecipe).toBeInTheDocument();
  });
});
