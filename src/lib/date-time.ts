export const timezones = Intl.supportedValuesOf('timeZone');

export const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const isValidTimezone = (timezone: string) => {
  try {
    Intl.DateTimeFormat(undefined, {
      timeZone: timezone,
    });

    return true;
  } catch {
    return false;
  }
};
