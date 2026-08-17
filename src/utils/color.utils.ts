import { type Color, converter, formatHex, parse } from 'culori';

export interface ColorPalette {
  primary: string;
  primaryHover: string;
  primaryActive: string;

  secondary: string;
  secondaryHover: string;
  secondaryActive: string;

  primaryForeground: string;
  secondaryForeground: string;

  border: string;
  ring: string;
}

export const COLOR_PRESETS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

const toOklch = converter('oklch');

const toRgb = converter('rgb');

const colorToOklch = (color: string) => {
  const parsed = parse(color);

  if (!parsed) {
    throw new Error(`Invalid project color: ${color}`);
  }

  const oklch = toOklch(parsed);

  if (!oklch) {
    throw new Error(`Unable to convert project color: ${color}`);
  }

  return oklch;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const createOklchColor = (
  lightness: number,
  chroma: number,
  hue: number | undefined,
) => {
  return oklchToHex({
    mode: 'oklch',
    l: clamp(lightness, 0, 1),
    c: clamp(chroma, 0, 0.4),
    h: hue,
  });
};

const getForeground = (color: string) => {
  const parsed = parse(color);

  if (!parsed) {
    return '#FFFFFF';
  }

  const rgb = toRgb(parsed);

  if (!rgb) {
    return '#FFFFFF';
  }

  const getLuminance = (channel: number) => {
    const value = channel / 255;

    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  const red = getLuminance((rgb.r ?? 0) * 255);
  const green = getLuminance((rgb.g ?? 0) * 255);
  const blue = getLuminance((rgb.b ?? 0) * 255);

  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

  const whiteContrast = 1.05 / (luminance + 0.05);
  const blackContrast = (luminance + 0.05) / 0.05;

  return whiteContrast >= blackContrast ? '#FFFFFF' : '#111827';
};

const oklchToHex = (color: Color) => {
  return formatHex(toRgb(color));
};

export const generateColorPalette = (baseColor: string): ColorPalette => {
  const primaryOklch = colorToOklch(baseColor);

  const primary = oklchToHex(primaryOklch);

  const lightness = primaryOklch.l ?? 0.6;
  const chroma = primaryOklch.c ?? 0.15;
  const hue = primaryOklch.h;

  /*
   * Primary interactions
   *
   * We move lightness/chroma instead of simply using
   * lighten/darken so the colors behave more naturally.
   */
  const primaryHover = createOklchColor(lightness - 0.06, chroma * 0.95, hue);

  const primaryActive = createOklchColor(lightness - 0.11, chroma * 0.9, hue);

  /*
   * Secondary colors
   *
   * Same hue as primary, but substantially lighter
   * and less saturated.
   *
   * This gives us:
   *
   *   Indigo → very light indigo
   *   Green  → very light green
   *   Orange → very light orange
   *   etc.
   */
  const secondary = createOklchColor(0.95, Math.min(chroma * 0.25, 0.055), hue);

  const secondaryHover = createOklchColor(
    0.92,
    Math.min(chroma * 0.32, 0.07),
    hue,
  );

  const secondaryActive = createOklchColor(
    0.88,
    Math.min(chroma * 0.4, 0.085),
    hue,
  );

  /*
   * Secondary foreground should retain the project's
   * hue while being dark enough to remain readable.
   */
  const secondaryForeground = createOklchColor(
    0.35,
    Math.min(chroma * 0.8, 0.16),
    hue,
  );

  /*
   * Border is a middle-ground tint between the primary
   * and secondary colors.
   */
  const border = createOklchColor(0.84, Math.min(chroma * 0.35, 0.075), hue);

  /*
   * Ring is useful for focus states.
   */
  const ring = createOklchColor(0.7, Math.min(chroma * 0.75, 0.18), hue);

  return {
    primary,
    primaryHover,
    primaryActive,

    secondary,
    secondaryHover,
    secondaryActive,

    primaryForeground: getForeground(primary),
    secondaryForeground,

    border,
    ring,
  };
};
