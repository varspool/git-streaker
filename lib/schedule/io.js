import fs from 'fs';
import Promise from 'bluebird';
import path from 'path';

Promise.promisifyAll(fs);

export default (schedule) => {
  schedule.prototype.fromFile = function fromFile(filePath) {
    return fs.readFileAsync(filePath, 'utf-8')
      .then(data => {
        return Promise.resolve(this.fromString(data));
      });
  };

  schedule.prototype.toFile = function toFile(filePath, force = false) {
    return fs.writeFileAsync(filePath, this.toString(), {flag: (force ? 'w+' : 'wx+')})
      .then(() => Promise.resolve(this));
  };

  schedule.prototype.find = function find(relative, ...search) {
    return path.resolve(...(search), relative);
  };

  return schedule;
};
