export const COMMON_PASSWORDS = new Set([
  '12345678',
  'abc123',
  'admin',
  'admin123',
  'letmein',
  'password',
  'password123',
  'qwerty',
  'qwerty123',
  'welcome',
]);

export const getPasswordRules = (password: string) => ({
  hasMinimumLength: password.length >= 8,
  hasLetter: /[A-Za-z]/.test(password),
  hasNumber: /\d/.test(password),
  isNotCommon: password != '' && !COMMON_PASSWORDS.has(password.toLowerCase()),
});

export const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return {
      firstName: '',
      lastName: '',
    };
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: '',
    };
  }

  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts.at(-1) ?? '',
  };
};
