import { describe, it, expect } from 'vitest';
import { calculateDough, YEAST_RATIOS } from '@/domain/calculator';

describe('Dough Calculator Domain Math', () => {
  it('correctly calculates classic 65% Neapolitan dough for 4 pizzas of 260g', () => {
    const result = calculateDough({
      method: 'direct',
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

    expect(result.ingredients.totalDoughGrams).toBeCloseTo(1040, -1);
    expect(result.percentages.flour).toBe(100);
    expect(result.percentages.water).toBe(65);
    expect(result.percentages.salt).toBe(2.8);

    expect(result.ingredients.flourGrams).toBeGreaterThan(600);
    expect(result.ingredients.flourGrams).toBeLessThan(640);
    expect(result.ingredients.waterGrams).toBeGreaterThan(390);
    expect(result.ingredients.waterGrams).toBeLessThan(420);

    expect(result.fermentation.category).toBe('strong');
    expect(result.fermentation.isHydrationOk).toBe(true);
    expect(result.preferment).toBeNull();
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

  it('calculates 100% Biga two-phase breakdown correctly', () => {
    const result = calculateDough({
      method: 'biga',
      prefermentPercentage: 100,
      pizzasCount: 4,
      ballWeightGrams: 275,
      hydrationPercentage: 70,
      yeastType: 'fresh',
      saltPercentage: 2.8,
      flourWIndex: 330,
    });

    expect(result.preferment).toBeDefined();
    expect(result.preferment?.method).toBe('biga');
    expect(result.preferment?.phase1.hydrationPercentage).toBe(45);
    // In 100% biga, all flour is in Phase 1
    expect(result.preferment?.phase1.flourGrams).toBe(result.ingredients.flourGrams);
    expect(result.preferment?.phase2.remainingFlourGrams).toBe(0);
    // Phase 2 contains remaining water to reach 70% total hydration
    expect(result.preferment?.phase2.remainingWaterGrams).toBeGreaterThan(100);
    expect(result.preferment?.phase2.saltGrams).toBe(result.ingredients.saltGrams);
  });

  it('calculates 30% Poolish two-phase breakdown correctly', () => {
    const result = calculateDough({
      method: 'poolish',
      prefermentPercentage: 30,
      pizzasCount: 4,
      ballWeightGrams: 260,
      hydrationPercentage: 68,
      yeastType: 'fresh',
      saltPercentage: 2.8,
      flourWIndex: 260,
    });

    expect(result.preferment).toBeDefined();
    expect(result.preferment?.method).toBe('poolish');
    expect(result.preferment?.phase1.hydrationPercentage).toBe(100);
    // 30% flour in poolish
    expect(result.preferment?.phase1.flourGrams).toBeCloseTo(result.ingredients.flourGrams * 0.3, 0);
    // 1:1 ratio water to flour in poolish
    expect(result.preferment?.phase1.waterGrams).toBe(result.preferment?.phase1.flourGrams);
    // Phase 2 contains remaining 70% of flour
    expect(result.preferment?.phase2.remainingFlourGrams).toBeCloseTo(result.ingredients.flourGrams * 0.7, 0);
  });

  it('handles gluten-free dough calculation properly', () => {
    const result = calculateDough({
      method: 'direct',
      pizzasCount: 4,
      ballWeightGrams: 270,
      hydrationPercentage: 82,
      yeastType: 'instant_dry',
      saltPercentage: 2.5,
      isGlutenFree: true,
      flourWIndex: null,
    });

    expect(result.fermentation.category).toBe('gluten_free');
    expect(result.fermentation.isHydrationOk).toBe(true);
    expect(result.ingredients.flourGrams).toBeGreaterThan(500);
  });
});
