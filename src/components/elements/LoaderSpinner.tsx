import clsx from 'clsx';

interface LoaderSpinnerProps {
  className?: string;
}

export default function LoaderSpinner({ className }: LoaderSpinnerProps) {
  return (
    <div
      className={clsx(
        className,
        'w-8 h-8',
        'border-2 rounded-full',
        'animate-spin',
        'border-[#1000A9]/25 border-t-[#1000A9]',
      )}
    />
  );
}
