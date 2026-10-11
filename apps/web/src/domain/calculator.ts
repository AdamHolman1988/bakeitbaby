export type YeastType = 'fresh' | 'instant_dry' | 'active_dry' | 'sourdough';
export type DoughMethod = 'direct' | 'biga' | 'poolish';

export interface DoughInput {
  method?: DoughMethod; // default 'direct'
  prefermentPercentage?: number; // e.g. 100 for 100% biga, 30 for 30% poolish
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
  flourWIndex?: number | null;
  isGlutenFree?: boolean;
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

export interface PrefermentPhase {
  method: DoughMethod;
  prefermentPercentage: number;
  phase1: {
    title: string;
    flourGrams: number;
    waterGrams: number;
    yeastGrams: number;
    hydrationPercentage: number;
    fermentationSchedule: string;
    instructions: string;
  };
  phase2: {
    title: string;
    remainingFlourGrams: number;
    remainingWaterGrams: number;
    saltGrams: number;
    oilGrams: number;
    sugarGrams: number;
    additionalYeastGrams: number;
    waterTempAdvice: string;
    instructions: string;
  };
}

export interface FermentationAdvice {
  category: 'weak' | 'medium' | 'strong' | 'manitoba' | 'gluten_free';
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
  method: DoughMethod;
  ingredients: DoughIngredients;
  percentages: {
    flour: number;
    water: number;
    yeast: number;
    salt: number;
    oil: number;
    sugar: number;
  };
  preferment?: PrefermentPhase | null;
  fermentation: FermentationAdvice;
}

export const YEAST_RATIOS: Record<YeastType, number> = {
  fresh: 1.0,
  instant_dry: 0.33,
  active_dry: 0.5,
  sourdough: 15.0, // expressed as 15% starter ratio relative to flour
};

export function calculateDough(input: DoughInput): DoughCalculationResult {
  const method: DoughMethod = input.method ?? 'direct';
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
    if (method === 'biga') {
      baseFreshYeastPct = 1.0; // standard 1% fresh yeast on biga flour
    } else if (method === 'poolish') {
      baseFreshYeastPct = 0.2; // poolish starter yeast
    } else if (totalHours <= 4) {
      baseFreshYeastPct = 0.5; // quick dough
    } else if (totalHours <= 12) {
      baseFreshYeastPct = 0.25; // 8-12h same day
    } else if (totalHours <= 24) {
      baseFreshYeastPct = 0.15; // 24h
    } else {
      baseFreshYeastPct = 0.10; // 48h+ cold
    }
  }

  // Calculate actual yeast % depending on type
  const actualYeastPct =
    input.yeastType === 'sourdough'
      ? 15.0
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

  // Two-phase preferment calculation (Biga / Poolish)
  let preferment: PrefermentPhase | null = null;

