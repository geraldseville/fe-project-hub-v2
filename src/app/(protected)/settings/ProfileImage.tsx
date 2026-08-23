'use client';

import { useState } from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import { useMe } from '@/hooks/queries/useMe';

import { getFullName, userInitials } from '@/utils/user.utils';

import ImageDropZone from '@/components/reusable/ImageDropZone';

import UserImageCropModal from './UserImageCropModal';

const withCacheBust = (url: string, version?: string) => {
  if (!version) return url;

  const separator = url.includes('?') ? '&' : '?';

  return `${url}${separator}v=${encodeURIComponent(version)}`;
};

export default function ProfileImage() {
  const { data: me } = useMe();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const userFullName = getFullName(me?.firstName, me?.lastName);
  const hasImage = Boolean(me?.imageUrl);

  return (
    <>
      <div
        className={clsx(
          'group',
          'relative overflow-hidden',
          'flex justify-center items-center',
          'min-w-34 w-34 h-34',
          'rounded-xl',
          'border-4 border-background',
          'bg-background',
        )}
      >
        <ImageDropZone onFileSelect={setImageFile}>
          <>
            {hasImage && me?.imageUrl ? (
              <Image
                className={clsx(
                  'relative z-10',
                  'w-full h-full object-cover object-top',
                  'rounded-xl',
                )}
                src={withCacheBust(me.imageUrl, me.updatedAt)}
                alt={userFullName}
                title={userFullName}
                width={136}
                height={136}
                draggable={false}
                loading="eager"
              />
            ) : (
              <div
                className={clsx(
                  'relative z-10',
                  'flex justify-center items-center',
                  'w-full h-full',
                  'text-[20px]',
                )}
              >
                {userInitials(userFullName ?? '')}
              </div>
            )}

            <div
              className={clsx(
                'absolute inset-0 z-20',
                'flex justify-center items-center',
                'w-full h-full',
                'rounded-[inherit]',
                hasImage ? 'bg-black/60' : 'bg-black/10',
                'transition-all duration-200',
                'opacity-0 group-hover:opacity-100',
              )}
            >
              <div
                className={clsx(
                  'font-inter',
                  'text-[10px] uppercase',
                  'p-2',
                  'rounded-md',
                  'bg-black',
                )}
              >
                {hasImage ? 'Change' : 'Upload'}
              </div>
            </div>
          </>
        </ImageDropZone>
      </div>
      <UserImageCropModal
        isOpen={Boolean(imageFile)}
        onClose={() => {
          setImageFile(null);
        }}
        imageFile={imageFile}
      />
    </>
  );
}
