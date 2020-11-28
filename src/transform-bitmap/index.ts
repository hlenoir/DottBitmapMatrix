import {IBitmap, OnBitmapReadyForComputing} from '../types';
import {
  highPerfTransform,
  IComputeDistancesResult,
  lowPerfTransform,
} from './compute-distances';

const printQueue: IComputeDistancesResult[] = [];

export default function buildOnBitmapReadyForComputing({
  highPerfComputingAlgorithm,
  logPerf,
}: {
  highPerfComputingAlgorithm: boolean;
  logPerf: boolean;
}) {
  const onBitmapReadyForComputing: OnBitmapReadyForComputing = function (
    bitmap?: IBitmap
  ) {
    if (bitmap === undefined) {
      throw new Error('Bitmap cannot be undefined');
    }

    if (bitmap.metadata.whitePixels.length === 0) {
      throw new Error('Bitmap has not white item');
    }

    const transform: (
      bitmap: IBitmap
    ) => IComputeDistancesResult = highPerfComputingAlgorithm
      ? highPerfTransform
      : lowPerfTransform;

    const distances = transform(bitmap);

    printQueue.push(distances);

    if (distances.bitmap.metadata.isLast) {
      // ⚠️ Pretty print
      printQueue.forEach(distancesToPrint => {
        console.log(
          `test case ${distancesToPrint.bitmap.metadata.testCase} -->`
        );

        distancesToPrint.bitmap.metadata.distances?.forEach(row =>
          console.log(row.join(' '))
        );

        if (logPerf) {
          console.log(
            `${distancesToPrint.algorithm} execution time: ${distancesToPrint.perf[0]}s.${distancesToPrint.perf[1]}ns`
          );
        }
      });
    }
  };

  return onBitmapReadyForComputing;
}
