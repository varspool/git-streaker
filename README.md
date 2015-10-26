# git-streaker

> A revisionist approach to git history.

git-streaker gives you a flexible way to rewrite commit dates and times in git repositories.
It's a glorified `--env-filter` for `git filter-branch`,
one that lets you specify a sequence of dates to use for the rewritten commits.

First, you generate a schedule with `git streaker schedule`, then you rewrite the dates on your
commits according to the schedule with `git streaker filter <schedule-file>`.

## Installing

```sh
npm install -g git-streaker
```

git-streaker is a CLI-only tool. You'll need git installed and available on the `$PATH` to use it.
Git allows you to invoke `git-streaker` as `git streaker` if you prefer.

## Getting Started

### Overview

* Run `git streaker schedule schedule.json --type=...` to create a schedule file.
* Run `git streaker filter -ac schedule.json` to rewrite the dates on all commits in the current branch
  * Or `git streaker filter -ac schedule.json -- --all` to rewrite all branches

### Command Line Interface

Get usage information with `--help`, both for `git streaker` itself, and the subcommands.
All usages of this tool follow this pattern:

```sh
git streaker <subcommand> [options] <schedule-file> [-- filter-branch-options...]
```

You provide a subcommand as the first option.
And with any of the subcommands, you also specify the relative path to a 'schedule' file.

## Commands

### Schedule

`schedule` generates a schedule file according to parameters you supply.

* There's a few required things to pass:
  * The path you want your schedule file to be written at, and
  * A schedule `--type` (see Current Schedule Types below), and
  * A commit `--count`
    * You can guess at the required `--count` for a repo with `git rev-list <ref> --count`
    * We don't do refparsing, or ask git any details about the commits being filtered, for simplicity.
      So, we need a hint here. (TODO?)
* Depending on the `--type` of schedule, you may be required to pass other options like `--start` or `--end`

#### Current Schedule Types

* `streak`, which requires a `--start=<date>`, and from there produces a single commit-time, once a day
  * You can optionally use `--hour=6,7,15-23` to vary the generated time
* `interval`, which requires a `--start=<date>`, and from there just adds an interval of seconds between commits
  * You can optionally use `--interval=300-600` and other range specifications to choose a random interval
  * The default interval is one second

You can use `--jitter` to randomize the minute and second values with any of these schedules.

#### Usage

```sh
Usage: git streaker schedule --type=<type> [options] <schedule-out-file>

Options:
  --verbose, -v  Output more information (provide multiple times for more noise)
                                                                         [count]
  -f, --force    Allow overwriting the destination file
                                                      [boolean] [default: false]
  --type, -t     The type of schedule to generate [required] [choices: "streak"]
  --count, -c    The number of commits to generate                [default: 100]
  --hour         Restrict generated times to these hours                [string]
  --jitter, -j   Randomly generate minute and second information
                                                       [boolean] [default: true]
  --start        A date string describing when to begin the scheduled dates
                                                                        [string]
  --help         Show help                                             [boolean]
```

### Filter

`filter` runs a filter-branch operation on the current git repo (relative to working directory).

* There's two required things to pass: the path to your schedule file, and `-ac`
* If you pass the `--author, -a` option, the author date with be overwritten
* If you pass the `--committer, -c` option, the committer date will be overwritten
* You can pass both, but you must pass one or the other

#### Useful `filter-branch` options

You can pass any number of command line flags directly to `git filter-branch` by specifying them
after `--` when using `filter`.

A particularly useful option is `--original`,
which sets the namespace your refs will be backed up to before the filter operation takes place.
It defaults to 'refs/original'.
`git filter-branch` will refuse to run if there's already a backup set of refs,
so it's a good idea to specify a different value of this flag each time you want to run the filter in succession.
(For example you might use `git streaker filter -a blah.json -- --original refs/streak/blah`).

(You could also just use the `--force` flag, but that's much less safe!)

#### Usage

```sh
Usage: git streaker filter [--author] [--committer] [options] <schedule-file> [-- filter-branch-options...]

Options:
  --verbose, -v    Output more information (provide multiple times for more noise)  [count]
  --yes, -y        Do not ask for confirmation before running filter-branch  [boolean] [default: false]
  --author, -a     Reset author details  [boolean] [default: false]
  --committer, -c  Reset committer details  [boolean] [default: false]
  --help           Show help  [boolean]
```

## Schedule File Format

A schedule is simply a JSON file with a list of date strings. It looks like this:

```json
{
  "schedule": [
    "1997-07-16T19:00:00+01:00",
    "1997-07-17T19:00:00+01:00",
    "1997-07-18T19:00:00+01:00"
  ]
}
```

The format is "anything `new Date("dateString")` understands".
Dates are consumed one by one from this file for commit dates,
in the order that `git filter-branch` walks the commit range you give it.
