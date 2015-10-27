import commandFilter from './command/filter';
import commandSequence from './command/sequence';
import commandSchedule from './command/schedule';

export default {
  schedule: commandSchedule,
  filter: commandFilter,
  _seq: commandSequence,
};
