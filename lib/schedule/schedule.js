import log from './../util/log';
import parse from './../util/parse';
import fs from 'fs';
import Promise from 'bluebird';
import path from 'path';

Promise.promisifyAll(fs);

/**
 * Schedule value class
 *
 * Used for persisting and parsing schedule files.
 * Holds an ordered array of dates, and that's about it.
 */
export default class Schedule {
  /**
   * @type {Array.<Date>}
   */
  dates = [];

  constructor(dates = []) {
    this.dates = dates;
  }

  toString() {
    return JSON.stringify({schedule: this.getDates()});
  }

  toFile(filePath, force = false) {
    return fs.writeFileAsync(filePath, this.toString(), {flag: (force ? 'w+' : 'wx+')})
      .then(() => Promise.resolve(this));
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

  /**
   * @param {string} string
   * @return Schedule
   */
  static fromString(string) {
    const json = JSON.parse(string);

    if (!Array.isArray(json.schedule)) {
      throw new Error('Schedule object is invalid');
    }

    const dates = [];

    json.schedule.forEach((dateString) => {
      const date = parse.date(dateString);

      if (date) {
        dates.push(date);
      } else {
        log.warning('Ignoring invalid date string', {date: dateString});
      }
    });

    return new Schedule(dates);
  }

  static fromFile(filePath) {
    return fs.readFileAsync(filePath, 'utf-8')
      .then(data => {
        return Promise.resolve(Schedule.fromString(data));
      });
  }

  static find(relative, ...search) {
    return path.resolve(...(search), relative);
  }
}
