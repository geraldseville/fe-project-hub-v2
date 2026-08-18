export const TIMEZONES = Intl.supportedValuesOf('timeZone');

export const DEFAULT_TIMEZONE =
  Intl.DateTimeFormat().resolvedOptions().timeZone;

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
