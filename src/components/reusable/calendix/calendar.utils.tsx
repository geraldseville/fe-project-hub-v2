import momentTimezone from 'moment-timezone';

import type {
  CalendarEvent,
  HorizontalRegion,
  PositionedCalendarEvent,
} from './calendar.types';

export const HOUR_HEIGHT = 100;
export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 24 * 60;
export const DEFAULT_TIME_INTERVAL = 15;

export const addDays = (value: Date, amount: number, timezone: string) => {
  return calendarMoment(value, timezone).add(amount, 'day').toDate();
};

export const calendarMoment = (value: Date | string, timezone: string) => {
  return momentTimezone(value).tz(timezone);
};

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

export const getEventPosition = (
  startDate: string | Date,
  endDate: string | Date,
  calendarDate: string | Date,
  timezone: string,
) => {
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
};

export const getMinutesFromCalendarDay = (
  date: string | Date,
  calendarDate: string | Date,
  timezone: string,
) => {
  const value = calendarMoment(date, timezone);
  const dayStart = calendarMoment(calendarDate, timezone).startOf('day');

  return value.diff(dayStart, 'minutes');
};

export const getOverlappingEventLayout = <T,>(
  events: CalendarEvent<T>[],
  date: Date,
  timezone: string,
) => {
  // Use the supplied event order as a stable tie-breaker so equal events keep
  // the same lane whenever this layout is calculated for another day.
  const eventOrder = new Map(events.map((event, index) => [event.id, index]));

  const visibleEvents = events.flatMap((event) => {
    const position = getEventPosition(
      event.startDate,
      event.endDate,
      date,
      timezone,
    );

    if (!position) {
      return [];
    }

    return [{ event, position }];
  });

  const byId = new Map(visibleEvents.map((item) => [item.event.id, item]));

  const visited = new Set<string>();

  const groups: Array<
    Array<{
      event: CalendarEvent<T>;
      position: NonNullable<ReturnType<typeof getEventPosition>>;
    }>
  > = [];

  visibleEvents.forEach((entry) => {
    if (visited.has(entry.event.id)) {
      return;
    }

    const group: Array<{
      event: CalendarEvent<T>;
      position: NonNullable<ReturnType<typeof getEventPosition>>;
    }> = [];
    const stack = [entry.event.id];

    while (stack.length > 0) {
      const currentId = stack.pop();

      if (!currentId || visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);
      const currentEntry = byId.get(currentId);

      if (!currentEntry) {
        continue;
      }

      group.push(currentEntry);

      visibleEvents.forEach((candidate) => {
        if (
          candidate.event.id === currentId ||
          visited.has(candidate.event.id)
        ) {
          return;
        }

        const currentStart = currentEntry.position.startMinutes;
        const currentEnd =
          currentEntry.position.startMinutes +
          currentEntry.position.durationMinutes;
        const candidateStart = candidate.position.startMinutes;
        const candidateEnd =
          candidate.position.startMinutes + candidate.position.durationMinutes;

        const overlaps =
          candidateStart < currentEnd && currentStart < candidateEnd;

        if (overlaps) {
          stack.push(candidate.event.id);
        }
      });
    }

    if (group.length > 0) {
      groups.push(group);
    }
  });

  return groups.flatMap((group) => {
    const sorted = [...group].sort(
      (left, right) =>
        left.position.startMinutes - right.position.startMinutes ||
        right.position.durationMinutes - left.position.durationMinutes ||
        (eventOrder.get(left.event.id) ?? 0) -
          (eventOrder.get(right.event.id) ?? 0) ||
        left.event.id.localeCompare(right.event.id),
    );

    let maxConcurrent = 1;
    const active: typeof sorted = [];

    sorted.forEach((item) => {
      const startMinutes = item.position.startMinutes;

      for (let index = active.length - 1; index >= 0; index -= 1) {
        const activeItem = active[index];
        const activeEnd =
          activeItem.position.startMinutes +
          activeItem.position.durationMinutes;

        if (activeEnd <= startMinutes) {
          active.splice(index, 1);
        }
      }

      active.push(item);
      maxConcurrent = Math.max(maxConcurrent, active.length);
    });

    const laneEnds: number[] = [];

    return sorted.map((item) => {
      let columnIndex = 0;

      while (
        columnIndex < laneEnds.length &&
        laneEnds[columnIndex] > item.position.startMinutes
      ) {
        columnIndex += 1;
      }

      if (!laneEnds[columnIndex]) {
        laneEnds[columnIndex] = item.position.startMinutes;
      }

      laneEnds[columnIndex] =
        item.position.startMinutes + item.position.durationMinutes;

      return {
        event: item.event,
        position: item.position,
        columnIndex,
        columnCount: maxConcurrent,
      } satisfies PositionedCalendarEvent<T>;
    });
  });
};

export const getFreeHorizontalRegions = <T,>(
  slotStartMinutes: number,
  slotEndMinutes: number,
  layout: PositionedCalendarEvent<T>[],
): HorizontalRegion[] => {
  const blocked: Array<{ start: number; end: number }> = [];

  layout.forEach(({ position, columnIndex, columnCount }) => {
    if (!position || columnCount <= 0) {
      return;
    }

    const eventStart = position.startMinutes;
    const eventEnd = position.startMinutes + position.durationMinutes;

    if (eventStart < slotEndMinutes && slotStartMinutes < eventEnd) {
      blocked.push({
        start: (columnIndex / columnCount) * 100,
        end: ((columnIndex + 1) / columnCount) * 100,
      });
    }
  });

  if (blocked.length === 0) {
    return [{ leftPercent: 0, widthPercent: 100 }];
  }

  blocked.sort((left, right) => left.start - right.start);

  const merged: Array<{ start: number; end: number }> = [];

  blocked.forEach((interval) => {
    const last = merged[merged.length - 1];

    if (last && interval.start <= last.end) {
      last.end = Math.max(last.end, interval.end);
      return;
    }

    merged.push({ ...interval });
  });

  const free: HorizontalRegion[] = [];
  let cursor = 0;

  merged.forEach((interval) => {
    if (interval.start > cursor) {
      free.push({
        leftPercent: cursor,
        widthPercent: interval.start - cursor,
      });
    }

    cursor = Math.max(cursor, interval.end);
  });

  if (cursor < 100) {
    free.push({
      leftPercent: cursor,
      widthPercent: 100 - cursor,
    });
  }

  return free.filter((region) => region.widthPercent > 0);
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
