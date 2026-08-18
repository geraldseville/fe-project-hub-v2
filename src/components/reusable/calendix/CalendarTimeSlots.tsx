import clsx from 'clsx';

import type { PositionedCalendarEvent } from './calendar.types';
import { getFreeHorizontalRegions, HOUR_HEIGHT } from './calendar.utils';

interface CalendarTimeSlotsProps<T> {
  layout: PositionedCalendarEvent<T>[];
  dayLabel?: string;
}

const HOURS = Array.from({ length: 24 });
const SLOT_MINUTES = 15;

export default function CalendarTimeSlots<T>({
  layout,
  dayLabel,
}: CalendarTimeSlotsProps<T>) {
  return (
    <>
      {HOURS.map((_, hour) => {
        const isLast = hour === HOURS.length - 1;

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
              const slotStartMinutes = hour * 60 + slotIndex * SLOT_MINUTES;
              const slotEndMinutes = slotStartMinutes + SLOT_MINUTES;
              const freeRegions = getFreeHorizontalRegions(
                slotStartMinutes,
                slotEndMinutes,
                layout,
              );

              return (
                <div key={`${hour}-${slotIndex}`}>
                  <div
                    className={clsx(
                      'pointer-events-none',
                      'absolute inset-x-0',
                      'h-1/4',
                      'border-t border-dashed border-[#464554]/30',
                    )}
                    style={{
                      top: `${(HOUR_HEIGHT / 4) * slotIndex}px`,
                    }}
                  />

                  {freeRegions.map((region, regionIndex) => {
                    const ariaLabel = dayLabel
                      ? `Select time slot ${slotStartMinutes} minutes on ${dayLabel}`
                      : `Select time slot ${slotStartMinutes} minutes`;

                    return (
                      <div
                        className={clsx(
                          'group/slot',
                          'absolute',
                          'h-1/4',
                          'px-1',
                          'transition-colors duration-200 ease-out',
                        )}
                        key={`${hour}-${slotIndex}-${regionIndex}`}
                        style={{
                          top: `${(HOUR_HEIGHT / 4) * slotIndex}px`,
                          left: `calc(${region.leftPercent}% + 4px)`,
                          width: `calc(${region.widthPercent}% - 8px)`,
                        }}
                      >
                        <button
                          className={clsx(
                            'text-[10px]',
                            'flex justify-center items-center',
                            'w-full h-full min-w-0',
                            'rounded-md',
                            'hover:bg-[#C7C4D7]/40',
                            'active:bg-[#C7C4D7]/8',
                            'focus:outline-none',
                          )}
                          type="button"
                          aria-label={ariaLabel}
                        >
                          <div className="invisible truncate group-hover/slot:visible">
                            New Event
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
