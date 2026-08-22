import { useRef, useState } from 'react';

import clsx from 'clsx';

import { IconImage1 } from '@/components/svgs/icons';

interface ImageDropZoneProps {
  onFileSelect: (file: File) => void;
  renderChild?: (isDragging: boolean) => React.ReactNode;
}

export default function ImageDropZone({
  onFileSelect,
  renderChild,
}: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef<number>(0);

  const handleFile = (file: File | null) => {
    if (!file) return;

    onFileSelect(file);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    dragCounterRef.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    dragCounterRef.current -= 1;

    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    dragCounterRef.current = 0;
    setIsDragging(false);

    handleFile(event.dataTransfer.files[0] ?? null);
  };

  const renderDefault = () => (
    <div
      className={clsx(
        'absolute inset-0 z-10',
        'flex flex-col justify-center items-center',
        'rounded-[inherit]',
        'bg-black/70',
        'border-2 border-dashed border-primary',
        'pointer-events-none',
      )}
    >
      <IconImage1 className="min-w-5 w-5 h-auto" />
    </div>
  );

  return (
    <div
      className={clsx('relative', 'w-full h-full', 'cursor-pointer')}
      onClick={() => {
        imageInputRef.current?.click();
      }}
      onDragEnter={handleDragEnter}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {renderChild ? (
        renderChild(isDragging)
      ) : (
        <>{isDragging && renderDefault()}</>
      )}
      <input
        className="hidden"
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => {
          handleFile(event.target.files?.[0] ?? null);

          event.target.value = '';
        }}
      />
    </div>
  );
}
