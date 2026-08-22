'use client';

import { useEffect, useRef, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';

import clsx from 'clsx';

import {
  IconCircle,
  IconRotateLeft,
  IconRotateRight,
  IconSquare,
  IconZoomIn,
  IconZoomOut,
} from '@/components/svgs/icons';

interface ImageCropperSize {
  width: number;
  height: number;
}

interface ImageCropResult {
  file: File | null;
  url: string;
}

interface ImageCropperProps {
  imageFile: File | null;
  size: ImageCropperSize;
  minZoom?: number;
  maxZoom?: number;
  onCropComplete?: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onCropFile?: (result: ImageCropResult) => void;
}

const ZOOM_STEP = 0.1;
const ROTATION_STEP = 90;

const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;

    image.src = src;
  });
};

const createCroppedFile = async (
  imageSrc: string,
  originalFile: File,
  crop: Area,
  size: ImageCropperSize,
  rotation: number,
): Promise<File> => {
  const image = await createImage(imageSrc);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not create canvas context.');
  }

  canvas.width = size.width;
  canvas.height = size.height;

  context.translate(size.width / 2, size.height / 2);
  context.rotate((rotation * Math.PI) / 180);

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    -size.width / 2,
    -size.height / 2,
    size.width,
    size.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create cropped image.'));
          return;
        }

        const originalName = originalFile.name.replace(/\.[^/.]+$/, '');

        const fileName = `${originalName}-cropped-img.jpg`;

        const file = new File([blob], fileName, {
          type: 'image/jpeg',
        });

        resolve(file);
      },
      'image/jpeg',
      0.92,
    );
  });
};

