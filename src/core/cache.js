const cache = new Map();

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
