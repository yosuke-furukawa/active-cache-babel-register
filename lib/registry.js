const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const Cacha = require("cacha");
const homeOrTmp = require("home-or-tmp");
const pathExists = require("path-exists");
const serializeJS = require("serialize-javascript");

const FILENAME = process.env.BABEL_CACHE_PATH || path.join(homeOrTmp, ".babel.json");
const ACTIVE_CACHE_FILENAME = process.env.BABEL_ACTIVE_CACHE_PATH || path.join(homeOrTmp, ".babel_active");
const cacha = new Cacha(ACTIVE_CACHE_FILENAME);
var data = {};
var saving = false;

/**
 * Write stringified cache to disk.
 */

function saveAll() {
  var serialised = {};
  try {
    const files = fs.readdirSync(ACTIVE_CACHE_FILENAME);
    files.forEach((file) => {
      const cacheParts = path.join(ACTIVE_CACHE_FILENAME, file);
      data = Object.assign(data, { [file]: JSON.parse(fs.readFileSync(cacheParts)) });
    });
    serialised = JSON.stringify(data, null, "  ");
  } catch (err) {
    if (err.message === "Invalid string length") {
      err.message = "Cache too large so it's been cleared.";
      console.error(err.stack);
    } else {
      throw err;
    }
  }
  mkdirp.sync(path.dirname(FILENAME));
  fs.writeFileSync(FILENAME, serialised);
  saving = false;
}

function saveWorker() {
  if (saving) return;
  saving = true;
  saveAll();
}

/**
 * Load cache from disk and parse.
 */

function load() {
  if (process.env.BABEL_DISABLE_CACHE) return;

  process.on("exit", saveWorker);
  process.nextTick(saveWorker);

  if (!pathExists.sync(FILENAME)) return;

  try {
    data = JSON.parse(fs.readFileSync(FILENAME));
  } catch (err) {
    return;
  }
  return data;
}

function get() {
  return data;
}

function getFromCacha(key) {
  const data = cacha.getSync(key);
  try {
    return data && JSON.parse(data);
  } catch(e) {
    return undefined;
  }
}

function putToCacha(key, content) {
  return content && cacha.setSync(key, JSON.stringify(content));
}

module.exports.saveAll = saveAll;
module.exports.load = load;
module.exports.get = get;
module.exports.getFromCacha = getFromCacha;
module.exports.putToCacha = putToCacha;
