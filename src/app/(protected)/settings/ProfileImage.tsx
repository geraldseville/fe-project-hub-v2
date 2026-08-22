import { useState } from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import { useMe } from '@/hooks/queries/useMe';

import { getFullName, userInitials } from '@/utils/user.utils';

import ImageDropZone from '@/components/reusable/ImageDropZone';
import { IconImage1 } from '@/components/svgs/icons';

import UserImageCropModal from './UserImageCropModal';

export default function ProfileImage() {
  const { data: me } = useMe();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const userFullName = getFullName(me?.firstName, me?.lastName);

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
        <ImageDropZone
          onFileSelect={setImageFile}
          renderChild={(isDragging) => (
            <>
              {me?.imageUrl ? (
                <>
                  <Image
                    className={clsx(
                      'relative z-10',
                      'w-full h-full object-cover object-top',
                      'rounded-xl',
                    )}
                    src={me.imageUrl}
                    alt={userFullName}
                    title={userFullName}
                    width={136}
                    height={136}
                    draggable={false}
                    loading="eager"
                  />

                  <div
                    className={clsx(
                      'absolute inset-0 z-20',
                      'flex justify-center items-center',
                      'w-full h-full',
                      'rounded-[inherit]',
                      'bg-black/60',
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
                      Change
                    </div>
                  </div>
                </>
              ) : (
                <>
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

                  <div
                    className={clsx(
                      'absolute z-20 inset-0',
                      'flex justify-center items-center',
                      'rounded-[inherit]',
                      'bg-black/10',
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
                      Upload
                    </div>
                  </div>
                </>
              )}

              {/* Dragging overlay */}
              {isDragging && (
                <div
                  className={clsx(
                    'absolute z-30 inset-0',
                    'flex justify-center items-center',
                    'rounded-[inherit]',
                    'bg-black/70',
                    'border-2 border-dashed border-primary',
                  )}
                >
                  <IconImage1 className="min-w-5 w-5 h-5" />
                </div>
              )}
            </>
          )}
        />
      </div>
      <UserImageCropModal
        isOpen={imageFile ? true : false}
        onClose={() => {
          setImageFile(null);
        }}
        imageFile={imageFile}
      />
    </>
  );
}
