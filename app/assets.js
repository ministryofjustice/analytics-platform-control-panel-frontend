var config = require('./config');
var fs = require('fs');
var Promise = require('bluebird');
var render = Promise.promisify(require('node-sass').render);
var glob = Promise.promisifyAll(require('glob'));
var path = require('path');
var log = require('bole')('assets');


exports.compile_sass = function () {
  config.sass.sources.forEach(function (source) {

    var base_options = {
      includePaths: source.includePaths,
      outputStyle: source.outputStyle
    };

    glob.globAsync(source.file).then(function (files) {

      if (files.length) {
        try {
          fs.mkdirSync(source.outFile);
        } catch (err) {
        }
      }

      files.forEach(function (filename) {
        var options = Object.assign({}, base_options);
        options.file = filename;
        options.outFile = path.join(source.outFile, path.basename(filename, '.scss')) + '.css';
        log.info('compiling', filename, '->', options.outFile);

        render(options).then(write_css(options.outFile));
      });
    });
  });
}


function write_css(filename) {

  return function (result) {

    fs.writeFile(filename, result.css, function (err) {
      if (err) {
        throw err;
      }
    });
  };
}
