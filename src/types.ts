export type Matrix = number[][];
export type Pixel = number[];

export interface IBitmap {
  matrix: Matrix;
  metadata: {
    distances?: Matrix;
    isLast: boolean;
    testCase: number;
    whitePixels: Pixel[];
  };
}

export const BLACK = 0;
export const WHITE = 1;

export type OnBitmapReadyForComputing = (bitmap?: IBitmap) => void;
