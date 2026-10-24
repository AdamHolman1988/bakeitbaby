'use client';

import * as React from 'react';
import { useAppLocale } from '@/context/locale-context';
import { RecipeItem, RecipeIngredient, PRESET_RECIPES } from '@/types/recipe';
import { fetchRecipes, saveRecipe, deleteRecipe } from '@/services/recipe-service';
import { fetchDoughs } from '@/services/dough-service';
import { DoughItem } from '@/types/dough';
import { Search, Plus, Edit2, Trash2, BookOpen, Flame, ChevronDown, ChevronUp, Utensils, ChefHat } from 'lucide-react';
import Link from 'next/link';

const STAGE_KEYS: Record<string, string> = {
  'základ': 'base',
  base: 'base',
  'před pečením': 'beforeBaking',
  'before baking': 'beforeBaking',
  'po upečení': 'afterBaking',
  'po pečení': 'afterBaking',
  'after baking': 'afterBaking',
  'před i po pečení': 'beforeAndAfterBaking',
  'before & after baking': 'beforeAndAfterBaking',
};

export default function RecipesPage() {
  const { t, locale } = useAppLocale();
  const styleLabel = (style: string) => {
    const key = `recipes.style.${style}`;
    const label = t(key);
    return label === key ? style : label;
  };
  // Stages are stored as free text; translate the known ones (Czech or English) for display.
  const stageLabel = (stage: string) => {
    const key = STAGE_KEYS[stage.trim().toLowerCase()];
    return key ? t(`recipes.stages.${key}`) : stage;
  };
  const [recipes, setRecipes] = React.useState<RecipeItem[]>(PRESET_RECIPES);
  const [doughs, setDoughs] = React.useState<DoughItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [styleFilter, setStyleFilter] = React.useState('all');
  const [expandedId, setExpandedId] = React.useState<number | null>(1); // first expanded

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingRecipe, setEditingRecipe] = React.useState<RecipeItem | null>(null);

  // Form State
  const [formName, setFormName] = React.useState('');
  const [formDescription, setFormDescription] = React.useState('');
  const [formStyle, setFormStyle] = React.useState('neapolitan');
  const [formDoughId, setFormDoughId] = React.useState<number | ''>('');
  const [formDoughName, setFormDoughName] = React.useState('');
  const [formPrepTime, setFormPrepTime] = React.useState(10);
  const [formBakeTemp, setFormBakeTemp] = React.useState(450);
  const [formBakeSeconds, setFormBakeSeconds] = React.useState(75);
  const [formIngredients, setFormIngredients] = React.useState<RecipeIngredient[]>([]);
  const [formInstructionsText, setFormInstructionsText] = React.useState('');

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const [recipesData, doughsData] = await Promise.all([
      fetchRecipes(searchTerm, styleFilter, locale),
      fetchDoughs(undefined, undefined, locale),
    ]);
    setRecipes(recipesData);
    setDoughs(doughsData);
    setLoading(false);
  }, [searchTerm, styleFilter, locale]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddModal = () => {
    setEditingRecipe(null);
    setFormName('');
    setFormDescription('');
    setFormStyle('neapolitan');
    setFormDoughId('');
    setFormDoughName('');
    setFormPrepTime(10);
    setFormBakeTemp(450);
    setFormBakeSeconds(75);
    setFormIngredients([
      { name: 'Sugo San Marzano D.O.P.', amount: '80 g', stage: t('recipes.stages.base') },
      { name: 'Fior di Latte', amount: '90 g', stage: t('recipes.stages.beforeBaking') },
      { name: t('recipes.defaults.basil'), amount: t('recipes.defaults.basilAmount'), stage: t('recipes.stages.afterBaking') },
      { name: t('recipes.defaults.oil'), amount: t('recipes.defaults.oilAmount'), stage: t('recipes.stages.afterBaking') },
    ]);
    setFormInstructionsText(t('recipes.defaults.instructions'));
    setModalOpen(true);
  };

  const openEditModal = (recipe: RecipeItem) => {
    setEditingRecipe(recipe);
    setFormName(recipe.name);
    setFormDescription(recipe.description || '');
    setFormStyle(recipe.pizzaStyle);
    setFormDoughId(recipe.doughId ?? '');
    setFormDoughName(recipe.doughName || '');
    setFormPrepTime(recipe.prepTimeMinutes);
    setFormBakeTemp(recipe.bakeTemperature);
    setFormBakeSeconds(recipe.bakeTimeSeconds);
    setFormIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', amount: '', stage: t('recipes.stages.base') }]);
    setFormInstructionsText((recipe.instructions || []).join('\n'));
    setModalOpen(true);
  };

  const addIngredientRow = () => {
    setFormIngredients(prev => [...prev, { name: '', amount: '', stage: t('recipes.stages.beforeBaking') }]);
  };

  const removeIngredientRow = (idx: number) => {
    setFormIngredients(prev => prev.filter((_, i) => i !== idx));
  };

  const updateIngredientField = (idx: number, field: keyof RecipeIngredient, val: string) => {
    setFormIngredients(prev =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const instructions = formInstructionsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const validIngredients = formIngredients.filter(ing => ing.name.trim().length > 0);

    const payload: Partial<RecipeItem> = {
      id: editingRecipe ? editingRecipe.id : undefined,
      name: formName,
      description: formDescription,
      pizzaStyle: formStyle,
      doughId: formDoughId !== '' ? Number(formDoughId) : null,
      doughName: formDoughName || undefined,
      prepTimeMinutes: Number(formPrepTime),
      bakeTemperature: Number(formBakeTemp),
      bakeTimeSeconds: Number(formBakeSeconds),
      ingredients: validIngredients,
      instructions,
    };

    await saveRecipe(payload, locale);
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm(t('common.confirmDelete'))) {
      await deleteRecipe(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-contrast)] font-semibold text-sm shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('recipes.addRecipe')}</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('recipes.search')}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-1 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-subtle)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: t('recipes.style.all') },
            { id: 'neapolitan', label: t('recipes.style.neapolitan') },
            { id: 'canotto', label: t('recipes.style.canotto') },
            { id: 'roman_crispy', label: t('recipes.style.roman_crispy') },
            { id: 'glutenfree', label: t('recipes.style.glutenfree') },
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

      {/* Recipe Cards List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
          {t('common.loading')}
        </div>
      ) : recipes.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-[var(--color-border)] p-8">
          <BookOpen className="w-10 h-10 mx-auto text-[var(--color-text-muted)] mb-2" />
          <p className="text-sm font-semibold text-[var(--color-text-main)]">{t('recipes.empty')}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('recipes.emptyHint')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.map(recipe => {
            const isExpanded = expandedId === recipe.id;
            return (
              <div
                key={recipe.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-xs transition-colors"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--color-surface-subtle)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-primary)] border border-[var(--color-border)]">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--color-text-main)] font-[family-name:var(--font-outfit)]">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mt-0.5">
                        <span>{styleLabel(recipe.pizzaStyle)}</span>
                        {recipe.doughName && (
                          <>
                            <span>•</span>
                            <span className="text-[var(--color-text-main)] font-medium">{t('recipes.doughLabel')}: {recipe.doughName}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{t('recipes.ingredientCount', { count: recipe.ingredients.length })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[var(--color-text-main)] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      <span>{recipe.bakeTemperature} °C ({recipe.bakeTimeSeconds} s)</span>
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
                  <div className="p-4 pt-1 border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)] space-y-4 text-xs">
                    {recipe.description && (
                      <p className="text-[var(--color-text-muted)] leading-relaxed">
                        {recipe.description}
                      </p>
                    )}

                    {/* Quick Specs Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[10px] text-[var(--color-text-muted)] block">{t('baking.temperature')}</span>
                        <strong className="font-mono text-sm text-[var(--color-text-main)]">{recipe.bakeTemperature} °C</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[10px] text-[var(--color-text-muted)] block">{t('recipes.bakeTime')}</span>
                        <strong className="font-mono text-sm text-[var(--color-text-main)]">{recipe.bakeTimeSeconds} s</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[10px] text-[var(--color-text-muted)] block">{t('recipes.prepTime')}</span>
                        <strong className="font-mono text-sm text-[var(--color-text-main)]">{recipe.prepTimeMinutes} min</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <span className="text-[10px] text-[var(--color-text-muted)] block">{t('recipes.usedDough')}</span>
                        <strong className="text-xs text-[var(--color-text-main)] truncate block">
                          {recipe.doughName || t('recipes.customDough')}
                        </strong>
                      </div>
                    </div>

                    {/* Ingredients List */}
                    <div className="p-3.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
                      <span className="font-bold text-[var(--color-text-main)] block flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        <span>{t('recipes.ingredientsTitle', { count: recipe.ingredients.length })}</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {recipe.ingredients.map((ing, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)]"
                          >
                            <span className="font-medium text-[var(--color-text-main)]">{ing.name}</span>
                            <div className="text-right">
                              <span className="font-mono font-bold text-[var(--color-text-main)] ml-2">{ing.amount}</span>
                              {ing.stage && (
                                <span className="text-[10px] text-[var(--color-text-muted)] block opacity-75">
                                  {stageLabel(ing.stage)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-step instructions */}
                    {recipe.instructions && recipe.instructions.length > 0 && (
                      <div className="p-3.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1.5">
                        <span className="font-bold text-[var(--color-text-main)] block">
                          {t('recipes.stepsTitle')}
                        </span>
                        <ol className="list-decimal list-inside space-y-1 text-[var(--color-text-muted)] leading-relaxed">
                          {recipe.instructions.map((step, idx) => (
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
                          onClick={() => openEditModal(recipe)}
                          className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] font-semibold cursor-pointer text-[var(--color-text-main)]"
                        >
                          <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                          {t('recipes.editRecipe')}
                        </button>
                        {!recipe.isPreset && (
                          <button
                            type="button"
                            onClick={() => handleDelete(recipe.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                            {t('common.delete')}
                          </button>
                        )}
                      </div>

                      {recipe.doughName && (
                        <Link
                          href="/doughs"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] font-semibold cursor-pointer text-[var(--color-text-main)]"
                        >
                          <ChefHat className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          <span>{t('recipes.viewDough')}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Recipe Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl space-y-4 my-8">
            <h3 className="text-base font-bold font-[family-name:var(--font-outfit)] text-[var(--color-text-main)] pb-2 border-b border-[var(--color-border)]">
              {editingRecipe ? t('recipes.editRecipe') : t('recipes.addRecipe')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                  {t('recipes.form.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder={t('recipes.form.namePlaceholder')}
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
                    <option value="neapolitan">{t('recipes.style.neapolitan')}</option>
                    <option value="canotto">{t('recipes.style.canotto')}</option>
                    <option value="roman_crispy">{t('recipes.style.roman_crispy')}</option>
                    <option value="glutenfree">{t('recipes.style.glutenfree')}</option>
                    <option value="focaccia">{t('recipes.style.focaccia')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('recipes.form.linkedDough')}
                  </label>
                  <select
                    value={formDoughId}
                    onChange={e => {
                      const val = e.target.value;
                      setFormDoughId(val === '' ? '' : Number(val));
                      const found = doughs.find(d => d.id === Number(val));
                      setFormDoughName(found ? found.name : '');
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] cursor-pointer"
                  >
                    <option value="">{t('recipes.noDough')}</option>
                    {doughs.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.hydrationPercentage} %)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('recipes.form.bakeTemp')}
                  </label>
                  <input
                    type="number"
                    value={formBakeTemp}
                    onChange={e => setFormBakeTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('recipes.form.bakeSeconds')}
                  </label>
                  <input
                    type="number"
                    value={formBakeSeconds}
                    onChange={e => setFormBakeSeconds(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                    {t('recipes.form.prepTime')}
                  </label>
                  <input
                    type="number"
                    value={formPrepTime}
                    onChange={e => setFormPrepTime(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                  {t('recipes.form.description')}
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder={t('recipes.form.descriptionPlaceholder')}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                />
              </div>

              {/* Dynamic Ingredients Editor */}
              <div className="space-y-2 pt-1 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--color-text-main)]">
                    {t('recipes.ingredientsList')}
                  </span>
                  <button
                    type="button"
                    onClick={addIngredientRow}
                    className="text-xs text-[var(--color-primary)] hover:underline font-semibold cursor-pointer"
                  >
                    + {t('recipes.form.addItem')}
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formIngredients.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={t('recipes.form.itemName')}
                        value={item.name}
                        onChange={e => updateIngredientField(idx, 'name', e.target.value)}
                        className="flex-2 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                      />
                      <input
                        type="text"
                        placeholder={t('recipes.form.itemAmount')}
                        value={item.amount}
                        onChange={e => updateIngredientField(idx, 'amount', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                      />
                      <input
                        type="text"
                        placeholder={t('recipes.form.itemStage')}
                        value={item.stage}
                        onChange={e => updateIngredientField(idx, 'stage', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-main)]"
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredientRow(idx)}
                        className="p-1.5 text-zinc-400 hover:text-rose-500 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-text-main)] mb-1">
                  {t('recipes.form.steps')}
                </label>
                <textarea
                  rows={3}
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
