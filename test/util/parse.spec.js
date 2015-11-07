import {Log} from './../../dist/util/log';
import parse from './../../dist/util/parse';

Log.setFile('build/parse.log');

describe('module parse', () => {
  it('exports an object as the default', () => {
    expect(parse).to.be.a('object');
  });

  describe('.date()', () => {
    it('Returns the default value when given an invalid date', () => {
      expect(parse.date('NO DATE FOR YOU', 'ORLY')).to.be.eql('ORLY');
    });
  });

  describe('.integer', () => {
    const invalid = {
      array: [],
      object: {},
      'null': null,
      undefined: undefined,
      infinity: +'Infinity',
      negativeInfinity: +'-Infinity',
      nan: +'NaN',
      unsafe: 9007199254740992,
    };

    Object.keys(invalid).forEach((test) => {
      it('Returns null when given non-numeric input: ' + test, () => {
        expect(parse.integer(invalid[test])).to.be.null;
      });
    });
  });

  describe('.dateComponent()', () => {

  });

  describe('.range()', () => {
    it('Silently ignores parts it does not understand', () => {
      expect(parse.range(+'NaN'), 'NaN').to.eql([]);
      expect(parse.range('abc-def'), 'abc-def').to.eql([]);
      expect(parse.range('1-2-3'), 'abc-def').to.eql([]);
      expect(parse.range('abc', 'hour'), 'null').to.eql([]);
    });

    it('Copes with invalid date component types', () => {
      expect(parse.range('10', 'gibberish'), 'str 10, bad date component type').to.eql([]);
    });

    it('Parses single values (x)', () => {
      expect(parse.range('1', 'hour'), 'str 1').to.eql([1]);
      expect(parse.range('0', 'hour'), 'str 0').to.eql([0]);
      expect(parse.range(7.7, 'hour'), 'float 7.7').to.eql([7]);
      expect(parse.range(' 23 ', 'hour'), 'str 23 with padding').to.eql([23]);
      expect(parse.range(23, 'hour'), 'int 23').to.eql([23]);
      expect(parse.range('100', 'hour'), 'str 100 over').to.eql([23]);
      expect(parse.range(100, 'hour'), 'int 100 over').to.eql([23]);
      expect(parse.range('1000', 'minute'), 'str 1000 minute over').to.eql([59]);
    });

    it('Parses common ranges (x-y)', () => {
      expect(parse.range('0-0', 'hour'), 'range 0-0').to.eql([0]);
      expect(parse.range('6-11', 'hour'), 'range 6-11').to.eql([6, 7, 8, 9, 10, 11]);
      expect(parse.range('0-5', 'hour'), 'range 0-5').to.eql([0, 1, 2, 3, 4, 5]);
    });

    it('Parses compound values (x,y)', () => {
      expect(parse.range('6,4,0,1', 'hour'), 'four compound items').to.eql([6, 4, 0, 1]);
      expect(parse.range('11,3', 'hour'), 'out of order, simple compound').to.eql([11, 3]);
      expect(parse.range('98,99', 'hour'), 'both over, lowered to hour max').to.eql([23, 23]);
      expect(parse.range('98,99', null), 'both over, but left as is').to.eql([98, 99]);
    });

    it('Parses mixed compound types (x-y,z)', () => {
      expect(parse.range('6,4,0-2', 'hour'), 'mixed compound and range').to.eql([6, 4, 0, 1, 2]);
    });

    it('Returns an empty array on an invalid value', () => {
      expect(parse.range('11-6', 'hour'), 'out of order range').to.eql([]);
    });
  });
});
