import log from 'app/util/log';
import io from 'app/schedule/io';
import parse from 'app/util/parse';

/**
 * Default schedule model
 *
 * Used for persisting and parsing schedule files to disk
 * Superclass for schedules that can use 'generate'
 */
class Schedule {
  /**
   * @type {Array.<Date>}
   */
  dates = [];

  /**
   * @param {string} string
   */
  fromString(string) {
    const json = JSON.parse(string);

    if (!Array.isArray(json.schedule)) {
      throw new Error('Schedule object is invalid');
    }

    const dates = [];

    for (const dateString of json.schedule) {
      const date = parse.date(dateString);

      if (date) {
        dates.push(date);
      } else {
        log.warning('Ignoring invalid date string', {date: dateString});
      }
    }

    this.dates = dates;
    return this;
  }

  toString() {
    return JSON.stringify({schedule: this.getDates()});
  }

  getDates() {
    return this.dates;
  }

  getOffset(i) {
    return this.dates[i];
  }

  getDateStrings() {
    return this.getDates().map(date => date.toString());
  }
}

export default io(Schedule);
