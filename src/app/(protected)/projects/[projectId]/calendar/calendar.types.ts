export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEvent<T> {
  id: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  data: T;
}
