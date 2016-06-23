const babel = require('babel-core');
const registry = require('./registry');
const path = require('path');
const compileBabel = require('./compileBabel');
const util = babel.util;

const cwd = process.cwd();
var oldHandlers = {};
var transformOpts = {};
var ignore;
var only;
var cache = registry.load();

function getRelativePath(filename) {
  return path.relative(cwd, filename);
}

function shouldIgnore(filename) {
  if (!ignore && !only) {
    return getRelativePath(filename).split(path.sep).indexOf("node_modules") >= 0;
  } else {
    return util.shouldIgnore(filename, ignore || [], only);
  }
}

function loader(m, filename) {
  m._compile(compileBabel(filename, cache, transformOpts), filename);
}

function registerExtension(ext) {
  const old = oldHandlers[ext] || oldHandlers[".js"] || require.extensions[".js"];

  require.extensions[ext] = (m, filename) => {
    if (shouldIgnore(filename)) {
      old(m, filename);
    } else {
      loader(m, filename);
    }
  };
}

function hookExtensions(_exts) {
  Object.keys(oldHandlers).forEach((ext) => {
    if (oldHandlers[ext] === undefined) {
      delete require.extensions[ext];
    } else {
      require.extensions[ext] = oldHandlers[ext];
    }
  });

  oldHandlers = {};

  _exts.forEach((ext) => {
    oldHandlers[ext] = require.extensions[ext];
    registerExtension(ext);
  });
}

hookExtensions(util.canCompile.EXTENSIONS);

module.exports = function(opts) {
  if (!opts) opts = {};
  if (opts.only != null) only = util.arrayify(opts.only, util.regexify);
  if (opts.ignore != null) ignore = util.arrayify(opts.ignore, util.regexify);

  if (opts.extensions) hookExtensions(util.arrayify(opts.extensions));

  if (opts.cache === false) cache = null;

  delete opts.extensions;
  delete opts.ignore;
  delete opts.cache;
  delete opts.only;

  transformOpts = Object.assign(transformOpts, opts);
}

