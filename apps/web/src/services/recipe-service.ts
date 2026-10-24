import { RecipeItem, PRESET_RECIPES } from '@/types/recipe';
import type { Locale } from '@/context/locale-context';
import { apiLocale, localizePreset } from '@/i18n/content';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api';

const TRANSLATABLE_FIELDS: (keyof RecipeItem)[] = ['name', 'description', 'doughName', 'ingredients', 'instructions'];

export async function fetchRecipes(search?: string, style?: string, locale?: Locale): Promise<RecipeItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/recipes`);
    if (search) url.searchParams.set('search', search);
    if (style && style !== 'all') url.searchParams.set('style', style);
    const lang = apiLocale(locale);
    if (lang) url.searchParams.set('locale', lang);

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
    }
  } catch {
    // API offline
  }

  // Client-side fallback
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bakeitbaby_custom_recipes');
    const custom: RecipeItem[] = stored ? JSON.parse(stored) : [];
    const presets = PRESET_RECIPES.map(r => localizePreset(r, TRANSLATABLE_FIELDS, locale));
    let list = [...presets, ...custom];

    if (search && search.trim() !== '') {
      const s = search.toLowerCase().trim();
      list = list.filter(
        r =>
          r.name.toLowerCase().includes(s) ||
          (r.description && r.description.toLowerCase().includes(s))
      );
    }

    if (style && style !== 'all') {
      list = list.filter(r => r.pizzaStyle === style);
    }

    return list;
  }

  return PRESET_RECIPES.map(r => localizePreset(r, TRANSLATABLE_FIELDS, locale));
}

export async function saveRecipe(recipe: Partial<RecipeItem>, locale?: Locale): Promise<RecipeItem> {
  try {
    const isEdit = typeof recipe.id === 'number';
    const lang = apiLocale(locale);
    const query = lang ? `?locale=${lang}` : '';
    const url = isEdit ? `${API_BASE_URL}/recipes/${recipe.id}${query}` : `${API_BASE_URL}/recipes${query}`;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });

    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Fallback
  }

  const stored = typeof window !== 'undefined' ? localStorage.getItem('bakeitbaby_custom_recipes') : null;
  const customList: RecipeItem[] = stored ? JSON.parse(stored) : [];

  const newItem: RecipeItem = {
    id: recipe.id || Date.now(),
    name: recipe.name || 'Nový recept na pizzu',
    description: recipe.description || '',
    pizzaStyle: recipe.pizzaStyle || 'neapolitan',
    doughId: recipe.doughId || null,
    doughName: recipe.doughName || null,
    prepTimeMinutes: recipe.prepTimeMinutes || 15,
    bakeTemperature: recipe.bakeTemperature || 450,
    bakeTimeSeconds: recipe.bakeTimeSeconds || 80,
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    isPreset: false,
  };

  const existingIdx = customList.findIndex(r => r.id === newItem.id);
  if (existingIdx >= 0) {
    customList[existingIdx] = newItem;
  } else {
    customList.push(newItem);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('bakeitbaby_custom_recipes', JSON.stringify(customList));
  }

  return newItem;
}

export async function deleteRecipe(id: number): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/recipes/${id}`, { method: 'DELETE' });
  } catch {
    // ignore
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bakeitbaby_custom_recipes');
    if (stored) {
      const customList: RecipeItem[] = JSON.parse(stored);
      const filtered = customList.filter(r => r.id !== id);
      localStorage.setItem('bakeitbaby_custom_recipes', JSON.stringify(filtered));
    }
  }
}
