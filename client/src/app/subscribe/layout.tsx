import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function SubscribeLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/signin");

  // Check DB directly — JWT may be stale after promo code or payment
  const db = (await clientPromise).db();
  const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });
  const status = user?.subscriptionStatus as string | undefined;
  const trialEnd = user?.trialEndsAt as Date | undefined;
  const hasAccess = status === "active" || status === "free" || (!!trialEnd && trialEnd > new Date());

  if (hasAccess) redirect("/");

  return <>{children}</>;
}
