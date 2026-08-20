'use client';

import { type CSSProperties, useCallback, useMemo, useState } from 'react';

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { Sketch } from '@uiw/react-color';
import clsx from 'clsx';
import { type Color, converter, formatHex, formatRgb, parse } from 'culori';

import { IconPlus1 } from '@/components/svgs/icons';

const toRgb = converter('rgb');
const toOklch = converter('oklch');

export interface SelectedColor {
  hex: string;
  rgb: string;
  oklch: string;
}

interface ColorSelectorProps {
  className?: string;
  presetColors: string[];
  value?: string;
  onChange: (color: SelectedColor) => void;
  disabled?: boolean;
  onAddColor?: (color: SelectedColor) => void;
}

function normalizeHex(color: string) {
  const parsed = parse(color);

  if (!parsed) {
    return null;
  }

  return formatHex(parsed);
}

function formatOklch(color: Color) {
  const oklch = toOklch(color);

  if (!oklch) {
    return '';
  }

  const lightness = (oklch.l ?? 0) * 100;
  const chroma = oklch.c ?? 0;
  const hue = oklch.h ?? 0;

  return `oklch(${lightness.toFixed(2)}% ${chroma.toFixed(
    4,
  )} ${hue.toFixed(2)})`;
}

function colorToValues(color: string): SelectedColor | null {
  const parsed = parse(color);

  if (!parsed) {
    return null;
  }

  const rgb = toRgb(parsed);
  const oklch = toOklch(parsed);

  if (!rgb || !oklch) {
    return null;
  }

  return {
    hex: formatHex(parsed),
    rgb: formatRgb(rgb),
    oklch: formatOklch(oklch),
  };
}

export default function ColorSelector({
  className,
  presetColors,
  value,
  onChange,
  disabled = false,
  onAddColor,
}: ColorSelectorProps) {
  const [customColorTemp, setCustomColorTemp] = useState<string>('#FFFFFF');

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectedHex = useMemo(() => {
    if (!value) {
      return null;
    }

    return normalizeHex(value);
  }, [value]);

  const isCustomColorPreset = useMemo(() => {
    const normalizedCustomColor = normalizeHex(customColorTemp);

    if (!normalizedCustomColor) {
      return false;
    }

    return presetColors.some((color) => {
      const normalizedPresetColor = normalizeHex(color);

      return (
        normalizedPresetColor?.toLowerCase() ===
        normalizedCustomColor.toLowerCase()
      );
    });
  }, [customColorTemp, presetColors]);

  const handlePresetClick = (color: string) => {
    const values = colorToValues(color);

    if (!values) {
      return;
    }

    onChange(values);
  };

  const handleAddColor = () => {
    const parsed = parse(customColorTemp);

    if (!parsed) {
      return;
    }

    const rgb = toRgb(parsed);
    const oklch = toOklch(parsed);

    if (!rgb || !oklch) {
      return;
    }

    const transform: SelectedColor = {
      hex: formatHex(parsed),
      rgb: formatRgb(rgb),
      oklch: formatOklch(oklch),
    };

    onAddColor?.(transform);

    setCustomColorTemp('#FFFFFF');
    setIsOpen(false);
  };

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);

  const dismiss = useDismiss(context);

  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const setReferenceRef = useCallback(
    (node: HTMLButtonElement | null) => {
      refs.setReference(node);
    },
    [refs],
  );

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  return (
    <div
      className={clsx(
        'relative',
        'flex flex-wrap items-center gap-2',
        className,
      )}
    >
      {presetColors.map((color) => {
        const normalizedColor = normalizeHex(color);

        if (!normalizedColor) {
          return null;
        }

        const isSelected =
          selectedHex?.toLowerCase() === normalizedColor.toLowerCase();

        return (
          <button
            className={clsx(
              'relative',
              'flex justify-center items-center',
              'size-9',
              'p-1',
              'rounded-full',
              'transition-transform duration-200',
              'hover:scale-105',
              'focus:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-offset-2',
              'disabled:pointer-events-none',
              'disabled:opacity-50',
              isSelected && 'border border-(--color)',
            )}
            key={normalizedColor}
            type="button"
            disabled={disabled}
            aria-label={`Select color ${normalizedColor}`}
            aria-pressed={isSelected}
            style={
              {
                '--color': normalizedColor,
              } as CSSProperties
            }
            onClick={() => handlePresetClick(normalizedColor)}
          >
            <span
              className={clsx('size-full', 'rounded-full')}
              style={{
                backgroundColor: normalizedColor,
              }}
            />
          </button>
        );
      })}

      {/* Trigger */}
      <button
        className={clsx(
          'flex items-center justify-center',
          'size-8',
          'rounded-full',
          'transition-colors',
          'bg-white/5',
          'border border-dashed border-white/30',
          'hover:bg-white/10',
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-white/50',
          'disabled:pointer-events-none',
          'disabled:opacity-50',
        )}
        ref={setReferenceRef}
        type="button"
        disabled={disabled}
        aria-label="Choose custom color"
        {...getReferenceProps()}
      >
        <IconPlus1 className="min-w-2.5 w-2.5 h-2.5" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <FloatingPortal>
          <div
            className={clsx(
              'z-50',
              'w-fit',
              'rounded-xl',
              'border border-white/10',
              'bg-[#131B2E]',
              'p-1',
              'shadow-2xl',
            )}
            ref={setFloatingRef}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div className="sketch-color-picker">
              <Sketch
                color={customColorTemp}
                presetColors={[]}
                disableAlpha
                onChange={(selected) => {
                  setCustomColorTemp(selected.hex);
                }}
              />
            </div>

            <div className="mt-1 p-2.5">
              <button
                className={clsx(
                  'w-full',
                  'rounded-lg',
                  'border border-white/10',
                  'bg-white/5',
                  'px-4 py-2',
                  'text-sm text-white',
                  'transition-colors',
                  'hover:bg-white/10',
                )}
                type="button"
                onClick={handleAddColor}
                disabled={isCustomColorPreset}
              >
                {isCustomColorPreset ? 'Color already exists' : 'Add Color'}
                {/* Add Color */}
              </button>
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}
