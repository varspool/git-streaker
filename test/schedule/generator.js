import {expect} from 'chai';

export default (Generator) => {
  describe('is a generator, and requires an argv object to be passed to its constructor', () => {
    it('throws an error given an invalid argv object', () => {
      expect(() => new Generator(false)).to.throw(Error);
    });
  });

  describe('is a generator, and has methods for manipulating dates', () => {
    describe('._jitter()', () => {
      it('is a function', () => {
        const sut = new Generator({});
        expect(sut._jitter).to.be.a('function');
      });
    });

    describe('._mappers()', () => {
      it('is a function', () => {
        const sut = new Generator({});
        expect(sut._mappers).to.be.a('function');
      });
    });

    describe('._date()', () => {
      it('is a function', () => {
        const sut = new Generator({});
        expect(sut._date).to.be.a('function');
      });

      it('returns a incrementing non-mutated dates', () => {
        const sut = new Generator({});
        const previous = new Date();
        const current = sut._date(previous, 1);
        expect(current, 'new date object').to.be.not.equal(previous);
        expect(current.getTime(), 'new date object time').to.be.gt(previous.getTime());
      });
    });

    describe('.generate()', () => {
      it('is a function', () => {
        const sut = new Generator({});
        expect(sut.generate).to.be.a('function');
      });
    });

    describe('._applyMappers()', () => {
      it('is a function', () => {
        const sut = new Generator({});
        expect(sut._applyMappers).to.be.a('function');
      });
    });
  });
};
