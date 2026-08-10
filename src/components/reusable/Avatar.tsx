import clsx from 'clsx';

interface AvatarProps {
  className?: string;
  initial: string | null | undefined;
}

export default function Avatar({ className, initial }: AvatarProps) {
  return (
    <div
      className={clsx(
        'font-inter font-bold',
        'text-white text-[12px]',
        'relative',
        'flex justify-center items-center shrink-0',
        'min-w-10 w-10 h-10',
        'rounded-full',
        'bg-[#072635]',
        'border border-[#072635]',
        'shadow-sm',
        'select-none',
        className,
      )}
    >
      {initial ?? '?'}
    </div>
  );
}
