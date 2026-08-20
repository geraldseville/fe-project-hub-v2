import type { TimeFormat } from '@/types/user.types';

export const TIMEZONES = Intl.supportedValuesOf('timeZone');

export const DEFAULT_TIMEZONE =
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const DEFAULT_TIME_FORMAT: TimeFormat = 'H12';

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

export const getTimeFormat = (timeFormat?: string | null): string => {
  return timeFormat === 'H12' ? 'hh:mm A' : 'HH:mm';
};

export const readableTimezone = (timezone: string) => {
  return timezone.replace(/_/g, ' ').replace('/', ' / ');
};
