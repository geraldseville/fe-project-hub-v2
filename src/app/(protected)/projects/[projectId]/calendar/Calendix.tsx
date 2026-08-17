import { useState } from 'react';

import clsx from 'clsx';

import type { CalendarEvent, CalendarView } from './calendar.types';
import { addDays, calendarMoment, nowInTimezone } from './calendar.utils';
import CalendarBoard from './CalendarBoard';
import CalendarEmpty from './CalendarEmpty';
import CalendarLoading from './CalendarLoading';
import CalendarToolbar from './CalendarToolbar';
import CalendarUnscheduled from './CalendarUnscheduled';

import { defaultTimezone } from '@/lib/date-time';

interface Calendix<T> {
  isLoading?: boolean;
  events?: CalendarEvent<T>[];
  timezone?: string;
  is12hrFormat?: boolean;
  viewOptions?: CalendarView[];
  renderEvent?: (event: CalendarEvent<T>) => React.ReactNode;
  onEventClick?: (event: CalendarEvent<T>) => void;
  onEventDragEnd?: (
    event: CalendarEvent<T>,
    selection: { startDate: string; endDate: string },
  ) => void;
  onCreate?: () => void;
  onCreateSelect?: (selection: { startDate: string; endDate: string }) => void;
}

export default function Calendix<T>({
  isLoading = false,
  events = [],
  timezone = defaultTimezone,
  is12hrFormat = true,
  viewOptions = ['day', 'week', 'month'],
  renderEvent,
  onEventClick,
  onEventDragEnd,
  onCreate,
  onCreateSelect,
}: Calendix<T>) {
  const [date, setDate] = useState<Date>(() => nowInTimezone(timezone));
  const [view, setView] = useState<CalendarView>('day');
  const [openUnscheduled, setOpenUnscheduled] = useState<boolean>(false);

  const scheduledEvents = events.filter(
    (event) => event.startDate && event.endDate,
  );

  const unscheduledEvents = events.filter(
    (event) => !event.startDate || !event.endDate,
  );

  const changePeriod = (direction: -1 | 1) => {
    setDate((current) =>
      view === 'month'
        ? calendarMoment(current, timezone).add(direction, 'month').toDate()
        : addDays(current, direction * (view === 'week' ? 7 : 1), timezone),
    );
  };

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
        isLoading={isLoading}
        events={events}
        date={date}
        timezone={timezone}
        view={view}
        viewOptions={viewOptions}
        onDateChange={changePeriod}
        onToday={() => setDate(nowInTimezone(timezone))}
        onViewUnscheduled={() => setOpenUnscheduled(true)}
        onViewChange={setView}
        onCreate={onCreate}
      />
      {/* Calendar */}
      {isLoading ? (
        <CalendarLoading />
      ) : events.length === 0 ? (
        <CalendarEmpty onCreate={onCreate} />
      ) : (
        <CalendarBoard<T>
          events={scheduledEvents}
          date={date}
          timezone={timezone}
          is12hrFormat={is12hrFormat}
          renderEvent={renderEvent}
          onEventClick={onEventClick}
          onEventDragEnd={onEventDragEnd}
          onCreateSelect={onCreateSelect}
        />
      )}
      {/* Unscheduled Drawer */}
      <CalendarUnscheduled<T>
        isOpen={openUnscheduled}
        onClose={() => setOpenUnscheduled(false)}
        unscheduledEvents={unscheduledEvents}
        onEventClick={onEventClick}
      />
    </div>
  );
}
