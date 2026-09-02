'use client';

import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useState,
} from 'react';

import clsx from 'clsx';

import { IconEyeClose, IconEyeOpen } from '@/components/svgs/icons';

interface SingleLineFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> {
  classNames?: {
    root?: string;
    input?: string;
  };
  id?: string;
  type?: 'text' | 'email' | 'password' | 'search';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const SingleLineField = forwardRef<HTMLInputElement, SingleLineFieldProps>(
  function SingleLineField(
    {
      classNames,
      id = 'single-line-field',
      type = 'text',
      placeholder = 'Singleline Field',
      icon,
      iconPosition = 'left',
      disabled = false,
      required = false,
      autoComplete = 'off',
      value,
      onChange,
      onEnter,
      ...restProps
    },
    ref,
  ) {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
      type === 'password' ? (showPassword ? 'text' : 'password') : type;

    const hasLeftIcon = iconPosition === 'left' && !!icon;

    const hasRightIcon =
      type === 'password' || (iconPosition === 'right' && !!icon);

    return (
      <div className={clsx('relative', 'h-[47px]', classNames?.root)}>
        {hasLeftIcon && (
          <div
            className={clsx(
              'absolute left-0 top-1/2 -translate-y-1/2',
              'flex justify-center items-center',
              'w-[47px] h-[47px]',
            )}
          >
            {icon}
          </div>
        )}
        <input
          className={clsx(
            'text-sm',
            'placeholder:italic placeholder:text-placeholder',
            'min-w-[200px] w-full h-full',
            'py-2 px-4',
            hasLeftIcon && 'pl-[47px]',
            hasRightIcon && 'pr-[47px]',
            'rounded-lg',
            'bg-[#060E20]',
            disabled && 'bg-[#222A3D]',
            'border border-[#464554]',
            disabled && 'is-disabled',
            classNames?.input,
          )}
          ref={ref}
          id={id}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onEnter?.(e);
            }

            restProps.onKeyDown?.(e);
          }}
          {...restProps}
        />
        {type === 'password' ? (
          <button
            className={clsx(
              'absolute right-0 top-1/2 -translate-y-1/2',
              'flex justify-center items-center',
              'w-[47px] h-[47px]',
              disabled && 'is-disabled',
            )}
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? 'Hide Password' : 'Show Password'}
          >
            {showPassword ? (
              <IconEyeClose className="min-w-[16px] w-[16px] h-auto" />
            ) : (
              <IconEyeOpen className="min-w-[16px] w-[16px] h-auto" />
            )}
          </button>
        ) : hasRightIcon ? (
          <div
            className={clsx(
              'absolute right-0 top-1/2 -translate-y-1/2',
              'flex justify-center items-center',
              'w-[47px] h-[47px]',
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>
    );
  },
);

export default SingleLineField;
