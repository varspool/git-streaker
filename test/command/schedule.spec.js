import schedule from './../../dist/command/schedule';
import fs from 'fs';
import _outfile from './../util/outfile';

const outfile = _outfile.bind(undefined, 'command', 'schedule');

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
    validPathNoType: [args(outfile('command', 'schedule', 'validPathNoType'), {
      type: null,
    })],
    validPathInvalidType: [args(outfile('validPathNoType'), {
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
    'features': {
      type: 'streak',
      jitter: true,
      hour:   '3-9,12',
    },
    'streak': {
      type: 'streak',
      jitter: true,
      hour: '22-23,1-9',
    },
    'interval': {
      type: 'interval',
      jitter: true,
      interval: '300-3000',
      hour: '18-23',
      start: '2015-08-06',
    },
    'emptyHour': {
      jitter: true,
      hour:   '',
    },
  };

  Object.keys(fulfillments).forEach((key) => {
    it('works correctly with normal arguments, outputs json: ' + key, () => {
      const out = outfile(key);
      const argv = args(out, fulfillments[key]);

      return expect(schedule(argv)).to.be.fulfilled.then(() => {
        const result = JSON.parse(fs.readFileSync(out, 'utf-8'));
        expect(result).to.be.a('object').and.hasOwnProperty('schedule');
      });
    });
  });
});
