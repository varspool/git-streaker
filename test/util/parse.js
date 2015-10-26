require('babel/register');

import {Log} from 'app/util/log';
import parse from 'app/util/parse';
import {expect} from 'chai';

Log.setFile('build/parse.log');

describe('parse', () => {
  it('exports an object as the default', () => {
    expect(parse).to.be.a('object');
  });

  describe('.range()', () => {
    it('Parses single values (x)', () => {
      expect(parse.range('1'), 'str 1').to.eql([1]);
      expect(parse.range('0'), 'str 0').to.eql([0]);
      expect(parse.range(7.7), 'float 7.7').to.eql([7]);
      expect(parse.range(' 23 '), 'str 23 with padding').to.eql([23]);
      expect(parse.range(23), 'int 23').to.eql([23]);
      expect(parse.range('100'), 'str 100 over').to.eql([23]);
      expect(parse.range(100), 'int 100 over').to.eql([23]);
      expect(parse.range('1000', 'minute'), 'str 1000 minute over').to.eql([59]);
    });

    it('Parses common ranges (x-y)', () => {
      expect(parse.range('0-0'), 'range 0-0').to.eql([0]);
      expect(parse.range('6-11'), 'range 6-11').to.eql([6, 7, 8, 9, 10, 11]);
      expect(parse.range('0-5'), 'range 0-5').to.eql([0, 1, 2, 3, 4, 5]);
    });

    it('Parses compound values (x,y)', () => {
      expect(parse.range('6,4,0,1'), 'four compound items').to.eql([6, 4, 0, 1]);
      expect(parse.range('11,3'), 'out of order, simple compound').to.eql([11, 3]);
      expect(parse.range('98,99'), 'both over, lowered to hour max').to.eql([23, 23]);
    });

    it('Parses mixed compound types (x-y,z)', () => {
      expect(parse.range('6,4,0-2'), 'mixed compound and range').to.eql([6, 4, 0, 1, 2]);
    });

    it('Returns an empty array on an invalid value', () => {
      expect(parse.range('11-6'), 'out of order range').to.eql([]);
    });
  });
});
