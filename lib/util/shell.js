import {exec} from 'child_process';
import log from './log';
import Promise from 'bluebird';

export default (command) => {
  return new Promise((resolve, reject) => {
    log.notice('Executing: ', command);

    exec(command, (err, stdout, stderr) => {
      if (stdout) {
        log.debug('stdout: ' + stdout, {command: command});
      }

      if (stderr) {
        log.info('stderr: ' + stderr, {command: command});
      }

      if (err !== null) {
        return reject(err);
      }

      return resolve(stdout, stderr);
    });
  });
};
