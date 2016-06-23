const test = require('eater/runner').test;
const register = require('babel-register');

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
