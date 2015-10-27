import log from './../util/log';
import Schedule from './../schedule/schedule';

const OFFSET = 'GIT_STREAKER_OFFSET';

module.exports = (argv) => {
  if (typeof process.env.GIT_COMMIT === 'undefined') {
    log.warning('_seq is intended to be called as part of a git filter-branch env filter');
  }

  if (!argv.committer && !argv.author) {
    return Promise.reject('Nothing to do; pass -a or -c');
  }

  const schedule = new Schedule();
  const schedulePath = schedule.find(argv._[1]);

  if (!schedulePath) {
    return Promise.reject('Could not find schedule file at supplied path');
  }

  const offset = parseInt(process.env[OFFSET] || 0, 10);

  return schedule.fromFile(schedulePath)
    .then(() => {
      return schedule.getOffset(offset);
    })
    .then((date) => {
      const exports = {};
      exports[OFFSET] = offset + 1;

      if (argv.committer) {
        exports.GIT_COMMITTER_DATE = `@${date.getTime() / 1000} +0000`;
      }

      if (argv.author) {
        exports.GIT_AUTHOR_DATE = `@${date.getTime() / 1000} +0000`;
      }

      let output = '';

      for (const env of Object.keys(exports)) {
        output += `export ${env}="${exports[env]}"\n`;
      }

      process.stdout.write(output);
      return Promise.resolve();
    });
};

