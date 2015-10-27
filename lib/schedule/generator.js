import log from './../util/log';
import {randomInt, randomValue} from './../util/random';
import parse from './../util/parse';
import _ from 'lodash';

export default class Generator {
  /**
   * @type {{start: string, hour: int[], count: int}}
   */
  argv = {};

  /**
   * @type {Date}
   */
  start;

  /**
   * @type {boolean}
   */
  jitter = false;

  /**
   * @param argv
   */
  constructor(argv) {
    if (!argv || typeof argv !== 'object') {
      throw new Error('Invalid argv passed to generator');
    }

    this.argv = argv;
    this.start = parse.date(argv.start, new Date());
    this.count = _.get(argv, 'count', 1000);
    this.jitter = _.get(argv, 'jitter', false);
  }

  /**
   * @returns {Array.<Date>}
   */
  generate() {
    const dates = [];

    let previous = this.start;

    for (let i = 0; i < this.count; i++) {
      dates.push(
        previous = this._applyMappers(this._date(previous, i))
      );
    }

    return dates;
  }

  _jitter(date) {
    if (!this.jitter) {
      return date;
    }

    const modified = new Date(date.toString());

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
      this._jitter.bind(this),
    ];
  }

  _date(previous, _i) {
    const date = new Date(previous.toString());

    if (this.argv.hour) {
      const hours = parse.range(this.argv.hour);

      if (hours.length) {
        const picked = randomValue(hours);
        log.debug(`Picked ${picked} for hour value`);
        date.setHours(picked);
      }
    }

    return date;
  }

  _applyMappers(current) {
    let mapped = current;

    this._mappers().forEach((mapper) => {
      mapped = mapper(mapped);
    });

    return mapped;
  }
}
