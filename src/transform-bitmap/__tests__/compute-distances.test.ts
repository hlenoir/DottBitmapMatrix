import {IBitmap} from '../../types';
import {highPerfTransform, lowPerfTransform} from '../compute-distances';
import complexDistances from './complex-distances';
import complexMatrix from './complex-matrix';
import complexWhitePixels from './complex-white-pixels';

describe('Compute distances', () => {
  describe('simple matrix', () => {
    const bitmap: IBitmap = {
      matrix: [[0, 0, 0, 1]],
      metadata: {
        isLast: true,
        testCase: 1,
        whitePixels: [[0, 3]],
      },
    };

    const expectedNewBitmap = {
      bitmap: {
        ...bitmap,
        metadata: {
          ...bitmap.metadata,
          distances: [[3, 2, 1, 0]],
        },
      },
    };

    test('create a footprint with low perf computing algorithm', () => {
      const newBitmap = lowPerfTransform(bitmap);

      expect(newBitmap).toMatchObject(expectedNewBitmap);
    });

    test('double check footfring with high perf algorithm', () => {
      const newBitmap = highPerfTransform(bitmap);

      expect(newBitmap).toMatchObject(expectedNewBitmap);
    });
  });

  describe('less simple matrix', () => {
    const bitmap: IBitmap = {
      matrix: [
        [0, 0, 0, 1],
        [0, 0, 1, 1],
        [0, 1, 1, 0],
      ],
      metadata: {
        isLast: true,
        testCase: 1,
        whitePixels: [
          [0, 3],
          [1, 2],
          [1, 3],
          [2, 1],
          [2, 2],
        ],
      },
    };

    const expectedNewBitmap = {
      bitmap: {
        ...bitmap,
        metadata: {
          ...bitmap.metadata,
          distances: [
            [3, 2, 1, 0],
            [2, 1, 0, 0],
            [1, 0, 0, 1],
          ],
        },
      },
    };

    test('create a footprint with low perf computing algorithm', () => {
      const newBitmap = lowPerfTransform(bitmap);

      expect(newBitmap).toMatchObject(expectedNewBitmap);
    });

    test('double check footfring with high perf algorithm', () => {
      const newBitmap = highPerfTransform(bitmap);

      expect(newBitmap).toMatchObject(expectedNewBitmap);
    });
  });

  describe('large matrix with only one white item', () => {
    const bitmap: IBitmap = {
      matrix: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      ],
      metadata: {
        isLast: true,
        testCase: 1,
        whitePixels: [[9, 5]],
      },
    };

    const expectedNewBitmap = {
      bitmap: {
        ...bitmap,
        metadata: {
          ...bitmap.metadata,
          distances: [
            [14, 13, 12, 11, 10, 9, 10, 11, 12, 13],
            [13, 12, 11, 10, 9, 8, 9, 10, 11, 12],
            [12, 11, 10, 9, 8, 7, 8, 9, 10, 11],
            [11, 10, 9, 8, 7, 6, 7, 8, 9, 10],
            [10, 9, 8, 7, 6, 5, 6, 7, 8, 9],
            [9, 8, 7, 6, 5, 4, 5, 6, 7, 8],
            [8, 7, 6, 5, 4, 3, 4, 5, 6, 7],
            [7, 6, 5, 4, 3, 2, 3, 4, 5, 6],
            [6, 5, 4, 3, 2, 1, 2, 3, 4, 5],
            [5, 4, 3, 2, 1, 0, 1, 2, 3, 4],
          ],
        },
      },
    };

    test('create a footprint with low perf computing algorithm', () => {
      const newBitmap = lowPerfTransform(bitmap);

      expect(newBitmap).toMatchObject(expectedNewBitmap);
    });

    test('double check footfring with high perf algorithm', () => {
      const newBitmap = highPerfTransform(bitmap);

      expect(newBitmap).toMatchObject(expectedNewBitmap);
    });
  });

  describe('complex matrix', () => {
    const bitmap: IBitmap = {
      matrix: complexMatrix,
      metadata: {
        isLast: true,
        testCase: 1,
        whitePixels: complexWhitePixels,
      },
    };

    const expectedNewBitmap = {
      bitmap: {
        ...bitmap,
        metadata: {
          ...bitmap.metadata,
          distances: complexDistances,
        },
      },
    };

    test('create a footprint with low perf computing algorithm', () => {
      const newBitmap = lowPerfTransform(bitmap);

      expect(newBitmap).toMatchObject(expectedNewBitmap);
    });

    test('double check footfring with high perf algorithm', () => {
      const newBitmap = highPerfTransform(bitmap);

      expect(newBitmap).toMatchObject(expectedNewBitmap);
    });
  });
});
