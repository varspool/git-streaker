import Generator from './../generator';
import parse from './../../util/parse';
import random from './../../util/random';

export default class IntervalGenerator extends Generator {
  _date(previous, i) {
    const date = super._date(previous, i);

    date.setTime(date.getTime() + this._interval() * 1000);

    return date;
  }

  _interval() {
    let range = parse.range(this.argv.interval);

    if (range.length === 0) {
      range = [1];
    }

    return random.randomValue(range);
  }
}
