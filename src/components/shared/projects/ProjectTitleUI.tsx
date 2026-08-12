import clsx from 'clsx';

interface ProjectTitleUIProps {
  title: string;
}

export default function ProjectTitleUI({ title }: ProjectTitleUIProps) {
  return (
    <div
      className={clsx(
        'font-hanken-grotesk font-bold',
        'text-[#DAE2FD] text-[16px] leading-tight truncate',
      )}
    >
      {title}
    </div>
  );
}
