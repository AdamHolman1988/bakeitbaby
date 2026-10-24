'use client';

import * as React from 'react';
import { useAppLocale } from '@/context/locale-context';
import { DoughItem, PRESET_DOUGHS } from '@/types/dough';
import { fetchDoughs, saveDough, deleteDough } from '@/services/dough-service';
import { Search, Plus, Edit2, Trash2, Calculator, ChevronDown, ChevronUp, ChefHat } from 'lucide-react';
import Link from 'next/link';

export default function DoughsPage() {
  const { t, locale } = useAppLocale();
  const styleLabel = (style: string) => {
    const key = `doughs.style.${style}`;
    const label = t(key);
    return label === key ? style : label;
  };
  const [doughs, setDoughs] = React.useState<DoughItem[]>(PRESET_DOUGHS);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [styleFilter, setStyleFilter] = React.useState('all');
  const [expandedId, setExpandedId] = React.useState<number | null>(1);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingDough, setEditingDough] = React.useState<DoughItem | null>(null);

  // Form State
  const [formName, setFormName] = React.useState('');
  const [formDescription, setFormDescription] = React.useState('');
  const [formStyle, setFormStyle] = React.useState('neapolitan');
  const [formMethod, setFormMethod] = React.useState<DoughItem['prefermentType']>('direct');
  const [formPrefPct, setFormPrefPct] = React.useState(0);
  const [formBalls, setFormBalls] = React.useState(4);
  const [formWeight, setFormWeight] = React.useState(260);
  const [formHydration, setFormHydration] = React.useState(65);
  const [formSalt, setFormSalt] = React.useState(2.8);
  const [formYeast, setFormYeast] = React.useState(0.15);
  const [formYeastType, setFormYeastType] = React.useState('fresh');
  const [formOil, setFormOil] = React.useState(0);
  const [formSugar, setFormSugar] = React.useState(0);
  const [formRt, setFormRt] = React.useState(8);
  const [formCt, setFormCt] = React.useState(16);
  const [formFlourName, setFormFlourName] = React.useState('Caputo Pizzeria Tipo 00');
  const [formInstructionsText, setFormInstructionsText] = React.useState('');

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const data = await fetchDoughs(searchTerm, styleFilter, locale);
    setDoughs(data);
    setLoading(false);
  }, [searchTerm, styleFilter, locale]);

  React.useEffect(() => {
    loadData();

    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('save') === 'true') {
        setEditingDough(null);
        setFormName(p.get('name') || t('doughs.defaults.newName'));
        setFormHydration(Number(p.get('hydration')) || 65);
        setFormBalls(Number(p.get('pizzas')) || 4);
        setFormWeight(Number(p.get('weight')) || 260);
        setFormSalt(Number(p.get('salt')) || 2.8);
        setFormOil(Number(p.get('oil')) || 0);
        setFormSugar(Number(p.get('sugar')) || 0);
        setFormRt(Number(p.get('rt')) || 8);
        setFormCt(Number(p.get('ct')) || 16);
        setFormMethod((p.get('method') as DoughItem['prefermentType'] | null) || 'direct');
        setFormPrefPct(Number(p.get('pref')) || 0);
        setFormStyle(p.get('style') || 'neapolitan');
        setFormFlourName(t('doughs.defaults.recommendedFlour'));
        setFormInstructionsText(t('doughs.defaults.instructionsFromCalculator'));
        setModalOpen(true);
      }
    }
  }, [loadData, t]);

  const openAddModal = () => {
    setEditingDough(null);
    setFormName('');
    setFormDescription('');
    setFormStyle('neapolitan');
    setFormMethod('direct');
    setFormPrefPct(0);
    setFormBalls(4);
    setFormWeight(260);
    setFormHydration(65);
    setFormSalt(2.8);
    setFormYeast(0.15);
    setFormYeastType('fresh');
    setFormOil(0);
    setFormSugar(0);
    setFormRt(8);
    setFormCt(16);
    setFormFlourName('Caputo Pizzeria Tipo 00');
    setFormInstructionsText(t('doughs.defaults.instructions'));
    setModalOpen(true);
  };

  const openEditModal = (dough: DoughItem) => {
    setEditingDough(dough);
    setFormName(dough.name);
    setFormDescription(dough.description || '');
    setFormStyle(dough.pizzaStyle);
    setFormMethod(dough.prefermentType);
    setFormPrefPct(dough.prefermentPercentage || 0);
    setFormBalls(dough.doughBallsCount);
    setFormWeight(dough.ballWeightGrams);
    setFormHydration(dough.hydrationPercentage);
    setFormSalt(dough.saltPercentage);
    setFormYeast(dough.yeastPercentage);
    setFormYeastType(dough.yeastType);
    setFormOil(dough.oilPercentage);
    setFormSugar(dough.sugarPercentage);
    setFormRt(dough.fermentationRtHours);
    setFormCt(dough.fermentationCtHours);
    setFormFlourName(dough.flourName || '');
    setFormInstructionsText((dough.instructions || []).join('\n'));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const instructions = formInstructionsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const payload: Partial<DoughItem> = {
      id: editingDough ? editingDough.id : undefined,
      name: formName,
      description: formDescription,
      pizzaStyle: formStyle,
      prefermentType: formMethod,
      prefermentPercentage: Number(formPrefPct),
      doughBallsCount: Number(formBalls),
      ballWeightGrams: Number(formWeight),
      hydrationPercentage: Number(formHydration),
      saltPercentage: Number(formSalt),
      yeastPercentage: Number(formYeast),
      yeastType: formYeastType,
      oilPercentage: Number(formOil),
      sugarPercentage: Number(formSugar),
      fermentationRtHours: Number(formRt),
      fermentationCtHours: Number(formCt),
      flourName: formFlourName,
      instructions,
    };

    await saveDough(payload, locale);
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm(t('common.confirmDelete'))) {
      await deleteDough(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
            {t('doughs.title')}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {t('doughs.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-contrast)] font-semibold text-sm shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('doughs.addDough')}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('doughs.search')}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-1 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-subtle)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: t('doughs.style.all') },
            { id: 'neapolitan', label: t('doughs.style.neapolitan') },
            { id: 'canotto', label: t('doughs.style.canotto') },
            { id: 'roman_crispy', label: t('doughs.style.roman_crispy') },
            { id: 'glutenfree', label: t('doughs.style.glutenfree') },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStyleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                styleFilter === tab.id
                  ? 'bg-[var(--color-primary)] text-white border-transparent'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dough Cards List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
          {t('common.loading')}
        </div>
      ) : doughs.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-[var(--color-border)] p-8">
          <ChefHat className="w-10 h-10 mx-auto text-[var(--color-text-muted)] mb-2" />
          <p className="text-sm font-semibold text-[var(--color-text-main)]">{t('doughs.empty')}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('doughs.emptyHint')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {doughs.map(dough => {
            const isExpanded = expandedId === dough.id;
            return (
              <div
                key={dough.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-xs transition-colors"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : dough.id)}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--color-surface-subtle)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-primary)] border border-[var(--color-border)]">
                      <ChefHat className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--color-text-main)] font-[family-name:var(--font-outfit)]">
                        {dough.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mt-0.5">
                        <span>{styleLabel(dough.pizzaStyle)}</span>
                        <span>•</span>
                        <span className="font-mono font-semibold text-[var(--color-primary)]">
                          {dough.prefermentType === 'direct' ? t('calculator.methods.direct') : dough.prefermentType.toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>{dough.doughBallsCount} × {dough.ballWeightGrams} g</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[var(--color-text-main)]">
                      {dough.hydrationPercentage} % {t('calculator.results.hydrShort')}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-3.5 text-xs">
                    {dough.description && (
                      <p className="text-[var(--color-text-muted)] leading-relaxed">
                        {dough.description}
                      </p>
                    )}

                    {/* Baker's percentages bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center font-mono">
                      <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('doughs.stats.hydration')}</span>
                        <strong className="text-[var(--color-text-main)]">{dough.hydrationPercentage} %</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('doughs.stats.salt')}</span>
                        <strong className="text-[var(--color-text-main)]">{dough.saltPercentage} %</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('doughs.stats.yeast')}</span>
                        <strong className="text-[var(--color-text-main)]">{dough.yeastPercentage} %</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('doughs.stats.oil')}</span>
                        <strong className="text-[var(--color-text-main)]">{dough.oilPercentage} %</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('doughs.stats.rt')}</span>
                        <strong className="text-[var(--color-text-main)]">{dough.fermentationRtHours} h</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[10px] text-[var(--color-text-muted)] font-sans block">{t('doughs.stats.ct')}</span>
                        <strong className="text-[var(--color-text-main)]">{dough.fermentationCtHours} h</strong>
                      </div>
                    </div>

                    {/* Instructions */}
                    {dough.instructions && dough.instructions.length > 0 && (
                      <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1.5">
                        <span className="font-semibold text-[var(--color-text-main)] block">
                          {t('doughs.instructionsTitle')}
                        </span>
                        <ol className="list-decimal list-inside space-y-1 text-[var(--color-text-muted)] leading-relaxed">
                          {dough.instructions.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(dough)}
                          className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] font-semibold cursor-pointer text-[var(--color-text-main)]"
                        >
                          <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                          {t('common.edit')}
                        </button>
                        {!dough.isPreset && (
                          <button
                            type="button"
                            onClick={() => handleDelete(dough.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                            {t('common.delete')}
                          </button>
                        )}
                      </div>

                      <Link
                        href={`/?hydration=${dough.hydrationPercentage}&pizzas=${dough.doughBallsCount}&weight=${dough.ballWeightGrams}&salt=${dough.saltPercentage}&oil=${dough.oilPercentage}&sugar=${dough.sugarPercentage}&rt=${dough.fermentationRtHours}&ct=${dough.fermentationCtHours}&method=${dough.prefermentType}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer shadow-xs"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>{t('doughs.openInCalculator')}</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dough Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl space-y-4 my-8">
            <h3 className="text-base font-bold font-[family-name:var(--font-outfit)] text-[var(--color-text-main)] pb-2 border-b border-[var(--color-border)]">
              {editingDough ? t('doughs.editDough') : t('doughs.addDough')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                  {t('doughs.form.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder={t('doughs.form.namePlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('doughs.form.style')}
                  </label>
                  <select
                    value={formStyle}
                    onChange={e => setFormStyle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] cursor-pointer"
                  >
                    <option value="neapolitan">{t('doughs.style.neapolitan')}</option>
                    <option value="canotto">{t('doughs.style.canotto')}</option>
                    <option value="roman_crispy">{t('doughs.style.roman_crispy')}</option>
                    <option value="glutenfree">{t('doughs.style.glutenfree')}</option>
                    <option value="focaccia">{t('doughs.style.focaccia')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('doughs.form.method')}
                  </label>
                  <select
                    value={formMethod}
                    onChange={e => setFormMethod(e.target.value as DoughItem['prefermentType'])}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] cursor-pointer"
                  >
                    <option value="direct">{t('calculator.methods.direct')}</option>
                    <option value="biga">Biga</option>
                    <option value="poolish">Poolish</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('calculator.hydration')}
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={formHydration}
                    onChange={e => setFormHydration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('doughs.form.balls')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formBalls}
                    onChange={e => setFormBalls(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('calculator.ballWeight')}
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={1000}
                    value={formWeight}
                    onChange={e => setFormWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('calculator.saltPercentage')}
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    value={formSalt}
                    onChange={e => setFormSalt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('doughs.form.rt')}
                  </label>
                  <input
                    type="number"
                    value={formRt}
                    onChange={e => setFormRt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('doughs.form.ct')}
                  </label>
                  <input
                    type="number"
                    value={formCt}
                    onChange={e => setFormCt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                  {t('doughs.form.description')}
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder={t('doughs.form.descriptionPlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                  {t('doughs.form.instructions')}
                </label>
                <textarea
                  rows={4}
                  value={formInstructionsText}
                  onChange={e => setFormInstructionsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
