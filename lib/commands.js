import commandFilter from 'app/command/filter';
import commandSequence from 'app/command/sequence';
import commandSchedule from 'app/command/schedule';

export default {
  schedule: commandSchedule,
  filter: commandFilter,
  _seq: commandSequence,
};
