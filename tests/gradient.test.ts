import { describe, expect, it } from 'vitest';

import { buildGradientClass, sanitizeDirection, toCssLinearGradient } from '../src/core/gradient';

describe('gradient core', () => {
  it('sanitizes unsupported directions', () => {
    expect(sanitizeDirection('invalid')).toBe('to-r');
  });

  it('keeps supported directions', () => {
    expect(sanitizeDirection('to-bl')).toBe('to-bl');
  });

  it('builds tailwind gradient utility class', () => {
    expect(
      buildGradientClass({ direction: 'to-r', from: '#111111', via: '#222222', to: '#333333' }),
    ).toBe('bg-gradient-to-r from-[#111111] via-[#222222] to-[#333333]');
  });

  it('builds css linear gradient strings', () => {
    expect(
      toCssLinearGradient({ direction: 'to-tl', from: '#111111', via: '#222222', to: '#333333' }),
    ).toBe('linear-gradient(to top left, #111111, #222222, #333333)');
  });

  it('maps all supported directions to css', () => {
    expect(toCssLinearGradient({ direction: 'to-r', from: '#1', via: '#2', to: '#3' })).toContain(
      'to right',
    );
    expect(toCssLinearGradient({ direction: 'to-l', from: '#1', via: '#2', to: '#3' })).toContain(
      'to left',
    );
    expect(toCssLinearGradient({ direction: 'to-b', from: '#1', via: '#2', to: '#3' })).toContain(
      'to bottom',
    );
    expect(toCssLinearGradient({ direction: 'to-t', from: '#1', via: '#2', to: '#3' })).toContain(
      'to top',
    );
    expect(toCssLinearGradient({ direction: 'to-br', from: '#1', via: '#2', to: '#3' })).toContain(
      'to bottom right',
    );
    expect(toCssLinearGradient({ direction: 'to-bl', from: '#1', via: '#2', to: '#3' })).toContain(
      'to bottom left',
    );
    expect(toCssLinearGradient({ direction: 'to-tr', from: '#1', via: '#2', to: '#3' })).toContain(
      'to top right',
    );
  });

  it('falls back for runtime-invalid direction', () => {
    const invalidConfig = {
      direction: 'invalid-direction',
      from: '#111111',
      via: '#222222',
      to: '#333333',
    } as unknown as Parameters<typeof toCssLinearGradient>[0];
    expect(toCssLinearGradient(invalidConfig)).toContain('to right');
  });
});
