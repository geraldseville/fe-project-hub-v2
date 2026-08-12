import clsx from 'clsx';

interface ProjectDescriptionUIProps {
  description: string;
}

export default function ProjectDescriptionUI({
  description,
}: ProjectDescriptionUIProps) {
  return (
    <div
      className={clsx(
        'font-inter',
        'text-[#C7C4D7] leading-normal',
        'line-clamp-2',
        'min-h-[calc(1.5em*2)]',
        'mt-4',
      )}
    >
      {description}
    </div>
  );
}
