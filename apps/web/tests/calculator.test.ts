import { describe, it, expect } from 'vitest';
import { calculateDough, YEAST_RATIOS } from '@/domain/calculator';

describe('Dough Calculator Domain Math', () => {
  it('correctly calculates classic 65% Neapolitan dough for 4 pizzas of 260g', () => {
    const result = calculateDough({
      pizzasCount: 4,
      ballWeightGrams: 260,
      hydrationPercentage: 65,
      yeastType: 'fresh',
      yeastPercentage: 0.15,
      saltPercentage: 2.8,
      oilPercentage: 0,
      sugarPercentage: 0,
      flourWIndex: 280,
      hoursRoomTemp: 8,
      hoursColdTemp: 16,
    });

    // Total target = 1040g
    // Flour + Water + Salt + Yeast = ~1040g
    expect(result.ingredients.totalDoughGrams).toBeCloseTo(1040, -1);
    expect(result.percentages.flour).toBe(100);
    expect(result.percentages.water).toBe(65);
    expect(result.percentages.salt).toBe(2.8);

    // Verify flour ~ 619g, water ~ 402g
    expect(result.ingredients.flourGrams).toBeGreaterThan(600);
    expect(result.ingredients.flourGrams).toBeLessThan(640);
    expect(result.ingredients.waterGrams).toBeGreaterThan(390);
    expect(result.ingredients.waterGrams).toBeLessThan(420);

    // W 280 is Strong flour
    expect(result.fermentation.category).toBe('strong');
    expect(result.fermentation.isHydrationOk).toBe(true);
  });

  it('accurately divides yeast by 3 for instant dry yeast', () => {
    const freshResult = calculateDough({
      pizzasCount: 4,
      ballWeightGrams: 250,
      hydrationPercentage: 60,
      yeastType: 'fresh',
      yeastPercentage: 0.30,
      saltPercentage: 2.5,
    });

    const instantResult = calculateDough({
      pizzasCount: 4,
      ballWeightGrams: 250,
      hydrationPercentage: 60,
      yeastType: 'instant_dry',
      yeastPercentage: 0.30,
      saltPercentage: 2.5,
    });

    expect(instantResult.ingredients.yeastGrams).toBeCloseTo(
      freshResult.ingredients.yeastGrams * YEAST_RATIOS.instant_dry,
      1
    );
  });

  it('triggers hydration and fermentation warnings when exceeding flour W capabilities', () => {
    // Weak flour W 180 pushed to 75% hydration and 48h fermentation
    const result = calculateDough({
      pizzasCount: 2,
      ballWeightGrams: 250,
      hydrationPercentage: 75,
      yeastType: 'fresh',
      saltPercentage: 2.5,
      flourWIndex: 180,
      hoursRoomTemp: 24,
      hoursColdTemp: 24,
    });

    expect(result.fermentation.category).toBe('weak');
    expect(result.fermentation.isHydrationOk).toBe(false);
    expect(result.fermentation.warnings.length).toBeGreaterThan(0);
  });
});
