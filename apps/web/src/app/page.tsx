'use client';

import * as React from 'react';
import { useAppLocale } from '@/context/locale-context';
import { useSettings } from '@/context/settings-context';
import { FlourItem, PRESET_FLOURS } from '@/types/flour';
import { fetchFlours } from '@/services/flour-service';
import { calculateDough, YeastType, DoughMethod, DoughCalculationResult } from '@/domain/calculator';
import { Clock, BookmarkPlus } from 'lucide-react';
import {
  PixelDirectIcon,
  PixelBigaIcon,
  PixelPoolishIcon,
  PixelPhase1Icon,
  PixelPhase2Icon,
  PixelHomeOvenIcon,
  PixelPizzaOvenIcon,
  PixelWoodOvenIcon,
} from '@/components/pixel-icons';
import Link from 'next/link';

interface StylePreset {
  id: string;
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
    icon: '🍕',
    hydration: 58, // AVPN Disciplinare 2024: 55.5% - 62.5% (canonical 58%)
    salt: 2.9,
    oil: 0,
    sugar: 0,
    hoursRoom: 8,
    hoursCold: 0,
    defaultFlourId: 5, // Caputo Pizzeria
    method: 'direct',
    prefermentPct: 0,
    recommendedFlourIds: [5, 4, 3], // Caputo Pizzeria, Le 5 Stagioni Napoletana, Babiččina volba (pizza)
  },
  {
    id: 'contemporary',
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
    recommendedFlourIds: [2, 3, 1], // Caputo Classica, Babiččina volba pizza & all-purpose
  },
];

