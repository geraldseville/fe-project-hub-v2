import clsx from 'clsx';

import LoaderSpinner from '@/components/elements/LoaderSpinner';

export default function CalendarLoading() {
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
        Loading your calendar...
      </h4>
      <LoaderSpinner className="" />
    </div>
  );
}
