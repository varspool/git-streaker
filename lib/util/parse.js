import log from './log';

/**
 * @param {string|number} input
 * @param {*} def
 * @returns {Date|*}
 * @private
 */
export function date(input, def = null) {
  if (!input) {
    return def;
  }

  const dateInstance = new Date(input);

  if (isNaN(dateInstance.getTime())) {
    return def;
  }

  return dateInstance;
}

export function integer(input) {
  let int = input;

  if (typeof int === 'number') {
    int = Math.floor(int);
  } else if (typeof int === 'string') {
    int = parseInt(int.trim(), 10);
  } else {
    return null;
  }

  if (Number.isNaN(int) || !Number.isFinite(int)) {
    return null;
  }

  if (!Number.isSafeInteger(int)) {
    return null;
  }

  return int;
}

function _dateBounds(type) {
  switch (type) {
    case 'hour':
      return [0, 23];
    case 'second':
    case 'minute':
      return [0, 59]; // Treat leap seconds as 59, 59, 00 (yeah, right /s)
    default:
      throw new Error('Invalid date component type');
  }
}

export function dateComponent(string, type = 'hour') {
  const int = integer(string);

  if (int === null) {
    return null;
  }

  let min;
  let max;

  try {
    [min, max] = _dateBounds(type);
  } catch (err) {
    return null;
  }

  return Math.max(min, Math.min(max, int));
}

export function range(input, type = null) {
  const collected = [];

  if (!input) {
    return [];
  }

  const _parse = part => {
    const parsed = !!type ? dateComponent(part, type) : integer(part);

    if (parsed === null) {
      log.warning(`Did not understand part in range <${type}>: ${part}`);
    }

    return parsed;
  };

  const _push = parsed => {
    if (parsed !== null) {
      return collected.push(parsed);
    }
  };

  if (typeof input === 'string') {
    input.split(',').forEach(component => {
      const parts = component.split('-');

      if (parts.length === 2) {
        const start = _parse(parts[0]);
        const end = _parse(parts[1]);

        if (start !== null && end !== null && start <= end) {
          for (let i = start; i <= end; i++) {
            _push(i);
          }
        } else {
          log.warning(`Did not understand range <${type}>: ${component}`, {start: parts[0], end: parts[1]});
        }
      } else if (parts.length === 1) {
        _push(_parse(parts[0]));
      } else {
        log.warning(`Did not understand range <${type}>: ${component} has more than two parts`);
      }
    });
  } else {
    _push(_parse(input));
  }

  return collected;
}

export default {
  integer: integer,
  date: date,
  dateComponent: dateComponent,
  range: range,
};
