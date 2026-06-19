import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb, SESSION_COOKIE } from "@/lib/admin";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: THIRTY_DAYS,
  };
}

// Set the session cookie after a client-side magic-code sign-in.
// The client posts its InstantDB refresh token; we verify it with the admin
// token before trusting it, then store it in an httpOnly cookie.
export async function POST(req: Request) {
  const { refreshToken } = await req.json().catch(() => ({}));
  if (!refreshToken) {
    return NextResponse.json({ error: "missing refreshToken" }, { status: 400 });
  }
  if (!adminDb) {
    // No admin token configured — skip server verification but still set the
    // cookie so the rest of the app behaves consistently in local dev.
    const res = NextResponse.json({ ok: true, verified: false });
    res.cookies.set(SESSION_COOKIE, refreshToken, cookieOptions());
    return res;
  }
  try {
    const user = await adminDb.auth.verifyToken(refreshToken);
    if (!user) throw new Error("invalid token");
    const res = NextResponse.json({ ok: true, verified: true, user });
    res.cookies.set(SESSION_COOKIE, refreshToken, cookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }
}

// Report the current server-side session (verified from the cookie).
export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token || !adminDb) return NextResponse.json({ user: null });
  try {
    const user = await adminDb.auth.verifyToken(token);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}

// Clear the session cookie on sign-out.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
