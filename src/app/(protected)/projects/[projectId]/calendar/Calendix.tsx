import { useState } from 'react';

import clsx from 'clsx';

import type { CalendarEvent, CalendarView } from './calendar.types';
import { addDays, calendarMoment, nowInTimezone } from './calendar.utils';
import CalendarBoard from './CalendarBoard';
import CalendarEmpty from './CalendarEmpty';
import CalendarToolbar from './CalendarToolbar';

import { defaultTimezone } from '@/lib/date-time';

interface Calendix<T> {
  events?: CalendarEvent<T>[];
  timezone?: string;
  is12hrFormat?: boolean;
  onCreate?: () => void;
  onCreateSelect?: (selection: { startDate: string; endDate: string }) => void;
}

export default function Calendix<T>({
  events = [],
  timezone = defaultTimezone,
  is12hrFormat = true,
  onCreate,
  onCreateSelect,
}: Calendix<T>) {
  const [date, setDate] = useState(() => nowInTimezone(timezone));

  const [view, setView] = useState<CalendarView>('day');

  const changePeriod = (direction: -1 | 1) =>
    setDate((current) =>
      view === 'month'
        ? calendarMoment(current, timezone).add(direction, 'month').toDate()
        : addDays(current, direction * (view === 'week' ? 7 : 1), timezone),
    );

  console.log({ events });

  return (
    <div
      className={clsx(
        'overflow-hidden',
        'flex flex-col',
        'min-h-0 flex-1',
        'rounded-lg',
        'bg-[#171F33]',
        'border border-[#464554]',
      )}
    >
      {/* Toolbar */}
      <CalendarToolbar<T>
        events={events}
        date={date}
        timezone={timezone}
        view={view}
        onDateChange={changePeriod}
        onToday={() => setDate(nowInTimezone(timezone))}
        onViewChange={setView}
        onCreate={onCreate}
      />
      {/* Calendar */}
      {events.length === 0 ? (
        <CalendarEmpty onCreate={onCreate} />
      ) : (
        <CalendarBoard<T>
          events={events}
          date={date}
          timezone={timezone}
          is12hrFormat={is12hrFormat}
          onCreateSelect={onCreateSelect}
        />
      )}
      {/* <div className="flex-1 p-4">{today.toISOString()}</div> */}
    </div>
  );
}
