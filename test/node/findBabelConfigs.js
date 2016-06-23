const test = require('eater/runner').test;
const findBabelConfigs = require(`${process.cwd()}/lib/findBabelConfigs`);
const assert = require('assert');

test('findBabelConfigs in babelrc', () => {
  const configs = findBabelConfigs(`${process.cwd()}/test/fixtures/foo.js`);
  assert(configs[0].match(/.babelrc/));
})

test('findBabelConfigs in package.json', () => {
  const configs = findBabelConfigs(`${process.cwd()}/test/fixtures/package/bar.js`);
  assert(configs[0].match(/package.json/));
})

test('findBabelConfigs in .babelignore and babelrc', () => {
  const configs = findBabelConfigs(`${process.cwd()}/test/fixtures/ignore/rc/foo.js`);
  assert(configs.some((conf) => conf.match(/rc\/.babelrc/)));
  assert(configs.some((conf) => conf.match(/ignore\/.babelignore/)));
})

