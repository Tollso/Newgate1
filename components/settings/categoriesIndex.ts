import { SETTINGS_CATEGORIES, SettingCategory, SettingOption } from './categoriesData';
import { SETTINGS_CATEGORIES_PART2 } from './categoriesDataPart2';
import { SETTINGS_CATEGORIES_PART3 } from './categoriesDataPart3';
import { SETTINGS_CATEGORIES_PART4 } from './categoriesDataPart4';

export type { SettingCategory, SettingOption };

export const ALL_SETTINGS_CATEGORIES: SettingCategory[] = [
  ...SETTINGS_CATEGORIES,
  ...SETTINGS_CATEGORIES_PART2,
  ...SETTINGS_CATEGORIES_PART3,
  ...SETTINGS_CATEGORIES_PART4
];

export const getCategoryById = (id: string): SettingCategory | undefined => {
  return ALL_SETTINGS_CATEGORIES.find(cat => cat.id === id);
};

export const searchSettingsOptions = (query: string) => {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results: { categoryId: string; categoryTitle: string; pageId: string; pageName: string; matchedOption?: string; description: string }[] = [];

  ALL_SETTINGS_CATEGORIES.forEach(cat => {
    cat.pages.forEach(p => {
      const pageMatch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchedOpt = p.optionsInside.find(opt => opt.toLowerCase().includes(q));

      if (pageMatch || matchedOpt) {
        results.push({
          categoryId: cat.id,
          categoryTitle: cat.title,
          pageId: p.id,
          pageName: p.name,
          matchedOption: matchedOpt,
          description: p.description
        });
      }
    });
  });

  return results;
};
