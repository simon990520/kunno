import { LRUCache } from 'lru-cache';

export function rateLimit({ interval, uniqueTokenPerInterval = 500 }) {
  const tokenCache = new LRUCache({
    max: uniqueTokenPerInterval,
    ttl: interval
  });

  return {
    check: async (headers, limit, token) => {
      const tokenCount = (tokenCache.get(token) || [0])[0];
      
      if (!tokenCount) {
        tokenCache.set(token, [1]);
        return Promise.resolve();
      }
      
      if (tokenCount === limit) {
        const retryAfter = Math.floor(interval / 1000);
        throw new Error(
          `Rate limit exceeded. Retry after ${retryAfter} seconds`
        );
      }

      tokenCache.set(token, [tokenCount + 1]);
      return Promise.resolve();
    }
  };
}
