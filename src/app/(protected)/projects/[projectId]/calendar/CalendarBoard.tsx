import type { CalendarEvent, CalendarView } from './calendar.types';
import CalendarDayView from './CalendarDayView';
import CalendarWeekView from './CalendarWeekView';

interface CalendarBoardProps<T> {
  view?: CalendarView;
  events?: CalendarEvent<T>[];
  unscheduled?: CalendarEvent<T>[];
  date: Date;
  timezone: string;
  is12hrFormat?: boolean;
  renderEvent?: (event: CalendarEvent<T>) => React.ReactNode;
  onEventClick?: (event: CalendarEvent<T>) => void;
  onEventDragEnd?: (
    event: CalendarEvent<T>,
    selection: { startDate: string; endDate: string },
  ) => void;
  onCreateSelect?: (selection: { startDate: string; endDate: string }) => void;
}

export default function CalendarBoard<T>({
  view = 'day',
  events = [],
  date,
  timezone,
  is12hrFormat = true,
  renderEvent,
  onEventClick,
  onEventDragEnd,
  onCreateSelect,
}: CalendarBoardProps<T>) {
  return (
    <>
      {view === 'day' ? (
        <CalendarDayView
          events={events}
          date={date}
          timezone={timezone}
          is12hrFormat={is12hrFormat}
          renderEvent={renderEvent}
          onEventClick={onEventClick}
          onEventDragEnd={onEventDragEnd}
          onCreateSelect={onCreateSelect}
        />
      ) : view === 'week' ? (
        <CalendarWeekView
          events={events}
          date={date}
          timezone={timezone}
          is12hrFormat={is12hrFormat}
          renderEvent={renderEvent}
          onEventClick={onEventClick}
          onEventDragEnd={onEventDragEnd}
          onCreateSelect={onCreateSelect}
        />
      ) : null}
    </>
  );
}
