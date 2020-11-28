import {distanceBetweenPixels} from '../distance';

describe('Utils', () => {
  describe('Distance', () => {
    test('Distance between two pixels', () => {
      expect(distanceBetweenPixels([0, 0], [0, 3])).toBe(3);
      expect(distanceBetweenPixels([0, 0], [3, 3])).toBe(6);
    });
  });
});
