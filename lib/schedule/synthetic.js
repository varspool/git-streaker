import Schedule from './schedule';
import log from './../util/log';
import {randomInt, randomValue} from './../util/random';
import parse from './../util/parse';

export default class SyntheticSchedule extends Schedule {
  _jitter(argv, date) {
    if (!argv.jitter) {
      return date;
    }

    const modified = new Date(date.getTime());

    const minutes = randomInt(0, 59);
    const seconds = randomInt(0, 59);
    const micro = randomInt(0, 999);

    log.debug(`Jittering minutes to ${minutes}`);
    log.debug(`Jittering seconds to ${seconds}`);
    log.debug(`Jittering micro to ${micro}`);

    modified.setMinutes(minutes);
    modified.setSeconds(seconds, micro);

    return modified;
  }

  _mappers() {
    return [
      this._jitter,
    ];
  }

  _date(argv, previous, _i) {
    const mutated = new Date(previous.getTime());

    if (argv.hour) {
      const hours = parse.range(argv.hour);

      if (hours.length) {
        const picked = randomValue(hours);
        log.debug(`Picked ${picked} for hour value`);
        mutated.setHours(picked);
      }
    }

    return mutated;
  }

  _start(argv) {
    return parse.date(argv.start, new Date());
  }

  generate(argv) {
    const dates = [];
    const count = argv.count;
    let previous = this._start(argv);

    for (let i = 0; i < count; i++) {
      dates.push(
        previous = this._applyMappers(
          argv,
          this._date(argv, previous, i)
        )
      );
    }

    this.dates = dates;
    return this;
  }

  _applyMappers(argv, current) {
    let mapped = current;
    this._mappers().forEach((mapper) => {
      mapped = mapper(argv, mapped);
    });
    return mapped;
  }
}
