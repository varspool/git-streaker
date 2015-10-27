import {expect} from 'chai';
import Schedule from './../../dist/schedule/schedule';

describe('Schedule value class', () => {
  describe('static .fromString()', () => {
    expect(Schedule.fromString).to.be.a('function');
  });

  const sut = new Schedule();

  describe('.toString()', () => {
    it('is a function', () => {
      expect(sut.toString).to.be.a('function');
    });
  });

  describe('.getDates()', () => {
    it('is a function', () => {
      expect(sut.getDates).to.be.a('function');
    });
  });

  describe('.getOffset()', () => {
    it('is a function', () => {
      expect(sut.getOffset).to.be.a('function');
    });
  });

  describe('.getDateStrings()', () => {
    it('is a function', () => {
      expect(sut.getDateStrings).to.be.a('function');
    });
  });
});
