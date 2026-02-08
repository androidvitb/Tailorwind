export type GradientDirection = 'to-r' | 'to-l' | 'to-b' | 'to-t' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';

export interface GradientConfig {
  direction: GradientDirection;
  from: string;
  via: string;
  to: string;
}

const VALID_DIRECTIONS: Set<GradientDirection> = new Set([
  'to-r',
  'to-l',
  'to-b',
  'to-t',
  'to-br',
  'to-bl',
  'to-tr',
  'to-tl',
]);

export function sanitizeDirection(value: string): GradientDirection {
  if (VALID_DIRECTIONS.has(value as GradientDirection)) {
    return value as GradientDirection;
  }

  return 'to-r';
}

export function buildGradientClass(config: GradientConfig): string {
  return `bg-gradient-${config.direction} from-[${config.from}] via-[${config.via}] to-[${config.to}]`;
}

export function toCssLinearGradient(config: GradientConfig): string {
  const cssDirection = toCssDirection(config.direction);
  return `linear-gradient(${cssDirection}, ${config.from}, ${config.via}, ${config.to})`;
}

function toCssDirection(direction: GradientDirection): string {
  switch (direction) {
    case 'to-r':
      return 'to right';
    case 'to-l':
      return 'to left';
    case 'to-b':
      return 'to bottom';
    case 'to-t':
      return 'to top';
    case 'to-br':
      return 'to bottom right';
    case 'to-bl':
      return 'to bottom left';
    case 'to-tr':
      return 'to top right';
    case 'to-tl':
      return 'to top left';
    default:
      return 'to right';
  }
}
