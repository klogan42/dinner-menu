// Simple in-memory rate limiter. Not distributed — works per serverless instance.
// Good enough for a small app to stop basic brute force.

const hits = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of hits) {
    if (val.resetAt < now) hits.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Returns true if the request should be blocked.
 * @param key - unique identifier (e.g. IP + route)
 * @param limit - max requests allowed in the window
 * @param windowMs - time window in milliseconds
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > limit;
}
