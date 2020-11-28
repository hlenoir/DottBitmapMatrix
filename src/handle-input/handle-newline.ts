import * as joi from 'joi';
import {BLACK, Matrix, OnBitmapReadyForComputing, WHITE} from '../types';

export enum InputHandlerStep {
  testCases,
  matrixSize,
  matrixRawInProgress,
  testCasesCompleted,
}

export interface Input {
  currentStep: InputHandlerStep;
  currentTestCase: number;
  matrixSize?: [number, number];
  matrix?: Matrix;
  maxtrixLineSchema?: joi.Schema;
  testCases?: number;
  whitePixels: number[][];
}

const testCasesSchema = joi.number().min(1).max(1000);

const matrixSizeSchema = joi
  .array()
  .items(joi.number().min(1).max(182))
  .length(2);

export default function buildHandleNewLine(
  onBitmapReadyForComputing?: OnBitmapReadyForComputing
) {
  return handleNewLine;

  async function handleNewLine({
    lastInput = {
      currentStep: InputHandlerStep.testCases,
      currentTestCase: 0,
      whitePixels: [],
    },
    newLine,
  }: {
    lastInput?: Input;
    newLine: string;
  }): Promise<Input | undefined> {
    const getMatrixRowsCount = (input: Input) => {
      return input?.matrixSize![0];
    };

    const isLastTestCase = (input: Input) => {
      return input.currentTestCase + 1 === input.testCases;
    };

    switch (lastInput.currentStep) {
      case InputHandlerStep.testCases: {
        const testCases = await testCasesSchema.validateAsync(newLine);

        return {
          ...lastInput,
          testCases,
          currentStep: lastInput.currentStep + 1,
        };
      }

      case InputHandlerStep.matrixSize: {
        const parsed = newLine.split(' ');
        const matrixSize = await matrixSizeSchema.validateAsync(parsed);

        return {
          ...lastInput,
          matrixSize,
          maxtrixLineSchema: joi
            .array()
            .items(joi.number().valid(BLACK, WHITE))
            .length(matrixSize[1]),
          matrix: [],
          currentStep: lastInput.currentStep + 1,
        };
      }

      case InputHandlerStep.matrixRawInProgress: {
        const parsed = newLine.split(' ');

        // Matrix
        const rowItems: number[] = await lastInput.maxtrixLineSchema?.validateAsync(
          parsed
        );
        const matrix = lastInput.matrix!.concat([rowItems]);

        // White Pixels
        const whitePixels = lastInput.whitePixels.concat(
          rowItems
            .map((rowItem, index) => ({
              value: rowItem,
              pixel: [matrix.length - 1, index],
            }))
            .filter(({value}) => value === WHITE)
            .map(({pixel}) => pixel)
        );

        // Check whether matrix raw input is over
        if (matrix.length === getMatrixRowsCount(lastInput)) {
          const isLast = isLastTestCase(lastInput);

          const resultInput: Input = {
            ...lastInput,
            currentStep: isLast
              ? InputHandlerStep.testCasesCompleted
              : InputHandlerStep.matrixSize,
            currentTestCase: lastInput.currentTestCase + 1,
            matrix,
            whitePixels: isLast ? whitePixels : [],
          };

          if (onBitmapReadyForComputing) {
            onBitmapReadyForComputing({
              matrix,
              metadata: {
                isLast,
                testCase: resultInput.currentTestCase,
                whitePixels,
              },
            });
          }

          return resultInput;
        }

        return {
          ...lastInput,
          matrix,
          whitePixels,
        };
      }

      default: {
        return undefined;
      }
    }
  }
}
