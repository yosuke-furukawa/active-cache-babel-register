const test = require('eater/runner').test;
const mustCall = require('must-call');
const compileBabel = require(`${process.cwd()}/lib/compileBabel`);
const assert = require('assert');
const os = require('os');
const registry = require(`${process.cwd()}/lib/registry`);

process.env.BABEL_CACHE_PATH = `${os.tmpdir()}/.babel.json`;
process.env.BABEL_ACTIVE_CACHE_PATH = `${os.tmpdir()}/.babel_active`;

test('compileBabel', () => {
  const code = compileBabel(`${process.cwd()}/test/fixtures/foo.js`, {}, {});
  console.log = mustCall((name) => {
    assert(name === 'active-cache-babel-register');
  });
  eval(code);
});

test('compileBabel From cache', () => {
  var cache = {};
  compileBabel(`${process.cwd()}/test/fixtures/foo.js`, cache, {});
  const code = compileBabel(`${process.cwd()}/test/fixtures/foo.js`, cache, {});
  console.log = mustCall((name) => {
    assert(name === 'active-cache-babel-register');
  });
  eval(code);
});

test('compileBabel From cache registry', () => {
  registry.clearAllCache();
  compileBabel(`${process.cwd()}/test/fixtures/foo.js`, {}, {});
  const code = compileBabel(`${process.cwd()}/test/fixtures/foo.js`, {}, {});
  
  console.log = mustCall((name) => {
    assert(name === 'active-cache-babel-register');
  });
  eval(code);
});

