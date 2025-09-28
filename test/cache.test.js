import { cached } from "../src/core/cache.js";

describe("cache util", () => {
  test("caches result and returns same value on repeated calls", async () => {
    let count = 0;
    const fetchFn = async () => {
      count += 1;
      return { data: "hello" };
    };

    const key = "test-key";
    const ttl = 1000; // 1 second

    const first = await cached(key, ttl, fetchFn);
    const second = await cached(key, ttl, fetchFn);
    expect(first).toEqual({ data: "hello" });
    expect(second).toEqual({ data: "hello" });
    expect(count).toBe(1);  // fetchFn should run only once
  });

  test("expires cache after ttl", async () => {
    let count = 0;
    const fetchFn = async () => {
      count += 1;
      return { value: count };
    };

    const key = "expire-test";
    const ttl = 10; // very short

    const a = await cached(key, ttl, fetchFn);
    // wait more than ttl
    await new Promise(r => setTimeout(r, ttl + 20));
    const b = await cached(key, ttl, fetchFn);

    expect(a).not.toEqual(b);
    expect(count).toBe(2);
  });
});
