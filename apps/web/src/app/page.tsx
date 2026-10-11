'use client';

import * as React from 'react';
import { useAppLocale } from '@/context/locale-context';
import { FlourItem, PRESET_FLOURS } from '@/types/flour';
import { fetchFlours } from '@/services/flour-service';
import { calculateDough, YeastType, DoughCalculationResult } from '@/domain/calculator';
import { Flame, Info, AlertTriangle, CheckCircle2, BookmarkPlus, Clock, Scale, Droplets, Sparkles, ChefHat } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorPage() {
  const { t } = useAppLocale();
  const [flours, setFlours] = React.useState<FlourItem[]>(PRESET_FLOURS);
  const [selectedFlourId, setSelectedFlourId] = React.useState<number>(5); // Caputo Pizzeria default

  // Inputs
  const [pizzasCount, setPizzasCount] = React.useState<number>(4);
  const [ballWeightGrams, setBallWeightGrams] = React.useState<number>(260);
  const [hydrationPercentage, setHydrationPercentage] = React.useState<number>(65);
  const [yeastType, setYeastType] = React.useState<YeastType>('fresh');
  const [saltPercentage, setSaltPercentage] = React.useState<number>(2.8);
  const [oilPercentage, setOilPercentage] = React.useState<number>(0);
  const [sugarPercentage, setSugarPercentage] = React.useState<number>(0);
  const [tempRoom, setTempRoom] = React.useState<number>(21);
  const [hoursRoom, setHoursRoom] = React.useState<number>(8);
  const [hoursCold, setHoursCold] = React.useState<number>(16);

  // Load flours from API/storage
  React.useEffect(() => {
    fetchFlours().then(data => {
      if (data && data.length > 0) {
        setFlours(data);
      }
    });

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const flourParam = params.get('flourId');
      if (flourParam) {
        setSelectedFlourId(Number(flourParam));
      }
    }
  }, []);

  const currentFlour = React.useMemo(() => {
    return flours.find(f => f.id === selectedFlourId) || flours[0] || PRESET_FLOURS[4];
  }, [flours, selectedFlourId]);

  // Reactive Calculation
  const result: DoughCalculationResult = React.useMemo(() => {
    return calculateDough({
      pizzasCount,
      ballWeightGrams,
      hydrationPercentage,
      yeastType,
      saltPercentage,
      oilPercentage,
      sugarPercentage,
      tempRoomCelsius: tempRoom,
      hoursRoomTemp: hoursRoom,
      hoursColdTemp: hoursCold,
      flourWIndex: currentFlour?.wIndex ?? 260,
    });
  }, [
    pizzasCount,
    ballWeightGrams,
    hydrationPercentage,
    yeastType,
    saltPercentage,
    oilPercentage,
    sugarPercentage,
    tempRoom,
    hoursRoom,
    hoursCold,
    currentFlour,
  ]);

  // Presets
  const applyPreset = (preset: {
    hydration: number;
    flourId?: number;
    salt: number;
    oil: number;
    hoursRoom: number;
    hoursCold: number;
  }) => {
    setHydrationPercentage(preset.hydration);
    setSaltPercentage(preset.salt);
    setOilPercentage(preset.oil);
    setHoursRoom(preset.hoursRoom);
    setHoursCold(preset.hoursCold);
    if (preset.flourId) setSelectedFlourId(preset.flourId);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Preset Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-contrast)] shadow-xs">
              <Flame className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
              {t('calculator.title')}
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {t('calculator.subtitle')}
          </p>
        </div>

        {/* Quick Style Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <button
            type="button"
            onClick={() =>
              applyPreset({ hydration: 65, flourId: 5, salt: 2.8, oil: 0, hoursRoom: 8, hoursCold: 16 })
            }
            className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            🍕 Klasická Neapol (65 %)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({ hydration: 72, flourId: 6, salt: 2.6, oil: 1.5, hoursRoom: 6, hoursCold: 24 })
            }
            className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            ☁️ Canotto (72 %)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({ hydration: 75, flourId: 10, salt: 2.5, oil: 3.0, hoursRoom: 4, hoursCold: 48 })
            }
            className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            🥖 Římská plech (75 %)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({ hydration: 60, flourId: 3, salt: 2.5, oil: 1.0, hoursRoom: 8, hoursCold: 0 })
            }
            className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            ⚡ Rychlá na dnes (60 %)
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls (7 cols) + Right Output (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Flour Selection & W strength indicator */}
          <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                01 • Výběr mouky a síla (W)
              </span>
              <Link
                href="/flours"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:underline"
              >
                Spravovat mouky →
              </Link>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1.5">
                {t('calculator.flourSelect')}
              </label>
              <select
                value={selectedFlourId}
                onChange={e => setSelectedFlourId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-sm font-semibold text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
              >
                {flours.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.brand ? `(${f.brand})` : ''} — W {f.wIndex} | Bílkoviny {f.proteinPercentage}%
                  </option>
                ))}
              </select>
            </div>

            {/* Flour Profile Card */}
            {currentFlour && (
              <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-[var(--color-text-muted)] block">Doporučená hydratace</span>
                  <span className="font-bold text-[var(--color-text-main)] text-sm">
                    {currentFlour.minHydration}–{currentFlour.maxHydration} %
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--color-text-muted)] block">Optimální zrání</span>
                  <span className="font-bold text-[var(--color-text-main)] text-sm">
                    {currentFlour.recommendedFermentationHours}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--color-text-muted)] block">Síla lepku</span>
                  <span className="font-mono font-bold text-sm px-2 py-0.5 rounded-md bg-[var(--color-navy)] text-white dark:bg-[var(--color-mustard)] dark:text-black">
                    W {currentFlour.wIndex}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Dough Quantities & Hydration */}
          <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] block">
              02 • Množství a hydratace
            </span>

            {/* Pizzas Count */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-main)]">
                  {t('calculator.pizzasCount')}
                </label>
                <span className="text-sm font-bold font-mono text-[var(--color-primary)]">
                  {pizzasCount} ks
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={pizzasCount}
                  onChange={e => setPizzasCount(Number(e.target.value))}
                  className="flex-1 accent-[var(--color-primary)] cursor-pointer"
                />
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={pizzasCount}
                  onChange={e => setPizzasCount(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-2 py-1 text-center font-mono font-bold text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)]"
                />
              </div>
            </div>

            {/* Ball Weight */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-main)]">
                  {t('calculator.ballWeight')}
                </label>
                <span className="text-sm font-bold font-mono text-[var(--color-primary)]">
                  {ballWeightGrams} g
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={180}
                  max={450}
                  step={5}
                  value={ballWeightGrams}
                  onChange={e => setBallWeightGrams(Number(e.target.value))}
                  className="flex-1 accent-[var(--color-primary)] cursor-pointer"
                />
                <input
                  type="number"
                  min={100}
                  max={1000}
                  step={5}
                  value={ballWeightGrams}
                  onChange={e => setBallWeightGrams(Math.max(50, Number(e.target.value)))}
                  className="w-16 px-2 py-1 text-center font-mono font-bold text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)]"
                />
              </div>
              <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">
                Standard: 240–260 g (klasická neapolská 30 cm), 280–320 g (canotto), 350+ g (plech)
              </span>
            </div>

            {/* Hydration */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-main)]">
                  {t('calculator.hydration')}
                </label>
                <span className="text-base font-extrabold font-mono text-[var(--color-primary)]">
                  {hydrationPercentage} %
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={50}
                  max={85}
                  step={1}
                  value={hydrationPercentage}
                  onChange={e => setHydrationPercentage(Number(e.target.value))}
                  className="flex-1 accent-[var(--color-primary)] cursor-pointer"
                />
                <input
                  type="number"
                  min={40}
                  max={95}
                  step={0.5}
                  value={hydrationPercentage}
                  onChange={e => setHydrationPercentage(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-center font-mono font-bold text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)]"
                />
              </div>

              {/* Flour Hydration Match Guide */}
              {currentFlour && (
                <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] mt-1.5 font-medium">
                  <span>Minimum: {currentFlour.minHydration} %</span>
                  <span className={hydrationPercentage >= currentFlour.minHydration && hydrationPercentage <= currentFlour.maxHydration ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400'}>
                    Doporučeno: {currentFlour.minHydration}–{currentFlour.maxHydration} %
                  </span>
                  <span>Maximum: {currentFlour.maxHydration} %</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Yeast Type & Ingredients */}
          <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] block">
              03 • Typ droždí a doplňky
            </span>

            {/* Yeast Type Tabs */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1.5">
                {t('calculator.yeastType')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'fresh', label: 'Čerstvé droždí', sub: '1.0x' },
                  { id: 'instant_dry', label: 'Instantní sušené', sub: '0.33x' },
                  { id: 'active_dry', label: 'Aktivní sušené', sub: '0.5x' },
                  { id: 'sourdough', label: 'Kvásek / LM', sub: '15 %' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setYeastType(item.id as YeastType)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      yeastType === item.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-contrast)] shadow-xs'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] opacity-80 font-mono mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Salt & Fats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[var(--color-text-main)]">
                    {t('calculator.saltPercentage')}
                  </label>
                  <span className="text-xs font-mono font-bold text-[var(--color-text-main)]">
                    {saltPercentage} %
                  </span>
                </div>
                <input
                  type="range"
                  min={1.5}
                  max={3.5}
                  step={0.1}
                  value={saltPercentage}
                  onChange={e => setSaltPercentage(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[var(--color-text-main)]">
                    {t('calculator.oilPercentage')}
                  </label>
                  <span className="text-xs font-mono font-bold text-[var(--color-text-main)]">
                    {oilPercentage} %
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={0.5}
                  value={oilPercentage}
                  onChange={e => setOilPercentage(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[var(--color-text-main)]">
                    {t('calculator.sugarPercentage')}
                  </label>
                  <span className="text-xs font-mono font-bold text-[var(--color-text-main)]">
                    {sugarPercentage} %
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={4}
                  step={0.5}
                  value={sugarPercentage}
                  onChange={e => setSugarPercentage(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Fermentation Environment */}
          <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] block">
              04 • Teploty a plán fermentace
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  {t('calculator.tempRoom')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={16}
                    max={32}
                    value={tempRoom}
                    onChange={e => setTempRoom(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">°C</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  {t('calculator.timeRoom')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={48}
                    value={hoursRoom}
                    onChange={e => setHoursRoom(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">hod</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  {t('calculator.timeCold')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={96}
                    value={hoursCold}
                    onChange={e => setHoursCold(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">hod (lednice)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column (Sticky on Desktop) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-6">
          {/* Main Calculation Card */}
          <div className="rounded-2xl border-2 border-[var(--color-primary)] bg-[var(--color-surface)] p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)] block">
                  Výsledná receptura
                </span>
                <h2 className="text-xl font-black font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
                  {pizzasCount} × {ballWeightGrams} g = {result.ingredients.totalDoughGrams} g
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                {hydrationPercentage} % hydr.
              </span>
            </div>

            {/* Ingredients Table */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-surface-subtle)] font-medium text-sm">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="font-bold text-[var(--color-text-main)]">{t('calculator.flour')}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-base text-[var(--color-text-main)]">
                    {result.ingredients.flourGrams} g
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)] ml-2">100 %</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-surface-subtle)] font-medium text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-[var(--color-text-main)]">{t('calculator.water')}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-base text-[var(--color-text-main)]">
                    {result.ingredients.waterGrams} g
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)] ml-2">
                    {result.percentages.water} %
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-surface-subtle)] font-medium text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-[var(--color-text-main)]">
                    {yeastType === 'sourdough' ? 'Kvásek' : t('calculator.yeast')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-base text-[var(--color-text-main)]">
                    {result.ingredients.yeastGrams} g
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)] ml-2">
                    {result.percentages.yeast} %
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-surface-subtle)] font-medium text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-center font-bold text-xs text-[var(--color-text-muted)]">🧂</span>
                  <span className="font-bold text-[var(--color-text-main)]">{t('calculator.salt')}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-base text-[var(--color-text-main)]">
                    {result.ingredients.saltGrams} g
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)] ml-2">
                    {result.percentages.salt} %
                  </span>
                </div>
              </div>

              {oilPercentage > 0 && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-surface-subtle)] font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-center font-bold text-xs text-[var(--color-text-muted)]">🫒</span>
                    <span className="font-bold text-[var(--color-text-main)]">{t('calculator.oil')}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-base text-[var(--color-text-main)]">
                      {result.ingredients.oilGrams} g
                    </span>
                    <span className="text-[11px] text-[var(--color-text-muted)] ml-2">
                      {result.percentages.oil} %
                    </span>
                  </div>
                </div>
              )}

              {sugarPercentage > 0 && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-surface-subtle)] font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-center font-bold text-xs text-[var(--color-text-muted)]">🍯</span>
                    <span className="font-bold text-[var(--color-text-main)]">{t('calculator.sugar')}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-base text-[var(--color-text-main)]">
                      {result.ingredients.sugarGrams} g
                    </span>
                    <span className="text-[11px] text-[var(--color-text-muted)] ml-2">
                      {result.percentages.sugar} %
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Warnings or Validation State */}
            {result.fermentation.warnings.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Doporučení pro optimální výsledek</span>
                </div>
                {result.fermentation.warnings.map((warn, i) => (
                  <p key={i} className="leading-snug">
                    • {warn}
                  </p>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Hydratace i plánovaná fermentace perfektně odpovídají síle mouky W {currentFlour?.wIndex}.</span>
              </div>
            )}

            {/* Fermentation Schedule Breakdown */}
            <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-main)]">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Rozpis fází fermentace (celkem {hoursRoom + hoursCold} h)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-sans">1. Bulk RT</span>
                  <span className="font-bold text-sm text-[var(--color-text-main)]">
                    {result.fermentation.schedule.bulkHoursRT} h
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-sans">2. Chlad CT (4°C)</span>
                  <span className="font-bold text-sm text-[var(--color-text-main)]">
                    {result.fermentation.schedule.coldHoursCT} h
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-sans">3. Bochánky RT</span>
                  <span className="font-bold text-sm text-[var(--color-text-main)]">
                    {result.fermentation.schedule.ballProofHoursRT} h
                  </span>
                </div>
              </div>
            </div>

            {/* Save as Recipe CTA */}
            <Link
              href={`/recipes?savePreset=true&name=${encodeURIComponent(
                `Moje pizza ${hydrationPercentage}%`
              )}&hydration=${hydrationPercentage}&flourId=${selectedFlourId}&pizzas=${pizzasCount}&weight=${ballWeightGrams}&salt=${saltPercentage}&oil=${oilPercentage}&sugar=${sugarPercentage}&rt=${hoursRoom}&ct=${hoursCold}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-contrast)] font-bold text-sm shadow-sm transition-colors cursor-pointer text-center"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>{t('calculator.saveAsRecipe')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
