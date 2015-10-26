import shell from 'app/util/shell';
import path from 'path';
import _ from 'lodash';
import log from 'app/util/log';
import confirm from 'app/util/confirm';
import Schedule from 'app/schedule/schedule';

function prepareCommand(argv) {
  const self = path.join(process.cwd(), argv.$0);
  const relativePath = argv._[1];
  const options = argv._.slice(2);

  const schedule = new Schedule();
  const schedulePath = schedule.find(relativePath);

  if (!schedulePath) {
    return Promise.reject('Could not find schedule file at supplied path');
  }

  return schedule.fromFile(schedulePath)
    .then(() => {
      const pass = ['author', 'committer'];

      const seqOptions = _.pairs(_.pick(argv, pass)).map(([key, value]) => {
        return value ? `--${key}` : `--no-${key}`;
      });

      const command = ['git', 'filter-branch']
        .concat(options)
        .concat(['--env-filter', `'eval \`${self} _seq  ${seqOptions.join(' ')} "${relativePath}"\`'`]);

      return Promise.resolve(command);
    })
    .catch(err => Promise.reject('Could not read schedule file: ' + err));
}

function runCommand(command) {
  log.debug('Running filter command', {command: command});
  return shell(command.join(' '));
}

function confirmAndRunCommand(argv, command) {
  if (!argv.y) {
    return confirm()
      .then(() => {
        return runCommand(command);
      },
      (err) => {
        return Promise.reject(`Pass the -y flag to confirm non-interactively (${err})`);
      });
  }

  return runCommand(command);
}

export default (argv) => {
  return prepareCommand(argv)
    .then(confirmAndRunCommand.bind(undefined, argv))
;
};
