import React from 'react';
import Image from 'next/image';

import clsx from 'clsx';

interface ImageItem {
  src: string;
  alt?: string;
}

interface ImageStackProps {
  className?: {
    root?: string;
    item?: string;
  };
  images: (string | ImageItem)[];
  size?: number; // Circle dimension in px (default 40px)
  maxDisplay?: number; // Defaults to 2 based on your requirements
}

export default function ImageStack({
  className,
  images = [],
  maxDisplay = 3,
  size = 40,
}: ImageStackProps) {
  // Return null or empty fallback if no images provided
  if (!images || images.length === 0) return null;

  // Normalize image format (handles string URLs or object arrays)
  const normalizedImages = images.map((img, index) =>
    typeof img === 'string'
      ? { src: img, alt: `Image ${index + 1}` }
      : { src: img.src, alt: img.alt || `Image ${index + 1}` },
  );
  const totalCount = normalizedImages.length;
  // Show maxDisplay items. If total exceeds maxDisplay, reserve last spot for remaining counter
  const hasMore = totalCount > maxDisplay;
  const visibleImagesCount = hasMore
    ? maxDisplay - 1
    : Math.min(totalCount, maxDisplay);
  const remainingCount = totalCount - visibleImagesCount;
  const visibleImages = normalizedImages.slice(0, visibleImagesCount);

  return (
    <div className={clsx('flex items-center -space-x-3', className?.root)}>
      {/* Visible Images */}
      {visibleImages.map((img, idx) => (
        <div
          className={clsx(
            'relative overflow-hidden',
            'shrink-0',
            'rounded-full',
            'bg-gray-100',
            'border border-white',
            'shadow-sm',
            className?.item,
          )}
          key={idx}
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {img.src ? (
            <Image
              className="object-cover"
              src={img.src}
              alt={img.alt}
              title={img.alt}
              sizes={`${size}px`}
              fill
            />
          ) : (
            <div
              className={clsx(
                'font-inter font-bold',
                'text-white text-[12px]',
                'relative',
                'flex justify-center items-center shrink-0',
                'rounded-full',
                'bg-[#072635]',
                'border border-white',
                'shadow-sm',
                'select-none',
                className?.item,
              )}
              style={{ width: `${size}px`, height: `${size}px` }}
            >
              {img.alt.charAt(0)}
            </div>
          )}
        </div>
      ))}
      {/* Remaining Count Bubble (e.g. +4) */}
      {hasMore && (
        <div
          className={clsx(
            'font-inter font-bold',
            'text-white text-[12px]',
            'relative',
            'flex justify-center items-center shrink-0',
            'rounded-full',
            'bg-[#072635]',
            'border border-white',
            'shadow-sm',
            'select-none',
            className?.item,
          )}
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
