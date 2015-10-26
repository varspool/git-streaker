'use strict';

const fs = require('fs');
const debug = process.env.NODE_ENV === 'development';

const config = {
  debug: debug,
  sourcemap: debug,
  linting: debug,

  js: {
    src: 'lib/**/*.js',
    output: 'dist',
  },

  test: {
    src: ['test/**/*.js', '!test/fixture/**/*'],
    output: 'dist-test',
    tests: 'dist-test/**/*.js',
  },

  fixture: {
    src: 'test/fixture/**/*',
    output: 'dist-test/fixture',
  },

  man: {
    src: 'README.md',
    output: 'man/git-streaker.1',
  },

  babel: {
    optional: ['es7.classProperties', 'runtime'],
    loose: ['es6.classes', 'es6.properties.computed', 'es6.modules', 'es6.forOf'],
  },
};

config.outputs = [
  config.fixture.output,
  config.js.output,
  config.test.output,
  config.man.output,
];

module.exports = config;
