import random from 'app/util/random';
import {expect} from 'chai';

function testDistribution(n, min, max) {
  describe(`when you generate ${n} integers between ${min} and ${max}`, function() {
    this.slow(10000);
    this.timeout(20000);

    const integers = [];

    before(() => {
      for (let i = n; i > 0; i--) {
        integers.push(random.randomInt(min, max));
      }
    });

    it('generates only integers', () => {
      expect(integers).to.eql(integers.map(integer => Math.floor(integer)));
    });

    it('generates no numbers below the range', () => {
      integers.forEach((integer) => {
        expect(integer).to.be.at.least(min);
      });
    });

    it('generates no numbers above the range', () => {
      integers.forEach((integer) => {
        expect(integer).to.be.at.most(max);
      });
    });

    it('generates numbers that match the expected range', () => {
      expect(integers.reduce((prev, cur) => Math.max(prev, cur), integers[0])).to.equal(max);
      expect(integers.reduce((prev, cur) => Math.min(prev, cur), integers[0])).to.equal(min);
    });
  });
}

describe('randInt', function test() {
  it('is a function', () => {
    expect(random.randomInt).to.be.a('function');
  });

  testDistribution(1000, 0, 10);
  testDistribution(10000, 0, 100);
  testDistribution(100000, 0, 999);
});