  if (method === 'biga') {
    const prefPct = input.prefermentPercentage ?? 100; // default 100% biga
    const bigaFlour = Math.round((flourGrams * (prefPct / 100)) * 10) / 10;
    const bigaWater = Math.round((bigaFlour * 0.45) * 10) / 10; // 45% hydration standard for Biga
    const bigaYeast = Math.round((bigaFlour * 0.01 * YEAST_RATIOS[input.yeastType]) * 100) / 100;

    const remFlour = Math.max(0, Math.round((flourGrams - bigaFlour) * 10) / 10);
    const remWater = Math.max(0, Math.round((waterGrams - bigaWater) * 10) / 10);

    preferment = {
      method: 'biga',
      prefermentPercentage: prefPct,
      phase1: {
        title: `Fáze 1: Biga (${prefPct} % mouky)`,
        flourGrams: bigaFlour,
        waterGrams: bigaWater,
        yeastGrams: bigaYeast,
        hydrationPercentage: 45,
        fermentationSchedule: '1 hodina pokojová teplota (18–20 °C) + 16–24 hodin v lednici (4–5 °C) nebo vinotéce (16–18 °C)',
        instructions: 'Nerozvíjejte lepek! Mouku pouze zlehka promíchejte s vodou a droždím, aby vznikly hrudkovité, vzdušné kousky bez suché mouky.',
      },
      phase2: {
        title: 'Fáze 2: Finální těsto (Osvěžení)',
        remainingFlourGrams: remFlour,
        remainingWaterGrams: remWater,
        saltGrams,
        oilGrams,
        sugarGrams,
        additionalYeastGrams: 0,
        waterTempAdvice: 'Použijte ledovou vodu (3–4 °C) přímo z lednice/mrazáku, aby se těsto při hnětení nezahřálo nad 23 °C.',
        instructions: 'Bigu natrhejte na kousky do mísy. Přidejte zbylou mouku a začněte hníst. Postupně pomalu přilévejte ledovou vodu (bassinage), na závěr zapracujte sůl a olej. Odpočinek 30 min, stočení do bochánků a 3–4 hodiny kynutí při pokojové teplotě před pečením.',
      },
    };
  } else if (method === 'poolish') {
    const prefPct = input.prefermentPercentage ?? 30; // default 30% poolish
    const poolishFlour = Math.round((flourGrams * (prefPct / 100)) * 10) / 10;
    const poolishWater = poolishFlour; // 100% hydration = 1:1 poměr mouky a vody
    const poolishYeast = Math.max(0.1, Math.round((poolishFlour * 0.002 * YEAST_RATIOS[input.yeastType]) * 100) / 100);

    const remFlour = Math.max(0, Math.round((flourGrams - poolishFlour) * 10) / 10);
    const remWater = Math.max(0, Math.round((waterGrams - poolishWater) * 10) / 10);

    preferment = {
      method: 'poolish',
      prefermentPercentage: prefPct,
      phase1: {
        title: `Fáze 1: Poolish (${prefPct} % mouky)`,
        flourGrams: poolishFlour,
        waterGrams: poolishWater,
        yeastGrams: poolishYeast,
        hydrationPercentage: 100,
        fermentationSchedule: '1 hodina pokojová teplota + 16–24 hodin v lednici (4 °C), dokud povrch není plný bublin',
        instructions: 'V uzavíratelné dóze rozmíchejte mouku, vodu a špetku droždí do konzistence hladkého palačinkového těstíčka.',
      },
      phase2: {
        title: 'Fáze 2: Finální těsto (Osvěžení)',
        remainingFlourGrams: remFlour,
        remainingWaterGrams: remWater,
        saltGrams,
        oilGrams,
        sugarGrams,
        additionalYeastGrams: 0,
        waterTempAdvice: 'Použijte studenou vodu z lednice pro udržení ideální teploty těsta.',
        instructions: 'Bublající poolish vlijte k zbývající mouce a začněte hníst. Přilévejte zbývající vodu, přidejte sůl a olej. Hněťte 10–12 minut do hedvábné tažnosti. Nechte 40 minut odpočinout, navažte bochánky a nechte 2–3 hodiny dokynout před pečením.',
      },
    };
  }

  // Fermentation and W-strength analysis
  const isGlutenFree = Boolean(input.isGlutenFree);
  const w = input.flourWIndex;
  let category: FermentationAdvice['category'] = 'medium';
  let idealHydrMin = 55;
  let idealHydrMax = 62;
  let idealHoursMin = 8;
  let idealHoursMax = 14;

  if (isGlutenFree || w === null || w === undefined) {
    category = 'gluten_free';
    idealHydrMin = 80;
    idealHydrMax = 85;
    idealHoursMin = 3;
    idealHoursMax = 24;
  } else if (w < 220) {
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

  if (!isGlutenFree && w !== null && w !== undefined) {
    if (hydration > idealHydrMax + 3) {
      warnings.push(`Zvolená hydratace (${hydration} %) překračuje doporučené maximum pro mouku W ${w} (${idealHydrMax} %). Těsto může lepit a ztrácet tvar.`);
    } else if (hydration < idealHydrMin - 2) {
      warnings.push(`Zvolená hydratace (${hydration} %) je nižší než doporučené minimum pro mouku W ${w} (${idealHydrMin} %).`);
    }

    if (totalHours > idealHoursMax * 1.5) {
      warnings.push(`Doba fermentace (${totalHours} h) je příliš dlouhá pro mouku W ${w} (doporučeno max ${idealHoursMax} h). Hrozí degradace lepku.`);
    } else if (totalHours < idealHoursMin * 0.7 && w >= 270) {
      warnings.push(`Mouka se silou W ${w} potřebuje delší zrání (alespoň ${idealHoursMin} h) pro optimální rozklad škrobů a lehkou stravitelnost.`);
    }
  } else {
    if (hydration < 75) {
      warnings.push(`Bezlepková směs vyžaduje vysokou hydrataci (80–85 %). Při ${hydration} % bude těsto příliš suché.`);
    }
  }

  const isFermentationOk = totalHours >= idealHoursMin * 0.7 && totalHours <= idealHoursMax * 1.5;

  // Schedule breakdown
  const coldHours = input.hoursColdTemp ?? (totalHours > 16 ? totalHours - 8 : 0);
  const remainingRT = Math.max(2, totalHours - coldHours);
  const ballProofHours = Math.min(remainingRT, totalHours > 12 ? 4 : Math.round(remainingRT * 0.5));
  const bulkHours = Math.max(0, remainingRT - ballProofHours);

  return {
    method,
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
    preferment,
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
