import {randomBytes} from 'crypto';

/**
 * @returns {number} float, [0...1]
 */
export function random() {
  const bytes = 4;
  const rand = parseInt(randomBytes(bytes).toString('hex'), 16);
  return rand / Math.pow(2, bytes * 8);
}

/**
 * @param min Included in range
 * @param max Included in range
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

/**
 * @param array.<*>
 * @returns {*}
 */
export function randomValue(array) {
  return array[randomInt(0, array.length - 1)];
}

export default {
  random: random,
  randomInt: randomInt,
  randomValue: randomValue,
};
