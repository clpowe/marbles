// Basic in-memory rate limiter
// In production, consider using Redis or another distributed storage for rate limiting

interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

// Store IP addresses and their request counts
const ipLimiter = new Map<string, RateLimitRecord>();

// Constants for rate limiting
const MAX_ATTEMPTS = 5; // Maximum number of attempts
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Check if the IP is rate limited
 * @param ip The IP address to check
 * @returns true if the request should be blocked, false otherwise
 */
export function isRateLimited(ip: string): boolean {
  // Clean up expired records
  cleanupExpiredRecords();

  // Get current time
  const now = Date.now();

  // Get or create record for this IP
  const record = ipLimiter.get(ip) || { count: 0, firstAttempt: now };

  // If IP is blocked, check if block has expired
  if (record.blockedUntil && record.blockedUntil > now) {
    return true; // Still blocked
  }

  // If window has expired, reset the record
  if (now - record.firstAttempt > WINDOW_MS) {
    record.count = 1;
    record.firstAttempt = now;
    record.blockedUntil = undefined;
  } else {
    // Increment the count
    record.count += 1;

    // Block if too many attempts
    if (record.count > MAX_ATTEMPTS) {
      record.blockedUntil = now + BLOCK_DURATION_MS;
      return true;
    }
  }

  // Update the record
  ipLimiter.set(ip, record);
  return false;
}

/**
 * Reset rate limit for an IP address (e.g., after successful login)
 * @param ip The IP address to reset
 */
export function resetRateLimit(ip: string): void {
  ipLimiter.delete(ip);
}

/**
 * Helper function to clean up expired records
 */
function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [ip, record] of ipLimiter.entries()) {
    if (
      (record.blockedUntil && record.blockedUntil < now) ||
      now - record.firstAttempt > WINDOW_MS
    ) {
      ipLimiter.delete(ip);
    }
  }
}
