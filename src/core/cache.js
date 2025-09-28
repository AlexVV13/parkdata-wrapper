/**
 * Eenvoudige in-memory cache.
 * @type {Map<string, { value: any, timestamp: number }>}
 */
const cache = new Map();

/**
 * Cached wrapper voor async fetch functies.
 * @template T
 * @param {string} key - Unieke cache key
 * @param {number} ttlMs - Time-to-live in milliseconden
 * @param {() => Promise<T>} fetchFn - Async functie die data ophaalt
 * @returns {Promise<T>} - Cached of nieuwe data
 */
export async function cached(key, ttlMs, fetchFn) {
  const now = Date.now();
  const entry = cache.get(key);

  if (entry && (now - entry.timestamp) < ttlMs) {
    return entry.value;
  }

  const value = await fetchFn();
  cache.set(key, { value, timestamp: now });
  return value;
}

