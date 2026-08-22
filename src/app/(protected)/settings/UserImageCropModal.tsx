import { useEffect, useState } from 'react';

import clsx from 'clsx';

import { useUpdateMe } from '@/hooks/mutations/useUpdateMe';
import { useUploadUserProfileImage } from '@/hooks/mutations/useUploadProfileImage';
import { useToastStore } from '@/hooks/ui/useToastStore';

import Button from '@/components/elements/Button';
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
  imageFile: file,
}: UserImageCropModalProps) {
  const toast = useToastStore();

  const updateMe = useUpdateMe();
  const uploadUserProfileImage = useUploadUserProfileImage();

  const [imageFile, setImageFile] = useState<File | null>(file);
  const [imageCroppedFile, setImageCroppedFile] = useState<File | null>(null);

  const isUploading = updateMe.isPending || uploadUserProfileImage.isPending;

  const handleSaveProfileImage = async () => {
    if (!imageCroppedFile) return;

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
    } catch (err) {
      toast.failed(
        err instanceof Error ? err.message : 'failed to upload profile image.',
      );
    } finally {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setImageFile(null);
    setImageCroppedFile(null);
    onClose();
  };

  const handleSelectAnotherFile = () => {
    setImageFile(null);
    setImageCroppedFile(null);
  };

  useEffect(() => {
    if (!file) return;

    setImageFile(file);
  }, [file]);

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
      onClose={handleCancel}
    >
      {/* Head */}
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
          onClick={handleCancel}
        >
          <IconClose1 className="min-w-3.5 w-3.5 h-3.5" />
        </button>
      </div>
      {/* Body */}
      <div className={clsx('overflow-y-auto', 'flex-1')}>
        {imageFile ? (
          <>
            <div
              className={clsx('flex justify-between items-center', 'py-4 px-6')}
            >
              <div className="font-jetbrains-mono leading-none truncate">
                {imageCroppedFile ? imageCroppedFile.name : imageFile.name}
              </div>
              <button type="button" onClick={handleSelectAnotherFile}>
                <IconClose1 className="min-w-3.5 w-3.5 h-3.5" />
              </button>
            </div>
            <ImageCropper
              imageFile={imageFile}
              size={{ width: 300, height: 300 }}
              onCropFile={(result) => {
                setImageCroppedFile(result.file);
              }}
            />
          </>
        ) : (
          <div className="w-full h-100 p-6">
            <ImageDropZone
              onFileSelect={setImageFile}
              renderChild={(isDragging) => (
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
            />
          </div>
        )}
      </div>
      {/* Foot */}
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
          className=""
          buttonStyle="secondary"
          type="button"
          text="Cancel"
          onClick={handleCancel}
        />
        <Button
          className=""
          buttonStyle="primary"
          type="button"
          text={isUploading ? 'Saving...' : 'Save Profile Image'}
          disabled={!imageCroppedFile || isUploading}
          onClick={handleSaveProfileImage}
        />
      </div>
    </Modal>
  );
}
