const babel = require('babel-core');
const registry = require('./registry');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const pathExists = require('path-exists');
const cloneDeep = require('lodash/cloneDeep');
const findBabelConfigs = require('./findBabelConfigs');
const util = babel.util;
const OptionManager = babel.OptionManager;
const optionManager = new OptionManager();
const cwd = process.cwd();
var oldHandlers = {};
var transformOpts = {};
var ignore;
var only;
var cache = registry.load();

function getRelativePath(filename) {
  return path.relative(cwd, filename);
}

function mtime(filename) {
  return +fs.statSync(filename).mtime;
}

function shouldIgnore(filename) {
  if (!ignore && !only) {
    return getRelativePath(filename).split(path.sep).indexOf("node_modules") >= 0;
  } else {
    return util.shouldIgnore(filename, ignore || [], only);
  }
}

function initOptions(opts) {
  var results = optionManager.init(opts);
  return results;
}

function compile(filename) {
  var result;
  const configs = findBabelConfigs(filename);
  const configCachedKey = md5(JSON.stringify(configs.map((conf) => { 
    return {
      filename: filename,
      config: conf,
      mtime: mtime(conf)
    }
  })));
  const configCached = cache && cache[configCachedKey] && registry.getFromCacha(configCachedKey);

  if (configCached) {
    var cacheKey = `${configCached}`;

    const updatedAt = mtime(filename);

    const cached = cache && cache[cacheKey] && registry.getFromCacha(cacheKey);
    if (cached && cached.mtime === updatedAt) {
      result = cached;
      return result.code;
    }
  }

  const opts = initOptions(Object.assign(cloneDeep(transformOpts), {
    filename
  }));

  if (!result) {
    result = babel.transformFileSync(filename, Object.assign(opts, {
      babelrc: false,
      sourceMap: "both",
      ast:       false
    }));
    result.mtime = updatedAt;
  }

  cacheKey = `${md5(JSON.stringify(opts))}:${babel.version}`;
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env) cacheKey += `:${env}`;

  if (cache) {
    cache[configCachedKey] = cacheKey;
    cache[cacheKey] = result;
  }
  registry.putToCacha(configCachedKey, cacheKey);
  registry.putToCacha(cacheKey, result);

  return result.code;
}

function loader(m, filename) {
  m._compile(compile(filename), filename);
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