export default function CalculatorPage() {
  const { t } = useAppLocale();
  const { formatTemp, formatWeight } = useSettings();
  const presetName = (id: string) => t(`calculator.presets.${id}`);
  const [flours, setFlours] = React.useState<FlourItem[]>(PRESET_FLOURS);
  const [activeStyleId, setActiveStyleId] = React.useState<string>('neapolitan');

  // Core Calculator Inputs
  const [method, setMethod] = React.useState<DoughMethod>('direct');
  const [prefermentPct, setPrefermentPct] = React.useState<number>(100);
  const [bigaHydration, setBigaHydration] = React.useState<number>(50); // Default 50%
  const [selectedFlourId, setSelectedFlourId] = React.useState<number>(5); // Caputo Pizzeria default
  const [pizzasCount, setPizzasCount] = React.useState<number>(4);
  const [ballWeightGrams, setBallWeightGrams] = React.useState<number>(260);
  const [hydrationPercentage, setHydrationPercentage] = React.useState<number>(58); // AVPN default 58%
  const [yeastType, setYeastType] = React.useState<YeastType>('fresh');
  const [saltPercentage, setSaltPercentage] = React.useState<number>(2.9);
  const [oilPercentage, setOilPercentage] = React.useState<number>(0);
  const [sugarPercentage, setSugarPercentage] = React.useState<number>(0);
  const [tempRoom, setTempRoom] = React.useState<number>(21);
  const [hoursRoom, setHoursRoom] = React.useState<number>(8);
  const [hoursCold, setHoursCold] = React.useState<number>(0);

  // Oven & Baking settings
  const [ovenType, setOvenType] = React.useState<'home' | 'dedicated' | 'wood'>('home');
  const [ovenTemp, setOvenTemp] = React.useState<number>(250);

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

  // Top 3 Recommended Flours for currently selected style (dynamically fetched from Mouky database)
  const recommendedFlours = React.useMemo(() => {
    const tagged = flours.filter(f => f.recommendedForStyles?.includes(activeStyleId));
    if (tagged.length > 0) {
      return tagged;
    }
    return activePreset.recommendedFlourIds
      .map(id => flours.find(f => f.id === id))
      .filter((f): f is FlourItem => Boolean(f));
  }, [activeStyleId, activePreset, flours]);

  // Reactive Calculation
  const result: DoughCalculationResult = React.useMemo(() => {
    return calculateDough({
      method,
      prefermentPercentage: prefermentPct,
      bigaHydrationPercentage: bigaHydration,
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
    bigaHydration,
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
    if (preset.method === 'biga') setBigaHydration(50);
    setSelectedFlourId(preset.defaultFlourId);
    if (preset.id === 'neapolitan') {
      setOvenType('wood');
      setOvenTemp(485);
    } else if (preset.id === 'contemporary') {
      setOvenType('dedicated');
      setOvenTemp(430);
    } else {
      setOvenType('home');
      setOvenTemp(250);
    }
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
                <span>{preset.icon} {presetName(preset.id)} ({preset.hydration} %)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Controls (7 cols) + Right Output (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Method Selection (Direct, Biga, Poolish) */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                01 • {t('calculator.method')}
              </span>
              <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                {method === 'direct' ? t('calculator.phaseCount.single') : t('calculator.phaseCount.double')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'direct', label: t('calculator.methods.direct'), icon: PixelDirectIcon, sub: t('calculator.methodSub.direct') },
                { id: 'biga', label: t('calculator.methods.biga'), icon: PixelBigaIcon, sub: t('calculator.methodSub.biga', { hydration: bigaHydration }) },
                { id: 'poolish', label: t('calculator.methods.poolish'), icon: PixelPoolishIcon, sub: t('calculator.methodSub.poolish') },
              ].map(m => {
                const isSelected = method === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      const nextMethod = m.id as DoughMethod;
                      setMethod(nextMethod);
                      if (nextMethod === 'biga') {
                        setPrefermentPct(100);
                        setBigaHydration(50);
                      }
                      if (nextMethod === 'poolish') setPrefermentPct(30);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] ring-1 ring-[var(--color-primary)] shadow-xs'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-5 h-5 shrink-0" />
                      <div className="text-xs font-bold text-[var(--color-text-main)] truncate">{m.label}</div>
                    </div>
                    <div className="text-[11px] opacity-80 font-mono">{m.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Biga preferment share & hydration sliders */}
            {method === 'biga' && (
              <div className="pt-3 border-t border-[var(--color-border)] space-y-3">
                {/* Preferment Share Slider + Custom Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[var(--color-text-main)] block">
                        {t('calculator.prefermentPct')}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">
                        {t('calculator.bigaPrefermentHint')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={prefermentPct}
                        onChange={e => setPrefermentPct(Math.max(1, Math.min(100, Number(e.target.value) || 0)))}
                        className="w-14 px-2 py-0.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] font-mono font-bold text-xs text-right text-[var(--color-text-main)] focus:outline-hidden focus:ring-1 focus:ring-[var(--color-primary)]"
                      />
                      <span className="text-xs font-bold font-mono text-[var(--color-text-muted)]">%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={prefermentPct}
                      onChange={e => setPrefermentPct(Number(e.target.value))}
                      className="flex-1 accent-[var(--color-primary)] cursor-pointer"
                    />
                    <div className="flex items-center gap-1">
                      {[50, 70, 100].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setPrefermentPct(pct)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors border ${
                            prefermentPct === pct
                              ? 'bg-[var(--color-primary)] text-white border-transparent'
                              : 'bg-[var(--color-surface-subtle)] border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)]'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Biga Hydration Slider (45 - 60%, default 50%) */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--color-border)]/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[var(--color-text-main)] block">
                        {t('calculator.bigaHydration')}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">
                        {t('calculator.bigaHydrationDesc')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={40}
                        max={70}
                        value={bigaHydration}
                        onChange={e => setBigaHydration(Math.max(40, Math.min(70, Number(e.target.value) || 0)))}
                        className="w-14 px-2 py-0.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] font-mono font-bold text-xs text-right text-[var(--color-text-main)] focus:outline-hidden focus:ring-1 focus:ring-[var(--color-primary)]"
                      />
                      <span className="text-xs font-bold font-mono text-[var(--color-text-muted)]">%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={45}
                      max={60}
                      step={1}
                      value={bigaHydration}
                      onChange={e => setBigaHydration(Number(e.target.value))}
                      className="flex-1 accent-[var(--color-primary)] cursor-pointer"
                    />
                    <div className="flex items-center gap-1">
                      {[45, 50, 55, 60].map(h => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setBigaHydration(h)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors border ${
                            bigaHydration === h
                              ? 'bg-[var(--color-primary)] text-white border-transparent'
                              : 'bg-[var(--color-surface-subtle)] border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)]'
                          }`}
                        >
                          {h}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Poolish preferment share slider */}
            {method === 'poolish' && (
              <div className="pt-3 border-t border-[var(--color-border)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text-main)] block">
                      {t('calculator.prefermentPct')}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      {t('calculator.poolishPrefermentHint')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={prefermentPct}
                      onChange={e => setPrefermentPct(Math.max(1, Math.min(100, Number(e.target.value) || 0)))}
                      className="w-14 px-2 py-0.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] font-mono font-bold text-xs text-right text-[var(--color-text-main)] focus:outline-hidden focus:ring-1 focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-xs font-bold font-mono text-[var(--color-text-muted)]">%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={prefermentPct}
                    onChange={e => setPrefermentPct(Number(e.target.value))}
                    className="flex-1 accent-[var(--color-primary)] cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    {[20, 30, 50].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setPrefermentPct(pct)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors border ${
                          prefermentPct === pct
                            ? 'bg-[var(--color-primary)] text-white border-transparent'
                            : 'bg-[var(--color-surface-subtle)] border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)]'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Flour Selection & Top 3 Recommendations */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                02 • {t('calculator.sections.flour')}
              </span>
              <Link
                href="/flours"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                {t('calculator.manageFlours')}
              </Link>
            </div>

            {/* Top 3 Recommended Flours for Style */}
            {recommendedFlours.length > 0 && (
              <div className="p-2.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1.5">
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
                  ⭐ {t('calculator.topRecommendedFor', { style: presetName(activePreset.id) })}
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
                        {rf.name} {rf.wIndex ? `(W ${rf.wIndex})` : `(${t('calculator.glutenFree')})`}
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
                    {f.name} {f.brand ? `(${f.brand})` : ''} — {f.wIndex ? `W ${f.wIndex}` : t('calculator.glutenFree')} | P/L: {f.elasticityPL || '—'} | {t('calculator.protein')}: {f.proteinPercentage}%
                  </option>
                ))}
              </select>
            </div>

            {/* Flour Profile Quick Metrics */}
            {currentFlour && (
              <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block">{t('calculator.flourStats.strength')}</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    {currentFlour.wIndex ? `W ${currentFlour.wIndex}` : t('calculator.glutenFree')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block">{t('calculator.flourStats.elasticity')}</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    {currentFlour.elasticityPL || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block">{t('calculator.flourStats.hydration')}</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    {currentFlour.minHydration}–{currentFlour.maxHydration} %
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block">{t('calculator.flourStats.maturation')}</span>
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
              03 • {t('calculator.sections.quantities')}
            </span>

            {/* Pizzas Count */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[var(--color-text-main)]">
                  {t('calculator.pizzasCount')}
                </label>
                <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                  {pizzasCount} {t('common.pieces')}
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
                  {formatWeight(ballWeightGrams)}
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
              04 • {t('calculator.sections.yeast')}
            </span>

            {/* Yeast Type Buttons */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1.5">
                {t('calculator.yeastType')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'fresh', label: t('calculator.yeastShort.fresh'), sub: '1.0×' },
                  { id: 'instant_dry', label: t('calculator.yeastShort.instant_dry'), sub: '0.33×' },
                  { id: 'active_dry', label: t('calculator.yeastShort.active_dry'), sub: '0.5×' },
                  { id: 'sourdough', label: t('calculator.yeastShort.sourdough'), sub: '15 %' },
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
              05 • {t('calculator.sections.fermentation')}
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
                  <span className="text-xs font-mono text-[var(--color-text-muted)] whitespace-nowrap">{formatTemp(tempRoom)}</span>
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
                  <span className="text-xs text-[var(--color-text-muted)]">{t('common.hours')}</span>
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
                  <span className="text-xs text-[var(--color-text-muted)]">{t('common.hours')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 06: Oven type & baking */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                06 • {t('baking.title')}
              </span>
              <span className="text-xs font-mono font-bold text-[var(--color-text-main)]">
                {formatTemp(ovenTemp)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'home', label: t('calculator.ovens.home'), icon: PixelHomeOvenIcon, defTemp: 250, min: 200, max: 275, time: '6–8 min' },
                { id: 'dedicated', label: t('calculator.ovens.dedicated'), icon: PixelPizzaOvenIcon, defTemp: 430, min: 350, max: 470, time: '90–120 s' },
                { id: 'wood', label: t('calculator.ovens.wood'), icon: PixelWoodOvenIcon, defTemp: 485, min: 400, max: 500, time: '60–90 s' },
              ].map(o => {
                const isSelected = ovenType === o.id;
                const Icon = o.icon;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setOvenType(o.id as typeof ovenType);
                      setOvenTemp(o.defTemp);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] ring-1 ring-[var(--color-primary)] shadow-xs'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-5 h-5 shrink-0" />
                      <div className="text-xs font-bold text-[var(--color-text-main)] truncate">{o.label}</div>
                    </div>
                    <div className="text-[11px] font-mono text-[var(--color-text-muted)]">{o.time}</div>
                  </button>
                );
              })}
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--color-text-main)]">{t('baking.temperature')}</span>
                <span className="font-mono font-bold text-[var(--color-primary)]">{formatTemp(ovenTemp)}</span>
              </div>
              <input
                type="range"
                min={ovenType === 'home' ? 200 : ovenType === 'dedicated' ? 350 : 400}
                max={ovenType === 'home' ? 275 : ovenType === 'dedicated' ? 470 : 500}
                step={5}
                value={ovenTemp}
                onChange={e => setOvenTemp(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
            </div>

            {/* Baking Advice Box */}
            <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-xs space-y-1">
              <div className="font-bold text-[var(--color-text-main)] flex items-center justify-between">
                <span>⏱ {t('baking.bakeTime')}: {ovenType === 'home' ? '6–8 min' : ovenType === 'dedicated' ? '90–120 s' : '60–90 s'}</span>
                {ovenType === 'wood' && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    AVPN 2024
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                {ovenType === 'home'
                  ? t('baking.homeOvenDesc')
                  : ovenType === 'dedicated'
                  ? t('baking.pizzaOvenDesc')
                  : t('baking.woodOvenDesc')}
              </p>
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
                  {t('calculator.results.title')}
                </span>
                <h2 className="text-lg font-bold font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
                  {pizzasCount} × {formatWeight(ballWeightGrams)} = {formatWeight(result.ingredients.totalDoughGrams)}
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[var(--color-text-main)]">
                {hydrationPercentage} % {t('calculator.results.hydrShort')}
              </span>
            </div>

            {/* Preferment Two-Phase Breakdown (If Biga or Poolish) */}
            {result.preferment && (
              <div className="space-y-3 pb-2">
                {/* Phase 1 Box */}
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                      <PixelPhase1Icon className="w-4 h-4 shrink-0" />
                      <span>{t(result.preferment.phase1.title.key, result.preferment.phase1.title.params)}</span>
                    </span>
                    <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                      {result.preferment.phase1.hydrationPercentage} % {t('calculator.results.hydrShort')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('calculator.flour')}</span>
                      <strong className="text-[var(--color-text-main)]">{formatWeight(result.preferment.phase1.flourGrams)}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('calculator.water')}</span>
                      <strong className="text-[var(--color-text-main)]">{formatWeight(result.preferment.phase1.waterGrams)}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('calculator.results.yeast')}</span>
                      <strong className="text-[var(--color-text-main)]">{formatWeight(result.preferment.phase1.yeastGrams)}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-[var(--color-text-muted)] space-y-1 pt-1 border-t border-[var(--color-border)]">
                    <div>⏱ <strong>{t('calculator.results.maturation')}</strong> {t(result.preferment.phase1.fermentationSchedule.key)}</div>
                    <div>💡 <strong>{t('calculator.results.preparation')}</strong> {t(result.preferment.phase1.instructions.key)}</div>
                  </div>
                </div>

                {/* Phase 2 Box */}
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                      <PixelPhase2Icon className="w-4 h-4 shrink-0" />
                      <span>{t(result.preferment.phase2.title.key, result.preferment.phase2.title.params)}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('calculator.results.remainingFlour')}</span>
                      <strong className="text-[var(--color-text-main)]">{formatWeight(result.preferment.phase2.remainingFlourGrams)}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('calculator.results.remainingWater')}</span>
                      <strong className="text-[var(--color-text-main)]">{formatWeight(result.preferment.phase2.remainingWaterGrams)}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('calculator.salt')}</span>
                      <strong className="text-[var(--color-text-main)]">{formatWeight(result.preferment.phase2.saltGrams)}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-[var(--color-text-muted)] space-y-1 pt-1 border-t border-[var(--color-border)]">
                    <div>❄️ <strong>{t('calculator.results.temperature')}</strong> {t(result.preferment.phase2.waterTempAdvice.key)}</div>
                    <div>🥣 <strong>{t('calculator.results.method')}</strong> {t(result.preferment.phase2.instructions.key)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Total Batch Ingredients Table */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block mb-1">
                {t('calculator.results.totalSummary')}
              </span>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.flour')}</span>
                <span className="font-mono font-bold text-[var(--color-text-main)]">
                  {formatWeight(result.ingredients.flourGrams)} <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">100 %</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.water')}</span>
                <span className="font-mono font-bold text-[var(--color-text-main)]">
                  {formatWeight(result.ingredients.waterGrams)} <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">{hydrationPercentage} %</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.yeast')}</span>
                <span className="font-mono font-bold text-[var(--color-text-main)]">
                  {formatWeight(result.ingredients.yeastGrams)} <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">{result.percentages.yeast} %</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.salt')}</span>
                <span className="font-mono font-bold text-[var(--color-text-main)]">
                  {formatWeight(result.ingredients.saltGrams)} <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">{saltPercentage} %</span>
                </span>
              </div>

              {oilPercentage > 0 && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                  <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.oil')}</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    {formatWeight(result.ingredients.oilGrams)} <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">{oilPercentage} %</span>
                  </span>
                </div>
              )}

              {sugarPercentage > 0 && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                  <span className="font-semibold text-[var(--color-text-main)]">{t('calculator.sugar')}</span>
                  <span className="font-mono font-bold text-[var(--color-text-main)]">
                    {formatWeight(result.ingredients.sugarGrams)} <span className="text-[10px] text-[var(--color-text-muted)] font-normal ml-1">{sugarPercentage} %</span>
                  </span>
                </div>
              )}
            </div>

            {/* Warnings or Validation State */}
            {result.fermentation.warnings.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold block">{t('calculator.results.warningsTitle')}</span>
                {result.fermentation.warnings.map((warn, i) => (
                  <p key={i} className="leading-snug">
                    • {t(warn.key, warn.params)}
                  </p>
                ))}
              </div>
            )}

            {/* Fermentation Schedule Breakdown */}
            <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-[var(--color-text-main)]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>{t('calculator.results.schedule', { hours: hoursRoom + hoursCold })}</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-sans">{t('calculator.results.bulkRT')}</span>
                  <span className="font-bold text-[var(--color-text-main)]">
                    {result.fermentation.schedule.bulkHoursRT} h
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-sans">{t('calculator.results.fridgeCT')}</span>
                  <span className="font-bold text-[var(--color-text-main)]">
                    {result.fermentation.schedule.coldHoursCT} h
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-sans">{t('calculator.results.ballsRT')}</span>
                  <span className="font-bold text-[var(--color-text-main)]">
                    {result.fermentation.schedule.ballProofHoursRT} h
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button: Save as Dough Formula */}
            <Link
              href={`/doughs?save=true&name=${encodeURIComponent(
                `${presetName(activePreset.id)} (${hydrationPercentage} %)`
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
