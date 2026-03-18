import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";

// POST /api/admin/grant-free — grant free lifetime access by email
// Protected by API_SECRET_KEY header
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-api-key");
  if (authHeader !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const db = (await clientPromise).db();
    const result = await db.collection("users").updateOne(
      { email: email.toLowerCase() },
      { $set: { subscriptionStatus: "free" } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, email: email.toLowerCase() });
  } catch (err) {
    console.error("Grant free error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
