import clsx from 'clsx';
import { motion } from 'motion/react';

interface ProgressBarProps {
  className?: string;
  value: number;
  total: number;
}

export default function ProgressBar({
  className,
  value,
  total,
}: ProgressBarProps) {
  const progress =
    total <= 0 ? 0 : Math.min(Math.max((value / total) * 100, 0), 100);

  return (
    <div
      className={clsx(
        'relative h-2 w-full rounded-full bg-[#2D3449]',
        className,
      )}
    >
      <motion.div
        className="h-full rounded-[inherit] bg-[#C0C1FF]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      />
    </div>
  );
}
