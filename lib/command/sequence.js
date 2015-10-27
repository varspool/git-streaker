import log from './../util/log';
import Schedule from './../schedule/schedule';

const OFFSET = 'GIT_STREAKER_OFFSET';

export default (argv) => {
  if (typeof process.env.GIT_COMMIT === 'undefined') {
    log.warning('_seq is intended to be called as part of a git filter-branch env filter');
  }

  if (!argv.committer && !argv.author) {
    return Promise.reject('Nothing to do; pass -a or -c');
  }

  const schedulePath = Schedule.find(argv._[1]);

  if (!schedulePath) {
    return Promise.reject('Could not find schedule file at supplied path');
  }

  const offset = parseInt(process.env[OFFSET] || 0, 10);

  return Schedule.fromFile(schedulePath)
    .then((schedule) => {
      return schedule.getOffset(offset);
    })
    .then((date) => {
      const exports = {};
      exports[OFFSET] = offset + 1;

      if (argv.committer) {
        exports.GIT_COMMITTER_DATE = date.toString();
      }

      if (argv.author) {
        exports.GIT_AUTHOR_DATE = date.toString();
      }

      let output = '';

      for (const env of Object.keys(exports)) {
        output += `export ${env}="${exports[env]}"\n`;
      }

      process.stdout.write(output);
      return Promise.resolve();
    });
};

