'use client';

import { type DragEvent, type ReactNode, useRef, useState } from 'react';

import clsx from 'clsx';

import { IconImage1 } from '@/components/svgs/icons';

export type ImageDropZoneState = {
  isDragging: boolean;
};

interface ImageDropZoneProps {
  className?: string;
  disabled?: boolean;
  accept?: string;
  showDragOverlay?: boolean;
  onFileSelect: (file: File) => void;
  children?: ReactNode | ((state: ImageDropZoneState) => ReactNode);
  renderOverlay?: (state: ImageDropZoneState) => ReactNode;
}

export default function ImageDropZone({
  className,
  disabled = false,
  accept = 'image/*',
  showDragOverlay = true,
  onFileSelect,
  children,
  renderOverlay,
}: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const dropState: ImageDropZoneState = { isDragging };

  const handleFile = (file: File | null) => {
    if (disabled || !file || !file.type.startsWith('image/')) {
      return;
    }

    onFileSelect(file);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (disabled) return;

    dragCounterRef.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    dragCounterRef.current -= 1;

    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    dragCounterRef.current = 0;
    setIsDragging(false);

    if (disabled) return;

    handleFile(event.dataTransfer.files[0] ?? null);
  };

  const content =
    typeof children === 'function' ? children(dropState) : children;

  const overlay = renderOverlay ? (
    renderOverlay(dropState)
  ) : showDragOverlay && isDragging ? (
    <div
      className={clsx(
        'absolute inset-0 z-30',
        'flex flex-col justify-center items-center',
        'rounded-[inherit]',
        'bg-black/70',
        'border-2 border-dashed border-primary',
        'pointer-events-none',
      )}
    >
      <IconImage1 className="min-w-5 w-5 h-auto" />
    </div>
  ) : null;

  return (
    <div
      className={clsx(
        'relative',
        'w-full h-full',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      onClick={() => {
        if (disabled) return;

        imageInputRef.current?.click();
      }}
      onDragEnter={handleDragEnter}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {content}
      {overlay}
      <input
        className="hidden"
        ref={imageInputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(event) => {
          handleFile(event.target.files?.[0] ?? null);

          event.target.value = '';
        }}
      />
    </div>
  );
}
