'use client';

import { useEffect, useState } from 'react';
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
  disabled?: boolean;
  defaultCropShape?: 'rect' | 'round';
  onCropComplete?: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onCropFile?: (result: ImageCropResult) => void;
}

const ZOOM_STEP = 0.1;
const ROTATION_STEP = 90;
const EMPTY_CROP_RESULT: ImageCropResult = {
  file: null,
  url: '',
};

const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;

    image.src = src;
  });
};

const getRadianAngle = (degree: number) => (degree * Math.PI) / 180;

const getRotatedSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

const clipEllipse = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  context.save();
  context.globalCompositeOperation = 'destination-in';
  context.beginPath();
  context.ellipse(
    width / 2,
    height / 2,
    width / 2,
    height / 2,
    0,
    0,
    Math.PI * 2,
  );
  context.closePath();
  context.fill();
  context.restore();
};

const createCroppedFile = async (
  imageSrc: string,
  originalFile: File,
  crop: Area,
  size: ImageCropperSize,
  rotation: number,
  cropShape: 'rect' | 'round',
): Promise<File> => {
  const image = await createImage(imageSrc);
  const rotRad = getRadianAngle(rotation);
  const rotated = getRotatedSize(image.width, image.height, rotation);

  const rotatedCanvas = document.createElement('canvas');
  const rotatedContext = rotatedCanvas.getContext('2d');

  if (!rotatedContext) {
    throw new Error('Could not create canvas context.');
  }

  rotatedCanvas.width = rotated.width;
  rotatedCanvas.height = rotated.height;

  rotatedContext.translate(rotated.width / 2, rotated.height / 2);
  rotatedContext.rotate(rotRad);
  rotatedContext.translate(-image.width / 2, -image.height / 2);
  rotatedContext.drawImage(image, 0, 0);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not create canvas context.');
  }

  canvas.width = size.width;
  canvas.height = size.height;

  context.drawImage(
    rotatedCanvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    size.width,
    size.height,
  );

  if (cropShape === 'round') {
    clipEllipse(context, size.width, size.height);
  }

  const mimeType = cropShape === 'round' ? 'image/png' : 'image/jpeg';
  const extension = cropShape === 'round' ? 'png' : 'jpg';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create cropped image.'));
          return;
        }

        const originalName = originalFile.name.replace(/\.[^/.]+$/, '');

        const file = new File(
          [blob],
          `${originalName}-cropped-img.${extension}`,
          {
            type: mimeType,
          },
        );

        resolve(file);
      },
      mimeType,
      mimeType === 'image/jpeg' ? 0.92 : undefined,
    );
  });
};

