"use client";

import { signIn } from "next-auth/react";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-amber-900">
          <UtensilsCrossed className="size-8" />
          <h1 className="text-3xl font-bold">Dinner Table</h1>
        </div>
        <p className="text-amber-700">Sign in to plan your family dinners</p>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
