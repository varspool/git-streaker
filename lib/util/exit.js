import {Log} from './log';

export default (code) => {
  Log.out.end('\n');
  process.exit(code);
};
