import crypto from "crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "mia_admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

// In-memory brute force tracker (persists across requests during server runtime)
interface AttemptRecord {
  count: number;
  lockedUntil?: number;
}
const attemptsMap = new Map<string, AttemptRecord>();

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "mia_default_session_secret_change_in_production_2026"
  );
}

/** Check if an IP address is currently locked out */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSec?: number;
} {
  const record = attemptsMap.get(ip);
  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSec = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSec };
  }

  if (record.lockedUntil && record.lockedUntil <= now) {
    // Lockout expired, reset
    attemptsMap.delete(ip);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.count),
  };
}

/** Record a failed login attempt */
export function recordFailedAttempt(ip: string): {
  isLocked: boolean;
  remainingAttempts: number;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const record = attemptsMap.get(ip) || { count: 0 };
  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    attemptsMap.set(ip, record);
    return { isLocked: true, remainingAttempts: 0, retryAfterSec: Math.ceil(LOCKOUT_MS / 1000) };
  }

  attemptsMap.set(ip, record);
  return {
    isLocked: false,
    remainingAttempts: MAX_ATTEMPTS - record.count,
  };
}

/** Clear rate limit on successful login */
export function clearRateLimit(ip: string): void {
  attemptsMap.delete(ip);
}

/** Timing-safe string comparison to protect against timing attacks */
function safeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Constant time dummy compare
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Verify password and 2FA security PIN strictly against server environment variables */
export function verifyAdminCredentials(password: string, pin: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const expectedPin = process.env.ADMIN_SECURITY_PIN;

  if (!expectedPassword || !expectedPin) {
    console.error("[admin-auth] ADMIN_PASSWORD or ADMIN_SECURITY_PIN is not configured in .env.local.");
    return false;
  }

  const passOk = safeEqual(password, expectedPassword);
  const pinOk = safeEqual(pin, expectedPin);

  return passOk && pinOk;
}

/** Generate a cryptographically signed session token */
export function generateSessionToken(): string {
  const now = Date.now();
  const secret = getSecret();
  const random = crypto.randomBytes(16).toString("hex");
  const data = `${now}.${random}`;
  const hmac = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return `${data}.${hmac}`;
}

/** Validate a session token string */
export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [timeStr, random, receivedHmac] = parts;
  const time = Number(timeStr);
  if (isNaN(time)) return false;

  const now = Date.now();
  if (now - time > SESSION_DURATION_MS) {
    return false; // Expired
  }

  const secret = getSecret();
  const data = `${timeStr}.${random}`;
  const expectedHmac = crypto.createHmac("sha256", secret).update(data).digest("hex");

  return safeEqual(receivedHmac, expectedHmac);
}

/** Set HTTP-only secure session cookie */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  });
}

/** Clear session cookie on logout */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Check if current request has a valid admin session cookie */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}
