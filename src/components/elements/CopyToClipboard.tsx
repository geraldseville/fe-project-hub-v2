'use client';

import React, { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import { IconCheck1, IconDuplicate2 } from '@/components/svgs/icons';

interface CopyToClipboardProps {
  className?: string;
  label?: React.ReactNode;
  value: string;
  onClick?: () => void;
}

export default function CopyToClipboard({
  className,
  label,
  value,
  onClick,
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = async () => {
    await navigator.clipboard.writeText(value);

    setCopied(true);
    onClick?.();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2',
        'cursor-pointer',
        className,
      )}
      type="button"
      onClick={handleClick}
    >
      {label && <span>{label}</span>}
      {copied ? <IconCheck1 /> : <IconDuplicate2 />}
    </button>
  );
}
