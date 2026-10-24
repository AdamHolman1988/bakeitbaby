'use client';

import * as React from 'react';
import { useSettings, TemperatureUnit, MeasurementSystem } from '@/context/settings-context';
import { useAppLocale } from '@/context/locale-context';
import { Settings as SettingsIcon, X, Thermometer, Scale } from 'lucide-react';

export function SettingsModal() {
  const [open, setOpen] = React.useState(false);
  const { tempUnit, setTempUnit, weightUnit, setWeightUnit } = useSettings();
  const { t } = useAppLocale();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
        title={t('settings.title')}
        aria-label="Settings"
      >
        <SettingsIcon className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl p-5 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--color-primary)] text-white shadow-xs">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
                    {t('settings.title')}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Temperature Unit */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5" />
                <span>{t('settings.tempUnit')}</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'celsius', label: t('settings.celsius'), desc: 'Tradiční evropský standard pro pečení' },
                  { id: 'fahrenheit', label: t('settings.fahrenheit'), desc: 'Americké a britské receptury' },
                  { id: 'kelvin', label: t('settings.kelvin'), desc: '273.15 K = 0 °C (pro fyziky a pizza geeks)' },
                ].map(item => {
                  const active = tempUnit === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTempUnit(item.id as TemperatureUnit)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        active
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface-subtle)] ring-1 ring-[var(--color-primary)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[var(--color-text-main)]">{item.label}</div>
                      <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weight Measurement Unit */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>{t('settings.weightUnit')}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'metric', label: t('settings.metric'), sub: 'Gramy & Kilogramy' },
                  { id: 'imperial', label: t('settings.imperial'), sub: 'Unce & Libry (oz / lbs)' },
                ].map(item => {
                  const active = weightUnit === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setWeightUnit(item.id as MeasurementSystem)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        active
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface-subtle)] ring-1 ring-[var(--color-primary)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[var(--color-text-main)]">{item.label}</div>
                      <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{item.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[var(--color-border)] flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
