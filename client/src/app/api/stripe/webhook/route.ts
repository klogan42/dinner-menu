import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = (await clientPromise).db();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const customerId = session.customer as string | null;

    if (!userId) {
      console.error("Webhook: checkout.session.completed missing userId in metadata");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Verify the user exists and their stripeCustomerId matches
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.error("Webhook: user not found:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (customerId && user.stripeCustomerId && user.stripeCustomerId !== customerId) {
      console.error("Webhook: stripeCustomerId mismatch for user:", userId);
      return NextResponse.json({ error: "Customer mismatch" }, { status: 400 });
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { subscriptionStatus: "active" } }
    );
  }

  return NextResponse.json({ received: true });
}
