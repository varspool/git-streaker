import Generator from './../generator';
import {randomValue} from './../../util/random';
import log from './../../util/log';

export default class StreakGenerator extends Generator {
  _date(previous, i) {
    let date = super._date(previous, i);

    if (i > 0) {
      date.setDate(date.getDate() + 1);
    }

    if (this.hours.length) {
      const picked = randomValue(this.hours);
      log.debug(`Picked ${picked} for hour value`);
      date.setHours(picked);
    }

    if (this.shouldJitter) {
      date = this.jitter(date);
    }

    return date;
  }
}
