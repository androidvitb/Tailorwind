export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RgbColor | null {
  const normalized = normalizeHex(hex);
  if (!normalized) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

export function adjustBrightness(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return '#000000';
  }

  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const next = {
    r: clamp255(rgb.r + safeAmount),
    g: clamp255(rgb.g + safeAmount),
    b: clamp255(rgb.b + safeAmount),
  };

  return rgbToHex(next);
}

export function rgbToCss(color: RgbColor, alpha = 1): string {
  const safeAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${clamp255(color.r)}, ${clamp255(color.g)}, ${clamp255(color.b)}, ${safeAlpha})`;
}

function normalizeHex(hex: string): string | null {
  const cleaned = hex.trim().replace(/^#/, '');
  if (cleaned.length === 3 && /^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return cleaned
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
  }

  if (cleaned.length === 6 && /^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

function rgbToHex(color: RgbColor): string {
  const parts = [color.r, color.g, color.b].map((channel) =>
    clamp255(channel).toString(16).padStart(2, '0'),
  );

  return `#${parts.join('')}`;
}

function clamp255(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(255, Math.max(0, Math.round(value)));
}
