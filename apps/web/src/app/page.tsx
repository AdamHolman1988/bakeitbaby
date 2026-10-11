'use client';

import * as React from 'react';
import { useAppLocale } from '@/context/locale-context';
import { FlourItem, PRESET_FLOURS } from '@/types/flour';
import { fetchFlours } from '@/services/flour-service';
import { calculateDough, YeastType, DoughMethod, DoughCalculationResult } from '@/domain/calculator';
import { Flame, Clock, Scale, Droplets, Sparkles, ChefHat, BookmarkPlus, ArrowRight, Layers, Sparkle } from 'lucide-react';
import Link from 'next/link';

interface StylePreset {
  id: string;
  name: string;
  icon: string;
  hydration: number;
  salt: number;
  oil: number;
  sugar: number;
  hoursRoom: number;
  hoursCold: number;
  defaultFlourId: number;
  method: DoughMethod;
  prefermentPct: number;
  recommendedFlourIds: number[];
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'neapolitan',
    name: 'Klasická Neapol',
    icon: '🍕',
    hydration: 65,
    salt: 2.8,
    oil: 0,
    sugar: 0,
    hoursRoom: 8,
    hoursCold: 16,
    defaultFlourId: 5, // Caputo Pizzeria
    method: 'direct',
    prefermentPct: 0,
    recommendedFlourIds: [5, 4, 3], // Caputo Pizzeria, Le 5 Stagioni Napoletana, Babiččina volba na pizzu
  },
  {
    id: 'contemporary',
    name: 'Contemporary / Canotto',
    icon: '☁️',
    hydration: 72,
    salt: 2.6,
    oil: 1.5,
    sugar: 0,
    hoursRoom: 6,
    hoursCold: 24,
    defaultFlourId: 9, // Caputo Nuvola Super
    method: 'biga',
    prefermentPct: 100,
    recommendedFlourIds: [9, 6, 7], // Caputo Nuvola Super, Caputo Nuvola, Caputo Cuoco
  },
  {
    id: 'roman_pan',
    name: 'Římská plech (Teglia)',
    icon: '🥖',
    hydration: 78,
    salt: 2.5,
    oil: 3.0,
    sugar: 1.0,
    hoursRoom: 4,
    hoursCold: 48,
    defaultFlourId: 11, // Caputo Manitoba Oro
    method: 'poolish',
    prefermentPct: 30,
    recommendedFlourIds: [11, 10, 9], // Manitoba Oro, Perteghella Manitoba, Nuvola Super
  },
  {
    id: 'gluten_free',
    name: 'Bezlepková (Gluten-Free)',
    icon: '🌾',
    hydration: 82,
    salt: 2.5,
    oil: 3.0,
    sugar: 0,
    hoursRoom: 3,
    hoursCold: 18,
    defaultFlourId: 12, // Caputo Fioreglut
    method: 'direct',
    prefermentPct: 0,
    recommendedFlourIds: [12],
  },
  {
    id: 'quick_direct',
    name: 'Rychlá na dnes',
    icon: '⚡',
    hydration: 60,
    salt: 2.5,
    oil: 1.0,
    sugar: 0,
    hoursRoom: 6,
    hoursCold: 0,
    defaultFlourId: 2, // Caputo Classica
    method: 'direct',
    prefermentPct: 0,
    recommendedFlourIds: [2, 3, 1], // Caputo Classica, Babiččina na pizzu, Babiččina hladká
  },
];

