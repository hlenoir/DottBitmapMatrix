import {IBitmap, Pixel, WHITE} from '../types';
import {distanceBetweenPixels} from '../utils/distance';

const DIRECTIONS = ['TOP', 'RIGHT', 'BOTTOM', 'LEFT'] as const;
type Direction = typeof DIRECTIONS[number];

export interface IComputeDistancesResult {
  algorithm: 'HIGH_PERF' | 'LOW_PERF';
  bitmap: IBitmap;
  perf: [number, number];
}

interface IVisitPixel {
  currentDirection?: Direction;
  pixel: Pixel;
  whitePixel: Pixel;
}

export function lowPerfTransform(bitmap: IBitmap): IComputeDistancesResult {
  // Record the start time
  const startTime = process.hrtime();

  const rows = bitmap.matrix.length;
  const cols = bitmap.matrix[0].length;
  const distances: number[][] = new Array(rows);

  for (let i = 0; i < rows; i++) {
    distances[i] = new Array(cols);

    for (let j = 0; j < cols; j++) {
      const minDistance = bitmap.metadata.whitePixels
        .map(whitePixel => distanceBetweenPixels([i, j], whitePixel))
        .sort((a, b) => a - b)[0];

      distances[i][j] = minDistance;
    }
  }

  // Record the perf
  const perf = process.hrtime(startTime);

  return {
    algorithm: 'LOW_PERF',
    bitmap: {
      ...bitmap,
      metadata: {
        ...bitmap.metadata,
        distances,
      },
    },
    perf,
  };
}

export function highPerfTransform(bitmap: IBitmap): IComputeDistancesResult {
  // Record the start time
  const startTime = process.hrtime();

  const rows = bitmap.matrix.length;
  const cols = bitmap.matrix[0].length;
  const distances = new Array(rows)
    .fill(Number.POSITIVE_INFINITY)
    .map(() => new Array(cols).fill(Number.POSITIVE_INFINITY));

  // For each while pixel go to the fours directions
  bitmap.metadata.whitePixels.forEach(whitePixel => {
    visitPixel({
      pixel: whitePixel,
      whitePixel,
    });

    // Flag distances matrix while pixel distance to 0
    distances[whitePixel[0]][whitePixel[1]] = 0;
  });

  // Record the perf
  const perf = process.hrtime(startTime);

  return {
    algorithm: 'HIGH_PERF',
    bitmap: {
      ...bitmap,
      metadata: {
        ...bitmap.metadata,
        distances,
      },
    },
    perf,
  };

  function visitPixel(visitor: IVisitPixel): void {
    const pixelToVisit = visitor.pixel;

    const existingDistance = distances?.[pixelToVisit[0]]?.[pixelToVisit[1]];
    if (existingDistance === undefined) {
      // Out of bound
      return;
    }

    const newDistance = distanceBetweenPixels(pixelToVisit, visitor.whitePixel);
    if (existingDistance <= newDistance) {
      // Already fulfilled with a lower or equal distance hence stopping recursive visits
      return;
    }

    distances[pixelToVisit[0]][pixelToVisit[1]] = newDistance;

    // Go to every directions from a while pixel
    // or
    // Go to every directions except the one we went through from a black pixel
    const filteredDirections = visitor.currentDirection
      ? DIRECTIONS.filter(
          direction =>
            direction !== getOppositeDirection(visitor.currentDirection!)
        )
      : DIRECTIONS;

    filteredDirections.forEach(direction => {
      const nextPixelToVisit = getNextPixelToVisit({
        direction,
        pixel: pixelToVisit,
      });

      const isWhilePixel =
        bitmap.matrix?.[nextPixelToVisit[0]]?.[nextPixelToVisit[1]] === WHITE;
      if (isWhilePixel) {
        // Already computed
        return;
      }

      return visitPixel({
        ...visitor,
        currentDirection: direction,
        pixel: nextPixelToVisit,
      });
    });

    function getNextPixelToVisit({
      direction,
      pixel,
    }: {
      direction: Direction;
      pixel: Pixel;
    }): Pixel {
      switch (direction) {
        case 'TOP':
          return [pixel[0] - 1, pixel[1]];
        case 'RIGHT':
          return [pixel[0], pixel[1] + 1];
        case 'BOTTOM':
          return [pixel[0] + 1, pixel[1]];
        case 'LEFT':
          return [pixel[0], pixel[1] - 1];
        default:
          throw new Error(`Invalid direction: ${direction}`);
      }
    }

    function getOppositeDirection(direction: Direction): Direction {
      let oppositeDirection: Direction;

      switch (direction) {
        case 'TOP':
          oppositeDirection = 'BOTTOM';
          break;
        case 'RIGHT':
          oppositeDirection = 'LEFT';
          break;
        case 'BOTTOM':
          oppositeDirection = 'TOP';
          break;
        case 'LEFT':
          oppositeDirection = 'RIGHT';
          break;
        default:
          throw new Error(`Invalid direction: ${direction}`);
      }

      return oppositeDirection;
    }
  }
}
