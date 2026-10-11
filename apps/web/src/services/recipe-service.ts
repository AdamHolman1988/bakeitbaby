import { RecipeItem, PRESET_RECIPES } from '@/types/recipe';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api';

export async function fetchRecipes(search?: string, style?: string): Promise<RecipeItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/recipes`);
    if (search) url.searchParams.set('search', search);
    if (style && style !== 'all') url.searchParams.set('style', style);

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
    let list = [...PRESET_RECIPES, ...custom];

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

  return PRESET_RECIPES;
}

export async function saveRecipe(recipe: Partial<RecipeItem>): Promise<RecipeItem> {
  try {
    const isEdit = typeof recipe.id === 'number';
    const url = isEdit ? `${API_BASE_URL}/recipes/${recipe.id}` : `${API_BASE_URL}/recipes`;
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
    name: recipe.name || 'Nový recept',
    description: recipe.description || '',
    pizzaStyle: recipe.pizzaStyle || 'neapolitan',
    prefermentType: recipe.prefermentType || 'direct',
    doughBallsCount: recipe.doughBallsCount || 4,
    ballWeightGrams: recipe.ballWeightGrams || 260,
    hydrationPercentage: recipe.hydrationPercentage || 65,
    saltPercentage: recipe.saltPercentage || 2.8,
    yeastPercentage: recipe.yeastPercentage || 0.15,
    yeastType: recipe.yeastType || 'fresh',
    oilPercentage: recipe.oilPercentage || 0,
    sugarPercentage: recipe.sugarPercentage || 0,
    fermentationRtHours: recipe.fermentationRtHours || 8,
    fermentationCtHours: recipe.fermentationCtHours || 16,
    flourId: recipe.flourId || null,
    flourName: recipe.flourName || 'Klasická mouka',
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
    // Fallback
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bakeitbaby_custom_recipes');
    if (stored) {
      const list: RecipeItem[] = JSON.parse(stored);
      const filtered = list.filter(r => r.id !== id);
      localStorage.setItem('bakeitbaby_custom_recipes', JSON.stringify(filtered));
    }
  }
}
