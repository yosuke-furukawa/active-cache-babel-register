active-cache-babel-register
===========================
[![npm version](https://badge.fury.io/js/active-cache-babel-register.svg)](https://badge.fury.io/js/active-cache-babel-register)
[![Build Status](https://travis-ci.org/yosuke-furukawa/active-cache-babel-register.svg?branch=master)](https://travis-ci.org/yosuke-furukawa/active-cache-babel-register)
[![Coverage Status](https://coveralls.io/repos/github/yosuke-furukawa/active-cache-babel-register/badge.svg?branch=master)](https://coveralls.io/github/yosuke-furukawa/active-cache-babel-register?branch=master)

active-cache-babel-register improves performance of babel transpilation using cache actively.

## Cache Strategy

- babel finds config files and load these files every startup time, active-cache-babel-register set the config files to cache registry.
- babel-register does not support multi-process cache like cluster/child_process, active-cache-babel-register has 2 cache stores, 1st cache store is original one, 2nd cache store can be used in multi-process
- active-cache-babel-register purges cache if babel-version/.babelrc/package.json/.babelignore and target files are changed

## Performance

```
babel-register
Total duration time: 18170ms

active-cache-babel-register
Total duration time: 5122ms
```
