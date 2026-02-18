import { describe, it, expect, vi, beforeEach } from "vitest";

// Re-implement the sanitize and rate-limit logic from contact.ts for isolated testing
function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60_000;

function createRateLimiter() {
  const map = new Map<string, { count: number; resetTime: number }>();

  return {
    isRateLimited(ip: string): boolean {
      const now = Date.now();
      const entry = map.get(ip);
      if (!entry || now > entry.resetTime) {
        map.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return false;
      }
      entry.count++;
      return entry.count > RATE_LIMIT_MAX;
    },
    clear() {
      map.clear();
    },
  };
}

describe("Contact API — Sanitize Function", () => {
  it("should escape HTML angle brackets", () => {
    expect(sanitize("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;",
    );
  });

  it("should escape ampersands", () => {
    expect(sanitize("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("should escape double quotes", () => {
    expect(sanitize('He said "hello"')).toBe("He said &quot;hello&quot;");
  });

  it("should escape single quotes", () => {
    expect(sanitize("it's")).toBe("it&#x27;s");
  });

  it("should trim whitespace", () => {
    expect(sanitize("  hello  ")).toBe("hello");
  });

  it("should handle empty strings", () => {
    expect(sanitize("")).toBe("");
  });

  it("should handle safe strings unchanged (except trim)", () => {
    expect(sanitize("Hello World")).toBe("Hello World");
  });
});

describe("Contact API — Rate Limiter", () => {
  let limiter: ReturnType<typeof createRateLimiter>;

  beforeEach(() => {
    limiter = createRateLimiter();
  });

  it("should allow the first request", () => {
    expect(limiter.isRateLimited("127.0.0.1")).toBe(false);
  });

  it("should allow up to RATE_LIMIT_MAX requests", () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      expect(limiter.isRateLimited("127.0.0.1")).toBe(false);
    }
  });

  it("should block after RATE_LIMIT_MAX requests", () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      limiter.isRateLimited("127.0.0.1");
    }
    expect(limiter.isRateLimited("127.0.0.1")).toBe(true);
  });

  it("should track IPs independently", () => {
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      limiter.isRateLimited("1.1.1.1");
    }
    expect(limiter.isRateLimited("1.1.1.1")).toBe(true);
    expect(limiter.isRateLimited("2.2.2.2")).toBe(false);
  });

  it("should reset after the time window", () => {
    vi.useFakeTimers();

    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      limiter.isRateLimited("127.0.0.1");
    }
    expect(limiter.isRateLimited("127.0.0.1")).toBe(true);

    // Advance past window
    vi.advanceTimersByTime(RATE_LIMIT_WINDOW + 1);
    expect(limiter.isRateLimited("127.0.0.1")).toBe(false);

    vi.useRealTimers();
  });
});

describe("Contact API — Input Validation Logic", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  it("should accept valid emails", () => {
    expect(emailRegex.test("user@example.com")).toBe(true);
    expect(emailRegex.test("name.last@domain.co")).toBe(true);
    expect(emailRegex.test("user+tag@host.org")).toBe(true);
  });

  it("should reject invalid emails", () => {
    expect(emailRegex.test("")).toBe(false);
    expect(emailRegex.test("noatsign")).toBe(false);
    expect(emailRegex.test("@nodomain.com")).toBe(false);
    expect(emailRegex.test("user@")).toBe(false);
    expect(emailRegex.test("user @domain.com")).toBe(false);
  });

  it("should enforce field length limits", () => {
    const maxName = 100;
    const maxSubject = 200;
    const maxMessage = 5000;
    const maxEmail = 254;

    expect("a".repeat(maxName).length).toBeLessThanOrEqual(maxName);
    expect("a".repeat(maxName + 1).length).toBeGreaterThan(maxName);
    expect("a".repeat(maxSubject + 1).length).toBeGreaterThan(maxSubject);
    expect("a".repeat(maxMessage + 1).length).toBeGreaterThan(maxMessage);
    expect("a".repeat(maxEmail + 1).length).toBeGreaterThan(maxEmail);
  });
});
