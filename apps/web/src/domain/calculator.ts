export type YeastType = 'fresh' | 'instant_dry' | 'active_dry' | 'sourdough';

export interface DoughInput {
  pizzasCount: number;
  ballWeightGrams: number;
  hydrationPercentage: number;
  yeastType: YeastType;
  yeastPercentage?: number; // base fresh yeast equivalent percentage, default ~0.15% - 0.25%
  saltPercentage: number;
  oilPercentage?: number;
  sugarPercentage?: number;
  tempRoomCelsius?: number;
  hoursRoomTemp?: number;
  hoursColdTemp?: number;
  flourWIndex?: number;
}

export interface DoughIngredients {
  flourGrams: number;
  waterGrams: number;
  yeastGrams: number;
  saltGrams: number;
  oilGrams: number;
  sugarGrams: number;
  totalDoughGrams: number;
}

export interface FermentationAdvice {
  category: 'weak' | 'medium' | 'strong' | 'manitoba';
  idealHydrationMin: number;
  idealHydrationMax: number;
  idealTotalHoursMin: number;
  idealTotalHoursMax: number;
  isHydrationOk: boolean;
  isFermentationOk: boolean;
  warnings: string[];
  schedule: {
    bulkHoursRT: number;
    coldHoursCT: number;
    ballProofHoursRT: number;
  };
}

export interface DoughCalculationResult {
  ingredients: DoughIngredients;
  percentages: {
    flour: number;
    water: number;
    yeast: number;
    salt: number;
    oil: number;
    sugar: number;
  };
  fermentation: FermentationAdvice;
}

export const YEAST_RATIOS: Record<YeastType, number> = {
  fresh: 1.0,
  instant_dry: 0.33,
  active_dry: 0.5,
  sourdough: 15.0, // expressed as 15% starter ratio relative to flour
};

export function calculateDough(input: DoughInput): DoughCalculationResult {
  const count = Math.max(1, input.pizzasCount);
  const ballWeight = Math.max(50, input.ballWeightGrams);
  const totalDough = count * ballWeight;

  const hydration = Math.max(40, Math.min(100, input.hydrationPercentage));
  const salt = Math.max(0, Math.min(10, input.saltPercentage));
  const oil = Math.max(0, Math.min(20, input.oilPercentage ?? 0));
  const sugar = Math.max(0, Math.min(20, input.sugarPercentage ?? 0));

  // Determine base fresh yeast % based on fermentation temperature and time if not supplied
  const totalHours = (input.hoursRoomTemp ?? 8) + (input.hoursColdTemp ?? 0);
  let baseFreshYeastPct = input.yeastPercentage;
  if (baseFreshYeastPct === undefined || baseFreshYeastPct <= 0) {
    if (totalHours <= 4) baseFreshYeastPct = 0.5; // quick dough
    else if (totalHours <= 12) baseFreshYeastPct = 0.25; // 8-12h same day
    else if (totalHours <= 24) baseFreshYeastPct = 0.15; // 24h
    else baseFreshYeastPct = 0.10; // 48h+ cold
  }

  // Calculate actual yeast % depending on type
  const actualYeastPct =
    input.yeastType === 'sourdough'
      ? 15.0 // sourdough starter typically 15-20%
      : baseFreshYeastPct * YEAST_RATIOS[input.yeastType];

  // Baker's percentage sum (flour = 100%)
  const totalPercentage = 100 + hydration + salt + actualYeastPct + oil + sugar;

  const flourGrams = Math.round((totalDough / (totalPercentage / 100)) * 10) / 10;
  const waterGrams = Math.round(((flourGrams * hydration) / 100) * 10) / 10;
  const yeastGrams = Math.round(((flourGrams * actualYeastPct) / 100) * 100) / 100;
  const saltGrams = Math.round(((flourGrams * salt) / 100) * 10) / 10;
  const oilGrams = Math.round(((flourGrams * oil) / 100) * 10) / 10;
  const sugarGrams = Math.round(((flourGrams * sugar) / 100) * 10) / 10;

  const exactTotal = Math.round((flourGrams + waterGrams + yeastGrams + saltGrams + oilGrams + sugarGrams) * 10) / 10;

  // Fermentation and W-strength analysis
  const w = input.flourWIndex ?? 260;
  let category: FermentationAdvice['category'] = 'medium';
  let idealHydrMin = 55;
  let idealHydrMax = 60;
  let idealHoursMin = 8;
  let idealHoursMax = 14;

  if (w < 220) {
    category = 'weak';
    idealHydrMin = 50;
    idealHydrMax = 55;
    idealHoursMin = 2;
    idealHoursMax = 4;
  } else if (w <= 260) {
    category = 'medium';
    idealHydrMin = 55;
    idealHydrMax = 62;
    idealHoursMin = 8;
    idealHoursMax = 14;
  } else if (w <= 310) {
    category = 'strong';
    idealHydrMin = 60;
    idealHydrMax = 70;
    idealHoursMin = 24;
    idealHoursMax = 48;
  } else {
    category = 'manitoba';
    idealHydrMin = 70;
    idealHydrMax = 85;
    idealHoursMin = 48;
    idealHoursMax = 72;
  }

  const warnings: string[] = [];
  const isHydrationOk = hydration >= idealHydrMin - 2 && hydration <= idealHydrMax + 3;
  if (hydration > idealHydrMax + 3) {
    warnings.push(`Zvolená hydratace (${hydration} %) překračuje doporučené maximum pro mouku W ${w} (${idealHydrMax} %). Těsto může ztrácet pevnost.`);
  } else if (hydration < idealHydrMin - 2) {
    warnings.push(`Zvolená hydratace (${hydration} %) je nižší než doporučené minimum pro mouku W ${w} (${idealHydrMin} %).`);
  }

  const isFermentationOk = totalHours >= idealHoursMin * 0.7 && totalHours <= idealHoursMax * 1.5;
  if (totalHours > idealHoursMax * 1.5) {
    warnings.push(`Doba fermentace (${totalHours} h) je příliš dlouhá pro mouku W ${w} (doporučeno max ${idealHoursMax} h). Hrozí degradace lepku.`);
  } else if (totalHours < idealHoursMin * 0.7 && w >= 270) {
    warnings.push(`Mouka se silou W ${w} potřebuje delší zrání (alespoň ${idealHoursMin} h) pro dosažení dobré stravitelnosti.`);
  }

  // Schedule breakdown
  const coldHours = input.hoursColdTemp ?? (totalHours > 16 ? totalHours - 8 : 0);
  const remainingRT = Math.max(2, totalHours - coldHours);
  const ballProofHours = Math.min(remainingRT, totalHours > 12 ? 4 : Math.round(remainingRT * 0.5));
  const bulkHours = Math.max(0, remainingRT - ballProofHours);

  return {
    ingredients: {
      flourGrams,
      waterGrams,
      yeastGrams,
      saltGrams,
      oilGrams,
      sugarGrams,
      totalDoughGrams: exactTotal,
    },
    percentages: {
      flour: 100,
      water: hydration,
      yeast: Math.round(actualYeastPct * 100) / 100,
      salt,
      oil,
      sugar,
    },
    fermentation: {
      category,
      idealHydrationMin: idealHydrMin,
      idealHydrationMax: idealHydrMax,
      idealTotalHoursMin: idealHoursMin,
      idealTotalHoursMax: idealHoursMax,
      isHydrationOk,
      isFermentationOk,
      warnings,
      schedule: {
        bulkHoursRT: bulkHours,
        coldHoursCT: coldHours,
        ballProofHoursRT: ballProofHours,
      },
    },
  };
}
