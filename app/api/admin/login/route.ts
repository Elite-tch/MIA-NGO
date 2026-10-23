import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  verifyAdminCredentials,
  generateSessionToken,
  setAdminSessionCookie,
} from "../../../lib/admin-auth";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // 1. Check brute force rate limit
    const limitCheck = checkRateLimit(ip);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. This portal is locked for security. Please try again in ${Math.ceil(
            (limitCheck.retryAfterSec || 60) / 60
          )} minutes.`,
          locked: true,
          retryAfterSec: limitCheck.retryAfterSec,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { password = "", pin = "" } = body;

    if (!password || !pin) {
      return NextResponse.json(
        { error: "Both Admin Passphrase and 6-Digit Security PIN are required." },
        { status: 400 }
      );
    }

    // 2. Timing-safe verification on server
    const isMatch = verifyAdminCredentials(String(password).trim(), String(pin).trim());

    if (!isMatch) {
      const failRecord = recordFailedAttempt(ip);
      if (failRecord.isLocked) {
        return NextResponse.json(
          {
            error: `Maximum login attempts exceeded. Portal locked for 15 minutes.`,
            locked: true,
            retryAfterSec: failRecord.retryAfterSec,
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        {
          error: `Invalid passphrase or security PIN. ${failRecord.remainingAttempts} attempt(s) remaining before security lockout.`,
          remainingAttempts: failRecord.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 3. Clear failed attempts & issue signed session cookie
    clearRateLimit(ip);
    const token = generateSessionToken();
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
    });
  } catch (error) {
    console.error("[admin-login] error:", error);
    return NextResponse.json(
      { error: "Authentication system error. Please try again." },
      { status: 500 }
    );
  }
}
