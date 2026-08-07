'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import SegmentedTab from '@/components/elements/SegmentedTabs';
import {
  IconAngleDown,
  IconCalendar3,
  IconCalendarTime,
  IconCaretLeft,
  IconCaretRight,
  IconClock1,
  IconGlobe,
} from '@/components/svgs/icons';

type ISOString = string;

type DateTimeType = 'date-time' | 'date' | 'time';

type CalendarView = 'days' | 'months' | 'years';

type TabView = 'date' | 'time';

type DateTimeSelectResult = {
  iso: string;
  formattedDate: string;
  formattedTime: string;
  formattedFull: string;
  day: number;
  month: number; // 1-12
  year: number;
  hour: number; // 0-23
  minute: number;
  second: number;
  weekday: string;
  monthName: string;
  timezone: string;
  unix: number;
};

const Weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

interface DateTimePickerProps {
  classNames?: {
    root?: string;
    trigger?: string;
    dropdown?: string;
  };
  id?: string;
  type?: DateTimeType;
  formatDate?: string;
  formatTime?: string;
  placeholder?: string;
  timezone?: string;
  showTimezone?: boolean;
  minuteStep?: number;
  value?: ISOString | null;
  onChange?: (selected: DateTimeSelectResult) => void;
}

export default function DateTimePicker({
  classNames,
  id,
  type = 'date-time',
  formatDate = 'MM/DD/YYYY',
  formatTime = 'hh:mm A',
  placeholder = 'Select...',
  timezone,
  showTimezone = true,
  minuteStep = 1,
  value,
  onChange,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [view, setView] = useState<CalendarView>('days');

  const [activeTab, setActiveTab] = useState<TabView>('date');

  const selectedHourRef = useRef<HTMLButtonElement | null>(null);

  const selectedMinuteRef = useRef<HTMLButtonElement | null>(null);

  const hoursContainerRef = useRef<HTMLDivElement | null>(null);

  const minutesContainerRef = useRef<HTMLDivElement | null>(null);

  const tz = useMemo(() => timezone || momentTimezone.tz.guess(), [timezone]);

  const selectedMoment = useMemo(() => {
    if (!value) return null;

    const m = momentTimezone(value).tz(tz);

    return m.isValid() ? m : null;
  }, [value, tz]);

  const is12HourFormat = useMemo(() => {
    return /[aA]/.test(formatTime);
  }, [formatTime]);

  const useShortMonthNames = useMemo(() => {
    return /MMM/.test(formatDate);
  }, [formatDate]);

  const isDoubleDigitDay = useMemo(() => {
    return /DD/.test(formatDate);
  }, [formatDate]);

  const [viewDate, setViewDate] = useState(() => {
    return selectedMoment ? selectedMoment.clone() : momentTimezone().tz(tz);
  });

  const activeAnchor = selectedMoment || viewDate;

  const calendarGrid = useMemo(() => {
    const startOfMonth = viewDate.clone().startOf('month');
    const daysInMonth = viewDate.daysInMonth();
    const startDayOfWeek = startOfMonth.day();

    const prevMonth = viewDate.clone().subtract(1, 'month');
    const prevMonthDays = prevMonth.daysInMonth();

    const days: Array<{
      day: number;
      currentMonth: boolean;
      momentObj: moment.Moment;
    }> = [];

    // Fill preceding days from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;

      days.push({
        day: dayNum,
        currentMonth: false,
        momentObj: prevMonth.clone().date(dayNum),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        momentObj: viewDate.clone().date(i),
      });
    }

    // Fill tailing days for 6 full grid rows (42 slots)
    const remainingSlots = 42 - days.length;

    const nextMonth = viewDate.clone().add(1, 'month');

    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        day: i,
        currentMonth: false,
        momentObj: nextMonth.clone().date(i),
      });
    }

    return days;
  }, [viewDate]);

  const displayString = useMemo(() => {
    if (!selectedMoment) return null;
    if (type === 'date') return selectedMoment.format(formatDate);
    if (type === 'time') return selectedMoment.format(formatTime);
    return `${selectedMoment.format(formatDate)} ${selectedMoment.format(formatTime)}`;
  }, [selectedMoment, type, formatDate, formatTime]);

  const navigateHeader = (direction: 'prev' | 'next') => {
    const delta = direction === 'next' ? 1 : -1;

    if (view === 'days') {
      setViewDate(viewDate.clone().add(delta, 'month'));
    } else if (view === 'months') {
      setViewDate(viewDate.clone().add(delta, 'year'));
    } else if (view === 'years') {
      setViewDate(viewDate.clone().add(delta * 12, 'years'));
    }
  };

  const handleUpdate = (newMoment: moment.Moment) => {
    const iso = newMoment.toISOString();

    const payload: DateTimeSelectResult = {
      iso,
      formattedDate: newMoment.format(formatDate),
      formattedTime: newMoment.format(formatTime),
      formattedFull: newMoment.format(`${formatDate} ${formatTime}`),
      day: newMoment.date(),
      month: newMoment.month() + 1, // 1-indexed
      year: newMoment.year(),
      hour: newMoment.hour(), // 0-23
      minute: newMoment.minute(),
      second: newMoment.second(),
      weekday: newMoment.format('dddd'),
      monthName: newMoment.format('MMMM'),
      timezone: tz,
      unix: newMoment.unix(),
    };

    onChange?.(payload);
  };

  const handleSelectDay = (itemMoment: moment.Moment) => {
    const updated = itemMoment.clone();
    setViewDate(updated.clone());
    handleUpdate(updated);
  };

  const handleSelectMonth = (monthIndex: number) => {
    const updated = activeAnchor.clone().month(monthIndex);
    setViewDate(updated);
    setView('days');
    if (selectedMoment) handleUpdate(updated);
  };

  const handleSelectYear = (year: number) => {
    const updated = activeAnchor.clone().year(year);
    setViewDate(updated);
    setView('months');
    if (selectedMoment) handleUpdate(updated);
  };

  const handleHourChange = (hourValue: number) => {
    let newHour = hourValue;
    if (is12HourFormat) {
      const isPM = activeAnchor.hour() >= 12;
      if (isPM && hourValue < 12) newHour = hourValue + 12;
      if (!isPM && hourValue === 12) newHour = 0;
    }
    const updated = activeAnchor.clone().hour(newHour);
    handleUpdate(updated);
  };

  const handleMinuteChange = (minute: number) => {
    const updated = activeAnchor.clone().minute(minute);
    handleUpdate(updated);
  };

  const handleAmPmToggle = (period: 'AM' | 'PM') => {
    let currentHour = activeAnchor.hour();
    if (period === 'PM' && currentHour < 12) currentHour += 12;
    if (period === 'AM' && currentHour >= 12) currentHour -= 12;
    const updated = activeAnchor.clone().hour(currentHour);
    handleUpdate(updated);
  };

  useEffect(() => {
    if (isOpen && (type === 'time' || activeTab === 'time')) {
      const timer = setTimeout(() => {
        selectedHourRef.current?.scrollIntoView({
          block: 'center',
          behavior: 'auto',
        });
        selectedMinuteRef.current?.scrollIntoView({
          block: 'center',
          behavior: 'auto',
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTab, type, activeAnchor]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: () => {
      setIsOpen((prev) => !prev);
      setView('days');
    },
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);

  const dismiss = useDismiss(context);

  const role = useRole(context, { role: 'listbox' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const setReferenceRef = useCallback(
    (node: HTMLButtonElement | null) => {
      refs.setReference(node);
    },
    [refs],
  );

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  return (
    <div className={clsx('relative w-full', classNames?.root)} id={id}>
      {/* Trigger */}
      <button
        className={clsx(
          'group',
          'flex justify-start items-center gap-4',
          'w-full h-[47px]',
          'py-2 px-4',
          'rounded-lg',
          'bg-[#060E20]',
          'border border-[#464554]',
          'focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-0 focus:ring-offset-[#060E20]',
          classNames?.trigger,
        )}
        ref={setReferenceRef}
        {...getReferenceProps()}
        type="button"
      >
        {type === 'date' ? (
          <IconCalendar3 className="min-w-3.5 w-3.5 h-3.5" />
        ) : type === 'time' ? (
          <IconClock1 className="min-w-3.5 w-3.5 h-3.5" />
        ) : (
          <IconCalendarTime className="min-w-3.5 w-3.5 h-3.5" />
        )}
        {displayString ? (
          <div className="text-white text-sm leading-tight truncate">
            {displayString}
          </div>
        ) : (
          <div className="text-placeholder text-sm leading-tight truncate">
            {placeholder}
          </div>
        )}
        <IconAngleDown
          className={clsx(
            'text-placeholder group-hover:text-white',
            'ml-auto',
            isOpen ? 'rotate-180' : 'rotate-0',
            'transition-all duration-200',
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <FloatingPortal>
          <div
            className={clsx(
              'z-50 overflow-hidden',
              'max-w-[284px] min-w-[284px] w-full',
              'p-4',
              'rounded-lg',
              'bg-[#060E20]',
              'border border-[#464554]',
              'shadow-xl',
              classNames?.dropdown,
            )}
            ref={setFloatingRef}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {type === 'date-time' && (
              <SegmentedTab
                classNames={{
                  root: 'mb-3 bg-[#0f172b]/70! border-[#0f172b]/70!',
                  tabIndicator: '',
                }}
                id="dateTimeTab"
                selected={{
                  id: activeTab,
                  icon:
                    activeTab === 'date' ? (
                      <IconCalendar3 className="" />
                    ) : (
                      <IconClock1 className="" />
                    ),
                  label: activeTab === 'date' ? 'Date' : 'Time',
                }}
                options={[
                  {
                    id: 'date',
                    icon: <IconCalendar3 className="" />,
                    label: 'Date',
                  },
                  {
                    id: 'time',
                    icon: <IconClock1 className="" />,
                    label: 'Time',
                  },
                ]}
                onSelect={(select) => {
                  setActiveTab(select.id as TabView);
                }}
              />
            )}

            {/* Date Tab View */}
            {(type === 'date' ||
              (type === 'date-time' && activeTab === 'date')) && (
              <div className="max-w-[250px] min-h-[300px]">
                {/* Header Navigation */}
                <div
                  className={clsx(
                    'flex justify-between items-center',
                    'pb-3 px-1',
                  )}
                >
                  <button
                    className={clsx(
                      'font-semibold',
                      'text-slate-800 dark:text-slate-100',
                      'text-sm',
                      'px-2.5 py-1',
                      'rounded-lg',
                      'transition',
                      'hover:bg-slate-100 dark:hover:bg-slate-800',
                    )}
                    type="button"
                    onClick={() => {
                      if (view === 'days') setView('months');
                      else if (view === 'months') setView('years');
                    }}
                  >
                    {view === 'days' && viewDate.format('MMMM YYYY')}
                    {view === 'months' && viewDate.format('YYYY')}
                    {view === 'years' &&
                      `${viewDate.year() - 5} - ${viewDate.year() + 6}`}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      className={clsx(
                        'text-slate-500',
                        'p-1.5',
                        'rounded-lg',
                        'transition',
                        'hover:bg-slate-100 dark:hover:bg-slate-800',
                      )}
                      type="button"
                      onClick={() => navigateHeader('prev')}
                    >
                      <IconCaretLeft className="w-[16px] h-[16px]" />
                    </button>
                    <button
                      className={clsx(
                        'text-slate-500',
                        'p-1.5',
                        'rounded-lg',
                        'transition',
                        'hover:bg-slate-100 dark:hover:bg-slate-800',
                      )}
                      type="button"
                      onClick={() => navigateHeader('next')}
                    >
                      <IconCaretRight className="w-[16px] h-[16px]" />
                    </button>
                  </div>
                </div>

                {/* Days Selector */}
                {view === 'days' && (
                  <>
                    <div
                      className={clsx(
                        'text-[12px] text-center uppercase',
                        'grid grid-cols-7 gap-1',
                        'h-[32px]',
                      )}
                    >
                      {Weekdays.map((d) => (
                        <div
                          className={clsx(
                            'flex justify-center items-center',
                            'w-8 h-8',
                            'p-1',
                          )}
                          key={`weekday-${d}`}
                        >
                          {d.slice(0, 1)}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarGrid.map((item, idx) => {
                        const isSelected =
                          selectedMoment &&
                          item.momentObj.isSame(selectedMoment, 'day');

                        const isToday = item.momentObj.isSame(
                          momentTimezone().tz(tz),
                          'day',
                        );

                        const formattedDayText = isDoubleDigitDay
                          ? String(item.day).padStart(2, '0')
                          : String(item.day);

                        return (
                          <button
                            className={clsx(
                              'relative',
                              'w-8 h-8',
                              'rounded-xl',
                              'transition-all duration-200',
                              !item.currentMonth
                                ? 'text-slate-300 dark:text-slate-600'
                                : isSelected
                                  ? 'font-semibold text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-100 shadow-md'
                                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
                              isToday && 'border border-slate-700',
                            )}
                            key={`day-${idx}-${item.day}`}
                            type="button"
                            onClick={() => handleSelectDay(item.momentObj)}
                          >
                            {formattedDayText}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Months Selector */}
                {view === 'months' && (
                  <div className={clsx('grid grid-cols-3 gap-2', 'py-2')}>
                    {(useShortMonthNames
                      ? momentTimezone.monthsShort()
                      : momentTimezone.months()
                    ).map((m, idx) => (
                      <button
                        className={clsx(
                          'font-medium',
                          'text-xs',
                          'py-3',
                          'rounded-xl',
                          'transition',
                          viewDate.month() === idx
                            ? 'font-semibold text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-100'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
                        )}
                        key={m}
                        type="button"
                        onClick={() => handleSelectMonth(idx)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}

                {/* Years Selector */}
                {view === 'years' && (
                  <div className="grid grid-cols-3 gap-2 py-2">
                    {Array.from(
                      { length: 12 },
                      (_, i) => viewDate.year() - 5 + i,
                    ).map((yr) => (
                      <button
                        className={clsx(
                          'font-medium',
                          'text-xs',
                          'py-3',
                          'rounded-xl',
                          'transition',
                          viewDate.year() === yr
                            ? 'font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
                        )}
                        key={yr}
                        type="button"
                        onClick={() => handleSelectYear(yr)}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Time Tab View */}
            {(type === 'time' ||
              (type === 'date-time' && activeTab === 'time')) && (
              <div
                className={clsx(
                  'flex flex-col justify-between gap-2',
                  'max-w-[250px] min-h-[300px] h-[300px]',
                )}
              >
                <div
                  className={clsx(
                    'flex justify-between gap-2',
                    'flex-1 h-[calc(100%-44px)]',
                  )}
                >
                  {/* Hour Selector */}
                  <div
                    className={clsx(
                      'overflow-auto',
                      'flex flex-col gap-2',
                      'flex-1 h-full',
                    )}
                    ref={hoursContainerRef}
                  >
                    {Array.from({ length: is12HourFormat ? 12 : 24 }, (_, i) =>
                      is12HourFormat ? i + 1 : i,
                    ).map((h) => {
                      const currentHour = activeAnchor.hour();
                      const displayHour = is12HourFormat
                        ? currentHour % 12 === 0
                          ? 12
                          : currentHour % 12
                        : currentHour;

                      const isSelectedHour = displayHour === h;

                      return (
                        <button
                          ref={isSelectedHour ? selectedHourRef : null}
                          className={clsx(
                            'py-1 px-2',
                            'rounded-sm',
                            isSelectedHour
                              ? 'font-semibold text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-100 shadow-md'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
                          )}
                          key={`hour-${h}`}
                          type="button"
                          onClick={() => handleHourChange(h)}
                        >
                          {h
                            .toString()
                            .padStart(
                              formatTime.includes('hh') ||
                                formatTime.includes('HH')
                                ? 2
                                : 1,
                              '0',
                            )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Minute Selector */}
                  <div
                    className={clsx(
                      'overflow-auto',
                      'flex flex-col gap-2',
                      'flex-1 h-full',
                    )}
                    ref={minutesContainerRef}
                  >
                    {Array.from(
                      { length: Math.ceil(60 / minuteStep) },
                      (_, i) => i * minuteStep,
                    ).map((m) => {
                      const isSelectedMinute = activeAnchor.minute() === m;

                      return (
                        <button
                          className={clsx(
                            'py-1 px-2',
                            'rounded-sm',
                            isSelectedMinute
                              ? 'font-semibold text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-100 shadow-md'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
                          )}
                          ref={isSelectedMinute ? selectedMinuteRef : null}
                          key={`minute-${m}`}
                          type="button"
                          onClick={() => handleMinuteChange(m)}
                        >
                          {m.toString().padStart(2, '0')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {is12HourFormat && (
                  <SegmentedTab
                    classNames={{
                      root: 'w-fit h-[36px] mx-auto bg-slate-800 border-none!',
                      tabItem:
                        'text-[12px] max-w-24! min-w-24! w-24! h-[28px]! text-white',
                      tabIndicator: 'bg-slate-900',
                    }}
                    id="12hourFormat"
                    selected={
                      activeAnchor.hour() < 12
                        ? { id: 'AM', label: 'AM' }
                        : { id: 'PM', label: 'PM' }
                    }
                    options={[
                      { id: 'AM', label: 'AM' },
                      { id: 'PM', label: 'PM' },
                    ]}
                    onSelect={(select) => {
                      handleAmPmToggle(select.id as 'AM' | 'PM');
                    }}
                  />
                )}
              </div>
            )}

            {/* Timezone Badge */}
            {showTimezone && (
              <div
                className={clsx(
                  'text-slate-400 text-[11px]',
                  'flex justify-between items-center',
                  'mt-4 pt-4',
                  'border-t border-slate-100 dark:border-slate-800',
                )}
              >
                <span className="flex items-center gap-1">
                  <IconGlobe className="min-w-3 w-3 h-3" /> Timezone:
                </span>
                <span
                  className={clsx(
                    'font-mono font-medium',
                    'text-slate-600 dark:text-slate-300',
                  )}
                >
                  {tz} ({momentTimezone.tz(tz).format('z')})
                </span>
              </div>
            )}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}
