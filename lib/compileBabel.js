const registry = require('./registry');
const fs = require('fs');
const md5 = require('md5');
const findBabelConfigs = require('./findBabelConfigs');
const cloneDeep = require('lodash/cloneDeep');
const babel = require('babel-core');
const OptionManager = babel.OptionManager;
const optionManager = new OptionManager();

function initOptions(opts) {
  var results = optionManager.init(opts);
  return results;
}

function mtime(filename) {
  return +fs.statSync(filename).mtime;
}

module.exports = function compile(filename, cache, transformOpts) {
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

    var updatedAt = mtime(filename);

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

  cacheKey = `${md5(JSON.stringify(opts))}_${babel.version}`;
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env) cacheKey += `_${env}`;
  cacheKey += '.json';

  if (cache) {
    cache[configCachedKey] = cacheKey;
    cache[cacheKey] = result;
  }
  registry.putToCacha(configCachedKey, cacheKey);
  registry.putToCacha(cacheKey, result);

  return result.code;
}

