import {
  authorRangeForFilter,
  filterImages,
  hasActiveImageFilter,
  matchesSearch,
  normalize,
} from '../src/utils/imageFilters';
import type {ImageItem} from '../src/types/image';

const sample: ImageItem[] = [
  {id: '1', author: 'Alice', url: 'https://example.com/1.jpg'},
  {id: '2', author: 'Bob', url: 'https://example.com/2.jpg'},
  {id: '3', author: 'Zara', url: 'https://example.com/3.jpg'},
];

describe('imageFilters', () => {
  it('normalizes case for search', () => {
    expect(matchesSearch(sample[0], 'ALICE')).toBe(true);
    expect(matchesSearch(sample[0], 'alice')).toBe(true);
  });

  it('empty search matches all', () => {
    expect(matchesSearch(sample[0], '')).toBe(true);
    expect(matchesSearch(sample[0], '   ')).toBe(true);
  });

  it('filters author A-M', () => {
    expect(authorRangeForFilter('Alice', 'am')).toBe(true);
    expect(authorRangeForFilter('Zara', 'am')).toBe(false);
  });

  it('filters author N-Z', () => {
    expect(authorRangeForFilter('Zara', 'nz')).toBe(true);
    expect(authorRangeForFilter('Alice', 'nz')).toBe(false);
  });

  it('combines search and filter', () => {
    const result = filterImages(sample, 'a', 'am');
    expect(result).toHaveLength(1);
    expect(result[0].author).toBe('Alice');
  });

  it('detects active filter state', () => {
    expect(hasActiveImageFilter('', 'all')).toBe(false);
    expect(hasActiveImageFilter('bob', 'all')).toBe(true);
    expect(hasActiveImageFilter('', 'nz')).toBe(true);
  });

  it('searches by image id', () => {
    expect(matchesSearch(sample[2], '3')).toBe(true);
    expect(normalize('  Test ')).toBe('test');
  });
});
