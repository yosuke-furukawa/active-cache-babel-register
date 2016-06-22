const test = require('eater/runner').test;
const register = require(`${process.cwd()}/lib/node`);

register();

require('../fixtures/foo');

test('foo', () => {
  require('../fixtures/foo');
})