export default function ImageCropper({
  imageFile,
  size,
  minZoom = 1,
  maxZoom = 3,
  disabled = false,
  defaultCropShape = 'rect',
  onCropComplete,
  onCropFile,
}: ImageCropperProps) {
  const [image, setImage] = useState('');
  const [crop, setCrop] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropShape, setCropShape] = useState<'rect' | 'round'>(
    defaultCropShape,
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropResult, setCropResult] =
    useState<ImageCropResult>(EMPTY_CROP_RESULT);

  const aspect = size.width / size.height;

  const emitCropResult = (result: ImageCropResult) => {
    setCropResult(result);
    onCropFile?.(result);
  };

  const clearPreview = () => {
    emitCropResult(EMPTY_CROP_RESULT);
  };

  const resetCrop = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCropShape(defaultCropShape);
    setCroppedAreaPixels(null);
    clearPreview();
  };

  const handleCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);

    onCropComplete?.(croppedArea, croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (disabled || !croppedAreaPixels || !imageFile) return;

    try {
      const file = await createCroppedFile(
        image,
        imageFile,
        croppedAreaPixels,
        size,
        rotation,
        cropShape,
      );

      emitCropResult({
        file,
        url: URL.createObjectURL(file),
      });
    } catch (error) {
      console.error('Failed to create cropped file:', error);
    }
  };

  useEffect(() => {
    resetCrop();
    // Reset whenever a new source file is provided.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  useEffect(() => {
    if (!imageFile) {
      setImage('');
      return;
    }

    const url = URL.createObjectURL(imageFile);

    setImage(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (cropResult.url) {
        URL.revokeObjectURL(cropResult.url);
      }
    };
  }, [cropResult.url]);

  return (
    <div
      className={clsx('flex flex-col', disabled && 'is-disabled opacity-100!')}
    >
      <div
        className={clsx('relative overflow-hidden', 'w-full h-100', 'bg-black')}
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={handleCropComplete}
          cropShape={cropShape}
        />
      </div>
      <div className={clsx('flex flex-col gap-4', 'py-4 px-6')}>
        <div className={clsx('flex justify-between items-center gap-4', 'h-9')}>
          <button
            className={clsx(
              'flex justify-center items-center',
              'min-w-6 w-6 h-6',
            )}
            type="button"
            title="Rotate Left"
            aria-label="Rotate Left"
            onClick={() => {
              setRotation((currentRotation) => currentRotation - ROTATION_STEP);
            }}
          >
            <IconRotateLeft className="w-auto h-5" />
          </button>
          <div
            className={clsx(
              'flex justify-between items-center gap-4',
              'flex-1',
            )}
          >
            <button
              className={clsx(
                'flex justify-center items-center',
                'min-w-6 w-6 h-6',
                zoom <= minZoom && 'is-disabled opacity-50!',
              )}
              type="button"
              title="Zoom Out"
              aria-label="Zoom Out"
              onClick={() => {
                setZoom((currentZoom) =>
                  Math.max(minZoom, currentZoom - ZOOM_STEP),
                );
              }}
              disabled={zoom <= minZoom}
            >
              <IconZoomOut className="w-auto h-5" />
            </button>
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
            <button
              className={clsx(
                'flex justify-center items-center',
                'min-w-6 w-6 h-6',
                zoom >= maxZoom && 'is-disabled opacity-50!',
              )}
              type="button"
              title="Zoom In"
              aria-label="Zoom In"
              onClick={() => {
                setZoom((currentZoom) =>
                  Math.min(maxZoom, currentZoom + ZOOM_STEP),
                );
              }}
              disabled={zoom >= maxZoom}
            >
              <IconZoomIn className="w-auto h-5" />
            </button>
          </div>
          <button
            className={clsx(
              'flex justify-center items-center',
              'min-w-6 w-6 h-6',
            )}
            type="button"
            title="Rotate Right"
            aria-label="Rotate Right"
            onClick={() => {
              setRotation((currentRotation) => currentRotation + ROTATION_STEP);
            }}
          >
            <IconRotateRight className="w-auto h-5" />
          </button>
        </div>
        <div className={clsx('flex justify-start items-center gap-4', 'h-9')}>
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
          {/*
          <button
            className={clsx(
              'text-white',
              'flex justify-center items-center gap-2',
              'ml-auto py-2 px-4',
              'rounded-md',
              'border border-white',
              'hover:text-primary hover:border-primary',
            )}
            type="button"
            title={hasPreview ? 'Recrop' : 'Reset'}
            aria-label={hasPreview ? 'Recrop' : 'Reset'}
            onClick={hasPreview ? clearPreview : resetCrop}
          >
            <div className="font-jetbrains-mono leading-none">
              {hasPreview ? 'Recrop' : 'Reset'}
            </div>
          </button>
          */}
          <button
            className={clsx(
              'text-white',
              'flex justify-center items-center gap-2',
              'ml-auto py-2 px-4',
              'rounded-md',
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
          <button
            className={clsx(
              'text-white',
              'flex justify-center items-center gap-2',
              'py-2 px-4',
              'rounded-md',
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
      </div>
    </div>
  );
}
