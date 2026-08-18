import clsx from 'clsx';

export default function CalendarMonthView() {
  return (
    <div
      className={clsx(
        'text-[#C7C4D7] text-center',
        'flex flex-col justify-center items-center gap-4',
        'flex-1',
        'p-4',
      )}
    >
      <h4 className={clsx('font-semibold', 'text-white text-xl')}>
        Coming Soon...
      </h4>
    </div>
  );
}
