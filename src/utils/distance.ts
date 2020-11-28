import {Pixel} from '../types';

export function distanceBetweenPixels(pixel1: Pixel, pixel2: Pixel): number {
  return Math.abs(pixel1[0] - pixel2[0]) + Math.abs(pixel1[1] - pixel2[1]);
}
