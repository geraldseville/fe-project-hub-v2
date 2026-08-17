import clsx from 'clsx';

import Button from '@/components/elements/Button';
import { IconPlus1 } from '@/components/svgs/icons';

interface CalendarEmptyProps {
  onCreate?: () => void;
}

export default function CalendarEmpty({ onCreate }: CalendarEmptyProps) {
  return (
    <div
      className={clsx(
        'text-[#C7C4D7] text-center',
        'flex flex-col justify-center items-center gap-3',
        'flex-1',
        'p-4',
      )}
    >
      <h2 className={clsx('font-semibold', 'text-white text-xl')}>
        Nothing scheduled yet
      </h2>
      <p className={clsx('leading-tight', 'mb-3')}>
        Create a task or drag across the calendar to reserve time.
      </p>
      {onCreate && (
        <Button
          buttonStyle="primary"
          type="button"
          icon={<IconPlus1 className="min-w-3.5 w-3.5 h-auto" />}
          text="Create task"
          onClick={onCreate}
        />
      )}
    </div>
  );
}
