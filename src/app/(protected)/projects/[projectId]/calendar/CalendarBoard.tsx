import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import type { CalendarEvent } from './calendar.types';
import {
  calendarMoment,
  getEventPosition,
  // getMinutesFromStartOfDay,
  HOUR_HEIGHT,
  minutesToPixels,
} from './calendar.utils';

interface CalendarBoardProps<T> {
  events?: CalendarEvent<T>[];
  date: Date;
  timezone: string;
  is12hrFormat?: boolean;
}

export default function CalendarBoard<T>({
  events = [],
  date,
  timezone,
  is12hrFormat = true,
}: CalendarBoardProps<T>) {
  const hours = Array.from({ length: 24 });

  const timeFormat = is12hrFormat ? 'h A' : 'HH:mm';

  const day = calendarMoment(date, timezone).startOf('day');

  return (
    <div className="relative overflow-y-auto">
      {/* Header */}
      <div
        className={clsx(
          'sticky z-20 top-0',
          'flex',
          'w-full h-14',
          'bg-[#171F33]',
          'border-b border-[#464554]/70',
        )}
      >
        {/* Time gutter */}
        <div
          className={clsx(
            'min-w-15 w-15',
            'h-full',
            'border-r border-[#464554]/70',
          )}
        />

        {/* Date */}
        <div
          className={clsx('flex-1', 'h-full', 'border-r border-[#464554]/70')}
        >
          <div className="flex flex-col justify-center items-center h-full">
            <div className="font-inter text-xs text-[#908FA0]">
              {day.format('ddd')}
            </div>

            <div className="font-inter text-sm font-semibold text-[#C7C4D7]">
              {day.format('D')}
            </div>
          </div>
        </div>
      </div>
      {/* Timeline */}
      <div className="flex w-full">
        {/* Time gutter */}
        <div className="min-w-15 w-15">
          {hours.map((_, hour) => {
            const isLast = hour === hours.length - 1;

            return (
              <div
                className={clsx(
                  'font-inter',
                  'text-[#908FA0] text-[10px]',
                  'relative',
                  'flex justify-end',
                  'pr-1',
                  !isLast && 'border-b',
                  'border-r border-[#464554]/70',
                )}
                key={hour}
                style={{
                  height: `${HOUR_HEIGHT}px`,
                }}
              >
                {day.clone().add(hour, 'hours').format(timeFormat)}
              </div>
            );
          })}
        </div>

        {/* Event canvas */}
        <div
          className={clsx('relative flex-1', 'border-r border-[#464554]/70')}
        >
          {/* Grid */}
          {hours.map((_, hour) => {
            const isLast = hour === hours.length - 1;

            return (
              <div
                className={clsx(
                  'relative',
                  !isLast && 'border-b border-[#464554]/70',
                )}
                key={hour}
                style={{
                  height: `${HOUR_HEIGHT}px`,
                }}
              >
                {/* 15-minute subdivisions */}
                <div
                  className={clsx(
                    'absolute inset-x-0',
                    'border-t border-dashed border-[#464554]/30',
                  )}
                  style={{
                    top: `${HOUR_HEIGHT / 4}px`,
                  }}
                />

                <div
                  className={clsx(
                    'absolute inset-x-0',
                    'border-t border-dashed border-[#464554]/30',
                  )}
                  style={{
                    top: `${HOUR_HEIGHT / 2}px`,
                  }}
                />

                <div
                  className={clsx(
                    'absolute inset-x-0',
                    'border-t border-dashed border-[#464554]/30',
                  )}
                  style={{
                    top: `${(HOUR_HEIGHT * 3) / 4}px`,
                  }}
                />
              </div>
            );
          })}

          {/* Events */}
          {events.map((event) => {
            const position = getEventPosition(
              event.startDate,
              event.endDate,
              date,
              timezone,
            );

            if (!position) {
              return null;
            }

            return (
              <div
                className={clsx(
                  'text-[#C7C4D7]',
                  'overflow-hidden',
                  'absolute left-1 right-1',
                  'py-1 px-2',
                  'rounded-md',
                  'bg-[#8083FF]/30',
                  'border border-[#8083FF]',
                )}
                key={event.id}
                style={{
                  top: position.top,
                  height: position.height,
                }}
              >
                <div
                  className={clsx(
                    'font-inter font-semibold',
                    'text-xs truncate',
                  )}
                >
                  {event.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
