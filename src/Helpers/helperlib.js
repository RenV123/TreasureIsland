/**
 * A function that generates a random number between a range.
 * @param {number} min The minimum range of the random nr.
 * @param {number} max The maximum range of the random nr.
 */
function getRandomNr(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export { getRandomNr };
