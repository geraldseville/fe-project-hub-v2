import { describe, expect, it } from 'vitest';

import { toCapitalize } from '@/utils/string.utils';

describe('toCapitalize', () => {
  it('capitalizes the first letter of a word', () => {
    expect(toCapitalize('hello')).toBe('Hello');
  });

  it('capitalizes the first letter of each word', () => {
    expect(toCapitalize('hello world')).toBe('Hello World');
  });

  it('converts the remaining letters to lowercase', () => {
    expect(toCapitalize('hELLO wORLD')).toBe('Hello World');
  });

  it('handles a single word', () => {
    expect(toCapitalize('PROJECT')).toBe('Project');
  });

  it('handles multiple words with mixed casing', () => {
    expect(toCapitalize('jOhN dOE')).toBe('John Doe');
  });

  it('returns an empty string for an empty input', () => {
    expect(toCapitalize('')).toBe('');
  });

  it('handles already capitalized text', () => {
    expect(toCapitalize('Hello World')).toBe('Hello World');
  });

  it('handles strings with multiple spaces', () => {
    expect(toCapitalize('hello   world')).toBe('Hello   World');
  });
});
