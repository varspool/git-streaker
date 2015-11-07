'use strict'; // eslint-disable-line strict

require('babel/register');

const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const fs = require('fs');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const isparta = require('isparta');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const path = require('path');
const pkg = require('./package.json');
const Promise = require('bluebird');
const readmeToMan = require('readme-to-man-page');
const sequence = require('gulp-sequence');
const sourcemaps = require('gulp-sourcemaps');

Promise.promisifyAll(fs);

/*
 * Configuration
 */
const config = require('./config');

/*
 * Helpers
 */

function mkdirp(dir) {
  return fs.statAsync(dir)
    .then(stat => {
      return stat.isDirectory ? Promise.resolve() : Promise.reject(Error('Could not mkdirp: path already exists'));
    })
    .catch(err => fs.mkdirAsync(dir))
    .catch(err => { if (err.errno !== -17) throw err; /* already created */ });
}

function transform(src, output, transformers, done) {
  fs.readFile(src, 'utf8', (readErr, data) => {
    if (readErr) {
      return done(readErr);
    }

    let transformed = data;

    for (const transformer of transformers) {
      transformed = transformer(transformed);
    }

    fs.writeFile(output, transformed, (writeErr) => {
      if (writeErr) {
        return done(writeErr);
      }

      return done();
    });
  });
}

/*
 * Task definitions
 */

/* Meta tasks */
gulp.task('default', sequence('build', ['lint', 'test', 'watch']));
gulp.task('build', sequence('clean', ['buildLib', 'buildTest', 'buildFixture', 'buildMan']));
gulp.task('buildLib', sequence('buildJs', 'buildCoverage'));


/* Implementations */
gulp.task('clean', () => {
  return del(config.outputs);
});

gulp.task('buildJs', () => {
  return gulp.src(config.js.src)
    .pipe(gulpif(config.sourcemap, sourcemaps.init()))
    .pipe(babel(config.babel))
    .pipe(gulpif(config.sourcemap, sourcemaps.write('.')))
    .pipe(gulp.dest(config.js.output));
});

gulp.task('buildCoverage', () => {
  return gulp.src(config.js.coverage)
    .pipe(istanbul({instrumenter: isparta.Instrumenter}))
    .pipe(istanbul.hookRequire())
});

gulp.task('buildTest', () => {
  return gulp.src(config.test.src)
    .pipe(gulpif(config.sourcemap, sourcemaps.init()))
    .pipe(babel(config.babel))
    .pipe(gulpif(config.sourcemap, sourcemaps.write('.')))
    .pipe(gulp.dest(config.test.output));
});

gulp.task('buildFixture', () => {
  return gulp.src(config.fixture.src)
    .pipe(gulp.dest(config.fixture.output));
});

gulp.task('buildMan', (done) => {
  mkdirp('man').then(() => {
    transform(
      config.man.src,
      config.man.output,
      [
        (data) => {
          return readmeToMan(data, {
            name: pkg.name,
            version: pkg.version,
            description: pkg.description,
            section: 1,
            manual: `Git Streaker ${pkg.version}`,
          });
        },
      ],
      done
    );
  });
});

gulp.task('lint', () => {
  return gulp.src(config.js.src)
    .pipe(gulpif(config.linting, eslint()))
    .pipe(gulpif(config.linting, eslint.format()));
});

gulp.task('test', ['buildCoverage'], () => {
  mkdirp(config.build.output);

  return gulp.src(config.test.tests, {read: false})
    .pipe(mocha({
      ui: 'bdd',
      reporter: 'spec',
      require: [
        config.test.bootstrap
      ]
    }))
    .pipe(istanbul.writeReports({
      dir: config.build.lcov,
      reporters: [ 'lcov' ],
    }));
});

gulp.task('watch', () => {
  gulp.watch(config.js.src, ['buildJs', 'buildCoverage', 'lint']);
  gulp.watch(config.test.src, ['buildTest']);
  gulp.watch(config.fixture.src, ['buildFixture']);
});
