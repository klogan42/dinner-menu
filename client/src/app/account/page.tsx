"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { theme } from "@/lib/styles";

export default function AccountPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSaveName = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    await update();
    setSaving(false);
    setSaved(true);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all your data. This cannot be undone.")) return;
    if (!confirm("Really delete everything? All recipes, meal history, and restaurants will be gone forever.")) return;
    setDeleting(true);
    await fetch("/api/account", { method: "DELETE" });
    signOut({ callbackUrl: "/" });
  };

  const trialEnd = session?.user?.trialEndsAt
    ? new Date(session.user.trialEndsAt)
    : null;
  const status = session?.user?.subscriptionStatus;
  const statusLabel =
    status === "active" ? "Lifetime Access" :
    status === "free" ? "Free Access" :
    trialEnd ? `Trial ends ${trialEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` :
    "Unknown";

  return (
    <div className="max-w-md mx-auto">
      <h1 className={`${theme.heading} mb-6`}>Account</h1>

      <div className={`${theme.card} p-5 mb-4`}>
        <div className="mb-4">
          <label className="text-sm font-display text-amber-700 block mb-1">Email</label>
          <div className="font-display text-amber-900">{session?.user?.email}</div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-display text-amber-700 block mb-1">Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setSaved(false); }}
              className={`flex-1 ${theme.input} border px-3 py-2 text-sm`}
            />
            <Button
              onClick={handleSaveName}
              disabled={saving || !name.trim()}
              className={`${theme.buttonPrimary} min-h-[44px]`}
            >
              {saving ? "..." : "Save"}
            </Button>
          </div>
          {saved && <p className="text-xs font-display text-green-600 mt-1">Saved</p>}
        </div>

        <div>
          <label className="text-sm font-display text-amber-700 block mb-1">Plan</label>
          <div className="font-display text-amber-900">{statusLabel}</div>
        </div>
      </div>

      <div className={`${theme.card} p-5`}>
        <h2 className="font-display text-amber-900 mb-2">Danger Zone</h2>
        <p className="text-sm font-display text-amber-700/60 mb-3">
          Permanently delete your account and all data.
        </p>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="font-display min-h-[44px]"
        >
          {deleting ? "Deleting..." : "Delete Account"}
        </Button>
      </div>
    </div>
  );
}
