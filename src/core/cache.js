/**
 * Eenvoudige in-memory cache.
 * @type {Map<string, { value: any, timestamp: number }>}
 */
const cache = new Map();

/**
 * Callback type voor een async fetch functie.
 * @callback FetchFn
 * @returns {Promise<any>}
 */

/**
 * Cached wrapper voor async fetch functies.
 * @param {string} key - Unieke cache key
 * @param {number} ttlMs - Time-to-live in milliseconden
 * @param {FetchFn} fetchFn - Async functie die data ophaalt
 * @returns {Promise<any>} - Cached of nieuwe data
 */
export async function cached(key, ttlMs, fetchFn) {
  const now = Date.now();
  const entry = cache.get(key);

  if (entry && now - entry.timestamp < ttlMs) {
    return entry.value;
  }

  const value = await fetchFn();
  cache.set(key, { value, timestamp: now });
  return value;
}

