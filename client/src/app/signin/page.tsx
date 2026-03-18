import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInPage } from "@/components/sign-in-page";

export default async function SignInRoute() {
  const session = await auth();
  if (session) redirect("/");
  return <SignInPage />;
}
