import React, { type ButtonHTMLAttributes } from 'react';

import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  buttonStyle?: 'primary' | 'secondary' | 'tertiary' | 'outlined';
  type?: 'submit' | 'button';
  icon?: React.ReactNode;
  text?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  className = '',
  buttonStyle = 'primary',
  type = 'button',
  icon,
  text = 'button',
  onClick,
  disabled = false,
  ...restProps
}: ButtonProps) {
  const buttonStyles = {
    primary: [
      'text-neutral',
      'bg-[#C0C1FF]',
      'border border-[#C0C1FF]',
      'hover:bg-[#C0C1FF]/60',
    ],
    secondary: [
      'text-[#C7C4D7]',
      'bg-[#222A3D]',
      'border border-[#222A3D]',
      'hover:bg-[#222A3D]/60',
    ],
    tertiary: [
      'text-neutral',
      'bg-foreground',
      'border border-foreground',
      'hover:bg-foreground/60',
    ],
    outlined: [
      'text-[#C7C4D7',
      'bg-transparent',
      'border border-[##908FA0]',
      'hover:opacity-60',
    ],
  };

  return (
    <button
      className={clsx(
        className,
        buttonStyles[buttonStyle],
        'font-bold',
        'leading-none',
        'relative overflow-hidden',
        'flex flex-row justify-center items-center gap-2',
        'min-w-50 w-fit h-10',
        'py-1 px-2',
        'rounded-md',
        disabled && 'is-disabled',
      )}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...restProps}
    >
      {icon}
      {text && <div className="">{text}</div>}
    </button>
  );
}
