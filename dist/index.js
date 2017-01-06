'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (opts) {
  var mainFile = void 0;
  var prepend = [];
  var append = [];

  var log = function log() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!opts.debug) {
      return;
    }
    _gulpUtil2.default.log.apply(_gulpUtil2.default, [_gulpUtil2.default.colors.magenta('[Scss Combine]') + ' ' + args.join('')]);
  };

  var buffer = function buffer(file, enc, cb) {
    var filename = _path2.default.basename(file.path);

    // Ignore _ files
    if (filename[0] === '_') {
      log('[Ignoring] ', filename);
    } else if (file.path === opts.main) {
      mainFile = file;
      log('[Found main] ', filename);
    } else {
      var relative = _path2.default.relative(opts.main, file.path);
      relative = relative.replace('../../', '../');
      log('[Prepending] ', relative);
      prepend.push(file);
    }

    cb();
  };

  // Concat files...
  var endStream = function endStream(cb) {

    var prependString = prepend.map(function (file) {
      var relative = _path2.default.relative(opts.main, file.path);
      relative = relative.replace('../../', '../');
      return '@import \'' + relative + '\';';
    });

    var content = mainFile.contents.toString();
    content += '\n' + prependString.join('\n');

    mainFile.contents = new Buffer(content);

    this.push(mainFile);

    cb();
  };

  return _through2.default.obj(buffer, endStream);
};