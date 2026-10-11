'use client';

import * as React from 'react';
import { useAppLocale } from '@/context/locale-context';
import { RecipeItem, PRESET_RECIPES } from '@/types/recipe';
import { fetchRecipes, saveRecipe, deleteRecipe } from '@/services/recipe-service';
import { Search, Plus, Edit2, Trash2, Calculator, ChevronDown, ChevronUp, BookOpen, Clock, Droplets, Flame, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RecipesPage() {
  const { t } = useAppLocale();
  const [recipes, setRecipes] = React.useState<RecipeItem[]>(PRESET_RECIPES);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [styleFilter, setStyleFilter] = React.useState('all');
  const [expandedId, setExpandedId] = React.useState<number | null>(1); // first recipe expanded by default
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingRecipe, setEditingRecipe] = React.useState<RecipeItem | null>(null);

  // Form State
  const [formName, setFormName] = React.useState('');
  const [formDescription, setFormDescription] = React.useState('');
  const [formStyle, setFormStyle] = React.useState('neapolitan');
  const [formPreferment, setFormPreferment] = React.useState('direct');
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
  const [formFlourName, setFormFlourName] = React.useState('');
  const [formInstructionsText, setFormInstructionsText] = React.useState('');

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const data = await fetchRecipes(searchTerm, styleFilter);
    setRecipes(data);
    setLoading(false);
  }, [searchTerm, styleFilter]);

  React.useEffect(() => {
    loadData();

    // Check for query params when directed from Calculator "Uložit jako recept"
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('savePreset') === 'true') {
        setEditingRecipe(null);
        setFormName(p.get('name') || 'Moje nová pizza');
        setFormHydration(Number(p.get('hydration')) || 65);
        setFormBalls(Number(p.get('pizzas')) || 4);
        setFormWeight(Number(p.get('weight')) || 260);
        setFormSalt(Number(p.get('salt')) || 2.8);
        setFormOil(Number(p.get('oil')) || 0);
        setFormSugar(Number(p.get('sugar')) || 0);
        setFormRt(Number(p.get('rt')) || 8);
        setFormCt(Number(p.get('ct')) || 16);
        setFormFlourName('Vybraná mouka');
        setFormInstructionsText('Rozpusťte sůl ve vodě.\nPřidejte mouku a droždí.\nHněťte do sametové struktury.\nNechte zrát podle plánu.');
        setModalOpen(true);
      }
    }
  }, [loadData]);

  const openAddModal = () => {
    setEditingRecipe(null);
    setFormName('');
    setFormDescription('');
    setFormStyle('neapolitan');
    setFormPreferment('direct');
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
    setFormInstructionsText('Rozpusťte sůl ve vodě.\nPřidejte mouku a droždí.\nHněťte do hladka.\nFermentujte v chladu.');
    setModalOpen(true);
  };

  const openEditModal = (recipe: RecipeItem) => {
    setEditingRecipe(recipe);
    setFormName(recipe.name);
    setFormDescription(recipe.description || '');
    setFormStyle(recipe.pizzaStyle);
    setFormPreferment(recipe.prefermentType);
    setFormBalls(recipe.doughBallsCount);
    setFormWeight(recipe.ballWeightGrams);
    setFormHydration(recipe.hydrationPercentage);
    setFormSalt(recipe.saltPercentage);
    setFormYeast(recipe.yeastPercentage);
    setFormYeastType(recipe.yeastType);
    setFormOil(recipe.oilPercentage);
    setFormSugar(recipe.sugarPercentage);
    setFormRt(recipe.fermentationRtHours);
    setFormCt(recipe.fermentationCtHours);
    setFormFlourName(recipe.flourName || '');
    setFormInstructionsText(recipe.instructions.join('\n'));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const instructions = formInstructionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload: Partial<RecipeItem> = {
      id: editingRecipe ? editingRecipe.id : undefined,
      name: formName,
      description: formDescription,
      pizzaStyle: formStyle,
      prefermentType: formPreferment,
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

    await saveRecipe(payload);
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm(t('common.confirmDelete'))) {
      await deleteRecipe(id);
      loadData();
    }
  };

  const getStyleBadgeClass = (style: string) => {
    switch (style) {
      case 'neapolitan':
        return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-800';
      case 'canotto':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'roman_crispy':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'biga':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'sourdough':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
            {t('recipes.title')}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {t('recipes.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-contrast)] font-semibold text-sm shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('recipes.addRecipe')}</span>
        </button>
      </div>

      {/* Search and Style Filter */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('recipes.search')}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-subtle)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: t('recipes.style.all') },
            { id: 'neapolitan', label: 'Neapolská' },
            { id: 'canotto', label: 'Canotto' },
            { id: 'roman_crispy', label: 'Římská plech' },
            { id: 'biga', label: 'Biga' },
            { id: 'sourdough', label: 'Kvásek' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStyleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                styleFilter === tab.id
                  ? 'bg-[var(--color-navy)] text-white border-transparent dark:bg-[var(--color-mustard)] dark:text-black font-bold'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Cards List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
          {t('common.loading')}
        </div>
      ) : recipes.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-[var(--color-border)] p-8">
          <BookOpen className="w-10 h-10 mx-auto text-[var(--color-text-muted)] mb-2" />
          <p className="text-sm font-semibold text-[var(--color-text-main)]">Žádný recept nenalezen</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Zkuste upravit vyhledávání nebo filtr.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map(recipe => {
            const isExpanded = expandedId === recipe.id;
            return (
              <div
                key={recipe.id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)] shadow-xs transition-all duration-150 overflow-hidden"
              >
                {/* Main Card Header */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getStyleBadgeClass(
                          recipe.pizzaStyle
                        )}`}
                      >
                        {recipe.pizzaStyle}
                      </span>
                      {recipe.prefermentType !== 'direct' && (
                        <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                          {recipe.prefermentType.toUpperCase()}
                        </span>
                      )}
                      {recipe.flourName && (
                        <span className="text-xs font-semibold text-[var(--color-primary)]">
                          🌾 {recipe.flourName}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] text-[var(--color-text-main)]">
                      {recipe.name}
                    </h3>

                    {recipe.description && (
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-3xl">
                        {recipe.description}
                      </p>
                    )}
                  </div>

                  {/* Metrics Badges */}
                  <div className="flex items-center gap-3 text-center self-start md:self-auto shrink-0">
                    <div className="px-3 py-2 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] block uppercase font-semibold">
                        Hydratace
                      </span>
                      <span className="text-sm font-extrabold font-mono text-[var(--color-primary)]">
                        {recipe.hydrationPercentage} %
                      </span>
                    </div>

                    <div className="px-3 py-2 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] block uppercase font-semibold">
                        Bochánky
                      </span>
                      <span className="text-sm font-extrabold font-mono text-[var(--color-text-main)]">
                        {recipe.doughBallsCount} × {recipe.ballWeightGrams} g
                      </span>
                    </div>

                    <div className="px-3 py-2 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                      <span className="text-[10px] text-[var(--color-text-muted)] block uppercase font-semibold">
                        Fermentace
                      </span>
                      <span className="text-xs font-bold font-mono text-[var(--color-text-main)]">
                        {recipe.fermentationRtHours + recipe.fermentationCtHours} h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/?hydration=${recipe.hydrationPercentage}&pizzas=${recipe.doughBallsCount}&weight=${recipe.ballWeightGrams}&salt=${recipe.saltPercentage}&oil=${recipe.oilPercentage}&sugar=${recipe.sugarPercentage}&rt=${recipe.fermentationRtHours}&ct=${recipe.fermentationCtHours}`}
                      className="inline-flex items-center gap-1.5 font-bold text-[var(--color-primary)] hover:underline"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>{t('recipes.openInCalculator')}</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                      className="inline-flex items-center gap-1 font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] cursor-pointer"
                    >
                      <span>Postup přípravy ({recipe.instructions?.length || 0})</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(recipe)}
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                      title={t('common.edit')}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(recipe.id)}
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expandable Step-by-Step Instructions */}
                {isExpanded && recipe.instructions && recipe.instructions.length > 0 && (
                  <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-surface)] space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">
                      Kroky a časový rozpis přípravy:
                    </h4>
                    <ol className="space-y-2 list-none">
                      {recipe.instructions.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-[var(--color-text-main)]">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] font-mono font-bold text-[10px] text-[var(--color-primary)] shrink-0">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Recipe Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-[var(--color-text-main)] mb-1">
              {editingRecipe ? t('recipes.editRecipe') : t('recipes.addRecipe')}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-5">
              Uložte si svou recepturu s pekařskými procenty a postupem přípravy.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  {t('recipes.modal.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="např. Moje oblíbená Neapolská 68 %"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    {t('recipes.modal.style')}
                  </label>
                  <select
                    value={formStyle}
                    onChange={e => setFormStyle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="neapolitan">Klasická Neapolská</option>
                    <option value="canotto">Moderní Canotto</option>
                    <option value="roman_crispy">Římská křupavá</option>
                    <option value="biga">Biga</option>
                    <option value="focaccia">Focaccia</option>
                    <option value="sourdough">Kvásek</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    {t('recipes.modal.prefermentType')}
                  </label>
                  <select
                    value={formPreferment}
                    onChange={e => setFormPreferment(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="direct">Přímé těsto (Direct)</option>
                    <option value="biga">Biga preferment</option>
                    <option value="poolish">Poolish preferment</option>
                    <option value="sourdough">Kvásek (Lievito Madre)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Hydratace (%) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    min={40}
                    max={100}
                    value={formHydration}
                    onChange={e => setFormHydration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Bochánky (ks)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formBalls}
                    onChange={e => setFormBalls(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Hmotnost (g)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={1000}
                    value={formWeight}
                    onChange={e => setFormWeight(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Sůl (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={6}
                    value={formSalt}
                    onChange={e => setFormSalt(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Droždí (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0.01}
                    max={20}
                    value={formYeast}
                    onChange={e => setFormYeast(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Olej (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={10}
                    value={formOil}
                    onChange={e => setFormOil(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Pokojová teplota RT (h)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={48}
                    value={formRt}
                    onChange={e => setFormRt(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                    Chladnička CT (h)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={96}
                    value={formCt}
                    onChange={e => setFormCt(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  Mouka (název / typ)
                </label>
                <input
                  type="text"
                  value={formFlourName}
                  onChange={e => setFormFlourName(e.target.value)}
                  placeholder="např. Caputo Cuoco Tipo 00 (W 300)"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  {t('recipes.modal.description')}
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Krátký popis receptu..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
                  {t('recipes.modal.instructions')}
                </label>
                <textarea
                  rows={4}
                  value={formInstructionsText}
                  onChange={e => setFormInstructionsText(e.target.value)}
                  placeholder="Každý krok na samostatný nový řádek..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                >
                  {t('recipes.modal.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)] shadow-xs cursor-pointer"
                >
                  {t('recipes.modal.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
