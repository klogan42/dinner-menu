import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { clientPromise } from "@/lib/mongodb";
import { requireUserId } from "@/lib/session";
import { ObjectId } from "mongodb";

export async function POST() {
  const auth = await requireUserId();
  if (auth.error) return auth.error;

  try {
    const db = (await clientPromise).db();
    const user = await db.collection("users").findOne({ _id: new ObjectId(auth.userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reuse or create Stripe customer
    let customerId = user.stripeCustomerId as string | undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email as string,
        name: (user.name as string) ?? undefined,
        metadata: { userId: auth.userId },
      });
      customerId = customer.id;
      await db.collection("users").updateOne(
        { _id: new ObjectId(auth.userId) },
        { $set: { stripeCustomerId: customerId } }
      );
    }

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${appUrl}/subscribe?paid=1`,
      cancel_url: `${appUrl}/subscribe`,
      metadata: { userId: auth.userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
