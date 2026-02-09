import { describe, expect, it } from 'vitest';

import {
  createEmptyStars,
  fillStars,
  getAverageRating,
  getDefaultRatingData,
  parseRatingData,
  serializeRatingData,
  updateRating,
} from '../src/core/rating';

describe('rating core', () => {
  it('returns default state for null input', () => {
    expect(parseRatingData(null)).toEqual({ totalScore: 0, totalRatings: 0 });
  });

  it('returns default state for invalid json', () => {
    expect(parseRatingData('{')).toEqual({ totalScore: 0, totalRatings: 0 });
  });

  it('returns default state for wrong schema', () => {
    expect(parseRatingData(JSON.stringify({ score: 10 }))).toEqual({ totalScore: 0, totalRatings: 0 });
  });

  it('normalizes negative parsed values', () => {
    expect(parseRatingData(JSON.stringify({ totalScore: -5, totalRatings: -2 }))).toEqual({
      totalScore: 0,
      totalRatings: 0,
    });
  });

  it('updates rating with clamped value', () => {
    const updated = updateRating(getDefaultRatingData(), 8);
    expect(updated).toEqual({ totalScore: 5, totalRatings: 1 });
  });

  it('handles non-finite rating input safely', () => {
    const updated = updateRating(getDefaultRatingData(), Number.NaN);
    expect(updated).toEqual({ totalScore: 0, totalRatings: 1 });
  });

  it('computes average with one decimal place', () => {
    expect(getAverageRating({ totalScore: 7, totalRatings: 2 })).toBe(3.5);
  });

  it('returns zero average for empty dataset', () => {
    expect(getAverageRating({ totalScore: 0, totalRatings: 0 })).toBe(0);
  });

  it('serializes rating data', () => {
    expect(serializeRatingData({ totalScore: 5, totalRatings: 2 })).toBe('{"totalScore":5,"totalRatings":2}');
  });

  it('creates star arrays safely', () => {
    expect(createEmptyStars(5)).toEqual([false, false, false, false, false]);
    expect(createEmptyStars(-1)).toEqual([]);
  });

  it('fills stars up to clamped rating', () => {
    expect(fillStars([false, false, false, false, false], 3)).toEqual([
      true,
      true,
      true,
      false,
      false,
    ]);
    expect(fillStars([false, false, false], 9)).toEqual([true, true, true]);
  });

  it('treats invalid parsed numbers as zero', () => {
    const parsed = parseRatingData(JSON.stringify({ totalScore: Number.POSITIVE_INFINITY, totalRatings: NaN }));
    expect(parsed).toEqual({ totalScore: 0, totalRatings: 0 });
  });
});
