import { describe, expect, it } from 'vitest';

import { getFullName, userInitials } from '@/utils/user.utils';

describe('getFullName', () => {
  it('combines first and last name', () => {
    expect(getFullName('John', 'Doe')).toBe('John Doe');
  });

  it('returns only the first name when last name is missing', () => {
    expect(getFullName('John')).toBe('John');
  });

  it('returns only the last name when first name is missing', () => {
    expect(getFullName(undefined, 'Doe')).toBe('Doe');
  });

  it('returns an empty string when both names are missing', () => {
    expect(getFullName()).toBe('');
  });

  it('handles null values', () => {
    expect(getFullName(null, null)).toBe('');
  });

  it('trims whitespace from both names', () => {
    expect(getFullName('  John  ', '  Doe  ')).toBe('John Doe');
  });

  it('returns an empty string when names contain only whitespace', () => {
    expect(getFullName('   ', '   ')).toBe('');
  });

  it('handles an empty first name', () => {
    expect(getFullName('', 'Doe')).toBe('Doe');
  });

  it('handles an empty last name', () => {
    expect(getFullName('John', '')).toBe('John');
  });
});

describe('userInitials', () => {
  it('returns initials from first and last name', () => {
    expect(userInitials('John Doe')).toBe('JD');
  });

  it('returns the first initial for a single name', () => {
    expect(userInitials('John')).toBe('J');
  });

  it('uses only the first two words', () => {
    expect(userInitials('John Michael Doe')).toBe('JM');
  });

  it('converts initials to uppercase', () => {
    expect(userInitials('john doe')).toBe('JD');
  });

  it('trims leading and trailing whitespace', () => {
    expect(userInitials('  John Doe  ')).toBe('JD');
  });

  it('handles multiple spaces between names', () => {
    expect(userInitials('John   Doe')).toBe('JD');
  });

  it('returns an empty string for an empty name', () => {
    expect(userInitials('')).toBe('');
  });

  it('returns an empty string for whitespace-only input', () => {
    expect(userInitials('   ')).toBe('');
  });
});
