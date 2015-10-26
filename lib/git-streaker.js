import argv from 'app/yargs';
import command from 'app/commands';
import {default as log, Log as LogSettings} from 'app/util/log';

LogSettings.setLevel(2 + argv.verbose - argv.quiet);
log.debug('Received command line arguments', argv);

if (command[argv._[0]]) {
  const execute = command[argv._[0]](argv);

  execute.then(() => {
    log.notice('All done!');
    process.exit(0);
  }).catch(err => {
    if (typeof err === 'string') {
      log.error(err);
    } else if (err instanceof Error) {
      log.error(err.message);
      log.debug(err);
    }
    process.exit(2);
  });
} else {
  log.error('No such command', argv);
  process.exit(1);
}
