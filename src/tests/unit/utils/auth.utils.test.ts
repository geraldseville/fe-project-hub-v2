import { describe, expect, it } from 'vitest';

import { getPasswordRules, splitFullName } from '@/utils/auth.utils';

describe('getPasswordRules', () => {
  it('returns all true for a valid password', () => {
    expect(getPasswordRules('Password123')).toEqual({
      hasMinimumLength: true,
      hasLetter: true,
      hasNumber: true,
      isNotCommon: false,
    });
  });

  it('fails when password is shorter than 8 characters', () => {
    expect(getPasswordRules('Pass123')).toEqual({
      hasMinimumLength: false,
      hasLetter: true,
      hasNumber: true,
      isNotCommon: true,
    });
  });

  it('fails when password has no letters', () => {
    expect(getPasswordRules('12345678')).toEqual({
      hasMinimumLength: true,
      hasLetter: false,
      hasNumber: true,
      isNotCommon: false,
    });
  });

  it('fails when password has no numbers', () => {
    expect(getPasswordRules('Password')).toEqual({
      hasMinimumLength: true,
      hasLetter: true,
      hasNumber: false,
      isNotCommon: false,
    });
  });

  it('rejects a common password', () => {
    expect(getPasswordRules('password')).toEqual({
      hasMinimumLength: true,
      hasLetter: true,
      hasNumber: false,
      isNotCommon: false,
    });
  });

  it('rejects common passwords regardless of casing', () => {
    expect(getPasswordRules('PASSWORD')).toEqual({
      hasMinimumLength: true,
      hasLetter: true,
      hasNumber: false,
      isNotCommon: false,
    });
  });

  it('returns false for isNotCommon when password is empty', () => {
    expect(getPasswordRules('')).toEqual({
      hasMinimumLength: false,
      hasLetter: false,
      hasNumber: false,
      isNotCommon: false,
    });
  });
});

describe('splitFullName', () => {
  it('splits a first and last name', () => {
    expect(splitFullName('Gerald Seville')).toEqual({
      firstName: 'Gerald',
      lastName: 'Seville',
    });
  });

  it('returns an empty last name when only one name is provided', () => {
    expect(splitFullName('Gerald')).toEqual({
      firstName: 'Gerald',
      lastName: '',
    });
  });

  it('supports multiple-word first names', () => {
    expect(splitFullName('Gerald Cruz Seville')).toEqual({
      firstName: 'Gerald Cruz',
      lastName: 'Seville',
    });
  });

  it('trims leading and trailing whitespace', () => {
    expect(splitFullName('  Gerald Seville  ')).toEqual({
      firstName: 'Gerald',
      lastName: 'Seville',
    });
  });

  it('handles multiple spaces between names', () => {
    expect(splitFullName('Gerald    Seville')).toEqual({
      firstName: 'Gerald',
      lastName: 'Seville',
    });
  });

  it('returns empty names for an empty string', () => {
    expect(splitFullName('')).toEqual({
      firstName: '',
      lastName: '',
    });
  });

  it('returns empty names for whitespace only', () => {
    expect(splitFullName('   ')).toEqual({
      firstName: '',
      lastName: '',
    });
  });
});
