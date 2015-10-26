import SyntheticSchedule from 'app/schedule/synthetic';

export default class StreakSyntheticSchedule extends SyntheticSchedule {
  _date(argv, previous, i) {
    const mutated = super._date(argv, previous, i);

    if (i > 0) {
      mutated.setDate(mutated.getDate() + 1);
    }

    return mutated;
  }
}
