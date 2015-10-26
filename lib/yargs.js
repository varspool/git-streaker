import Yargs from 'yargs';
import pkg from './../package.json';

function commonOptions(yargs) {
  yargs
    .options({
      'verbose': {
        type: 'count',
        alias: 'v',
        describe: 'Output more information (provide multiple times for more noise)',
      },
    });

  return yargs;
}

let argv = Yargs
  .strict()
  .usage(`Version: ${pkg.version}\nUsage: git streaker <subcommand> [options] <sequence-file> [-- filter-branch-options...]`)
  .help('help')
  .command('filter', 'Apply filtering to the specified branch', (yargs) => {
    argv = commonOptions(yargs)
      .usage(`Usage: git streaker filter [--author] [--committer] [options] <sequence-file> [-- filter-branch-options...]`)
      .options({
        'yes': {
          alias: 'y',
          type: 'boolean',
          describe: 'Do not ask for confirmation before running filter-branch',
          default: false,
          requiresArg: false,
          nargs: 0,
        },
        'author': {
          alias: 'a',
          type: 'boolean',
          default: false,
          describe: 'Reset author details',
        },
        'committer': {
          alias: 'c',
          type: 'boolean',
          default: false,
          describe: 'Reset committer details',
        },
      })
      .help('help')
      .argv;
  })
  .command('schedule', 'Create a schedule file', (yargs) => {
    argv = commonOptions(yargs)
      .usage(`Usage: git streaker schedule --type=<type> [options] <schedule-out-file>`)
      .options({
        'f': {
          alias: 'force',
          type: 'boolean',
          describe: 'Allow overwriting the destination file',
          default: false,
          requiresArg: false,
          nargs: 0,
        },
        'type': {
          alias: 't',
          choices: ['streak'],
          describe: 'The type of schedule to generate',
          required: true,
          requiresArg: true,
        },
        'count': {
          alias: 'c',
          type: 'number',
          describe: 'The number of commits to generate',
          required: true,
          requiresArg: true,
          nargs: 1,
          default: 1000,
        },
        'hour': {
          type: 'string',
          required: false,
          describe: 'Restrict generated times to these hours',
          requiresArg: true,
        },
        'jitter': {
          alias: 'j',
          type: 'boolean',
          describe: 'Randomly generate minute and second information',
          required: false,
          default: true,
        },
        'start': {
          alias: 's',
          required: false,
          type: 'string',
          requiresArg: true,
          describe: 'A date string describing when to begin the scheduled dates',
          nargs: 1,
        },
      })
      .help('help')
      .argv;
  })
  .command('_seq', '  (Internal) Provides a filter script to be used during a filter-branch invocation', (yargs) => {
    argv = commonOptions(yargs)
      .usage(`Usage: git streaker filter [--author] [--committer] [options] <sequence-file> [-- filter-branch-options...]`)
      .options({
        'author': {
          alias: 'a',
          type: 'boolean',
          default: false,
          describe: 'Reset author details',
        },
        'committer': {
          alias: 'c',
          type: 'boolean',
          default: false,
          describe: 'Reset committer details',
        },
      })
      .help('help')
      .argv;
  })
  .argv;

export default argv;
