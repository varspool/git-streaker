import Generator from './../generator';

export default class StreakGenerator extends Generator {
  _date(previous, i) {
    const date = super._date(previous, i);

    if (i > 0) {
      date.setDate(date.getDate() + 1);
    }

    return date;
  }
}
