import { describe, it, expect } from 'vitest';
import { apiLocale, localizePreset } from '@/i18n/content';
import { PRESET_RECIPES } from '@/types/recipe';
import { PRESET_FLOURS } from '@/types/flour';

describe('preset content localization', () => {
  it('keeps Czech base content for the cs locale', () => {
    const recipe = PRESET_RECIPES[0];
    expect(localizePreset(recipe, ['name', 'ingredients'], 'cs')).toBe(recipe);
    expect(apiLocale('cs')).toBeNull();
    expect(apiLocale('en')).toBe('en');
  });

  it('translates names, nested ingredients and instructions to English', () => {
    const glutenFree = PRESET_RECIPES.find(r => r.pizzaStyle === 'glutenfree')!;
    const en = localizePreset(glutenFree, ['name', 'ingredients', 'instructions'], 'en');

    expect(en.name).toBe('Gluten-Free Pizza Margherita (Caputo Fioreglut)');
    expect(en.ingredients.map(i => i.stage)).toContain('after baking');
    expect(en.instructions.join(' ')).not.toMatch(/[áčďéěíňóřšťúůýž]/);
    // Untranslated fields and the original object are left untouched
    expect(en.bakeTemperature).toBe(glutenFree.bakeTemperature);
    expect(glutenFree.name).toBe('Bezlepková Pizza Margherita (Caputo Fioreglut)');
  });

  it('translates every preset flour field that has Czech content', () => {
    for (const flour of PRESET_FLOURS) {
      const en = localizePreset(flour, ['recommendedFermentationHours', 'usageNotes'], 'en');
      expect(`${en.recommendedFermentationHours} ${en.usageNotes ?? ''}`).not.toMatch(/[áčďéěíňóřšťúůýž]/);
    }
  });
});
