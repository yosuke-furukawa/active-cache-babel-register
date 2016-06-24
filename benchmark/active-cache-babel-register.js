const test = require('eater/runner').test;
const register = require(`${process.cwd()}/lib/node`);

// create cache
require('../test/fixtures/foo');
require('../test/fixtures/bar');
require('../test/fixtures/baz');
require('../test/fixtures/qux');

register();

test('foo', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('bar', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('baz', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('qux', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('foo2', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('bar2', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('baz2', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('qux2', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('foo3', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('bar3', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('baz3', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})

test('qux3', () => {
  require('../test/fixtures/foo');
  require('../test/fixtures/bar');
  require('../test/fixtures/baz');
  require('../test/fixtures/qux');
})
