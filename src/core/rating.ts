export interface RatingData {
  totalScore: number;
  totalRatings: number;
}

const DEFAULT_RATING_DATA: RatingData = {
  totalScore: 0,
  totalRatings: 0,
};

export function getDefaultRatingData(): RatingData {
  return { ...DEFAULT_RATING_DATA };
}

export function parseRatingData(raw: string | null): RatingData {
  if (!raw) {
    return getDefaultRatingData();
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRatingData(parsed)) {
      return getDefaultRatingData();
    }

    return {
      totalScore: clampToNonNegativeNumber(parsed.totalScore),
      totalRatings: Math.floor(clampToNonNegativeNumber(parsed.totalRatings)),
    };
  } catch {
    return getDefaultRatingData();
  }
}

export function updateRating(data: RatingData, rating: number): RatingData {
  const safeRating = clampRating(rating);

  return {
    totalScore: data.totalScore + safeRating,
    totalRatings: data.totalRatings + 1,
  };
}

export function getAverageRating(data: RatingData): number {
  if (data.totalRatings === 0) {
    return 0;
  }

  return Number((data.totalScore / data.totalRatings).toFixed(1));
}

export function serializeRatingData(data: RatingData): string {
  return JSON.stringify(data);
}

export function createEmptyStars(count: number): boolean[] {
  const safeCount = Math.max(0, Math.floor(count));
  return Array.from({ length: safeCount }, () => false);
}

export function fillStars(stars: boolean[], rating: number): boolean[] {
  const safeRating = clampRating(rating);
  return stars.map((_, index) => index < safeRating);
}

function isRatingData(value: unknown): value is RatingData {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.totalScore === 'number' && typeof record.totalRatings === 'number';
}

function clampRating(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(5, Math.max(0, Math.floor(value)));
}

function clampToNonNegativeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}
