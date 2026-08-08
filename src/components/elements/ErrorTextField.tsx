import clsx from 'clsx';

interface ErrorTextFieldProps {
  className?: string;
  text?: string;
}

export default function ErrorTextField({
  className,
  text,
}: ErrorTextFieldProps) {
  if (!text) return null;

  return (
    <p className={clsx(className, 'text-red-400 leading-tight', 'mt-2')}>
      {text}
    </p>
  );
}
