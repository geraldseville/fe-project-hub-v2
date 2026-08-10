import { useRef } from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import { useUpdateMe } from '@/hooks/mutations/useUpdateMe';
import { useUploadUserProfileImage } from '@/hooks/mutations/useUploadProfileImage';
import { useMe } from '@/hooks/queries/useMe';
import { useToastStore } from '@/hooks/ui/useToastStore';

import { getFullName, userInitials } from '@/utils/user.utils';

import LoaderSpinner from '@/components/elements/LoaderSpinner';

export default function ProfileImage() {
  const toast = useToastStore();

  const { data: me } = useMe();

  const userFullName = getFullName(me?.firstName, me?.lastName);

  const updateMe = useUpdateMe();

  const uploadUserProfileImage = useUploadUserProfileImage();

  const uploadUserProfileImagePending = uploadUserProfileImage.isPending;

  const userImageInputRef = useRef<HTMLInputElement>(null);

  const handleUploadProfileImage = async (file: File) => {
    if (!file) return;

    try {
      const formData = new FormData();

      formData.append('image', file);

      const resultProfileImage =
        await uploadUserProfileImage.mutateAsync(formData);

      if (!resultProfileImage.data?.url) {
        throw new Error('failed to upload profile image.');
      }

      await updateMe.mutateAsync({
        imageUrl: resultProfileImage.data.url,
      });

      toast.success('user updated profile image.');
    } catch (err) {
      toast.failed(
        err instanceof Error ? err.message : 'failed to upload profile image.',
      );
    }
  };

  return (
    <div
      className={clsx(
        'group',
        'relative',
        'flex justify-center items-center',
        'min-w-[136px] w-[136px] h-[136px]',
        'rounded-xl',
        'border-4 border-background',
        'bg-background',
      )}
    >
      {uploadUserProfileImagePending ? (
        <div
          className={clsx(
            'absolute z-3 inset-0',
            'flex justify-center items-center',
            'w-full h-full',
          )}
        >
          <LoaderSpinner className={clsx('min-w-6! size-6!')} />
        </div>
      ) : me?.imageUrl ? (
        <>
          <Image
            className={clsx(
              'relative z-1',
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
              'absolute inset-0 z-2',
              'w-full h-full',
              'rounded-[inherit]',
              'bg-black/60',
              'transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
            )}
          >
            <label
              className={clsx(
                'flex justify-center items-center',
                'w-full h-full',
                'cursor-pointer',
              )}
              htmlFor="profileImage"
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
            </label>
            <input
              className="hidden"
              id="profileImage"
              ref={userImageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handleUploadProfileImage(file);
                }
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className={clsx('relative', 'text-[20px]')}>
            {userInitials(userFullName ?? '')}
          </div>
          <div
            className={clsx(
              'absolute inset-0',
              'rounded-[inherit]',
              'bg-black/10',
              'transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
            )}
          >
            <label
              className={clsx(
                'flex justify-center items-center',
                'w-full h-full',
                'cursor-pointer',
              )}
              htmlFor="profileImage"
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
            </label>
            <input
              className="hidden"
              id="profileImage"
              ref={userImageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handleUploadProfileImage(file);
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
