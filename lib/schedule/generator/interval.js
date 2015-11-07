import Generator from './../generator';
import parse from './../../util/parse';
import {randomValue} from './../../util/random';

export default class IntervalGenerator extends Generator {
  interval = [];

  constructor(argv) {
    super(argv);

    this.interval = parse.range(argv.interval);

    if (this.interval.length === 0) {
      this.interval = [1];
    }
  }

  _date(previous, i) {
    let date = super._date(previous, i);

    let outOfRange = false;

    do {
      if (this.shouldJitter) {
        const min = this._interval() * 1000;
        const max = min + (60 * 60 * 1000);
        date = this.jitter(date, min, max);
      } else {
        date.setTime(date.getTime() + (this._interval() * 1000));
      }

      if (this.hours.length) {
        outOfRange = (this.hours.indexOf(date.getHours()) === -1);
      }
    } while (outOfRange);

    return date;
  }

  /**
   * @returns {int} Seconds (minimum) interval
   * @private
   */
  _interval() {
    return randomValue(this.interval);
  }
}
