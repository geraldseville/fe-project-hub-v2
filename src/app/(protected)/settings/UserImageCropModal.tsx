'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';

import { useUpdateMe } from '@/hooks/mutations/useUpdateMe';
import { useUploadUserProfileImage } from '@/hooks/mutations/useUploadProfileImage';
import { useToastStore } from '@/hooks/ui/useToastStore';

import Button from '@/components/elements/Button';
import LoaderSpinner from '@/components/elements/LoaderSpinner';
import Modal from '@/components/elements/Modal';
import ImageCropper from '@/components/reusable/ImageCropper';
import ImageDropZone from '@/components/reusable/ImageDropZone';
import { IconClose1, IconImage1 } from '@/components/svgs/icons';

interface UserImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
}

export default function UserImageCropModal({
  isOpen,
  onClose,
  imageFile: initialFile,
}: UserImageCropModalProps) {
  const toast = useToastStore();

  const updateMe = useUpdateMe();
  const uploadUserProfileImage = useUploadUserProfileImage();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageCroppedFile, setImageCroppedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const isUploading = updateMe.isPending || uploadUserProfileImage.isPending;

  const resetFiles = () => {
    setImageFile(null);
    setImageCroppedFile(null);
  };

  const handleClose = () => {
    if (isUploading) return;

    resetFiles();
    onClose();
  };

  const handleSaveProfileImage = async () => {
    if (!imageCroppedFile || isUploading) return;

    try {
      const formData = new FormData();

      formData.append('image', imageCroppedFile);

      const resultProfileImage =
        await uploadUserProfileImage.mutateAsync(formData);

      if (!resultProfileImage.data?.url) {
        throw new Error('failed to upload profile image.');
      }

      await updateMe.mutateAsync({
        imageUrl: resultProfileImage.data.url,
      });

      toast.success('user updated profile image.');
      resetFiles();
      onClose();
    } catch (err) {
      toast.failed(
        err instanceof Error ? err.message : 'failed to upload profile image.',
      );
    }
  };

  const handleSelectAnotherFile = () => {
    if (isUploading) return;

    resetFiles();
  };

  useEffect(() => {
    if (!isOpen) {
      resetFiles();
      return;
    }

    setImageFile(initialFile);
    setImageCroppedFile(null);
  }, [isOpen, initialFile]);

  return (
    <Modal
      classNames={{
        root: clsx(isUploading && 'is-disabled opacity-100!'),
        content: clsx(
          'max-w-xl!',
          'rounded-lg',
          'bg-[#1E293B]',
          'border border-[#464554]',
        ),
      }}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div
        className={clsx(
          'flex justify-between items-center gap-4',
          'shrink-0 h-[70px]',
          'py-4 px-6',
          'rounded-t-[inherit]',
          'bg-[#2D3449]',
        )}
      >
        <div className="flex-1 min-w-0">
          <div
            className={clsx(
              'font-hanken-grotesk font-semibold',
              'text-[#DAE2FD] text-[20px] leading-tight',
            )}
          >
            Crop Profile Picture
          </div>
        </div>
        <button
          className={clsx('flex justify-center items-center', 'w-8 h-8')}
          type="button"
          disabled={isUploading}
          onClick={handleClose}
        >
          <IconClose1 className="min-w-3.5 w-3.5 h-3.5" />
        </button>
      </div>
      <div className={clsx('relative overflow-y-auto', 'flex-1')}>
        {imageCroppedFile ? (
          <>
            <div
              className={clsx(
                'flex justify-between items-center gap-4',
                'py-4 px-6',
              )}
            >
              <div className="font-jetbrains-mono leading-none truncate">
                {imageCroppedFile.name}
              </div>
              <button
                type="button"
                disabled={isUploading}
                onClick={handleSelectAnotherFile}
              >
                <IconClose1 className="min-w-3.5 w-3.5 h-3.5" />
              </button>
            </div>
            <div
              className={clsx(
                'flex justify-center items-center',
                'w-full h-100',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-auto h-80"
                src={imagePreview}
                alt="Image Cropper Preview"
              />
            </div>
          </>
        ) : imageFile ? (
          <>
            <div
              className={clsx(
                'flex justify-between items-center gap-4',
                'py-4 px-6',
              )}
            >
              <div className="font-jetbrains-mono leading-none truncate">
                {imageFile.name}
              </div>
              <button
                type="button"
                disabled={isUploading}
                onClick={handleSelectAnotherFile}
              >
                <IconClose1 className="min-w-3.5 w-3.5 h-3.5" />
              </button>
            </div>
            <ImageCropper
              imageFile={imageFile}
              size={{ width: 300, height: 300 }}
              disabled={isUploading}
              defaultCropShape="round"
              onCropFile={(result) => {
                setImageCroppedFile(result.file);
                setImagePreview(result.url);
              }}
            />
          </>
        ) : (
          <div className={clsx('w-full h-100', 'p-6')}>
            <ImageDropZone disabled={isUploading} onFileSelect={setImageFile}>
              {({ isDragging }) => (
                <div
                  className={clsx(
                    'flex flex-col justify-center items-center gap-2',
                    'w-full h-full',
                    'p-4',
                    'border-2 border-dashed',
                    isDragging
                      ? 'border-primary'
                      : 'border-gray-700 hover:border-primary',
                  )}
                >
                  <IconImage1 className="min-w-8 w-8 h-auto" />
                  <div className="text-gray-200">Drop Your Image</div>
                  <div className="text-gray-500">
                    Max Dimension: 300x300. Max file: 12MB
                  </div>
                </div>
              )}
            </ImageDropZone>
          </div>
        )}
        {isUploading && (
          <div
            className={clsx(
              'absolute z-10 inset-0',
              'flex justify-center items-center',
              'bg-black/40',
            )}
          >
            <LoaderSpinner />
          </div>
        )}
      </div>
      <div
        className={clsx(
          'flex justify-end items-center gap-4',
          'shrink-0 h-[75px]',
          'py-4 px-6',
          'rounded-b-[inherit]',
          'bg-[#131B2E]/50',
        )}
      >
        <Button
          buttonStyle="secondary"
          type="button"
          text="Cancel"
          disabled={isUploading}
          onClick={handleClose}
        />
        <Button
          buttonStyle="primary"
          type="button"
          text={isUploading ? 'Saving...' : 'Save Profile Image'}
          icon={isUploading && <LoaderSpinner className="min-w-4 w-4! h-4!" />}
          disabled={!imageCroppedFile || isUploading}
          onClick={handleSaveProfileImage}
        />
      </div>
    </Modal>
  );
}
