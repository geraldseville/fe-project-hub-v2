import React from 'react';

import clsx from 'clsx';

import { IconCheck1 } from '@/components/svgs/icons';

interface InputCheckboxProps {
  classNames?: {
    root?: string;
  };
  id: string;
  type?: 'checkbox' | 'radio';
  disabled?: boolean;
  value: boolean;
  onChange: (checked: boolean) => void;
}

export default function InputCheckbox({
  classNames,
  id,
  type = 'checkbox',
  disabled,
  value,
  onChange,
}: InputCheckboxProps) {
  return (
    <span className={clsx('inline', classNames?.root)}>
      <input
        className="sr-only hidden"
        id={id}
        type={type}
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label
        className={clsx(
          'inline-flex justify-start items-center gap-2',
          'cursor-pointer',
          disabled && 'cursor-not-allowed opacity-60',
        )}
        htmlFor={id}
      >
        <span
          className={clsx(
            'flex justify-center items-center',
            'min-w-4 w-4 h-4',
            'rounded-sm',
            'bg-[#060E20]',
            'border border-[#464554]',
          )}
        >
          <IconCheck1
            className={clsx(
              'min-w-2.5 w-2.5 h-2.5',
              value ? 'opacity-100' : 'opacity-0',
            )}
          />
        </span>
      </label>
    </span>
  );
}
