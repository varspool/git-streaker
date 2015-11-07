import {expect} from 'chai';
import {randomInt} from './../../dist/util/random';

export default (Generator) => {
  describe('is a generator, and requires an argv object to be passed to its constructor', () => {
    it('throws an error given an invalid argv object', () => {
      expect(() => new Generator(false)).to.throw(Error);
    });
  });

  describe('is a generator, and has methods for manipulating dates', () => {
    describe('.jitter()', () => {
      it('is a function', () => {
        const sut = new Generator({});
        expect(sut.jitter).to.be.a('function');
      });

      it('always returns a new date, later than the one passed in', () => {
        const sut = new Generator({});

        for (let i = 0; i < 20; i++) {
          const date = new Date(randomInt(0, (new Date()).getTime()));
          const later = sut.jitter(date);

          expect(later)
            .to.be.an.instanceof(Date)
            .and.to.be.gt(date);
        }
      });
    });

    describe('._date()', () => {
      it('is a function', () => {
        const sut = new Generator({});
        expect(sut._date).to.be.a('function');
      });

      it('returns a different, and greater, date', () => {
        const sut = new Generator({});
        const previous = new Date();

        // 1 because of special 'start point' behaviour
        const current = sut._date(previous, 1);

        expect(current).to.be.gt(previous);
      });

      it('avoids returning dates in excluded hours', () => {
        const sut = new Generator({
          count: '100',
          jitter: false,
          hour: '17-22',
          start: '2015-01-02T17:00:00.000Z',
        });

        const dates = sut.generate();

        dates.forEach((date) => {
          expect(date).to.be.an.instanceof(Date);
          expect(date.getHours()).to.be.within(17, 22);
        });
      });
    });

    describe('.generate()', () => {
      it('is a function', () => {
        const sut = new Generator({});
        expect(sut.generate).to.be.a('function');
      });
    });
  });
};
