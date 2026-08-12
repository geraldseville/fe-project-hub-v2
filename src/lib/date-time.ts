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

export const readableTimezone = (timezone: string) => {
  return timezone.replace(/_/g, ' ').replace('/', ' / ');
};
