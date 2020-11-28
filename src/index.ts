import * as yargs from 'yargs';
import handleInput from './handle-input';
import buildOnBitmapReadyForComputing from './transform-bitmap';

const options = yargs
  .usage('Usage: -n <name>')
  .option('h', {
    alias: 'highPerfComputing',
    describe: `True value leads to the usage of recursive high perf algorithm to compute distances.
      False leads to fallback on low perf iterative one.`,
    type: 'boolean',
    demandOption: false,
    default: true,
  })
  .option('v', {
    alias: 'log-perf',
    describe: 'Log perf of last bitmap computation',
    type: 'boolean',
    demandOption: false,
    default: false,
  })
  .help('info').argv;

void handleInput(
  buildOnBitmapReadyForComputing({
    highPerfComputingAlgorithm: options.h,
    logPerf: options.v,
  })
);
