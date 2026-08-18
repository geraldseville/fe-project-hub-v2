import { useState } from 'react';

import clsx from 'clsx';

import Button from '@/components/elements/Button';
import Drawer from '@/components/elements/Drawer';
import SingleLineField from '@/components/elements/SingleLineField';
import { IconClose1 } from '@/components/svgs/icons';

import { CalendarEvent } from './calendar.types';

interface CalendarUnscheduledProps<T> {
  isOpen: boolean;
  onClose: () => void;
  unscheduledEvents?: CalendarEvent<T>[];
  onEventClick?: (event: CalendarEvent<T>) => void;
}

export default function CalendarUnscheduled<T>({
  isOpen,
  onClose,
  unscheduledEvents = [],
  onEventClick,
}: CalendarUnscheduledProps<T>) {
  const [search, setSearch] = useState<string>('');

  const visibleEvents = unscheduledEvents.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCancel = () => {
    setSearch('');
    onClose();
  };

  return (
    <Drawer
      classNames={{
        content: clsx('overflow-y-hidden', 'flex flex-col', 'max-w-100!'),
      }}
      isOpen={isOpen}
      onClose={handleCancel}
    >
      {/* Head */}
      <div
        className={clsx(
          'py-4 px-6',
          'bg-[#334155]',
          'border-b border-[#464554]',
        )}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h2 className={clsx('font-bold', 'text-[20px]')}>
              Unscheduled Events
            </h2>
            <p className="text-tertiary">
              {unscheduledEvents.length} events without dates
            </p>
          </div>
          <button
            className={clsx(
              'flex justify-center items-center justify-self-end',
              'w-8 h-8',
            )}
            type="button"
            onClick={handleCancel}
          >
            <IconClose1 className="min-w-3.5 w-3.5 h-auto" />
          </button>
        </div>
      </div>
      {/* Body */}
      <div className={clsx('overflow-y-auto', 'flex-1 h-full', 'p-6')}>
        <SingleLineField
          classNames={{ root: 'mb-4' }}
          id="searchUnscheduledEvent"
          type="search"
          placeholder="Search Unscheduled Events..."
          value={search}
          onChange={(e) => {
            const newValue = e.target.value;

            setSearch(newValue);
          }}
        />
        {visibleEvents.length > 0 ? (
          <div className="flex flex-col gap-3">
            {visibleEvents.map((eventItem) => (
              <div
                className={clsx(
                  'w-full min-h-16',
                  'p-3',
                  'rounded-md',
                  'border border-[#8083FF]',
                )}
                key={`unscheduledItem-${eventItem.id}`}
              >
                <div
                  className={clsx(
                    'flex flex-row justify-between gap-2',
                    'pl-3',
                    'border-l-4 border-l-primary',
                  )}
                >
                  <div
                    className={clsx(
                      'font-inter font-semibold',
                      'text-xs text-left truncate',
                      'mt-1',
                    )}
                  >
                    {eventItem.title}
                  </div>
                  <Button
                    className={clsx(
                      'text-[12px]',
                      'self-end',
                      'min-w-0! h-8!',
                      'px-4!',
                    )}
                    buttonStyle="tertiary"
                    text="Schedule"
                    onClick={() => {
                      onEventClick?.(eventItem);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <i>No Match Found</i>
        )}
      </div>
    </Drawer>
  );
}