export default function CalculatorPage() {
  const { t } = useAppLocale();
  const [flours, setFlours] = React.useState<FlourItem[]>(PRESET_FLOURS);
  const [activeStyleId, setActiveStyleId] = React.useState<string>('neapolitan');

  // Core Calculator Inputs
  const [method, setMethod] = React.useState<DoughMethod>('direct');
  const [prefermentPct, setPrefermentPct] = React.useState<number>(100);
  const [selectedFlourId, setSelectedFlourId] = React.useState<number>(5); // Caputo Pizzeria default
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

  // Load flours from API / fallback
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
        const id = Number(flourParam);
        setSelectedFlourId(id);
        const match = PRESET_FLOURS.find(f => f.id === id);
        if (match?.isGlutenFree) {
          setActiveStyleId('gluten_free');
          setHydrationPercentage(82);
        }
      }
    }
  }, []);

  // Filtered flours for calculator dropdown (respecting showInCalculator toggle)
  const visibleFlours = React.useMemo(() => {
    return flours.filter(f => f.showInCalculator !== false);
  }, [flours]);

  const currentFlour = React.useMemo(() => {
    return flours.find(f => f.id === selectedFlourId) || visibleFlours[0] || PRESET_FLOURS[4];
  }, [flours, visibleFlours, selectedFlourId]);

  const activePreset = React.useMemo(() => {
    return STYLE_PRESETS.find(p => p.id === activeStyleId) || STYLE_PRESETS[0];
  }, [activeStyleId]);

  // Top 3 Recommended Flours for currently selected style
  const recommendedFlours = React.useMemo(() => {
    return activePreset.recommendedFlourIds
      .map(id => flours.find(f => f.id === id))
      .filter((f): f is FlourItem => Boolean(f));
  }, [activePreset, flours]);

  // Reactive Calculation
  const result: DoughCalculationResult = React.useMemo(() => {
    return calculateDough({
      method,
      prefermentPercentage: prefermentPct,
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
      flourWIndex: currentFlour?.wIndex,
      isGlutenFree: currentFlour?.isGlutenFree,
    });
  }, [
    method,
    prefermentPct,
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

  const applyStylePreset = (preset: StylePreset) => {
    setActiveStyleId(preset.id);
    setHydrationPercentage(preset.hydration);
    setSaltPercentage(preset.salt);
    setOilPercentage(preset.oil);
    setSugarPercentage(preset.sugar);
    setHoursRoom(preset.hoursRoom);
    setHoursCold(preset.hoursCold);
    setMethod(preset.method);
    setPrefermentPct(preset.prefermentPct || (preset.method === 'biga' ? 100 : 30));
    setSelectedFlourId(preset.defaultFlourId);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Minimalist Style Presets */}
      <div className="pb-3 border-b border-[var(--color-border)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
              {t('calculator.title')}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              {t('calculator.subtitle')}
            </p>
          </div>
        </div>

        {/* Style Preset Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STYLE_PRESETS.map(preset => {
            const isActive = activeStyleId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyStylePreset(preset)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)] border-[var(--color-primary)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
                }`}
              >
                <span>{preset.icon} {preset.name} ({preset.hydration} %)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Controls (7 cols) + Right Output (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Method Selection (Přímé, Biga, Poolish) */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                01 • Metoda vedení těsta
              </span>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                {method === 'direct' ? '1 fáze' : '2 fáze (Předkvas)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'direct', label: t('calculator.methods.direct'), sub: 'Vše dohromady' },
                { id: 'biga', label: t('calculator.methods.biga'), sub: 'Tuhý (45 % hydr.)' },
                { id: 'poolish', label: t('calculator.methods.poolish'), sub: 'Tekutý (100 % hydr.)' },
              ].map(m => {
                const isSelected = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      const nextMethod = m.id as DoughMethod;
                      setMethod(nextMethod);
                      if (nextMethod === 'biga') setPrefermentPct(100);
                      if (nextMethod === 'poolish') setPrefermentPct(30);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] ring-1 ring-[var(--color-primary)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[var(--color-text-main)]">{m.label}</div>
                    <div className="text-[11px] opacity-75 mt-0.5">{m.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Preferment percentage selector (if Biga or Poolish) */}
            {method !== 'direct' && (
              <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[var(--color-text-main)] block">
                    {t('calculator.prefermentPct')}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    {method === 'biga' ? 'Doporučeno 100 % nebo 50 %' : 'Doporučeno 20–30 % celkové mouky'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(method === 'biga' ? [50, 70, 100] : [20, 30, 50]).map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPrefermentPct(pct)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors border ${
                        prefermentPct === pct
                          ? 'bg-[var(--color-primary)] text-white border-transparent'
                          : 'bg-[var(--color-surface-subtle)] border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      {pct} %
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Flour Selection & Top 3 Recommendations */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                02 • Výběr mouky a síla (W)
              </span>
              <Link
                href="/flours"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                Spravovat mouky →
              </Link>
            </div>

            {/* Top 3 Recommended Flours for Style */}
            {recommendedFlours.length > 0 && (
              <div className="p-2.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1.5">
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
                  ⭐ Top doporučené pro {activePreset.name}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recommendedFlours.map(rf => {
                    const isSelected = selectedFlourId === rf.id;
                    return (
                      <button
                        key={rf.id}
                        type="button"
                        onClick={() => setSelectedFlourId(rf.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                          isSelected
                            ? 'bg-[var(--color-primary)] text-white border-transparent shadow-xs'
                            : 'bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
                        }`}
                      >
                        {rf.name} {rf.wIndex ? `(W ${rf.wIndex})` : '(Bezlepková)'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Select Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                {t('calculator.flourSelect')}
              </label>
              <select
                value={selectedFlourId}
                onChange={e => setSelectedFlourId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-xs font-semibold text-[var(--color-text-main)] focus:outline-hidden focus:ring-1 focus:ring-[var(--color-primary)] cursor-pointer"
              >
                {visibleFlours.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.brand ? `(${f.brand})` : ''} — {f.wIndex ? `W ${f.wIndex}` : 'Bezlepková'} | P/L: {f.elasticityPL || '—'} | Bílkoviny: {f.proteinPercentage}%
                  </option>
                ))}
              </select>
            </div>

            {/* Flour Profile Quick Metrics */}
            {currentFlour && (
              <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block">Síla</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    {currentFlour.wIndex ? `W ${currentFlour.wIndex}` : 'Bezlepková'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block">Elasticita P/L</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    {currentFlour.elasticityPL || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block">Dop. hydratace</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    {currentFlour.minHydration}–{currentFlour.maxHydration} %
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block">Zrání</span>
                  <span className="font-bold text-[var(--color-text-main)] truncate block">
                    {currentFlour.recommendedFermentationHours}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Quantities & Hydration */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] block">
              03 • Počet pizz a hydratace
            </span>

            {/* Pizzas Count */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[var(--color-text-main)]">
                  {t('calculator.pizzasCount')}
                </label>
                <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
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
                  className="w-16 px-2 py-1 text-center font-mono font-bold text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                />
              </div>
            </div>

            {/* Ball Weight */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[var(--color-text-main)]">
                  {t('calculator.ballWeight')}
                </label>
                <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                  {ballWeightGrams} g
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={180}
                  max={650}
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
                  className="w-16 px-2 py-1 text-center font-mono font-bold text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                />
              </div>
            </div>

            {/* Hydration */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[var(--color-text-main)]">
                  {t('calculator.hydration')}
                </label>
                <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                  {hydrationPercentage} %
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={45}
                  max={95}
                  value={hydrationPercentage}
                  onChange={e => setHydrationPercentage(Number(e.target.value))}
                  className="flex-1 accent-[var(--color-primary)] cursor-pointer"
                />
                <input
                  type="number"
                  min={40}
                  max={100}
                  value={hydrationPercentage}
                  onChange={e => setHydrationPercentage(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-center font-mono font-bold text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Yeast, Salt & Fats */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] block">
              04 • Droždí, sůl a doplňky
            </span>

            {/* Yeast Type Buttons */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1.5">
                {t('calculator.yeastType')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'fresh', label: 'Čerstvé droždí', sub: '1.0×' },
                  { id: 'instant_dry', label: 'Instantní sušené', sub: '0.33×' },
                  { id: 'active_dry', label: 'Aktivní sušené', sub: '0.5×' },
                  { id: 'sourdough', label: 'Kvásek', sub: '15 %' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setYeastType(item.id as YeastType)}
                    className={`p-2 rounded-xl border text-left transition-colors cursor-pointer ${
                      yeastType === item.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] ring-1 ring-[var(--color-primary)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[var(--color-text-main)]">{item.label}</div>
                    <div className="text-[10px] opacity-75 font-mono mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Salt, Oil, Sugar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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
                  max={5}
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
                  max={3}
                  step={0.5}
                  value={sugarPercentage}
                  onChange={e => setSugarPercentage(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Fermentation Schedule */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] block">
              05 • Teploty a plán kynutí
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  {t('calculator.tempRoom')}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={16}
                    max={32}
                    value={tempRoom}
                    onChange={e => setTempRoom(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">°C</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  {t('calculator.timeRoom')}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    max={48}
                    value={hoursRoom}
                    onChange={e => setHoursRoom(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">hod</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  {t('calculator.timeCold')}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={96}
                    value={hoursCold}
                    onChange={e => setHoursCold(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">hod</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column (Clean Minimalist Card, Sticky Desktop) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          {/* Main Calculation Card */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)] block">
                  Výsledná receptura
                </span>
                <h2 className="text-lg font-bold font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
                  {pizzasCount} × {ballWeightGrams} g = {result.ingredients.totalDoughGrams} g
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[var(--color-text-main)]">
                {hydrationPercentage} % hydr.
              </span>
            </div>

            {/* Preferment Two-Phase Breakdown (If Biga or Poolish) */}
            {result.preferment && (
              <div className="space-y-3 pb-2">
                {/* Phase 1 Box */}
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{result.preferment.phase1.title}</span>
                    </span>
                    <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                      {result.preferment.phase1.hydrationPercentage} % hydr.
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">Mouka</span>
                      <strong className="text-[var(--color-text-main)]">{result.preferment.phase1.flourGrams} g</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">Voda</span>
                      <strong className="text-[var(--color-text-main)]">{result.preferment.phase1.waterGrams} g</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">Droždí</span>
                      <strong className="text-[var(--color-text-main)]">{result.preferment.phase1.yeastGrams} g</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-[var(--color-text-muted)] space-y-1 pt-1 border-t border-[var(--color-border)]">
                    <div>⏱ <strong>Zrání:</strong> {result.preferment.phase1.fermentationSchedule}</div>
                    <div>💡 <strong>Příprava:</strong> {result.preferment.phase1.instructions}</div>
                  </div>
                </div>

                {/* Phase 2 Box */}
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{result.preferment.phase2.title}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">Zbylá mouka</span>
                      <strong className="text-[var(--color-text-main)]">{result.preferment.phase2.remainingFlourGrams} g</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">Zbylá voda</span>
                      <strong className="text-[var(--color-text-main)]">{result.preferment.phase2.remainingWaterGrams} g</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">Sůl</span>
                      <strong className="text-[var(--color-text-main)]">{result.preferment.phase2.saltGrams} g</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-[var(--color-text-muted)] space-y-1 pt-1 border-t border-[var(--color-border)]">
                    <div>❄️ <strong>Teplota:</strong> {result.preferment.phase2.waterTempAdvice}</div>
                    <div>🥣 <strong>Postup:</strong> {result.preferment.phase2.instructions}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Total Batch Ingredients Table */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block mb-1">
                Celkový souhrn surovin (100 % báze):
              </span>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.flour')}</span>
                <span className="font-mono font-bold text-[var(--color-text-main)]">
                  {result.ingredients.flourGrams} g <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">100 %</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.water')}</span>
                <span className="font-mono font-bold text-[var(--color-text-main)]">
                  {result.ingredients.waterGrams} g <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">{hydrationPercentage} %</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.yeast')}</span>
                <span className="font-mono font-bold text-[var(--color-text-main)]">
                  {result.ingredients.yeastGrams} g <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">{result.percentages.yeast} %</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.salt')}</span>
                <span className="font-mono font-bold text-[var(--color-text-main)]">
                  {result.ingredients.saltGrams} g <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">{saltPercentage} %</span>
                </span>
              </div>

              {oilPercentage > 0 && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                  <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.oil')}</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    {result.ingredients.oilGrams} g <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">{oilPercentage} %</span>
                  </span>
                </div>
              )}

              {sugarPercentage > 0 && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                  <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.sugar')}</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    {result.ingredients.sugarGrams} g <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">{sugarPercentage} %</span>
                  </span>
                </div>
              )}
            </div>

            {/* Warnings or Validation State */}
            {result.fermentation.warnings.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold block">Technologické upozornění:</span>
                {result.fermentation.warnings.map((warn, i) => (
                  <p key={i} className="leading-snug">
                    • {warn}
                  </p>
                ))}
              </div>
            )}

            {/* Fermentation Schedule Breakdown */}
            <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-[var(--color-text-main)]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Časový rozvrh (celkem {hoursRoom + hoursCold} h)</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-sans">Bulk RT</span>
                  <span className="font-bold text-[var(--color-text-main)]">
                    {result.fermentation.schedule.bulkHoursRT} h
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-sans">Lednice CT</span>
                  <span className="font-bold text-[var(--color-text-main)]">
                    {result.fermentation.schedule.coldHoursCT} h
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-sans">Bochánky RT</span>
                  <span className="font-bold text-[var(--color-text-main)]">
                    {result.fermentation.schedule.ballProofHoursRT} h
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button: Save as Dough Formula */}
            <Link
              href={`/doughs?save=true&name=${encodeURIComponent(
                `${activePreset.name} (${hydrationPercentage} %)`
              )}&hydration=${hydrationPercentage}&flourId=${selectedFlourId}&pizzas=${pizzasCount}&weight=${ballWeightGrams}&salt=${saltPercentage}&oil=${oilPercentage}&sugar=${sugarPercentage}&rt=${hoursRoom}&ct=${hoursCold}&method=${method}&pref=${prefermentPct}&style=${activePreset.id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-contrast)] font-semibold text-xs shadow-xs transition-colors cursor-pointer text-center"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>{t('calculator.saveAsDough')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
