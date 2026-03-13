import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PASSCODE = process.env.APP_PASSCODE || "12345678";

function makeToken(passcode: string) {
  return crypto
    .createHmac("sha256", process.env.API_SECRET_KEY || "fallback-secret")
    .update(passcode)
    .digest("hex");
}

// POST /api/auth — verify passcode
export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    if (!passcode || passcode !== PASSCODE) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }
    const token = makeToken(passcode);
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/auth?token=xxx — verify token is valid
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const validToken = makeToken(PASSCODE);
  if (token === validToken) {
    return NextResponse.json({ valid: true });
  }
  return NextResponse.json({ valid: false }, { status: 401 });
}
