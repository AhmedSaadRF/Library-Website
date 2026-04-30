// src/utils/categoryUtils.ts
export function matchesCategory(bookCategories: string | string[], categoryName: string): boolean {
  if (!categoryName) return false;
  if (Array.isArray(bookCategories)) {
    return bookCategories.includes(categoryName);
  }
  return bookCategories === categoryName;
}