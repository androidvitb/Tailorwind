import { describe, expect, it } from 'vitest';

import { adjustBrightness, hexToRgb, rgbToCss } from '../src/core/color';

describe('color core', () => {
  it('parses 6-digit hex values', () => {
    expect(hexToRgb('#0f1011')).toEqual({ r: 15, g: 16, b: 17 });
  });

  it('parses 3-digit hex values', () => {
    expect(hexToRgb('#abc')).toEqual({ r: 170, g: 187, b: 204 });
  });

  it('returns null for invalid hex values', () => {
    expect(hexToRgb('zzz')).toBeNull();
  });

  it('adjusts brightness up and down', () => {
    expect(adjustBrightness('#202020', 16)).toBe('#303030');
    expect(adjustBrightness('#202020', -16)).toBe('#101010');
  });

  it('clamps out-of-range brightness results', () => {
    expect(adjustBrightness('#fefefe', 50)).toBe('#ffffff');
    expect(adjustBrightness('#010101', -50)).toBe('#000000');
  });

  it('returns fallback color for invalid input', () => {
    expect(adjustBrightness('oops', 5)).toBe('#000000');
  });

  it('formats rgba css strings with alpha clamping', () => {
    expect(rgbToCss({ r: 10, g: 20, b: 30 }, 0.5)).toBe('rgba(10, 20, 30, 0.5)');
    expect(rgbToCss({ r: 10, g: 20, b: 30 }, 2)).toBe('rgba(10, 20, 30, 1)');
    expect(rgbToCss({ r: Number.NaN, g: Number.POSITIVE_INFINITY, b: 30 }, -1)).toBe(
      'rgba(0, 0, 30, 0)',
    );
  });
});
