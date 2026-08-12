import clsx from 'clsx';

import AnimatedNumber from '@/components/elements/AnimatedNumber';
import { IconCheck3 } from '@/components/svgs/icons';

interface ProjectTaskCounterUIProps {
  current: number;
  total: number;
}

export default function ProjectTaskCounterUI({
  current,
  total,
}: ProjectTaskCounterUIProps) {
  return (
    <div className="flex justify-center items-center gap-1">
      <IconCheck3 className="w-4 h-4" />
      <div
        className={clsx(
          'font-medium',
          'text-[#C7C4D7] leading-tight whitespace-nowrap',
        )}
      >
        <AnimatedNumber value={current} /> / <AnimatedNumber value={total} />{' '}
        Tasks
      </div>
    </div>
  );
}
