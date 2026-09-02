import { describe, expect, it } from 'vitest';

import {
  DEFAULT_TIME_FORMAT,
  DEFAULT_TIMEZONE,
  getTimeFormat,
  isValidTimezone,
  readableTimezone,
  TIMEZONES,
} from '@/utils/date-time';

describe('time.utils', () => {
  describe('TIMEZONES', () => {
    it('contains supported IANA timezones', () => {
      expect(TIMEZONES.length).toBeGreaterThan(0);
      expect(TIMEZONES).toContain('Asia/Manila');
    });
  });

  describe('DEFAULT_TIMEZONE', () => {
    it('returns the system timezone', () => {
      expect(DEFAULT_TIMEZONE).toBe(
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
    });
  });

  describe('DEFAULT_TIME_FORMAT', () => {
    it('defaults to 12-hour format', () => {
      expect(DEFAULT_TIME_FORMAT).toBe('H12');
    });
  });

  describe('isValidTimezone', () => {
    it('returns true for a valid timezone', () => {
      expect(isValidTimezone('Asia/Manila')).toBe(true);
    });

    it('returns true for UTC', () => {
      expect(isValidTimezone('UTC')).toBe(true);
    });

    it('returns false for an invalid timezone', () => {
      expect(isValidTimezone('Invalid/Timezone')).toBe(false);
    });

    it('returns false for an empty timezone', () => {
      expect(isValidTimezone('')).toBe(false);
    });
  });

  describe('getTimeFormat', () => {
    it('returns 12-hour format for H12', () => {
      expect(getTimeFormat('H12')).toBe('hh:mm A');
    });

    it('returns 24-hour format for H24', () => {
      expect(getTimeFormat('H24')).toBe('HH:mm');
    });

    it('returns 24-hour format for an unsupported value', () => {
      expect(getTimeFormat('invalid')).toBe('HH:mm');
    });

    it('returns 24-hour format when value is undefined', () => {
      expect(getTimeFormat()).toBe('HH:mm');
    });

    it('returns 24-hour format when value is null', () => {
      expect(getTimeFormat(null)).toBe('HH:mm');
    });
  });

  describe('readableTimezone', () => {
    it('replaces underscores with spaces', () => {
      expect(readableTimezone('America/Argentina_Buenos_Aires')).toBe(
        'America / Argentina Buenos Aires',
      );
    });

    it('adds spaces around the timezone separator', () => {
      expect(readableTimezone('Asia/Manila')).toBe('Asia / Manila');
    });

    it('handles a timezone without underscores', () => {
      expect(readableTimezone('UTC')).toBe('UTC');
    });

    it('handles multiple underscores', () => {
      expect(readableTimezone('America/Argentina_Buenos_Aires')).toBe(
        'America / Argentina Buenos Aires',
      );
    });
  });
});
