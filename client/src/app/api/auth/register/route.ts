import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { clientPromise } from "@/lib/mongodb";
import { seedNewUser } from "@/lib/seed-user";
import { isRateLimited } from "@/lib/rate-limit";

// POST /api/auth/register — create a new email/password account
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`register:${ip}`, 5, 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const db = (await clientPromise).db();
    const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);
    const trialEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const result = await db.collection("users").insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name?.trim() || email.split("@")[0],
      emailVerified: null,
      createdAt: new Date(),
      trialEndsAt,
      subscriptionStatus: "trialing",
    });

    await seedNewUser(db, result.insertedId.toString());

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/auth/register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
