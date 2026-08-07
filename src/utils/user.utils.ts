export const getFullName = (
  firstName?: string | null,
  lastName?: string | null,
): string => {
  const first = firstName?.trim() ?? '';
  const last = lastName?.trim() ?? '';

  if (!first && !last) {
    return '';
  }

  return `${first} ${last}`.trim();
};

export const userInitials = (fullName: string) => {
  return fullName
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};
