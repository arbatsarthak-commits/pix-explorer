import type {ImageItem} from '../types/image';

export type AuthorRangeFilter = 'all' | 'am' | 'nz';

export function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function authorRangeForFilter(author: string, filter: AuthorRangeFilter) {
  if (filter === 'all') return true;
  const first = normalize(author).charAt(0).toUpperCase();
  if (!first) return false;
  const code = first.charCodeAt(0);
  const isAM = code >= 65 && code <= 77;
  return filter === 'am' ? isAM : !isAM;
}

export function matchesSearch(item: ImageItem, query: string) {
  const q = normalize(query);
  if (!q) return true;
  return (
    normalize(item.author).includes(q) || normalize(item.id).includes(q)
  );
}

export function filterImages(
  items: ImageItem[],
  query: string,
  filter: AuthorRangeFilter,
) {
  return items
    .filter(item => matchesSearch(item, query))
    .filter(item => authorRangeForFilter(item.author, filter));
}

export function hasActiveImageFilter(
  query: string,
  filter: AuthorRangeFilter,
) {
  return filter !== 'all' || normalize(query).length > 0;
}
