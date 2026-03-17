import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

type AuthOk = { userId: string; error?: undefined };
type AuthErr = { userId?: undefined; error: NextResponse };

export async function requireUserId(): Promise<AuthOk | AuthErr> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { userId: session.user.id };
}
