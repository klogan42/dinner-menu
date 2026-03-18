import { auth } from "@/lib/auth";
import { PlannerContent } from "@/components/planner-content";
import { LandingPage } from "@/components/landing-page";

export default async function Page() {
  const session = await auth();
  if (session) return <PlannerContent />;
  return <LandingPage />;
}
