import schedules from './../schedules';
import log from './../util/log';

export default (argv) => {
  const out = argv._[1];

  if (typeof schedules[argv.type] === 'undefined') {
    return Promise.reject('Unknown schedule type');
  }

  const schedule = new schedules[argv.type]();

  return schedule.generate(argv).toFile(out, argv.force).then(() => {
    log.notice('Schedule written to file: ' + out);
    return Promise.resolve();
  });
};