export default function ImageCropper({
  imageFile,
  size,
  minZoom = 1,
  maxZoom = 3,
  onCropComplete,
  onCropFile,
}: ImageCropperProps) {
  const [image, setImage] = useState<string>('');
  const [imageFileLocal, setImageFileLocal] = useState<File | null>(imageFile);
  const [crop, setCrop] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [cropShape, setCropShape] = useState<'rect' | 'round'>('rect');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropResult, setCropResult] = useState<ImageCropResult>({
    file: null,
    url: '',
  });

  const imageCropperInputRef = useRef<HTMLInputElement>(null);

  const aspect = size.width / size.height;

  const handleCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const handleZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleZoomOut = () => {
    setZoom((currentZoom) => Math.max(minZoom, currentZoom - ZOOM_STEP));
  };

  const handleZoomIn = () => {
    setZoom((currentZoom) => Math.min(maxZoom, currentZoom + ZOOM_STEP));
  };

  const handleRotateLeft = () => {
    setRotation((currentRotation) => currentRotation - ROTATION_STEP);
  };

  const handleRotateRight = () => {
    setRotation((currentRotation) => currentRotation + ROTATION_STEP);
  };

  const resetCrop = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCropShape('rect');
    setCroppedAreaPixels(null);
    setCropResult({
      file: null,
      url: '',
    });
  };

  const handleCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);

    onCropComplete?.(croppedArea, croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;

    try {
      const file = await createCroppedFile(
        image,
        imageFileLocal!,
        croppedAreaPixels,
        size,
        rotation,
      );

      const url = URL.createObjectURL(file);

      setCropResult({
        file,
        url,
      });
      // Emit the actual cropped File
      onCropFile?.({ file, url });
    } catch (error) {
      console.error('Failed to create cropped file:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  useEffect(() => {
    setImageFileLocal(imageFile);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCropShape('rect');
    setCroppedAreaPixels(null);
    setCropResult({
      file: null,
      url: '',
    });
  }, [imageFile]);

  useEffect(() => {
    if (!imageFileLocal) {
      setImage('');
      return;
    }

    const url = URL.createObjectURL(imageFileLocal);

    setImage(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFileLocal]);

  return (
    <div className="flex flex-col">
      <input
        className="hidden"
        id="imageCropperInput"
        ref={imageCropperInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;

          if (!file) {
            return;
          }

          setImageFileLocal(file);
          resetCrop();

          // Allows selecting the same file again later
          event.target.value = '';
        }}
      />
      {cropResult.file ? (
        <>
          {/* Preview */}
          <div
            className={clsx('flex justify-center items-center', 'w-full h-100')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-auto h-80"
              src={cropResult.url}
              alt="Image Cropper Preview"
            />
          </div>
        </>
      ) : (
        <>
          {/* Cropper */}
          <div
            className={clsx(
              'relative overflow-hidden',
              'w-full h-100',
              'bg-black',
            )}
          >
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={handleCropChange}
              onZoomChange={handleZoomChange}
              onRotationChange={setRotation}
              onCropComplete={handleCropComplete}
              cropShape={cropShape}
            />
          </div>
        </>
      )}
      {!cropResult.file && (
        <>
          {/* Options */}
          <div className={clsx('flex flex-col gap-4', 'p-4')}>
            <>
              <div
                className={clsx(
                  'flex justify-between items-center gap-4',
                  'h-9',
                )}
              >
                {/* Rotate Left */}
                <button
                  className={clsx(
                    'flex justify-center items-center',
                    'min-w-6 w-6 h-6',
                  )}
                  type="button"
                  title="Rotate Left"
                  aria-label="Rotate Left"
                  onClick={handleRotateLeft}
                >
                  <IconRotateLeft className="w-auto h-5" />
                </button>
                {/* Zoom */}
                <div
                  className={clsx(
                    'flex justify-between items-center gap-4',
                    'flex-1',
                  )}
                >
                  {/* Zoom Out */}
                  <button
                    className={clsx(
                      'flex justify-center items-center',
                      'min-w-6 w-6 h-6',
                      zoom <= minZoom && 'is-disabled opacity-50!',
                    )}
                    type="button"
                    title="Zoom Out"
                    aria-label="Zoom Out"
                    onClick={handleZoomOut}
                    disabled={zoom <= minZoom}
                  >
                    <IconZoomOut className="w-auto h-5" />
                  </button>
                  {/* Zoom Slider */}
                  <input
                    className="w-full"
                    type="range"
                    min={minZoom}
                    max={maxZoom}
                    step={ZOOM_STEP}
                    value={zoom}
                    onChange={(event) => {
                      setZoom(Number(event.target.value));
                    }}
                  />
                  <label>{`x${zoom.toFixed(1)}`}</label>
                  {/* Zoom In */}
                  <button
                    className={clsx(
                      'flex justify-center items-center',
                      'min-w-6 w-6 h-6',
                      zoom >= maxZoom && 'is-disabled opacity-50!',
                    )}
                    type="button"
                    title="Zoom In"
                    aria-label="Zoom In"
                    onClick={handleZoomIn}
                    disabled={zoom >= maxZoom}
                  >
                    <IconZoomIn className="w-auto h-5" />
                  </button>
                </div>
                {/* Rotate Right */}
                <button
                  className={clsx(
                    'flex justify-center items-center',
                    'min-w-6 w-6 h-6',
                  )}
                  type="button"
                  title="Rotate Right"
                  aria-label="Rotate Right"
                  onClick={handleRotateRight}
                >
                  <IconRotateRight className="w-auto h-5" />
                </button>
              </div>
              <div
                className={clsx('flex justify-start items-center gap-4', 'h-9')}
              >
                {/* Circle */}
                <button
                  className={clsx(
                    'flex justify-center items-center gap-2',
                    'py-2 px-4',
                    'rounded-md',
                    'border',
                    cropShape === 'rect'
                      ? 'bg-tertiary border-tertiary'
                      : 'text-white hover:text-primary border-white hover:border-primary',
                  )}
                  type="button"
                  title="Square Shape"
                  aria-label="Square Shape"
                  onClick={() => {
                    setCropShape('rect');
                  }}
                >
                  <IconSquare className={clsx('min-w-4 w-4 h-4')} />
                  <div className="font-jetbrains-mono leading-none">Square</div>
                </button>
                {/* Square */}
                <button
                  className={clsx(
                    'flex justify-center items-center gap-2',
                    'py-2 px-4',
                    'rounded-md',
                    'border',
                    cropShape === 'round'
                      ? 'bg-tertiary border-tertiary'
                      : 'text-white hover:text-primary border-white hover:border-primary',
                  )}
                  type="button"
                  title="Circle Shape"
                  aria-label="Circle Shape"
                  onClick={() => {
                    setCropShape('round');
                  }}
                >
                  <IconCircle className={clsx('min-w-4 w-4 h-4')} />
                  <div className="font-jetbrains-mono leading-none">Circle</div>
                </button>
                {/* Reset */}
                <button
                  className={clsx(
                    'text-white',
                    'flex justify-center items-center gap-2',
                    'ml-auto py-2 px-4',
                    'rounded-md',
                    'border',
                    'border border-white',
                    'hover:text-primary hover:border-primary',
                  )}
                  type="button"
                  title="Reset"
                  aria-label="Reset"
                  onClick={resetCrop}
                >
                  <div className="font-jetbrains-mono leading-none">Reset</div>
                </button>
                {/* Crop */}
                <button
                  className={clsx(
                    'text-white',
                    'flex justify-center items-center gap-2',
                    'py-2 px-4',
                    'rounded-md',
                    'border',
                    'border border-white',
                    'hover:text-primary hover:border-primary',
                  )}
                  type="button"
                  title="Crop"
                  aria-label="Crop"
                  onClick={handleCrop}
                >
                  <div className="font-jetbrains-mono leading-none">Crop</div>
                </button>
              </div>
            </>
          </div>
        </>
      )}
    </div>
  );
}
