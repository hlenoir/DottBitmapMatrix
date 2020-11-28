# Build
```
nvm install v14.15.1
nvm use
yarn build
```

# Unit tests
```
yarn test
```

# Run
```
node ./dist/index.js --info     
Usage: -n <name>

Options:
      --version            Show version number                         [boolean]
  -h, --highPerfComputing  True value leads to the usage of recursive high perf
                           algorithm to compute distances.
                           False leads to fallback on low perf iterative one.
                                                       [boolean] [default: true]
  -v, --log-perf           Log perf of last bitmap computation
                                                      [boolean] [default: false]
      --info               Show help                                   [boolean]
```
⚠️ For complex matrixes (eg. 182x182 with few white pixels and high perf algorithm):
```
node --stack-size=10000 ./dist/index.js
```

# Example
```
node ./dist/index.js -h -v
3
3 4
0 0 0 1
0 0 1 1
0 1 1 0
1 4
0 0 0 1
10 10
1 0 0 0 1 1 0 0 0 0
0 1 1 1 1 0 0 1 1 0
0 1 0 0 1 1 0 1 0 0
0 1 0 1 0 1 1 0 1 1
0 1 1 1 1 1 0 1 0 1
0 0 0 1 0 0 0 1 0 1
1 1 0 0 1 0 0 0 0 0
1 1 0 1 1 0 1 1 1 1
0 0 0 1 1 1 1 1 0 1
1 0 0 0 1 0 0 0 1 0
test case 1 -->
3 2 1 0
2 1 0 0
1 0 0 1
HIGH_PERF execution time: 0s.419623ns
test case 2 -->
3 2 1 0
HIGH_PERF execution time: 0s.29648ns
test case 3 -->
0 1 1 1 0 0 1 1 1 2
1 0 0 0 0 1 1 0 0 1
1 0 1 1 0 0 1 0 1 1
1 0 1 0 1 0 0 1 0 0
1 0 0 0 0 0 1 0 1 0
1 1 1 0 1 1 1 0 1 0
0 0 1 1 0 1 1 1 1 1
0 0 1 0 0 1 0 0 0 0
1 1 1 0 0 0 0 0 1 0
0 1 2 1 0 1 1 1 0 1
HIGH_PERF execution time: 0s.820165ns
```
