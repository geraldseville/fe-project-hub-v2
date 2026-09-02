import { describe, expect, it } from 'vitest';

import {
  loginSchema,
  registerSchema,
  validateLogin,
  validateRegister,
} from '@/validators/auth.validator';

describe('loginSchema', () => {
  it('accepts valid login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'Password123',
    });

    expect(result.success).toBe(true);
  });

  it('trims and lowercases the email', () => {
    const result = loginSchema.safeParse({
      email: '  USER@EXAMPLE.COM  ',
      password: 'Password123',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
    }
  });

  it('rejects an empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'Password123',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'Password123',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });

    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validRegistration = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    confirmPassword: 'SecurePass123',
    agreeTerms: true,
  };

  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse(validRegistration);

    expect(result.success).toBe(true);
  });

  it('rejects a name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      name: 'J',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      email: 'invalid-email',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: 'Pass12',
      confirmPassword: 'Pass12',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a password without a letter', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: '12345678',
      confirmPassword: '12345678',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a password without a number', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: 'SecurePass',
      confirmPassword: 'SecurePass',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a common password', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: 'password',
      confirmPassword: 'password',
    });

    expect(result.success).toBe(false);
  });

  it('rejects when passwords do not match', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: 'SecurePass123',
      confirmPassword: 'DifferentPass123',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) =>
            issue.path[0] === 'confirmPassword' &&
            issue.message === 'Passwords do not match.',
        ),
      ).toBe(true);
    }
  });

  it('rejects when terms are not accepted', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      agreeTerms: false,
    });

    expect(result.success).toBe(false);
  });

  it('rejects when confirm password is empty', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      confirmPassword: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects when terms value is not true', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      agreeTerms: false,
    });

    expect(result.success).toBe(false);
  });
});

describe('validateLogin', () => {
  it('returns success for valid login credentials', () => {
    const result = validateLogin({
      email: 'user@example.com',
      password: 'Password123',
    });

    expect(result).toEqual({
      success: true,
      errors: {},
    });
  });

  it('returns email validation error', () => {
    const result = validateLogin({
      email: 'invalid-email',
      password: 'Password123',
    });

    expect(result.success).toBe(false);
    expect(result.errors.email).toBe('Please provide a valid email');
  });

  it('returns password validation error', () => {
    const result = validateLogin({
      email: 'user@example.com',
      password: '',
    });

    expect(result.success).toBe(false);
    expect(result.errors.password).toBe('Password is required');
  });

  it('returns the first error for each field', () => {
    const result = validateLogin({
      email: '',
      password: '',
    });

    expect(result.success).toBe(false);
    expect(result.errors.email).toBe('Email is required');
    expect(result.errors.password).toBe('Password is required');
  });
});

describe('validateRegister', () => {
  const validRegistration = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    confirmPassword: 'SecurePass123',
    agreeTerms: true,
  };

  it('returns success for valid registration data', () => {
    const result = validateRegister(validRegistration);

    expect(result).toEqual({
      success: true,
      errors: {},
    });
  });

  it('returns name validation error', () => {
    const result = validateRegister({
      ...validRegistration,
      name: 'J',
    });

    expect(result.success).toBe(false);
    expect(result.errors.name).toBe('Please enter your full name.');
  });

  it('returns email validation error', () => {
    const result = validateRegister({
      ...validRegistration,
      email: 'invalid-email',
    });

    expect(result.success).toBe(false);
    expect(result.errors.email).toBe('Enter a valid email address.');
  });

  it('returns password validation error', () => {
    const result = validateRegister({
      ...validRegistration,
      password: 'password',
      confirmPassword: 'password',
    });

    expect(result.success).toBe(false);
    expect(result.errors.password).toBe(
      'Password must contain at least one number.',
    );
  });

  it('returns confirm password error when passwords do not match', () => {
    const result = validateRegister({
      ...validRegistration,
      confirmPassword: 'DifferentPass123',
    });

    expect(result.success).toBe(false);
    expect(result.errors.confirmPassword).toBe('Passwords do not match.');
  });

  it('returns terms validation error when terms are not accepted', () => {
    const result = validateRegister({
      ...validRegistration,
      agreeTerms: false,
    });

    expect(result.success).toBe(false);
    expect(result.errors.agreeTerms).toBe('You must agree to the terms.');
  });

  it('returns multiple field errors at once', () => {
    const result = validateRegister({
      name: 'J',
      email: 'invalid-email',
      password: 'password',
      confirmPassword: 'different',
      agreeTerms: false,
    });

    expect(result.success).toBe(false);
    expect(result.errors.name).toBe('Please enter your full name.');
    expect(result.errors.email).toBe('Enter a valid email address.');
    expect(result.errors.password).toBe(
      'Password must contain at least one number.',
    );
    expect(result.errors.confirmPassword).toBe('Passwords do not match.');
    expect(result.errors.agreeTerms).toBe('You must agree to the terms.');
  });
});
