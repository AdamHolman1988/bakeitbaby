import { FlourItem, PRESET_FLOURS } from '@/types/flour';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api';

export async function fetchFlours(search?: string, strength?: string): Promise<FlourItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/flours`);
    if (search) url.searchParams.set('search', search);
    if (strength && strength !== 'all') url.searchParams.set('strength', strength);

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
    }
  } catch {
    // API offline or unreachable, fall back to localStorage or preset library
  }

  // Fallback to client storage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bakeitbaby_custom_flours');
    const customFlours: FlourItem[] = stored ? JSON.parse(stored) : [];
    let combined = [...PRESET_FLOURS, ...customFlours];

    if (search && search.trim() !== '') {
      const term = search.toLowerCase().trim();
      combined = combined.filter(
        f =>
          f.name.toLowerCase().includes(term) ||
          (f.brand && f.brand.toLowerCase().includes(term)) ||
          (f.usageNotes && f.usageNotes.toLowerCase().includes(term))
      );
    }

    if (strength && strength !== 'all') {
      combined = combined.filter(f => f.strengthCategory === strength);
    }

    return combined;
  }

  return PRESET_FLOURS;
}

export async function saveFlour(flour: Partial<FlourItem>): Promise<FlourItem> {
  try {
    const isEdit = typeof flour.id === 'number';
    const url = isEdit ? `${API_BASE_URL}/flours/${flour.id}` : `${API_BASE_URL}/flours`;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flour),
    });

    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Fallback
  }

  // Client-side fallback save
  const stored = typeof window !== 'undefined' ? localStorage.getItem('bakeitbaby_custom_flours') : null;
  const customList: FlourItem[] = stored ? JSON.parse(stored) : [];

  const w = flour.wIndex || 250;
  let category: FlourItem['strengthCategory'] = 'medium';
  if (w < 220) category = 'weak';
  else if (w <= 260) category = 'medium';
  else if (w <= 310) category = 'strong';
  else category = 'manitoba';

  const newItem: FlourItem = {
    id: flour.id || Date.now(),
    name: flour.name || 'Nová mouka',
    brand: flour.brand || '',
    wIndex: w,
    wRangeMax: flour.wRangeMax || null,
    proteinPercentage: flour.proteinPercentage || 12.0,
    flourType: flour.flourType || 'tipo_00',
    minHydration: flour.minHydration || 55,
    maxHydration: flour.maxHydration || 65,
    recommendedFermentationHours: flour.recommendedFermentationHours || '8–14 h',
    usageNotes: flour.usageNotes || '',
    isPreset: false,
    strengthCategory: category,
  };

  const existingIdx = customList.findIndex(f => f.id === newItem.id);
  if (existingIdx >= 0) {
    customList[existingIdx] = newItem;
  } else {
    customList.push(newItem);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('bakeitbaby_custom_flours', JSON.stringify(customList));
  }

  return newItem;
}

export async function deleteFlour(id: number): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/flours/${id}`, { method: 'DELETE' });
  } catch {
    // Fallback
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bakeitbaby_custom_flours');
    if (stored) {
      const list: FlourItem[] = JSON.parse(stored);
      const filtered = list.filter(f => f.id !== id);
      localStorage.setItem('bakeitbaby_custom_flours', JSON.stringify(filtered));
    }
  }
}
