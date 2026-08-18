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
import CalendarTimeSlots from './CalendarTimeSlots';

interface CalendarWeekViewProps<T> {
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

interface EventDrag<T> {
  event: CalendarEvent<T>;
  mode: 'move' | 'resize';
  startClientX: number;
  startClientY: number;
  startDayIndex: number;
}

const WEEK_DAYS = 7;

export default function CalendarWeekView<T>({
  events = [],
  date,
  timezone,
  is12hrFormat = true,
  renderEvent,
  onEventClick,
  onEventDragEnd,
  onCreateSelect,
}: CalendarWeekViewProps<T>) {
  const [now, setNow] = useState(() => nowInTimezone(timezone));
  const [selectionAnchor, setSelectionAnchor] = useState<number | null>(null);
  const [selectionDayIndex, setSelectionDayIndex] = useState<number | null>(
    null,
  );
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [resizedEventHeight, setResizedEventHeight] = useState<number | null>(
    null,
  );

  const gridRef = useRef<HTMLDivElement | null>(null);
  const eventDragRef = useRef<EventDrag<T> | null>(null);

  const hours = Array.from({ length: 24 });
  const timeFormat = is12hrFormat ? 'h A' : 'HH:mm';
  const currentTime = calendarMoment(now, timezone);
  const currentTimeMinutes = currentTime.hours() * 60 + currentTime.minutes();

  const weekStart = calendarMoment(date, timezone).startOf('isoWeek');
  const weekDays = useMemo(
    () =>
      Array.from({ length: WEEK_DAYS }, (_, index) =>
        weekStart.clone().add(index, 'days'),
      ),
    [weekStart],
  );

  const selectionPreview = useMemo(() => {
    if (
      selectionStart === null ||
      selectionEnd === null ||
      selectionDayIndex === null
    ) {
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
    const columnWidth = 100 / WEEK_DAYS;

    return {
      top: minutesToPixels(startMinutes),
      height: minutesToPixels(durationMinutes),
      left: `calc(${columnWidth * selectionDayIndex}% + 4px)`,
      width: `calc(${columnWidth}% - 8px)`,
    };
  }, [selectionDayIndex, selectionEnd, selectionStart]);

  const getDayIndexFromPointer = (clientX: number) => {
    const grid = gridRef.current;

    if (!grid) {
      return 0;
    }

    const rect = grid.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const columnWidth = rect.width / WEEK_DAYS;

    return Math.min(
      Math.max(Math.floor(relativeX / columnWidth), 0),
      WEEK_DAYS - 1,
    );
  };

  const getMinutesFromPointer = (clientY: number) => {
    const grid = gridRef.current;

    if (!grid) {
      return 0;
    }

    const rect = grid.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const clampedY = Math.min(Math.max(relativeY, 0), rect.height);
    const minutes = pixelsToMinutes(clampedY, 15);

    return Math.min(Math.max(minutes, 0), 24 * 60);
  };

  const getEventDayIndex = (event: CalendarEvent<T>) => {
    const eventDay = calendarMoment(event.startDate, timezone);

    return weekDays.findIndex((day) => eventDay.isSame(day, 'day'));
  };

  const getSelectionRange = (anchor: number, current: number) => {
    const minDuration = 15;
    let startMinutes = Math.min(anchor, current);
    let endMinutes = Math.max(anchor, current);

    if (endMinutes - startMinutes < minDuration) {
      if (current < anchor) {
        startMinutes = anchor - minDuration;
        endMinutes = anchor;
      } else {
        startMinutes = anchor;
        endMinutes = anchor + minDuration;
      }
    }

    startMinutes = Math.max(0, startMinutes);
    endMinutes = Math.min(24 * 60, endMinutes);

    if (endMinutes - startMinutes < minDuration) {
      startMinutes = Math.max(0, endMinutes - minDuration);
    }

    return { startMinutes, endMinutes };
  };

  const getDragSelection = (
    event: CalendarEvent<T>,
    offsetY: number,
    dayOffset: number,
  ) => {
    const startTime = calendarMoment(event.startDate, timezone);
    const endTime = calendarMoment(event.endDate, timezone);
    const deltaMinutes = pixelsToMinutes(offsetY, 15);

    return {
      startDate: startTime
        .clone()
        .add(dayOffset, 'days')
        .add(deltaMinutes, 'minutes')
        .toISOString(),
      endDate: endTime
        .clone()
        .add(dayOffset, 'days')
        .add(deltaMinutes, 'minutes')
        .toISOString(),
    };
  };

  const getResizeSelection = (
    event: CalendarEvent<T>,
    clientY: number,
    dayIndex: number,
  ) => {
    const day = weekDays[dayIndex] ?? weekDays[0];
    const startTime = calendarMoment(event.startDate, timezone);
    const visibleStart = momentTimezone.max(
      startTime,
      day.clone().startOf('day'),
    );
    const startMinutes = Math.max(0, visibleStart.diff(day, 'minutes'));
    const endMinutes = Math.min(
      24 * 60,
      Math.max(startMinutes + 15, getMinutesFromPointer(clientY)),
    );

    return {
      startDate: startTime.toISOString(),
      endDate: day
        .clone()
        .startOf('day')
        .add(endMinutes, 'minutes')
        .toISOString(),
      height: minutesToPixels(endMinutes - startMinutes),
    };
  };

  const getClampedDayOffset = (startDayIndex: number, dayOffset: number) => {
    const nextDayIndex = Math.min(
      Math.max(startDayIndex + dayOffset, 0),
      WEEK_DAYS - 1,
    );

    return nextDayIndex - startDayIndex;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    const dayIndex = getDayIndexFromPointer(event.clientX);
    const minutes = getMinutesFromPointer(event.clientY);

    setSelectionDayIndex(dayIndex);
    setSelectionAnchor(minutes);
    setSelectionStart(minutes);
    setSelectionEnd(minutes);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const eventDrag = eventDragRef.current;

    if (eventDrag) {
      if (eventDrag.mode === 'resize') {
        setResizedEventHeight(
          getResizeSelection(
            eventDrag.event,
            event.clientY,
            eventDrag.startDayIndex,
          ).height,
        );
      } else {
        setDragOffsetX(event.clientX - eventDrag.startClientX);
        setDragOffsetY(event.clientY - eventDrag.startClientY);
      }
      return;
    }

    if (selectionAnchor === null || selectionDayIndex === null) {
      return;
    }

    const nextMinutes = getMinutesFromPointer(event.clientY);
    const selection = getSelectionRange(selectionAnchor, nextMinutes);
    setSelectionStart(selection.startMinutes);
    setSelectionEnd(selection.endMinutes);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const eventDrag = eventDragRef.current;

    if (eventDrag) {
      const offsetY = event.clientY - eventDrag.startClientY;
      const offsetX = event.clientX - eventDrag.startClientX;
      const columnWidth =
        (gridRef.current?.getBoundingClientRect().width ?? 0) / WEEK_DAYS;
      const dayOffset = getClampedDayOffset(
        eventDrag.startDayIndex,
        columnWidth > 0 ? Math.round(offsetX / columnWidth) : 0,
      );

      if (eventDrag.mode === 'resize') {
        const selection = getResizeSelection(
          eventDrag.event,
          event.clientY,
          eventDrag.startDayIndex,
        );
        onEventDragEnd?.(eventDrag.event, selection);
      } else if (Math.abs(offsetX) >= 5 || Math.abs(offsetY) >= 5) {
        const selection = getDragSelection(eventDrag.event, offsetY, dayOffset);
        onEventDragEnd?.(eventDrag.event, selection);
      } else {
        onEventClick?.(eventDrag.event);
      }

      eventDragRef.current = null;
      setDraggedEventId(null);
      setDragOffsetX(0);
      setDragOffsetY(0);
      setResizedEventHeight(null);
      event.currentTarget.releasePointerCapture(event.pointerId);
      return;
    }

    if (selectionAnchor === null || selectionDayIndex === null) {
      return;
    }

    const nextMinutes = getMinutesFromPointer(event.clientY);
    const { startMinutes, endMinutes } = getSelectionRange(
      selectionAnchor,
      nextMinutes,
    );

    setSelectionStart(startMinutes);
    setSelectionEnd(endMinutes);
    event.currentTarget.releasePointerCapture(event.pointerId);

    const day = weekDays[selectionDayIndex];
    const startDateIso = day
      .clone()
      .startOf('day')
      .add(startMinutes, 'minutes')
      .toISOString();
    const endDateIso = day
      .clone()
      .startOf('day')
      .add(endMinutes, 'minutes')
      .toISOString();

    onCreateSelect?.({
      startDate: startDateIso,
      endDate: endDateIso,
    });

    setSelectionAnchor(null);
    setSelectionDayIndex(null);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    eventDragRef.current = null;
    setDraggedEventId(null);
    setDragOffsetX(0);
    setDragOffsetY(0);
    setResizedEventHeight(null);
    setSelectionAnchor(null);
    setSelectionDayIndex(null);
    setSelectionStart(null);
    setSelectionEnd(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
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
          'sticky z-2 top-0',
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

        {/* Weekday headers */}
        <div className="flex flex-1">
          {weekDays.map((day) => {
            const isToday = day.isSame(currentTime, 'day');

            return (
              <div
                className={clsx(
                  'flex-1',
                  'h-full',
                  'border-r border-[#464554]/70',
                  isToday && 'bg-[#8083FF]/10',
                )}
                key={day.format('YYYY-MM-DD')}
              >
                <div className="flex flex-col justify-center items-center h-full">
                  <div
                    className={clsx(
                      'font-inter text-xs',
                      isToday ? 'text-[#C0C1FF]' : 'text-[#908FA0]',
                    )}
                  >
                    {day.format('ddd')}
                  </div>

                  <div
                    className={clsx(
                      'font-inter font-semibold text-sm',
                      isToday
                        ? 'text-[#C0C1FF] bg-[#8083FF]/30 rounded-full w-7 h-7 flex items-center justify-center'
                        : 'text-[#C7C4D7]',
                    )}
                  >
                    {day.format('D')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-1 flex w-full">
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
                {weekDays[0].clone().add(hour, 'hours').format(timeFormat)}
              </div>
            );
          })}
        </div>

        {/* Week grid */}
        <div
          className={clsx(
            'relative flex flex-1',
            selectionStart !== null && 'cursor-grabbing',
          )}
          ref={gridRef}
          style={{
            cursor: selectionStart !== null ? 'ns-resize' : 'crosshair',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {weekDays.map((day, dayIndex) => {
            const isToday = day.isSame(currentTime, 'day');
            const dayEvents = getOverlappingEventLayout(
              events,
              day.toDate(),
              timezone,
            );

            return (
              <div
                className={clsx(
                  'relative flex-1',
                  'border-r border-[#464554]/70',
                  isToday && 'bg-[#8083FF]/5',
                )}
                key={day.format('YYYY-MM-DD')}
              >
                {/* Grid */}
                <CalendarTimeSlots
                  layout={dayEvents}
                  dayLabel={day.format('dddd')}
                />

                {/* Current Time Line Indicator */}
                {isToday && (
                  <div
                    className={clsx('group', 'absolute z-10 inset-x-0')}
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

                {/* Events */}
                {dayEvents.map(
                  ({ event, position, columnIndex, columnCount }) => {
                    const widthPercentage = 100 / columnCount;
                    const eventDayIndex = getEventDayIndex(event);

                    return (
                      <div
                        className={clsx(
                          'text-[#C7C4D7]',
                          'overflow-hidden',
                          'absolute z-20',
                          'rounded-md',
                          'cursor-pointer',
                        )}
                        key={event.id}
                        style={{
                          top: position.top,
                          height:
                            draggedEventId === event.id &&
                            resizedEventHeight !== null
                              ? resizedEventHeight
                              : position.height,
                          left: `calc(${widthPercentage * columnIndex}% + 4px)`,
                          width: `calc(${widthPercentage}% - 8px)`,
                          transform:
                            draggedEventId === event.id
                              ? `translate(${dragOffsetX}px, ${dragOffsetY}px)`
                              : 'translate(0, 0)',
                          transition:
                            draggedEventId === event.id
                              ? 'none'
                              : 'transform 0.2s ease-out',
                          zIndex: draggedEventId === event.id ? 30 : undefined,
                        }}
                        onPointerDown={(pointerEvent) => {
                          pointerEvent.stopPropagation();
                          if (pointerEvent.button === 0) {
                            pointerEvent.preventDefault();
                            eventDragRef.current = {
                              event,
                              mode: 'move',
                              startClientX: pointerEvent.clientX,
                              startClientY: pointerEvent.clientY,
                              startDayIndex:
                                eventDayIndex >= 0 ? eventDayIndex : dayIndex,
                            };
                            setDraggedEventId(event.id);
                            setDragOffsetX(0);
                            setDragOffsetY(0);
                            gridRef.current?.setPointerCapture(
                              pointerEvent.pointerId,
                            );
                          }
                        }}
                      >
                        {renderEvent ? (
                          renderEvent(event)
                        ) : (
                          <div
                            className={clsx(
                              'relative block',
                              'w-full',
                              'py-1 px-2',
                              draggedEventId === event.id
                                ? 'bg-[#8083FF]/50 border-[#8083FF]/80 border-dashed opacity-60'
                                : 'bg-[#8083FF]/30 hover:bg-[#8083FF]/60 border border-[#8083FF]',
                            )}
                          >
                            <div
                              className={clsx(
                                'font-inter font-semibold',
                                'text-sm truncate',
                              )}
                            >
                              {event.title}
                            </div>
                            <div className="text-xs">
                              {calendarMoment(event.startDate, timezone).format(
                                is12hrFormat ? 'h:mm A' : 'HH:mm',
                              )}
                              {' - '}
                              {calendarMoment(event.endDate, timezone).format(
                                is12hrFormat ? 'h:mm A' : 'HH:mm',
                              )}
                            </div>
                          </div>
                        )}
                        <div
                          className={clsx(
                            'absolute inset-x-0 bottom-0',
                            'h-2',
                            'cursor-ns-resize',
                          )}
                          role="button"
                          tabIndex={-1}
                          aria-label={`Resize ${event.title}`}
                          onPointerDown={(pointerEvent) => {
                            pointerEvent.stopPropagation();
                            if (pointerEvent.button !== 0) return;

                            pointerEvent.preventDefault();
                            eventDragRef.current = {
                              event,
                              mode: 'resize',
                              startClientX: pointerEvent.clientX,
                              startClientY: pointerEvent.clientY,
                              startDayIndex:
                                eventDayIndex >= 0 ? eventDayIndex : dayIndex,
                            };
                            setDraggedEventId(event.id);
                            setResizedEventHeight(position.height);
                            gridRef.current?.setPointerCapture(
                              pointerEvent.pointerId,
                            );
                          }}
                        />
                      </div>
                    );
                  },
                )}
              </div>
            );
          })}

          {/* Selection Preview */}
          {selectionPreview && !draggedEventId && (
            <div
              className={clsx(
                'absolute z-30',
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
        </div>
      </div>
    </div>
  );
}
