/**
 * random.js — Randomisation utilities
 */

/**
 * Pick a random element from an array.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle an array in-place using Fisher-Yates.
 * @template T
 * @param {T[]} arr
 * @returns {T[]} the same array, shuffled
 */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Distribute items into N buckets as evenly as possible,
 * with each bucket getting at least `minPerBucket` items if available.
 *
 * @param {any[]} items - items to distribute
 * @param {number} n - number of buckets
 * @param {number} [minPerBucket=3] - minimum items per bucket
 * @returns {any[][]}
 */
export function distribute(items, n, minPerBucket = 3) {
  if (items.length === 0) return Array.from({ length: n }, () => []);

  const shuffled = shuffle([...items]);
  const buckets = Array.from({ length: n }, () => []);

  shuffled.forEach((item, i) => {
    buckets[i % n].push(item);
  });

  return buckets;
}
