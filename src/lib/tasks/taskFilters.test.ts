import { describe, expect, it } from 'vitest';
import { normalizeTaskSearch, parseTaskStatusFilter } from './taskFilters';

describe('task filter helpers', () => {
  it('parses supported task status filters from URL values', () => {
    expect(parseTaskStatusFilter('needs_review')).toBe('needs_review');
    expect(parseTaskStatusFilter('all')).toBe('all');
  });

  it('falls back to all when URL status is missing or unsupported', () => {
    expect(parseTaskStatusFilter(null)).toBe('all');
    expect(parseTaskStatusFilter('paused')).toBe('all');
  });

  it('normalizes task search values without inventing query text', () => {
    expect(normalizeTaskSearch('  cough  ')).toBe('cough');
    expect(normalizeTaskSearch(null)).toBe('');
  });
});
