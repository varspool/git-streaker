import generators from './../generators';
import log from './../util/log';
import Schedule from './../schedule/schedule';

export default (argv) => {
  return new Promise((resolve, reject) => {
    const out = argv._[1];

    if (typeof generators[argv.type] === 'undefined') {
      return reject('Unknown generator type');
    }

    const generator = new generators[argv.type](argv);
    const dates = generator.generate(argv);
    const schedule = new Schedule(dates);

    return schedule.toFile(out, argv.force).then(() => {
      log.notice('Schedule written to file: ' + out);
      return resolve();
    });
  });
};
