import { useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import type { CalendarEvent } from './calendar.types';
import {
  calendarMoment,
  getOverlappingEventLayout,
  HOUR_HEIGHT,
  minutesToPixels,
  nowInTimezone,
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
  const [now, setNow] = useState(() => nowInTimezone(timezone));

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

  const handleSlotSelect = (minutes: number) => {
    const slotStart = Math.min(Math.max(minutes, 0), 24 * 60);
    const slotEnd = Math.min(Math.max(slotStart + 15, slotStart + 15), 24 * 60);

    const startDate = calendarMoment(date, timezone)
      .startOf('day')
      .add(slotStart, 'minutes')
      .toISOString();

    const endDate = calendarMoment(date, timezone)
      .startOf('day')
      .add(slotEnd, 'minutes')
      .toISOString();

    onCreateSelect?.({ startDate, endDate });
  };

  const currentTime = calendarMoment(now, timezone);

  const isToday = calendarMoment(date, timezone).isSame(currentTime, 'day');

  const currentTimeMinutes = currentTime.hours() * 60 + currentTime.minutes();

  const selectionPreview = useMemo(() => {
    if (selectionStart === null || selectionEnd === null) {
      return null;
    }

    const minDelta = 15;
    const startMinutes = Math.min(selectionStart, selectionEnd);
    const endMinutes = Math.max(selectionStart, selectionEnd);
    const normalizedEndMinutes =
      endMinutes - startMinutes < minDelta
        ? startMinutes + minDelta
        : endMinutes;
    const durationMinutes = Math.max(
      normalizedEndMinutes - startMinutes,
      minDelta,
    );

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
    const rawStart = Math.min(selectionAnchor, nextMinutes);
    const rawEnd = Math.max(selectionAnchor, nextMinutes);
    const minDelta = 15;

    if (rawEnd - rawStart < minDelta) {
      if (nextMinutes >= selectionAnchor) {
        setSelectionStart(selectionAnchor);
        setSelectionEnd(selectionAnchor + minDelta);
      } else {
        setSelectionStart(selectionAnchor - minDelta);
        setSelectionEnd(selectionAnchor);
      }
      return;
    }

    if (nextMinutes >= selectionAnchor) {
      setSelectionStart(rawStart);
      setSelectionEnd(rawEnd);
      return;
    }

    setSelectionStart(rawStart);
    setSelectionEnd(rawEnd);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (selectionAnchor === null) {
      return;
    }

    const nextMinutes = getMinutesFromPointer(event.clientY);
    const minDelta = 15;
    const rawStart = Math.min(selectionAnchor, nextMinutes);
    const rawEnd = Math.max(selectionAnchor, nextMinutes);
    const startMinutes = rawEnd - rawStart < minDelta ? rawStart : rawStart;
    const endMinutes =
      rawEnd - rawStart < minDelta ? rawStart + minDelta : rawEnd;

    setSelectionStart(startMinutes);
    setSelectionEnd(endMinutes);

    event.currentTarget.releasePointerCapture(event.pointerId);

    const startDateIso = momentTimezone
      .tz(timezone)
      .startOf('day')
      .add(startMinutes, 'minutes')
      .toISOString();

    const endDateIso = momentTimezone
      .tz(timezone)
      .startOf('day')
      .add(endMinutes, 'minutes')
      .toISOString();

    onCreateSelect?.({
      startDate: startDateIso,
      endDate: endDateIso,
    });

    setSelectionAnchor(null);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(nowInTimezone(timezone));
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [timezone]);

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
                {[0, 1, 2, 3].map((slotIndex) => {
                  const slotMinutes = hour * 60 + slotIndex * 15;

                  return (
                    <div
                      className={clsx(
                        'group/slot',
                        'absolute inset-x-0',
                        'h-1/4',
                        'px-1',
                        'transition-colors duration-200 ease-out',
                        'border-t border-dashed border-[#464554]/30',
                      )}
                      key={`${hour}-${slotIndex}`}
                      style={{
                        top: `${(HOUR_HEIGHT / 4) * slotIndex}px`,
                      }}
                    >
                      <button
                        className={clsx(
                          'text-[10px]',
                          'flex justify-center items-center',
                          'w-full h-full',
                          'rounded-md',
                          'hover:bg-[#C7C4D7]/[0.4]',
                          'active:bg-[#C7C4D7]/[0.08]',
                          'focus:outline-none',
                        )}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSlotSelect(slotMinutes);
                        }}
                        aria-label={`Select time slot ${slotMinutes} minutes`}
                      >
                        <div className="invisible group-hover/slot:visible">
                          New Event
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {isToday && (
            <div
              className={clsx(
                'group',
                // 'pointer-events-none',
                'absolute inset-x-0 z-10',
              )}
              style={{ top: `${minutesToPixels(currentTimeMinutes)}px` }}
            >
              <div className="relative h-px">
                <div
                  className={clsx(
                    'absolute left-0 right-0',
                    'border-t border-red-400',
                  )}
                />
                <div
                  className={clsx(
                    'absolute -left-1 -top-1',
                    'w-2 h-2',
                    'rounded-full',
                    'bg-red-400',
                  )}
                />
                <div
                  className={clsx(
                    'font-medium',
                    'text-white text-[9px]',
                    'absolute -top-5 left-1.5',
                    'px-1.5 py-0.5',
                    'rounded-full',
                    'bg-red-400/90',
                    'shadow-sm',
                    'invisible group-hover:visible',
                  )}
                >
                  {currentTime.format(is12hrFormat ? 'h:mm A' : 'HH:mm')}{' '}
                  {timezone}
                </div>
              </div>
            </div>
          )}

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
