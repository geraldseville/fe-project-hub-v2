import React from 'react';

import clsx from 'clsx';

import { toCapitalize } from '@/utils/string.utils';

import Button from '@/components/elements/Button';
import SegmentedTab from '@/components/elements/SegmentedTabs';
import SkeletonLoading from '@/components/elements/SkeletonLoading';
import {
  IconAngleLeft,
  IconAngleRight,
  IconCalendar1,
  IconPlus1,
} from '@/components/svgs/icons';

import type { CalendarEvent, CalendarView } from './calendar.types';
import { displayDate } from './calendar.utils';

interface CalendarToolbarProps<T> {
  isLoading?: boolean;
  events: CalendarEvent<T>[];
  date: Date;
  timezone: string;
  view: CalendarView;
  viewOptions: CalendarView[];
  onDateChange: (direction: -1 | 1) => void;
  onToday: () => void;
  onViewUnscheduled: () => void;
  onViewChange: (view: CalendarView) => void;
  onCreate?: () => void;
}

export default function CalendarToolbar<T>({
  isLoading,
  events = [],
  date,
  timezone,
  view,
  viewOptions,
  onDateChange,
  onToday,
  onViewUnscheduled,
  onViewChange,
  onCreate,
}: CalendarToolbarProps<T>) {
  const unscheduledEvents = events.filter(
    (event) => !event.startDate || !event.endDate,
  );

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center gap-3',
        'p-4',
        'border-b border-[#464554]',
      )}
    >
      {isLoading ? (
        <>
          <div className="flex items-center gap-2">
            <SkeletonLoading className="w-12 h-8" />
            <SkeletonLoading className="w-12 h-8" />
            <SkeletonLoading className="w-22 h-8" />
          </div>
          <SkeletonLoading className="w-52 h-5" />
          <div className={clsx('flex flex-wrap items-center gap-2', 'ml-auto')}>
            <SkeletonLoading className="w-42 h-8" />
            <SkeletonLoading className="w-50 h-8" />
            <SkeletonLoading className="w-50 h-8" />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Button
              className="min-w-12! w-12! h-8! px-0"
              buttonStyle="secondary"
              type="button"
              text=""
              icon={<IconAngleLeft className="min-w-1.5 w-1.5 h-auto" />}
              aria-label="Previous period"
              onClick={() => onDateChange(-1)}
            />
            <Button
              className="min-w-12! w-12! h-8! px-0"
              buttonStyle="secondary"
              type="button"
              text=""
              icon={<IconAngleRight className="min-w-1.5 w-1.5 h-auto" />}
              aria-label="Next period"
              onClick={() => onDateChange(1)}
            />
            <Button
              className="min-w-22! w-22! h-8!"
              buttonStyle="secondary"
              type="button"
              text="Today"
              onClick={onToday}
            />
          </div>
          <h2 className={clsx('font-semibold', 'text-[#DAE2FD]', 'min-w-52')}>
            {displayDate(date, view, timezone)}
          </h2>
          <div className={clsx('flex flex-wrap items-center gap-2', 'ml-auto')}>
            {unscheduledEvents.length > 0 && (
              <Button
                className="min-w-0! px-4"
                buttonStyle="secondary"
                type="button"
                icon={<IconCalendar1 className="min-w-3.5 w-3.5 h-auto" />}
                text={`Unscheduled • ${unscheduledEvents.length}`}
                onClick={onViewUnscheduled}
              />
            )}
            <SegmentedTab
              classNames={{
                root: 'h-10!',
                tabItem: 'text-[12px] min-w-16! w-16!',
              }}
              selected={{
                id: view,
                label: toCapitalize(view),
              }}
              disabled={events.length === 0}
              options={viewOptions?.map((viewItem) => ({
                id: viewItem,
                label: toCapitalize(viewItem),
              }))}
              onSelect={(selected) => {
                onViewChange(selected.id as CalendarView);
              }}
            />
            {onCreate && (
              <Button
                buttonStyle="primary"
                type="button"
                icon={<IconPlus1 className="min-w-3.5 w-3.5 h-auto" />}
                text="Add task"
                onClick={onCreate}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
