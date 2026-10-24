'use client';

import * as React from 'react';
import { useAppLocale } from '@/context/locale-context';
import { FlourItem, PRESET_FLOURS } from '@/types/flour';
import { fetchFlours, saveFlour, deleteFlour } from '@/services/flour-service';
import { Search, Plus, Edit2, Trash2, Wheat, Eye, X, Check, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

export default function FloursPage() {
  const { t } = useAppLocale();
  const [flours, setFlours] = React.useState<FlourItem[]>(PRESET_FLOURS);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [strengthFilter, setStrengthFilter] = React.useState<string>('all');

  // Modals
  const [modalOpen, setModalOpen] = React.useState(false);
  const [detailModalFlour, setDetailModalFlour] = React.useState<FlourItem | null>(null);
  const [editingFlour, setEditingFlour] = React.useState<FlourItem | null>(null);

  // Form state
  const [formName, setFormName] = React.useState('');
  const [formBrand, setFormBrand] = React.useState('');
  const [formWIndex, setFormWIndex] = React.useState<number | ''>(260);
  const [formWRangeMax, setFormWRangeMax] = React.useState<number | ''>('');
  const [formElasticity, setFormElasticity] = React.useState('0.50–0.60');
  const [formProtein, setFormProtein] = React.useState(12.5);
  const [formType, setFormType] = React.useState('tipo_00');
  const [formMinHydration, setFormMinHydration] = React.useState(55);
  const [formMaxHydration, setFormMaxHydration] = React.useState(65);
  const [formFermentation, setFormFermentation] = React.useState('8–14 h (RT)');
  const [formNotes, setFormNotes] = React.useState('');
  const [formShowInCalculator, setFormShowInCalculator] = React.useState(true);
  const [formIsGlutenFree, setFormIsGlutenFree] = React.useState(false);
  const [formRecommendedStyles, setFormRecommendedStyles] = React.useState<string[]>([]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const data = await fetchFlours(searchTerm, strengthFilter);
    setFlours(data);
    setLoading(false);
  }, [searchTerm, strengthFilter]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddModal = () => {
    setEditingFlour(null);
    setFormName('');
    setFormBrand('');
    setFormWIndex(260);
    setFormWRangeMax('');
    setFormElasticity('0.50–0.60');
    setFormProtein(12.5);
    setFormType('tipo_00');
    setFormMinHydration(55);
    setFormMaxHydration(65);
    setFormFermentation('8–14 h (RT)');
    setFormNotes('');
    setFormShowInCalculator(true);
    setFormIsGlutenFree(false);
    setFormRecommendedStyles([]);
    setModalOpen(true);
  };

  const openEditModal = (flour: FlourItem) => {
    setEditingFlour(flour);
    setFormName(flour.name);
    setFormBrand(flour.brand || '');
    setFormWIndex(flour.wIndex ?? '');
    setFormWRangeMax(flour.wRangeMax ?? '');
    setFormElasticity(flour.elasticityPL || '');
    setFormProtein(flour.proteinPercentage);
    setFormType(flour.flourType);
    setFormMinHydration(flour.minHydration);
    setFormMaxHydration(flour.maxHydration);
    setFormFermentation(flour.recommendedFermentationHours);
    setFormNotes(flour.usageNotes || '');
    setFormShowInCalculator(flour.showInCalculator !== false);
    setFormIsGlutenFree(flour.isGlutenFree || false);
    setFormRecommendedStyles(flour.recommendedForStyles || []);
    setModalOpen(true);
  };

  const toggleCalculatorVisibility = async (flour: FlourItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedStatus = !flour.showInCalculator;
    // optimistic update
    setFlours(prev =>
      prev.map(f => (f.id === flour.id ? { ...f, showInCalculator: updatedStatus } : f))
    );
    try {
      await saveFlour({ id: flour.id, showInCalculator: updatedStatus });
    } catch {
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<FlourItem> = {
      id: editingFlour ? editingFlour.id : undefined,
      name: formName,
      brand: formBrand,
      wIndex: formWIndex !== '' ? Number(formWIndex) : null,
      wRangeMax: formWRangeMax !== '' ? Number(formWRangeMax) : null,
      elasticityPL: formElasticity,
      proteinPercentage: Number(formProtein),
      flourType: formType,
      minHydration: Number(formMinHydration),
      maxHydration: Number(formMaxHydration),
      recommendedFermentationHours: formFermentation,
      usageNotes: formNotes,
      showInCalculator: formShowInCalculator,
      isGlutenFree: formIsGlutenFree,
      recommendedForStyles: formRecommendedStyles,
    };

    await saveFlour(payload);
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('common.confirmDelete'))) {
      await deleteFlour(id);
      loadData();
    }
  };

  const getStrengthBadge = (flour: FlourItem) => {
    if (flour.isGlutenFree || flour.wIndex === null) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[var(--color-badge-glutenfree-bg)] text-[var(--color-badge-glutenfree-text)]">
          {t('calculator.glutenFree')}
        </span>
      );
    }
    const cat = flour.strengthCategory;
    const styles: Record<string, string> = {
      weak: 'bg-[var(--color-badge-weak-bg)] text-[var(--color-badge-weak-text)]',
      medium: 'bg-[var(--color-badge-medium-bg)] text-[var(--color-badge-medium-text)]',
      strong: 'bg-[var(--color-badge-strong-bg)] text-[var(--color-badge-strong-text)]',
      manitoba: 'bg-[var(--color-badge-manitoba-bg)] text-[var(--color-badge-manitoba-text)]',
    };
    const rangeText = flour.wRangeMax ? `${flour.wIndex}–${flour.wRangeMax}` : `${flour.wIndex}`;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${styles[cat] || styles.medium}`}>
        W {rangeText}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
            {t('flours.title')}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {t('flours.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-contrast)] font-semibold text-sm shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('flours.addFlour')}</span>
        </button>
      </div>

      {/* Dough Strength Summary Reference Bar */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[var(--color-text-muted)]">
          <Info className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>{t('flours.reference.title')}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-[var(--color-surface-subtle)]">
            <span className="font-mono font-bold text-[var(--color-text-main)] block">W 160–200</span>
            <span className="text-[11px] text-[var(--color-text-muted)]">{t('flours.reference.weak')}</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--color-surface-subtle)]">
            <span className="font-mono font-bold text-[var(--color-text-main)] block">W 220–260</span>
            <span className="text-[11px] text-[var(--color-text-muted)]">{t('flours.reference.medium')}</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--color-surface-subtle)]">
            <span className="font-mono font-bold text-[var(--color-text-main)] block">W 270–310</span>
            <span className="text-[11px] text-[var(--color-text-muted)]">{t('flours.reference.strong')}</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--color-surface-subtle)]">
            <span className="font-mono font-bold text-[var(--color-text-main)] block">W 320–380+</span>
            <span className="text-[11px] text-[var(--color-text-muted)]">{t('flours.reference.manitoba')}</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--color-surface-subtle)]">
            <span className="font-mono font-bold text-[var(--color-text-main)] block">{t('flours.strength.gluten_free')}</span>
            <span className="text-[11px] text-[var(--color-text-muted)]">{t('flours.reference.glutenFree')}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('flours.search')}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-1 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-subtle)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: t('flours.allStrengths') },
            { id: 'weak', label: 'W 160–200' },
            { id: 'medium', label: 'W 220–260' },
            { id: 'strong', label: 'W 270–310' },
            { id: 'manitoba', label: 'W 320–380+' },
            { id: 'gluten_free', label: t('flours.strength.gluten_free') },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStrengthFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                strengthFilter === tab.id
                  ? 'bg-[var(--color-primary)] text-white border-transparent'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flours Table: Single row per flour */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-xs font-semibold text-[var(--color-text-muted)]">
                <th className="py-3 px-4">{t('flours.columns.name')}</th>
                <th className="py-3 px-3">{t('flours.columns.type')}</th>
                <th className="py-3 px-3">{t('flours.columns.wIndex')}</th>
                <th className="py-3 px-3">{t('flours.columns.elasticity')}</th>
                <th className="py-3 px-3">{t('flours.columns.protein')}</th>
                <th className="py-3 px-3">{t('flours.columns.hydration')}</th>
                <th className="py-3 px-3">{t('flours.columns.fermentation')}</th>
                <th className="py-3 px-3 text-center">{t('flours.columns.inCalculator')}</th>
                <th className="py-3 px-4 text-right">{t('flours.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[var(--color-text-muted)]">
                    {t('common.loading')}
                  </td>
                </tr>
              ) : flours.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[var(--color-text-muted)]">
                    {t('flours.empty')}
                  </td>
                </tr>
              ) : (
                flours.map(flour => (
                  <tr
                    key={flour.id}
                    onClick={() => setDetailModalFlour(flour)}
                    className="hover:bg-[var(--color-surface-subtle)] cursor-pointer transition-colors group"
                  >
                    {/* Name & Brand */}
                    <td className="py-3 px-4 font-semibold text-[var(--color-text-main)]">
                      <div>
                        <span className="font-bold">{flour.name}</span>
                        {flour.brand && (
                          <span className="block text-xs font-normal text-[var(--color-text-muted)]">
                            {flour.brand}
                          </span>
                        )}
                        {flour.recommendedForStyles && flour.recommendedForStyles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {flour.recommendedForStyles.map(st => (
                              <span
                                key={st}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                              >
                                ⭐ {t(`flours.styleTags.${st}`)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-3 text-xs text-[var(--color-text-muted)] font-mono">
                      {flour.flourType}
                    </td>

                    {/* W Index */}
                    <td className="py-3 px-3">
                      {getStrengthBadge(flour)}
                    </td>

                    {/* Elasticity P/L */}
                    <td className="py-3 px-3 text-xs font-mono text-[var(--color-text-main)]">
                      {flour.elasticityPL || '—'}
                    </td>

                    {/* Protein */}
                    <td className="py-3 px-3 text-xs font-mono font-medium text-[var(--color-text-main)]">
                      {flour.proteinPercentage} %
                    </td>

                    {/* Hydration */}
                    <td className="py-3 px-3 text-xs font-mono font-medium text-[var(--color-text-main)]">
                      {flour.minHydration}–{flour.maxHydration} %
                    </td>

                    {/* Fermentation */}
                    <td className="py-3 px-3 text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                      {flour.recommendedFermentationHours}
                    </td>

                    {/* inCalculator toggle switch */}
                    <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={e => toggleCalculatorVisibility(flour, e)}
                        className={`inline-flex items-center justify-center w-8 h-5 rounded-full transition-colors cursor-pointer relative ${
                          flour.showInCalculator !== false
                            ? 'bg-[var(--color-primary)]'
                            : 'bg-zinc-300 dark:bg-zinc-700'
                        }`}
                        title={flour.showInCalculator !== false ? t('flours.shownInCalculator') : t('flours.hiddenInCalculator')}
                      >
                        <span
                          className={`inline-block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                            flour.showInCalculator !== false ? 'translate-x-1.5' : '-translate-x-1.5'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailModalFlour(flour)}
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                          title={t('common.detail')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(flour)}
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                          title={t('common.edit')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {!flour.isPreset && (
                          <button
                            type="button"
                            onClick={e => handleDelete(flour.id, e)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flour Detail Modal (extended notes) */}
      {detailModalFlour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-[var(--color-border)]">
              <div>
                {detailModalFlour.brand && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block">
                    {detailModalFlour.brand}
                  </span>
                )}
                <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
                  {detailModalFlour.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalFlour(null)}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-text-muted)] block font-semibold">{t('flours.detail.strength')}</span>
                <span className="font-mono font-bold text-sm text-[var(--color-text-main)]">
                  {detailModalFlour.wIndex ? `W ${detailModalFlour.wIndex}` : t('calculator.glutenFree')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-text-muted)] block font-semibold">{t('calculator.flourStats.elasticity')}</span>
                <span className="font-mono font-bold text-sm text-[var(--color-text-main)]">
                  {detailModalFlour.elasticityPL || 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-text-muted)] block font-semibold">{t('calculator.protein')}</span>
                <span className="font-mono font-bold text-sm text-[var(--color-text-main)]">
                  {detailModalFlour.proteinPercentage} %
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-text-muted)] block font-semibold">{t('calculator.flourStats.hydration')}</span>
                <span className="font-mono font-bold text-sm text-[var(--color-text-main)]">
                  {detailModalFlour.minHydration}–{detailModalFlour.maxHydration} %
                </span>
              </div>
            </div>

            {/* Fermentation and details */}
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                <span className="text-xs font-semibold text-[var(--color-text-muted)] block mb-0.5">
                  {t('flours.detail.fermentation')}
                </span>
                <span className="font-bold text-[var(--color-text-main)]">
                  {detailModalFlour.recommendedFermentationHours}
                </span>
              </div>

              {detailModalFlour.usageNotes && (
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] block">
                    {t('flours.detail.notes')}
                  </span>
                  <p className="text-xs text-[var(--color-text-main)] leading-relaxed">
                    {detailModalFlour.usageNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer action */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setDetailModalFlour(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              >
                {t('common.close')}
              </button>

              <Link
                href={`/?flourId=${detailModalFlour.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>{t('flours.detail.useInCalculator')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Flour Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
                {editingFlour ? t('flours.editFlour') : t('flours.addFlour')}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('flours.modal.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder={t('flours.modal.namePlaceholder')}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('flours.modal.brand')}
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    placeholder={t('flours.modal.brandPlaceholder')}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('flours.modal.wIndex')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={formWIndex}
                    onChange={e => setFormWIndex(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="260"
                    disabled={formIsGlutenFree}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('flours.modal.elasticity')}
                  </label>
                  <input
                    type="text"
                    value={formElasticity}
                    onChange={e => setFormElasticity(e.target.value)}
                    placeholder="0.50–0.60"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('flours.modal.protein')} *
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    min={1}
                    max={25}
                    required
                    value={formProtein}
                    onChange={e => setFormProtein(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('flours.modal.flourType')}
                  </label>
                  <input
                    type="text"
                    value={formType}
                    onChange={e => setFormType(e.target.value)}
                    placeholder="tipo_00"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    Min. hydratace (%)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={formMinHydration}
                    onChange={e => setFormMinHydration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    Max. hydratace (%)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={formMaxHydration}
                    onChange={e => setFormMaxHydration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                  {t('flours.modal.fermentationHours')}
                </label>
                <input
                  type="text"
                  value={formFermentation}
                  onChange={e => setFormFermentation(e.target.value)}
                  placeholder={t('flours.modal.fermentationPlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                  {t('flours.modal.usageNotes')}
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder={t('flours.modal.notesPlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-text-main)] mb-1.5">
                  ⭐ {t('flours.modal.recommendedFor')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'neapolitan', label: `🍕 ${t('calculator.presets.neapolitan')}` },
                    { id: 'contemporary', label: `☁️ ${t('calculator.presets.contemporary')}` },
                    { id: 'roman_pan', label: `🥖 ${t('calculator.presets.roman_pan')}` },
                    { id: 'gluten_free', label: `🌾 ${t('calculator.presets.gluten_free')}` },
                    { id: 'quick_direct', label: `⚡ ${t('calculator.presets.quick_direct')}` },
                  ].map(style => {
                    const active = formRecommendedStyles.includes(style.id);
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          setFormRecommendedStyles(prev =>
                            active ? prev.filter(s => s !== style.id) : [...prev, style.id]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                          active
                            ? 'bg-[var(--color-primary)] text-white border-transparent shadow-xs'
                            : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
                        }`}
                      >
                        {style.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Checkboxes: inCalculator & isGlutenFree */}
              <div className="flex flex-col sm:flex-row gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[var(--color-text-main)]">
                  <input
                    type="checkbox"
                    checked={formShowInCalculator}
                    onChange={e => setFormShowInCalculator(e.target.checked)}
                    className="rounded-sm accent-[var(--color-primary)]"
                  />
                  <span>{t('flours.modal.showInCalculator')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-[var(--color-text-main)]">
                  <input
                    type="checkbox"
                    checked={formIsGlutenFree}
                    onChange={e => {
                      setFormIsGlutenFree(e.target.checked);
                      if (e.target.checked) setFormWIndex('');
                    }}
                    className="rounded-sm accent-[var(--color-primary)]"
                  />
                  <span>{t('flours.modal.isGlutenFree')}</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                >
                  {t('flours.modal.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer"
                >
                  {t('flours.modal.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
