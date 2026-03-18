import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { requireUserId } from "@/lib/session";
import { ObjectId } from "mongodb";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const auth = await requireUserId();
  if (auth.error) return auth.error;

  if (isRateLimited(`promo:${auth.userId}`, 10, 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Promo code required" }, { status: 400 });
    }

    const normalized = code.toUpperCase().trim();
    const db = (await clientPromise).db();

    // Look up code, check it exists and hasn't exceeded max uses
    const promo = await db.collection("promocodes").findOne({ code: normalized });
    if (!promo) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
    }

    const usedBy = (promo.usedBy as string[]) ?? [];
    if (usedBy.includes(auth.userId)) {
      return NextResponse.json({ error: "You already used this code" }, { status: 400 });
    }
    if (promo.maxUses && usedBy.length >= (promo.maxUses as number)) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
    }

    // Grant free access and record usage
    await db.collection("users").updateOne(
      { _id: new ObjectId(auth.userId) },
      { $set: { subscriptionStatus: "free", promoCode: normalized } }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.collection("promocodes").updateOne(
      { code: normalized },
      { $push: { usedBy: auth.userId } } as any
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Promo code error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
