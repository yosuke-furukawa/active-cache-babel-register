const fs = require('fs');
const path = require('path');
const pathExists = require('path-exists');
const BABELIGNORE_FILENAME = ".babelignore";
const BABELRC_FILENAME = ".babelrc";
const PACKAGE_FILENAME = "package.json";
var existsCache = {};

function exists(filename) {
  var cached = existsCache[filename];
  if (cached == null) {
    return existsCache[filename] = pathExists.sync(filename);
  } else {
    return cached;
  }
}

module.exports = function findBabelConfigs(loc) {
  var foundConfig = false;
  var foundIgnore = false;
  var configs = [];
  while(loc !== (loc = path.dirname(loc))) {
    if(!foundConfig) {
      var configLoc = path.join(loc, BABELRC_FILENAME);
      if (exists(configLoc)) {
        foundConfig = true;
        configs.push(configLoc);
      }

      var pkgLoc = path.join(loc, PACKAGE_FILENAME);
      if (!foundConfig && exists(pkgLoc)) {
        foundConfig = JSON.parse(fs.readFileSync(pkgLoc)).babel ? true : false;
        foundConfig && configs.push(pkgLoc);
      }
    }

    if (!foundIgnore) {
      var ignoreLoc = path.join(loc, BABELIGNORE_FILENAME);
      if (exists(ignoreLoc)) {
        foundIgnore = true;
        configs.push(ignoreLoc);
      }
    }

    if (foundConfig && foundIgnore) {
      break;
    }
  }
  return configs;
};
