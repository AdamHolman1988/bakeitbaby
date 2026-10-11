'use client';

import * as React from 'react';
import { useAppLocale } from '@/context/locale-context';
import { FlourItem } from '@/types/flour';
import { fetchFlours, saveFlour, deleteFlour } from '@/services/flour-service';
import { Search, Plus, Edit2, Trash2, Wheat, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import Link from 'next/link';

export default function FloursPage() {
  const { t } = useAppLocale();
  const [flours, setFlours] = React.useState<FlourItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [strengthFilter, setStrengthFilter] = React.useState<string>('all');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingFlour, setEditingFlour] = React.useState<FlourItem | null>(null);

  // Form state
  const [formName, setFormName] = React.useState('');
  const [formBrand, setFormBrand] = React.useState('');
  const [formWIndex, setFormWIndex] = React.useState(260);
  const [formWRangeMax, setFormWRangeMax] = React.useState<number | ''>('');
  const [formProtein, setFormProtein] = React.useState(12.5);
  const [formType, setFormType] = React.useState('tipo_00');
  const [formMinHydration, setFormMinHydration] = React.useState(55);
  const [formMaxHydration, setFormMaxHydration] = React.useState(65);
  const [formFermentation, setFormFermentation] = React.useState('8–14 h (RT)');
  const [formNotes, setFormNotes] = React.useState('');

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
    setFormProtein(12.5);
    setFormType('tipo_00');
    setFormMinHydration(55);
    setFormMaxHydration(65);
    setFormFermentation('8–14 h (RT)');
    setFormNotes('');
    setModalOpen(true);
  };

  const openEditModal = (flour: FlourItem) => {
    setEditingFlour(flour);
    setFormName(flour.name);
    setFormBrand(flour.brand || '');
    setFormWIndex(flour.wIndex);
    setFormWRangeMax(flour.wRangeMax || '');
    setFormProtein(flour.proteinPercentage);
    setFormType(flour.flourType);
    setFormMinHydration(flour.minHydration);
    setFormMaxHydration(flour.maxHydration);
    setFormFermentation(flour.recommendedFermentationHours);
    setFormNotes(flour.usageNotes || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<FlourItem> = {
      id: editingFlour ? editingFlour.id : undefined,
      name: formName,
      brand: formBrand,
      wIndex: Number(formWIndex),
      wRangeMax: formWRangeMax !== '' ? Number(formWRangeMax) : null,
      proteinPercentage: Number(formProtein),
      flourType: formType,
      minHydration: Number(formMinHydration),
      maxHydration: Number(formMaxHydration),
      recommendedFermentationHours: formFermentation,
      usageNotes: formNotes,
    };

    await saveFlour(payload);
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm(t('common.confirmDelete'))) {
      await deleteFlour(id);
      loadData();
    }
  };

  const getStrengthBadgeClass = (category: string) => {
    switch (category) {
      case 'weak':
        return 'bg-[var(--color-badge-weak-bg)] text-[var(--color-badge-weak-text)] border-slate-300 dark:border-slate-700';
      case 'medium':
        return 'bg-[var(--color-badge-medium-bg)] text-[var(--color-badge-medium-text)] border-amber-300 dark:border-amber-700';
      case 'strong':
        return 'bg-[var(--color-badge-strong-bg)] text-[var(--color-badge-strong-text)] border-orange-300 dark:border-orange-800';
      case 'manitoba':
        return 'bg-[var(--color-badge-manitoba-bg)] text-[var(--color-badge-manitoba-text)] border-emerald-300 dark:border-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-contrast)] font-semibold text-sm shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('flours.addFlour')}</span>
        </button>
      </div>

      {/* Dough Strength Reference Table (Fresh Loaf / SFBI Standard) */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
          <Info className="w-4 h-4" />
          <span>Referenční tabulka síly mouk (W Index & Fermentace)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-[var(--color-text-main)]">W 160–200</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[var(--color-badge-weak-bg)] text-[var(--color-badge-weak-text)]">Slabá</span>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1.5 space-y-0.5">
              <div>💧 Hydratace: <strong className="text-[var(--color-text-main)]">50–55 %</strong></div>
              <div>⏱ Čas: <strong className="text-[var(--color-text-main)]">2–4 h (RT)</strong></div>
              <div className="text-[11px] opacity-80 pt-1">Sušenky, grissini, rychlá těsta</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-[var(--color-text-main)]">W 220–260</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[var(--color-badge-medium-bg)] text-[var(--color-badge-medium-text)]">Střední</span>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1.5 space-y-0.5">
              <div>💧 Hydratace: <strong className="text-[var(--color-text-main)]">55–60 %</strong></div>
              <div>⏱ Čas: <strong className="text-[var(--color-text-main)]">8–14 h (RT)</strong></div>
              <div className="text-[11px] opacity-80 pt-1">Rychlejší pizza na stejný den, přímé těsto</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-[var(--color-text-main)]">W 270–310</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[var(--color-badge-strong-bg)] text-[var(--color-badge-strong-text)]">Silná</span>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1.5 space-y-0.5">
              <div>💧 Hydratace: <strong className="text-[var(--color-text-main)]">60–70 %</strong></div>
              <div>⏱ Čas: <strong className="text-[var(--color-text-main)]">24–48 h (chlad)</strong></div>
              <div className="text-[11px] opacity-80 pt-1">Klasická neapolská pizza, focaccia</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-[var(--color-text-main)]">W 320–380+</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[var(--color-badge-manitoba-bg)] text-[var(--color-badge-manitoba-text)]">Manitoba</span>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1.5 space-y-0.5">
              <div>💧 Hydratace: <strong className="text-[var(--color-text-main)]">70–85+ %</strong></div>
              <div>⏱ Čas: <strong className="text-[var(--color-text-main)]">48–72 h (chlad)</strong></div>
              <div className="text-[11px] opacity-80 pt-1">Biga, poolish, hydratace 75 %+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Strength Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('flours.search')}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-subtle)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: t('flours.allStrengths') },
            { id: 'weak', label: 'W 160–200' },
            { id: 'medium', label: 'W 220–260' },
            { id: 'strong', label: 'W 270–310' },
            { id: 'manitoba', label: 'W 320–380+' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStrengthFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                strengthFilter === tab.id
                  ? 'bg-[var(--color-navy)] text-white border-transparent dark:bg-[var(--color-mustard)] dark:text-black font-bold'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flours Grid / Cards */}
      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
          {t('common.loading')}
        </div>
      ) : flours.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-[var(--color-border)] p-8">
          <Wheat className="w-10 h-10 mx-auto text-[var(--color-text-muted)] mb-2" />
          <p className="text-sm font-semibold text-[var(--color-text-main)]">Žádná mouka nenalezena</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Zkuste upravit vyhledávání nebo filtr.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {flours.map(flour => (
            <div
              key={flour.id}
              className="group flex flex-col justify-between p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)] hover:shadow-sm transition-all duration-150"
            >
              <div>
                {/* Card Header: Brand, Name & W Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {flour.brand && (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-0.5">
                        {flour.brand}
                      </span>
                    )}
                    <h3 className="font-bold text-base text-[var(--color-text-main)] font-[family-name:var(--font-outfit)] leading-snug">
                      {flour.name}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${getStrengthBadgeClass(
                      flour.strengthCategory
                    )}`}
                  >
                    W {flour.wRangeMax ? `${flour.wIndex}–${flour.wRangeMax}` : flour.wIndex}
                  </span>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-[var(--color-border)] text-center">
                  <div className="p-1.5 rounded-lg bg-[var(--color-surface-subtle)]">
                    <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block">
                      Bílkoviny
                    </span>
                    <span className="text-sm font-bold text-[var(--color-text-main)]">
                      {flour.proteinPercentage} %
                    </span>
                  </div>

                  <div className="p-1.5 rounded-lg bg-[var(--color-surface-subtle)]">
                    <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block">
                      Hydratace
                    </span>
                    <span className="text-sm font-bold text-[var(--color-text-main)]">
                      {flour.minHydration}–{flour.maxHydration} %
                    </span>
                  </div>

                  <div className="p-1.5 rounded-lg bg-[var(--color-surface-subtle)]">
                    <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block">
                      Fermentace
                    </span>
                    <span className="text-xs font-bold text-[var(--color-text-main)] truncate block">
                      {flour.recommendedFermentationHours}
                    </span>
                  </div>
                </div>

                {/* Usage Notes */}
                {flour.usageNotes && (
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed mb-4">
                    {flour.usageNotes}
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/50 text-xs">
                <Link
                  href={`/?flourId=${flour.id}`}
                  className="inline-flex items-center gap-1.5 font-bold text-[var(--color-primary)] hover:underline"
                >
                  <span>Použít v kalkulátoru</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(flour)}
                    className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                    title={t('common.edit')}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(flour.id)}
                    className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    title={t('common.delete')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Flour Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-[var(--color-text-main)] mb-1">
              {editingFlour ? t('flours.editFlour') : t('flours.addFlour')}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-5">
              Zadejte parametry mouky pro přesný výpočet hydratace a fermentace.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  {t('flours.modal.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="např. Caputo Cuoco Tipo 00"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    {t('flours.modal.brand')}
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    placeholder="např. Mulino Caputo"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    {t('flours.modal.flourType')}
                  </label>
                  <input
                    type="text"
                    value={formType}
                    onChange={e => setFormType(e.target.value)}
                    placeholder="tipo_00, tipo_0, manitoba"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    W Index *
                  </label>
                  <input
                    type="number"
                    required
                    min={80}
                    max={500}
                    value={formWIndex}
                    onChange={e => setFormWIndex(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    W Max
                  </label>
                  <input
                    type="number"
                    min={80}
                    max={500}
                    value={formWRangeMax}
                    onChange={e => setFormWRangeMax(e.target.value !== '' ? Number(e.target.value) : '')}
                    placeholder="volitelné"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Bílkoviny (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min={5}
                    max={25}
                    value={formProtein}
                    onChange={e => setFormProtein(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Min. hydratace (%)
                  </label>
                  <input
                    type="number"
                    min={45}
                    max={100}
                    value={formMinHydration}
                    onChange={e => setFormMinHydration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Max. hydratace (%)
                  </label>
                  <input
                    type="number"
                    min={45}
                    max={100}
                    value={formMaxHydration}
                    onChange={e => setFormMaxHydration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  Doporučená fermentace
                </label>
                <input
                  type="text"
                  value={formFermentation}
                  onChange={e => setFormFermentation(e.target.value)}
                  placeholder="např. 24–48 h (chlad)"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  Využití a poznámky
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Vhodné pro klasickou pizzu, focaccia, biga..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                >
                  {t('flours.modal.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)] shadow-xs cursor-pointer"
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
