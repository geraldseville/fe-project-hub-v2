export type CalendarView = 'day' | 'week' | 'month';

export type CalendarEvent<T> = {
  id: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  data: T;
};

export type PositionedCalendarEvent<T> = {
  event: CalendarEvent<T>;
  position: {
    top: number;
    height: number;
    startMinutes: number;
    durationMinutes: number;
  } | null;
  columnIndex: number;
  columnCount: number;
};

export type HorizontalRegion = {
  leftPercent: number;
  widthPercent: number;
};
