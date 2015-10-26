import SyntheticSchedule from 'app/schedule/synthetic';
import parse from 'app/util/parse';
import random from 'app/util/random';

export default class StreakSyntheticSchedule extends SyntheticSchedule {
  _date(argv, previous, i) {
    const mutated = super._date(argv, previous, i);

    mutated.setTime(mutated.getTime() + this._interval(argv));

    return mutated;
  }

  _interval(argv) {
    let range = parse.range(argv.interval);

    if (range.length === 0) {
      range = [1];
    }

    return random.randomValue(range);
  }
}
