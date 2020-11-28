import * as readline from 'readline';
import buildHandleNewLine, {Input} from './handle-newline';
import {OnBitmapReadyForComputing} from '../types';

export default async function buildInputHandler(
  onBitmapReadyForComputing?: OnBitmapReadyForComputing
) {
  let lastInput: Input | undefined;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const handleNewLine = buildHandleNewLine(bitmap => {
    if (bitmap?.metadata.isLast) {
      rl.close(); // ⚠️ Leaving script
    }

    if (onBitmapReadyForComputing) {
      onBitmapReadyForComputing(bitmap);
    }
  });

  for await (const line of rl) {
    lastInput = await handleNewLine({lastInput, newLine: line});
  }
}
