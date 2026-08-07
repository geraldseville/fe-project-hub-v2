import clsx from 'clsx';

interface LabelFieldProps {
  className?: string;
  id?: string;
  text?: string;
}

export default function LabelField({
  className,
  id,
  text = 'Label',
}: LabelFieldProps) {
  return (
    <label
      className={clsx(
        className,
        'font-jetbrains-mono font-medium',
        'text-[#C7C4D7] leading-tight',
        'block',
        'mb-2',
      )}
      htmlFor={id}
    >
      {text}
    </label>
  );
}
