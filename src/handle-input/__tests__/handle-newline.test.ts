import buildHandleNewLine, {InputHandlerStep} from '../handle-newline';

const handleNewLine = buildHandleNewLine();

describe('Handle input', () => {
  test('handle test cases input', async () => {
    const testCasesInput = await handleNewLine({newLine: '10'});

    expect(testCasesInput).toMatchObject({
      currentStep: InputHandlerStep.matrixSize,
      testCases: 10,
    });
  });

  test('handle matrix size input', async () => {
    const testCasesInput = await handleNewLine({newLine: '2'});
    const matrixSizeInput = await handleNewLine({
      lastInput: testCasesInput,
      newLine: '3 4',
    });

    expect(matrixSizeInput).toMatchObject({
      currentStep: InputHandlerStep.matrixRawInProgress,
      matrix: [],
      matrixSize: [3, 4],
      whitePixels: [],
    });
  });

  describe('handle several matrix inputs given matrix size', () => {
    test('given 1 test case', async () => {
      const onBitmapReadyForComputing = jest.fn();

      const handleNewLine = buildHandleNewLine(matrix => {
        onBitmapReadyForComputing(matrix);
      });

      const testCasesInput = await handleNewLine({newLine: '1'});
      const matrixSizeInput = await handleNewLine({
        lastInput: testCasesInput,
        newLine: '3 4',
      });

      const matrixInput1 = await handleNewLine({
        lastInput: matrixSizeInput,
        newLine: '0 0 0 1',
      });
      expect(matrixInput1).toMatchObject({
        ...matrixSizeInput,
        matrix: [[0, 0, 0, 1]],
        whitePixels: [[0, 3]],
      });

      const matrixInput2 = await handleNewLine({
        lastInput: matrixInput1,
        newLine: '0 0 0 0',
      });
      expect(matrixInput2).toMatchObject({
        ...matrixInput1,
        matrix: [
          [0, 0, 0, 1],
          [0, 0, 0, 0],
        ],
      });

      const matrixInput3 = await handleNewLine({
        lastInput: matrixInput2,
        newLine: '1 0 0 0',
      });
      const expectedMatrixForComputing = [
        [0, 0, 0, 1],
        [0, 0, 0, 0],
        [1, 0, 0, 0],
      ];
      const expectedWhitePixels = [
        [0, 3],
        [2, 0],
      ];
      expect(matrixInput3).toMatchObject({
        ...matrixInput2,
        currentStep: InputHandlerStep.testCasesCompleted,
        currentTestCase: 1,
        matrix: expectedMatrixForComputing,
        whitePixels: expectedWhitePixels,
      });

      expect(onBitmapReadyForComputing).toHaveBeenCalledTimes(1);
      expect(onBitmapReadyForComputing).toHaveBeenCalledWith({
        metadata: {
          isLast: true,
          testCase: 1,
          whitePixels: expectedWhitePixels,
        },
        matrix: expectedMatrixForComputing,
      });
    });

    test('given 2 test cases', async () => {
      const onBitmapReadyForComputing = jest.fn();

      const handleNewLine = buildHandleNewLine(matrix => {
        onBitmapReadyForComputing(matrix);
      });

      const testCasesInput = await handleNewLine({newLine: '2'});
      const matrixSizeInput1 = await handleNewLine({
        lastInput: testCasesInput,
        newLine: '3 4',
      });
      const matrixInput1 = await handleNewLine({
        lastInput: matrixSizeInput1,
        newLine: '0 0 0 1',
      });
      const matrixInput2 = await handleNewLine({
        lastInput: matrixInput1,
        newLine: '0 0 0 0',
      });
      const matrixInput3 = await handleNewLine({
        lastInput: matrixInput2,
        newLine: '1 0 0 0',
      });
      expect(matrixInput3).toMatchObject({
        currentStep: InputHandlerStep.matrixSize,
        currentTestCase: 1,
        testCases: 2,
      });

      const matrixSizeInput2 = await handleNewLine({
        lastInput: matrixInput3,
        newLine: '1 4',
      });
      const matrixInput4 = await handleNewLine({
        lastInput: matrixSizeInput2,
        newLine: '0 0 0 1',
      });

      const expectedMatrixForComputing = [[0, 0, 0, 1]];
      const expectedWhitePixels = [[0, 3]];
      expect(matrixInput4).toMatchObject({
        ...matrixSizeInput2,
        currentStep: InputHandlerStep.testCasesCompleted,
        currentTestCase: 2,
        matrix: expectedMatrixForComputing,
        whitePixels: expectedWhitePixels,
      });

      expect(onBitmapReadyForComputing).toHaveBeenCalledTimes(2);
      expect(onBitmapReadyForComputing.mock.calls[1][0]).toMatchObject({
        metadata: {
          whitePixels: expectedWhitePixels,
        },
        matrix: expectedMatrixForComputing,
      });
    });
  });

  describe('whitePixels', () => {
    test('whitePixels is empty', async () => {
      const testCasesInput = await handleNewLine({newLine: '1'});
      const matrixSizeInput = await handleNewLine({
        lastInput: testCasesInput,
        newLine: '2 2',
      });
      const matrixInput1 = await handleNewLine({
        lastInput: matrixSizeInput,
        newLine: '0 0',
      });
      const matrixInput2 = await handleNewLine({
        lastInput: matrixInput1,
        newLine: '0 0',
      });

      expect(matrixInput2).toMatchObject({
        whitePixels: [],
      });
    });

    test('whitePixels has one item which is the WHITE value on first line', async () => {
      const testCasesInput = await handleNewLine({newLine: '1'});
      const matrixSizeInput = await handleNewLine({
        lastInput: testCasesInput,
        newLine: '2 2',
      });
      const matrixInput1 = await handleNewLine({
        lastInput: matrixSizeInput,
        newLine: '1 0',
      });
      const matrixInput2 = await handleNewLine({
        lastInput: matrixInput1,
        newLine: '0 0',
      });

      expect(matrixInput2).toMatchObject({
        whitePixels: [[0, 0]],
      });
    });
  });
});
