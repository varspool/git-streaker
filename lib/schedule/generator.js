import parse from './../util/parse';
import _ from 'lodash';
import {randomInt} from './../util/random';

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
  shouldJitter = false;

  /**
   * @type {int[]}
   */
  hours = [];

  /**
   * @param argv
   */
  constructor(argv) {
    if (!argv || typeof argv !== 'object') {
      throw new Error('Invalid argv passed to generator');
    }

    this.argv = argv;
    this.start = parse.date(argv.start, new Date());
    this.hours = parse.range(this.argv.hour, 'hour');
    this.count = _.get(argv, 'count', 1000);
    this.shouldJitter = _.get(argv, 'jitter', false);
  }

  /**
   * @returns {Array.<Date>}
   */
  generate() {
    const dates = [];

    let previous = this.start;

    for (let i = 0; i < this.count; i++) {
      dates.push(
        previous = this._date(previous, i)
      );
    }

    return dates;
  }

  /**
   * 'Jitters' the small end of the given date
   *
   * This adds a uniformly distributed random offset to the given
   * date. This guarantees the date becomes later than it was initially (to
   * help maintain total ordering when used in a generator).
   *
   * If supplied, the min and max parameters control the bias and width
   * of the jitter. The default is somewhere between five minutes and an hour.
   *
   * A modified date is returned (immutable)
   *
   * @param {Date} date
   * @param {int} min
   * @param {int} max
   * @returns {Date} > date
   */
  jitter(date, min = 5 * 60 * 1000, max = (5 * 60 * 1000) + (60 * 60 * 1000)) {
    const modified = new Date(date.toString());

    const amount = randomInt(min, max);
    modified.setTime(modified.getTime() + amount);

    return modified;
  }

  _date(previous, _i) {
    return new Date(previous.toString());
  }
}
