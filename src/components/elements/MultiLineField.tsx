import { type ChangeEvent, type TextareaHTMLAttributes } from 'react';

import clsx from 'clsx';

interface MultiLineFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  classNames?: {
    root?: string;
    input?: string;
  };
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function MultiLineField({
  classNames,
  id = 'multi-line-field',
  placeholder = 'Multiline Field',
  disabled = false,
  value,
  onChange,
  ...restProps
}: MultiLineFieldProps) {
  return (
    <div className={clsx(classNames?.root, 'relative')}>
      <textarea
        className={clsx(
          'placeholder:italic placeholder:text-placeholder',
          'block',
          'min-w-[200px] w-full min-h-[120px] h-[120px] resize-y',
          'py-2 px-4',
          'rounded-lg',
          disabled ? 'bg-[#222A3D]' : 'bg-[#060E20]',
          'border border-[#464554]',
          disabled && 'is-disabled',
          classNames?.input,
        )}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-disabled={disabled}
        {...restProps}
      ></textarea>
    </div>
  );
}
