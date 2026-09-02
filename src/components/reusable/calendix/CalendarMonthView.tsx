import { useRef, useState } from 'react';

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
  const gridRef = useRef<HTMLDivElement | null>(null);
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
    return segments.map((segment) => {
      let lane = 0;
      while ((laneEnds[lane] ?? 0) > segment.start) lane += 1;
      laneEnds[lane] = segment.end;
      return { ...segment, lane };
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#171F33] text-[#C7C4D7]">
      <div className="grid grid-cols-7 border-b border-[#464554]/70 bg-[#171F33]">
        {calendarDays.slice(0, WEEK_DAYS).map((day) => (
          <div
            key={day.format('dd')}
            className="flex h-10 items-center justify-center border-r border-[#464554]/70 font-inter text-xs text-[#908FA0]"
          >
            {day.format('ddd')}
          </div>
        ))}
      </div>
      <div
        ref={gridRef}
        className={clsx(
          'relative grid min-h-0 flex-1 grid-cols-7',
          draggedEventId || selection ? 'cursor-grabbing' : 'cursor-crosshair',
        )}
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
              key={day.format('YYYY-MM-DD')}
              className={clsx(
                'relative min-h-0 overflow-hidden border-b border-r border-[#464554]/70 p-1',
                isToday && 'bg-[#8083FF]/10',
                selected && 'bg-[#7AA7FF]/20',
                dropTarget && 'bg-[#8083FF]/20',
              )}
            >
              <div
                className={clsx(
                  'flex justify-center gap-1 font-inter text-xs',
                  isCurrentMonth ? 'text-[#C7C4D7]' : 'text-[#626274]',
                )}
              >
                {day.date() === 1 && (
                  <span className="text-[10px] text-[#908FA0]">
                    {day.format('MMM')}
                  </span>
                )}
                <span
                  className={clsx(
                    isToday &&
                      'flex h-6 w-6 items-center justify-center rounded-full bg-[#8083FF]/40 text-[#C0C1FF]',
                  )}
                >
                  {day.format('D')}
                </span>
              </div>
            </div>
          );
        })}
        {Array.from({ length: weekCount }, (_, rowIndex) =>
          getRowSegments(rowIndex).map(({ event, start, end, lane }) => (
            <div
              key={`${event.id}-${rowIndex}`}
              className={clsx(
                'absolute z-20 min-w-0 overflow-hidden rounded-md px-1',
                draggedEventId === event.id
                  ? 'border border-dashed border-[#8083FF] bg-[#8083FF]/50 opacity-60'
                  : 'border border-[#8083FF] bg-[#8083FF]/30 hover:bg-[#8083FF]/60',
              )}
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
                <div className="truncate font-inter text-[11px] font-semibold leading-5">
                  {event.title}
                </div>
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
