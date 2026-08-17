export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEvent<T> {
  id: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  data: T;
}

export interface PositionedCalendarEvent<T> {
  event: CalendarEvent<T>;
  position: {
    top: number;
    height: number;
    startMinutes: number;
    durationMinutes: number;
  } | null;
  columnIndex: number;
  columnCount: number;
}
