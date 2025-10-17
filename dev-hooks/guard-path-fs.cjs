const path = require('path');
const fs   = require('fs');

function wrap(obj, name) {
  const orig = obj[name];
  if (!orig) return;
  obj[name] = function (...args) {
    if (args.some(a => a === undefined)) {
      console.error(`[guard] ${name} got undefined arg(s):`, args);
      console.error(new Error('[guard] stack').stack);
    }
    return orig.apply(this, args);
  };
}

wrap(path, 'join');
wrap(path, 'resolve');
wrap(fs,   'copyFile');
wrap(fs,   'cp');
wrap(fs,   'rename');
wrap(fs,   'writeFile');
wrap(fs,   'symlink');
module.exports = {};
