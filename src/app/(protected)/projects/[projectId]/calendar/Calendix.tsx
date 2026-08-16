import { useState } from 'react';

import clsx from 'clsx';

import type { CalendarEvent, CalendarView } from './calendar.types';
import { nowInTimezone } from './calendar.utils';
import CalendarBoard from './CalendarBoard';
import CalendarEmpty from './CalendarEmpty';
import CalendarToolbar from './CalendarToolbar';

import { defaultTimezone } from '@/lib/date-time';

interface Calendix<T> {
  events?: CalendarEvent<T>[];
  timezone?: string;
  is12hrFormat?: boolean;
  onCreate?: () => void;
}

export default function Calendix<T>({
  events = [],
  timezone = defaultTimezone,
  is12hrFormat = true,
  onCreate,
}: Calendix<T>) {
  const [date, setDate] = useState(() => nowInTimezone(timezone));

  const [view, setView] = useState<CalendarView>('day');

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
        />
      )}
      {/* <div className="flex-1 p-4">{today.toISOString()}</div> */}
    </div>
  );
}
