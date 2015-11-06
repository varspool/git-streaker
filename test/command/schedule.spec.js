import schedule from './../../dist/command/schedule';
import config from '../../config';
import fs from 'fs';

function out(ident) {
  return config.build.output + '/schedule-' + ident + '-' + ((new Date()).getTime()) + '.json';
}

function args(file, merge) {
  return Object.assign({
    _: ['schedule', file],
    type: 'interval',
    interval: '1-10',
    count: 3,
    jitter: false,
    hours: null,
    start: null,
  }, merge);
}

describe('Schedule command', () => {
  it('is a function', () => {
    expect(schedule).is.a('function'); //
  });

  const rejections = {
    boolFalse: [false],
    emptyObj: [{}],
    noArgs: [],
    validPathNoType: [args(out('validPathNoType'), {
      type: null,
    })],
    validPathInvalidType: [args(out('validPathNoType'), {
      type: 'craziness',
    })],
  };

  Object.keys(rejections).forEach((key) => {
    it('rejects correctly when given wacky arguments: ' + key, () => {
      const testArgs = rejections[key];
      return expect(schedule.apply(this, testArgs)).to.be.rejected;
    });
  });

  const fulfillments = {
    'defaults': {},
    'jitterAndHour': {
      jitter: true,
      hour:   '3-9,3',
    },
  };

  Object.keys(fulfillments).forEach((key) => {
    it('works correctly with normal arguments, outputs json: ' + key, () => {
      const outFile = out(key);
      const argv = args(outFile, fulfillments[key]);

      return expect(schedule(argv)).to.be.fulfilled.then(() => {
        const result = JSON.parse(fs.readFileSync(outFile, 'utf-8'));
        expect(result).to.be.a('object').and.hasOwnProperty('schedule');
      });
    });
  });
});
