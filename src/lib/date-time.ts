export const timezones = Intl.supportedValuesOf('timeZone');

export const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
