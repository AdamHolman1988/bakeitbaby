import { DoughItem, PRESET_DOUGHS } from '@/types/dough';
import type { Locale } from '@/context/locale-context';
import { apiLocale, localizePreset } from '@/i18n/content';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

const TRANSLATABLE_FIELDS: (keyof DoughItem)[] = ['name', 'description', 'flourName', 'instructions'];

export async function fetchDoughs(search?: string, style?: string, locale?: Locale): Promise<DoughItem[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (style && style !== 'all') params.set('style', style);
    const lang = apiLocale(locale);
    if (lang) params.set('locale', lang);

    const res = await fetch(`${API_BASE}/api/doughs?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch doughs: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn('API error, falling back to local preset doughs:', error);
    let result = PRESET_DOUGHS.map(d => localizePreset(d, TRANSLATABLE_FIELDS, locale));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q));
    }
    if (style && style !== 'all') {
      result = result.filter(d => d.pizzaStyle === style);
    }
    return result;
  }
}

export async function saveDough(dough: Partial<DoughItem>, locale?: Locale): Promise<DoughItem> {
  const isUpdate = Boolean(dough.id);
  const lang = apiLocale(locale);
  const query = lang ? `?locale=${lang}` : '';
  const url = isUpdate ? `${API_BASE}/api/doughs/${dough.id}${query}` : `${API_BASE}/api/doughs${query}`;
  const method = isUpdate ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dough),
  });

  if (!res.ok) {
    throw new Error(`Failed to save dough: ${res.statusText}`);
  }

  const json = await res.json();
  return json.data;
}

export async function deleteDough(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/doughs/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Failed to delete dough: ${res.statusText}`);
  }
}
