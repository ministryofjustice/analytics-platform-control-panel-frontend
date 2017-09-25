var config = require('./config');
var log = require('bole')('assets');
var path = require('path');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var glob = Promise.promisify(require('glob').glob);
var render = Promise.promisify(require('node-sass').render);


exports.compile_sass = function () {

  config.sass.sources.forEach(function (options) {

    glob(options.files).then(function (files) {

      fs.mkdirAsync(options.outDir)

        .finally(
          compile_all(files, options))

        .catch(function (error) {
          // do nothing
        });

    });
  });
}


function compile_all(files, base_options) {

  files.forEach(function (filename) {
    var options = Object.assign({}, base_options);
    var outFile = path.relative(path.dirname(options.files), filename).replace(/.scss$/, '.css');

    options.file = filename;
    options.outFile = path.join(options.outDir, outFile);

    log.info(
      'compiling', path.relative(path.dirname(__dirname), filename), '->',
      path.relative(path.dirname(__dirname), options.outFile));

    render(options)
      .then(write_css(options.outFile))
      .then(write_sourcemap(options));
  });

}


function write_css(filename) {
  return function (result) {

    fs.writeFileAsync(filename, result.css);

    return result;
  };
}


function write_sourcemap(options) {
  return function (result) {
    if (options.sourceMap) {
      log.debug('writing sourcemap:', path.relative(path.dirname(__dirname), options.outFile + '.map'));
      fs.writeFileAsync(options.outFile + '.map', result.map);
    }
  };
}
