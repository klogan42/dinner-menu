import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { PlannerContent } from "@/components/planner-content";
import { LandingPage } from "@/components/landing-page";

async function checkAccess(userId: string) {
  const db = (await clientPromise).db();
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!user) return false;
  const status = user.subscriptionStatus as string | undefined;
  if (status === "active" || status === "free") return true;
  const trialEnd = user.trialEndsAt as Date | undefined;
  return !!trialEnd && trialEnd > new Date();
}

export default async function Page() {
  const session = await auth();
  if (!session) return <LandingPage />;

  const hasAccess = await checkAccess(session.user.id);
  if (!hasAccess) redirect("/subscribe");

  return <PlannerContent />;
}
