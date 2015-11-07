import Schedule from './../../dist/schedule/schedule';
import _outfile from './../util/outfile';
import fs from 'fs';
import path from 'path';

const outfile = _outfile.bind(undefined, 'schedule');

describe('class Schedule', () => {
  describe('static methods', () => {
    describe('.fromString(string)', () => {
      it('is a static method', () => {
        expect(Schedule.fromString).to.be.a('function');
      });

      it('produces a schedule object from a string', () => {
        const schedule = Schedule.fromString('{"schedule": [ 0, 100000, 100000000 ]}');
        expect(schedule).to.be.a('object').and.instanceof(Schedule);
      });

      it('throws and error on invalid schedules', () => {
        expect(() => {
          Schedule.fromString('{"schedule": null}');
        }).to.throw();
      });
    });

    describe('.fromFile(path)', () => {
      it('is a static method', () => {
        expect(Schedule.fromFile).to.be.a('function');
      });

      it('produces a schedule object from a file', () => {
        const file = outfile('fromFile');
        fs.writeFileSync(file, '{"schedule": [ 0, 100000, 100000000 ]}', 'utf-8');
        return expect(Schedule.fromFile(file)).to.eventually.be.a('object').and.instanceof(Schedule);
      });
    });

    describe('.find(relativePath)', () => {
      it('is a static method', () => {
        expect(Schedule.find).to.be.a('function');
      });

      it('finds schedule files at a relative path from the cwd', () => {
        const expected = path.normalize(path.join(__dirname, './../fixture/schedule.json'));
        expect(Schedule.find('dist-test/fixture/schedule.json')).to.be.eql(expected);
      });

      it('takes a search path', () => {
        const expected = path.normalize(path.join(__dirname, './../fixture/schedule.json'));
        expect(Schedule.find('./schedule.json', './dist-test/fixture')).to.be.eql(expected);
      });
    });
  });

  describe('methods', () => {
    describe('.toString()', () => {
      it('is a function', () => {
        const sut = new Schedule([new Date()]);
        expect(sut.toString).to.be.a('function');
      });

      it('returns a JSON string', () => {
        const sut = new Schedule([new Date()]);
        const string = sut.toString();
        expect(string, 'toString of simple schedule').to.be.a('string');
        expect(JSON.parse(string), 'parsed string').to.be.a('object').and.to.have.ownProperty('schedule');
      });
    });

    describe('.toFile()', () => {
      it('rejects when given an invalid path', () => {
        const sut = new Schedule([new Date()]);
        return expect(sut.toFile(null, true)).to.be.rejected;
      });

      it('force-writes a schedule to a file', () => {
        const sut = new Schedule([new Date()]);
        const out = outfile('toFile');
        return expect(sut.toFile(out, true)).to.be.fulfilled;
      });
    });

    describe('.getDates()', () => {
      const dates = [new Date()];
      const sut = new Schedule(dates);

      it('is a function', () => {
        expect(sut.getDates).to.be.a('function');
      });

      it('returns the dates', () => {
        expect(sut.getDates()).to.eql(dates);
      });
    });

    describe('.getOffset()', () => {
      const date = new Date();
      const sut = new Schedule([date, date, null, null, date]);

      it('is a function', () => {
        expect(sut.getOffset).to.be.a('function');
      });

      it('returns a date at an offset', () => {
        expect(sut.getOffset(1)).to.equal(date);
      });
    });

    describe('.getDateStrings()', () => {
      const sut = new Schedule([new Date('2015-01-01T01:01:01Z')]);

      it('is a function', () => {
        expect(sut.getDateStrings).to.be.a('function');
      });

      it('returns the dates as strings', () => {
        const dates = sut.getDateStrings();
        expect(dates).to.be.an.instanceof(Array);
        expect(dates[0]).to.be.a('string').and.equal('Thu Jan 01 2015 01:01:01 GMT+0000 (UTC)');
      });
    });
  });
});
