/**
 * Simple in-memory sliding-window rate limiter.
 * Uses a Map keyed by `${key}:${ip}` → array of timestamps.
 *
 * Usage:
 *   const limiter = createRateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000 });
 *   const result = limiter.check(ip);
 *   if (!result.allowed) return NextResponse.json(..., { status: 429 });
 */

const stores = new Map();

export function createRateLimiter({ maxRequests, windowMs, key = "default" }) {
  if (!stores.has(key)) {
    stores.set(key, new Map());
  }
  const store = stores.get(key);

  return {
    check(ip) {
      const now = Date.now();
      const windowStart = now - windowMs;
      const storeKey = `${key}:${ip}`;

      // Get existing timestamps, filter out expired ones
      const timestamps = (store.get(storeKey) || []).filter((t) => t > windowStart);

      if (timestamps.length >= maxRequests) {
        // Calculate when the oldest request expires
        const resetAt = timestamps[0] + windowMs;
        store.set(storeKey, timestamps);
        return {
          allowed: false,
          remaining: 0,
          resetAt,
          retryAfter: Math.ceil((resetAt - now) / 1000),
        };
      }

      timestamps.push(now);
      store.set(storeKey, timestamps);
      return { allowed: true, remaining: maxRequests - timestamps.length };
    },
  };
}

/**
 * Helper to extract IP from a Next.js Request.
 */
export function getIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Pre-built limiters used across routes
export const loginLimiter = createRateLimiter({
  key: "login",
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 5 attempts / 15 min
});

export const validateCodeLimiter = createRateLimiter({
  key: "validate_code",
  maxRequests: 10,
  windowMs: 60 * 1000, // 10 attempts / 1 min
});
