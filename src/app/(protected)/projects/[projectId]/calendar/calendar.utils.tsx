import momentTimezone from 'moment-timezone';

export const HOUR_HEIGHT = 72;
export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 24 * 60;
export const DEFAULT_TIME_INTERVAL = 15;

export const calendarMoment = (value: Date | string, timezone: string) => {
  return momentTimezone(value).tz(timezone);
};

export function getEventPosition(
  startDate: string | Date,
  endDate: string | Date,
  calendarDate: string | Date,
  timezone: string,
) {
  const dayStart = calendarMoment(calendarDate, timezone).startOf('day');

  const dayEnd = dayStart.clone().add(1, 'day');

  const eventStart = calendarMoment(startDate, timezone);

  const eventEnd = calendarMoment(endDate, timezone);

  // Event doesn't intersect this day.
  if (eventEnd.isSameOrBefore(dayStart) || eventStart.isSameOrAfter(dayEnd)) {
    return null;
  }

  const visibleStart = momentTimezone.max(eventStart, dayStart);

  const visibleEnd = momentTimezone.min(eventEnd, dayEnd);

  const startMinutes = visibleStart.diff(dayStart, 'minutes');

  const durationMinutes = visibleEnd.diff(visibleStart, 'minutes');

  return {
    top: minutesToPixels(startMinutes),
    height: minutesToPixels(durationMinutes),
    startMinutes,
    durationMinutes,
  };
}

export const displayDate = (
  date: Date,
  view: 'day' | 'week' | 'month',
  timezone: string,
) => {
  const current = calendarMoment(date, timezone);

  if (view === 'day') return current.format('dddd, MMMM D, YYYY');

  if (view === 'month') return current.format('MMMM YYYY');

  return `${current.clone().startOf('isoWeek').format('MMM D')} – ${current.clone().endOf('isoWeek').format('MMM D, YYYY')}`;
};

export const minutesToPixels = (minutes: number) => {
  return (minutes / MINUTES_PER_HOUR) * HOUR_HEIGHT;
};

export const nowInTimezone = (timezone: string) => {
  return momentTimezone.tz(timezone).toDate();
};

export const pixelsToMinutes = (
  pixels: number,
  interval = DEFAULT_TIME_INTERVAL,
) => {
  const minutes = (pixels / HOUR_HEIGHT) * MINUTES_PER_HOUR;

  return Math.round(minutes / interval) * interval;
};

export function getMinutesFromCalendarDay(
  date: string | Date,
  calendarDate: string | Date,
  timezone: string,
) {
  const value = calendarMoment(date, timezone);
  const dayStart = calendarMoment(calendarDate, timezone).startOf('day');

  return value.diff(dayStart, 'minutes');
}
