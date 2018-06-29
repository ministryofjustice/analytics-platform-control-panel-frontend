const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const glob = Bluebird.promisify(require('glob').glob);
const render = Bluebird.promisify(require('node-sass').render);
const concatfiles = require('concat-files');
const path = require('path');
const babel = require('babel-core');

const log = require('bole')('assets');
const config = require('./config');


function relative(filepath) {
  return path.relative(path.dirname(__dirname), filepath);
}


function transpile_js() {
  const inFile = path.join(config.js.outDir, config.js.filename);
  const outFile = path.join(config.js.outDir, `transpiled_${config.js.filename}`);

  log.info(`transpiling ${relative(inFile)} -> ${relative(outFile)}`);

  babel.transformFile(inFile, config.babel, (err, result) => {
    if (err) {
      log.error(err);
      process.exit(1);
    }

    fs.writeFile(outFile, result.code, (error) => {
      if (error) {
        log.error(error);
        process.exit(1);
      }
    });
  });
}


function concat_js(files) {
  const outFile = path.join(config.js.outDir, config.js.filename);

  log.info(`compiling ${relative(config.js.sourceFiles)} -> ${relative(outFile)}`);

  concatfiles(files, outFile, (err) => {
    if (err) {
      throw err;
    }

    transpile_js();
  });
}


function mkdirp(dir) {
  return new Promise((resolve, reject) => {
    fs.mkdirAsync(dir)
      .then(resolve)
      .catch((error) => {
        if (error.code === 'ENOENT') {
          mkdirp(path.dirname(dir))
            .then(() => {
              mkdirp(dir).then(resolve);
            })
            .catch(reject);
        }
      });
  });
}


function write_css(filename) {
  return (result) => {
    fs.writeFileAsync(filename, result.css);
    return result;
  };
}


function write_sourcemap(options) {
  return (result) => {
    if (options.sourceMap) {
      log.debug(`writing sourcemap: ${relative(options.outFile)}.map`);
      fs.writeFileAsync(`${options.outFile}.map`, result.map);
    }
  };
}


function compile_all(files, base_options) {
  files.forEach((filename) => {
    const options = base_options || {};
    const outFile = path.relative(path.dirname(options.files), filename).replace(/.scss$/, '.css');

    options.file = filename;
    options.outFile = path.join(options.outDir, outFile);

    log.info(`compiling ${relative(filename)} -> ${relative(options.outFile)}`);

    render(options)
      .then(write_css(options.outFile))
      .then(write_sourcemap(options));
  });
}


exports.compile_sass = () => {
  config.sass.sources.forEach((options) => {
    glob(options.files).then((files) => {
      mkdirp(options.outDir)
        .then(compile_all(files, options));
    });
  });
};


exports.compile_js = () => {
  glob(config.js.sourceFiles, { ignore: config.js.ignorePaths })
    .then((files) => {
      mkdirp(config.js.outDir)
        .then(concat_js(files));
    });
};
