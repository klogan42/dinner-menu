import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function hasAccess(userId: string) {
  const db = (await clientPromise).db();
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  const status = user?.subscriptionStatus as string | undefined;
  if (status === "active" || status === "free") return true;
  const trialEnd = user?.trialEndsAt as Date | undefined;
  return !!trialEnd && trialEnd > new Date();
}

export default async function SubscribeLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/signin");

  // If user already has access, send them home
  if (await hasAccess(session.user.id)) redirect("/");

  return <>{children}</>;
}
