import { auth } from "@/lib/auth";
import { PlannerContent } from "@/components/planner-content";
import { SignInPage } from "@/components/sign-in-page";

export default async function Page() {
  const session = await auth();
  if (session) return <PlannerContent />;
  return <SignInPage />;
}
