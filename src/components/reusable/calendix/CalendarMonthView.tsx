import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import type { CalendarEvent } from './calendar.types';
import { calendarMoment, nowInTimezone } from './calendar.utils';

interface CalendarMonthViewProps<T> {
  events?: CalendarEvent<T>[];
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

interface MonthDrag<T> {
  event?: CalendarEvent<T>;
  startClientX: number;
  startClientY: number;
  startDayIndex: number;
}

const WEEK_DAYS = 7;
const EVENT_HEIGHT = 22;
const EVENT_GAP = 2;
const HEADER_HEIGHT = 34;
const MAX_VISIBLE_EVENTS = 2;

type MonthSegment<T> = {
  event: CalendarEvent<T>;
  start: number;
  end: number;
  lane: number;
};

export default function CalendarMonthView<T>({
  events = [],
  date,
  timezone,
  renderEvent,
  onEventClick,
  onEventDragEnd,
  onCreateSelect,
}: CalendarMonthViewProps<T>) {
  const [now] = useState(() => nowInTimezone(timezone));
  const [selection, setSelection] = useState<{
    anchor: number;
    current: number;
  } | null>(null);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [dropDayIndex, setDropDayIndex] = useState<number | null>(null);
  const [overflowDayIndex, setOverflowDayIndex] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const overflowRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<MonthDrag<T> | null>(null);

  const monthStart = calendarMoment(date, timezone).startOf('month');
  const gridStart = monthStart.clone().startOf('isoWeek');
  const gridEnd = monthStart
    .clone()
    .endOf('month')
    .endOf('isoWeek')
    .startOf('day');
  const days = Math.round(gridEnd.diff(gridStart, 'days')) + 1;
  const weekCount = days / WEEK_DAYS;
  const calendarDays = Array.from({ length: days }, (_, index) =>
    gridStart.clone().add(index, 'days'),
  );

  const getDayIndex = (clientX: number, clientY: number) => {
    const grid = gridRef.current;
    if (!grid) return 0;
    const rect = grid.getBoundingClientRect();
    const relativeX = Math.min(
      Math.max(clientX - rect.left, 0),
      rect.width - 1,
    );
    const relativeY = Math.min(
      Math.max(clientY - rect.top, 0),
      rect.height - 1,
    );
    const column = Math.min(
      Math.floor((relativeX / rect.width) * WEEK_DAYS),
      6,
    );
    const rowHeight = rect.height / weekCount;
    const row = Math.min(Math.floor(relativeY / rowHeight), weekCount - 1);
    return row * WEEK_DAYS + column;
  };

  const releasePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const resetDrag = () => {
    dragRef.current = null;
    setSelection(null);
    setDraggedEventId(null);
    setDropDayIndex(null);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const dayIndex = getDayIndex(event.clientX, event.clientY);
    dragRef.current = {
      startClientX: event.clientX,
      startClientY: event.clientY,
      startDayIndex: dayIndex,
    };
    setSelection({ anchor: dayIndex, current: dayIndex });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dayIndex = getDayIndex(event.clientX, event.clientY);
    if (drag.event) {
      setDropDayIndex(dayIndex);
    } else {
      setSelection({ anchor: drag.startDayIndex, current: dayIndex });
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const endDayIndex = getDayIndex(event.clientX, event.clientY);
    const distance = Math.hypot(
      event.clientX - drag.startClientX,
      event.clientY - drag.startClientY,
    );

    if (drag.event) {
      if (distance >= 5 || endDayIndex !== drag.startDayIndex) {
        const originalStart = calendarMoment(drag.event.startDate, timezone);
        const originalEnd = calendarMoment(drag.event.endDate, timezone);
        const target = calendarDays[endDayIndex].clone().startOf('day');
        const dayOffset = target.diff(
          originalStart.clone().startOf('day'),
          'days',
        );
        onEventDragEnd?.(drag.event, {
          startDate: originalStart.clone().add(dayOffset, 'days').toISOString(),
          endDate: originalEnd.clone().add(dayOffset, 'days').toISOString(),
        });
      } else {
        onEventClick?.(drag.event);
      }
    } else {
      const startIndex = Math.min(drag.startDayIndex, endDayIndex);
      const endIndex = Math.max(drag.startDayIndex, endDayIndex);
      const startDate = calendarDays[startIndex].clone().startOf('day');
      const endDate = calendarDays[endIndex]
        .clone()
        .add(1, 'day')
        .startOf('day');
      onCreateSelect?.({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    }

    releasePointer(event);
    resetDrag();
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    releasePointer(event);
    resetDrag();
  };

  const getRowSegments = (rowIndex: number) => {
    const rowStart = calendarDays[rowIndex * WEEK_DAYS];
    const rowEnd = rowStart.clone().add(WEEK_DAYS, 'days');
    const segments = events.flatMap((event) => {
      const eventStart = calendarMoment(event.startDate, timezone);
      const eventEnd = calendarMoment(event.endDate, timezone);
      if (eventEnd.isSameOrBefore(rowStart) || eventStart.isSameOrAfter(rowEnd))
        return [];
      const start = Math.max(
        0,
        eventStart.clone().startOf('day').diff(rowStart, 'days'),
      );
      const end = Math.min(
        WEEK_DAYS,
        Math.ceil(eventEnd.clone().startOf('day').diff(rowStart, 'days')) || 1,
      );
      return [{ event, start, end }];
    });
    const laneEnds: number[] = [];
    const overflow = new Map<number, CalendarEvent<T>[]>();
    const visibleSegments: MonthSegment<T>[] = [];

    segments.forEach((segment) => {
      let lane = 0;
      while ((laneEnds[lane] ?? 0) > segment.start) lane += 1;
      if (lane >= MAX_VISIBLE_EVENTS) {
        for (let day = segment.start; day < segment.end; day += 1) {
          const dayEvents = overflow.get(day) ?? [];
          dayEvents.push(segment.event);
          overflow.set(day, dayEvents);
        }
        return;
      }

      laneEnds[lane] = segment.end;
      visibleSegments.push({ ...segment, lane });
    });

    return { segments: visibleSegments, overflow };
  };

  useEffect(() => {
    if (overflowDayIndex === null) return;

    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (overflowRef.current?.contains(event.target as Node)) return;

      setOverflowDayIndex(null);
    };
    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
    };
  }, [overflowDayIndex]);

  return (
    <div
      className={clsx(
        'text-[#C7C4D7]',
        'overflow-hidden',
        'flex flex-col',
        'flex-1 min-h-0',
        'bg-[#171F33]',
      )}
    >
      <div
        className={clsx(
          'grid grid-cols-7',
          'bg-[#171F33]',
          'border-b border-[#464554]/70',
        )}
      >
        {calendarDays.slice(0, WEEK_DAYS).map((day) => (
          <div
            className={clsx(
              'text-[#908FA0] text-xs',
              'flex justify-center items-center h-10',
              'border-r border-[#464554]/70',
            )}
            key={day.format('dd')}
          >
            {day.format('ddd')}
          </div>
        ))}
      </div>
      <div
        className={clsx(
          'relative',
          'grid grid-cols-7',
          'flex-1 min-h-0',
          draggedEventId || selection ? 'cursor-grabbing' : 'cursor-crosshair',
        )}
        ref={gridRef}
        style={{ gridTemplateRows: `repeat(${weekCount}, minmax(0, 1fr))` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.isSame(monthStart, 'month');
          const isToday = day.isSame(now, 'day');
          const selected =
            selection &&
            index >= Math.min(selection.anchor, selection.current) &&
            index <= Math.max(selection.anchor, selection.current);
          const dropTarget = dropDayIndex === index;

          return (
            <div
              className={clsx(
                'relative overflow-visible',
                'min-h-0',
                'p-1',
                'border-b border-r border-[#464554]/70',
                isToday && 'bg-[#8083FF]/10',
                selected && 'bg-[#7AA7FF]/20',
                dropTarget && 'bg-[#8083FF]/20',
              )}
              key={day.format('YYYY-MM-DD')}
            >
              <div
                className={clsx(
                  isCurrentMonth ? 'text-[#C7C4D7]' : 'text-[#626274]',
                  'text-xs',
                  'flex justify-center items-center gap-1',
                )}
              >
                {day.date() === 1 && (
                  <span className="text-[10px] text-[#908FA0]">
                    {day.format('MMM')}
                  </span>
                )}
                <span
                  className={clsx(
                    'text-[#C0C1FF]',
                    isToday &&
                      'flex justify-center items-center w-6 h-6 rounded-full bg-[#8083FF]/40',
                  )}
                >
                  {day.format('D')}
                </span>
              </div>
              {getRowSegments(Math.floor(index / WEEK_DAYS)).overflow.get(
                index % WEEK_DAYS,
              )?.length ? (
                <button
                  className={clsx(
                    'text-[#AEB7FF] hover:text-white',
                    'text-[11px] text-left truncate',
                    'absolute z-30 left-1 right-1',
                    'mt-1',
                  )}
                  type="button"
                  onPointerDown={(pointerEvent) =>
                    pointerEvent.stopPropagation()
                  }
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    setOverflowDayIndex(index);
                  }}
                  style={{
                    top: `${HEADER_HEIGHT + MAX_VISIBLE_EVENTS * (EVENT_HEIGHT + EVENT_GAP) - 2}px`,
                  }}
                >
                  +
                  {
                    getRowSegments(Math.floor(index / WEEK_DAYS)).overflow.get(
                      index % WEEK_DAYS,
                    )?.length
                  }{' '}
                  more
                </button>
              ) : null}
            </div>
          );
        })}
        {Array.from({ length: weekCount }, (_, rowIndex) =>
          getRowSegments(rowIndex).segments.map(
            ({ event, start, end, lane }) => (
              <div
                className={clsx(
                  'absolute z-20 overflow-hidden',
                  'min-w-0',
                  'px-1',
                  'rounded-md',
                  draggedEventId === event.id
                    ? 'border border-dashed border-[#8083FF] bg-[#8083FF]/50 opacity-60'
                    : 'border border-[#8083FF] bg-[#8083FF]/30 hover:bg-[#8083FF]/60',
                )}
                key={`${event.id}-${rowIndex}`}
                style={{
                  top: `calc(${(rowIndex * 100) / weekCount}% + ${HEADER_HEIGHT + lane * (EVENT_HEIGHT + EVENT_GAP)}px)`,
                  left: `calc(${(start * 100) / WEEK_DAYS}% + 2px)`,
                  width: `calc(${((end - start) * 100) / WEEK_DAYS}% - 4px)`,
                  height: `${EVENT_HEIGHT}px`,
                }}
                onPointerDown={(pointerEvent) => {
                  pointerEvent.stopPropagation();

                  if (pointerEvent.button !== 0) return;

                  pointerEvent.preventDefault();

                  const segmentStart = rowIndex * WEEK_DAYS + start;

                  dragRef.current = {
                    event,
                    startClientX: pointerEvent.clientX,
                    startClientY: pointerEvent.clientY,
                    startDayIndex: segmentStart,
                  };

                  setSelection(null);
                  setDraggedEventId(event.id);
                  setDropDayIndex(segmentStart);

                  gridRef.current?.setPointerCapture(pointerEvent.pointerId);
                }}
              >
                {renderEvent ? (
                  renderEvent(event)
                ) : (
                  <div
                    className={clsx(
                      'font-semibold',
                      'text-[11px] leading-5 truncate',
                    )}
                  >
                    {event.title}
                  </div>
                )}
              </div>
            ),
          ),
        )}
        {overflowDayIndex !== null && (
          <div
            className={clsx(
              'absolute z-100 overflow-y-auto',
              'max-w-[calc(100%-16px)] w-64 max-h-100',
              'p-2',
              'rounded-md',
              'bg-[#131B2E]',
              'border border-[#464554]',
              'shadow-xl',
            )}
            ref={overflowRef}
            style={{
              left: `calc(${((overflowDayIndex % WEEK_DAYS) * 100) / WEEK_DAYS}% + 4px)`,
              top:
                overflowDayIndex / WEEK_DAYS < weekCount / 2
                  ? `calc(${(Math.floor(overflowDayIndex / WEEK_DAYS) * 100) / weekCount}% + ${HEADER_HEIGHT + MAX_VISIBLE_EVENTS * (EVENT_HEIGHT + EVENT_GAP) + 24}px)`
                  : `calc(${((Math.floor(overflowDayIndex / WEEK_DAYS) + 1) * 100) / weekCount}% - 8px)`,
              transform:
                overflowDayIndex / WEEK_DAYS < weekCount / 2
                  ? undefined
                  : 'translateY(-100%)',
            }}
            onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
          >
            <div
              className={clsx(
                'text-xs text-[#908FA0]',
                'mb-1 pb-1',
                'border-b border-[#464554]',
              )}
            >
              {calendarDays[overflowDayIndex].format('dddd, MMM D')}
            </div>
            <div className="flex flex-col gap-2">
              {events
                .filter((event) => {
                  const day = calendarDays[overflowDayIndex];
                  const start = calendarMoment(event.startDate, timezone);
                  const end = calendarMoment(event.endDate, timezone);

                  return (
                    start.isBefore(day.clone().add(1, 'day')) &&
                    end.isAfter(day)
                  );
                })
                .map((event) => (
                  <div
                    className={clsx(
                      'text-[#C7C4D7] text-[11px] text-left',
                      'truncate',
                      'block',
                      'min-w-0 w-full',
                      'rounded',
                      'hover:bg-[#8083FF]/30',
                      'cursor-pointer',
                    )}
                    key={event.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setOverflowDayIndex(null);
                      onEventClick?.(event);
                    }}
                    onKeyDown={(keyEvent) => {
                      if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                        keyEvent.preventDefault();
                        setOverflowDayIndex(null);
                        onEventClick?.(event);
                      }
                    }}
                  >
                    {renderEvent ? renderEvent(event) : event.title}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
