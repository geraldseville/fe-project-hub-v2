import clsx from 'clsx';

interface SkeletonLoadingProps {
  className?: string;
}

export default function SkeletonLoading({ className }: SkeletonLoadingProps) {
  return (
    <div
      className={clsx('rounded', 'animate-pulse', 'bg-[#334155]', className)}
    />
  );
}
