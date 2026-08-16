import { useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import type { CalendarEvent } from './calendar.types';
import {
  calendarMoment,
  getOverlappingEventLayout,
  HOUR_HEIGHT,
  minutesToPixels,
  pixelsToMinutes,
} from './calendar.utils';

interface CalendarBoardProps<T> {
  events?: CalendarEvent<T>[];
  date: Date;
  timezone: string;
  is12hrFormat?: boolean;
  onCreateSelect?: (selection: { startDate: string; endDate: string }) => void;
}

export default function CalendarBoard<T>({
  events = [],
  date,
  timezone,
  is12hrFormat = true,
  onCreateSelect,
}: CalendarBoardProps<T>) {
  const [selectionAnchor, setSelectionAnchor] = useState<number | null>(null);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const hours = Array.from({ length: 24 });

  const timeFormat = is12hrFormat ? 'h A' : 'HH:mm';

  const day = calendarMoment(date, timezone).startOf('day');

  const getMinutesFromPointer = (clientY: number) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return 0;
    }

    const rect = canvas.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const clampedY = Math.min(Math.max(relativeY, 0), rect.height);
    const minutes = pixelsToMinutes(clampedY, 15);

    return Math.min(Math.max(minutes, 0), 24 * 60);
  };

  const selectionPreview = useMemo(() => {
    if (selectionStart === null || selectionEnd === null) {
      return null;
    }

    const startMinutes = Math.min(selectionStart, selectionEnd);
    const endMinutes = Math.max(selectionStart, selectionEnd);
    const durationMinutes = Math.max(endMinutes - startMinutes, 15);

    return {
      top: minutesToPixels(startMinutes),
      height: minutesToPixels(durationMinutes),
      left: '4px',
      width: 'calc(100% - 8px)',
    };
  }, [selectionEnd, selectionStart]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    const minutes = getMinutesFromPointer(event.clientY);

    setSelectionAnchor(minutes);
    setSelectionStart(minutes);
    setSelectionEnd(minutes);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (selectionAnchor === null) {
      return;
    }

    const nextMinutes = getMinutesFromPointer(event.clientY);

    if (nextMinutes >= selectionAnchor) {
      setSelectionStart(Math.min(selectionAnchor, nextMinutes));
      setSelectionEnd(nextMinutes);
      return;
    }

    setSelectionStart(nextMinutes);
    setSelectionEnd(selectionAnchor);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (selectionAnchor === null) {
      return;
    }

    const nextMinutes = getMinutesFromPointer(event.clientY);

    if (nextMinutes >= selectionAnchor) {
      setSelectionStart(Math.min(selectionAnchor, nextMinutes));
      setSelectionEnd(nextMinutes);
    } else {
      setSelectionStart(nextMinutes);
      setSelectionEnd(selectionAnchor);
    }

    event.currentTarget.releasePointerCapture(event.pointerId);

    const startDateIso = momentTimezone()
      .startOf('day')
      .add(selectionStart, 'minutes')
      .toISOString();

    const endDateIso = momentTimezone()
      .startOf('day')
      .add(selectionEnd, 'minutes')
      .toISOString();

    onCreateSelect?.({
      startDate: startDateIso,
      endDate: endDateIso,
    });

    setSelectionAnchor(null);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

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
          className={clsx(
            'relative flex-1',
            'border-r border-[#464554]/70',
            selectionStart !== null && 'cursor-grabbing',
          )}
          ref={canvasRef}
          style={{
            cursor: selectionStart !== null ? 'ns-resize' : 'crosshair',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            if (selectionAnchor !== null) {
              setSelectionAnchor(null);
              setSelectionStart(null);
              setSelectionEnd(null);
            }
          }}
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

          {selectionPreview && (
            <div
              className={clsx(
                'absolute z-99',
                'rounded-md',
                'pointer-events-none',
                'transition-[top,height,left,width] duration-200 ease-out',
                'bg-[#7AA7FF]',
                'border border-[#7AA7FF]',
                'shadow-[0_0_0_1px_rgba(122,167,255,0.18)]',
              )}
              style={{
                top: selectionPreview.top,
                height: selectionPreview.height,
                left: selectionPreview.left,
                width: selectionPreview.width,
              }}
            >
              <div
                className={clsx(
                  'font-medium',
                  'text-[#D9E7FF] text-[10px]',
                  'flex justify-center items-center',
                  'h-full',
                )}
              >
                {momentTimezone()
                  .startOf('day')
                  .add(selectionStart, 'minutes')
                  .format(is12hrFormat ? 'h:mm A' : 'HH:mm')}
                {' - '}
                {momentTimezone()
                  .startOf('day')
                  .add(selectionEnd, 'minutes')
                  .format(is12hrFormat ? 'h:mm A' : 'HH:mm')}
              </div>
            </div>
          )}

          {/* Events */}
          {getOverlappingEventLayout(events, date, timezone).map(
            ({ event, position, columnIndex, columnCount }) => {
              const widthPercentage = 100 / columnCount;

              return (
                <div
                  className={clsx(
                    'text-[#C7C4D7]',
                    'overflow-hidden',
                    'absolute',
                    'py-1 px-2',
                    'rounded-md',
                    'bg-[#8083FF]/30',
                    'border border-[#8083FF]',
                  )}
                  key={event.id}
                  style={{
                    top: position.top,
                    height: position.height,
                    left: `calc(${widthPercentage * columnIndex}% + 4px)`,
                    width: `calc(${widthPercentage}% - 8px)`,
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
            },
          )}
        </div>
      </div>
    </div>
  );
}
